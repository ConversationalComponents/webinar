const bodyParser = require("body-parser");
const express = require("express");
const logic = require("./logic");
const app = express();

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/input", async (req, res) => {
  const input = req.body.user_input;
  const response = await logic.process(input);
  console.log(`response is ${response}`);
  res.send({ response });
});
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Listening on ${port}`);
