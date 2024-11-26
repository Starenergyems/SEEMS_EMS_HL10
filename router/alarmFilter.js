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

const { sendSlackNotification } = require("./slack_api.js");
const { sendLineNotify } = require("./line");

require("dotenv").config();
const test_alarm = "test_alarm";
const test_alarm_nanoDb = nano.use(test_alarm);

//********************************************************************************* */
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
//********************************************************************************* */
// 要忽略的 id 列表
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
  "lc1_rf10.System.402020",
  "lc2_rf10.System.402020",
  "lc3_rf10.System.402020",
  "lc4_rf10.System.402020",
  "gc_rf10.System.400080:5",
  "gc_rf10.System.400080:6",
];

async function formatDocData(doc) {
  let recoverstatus, formattedDate, formattedTime;

  if (doc.level === "Event") {
    recoverstatus = "狀態改變";
    trans_level = "事件";
    if (doc.recover) {
      formattedDate = moment(doc.recover_time).format("YYYY/MM/DD");
      formattedTime = moment(doc.recover_time).format("HH時mm分ss秒");
    } else {
      formattedDate = moment(doc.occurrence_time).format("YYYY/MM/DD");
      formattedTime = moment(doc.occurrence_time).format("HH時mm分ss秒");
    }
  } else if (doc.level === "Fault") {
    trans_level = "Fault";
    if (doc.recover) {
      formattedDate = moment(doc.recover_time).format("YYYY/MM/DD");
      formattedTime = moment(doc.recover_time).format("HH時mm分ss秒");
      recoverstatus = "已復歸";
    } else {
      formattedDate = moment(doc.occurrence_time).format("YYYY/MM/DD");
      formattedTime = moment(doc.occurrence_time).format("HH時mm分ss秒");
      recoverstatus = "觸發";
    }
  } else {
    trans_level = "Alarm";
    if (doc.recover) {
      formattedDate = moment(doc.recover_time).format("YYYY/MM/DD");
      formattedTime = moment(doc.recover_time).format("HH時mm分ss秒");
      recoverstatus = "已復歸";
    } else {
      formattedDate = moment(doc.occurrence_time).format("YYYY/MM/DD");
      formattedTime = moment(doc.occurrence_time).format("HH時mm分ss秒");
      recoverstatus = "觸發";
    }
  }

  const message = `${recoverstatus}
日期 : ${formattedDate}
時間 : ${formattedTime}
設備 : ${doc.device}
ID : ${doc._id}
內容 : ${doc.content}
數值 : ${doc.value} `;

  return message;
}

async function processDocs() {
  try {
    const response = await test_alarm_nanoDb.list({ include_docs: true });
    const docs = response.rows.map((row) => row.doc);

    let sended = false;
    let flag = 0;

    for (const doc of docs) {
      if (
        doc._id.startsWith("_design/") ||
        ignoreIds.includes(doc._id) ||
        doc.line_notify
      ) {
        continue;
      }

      flag++;

      const message = await formatDocData(doc);
      //console.log("先發送 Slack 通知", doc);
      // 先發送 Slack 通知
      await sendSlackNotification(doc);
      //console.log("再發送 line 通知", message);
      // 確保 Slack 通知完成後，再發送 LINE 通知
      await sendLineNotify(message);

      // 更新資料庫中的 line_notify 屬性為 true
      let insertAttempt = false;
      while (!insertAttempt) {
        try {
          const latestDoc = await test_alarm_nanoDb.get(doc._id);
          latestDoc.line_notify = true;
          await test_alarm_nanoDb.insert(latestDoc);
          insertAttempt = true;
        } catch (conflictError) {
          console.log("更新文檔時發生衝突，正在重新讀取最新版本並重試更新...");
        }
      }

      sended = true;
      // 繼續處理下一個文檔
    }

    if (flag === 0) {
      return sended;
    }
  } catch (error) {
    console.error("processDocs:處理資料時發生錯誤:", error);
  }
}

//已經告警與復歸且通知的要刪除
async function delprocessDocs() {
  try {
    // 查詢所有資料
    const response = await test_alarm_nanoDb.list({ include_docs: true });
    const docs = response.rows.map((row) => row.doc);
    let flag = 0;
    for (const doc of docs) {
      if (doc._id.startsWith("_design/")) {
        continue;
      }
      if (
        doc.read === true &&
        doc.recover === true &&
        doc.line_notify === true
      ) {
        // 如果符合條件，直接刪除文檔
        try {
          await test_alarm_nanoDb.destroy(doc._id, doc._rev);
          flag++;
        } catch (error) {
          console.error("刪除文檔時發生錯誤:", error);
        }
      }
    }
    // 回傳符合條件文檔的數量
    return flag;
  } catch (error) {
    console.error("刪除已讀且復歸資料時發生錯誤:", error);
  }
}

const maxRequestsPerHour = 1000;
let requestCount = 0;
const intervalTime = 1000; // 每1秒執行一次

const resetRequestCount = () => {
  const now = new Date();
  const nextHour = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours() + 1,
    0,
    0,
    0
  );
  const millisecondsUntilNextHour = nextHour - now;

  setTimeout(() => {
    requestCount = 0;
    //console.log(`Request count reset at ${new Date()}`);
    resetRequestCount(); // 設置下一次重置計數
  }, millisecondsUntilNextHour);
};

const timer = setInterval(async () => {
  const now = new Date();
  if (requestCount >= maxRequestsPerHour) {
    clearInterval(timer); // 如果超過每小時請求上限，停止計時器
    const message = `
  ${now}:
  已達到每小時上限1000則訊息，已暫停發送通知!
  請注意該小時系統情況，待整點後恢復Line告警功能`;
    sendLineNotify(message);
    return;
  }
  // 每一秒執行一次processDocs()功能
  const sended = await processDocs();

  if (sended === true) {
    requestCount++; // 每次執行processDocs()時增加請求計數
  }
}, intervalTime);

// 初始設置重置計數
resetRequestCount();

// 假設delprocessDocs函數每2秒執行一次
setInterval(delprocessDocs, 2000);
