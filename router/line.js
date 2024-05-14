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
const accessToken = '7brkubEfNqOzx8Y4PEgiwrRXqU7sdMwXBWgfoLHwWI6'; //測試用的token

function sendLineNotify(message) {
  const request = {
      method: "post",
      url: "https://notify-api.line.me/api/notify",
      headers: {
          Authorization: `Bearer ${accessToken}`,
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
    console.log("New Notify:",
    resp.data);
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
    //console.log(docs);
    //const doc = docs[2];
    //console.log(docs[2]);
    let sended = false;
    let flag = 0;
    let trans_level ;
    for (const doc of docs) {
      // for (let i = 0; i < Math.min(docs.length, 10); i++) {
        //const doc = docs[i];
         if (doc._id.startsWith('_design/')) {
             continue;
         }
          if (!doc.line_notify) { // 如果line_notify屬性為false
            flag++;
            //console.log("目前處理的資料是: ", doc);
            const formattedTime = moment(doc.occurrence_time).format("YYYY/MM/DD - HH時mm分ss秒");
            if(doc.level ==="Event"){
              recoverstatus = "狀態改變";
              trans_level = "事件";
         }
         else if(doc.level ==="Fault"){
          trans_level = "Fault";
            if(doc.recover == true){
              recoverstatus = "復歸";
            }
            else{
              recoverstatus = "觸發";
            }
        }
          else { 
              trans_level = "Alarm";
 
              if(doc.recover == true){
                recoverstatus = "復歸";
              }
              else{
                recoverstatus = "觸發";
              }
          }

            const message = ` 案場狀態通知
● 設備名稱 : ${doc.device}
  ( ID : ${doc._id} )
● 發生時間 :
     ${formattedTime}
● 告警等級 : ${trans_level}
● 設備狀態 :  ${recoverstatus}
● 告警描述 :
     ${doc.content}
● 目前數值 :  ${doc.value}
● 設備位置 :  ${doc.location}`;

              //const trimmedMessage = message.trim();    
              // 傳送資料至Line Notify
              await sendLineNotify(message);
              //更新資料庫中的line_notify屬性為true
              doc.line_notify = true;
              await test_alarm_nanoDb.insert(doc);
              //console.log('已修改"line_notify"發送狀態');
              sended = true;
              return sended;
              }
      }
       if(flag === 0){
      //   console.log('目前所有的line通知已發送');
        return sended;
       }
      
  } catch (error) {
      //console.log("**********************************************************");
      console.error('處理資料時發生錯誤:', error);
  }
}

//processDocs();
let requestCount = 0; // 初始化請求次數計數器
const maxRequestsPerHour = 999; // 每小時請求上限
const intervalTime = 3000; // 計時器間隔時間，單位：毫秒（這裡設定為每三秒執行一次）

// 設置計時器
const timer = setInterval(async () => {
  const now = new Date();
  
   // 在每個小時的零分零秒時將 requestCount 設置為 0
   if (now.getMinutes() === 0 && now.getSeconds() === 0) {
    requestCount = 0;
}
    if (requestCount >= maxRequestsPerHour) {
        clearInterval(timer); // 如果超過每小時請求上限，停止計時器
        //console.log('已達到每小時請求上限，暫停發送通知。');
        const message = `
${now}:
已達到每小時請求上限1000則訊息，已暫停發送通知 !
請注意該小時系統情況，待整點後恢復Line告警功能`;
        sendLineNotify(message);
        return;
    }
    // 每三秒執行一次processDocs()功能
    const sended = await processDocs();

    if(sended === true){
      requestCount++; // 每次執行processDocs()時增加請求計數
    }
}, intervalTime);

// 修改為：
module.exports = {
    router,
    sendLineNotify,
  };
