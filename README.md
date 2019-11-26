## CoCo webinar

Frontend API:

User input is sent as user_input property in POST request body. 
This request expects an answer in ``` {response:[answer]} ``` format.

Configation:
Configuration file is located in /static/config.js ([nodejs example](https://github.com/ConversationalComponents/webinar/blob/master/nodejs/static/config.js)).
``` requestURL:string ```
is the url to which client will POST the requests.
``` firstMessage:string ```
is the message session will start with
