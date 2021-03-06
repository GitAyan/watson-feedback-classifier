var express = require('express');
var morgan = require('morgan');
var path = require('path');
var http=require('http');
var https=require('https');
var app = express();
var request = require('request');
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());

//For Watson Integration
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  "username": process.env.WAPI_USERNAME,
  "password": process.env.WAPI_PASSWORD,
  'version_date': '2017-02-27'
});

/*
For Data updatation, You can create a user using AUTH API in the console and update
  permissions of all tables to be modified by that user. AUTH1 is the Logged in User's token.
*/
var AUTH1='Bearer '+process.env.AUTH_TOKEN;

//For Admin Token to send Emails
var AUTH2='Bearer '+process.env.AUTH_ADMIN_TOKEN;

//Global Array to hold information of users in Sample Table
var SampleArray=null;

//data.clustername.hasura-app.io/.... url
var dataurl="https://data."+process.env.CLUSTER_NAME+".hasura-app.io/v1/query";

//notify.clustername.hasura-app.io/.... url
var notifyurl="https://notify."+process.env.CLUSTER_NAME+".hasura-app.io/v1/send/email";

//Global Counters to hold the count of incoming +ve/-ve feedback
var posFeedBack=0, negFeedBack=0;

//Home
app.get('/',function(req,res){
  res.status(200).send("IBM Watson nodeJS.");
});

//Get +/- Count for Feedback
app.get('/getcounts',function(req,res){
  var jsonso={
    "positive":"",
    "negative":""
  };
  jsonso.positive=posFeedBack;
  jsonso.negative=negFeedBack;
  res.setHeader('Content-Type','application/json');
  res.status(200).end(JSON.stringify(jsonso));
});

//Endpoint for Gathering Negative feedback using DATA API
app.get('/getneg',function(req,res){
  var bodyString = JSON.stringify({
    "type": "select",
    "args": {
        "table": "feedback",
        "columns": [
            "*"
        ]
    }
});
var headers = {
    'Content-Type': 'application/json',
    'Authorization': AUTH1
};
var options = {
    url: "",
    method: 'POST',
    headers: headers,
    body: bodyString
}
options.url=dataurl;
var r= request(options, function (error, response, body) {
  if(!error && response.statusCode == 200){
    res.setHeader("Content-Type","application/json");
    res.status(200).send(body);
    r.abort();
  }
  else{
    if(response===undefined||response===null){
      res.status(500).end('Some error ocurred connecting to Hasura: '+error);
      r.abort();
    }
    else{
    res.end('some error ocurred: '+error+' statusCode:', response.statusCode);
    r.abort();
  }
  }
});
});

//Login Endpoint
app.post('/login',function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var pos;
  if(SampleArray!=null){
    pos=null;
    username=username.toString().toLowerCase();
    password=password.toString();
    for(var item in SampleArray){
      console.log();
      if(SampleArray[item].user_name==username && SampleArray[item].password==password){
        console.log("Found: "+username);
        pos=item;
        break;
      }
    }
    if(pos==null){
      res.status(400).end("Credentials Incorrect.");
    }else{
      var jsonso={
        "user_id":"",
        "email_id":"",
        "user_name":""
      };
      jsonso.user_id=SampleArray[pos].user_id;
      jsonso.email_id=SampleArray[pos].email_id;
      jsonso.user_name=SampleArray[pos].user_name;
      res.setHeader("Content-Type","application/json");
      res.status(200).end(JSON.stringify(jsonso));
    }
  }else{ //SampleArray!=Null If case ends
    var bodyString = JSON.stringify({
        "type": "select",
        "args": {
            "table": "sample",
            "columns": [
                "*"
            ]
        }
    });
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': AUTH1
    };

    var options = {
        url: "",
        method: 'POST',
        headers: headers,
        body: bodyString
    }
    options.url=dataurl;
    var r= request(options, function (error, response, body) {
      if(!error && response.statusCode == 200){
        SampleArray=JSON.parse(body);
        //console.log(SampleArray);
        pos=null;
        for(var item in SampleArray){
          //console.log();
          if(SampleArray[item].user_name==username && SampleArray[item].password==password){
            console.log("Found: "+username);
            pos=item;
            break;
          }
        }
        if(pos==null){
          res.status(400).end("Credentials Incorrect.");
        }else{
          var jsonso={
            "user_id":"",
            "email_id":"",
            "user_name":""
          };
          jsonso.user_id=SampleArray[pos].user_id;
          jsonso.email_id=SampleArray[pos].email_id;
          jsonso.user_name=SampleArray[pos].user_name;
          res.setHeader("Content-Type","application/json");
          res.status(200).end(JSON.stringify(jsonso));
        }
      }
      else{
        if(response===undefined||response===null){
          res.status(500).end('Some error ocurred connecting to Hasura (Sample Array): '+error);
          r.abort();
        }
        else{
        res.end('some error ocurred (Sample Array): '+error+' statusCode:', response.statusCode);
        r.abort();
      }
      }
    });
  }
});

