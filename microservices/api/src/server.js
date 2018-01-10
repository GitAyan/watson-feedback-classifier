//https://api.flub75.hasura-app.io
//http://localhost:8080
/*

{
	"username":"sam",
	"type":"url",
	"string":"www.google.co.in"
}


*/
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
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  "username": "5e36b468-e888-470c-808f-2e46d8f4c30d",
  "password": "musFNjTDKWhC",
  'version_date': '2017-02-27'
});

var Array=null;
var finalresponse={
  "usage": {
    "text_units": 1,
    "text_characters": 1430,
    "features": 1
  },
  "retrieved_url": "https://www.ibm.com/us-en/",
  "language": "en",
  "categories": [
    {
      "score": 0.889723,
      "label": "/travel/tourist destinations/united kingdom"
    },
    {
      "score": 0.500328,
      "label": "/art and entertainment"
    },
    {
      "score": 0.387755,
      "label": "/technology and computing/internet technology/social network"
    }
  ]
};
//Display '/' with homepage
app.get('/',function(req,res){
  res.status(200).send("IBM Watson nodeJS.");
});


app.get('/callapiteam23',function(req,res){
    res.setHeader('Content-Type','text/html');
    res.status(200).send("<h1>Please use /getarray endpoint henceforth.</h1><br><hr>"+ JSON.stringify(Array));
});


app.get('/ibm/demo',function(req,res){
  res.setHeader('Content-Type','application/json');
  res.status(200).end(JSON.stringify(finalresponse));
});

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
    'Authorization': 'Bearer ab1d6baca337c40d6775e8cc2fd7352cb1c1ec637820b6ab'
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
          'Authorization': 'Bearer ab1d6baca337c40d6775e8cc2fd7352cb1c1ec637820b6ab'
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
}else if(admintoken=='ayanboi' && Array!=null){
  var bodyString = JSON.stringify(jsonso);
  var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ab1d6baca337c40d6775e8cc2fd7352cb1c1ec637820b6ab'
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
  res.status(400).send("Bad Request! Either /callpiteam23 or invalid token.");
}


});

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
    if((type=='url'||type=='text')){
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
                  'features': {
                    'categories': {}
                  }
                }
              parameters.url=string;
            }else if(type=='text'){
              var parameters={
                  'text': '',
                  'features': {
                    'categories': {}
                  }
                }
              parameters.text=string;
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
                  'features': {
                    'categories': {}
                  }
                }
              parameters.url=string;
            }else if(type=='text'){
              var parameters={
                  'text': '',
                  'features': {
                    'categories': {}
                  }
                }
              parameters.text=string;
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
    res.end('Incorrect request type Headers');
  }
  }//end of else of if(username===undefined|| ...)
});


var port = 8080;
app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
