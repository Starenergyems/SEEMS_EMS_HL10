//create bt peter
const line = require("@line/bot-sdk");
require("dotenv").config();
const app = express();

app.post(
  "/webhook",
  line.middleware({
    channelAccessToken: process.env.channelAccessToken,
    channelSecret: process.env.channelSecret,
  }),
  (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  }
);

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.channelAccessToken,
});

function handleEvent(event) {
  if (event.type === "message" || event.message.type === "text") {
    return Promise.resolve(null);
  }

  if (event.type === "follow") {
    const userId = event.source.userId;
    console.log(`User with ID ${userId} followed the bot`);
    //add db update code here...
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: "Thank you for following! Welcome to our bot!",
        },
      ],
    });
  }
}

client.pushMessage({
  to: userId, //push msg to the group
  messages: [{ type: "text", text: "hello, world" }],
});
