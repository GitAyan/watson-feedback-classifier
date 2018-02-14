## Watson Feedback Classifier

## Part 1

* When user enters sample text, then the user input is sent to server's custom microservice with a `POST` request having `"content-type":"application/json"` as Headers.
* The custom microservice written in NodeJS-Express takes the data from POST request and using it makes API call to `"Watson NLU API"`, which processes the data and returns the response to custom microservice.
* The custom microservice extract's data from API call's response and sends it back in response to the POST request made earlier.
* The response (JSON) from POST request is parsed to show the relevant categories for the user input.
    
## Part 2 
  
* This Watson Feedback Classifier will categorize the feedback emails and respond to each email according to its importance using the Watson Natural Language Understanding API (NLU).
* Here the input given by user is sent to watson NLU and a classifier algorithm is applied on to the response which sets the score of the feedback, based on which the mail is sent to the user if score is neutral or negative.

## Running Locally
Run the following commands on your system `cmd/gitbash` to setup this project locally and running it.
  
     1.git clone "<paste_this_repo_url_here>"
     2.cd watson-feedback-classifier/microservices/ui/app
     3.npm install
     4.npm start
  
Hooray!:tada: The app is running. Now edit the files as you like  and see the changes in browser.
 