//Second endpoint to send an email according to score and update feedback table for -ve responses
app.post('/sendemail',function(req,res){
  var username=req.body.username;
  var user_id=req.body.user_id;
  var emailid=req.body.emailid;
  var feedbacktext=req.body.feedbacktext;
  var score=req.body.score;
  console.log(feedbacktext+"=="+score);
/*
  Body Of Request:
{
    "username": "<enter-username>",
    "user_id": "<enter-user-id>",
    "emailid": "<some-email>@<domain-name>.com",
    "feedbacktext":"<some-feedback>",
    "score":"<refer-front-end-for-score>"
}
*/
var updateTable=function(callback){
  var status2=undefined;
  if(score==20){
    posFeedBack++;
    status2=200;
    callback(status2);
  }
  else{
     //Change Body String for Insert in Feedback Table.
    negFeedBack++;
    var jsonso={
    "type": "insert",
    "args": {
        "table": "feedback",
        "objects": [
            {
                "priority": "",
                "user_id": "",
                "feedback_text": ""
            }
        ]
      }
    };
    jsonso.args.objects[0].feedback_text=feedbacktext;
    jsonso.args.objects[0].user_id=user_id;
    if(score==30)
    jsonso.args.objects[0].priority="high";
    else {
      jsonso.args.objects[0].priority="low";
    }
    var bodyString = JSON.stringify(jsonso);
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': AUTH1
    };
    var options = {
        url: "",
        method: 'POST',
        headers: headers,
        body: bodyString
    }
    options.url=dataurl;
    var r= request(options, function (error, response, body) {
      if(!error && response.statusCode == 200){
        console.log(body);
        status2=200;
        callback(status2);
        r.abort();
      }
      else{
        if(response===undefined||response===null){
          status2=500;
          r.abort();
        }
        else{
        status2=500;
        r.abort();
      }
      }
    });
  }
}

var sendEmail=function(status2){
  if(status2!=200){
    res.setHeader("Content-Type","text/html");
    res.end("Couldn't update feedback: Error Data API");
  }
  else{
    var htmlTemplate="";
    if(score==10){
        htmlTemplate="<div style='width:100%;'><header style='padding:1em;color:orange;background-color:rgb(246,250,250);clear:left;text-align:center;'><h1>Example Organization</h1></header><divstyle='color:#333355'><article><h1><center>Thank you for your feedback, "+username+"</center></h1><br><p><center>Thank You for choosing this product/service. We're sorry if any inconvenience was caused. Our Customer Support has been informed of your situation.</center></p></article></div><footer style='padding:1em;color:orange;background-color:rgb(246,250,250);clear:left;text-align:center;'>Copyright&copy;Example Organization</footer></div>";
    }else if(score==20){
        htmlTemplate="<div style='width:100%;'><header style='padding:1em;color:orange;background-color:rgb(246,250,250);clear:left;text-align:center;'><h1>Example Organization</h1></header><divstyle='color:#333355'><article><h1><center>Thank you for your feedback, "+username+"</center></h1><br><p><center>Thank You for choosing this product/service. We will be happy to serve you again! We hope you will continue to use our services in the future! </center></p></article></div><footer style='padding:1em;color:orange;background-color:rgb(246,250,250);clear:left;text-align:center;'>Copyright&copy;Example Organization</footer></div>";
    }else if(score==30){
        htmlTemplate="<div style='width:100%;'><header style='padding:1em;color:orange;background-color:rgb(246,250,250);clear:left;text-align:center;'><h1>Example Organization</h1></header><divstyle='color:#333355'><article><h1><center>Thank you for your feedback, "+username+"</center></h1><br><p><center>We are extremely sorry for the inconvenience caused. We have emailed our Customer Support. They will get back to you shortly.</center></p></article></div><footer style='padding:1em;color:orange;background-color:rgb(246,250,250);clear:left;text-align:center;'>Copyright&copy;Example Organization</footer></div>";
    }
    var jsonbody={
        "to": "",
        "from": "example@organization.com",
        "fromName": "Example",
        "sub": "Feedback Response for Example Organization",
        "text": "Feedback Response for Example Organization",
        "html": ""
      };

    jsonbody.to=emailid;
    jsonbody.html=htmlTemplate;
    var bodyString = JSON.stringify(jsonbody);
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': AUTH2,
        'X-Hasura-User-Id': '1',
        'X-Hasura-User-Role' :'admin'
    };

    var options = {
        url: "",
        method: 'POST',
        headers: headers,
        body: bodyString
    }
    options.url=notifyurl;
    var r= request(options, function (error, response, body) {
      if(!error && response.statusCode == 200){
        console.log(body);
        res.status(200).end(body);
        r.abort();
      }
      else{
        if(response===undefined||response===null){
          res.status(500).end('Some error ocurred connecting to Hasura\'s Notify: '+error);
          r.abort();
        }
        else{
        res.status(500).end('some error ocurred sending an email: '+error+' statusCode:', response.statusCode);
        r.abort();
      }
      }
    });
    console.log("\n*****\nSent email to:\n"+emailid+"\n*****\n");
  }
}
updateTable(sendEmail);
});

