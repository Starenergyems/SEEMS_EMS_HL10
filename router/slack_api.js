require("dotenv").config();
const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const cors = require("cors");
const socket = require("socket.io");
const http = require("http");
const e = require("connect-flash");
const config = require("./config");
const couchdbConfig = config.database;
const moment = require("moment");
const axios = require("axios");
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

require("dotenv").config();

const test_alarm = "test_alarm";
const test_alarm_nanoDb = nano.use(test_alarm);

//********************************************************************************* */
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
//********************************************************************************* */
// 新的 Slack 通知函數
function sendSlackNotification(message) {
  const request = {
    method: "post",
    url: process.env.SLACK_WEBHOOK_URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ text: message }), // Slack Webhook 格式
  };

  return axios(request)
    .then((resp) => {
      console.log("New Slack Notification:", resp.data);
    })
    .catch((err) => {
      console.error("Slack Notify Error:", err.response.data);
    });
}

//*********************************************************************************
// 使用 sendSlackNotification 取代 sendLineNotify

async function processDocs() {
  try {
    const response = await test_alarm_nanoDb.list({ include_docs: true });
    const docs = response.rows.map((row) => row.doc);

    let sended = false;
    let flag = 0;
    let trans_level;

    const ignoreIds = [
      "lc1_rf10.BMS1.404011:14",
      "lc2_rf10.BMS1.404011:14",
      "lc3_rf10.BMS1.404011:14",
      "lc4_rf10.BMS1.404011:14",
      "lc1_rf10.BMS2.404011:14",
      "lc2_rf10.BMS2.404011:14",
      "lc3_rf10.BMS2.404011:14",
      "lc4_rf10.BMS2.404011:14",
      "lc1_rf10.BMS1.404011:15",
      "lc2_rf10.BMS1.404011:15",
      "lc3_rf10.BMS1.404011:15",
      "lc4_rf10.BMS1.404011:15",
      "lc1_rf10.BMS2.404011:15",
      "lc2_rf10.BMS2.404011:15",
      "lc3_rf10.BMS2.404011:15",
      "lc4_rf10.BMS2.404011:15",
      "lc1_rf10.System.402013",
      "lc2_rf10.System.402013",
      "lc3_rf10.System.402013",
      "lc4_rf10.System.402013",
    ];

    for (const doc of docs) {
      let formattedDate, formattedTime;
      if (doc._id.startsWith("_design/")) continue;
      if (!ignoreIds.includes(doc._id) && !doc.line_notify) {
        flag++;
        if (doc.level === "Event") {
          trans_level = "事件";
          recoverstatus = doc.recover ? "狀態改變" : "觸發";
          formattedDate = moment(
            doc.recover_time || doc.occurrence_time
          ).format("YYYY/MM/DD");
          formattedTime = moment(
            doc.recover_time || doc.occurrence_time
          ).format("HH時mm分ss秒");
        } else if (doc.level === "Fault") {
          trans_level = "Fault";
          recoverstatus = doc.recover ? "已復歸" : "觸發";
          formattedDate = moment(
            doc.recover_time || doc.occurrence_time
          ).format("YYYY/MM/DD");
          formattedTime = moment(
            doc.recover_time || doc.occurrence_time
          ).format("HH時mm分ss秒");
        } else {
          trans_level = "Alarm";
          recoverstatus = doc.recover ? "已復歸" : "觸發";
          formattedDate = moment(
            doc.recover_time || doc.occurrence_time
          ).format("YYYY/MM/DD");
          formattedTime = moment(
            doc.recover_time || doc.occurrence_time
          ).format("HH時mm分ss秒");
        }

        const message = `${recoverstatus}\n日期 : ${formattedDate}\n時間 : ${formattedTime}\n設備 : ${doc.device}\nID : ${doc._id}\n內容 :${doc.content}\n數值 : ${doc.value}`;

        // 傳送資料至 Slack
        await sendSlackNotification(message);

        let insertAttempt = false;
        while (!insertAttempt) {
          try {
            const latestDoc = await test_alarm_nanoDb.get(doc._id);
            latestDoc.line_notify = true;
            await test_alarm_nanoDb.insert(latestDoc);
            insertAttempt = true;
          } catch (conflictError) {
            console.log(
              "更新文檔時發生衝突，正在重新讀取最新版本並重試更新..."
            );
          }
        }
        sended = true;
        return sended;
      }
    }

    if (flag === 0) {
      return sended;
    }
  } catch (error) {
    console.error("processDocs:處理資料時發生錯誤:", error);
  }
}

processDocs();

// 將 sendLineNotify 替換成 sendSlackNotification
module.exports = {
  router,
  sendSlackNotification,
};
