# Watson Feedback Classifier


## What is it?

This Watson Feedback Classifier attempts to categorize the feedback emails from different clients of a particular organization and respond to each email according to its importance using the Watson Natural Language Understanding API (NLU). 

## Why do we need it?
The continuing explosive growth of textual content within the World Wide Web has given rise to the need for sophisticated text classification techniques that combine efficiency with high quality of results. Feedback email-filtering applications have the potential to streamline the management of the vast amount of information that accumulates in the inbox of a company. 

## How does it work?

Suppose that an organization supports the use of feedback emails from its customers.
The organization needs only the important feedback emails which contain issues and concerns regarding the product/service which they offer. It would take a huge amount of time to manually check each email and decide whether it needs a follow-up or not.
 


### Internal Implementation

- The user is first asked to login. The credentials entered will be cross checked by the backend server (/login endpoint) linked to a sample table containing sample usernames, passwords and emailids. 
- After a successful login, the user can enter the feedback text, which after submitting, is sent to an endpoint of the backend server (/input endpoint) written in NodeJs-Express.
- The server extracts the feedback message and using the Watson NLU API, returns a JSON response containing different sentiments, labels and categories of the input text. 
- The front end captures the response, and an algorithm using all the above information deduces whether it's a negative or a positive feedback email, by assigning the feedback text, an integer score.
- According to the score, the front end sends a request to another server endpoint (/sendemail) to record the negative feedback in another table, and send an initial E-mail to all the clients corresponding to the score of their feedback texts. 


## What does it use?
- [Hasura](https://hasura.io)
- [Watson API](https://www.ibm.com/watson/developercloud/natural-language-understanding/api)

### How do I use it?
 1. Install [hasura CLI](https://docs.hasura.io/0.15/manual/install-hasura-cli.html)
 2. Get the project and `cd` into it.
 3. `$ hasura quickstart someuser/watson-feedback-classifer`
4. A Bluemix account is created for access credentials to use the Watson API. After generating the username and password, 
`$ hasura secrets update wapi.username <insert-your-username> 
` 
`$ hasura secrets update wapi.password <insert-your-password>
`

5. Access the api console from the CLI by running `$ hasura api-console`
6. Create the tables below.
	- sample(user_id, user_name, email_id, password) 
	- feedback(feedback_id, feedback_text, priority, user_id)
	Fill the sample table with sample user-info.
	Update permissions of all table to be modified by a "user" as well as "admin" in api-console.
7. Update Admin Bearer Token (For Notify API): `$ hasura secrets update authadmin.token <insert-your-token-value> 
` 
8. Update User Bearer Token for Authorization headers(For Data API): `$ hasura secrets update auth.token <insert-your-token-value>
`
9. Run `$ hasura user-info` and use that token here: `$ hasura secrets update notify.hasura.token <insert-user-info-token-value>` 
10. 
	`$ git add .`
`$ git commit -m "First commit"`
`$ git push hasura master`
It is all set. You can check the functionality in action in your workspace.

### How to build on top of this?
The source code lies in microservices/ directory. 
Inside microservices/api/src, server.js is where you want to start modifying the code if it pertains to the backend.

If you are using any extra packages, just add them to microservices/api/src/package.json and they will be "npm installed" during the Docker build.

## Support
If you happen to get stuck anywhere, please mail at <>. Alternatively, if you find a bug, you can raise an issue [here]().
