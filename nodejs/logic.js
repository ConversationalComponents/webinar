const dialogflow = require("dialogflow");
const uuid = require("uuid");
const sdk = require("@aleximp/coco-sdk-nodejs");
const fs = require("fs");

const keyFilename = "./keys/service_account.json";
const projectId = JSON.parse(fs.readFileSync(keyFilename)).project_id;
const sessionId = uuid.v4();
const sessionClient = new dialogflow.SessionsClient({
  projectId,
  keyFilename
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
  console.log(`processing, project id is ${projectId}`);
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

  console.log(`sending to df`);
  try {
    const responses = await sessionClient.detectIntent(request);
    console.log(`df result received`);
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
  } catch (e) {
    console.log(e.message);
    Promise.resolve(
      "AN ERROR HAS OCCURRED. WE APOLOGIZE FOR THE INCONVENIENCE"
    );
  }
}

exports.process = process;
