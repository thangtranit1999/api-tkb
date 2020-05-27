const express = require('express');
const routerData = require("./module/data");
const routerWebhook = require("./module/webhook");
var bodyParser = require('body-parser');

const cors = require('cors');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use("/api/schedule", routerData);
app.use("/api/webhook", routerWebhook);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
