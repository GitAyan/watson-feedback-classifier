
## Part 1

## Frontend features/tasks
* Allow a user to enter a text that can be analysed using the custom Watson integration and displays the results of the identified category along with score.
Handle any obvious errors.

## Working of app
* User submits username and password on login screen and gets access to watson screen.
* When user enters sample question (url or plain text), Watson API processes the request and displays appropriate           categories and score in percentage.
* The server endpoint needs two inputs: username and question. Question entered can be in any format like text or URL.      Entered question is checked for text or URL using regex. 
* A POST request with content type as application/json is made to custom microservice  (Watson Natural 
* Understanding API) written in Node -JS-Express.
* Output obtained from backend (JSON response) is parsed to show category and score in %.


## Following front end validations are checked:
### First Screen : (only for registered users)
* If username and password fields are empty.
* If username and password entered are valid.
### Watson Screen :
* If sample question field is empty
* If there exists a network error
* If invalid sample question.


## Part 2 

## Watson Feedback Classifier
* This Watson Feedback Classifier will categorize the feedback emails and respond to each email according to its importance using the Watson Natural Language Understanding API (NLU).

## Working of app

* When the user submits a feedback, it is sent to an endpoint of the backend server written in NodeJs-Express. The server extracts the feedback message and using the Watson NLU API, checks different sentiments, labels and categories of the input text. An algorithm using all the above information decides whether it's a negative or a positive feedback email.
* Email is sent to the user with appropriate response as ---

* Neutral 10 --Thank you for choosing this product. Sorry if any inconvenience is caused. We have emailed you. Please       feel free to contact customer support.
* Positive 20 -- Thank you for choosing this product. We will be happy to serve you again!
* Negative 30 -- We are extremely sorry  for the inconvenience caused. We have emailed you. Our customer support will get   back to you shortly.

## Following front end validations are checked:
### First Screen : (only for registered users)
* If username and password fields are empty.
* If username and password entered are valid.
### Watson Screen :
* If feedback field is empty
* If there exists a network error



## Clone Repository and Running on device/emulator

*  git clone https://github.com/priyarg/ProjectWatson.git
*  cd ProjectWatson
*  npm install (to install project dependencies)
*  open expoXde,click on open existing project and search Watson
*  start React Native packager and open on Device connected


## Expo link : https://exp.host/@priyarg/watson 
* To run expo link download expo on device. click above link and send expo link to your device or scan using expo app.

## Apk link : 
* Download apk on device.  Open the link on device.

## Github link : https://github.com/priyarg/ProjectWatson



