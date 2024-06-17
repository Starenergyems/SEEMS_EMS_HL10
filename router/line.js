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

require('dotenv').config();

const test_alarm = "test_alarm";
const test_alarm_nanoDb = nano.use(test_alarm);

//********************************************************************************* */
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
//********************************************************************************* */
//發訊息通用
//const accessToken = '7brkubEfNqOzx8Y4PEgiwrRXqU7sdMwXBWgfoLHwWI6'; //測試用的token

function sendLineNotify(message) {
  const request = {
      method: "post",
      url: "https://notify-api.line.me/api/notify",
      headers: {
          Authorization: `Bearer ${process.env.LineNotifyToken}`,
          //Authorization: `Bearer ${process.env.LineNotifyToken}`, //正式token
          "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
          message: message,
      },
      "data": {},
  };

  return axios(request)
  .then((resp) => {
    // console.log("New Notify:",
    // resp.data);
  })
  .catch((err) => {
    console.error(
      //"Line Notify Error",
      err.response.data,
      err.response.request.path
    );
  });
}
//********************************************************************************* */
//執行判斷

async function processDocs() {
  try {
    // 查詢所有資料
    const response = await test_alarm_nanoDb.list({ include_docs: true });
    const docs = response.rows.map(row => row.doc);
    
    let sended = false;
    let flag = 0;
    let trans_level;

    // 要忽略的 _id 列表
    const ignoreIds = [
      'lc1_rf10.BMS1.404011:14',
      'lc2_rf10.BMS1.404011:14',
      'lc3_rf10.BMS1.404011:14',
      'lc4_rf10.BMS1.404011:14',
      'lc1_rf10.BMS2.404011:14',
      'lc2_rf10.BMS2.404011:14',
      'lc3_rf10.BMS2.404011:14',
      'lc4_rf10.BMS2.404011:14',
      'lc1_rf10.BMS1.404011:15',
      'lc2_rf10.BMS1.404011:15',
      'lc3_rf10.BMS1.404011:15',
      'lc4_rf10.BMS1.404011:15',
      'lc1_rf10.BMS2.404011:15',
      'lc2_rf10.BMS2.404011:15',
      'lc3_rf10.BMS2.404011:15',
      'lc4_rf10.BMS2.404011:15',
      'lc1_rf10.System.402013',
      'lc2_rf10.System.402013',
      'lc3_rf10.System.402013',
      'lc4_rf10.System.402013'
    ];

    for (const doc of docs) {
      if (doc._id.startsWith('_design/')) {
        continue;
      }
      if(!ignoreIds.includes(doc._id)){
        if (!doc.line_notify) { // 如果 line_notify 屬性為 false
          flag++;
          const formattedDate = moment(doc.occurrence_time).format("YYYY/MM/DD");
          const formattedTime = moment(doc.occurrence_time).format("HH時mm分ss秒");
  
          if (doc.level === "Event") {
            recoverstatus = "狀態改變";
            trans_level = "事件";
          } else if (doc.level === "Fault") {
            trans_level = "Fault";
            if (doc.recover) {
              recoverstatus = "復歸";
            } else {
              recoverstatus = "觸發";
            }
          } else {
            trans_level = "Alarm";
            if (doc.recover) {
              recoverstatus = "復歸";
            } else {
              recoverstatus = "觸發";
            }
          }
  
        const message = `
日期 : ${formattedDate}
時間 : ${formattedTime}
設備 : ${doc.device}
ID : ${doc._id}
內容 :${doc.content}
數值 : ${doc.value}`;
  
  
          // 傳送資料至 Line Notify
          await sendLineNotify(message);
  
          // 更新資料庫中的 line_notify 屬性為 true，使用版本控制
          let insertAttempt = false;
          while (!insertAttempt) {
            try {
              // 重新讀取最新的文檔版本
              const latestDoc = await test_alarm_nanoDb.get(doc._id);
              latestDoc.line_notify = true; // 更新 line_notify 屬性
              await test_alarm_nanoDb.insert(latestDoc); // 插入新版本的文檔
              insertAttempt = true; // 插入成功，跳出循環
            } catch (conflictError) {
              console.log('更新文檔時發生衝突，正在重新讀取最新版本並重試更新...');
            }
          }
  
          sended = true;
          return sended;
        }
      }

    }

    if (flag === 0) {
      // 所有的 line 通知已發送
      return sended;
    }

  } catch (error) {
    console.error('processDocs:處理資料時發生錯誤:', error);
  }
}

async function delprocessDocs() {
  try {
    // 查詢所有資料
    const response = await test_alarm_nanoDb.list({ include_docs: true });
    const docs = response.rows.map(row => row.doc);
    let flag = 0;
    for (const doc of docs) {
      if (doc._id.startsWith('_design/')) {
        continue;
      }
      if (doc.read === true && doc.recover === true && doc.line_notify === true) {
        // 如果符合條件，直接刪除文檔
        try {
          await test_alarm_nanoDb.destroy(doc._id, doc._rev);
          flag++;
        } catch (error) {
          console.error('刪除文檔時發生錯誤:', error);
        }
      }
    }
    // 回傳符合條件文檔的數量
    return flag;
  } catch (error) {
    console.error('刪除已讀且復歸資料時發生錯誤:', error);
  }
}

const maxRequestsPerHour = 1000;
let requestCount = 0;
const intervalTime = 1000; // 每1秒執行一次

const resetRequestCount = () => {
  const now = new Date();
  const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
  const millisecondsUntilNextHour = nextHour - now;
  
  setTimeout(() => {
    requestCount = 0;
    console.log(`Request count reset at ${new Date()}`);
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

// 假設delprocessDocs函數每3秒執行一次
setInterval(delprocessDocs, 3000);



// 修改為：
module.exports = {
    router,
    sendLineNotify,
  };
