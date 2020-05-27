const express = require("express");
var bodyParser = require('body-parser');
const request = require("request");
const pending = require("../controller/pending");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', function (req, res) {
    if (req.query['hub.verify_token'] === 'keyToken-ngocthangtran-nodejs') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});
router.post('/', function (req, res) {
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            if (message.message) {
                // If user send text
                if (message.message.text) {
                    var text = message.message.text;
                    console.log(text); // In tin nhắn người dùng
                    console.log(senderId);
                    if(parseInt(text)){
                      if(text.length === 8 || text.length === 5){
                        async function doi(text){
                          const messagessss = await pending(text);
                          sendMessage(senderId, messagessss);
                        }
                        doi(text);
                      }else{
                        sendMessage(senderId, "Mã số không hợp lệ");
                      }
                    }
                    else{
                      sendMessage(senderId, "Page chỉ hỗ trợ mã số sinh viên của trường đại học bình dương");
                    }
                    //sendMessage(senderId, text);
                }
            }
        }
    }
    res.status(200).send("OK");
});

function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAAEXvGkJeswBAOQf8vQE29D74R09UQ5hP0nd6yKI9PlKwAZAPu5gxvOtP6c1Q5ul70ZBxKaZBjz4DBIAY5l4aMwwTUGirDbYjaVicyj9klCO3dnV0zAPXB2BRqRfLZBLijaUqLX4kZCxhkJBz7YNUkwkYImIvDo8pqYSvj74001SWbsZC548m1gxLPVyPDflYZD",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}
module.exports = router;