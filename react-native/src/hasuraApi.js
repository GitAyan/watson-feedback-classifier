const clusterName = "flub75"
const dataUrl = "https://api." + clusterName + ".hasura-app.io/input"; 
const datasendEmailUrl = "https://api." + clusterName + ".hasura-app.io/sendemail"
const dataUserUrl = "https://api." + clusterName + ".hasura-app.io/login";


import { Alert } from 'react-native';


const networkErrorObj = {
    status: 503
}

export async function tryLogin(username, password) {
    console.log('Making login query');
    let requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    };

    let body = {
        "username": username,
        "password": password
    };

    requestOptions["body"] = JSON.stringify(body);

    console.log("Auth Response ---------------------");

    try {
        let resp = await fetch(dataUserUrl, requestOptions);
        console.log(resp);
        return resp;
    }
    catch (e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
    }
}


export async function tryAsk(sampleQuestion, username) { 
    
    //check input is text or url
    function isUrl(s) {
        var regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        return regexp.test(s);
    }

    let requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    };

    let someQuestion = sampleQuestion;

    let body = {
        "username": " ",
        "type": " ",
        "string": " "
    }

    //checks the input is url or text and set the body type accordingly.
    body.string = someQuestion;
    body.username = username;
    if (isUrl(sampleQuestion)) {
        body.type = "url";
    }
    else {
        body.type = "text";
    }

    requestOptions["body"] = JSON.stringify(body);
    console.log("Auth Response ---------------------");

    try {
        //POST code
        let resp = await fetch(dataUrl, requestOptions);
        console.log(resp);
        return resp;
    }
    catch (e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
    }
};

export async function sendEmail(sampleQuestion, username, email, score, user_id) {
    
    let requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        }
    };

    let body = {
        "username": username,
        "user_id": user_id,
        "emailid": email,
        "feedbacktext": sampleQuestion,
        "score": score
    }

   
    console.log("feedbacktext ---------------------" + sampleQuestion);
    console.log("emailid ---------------------" + email);
    console.log("score ---------------------" + score);
    console.log("username ---------------------" + username);
    console.log("user_id ---------------------" + user_id);
    requestOptions["body"] = JSON.stringify(body);
    console.log("Auth Response ---------------------");

    try {
        //POST code
        let resp = await fetch(datasendEmailUrl, requestOptions);
        console.log(resp);
        return resp;
    }
    catch (e) {
        console.log("Request Failed: " + e);
        return networkErrorObj;
    }
};


