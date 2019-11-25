const dialogflow = require("dialogflow");
const uuid = require("uuid");
const sdk = require("@aleximp/coco-sdk-nodejs");

const projectId = "banking-lskgnd";
const sessionId = uuid.v4();
const sessionClient = new dialogflow.SessionsClient({
  projectId,
  keyFilename: "./keys/banking-lskgnd-b602ad831596.json"
});
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const conv = new sdk.ComponentSession("register_vp3", "test");

var isHandlingAccountOpen = false;

async function processCoco(input) {
  const response = await conv.call(input);
  if (response instanceof Error) {
    return Promise.resolve("ERROR");
  }
  if (response.component_done) {
    isHandlingAccountOpen = false;
  }
  return Promise.resolve(response.response);
}

async function process(input) {
  if (isHandlingAccountOpen) {
    return processCoco(input);
  }
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: input,
        languageCode: "en-US"
      }
    }
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  if (result.intent.displayName === "account.open") {
    isHandlingAccountOpen = true;
    return processCoco(input);
  }
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return Promise.resolve(result.fulfillmentText);
}

exports.process = process;
