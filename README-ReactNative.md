
## Part 1

## Frontend features/tasks
* Allow a user to enter a text that can be analysed using the custom Watson integration and displays the results of the identified category along with other details you can choose in a tabular form.
Handle any obvious errors.

## Working of app
* User submits username on login screen and gets access to watson screen.
* When user enters sample question (url or plain text), Watson API processes the request and displays appropriate           categories and score in percentage.
* The server endpoint needs two inputs: username and question. Question entered can be in any        format like text or URL. Entered question is checked for text or URL using regex. 
* A POST request with content type as application/json is made to custom microservice  (Watson Natural 
* Understanding API) written in Node -JS-Express.
* Output obtained from backend (JSON response) is parsed to show category and score in %.


## Following front end validations are checked:
### Login Screen :
* If username is empty.
* If username entered is valid.
### Watson Screen :
* If sample question field is empty
* If there exists a network error
* If invalid sample question.


## Clone Repository and Running on device/emulator

*  git clone https://github.com/priyarg/Watson.git
*  cd Watson
*  npm install (to install project dependencies)
*  open expoXde,click on open existing project and search Watson
*  start React Native packager and open on Device connected


## Expo link : https://exp.host/@priyarg/imadapprna
* To run expo link download expo on device. click above link and send expo link to your device or scan using expo app.

## Apk link : https://drive.google.com/file/d/1D6DpyUeDVZF9mDfIrMMRpIgpWoCo6fXx/view?usp=sharing
* Download apk on device.  Open the link on device.


## Part 2 (To do)

## Watson Feedback Classifier
* This Watson Feedback Classifier will categorize the feedback emails and respond to each email according to its importance using the Watson Natural Language Understanding API (NLU).

## Working of app

* When the user with its email ID sends a feedback, it is sent to an endpoint of the backend server written in NodeJs-Express. The server extracts the feedback message and using the Watson NLU API, checks different sentiments, labels and categories of the input text. An algorithm using all the above information deduces whether it's a negative or a positive feedback email.

## Following front end validations are checked:
### First Screen :
* If username and email fields are empty.
* If username and email entered are valid.
### Watson Screen :
* If feedback field is empty
* If there exists a network error
* If entered feedback is not inappropriate.
