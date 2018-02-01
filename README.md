# Watson Feedback Classifier


## What is it?

This Watson Feedback Classifier attempts to categorize the feedback emails from different clients of a particular organization and respond to each email according to its importance using the Watson Natural Language Understanding API (NLU). 

## Why do we need it?
The continuing explosive growth of textual content within the World Wide Web has given rise to the need for sophisticated text classification techniques that combine efficiency with high quality of results. Feedback email-filtering applications have the potential to streamline the management of the vast amount of information that accumulates in the inbox of a company. 

## How does it work?

Suppose that an organization supports the use of feedback emails from its customers.
The organization needs only the important feedback emails which contain issues and concerns regarding the product/service which they offer. It would take a huge amount of time to manually check each email and decide whether it needs attention or not.
 


### Internal Implementation
When the user with its email ID sends a feedback, it is sent to an endpoint of the backend server written in NodeJs-Express.
The server extracts the feedback message and using the Watson NLU API, checks different sentiments, labels and categories of the input text. An algorithm using all the above information deduces whether it's a negative or a positive feedback email.


## What does it use?
[Hasura](https://hasura.io)
[Watson API](https://www.ibm.com/watson/developercloud/natural-language-understanding/api)

### How do I use it?
- Install [hasura CLI](https://docs.hasura.io/0.15/manual/install-hasura-cli.html)
- Get the project and cd into it.
- $ hasura quickstart someuser/watson-feedback-classifer
////////////////
- Finally, deploy the webhook using git push. Run these commands from the project directory.
 $ git add .
$ git commit -m "First commit"
$ git push hasura master
It is all set. You can check the translation functionality in action in your intercom workspace.

### How to build on top of this?
The source code lies in microservices/ directory. 
Inside microservices/api/src, server.js is where you want to start modifying the code if it pertains to the backend.

If you are using any extra python packages, just add them to microservices/api/src/package.json and they will be "npm installed" during the Docker build.

## Support
If you happen to get stuck anywhere, please mail at <>. Alternatively, if you find a bug, you can raise an issue [here]().
