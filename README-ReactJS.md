
## Part 1

## Frontend features/tasks
* Allow a user to enter a text that can be analysed using the custom Watson integration and displays the results of the identified category along with score.
Handle any obvious errors.

## Working of app

* When user enters sample question (url or plain text), Watson API processes the request and displays appropriate           categories and score in percentage.
* The server endpoint needs two inputs: username and question. Question entered can be in any format like text or URL.      Entered question is checked for text or URL using regex. 
* A POST request with content type as application/json is made to custom microservice  (Watson Natural 
* Understanding API) written in Node -JS-Express.
* Output obtained from backend (JSON response) is parsed to show category.




## Part 2 (Todo)

## Watson Feedback Classifier
* This Watson Feedback Classifier will categorize the feedback emails and respond to each email according to its importance using the Watson Natural Language Understanding API (NLU).

## Working of app

* When the user submits a feedback, it is sent to an endpoint of the backend server written in NodeJs-Express. The server extracts the feedback message and using the Watson NLU API, checks different sentiments, labels and categories of the input text. An algorithm using all the above information decides whether it's a negative or a positive feedback email.
* Email is sent to the user with appropriate response as ---

* Neutral 10 --Thank you for choosing this product. Sorry if any inconvenience is caused. We have emailed you. Please       feel free to contact customer support.
* Positive 20 -- Thank you for choosing this product. We will be happy to serve you again!
* Negative 30 -- We are extremely sorry  for the inconvenience caused. We have emailed you. Our customer support will get   back to you shortly.