app.post('/input',function(req,res){
  if(SampleArray==null){
    res.status(400).end("Not Logged In.");
  }else{
    var username=req.body.username;
    var type=req.body.type;
    var string=req.body.string;
    if(username===undefined || type===undefined || string===undefined){
      res.status(400).end("Bad Request. Check Body Parameters carefully.");
    }else{
      username=username.toString().toLowerCase();
      type=type.toString();
      string=string.toString();
      if((type=='url'||type=='text'||type=='html')){
        var pos=null;
        for(var item in SampleArray){
          console.log(item);
          if(SampleArray[item].user_name==username){
            pos=item;
            console.log(SampleArray[item].user_name);
            if(type=='url'){
                var parameters={
                    'url': '',
                    'language':'en',
                    'features': {
                      'entities': {
                        'emotion': true,
                        'sentiment': true,
                        'limit': 10
                      },
                      'keywords': {
                        'emotion': true,
                        'sentiment': true,
                        'limit': 10
                      },
                      'categories': {}
                    }
                  }
                parameters.url=string;
              }else if(type=='text'){
                var parameters={
                    'text': '',
                    'language':'en',
                    'features': {
                      'entities': {
                        'emotion': true,
                        'sentiment': true,
                        'limit': 10
                      },
                      'keywords': {
                        'emotion': true,
                        'sentiment': true,
                        'limit': 10
                      },
                      'categories': {}
                    }
                  }
                parameters.text=string;
              }else if(type=='html'){
                var parameters={
                    'html': '',
                    'language':'en',
                    'features': {
                      'entities': {
                        'emotion': true,
                        'sentiment': true,
                        'limit': 10
                      },
                      'keywords': {
                        'emotion': true,
                        'sentiment': true,
                        'limit': 10
                      },
                      'categories': {}
                    }
                  }
                parameters.html=string;
              }
              natural_language_understanding.analyze(parameters, function(err, resp) {
                    if (err)
                      res.status(500).end('Connection to Watson error: '+err);
                    else
                      console.log(JSON.stringify(resp, null, 2));
                      console.log("\n><><><><><><><><\n");
                      res.setHeader('Content-Type','application/json');
                      res.end(JSON.stringify(resp, null, 2));
              });
          }//if ==username

        }//for loop ends
        if(pos==null){
        console.log("Invalid Credentials.\n");
        res.status(400).end("Something went wrong. Invalid Credentials. Please check Body of request.");
        }
    }//end of if(type==..)
    else{
      res.status(400).end('Incorrect Request Body.');
    }
    }//end of else of if(username===undefined|| ...)
  }//end of else of if(SampleArray==null)
  });

  //Demo Response for Front-End
  var finalresponse={
    
    "usage": {
      "text_units": 1,
      "text_characters": 50,
      "features": 3
    },
    "language": "en",
    "keywords": [
      {
        "text": "wrong color",
        "sentiment": {
          "score": -0.67618,
          "label": "negative"
        },
        "relevance": 0.998457,
        "emotion": {
          "sadness": 0.594096,
          "joy": 0.010469,
          "fear": 0.215117,
          "disgust": 0.132705,
          "anger": 0.222564
        }
      },
      {
        "text": "shoes",
        "sentiment": {
          "score": -0.852465,
          "label": "negative"
        },
        "relevance": 0.887692,
        "emotion": {
          "sadness": 0.632704,
          "joy": 0.009755,
          "fear": 0.225905,
          "disgust": 0.292258,
          "anger": 0.188651
        }
      }
    ],
    "entities": [],
    "categories": [
      {
        "score": 0.707193,
        "label": "/style and fashion/footwear/shoes"
      },
      {
        "score": 0.692858,
        "label": "/art and entertainment/visual art and design/design"
      },
      {
        "score": 0.0591286,
        "label": "/business and industrial"
      }
    ]
  };

  //Demo URL For /input endpoint for front end devs to try
  app.post('/ibm/demo/post',function(req,res){
    var username=req.body.username;
    var type=req.body.type;
    var string=req.body.string;
    if(username===undefined || type===undefined || string===undefined){
      res.status(400).end("Bad Request. Check Body Parameters carefully.");
    }else{
      username=username.toString().toLowerCase();
      type=type.toString();
      string=string.toString();
      if((type=='url'||type=='text')){
        res.setHeader('Content-Type','application/json');
        res.status(200).end(JSON.stringify(finalresponse));
      }else{
        res.status(400).end("Bad Request. Check Body Parameters carefully. Especially Type.");
      }
    }
  });

  var port = 8080;
  app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
  });


