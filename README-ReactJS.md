
## Part 1

## Frontend features/tasks
* Allow a user to enter a text that can be analysed using the custom Watson integration and displays the results of the identified category along with score.
Handle any obvious errors.

## Working of app

* When user enters sample text, then the user input is sent to server's custom microservice with a `POST` request having `"content-type":"application/json"` as Headers.
* The custom microservice written in NodeJS-Express takes the data from POST request and using it makes API call to `"Watson NLU API"`, which processes the data and returns the response to custom microservice.
* The custom microservice extract's data from API call's response and sends it back in response to the POST request made earlier.
* The response (JSON) from POST request is parsed to show the relevant categories for the user input.


## Running Locally
Run the following commands on your system `cmd/gitbash` to setup this project locally and running it.

    1.git clone "<paste_this_repo_url_here>"
    2.cd watson-feedback-classifier/microservices/ui/app
    3.npm install
    4.npm start

Hooray!:tada: The app is running. Now edit the files as you like  and see the changes in browser.
## Part 2 (Upcoming)

## Watson Feedback Classifier
* This Watson Feedback Classifier will categorize the feedback emails and respond to each email according to its importance using the Watson Natural Language Understanding API (NLU).

## Working of app

* When the user submits a feedback, it is sent to an endpoint of the backend server written in NodeJs-Express. The server extracts the feedback message and using the Watson NLU API, checks different sentiments, labels and categories of the input text. An algorithm using all the above information decides whether it's a negative or a positive feedback email.
* Email is sent to the user with appropriate response as ---

* Neutral 10 --Thank you for choosing this product. Sorry if any inconvenience is caused. We have emailed you. Please       feel free to contact customer support.
* Positive 20 -- Thank you for choosing this product. We will be happy to serve you again!
* Negative 30 -- We are extremely sorry  for the inconvenience caused. We have emailed you. Our customer support will get   back to you shortly.






