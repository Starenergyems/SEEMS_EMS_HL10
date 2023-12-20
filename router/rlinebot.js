const express = require("express");
const line = require("@line/bot-sdk");
require("dotenv").config();
const { handleInput } = require("../router/linebotFunctions");

const lineConfig = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret,
};

const lineClient = new line.Client(lineConfig);

// 將 lineRouter 的部分轉換為中間件
const lineMiddleware = (req, res, next) => {
  // 如果是 GET 請求，表示 LINE 的驗證請求
  if (req.method === "GET" && req.query["hub.mode"] === "subscribe") {
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    // 使用 line.middleware 中間件處理 LINE Webhook
    line.middleware(lineConfig)(req, res, () => {
      // 在這裡進行對 req.body 的處理
      if (req.body && req.body.events) {
        Promise.all(req.body.events.map(handleEvent))
          .then((result) => res.json(result))
          .catch((err) => {
            console.error(err);
            res.status(500).end();
          });
      } else {
        next(); // 如果沒有 events，就繼續下一個中間件或路由處理
      }
    });
  }
};

function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    const inputText = event.message.text;
    // 使用外部的 function 進行判斷
    const response = handleInput(inputText);

    // 回覆 LINE 用戶
    return lineClient.replyMessage(event.replyToken, {
      type: "text",
      text: response,
    });
  }

  // 其他事件處理，例如處理追蹤事件等
  if (event.type === "follow") {
    const userId = event.source.userId;
    console.log(`User with ID ${userId} followed the bot`);
    return lineClient.replyMessage(event.replyToken, {
      type: "text",
      text: "Thank you for following! Welcome to our bot!",
    });
  }
}

module.exports = lineMiddleware;