/*
--------------------------------------------------------------------------------------------------------------
---------------------Task 3 Part 1------Deprecated Code-------------------------------------------------------
--------------------------------------------------------------------------------------------------------------

var Array=null; //To hold Counts and user info

-----------------------------Input Endpoint to display Categories and other info.----------------------
app.post('/input',function(req,res){
  var username=req.body.username;
  var type=req.body.type;
  var string=req.body.string;
  if(username===undefined || type===undefined || string===undefined){
    res.status(400).end("Bad Request. Check Body Parameters carefully.")
  }else{
    username=username.toString().toLowerCase();
    type=type.toString();
    string=string.toString();
    if((type=='url'||type=='text'||type=='html')){
    if(Array==null){
    console.log("Array was null.");
    //check function starts
    function check(username,str){
      var pos=null;
      console.log("Inside Check"+Array+username+str);
      for(var item in Array){
        console.log(item);
        if(Array[item].user_hash==username){
          pos=item;
          console.log(Array[item].user_hash);
          if(Array[item].counts<=30) {
            console.log(Array[item].counts);
            if(type=='url'){
              var parameters={
                  'url': '',
                  'language':'en',
                  'features': {
                    'entities': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'keywords': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'categories': {}
                  }
                }
              parameters.url=string;
            }else if(type=='text'){
              var parameters={
                  'text': '',
                  'language':'en',
                  'features': {
                    'entities': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'keywords': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'categories': {}
                  }
                }
              parameters.text=string;
            }else if(type=='html'){
              var parameters={
                  'html': '',
                  'language':'en',
                  'features': {
                    'entities': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'keywords': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'categories': {}
                  }
                }
              parameters.html=string;
            }
            natural_language_understanding.analyze(parameters, function(err, resp) {
                  if (err)
                    {res.end('error: '+err);
                     return; }
                  else
                    console.log(JSON.stringify(resp, null, 2));
                    console.log("\n><><><><><><><><\n");
                    console.log(JSON.stringify({'counts':++Array[pos].counts,'info':JSON.stringify(resp, null, 2)}));
                    res.setHeader('Content-Type','application/json');
                    res.end(JSON.stringify(resp, null, 2));
                    if(Array[pos].counts%2==0 && Array[pos].counts!=0){
                      var url='https://api.flub75.hasura-app.io/updatearray/'+username+'/'+Array[pos].counts+'/update';
                      https.get(url,function(response,param1,param2) {
                      console.log('/updatearray:> '+response);
                      });
                    }
                    return;
            });
          }else{
            console.log("Exceeded maxCount for Watson API calls! Count: "+ Array[item].counts);
            res.setHeader('Content-Type','text/plain');
            res.status(200).end("Exceeded maxCount for Watson API calls! Count: "+ Array[item].counts);
            return;
          }
        }
        //else continue;
      }//for loop ends
      if(pos==null){
      console.log("Invalid Credentials."+Array);
      res.status(500).end("Something went wrong. Invalid Credentials. Please check Body of request."+Array);
      return;
      }
    } // check ends
      var x=function(callback,param1,param2){
      https.get('https://api.flub75.hasura-app.io/getarray',function(response,param1,param2) {
      console.log('/getarray:> ');
      console.log("Inside x"+Array);
      if(Array!=null){
        console.log("insideget");
        return callback(username,'select');
      }
      });
      if(Array!=null){
        console.log("outsideget");
        return callback(username,'select');
      }
      }
      x(check,username,'select');
    } //if (Array==null)
    else{
      console.log("Array was not null."+Array);
      var pos=null;
      for(var item in Array){
        console.log(item);
        if(Array[item].user_hash==username){
          pos=item;
          console.log(Array[item].user_hash);
          if(Array[item].counts<=30) {
            console.log(Array[item].counts);
            if(type=='url'){
              var parameters={
                  'url': '',
                  'language':'en',
                  'features': {
                    'entities': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'keywords': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'categories': {}
                  }
                }
              parameters.url=string;
            }else if(type=='text'){
              var parameters={
                  'text': '',
                  'language':'en',
                  'features': {
                    'entities': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'keywords': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'categories': {}
                  }
                }
              parameters.text=string;
            }else if(type=='html'){
              var parameters={
                  'html': '',
                  'language':'en',
                  'features': {
                    'entities': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'keywords': {
                      'emotion': true,
                      'sentiment': true,
                      'limit': 10
                    },
                    'categories': {}
                  }
                }
              parameters.html=string;
            }
            natural_language_understanding.analyze(parameters, function(err, resp) {
                  if (err)
                    res.end('error: '+err);
                  else
                    console.log(JSON.stringify(resp, null, 2));
                    console.log("\n><><><><><><><><\n");
                    console.log(JSON.stringify({'counts':++Array[pos].counts,'info':JSON.stringify(resp, null, 2)}));
                    res.setHeader('Content-Type','application/json');
                    res.end(JSON.stringify(resp, null, 2));
                    if(Array[pos].counts%2==0 && Array[pos].counts!=0){
                      var url='https://api.flub75.hasura-app.io/updatearray/'+username+'/'+Array[pos].counts+'/update';
                      https.get(url,function(response,param1,param2) {
                      console.log('/updatearray:> '+response);
                      });
                    }
                    return;
            });
          }else{
            console.log("Exceeded maxCount for Watson API calls! Count: "+ Array[item].counts);
            res.setHeader('Content-Type','text/plain');
            res.status(200).end("Exceeded maxCount for Watson API calls! Count: "+ Array[item].counts);
            return;
          }
        }//if ==username
        //else continue;
      }//for loop ends
      if(pos==null){
      console.log("Invalid Credentials."+Array);
      res.status(400).end("Something went wrong. Invalid Credentials. Please check Body of request."+Array);
      }
    }//else of Array==null
  }//end of if(type==..)
  else{
    res.status(400).end('Incorrect request type Headers');
  }
  }//end of else of if(username===undefined|| ...)
});




------------------To Update Counts of Users------------------

app.get('/updatearray/:username/:counts/:admintoken',function(req,res){
  var username=req.params.username;
  var counts=req.params.counts;
  var admintoken=req.params.admintoken;
  var jsonso={
    "type": "update",
    "args": {
        "table": "users",
        "where": {
            "user_hash": {
                "$eq": ""
            }
        },
        "$set": {
            "counts": ""
        }
    }
};
jsonso.args.where.user_hash.$eq=username;
jsonso.args.$set.counts=counts;

if(admintoken=='update' && Array!=null){
for(var item in Array){
  console.log(item);
  if(Array[item].user_hash==username){
    if(Array[item].counts==counts){
      var bodyString = JSON.stringify(jsonso);
      var headers = {
          'Content-Type': 'application/json',
          'Authorization': AUTH1
      };
      var options = {
          url: 'https://data.flub75.hasura-app.io/v1/query',
          method: 'POST',
          headers: headers,
          body: bodyString
      }

      var r= request(options, function (error, response, body) {
        if(!error && response.statusCode == 200){
          console.log(body);
          res.status(200).send("Updated "+username+"\'s count to "+counts);
          r.abort();
        }
        else{
          if(response===undefined||response===null){
            res.status(500).end('Some error ocurred connecting to Hasura: '+error);
            r.abort();
          }
          else{
          res.end('some error ocurred: '+error+' statusCode:', response.statusCode);
          r.abort();
          }
        }
      });

    }else{
      res.status(200).end("Bad Counts Request");
    }
  }else{
    res.status(200).end("Bad Username Request");
  }
  }
}else if(admintoken==process.env.ADMIN_TOKEN && Array!=null){
  var bodyString = JSON.stringify(jsonso);
  var headers = {
      'Content-Type': 'application/json',
      'Authorization': AUTH1
  };
  var options = {
      url: 'https://data.flub75.hasura-app.io/v1/query',
      method: 'POST',
      headers: headers,
      body: bodyString
  }

  var r= request(options, function (error, response, body) {
    if(!error && response.statusCode == 200){
      console.log(body);
      res.status(200).send("Updated "+username+"\'s count to "+counts);
      r.abort();
    }
    else{
      if(response===undefined||response===null){
        res.status(500).end('Some error ocurred connecting to Hasura: '+error);
        r.abort();
      }
      else{
      res.end('some error ocurred: '+error+' statusCode:', response.statusCode);
      r.abort();
    }
    }
  });

  for(var item in Array){
    if(Array[item].user_hash==username){
      Array[item].counts=counts;
    }
  }

}else{
  res.status(400).send("Bad Request! Either /getarray or invalid token.");
}
});



-------------------------------To get Array of Counts of Users--------------------

app.get('/getarray',function(req,res){
  if(Array!=null){
    res.status(200).send(JSON.stringify(Array));
  }
  else{
  var bodyString = JSON.stringify({
    "type": "select",
    "args": {
        "table": "users",
        "columns": [
            "*"
        ]
    }
});
var headers = {
    'Content-Type': 'application/json',
    'Authorization': AUTH1
};

var options = {
    url: 'https://data.flub75.hasura-app.io/v1/query',
    method: 'POST',
    headers: headers,
    body: bodyString
}

var r= request(options, function (error, response, body) {
  if(!error && response.statusCode == 200){
    Array=JSON.parse(body);
    console.log(Array);
    res.status(200).send(JSON.stringify(Array));
    r.abort();
  }
  else{
    if(response===undefined||response===null){
      res.status(500).end('Some error ocurred connecting to Hasura: '+error);
      r.abort();
    }
    else{
    res.end('some error ocurred: '+error+' statusCode:', response.statusCode);
    r.abort();
  }
  }
});
}
});
*/
