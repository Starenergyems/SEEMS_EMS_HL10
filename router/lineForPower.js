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
const schedule = require("node-schedule");

require("dotenv").config();
const powerusage = "powerusage";
const powerusageDb = nano.use(powerusage);

//********************************************************************************* */
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
//********************************************************************************* */

function sendLineNotify(message) {
  const request = {
    method: "post",
    url: "https://notify-api.line.me/api/notify",
    headers: {
      Authorization: `Bearer ${process.env.LineNotifyToken2}`,
      //Authorization: `Bearer ${process.env.LineNotifyToken}`, //正式token
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      message: message,
    },
    data: {},
  };

  return axios(request)
    .then((resp) => {
      console.log("New Notify :", resp.data);
    })
    .catch((err) => {
      console.error(
        "Line Notify Error:",
        err.response.data,
        err.response.request.path
      );
    });
}

function fetchDataAndNotify() {
  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD"); // 修正為昨日日期
  powerusageDb
    .find({
      selector: {
        date: yesterday,
      },
      fields: [
        "date",
        "day_kWh_Import",
        "day_kWh_Export",
        "kWh_Net",
        "kWh_RTE",
      ],
    })
    .then((body) => {
      if (body.docs.length > 0) {
        const data = body.docs[0];
        const message = `花蓮 4-1 案場\nDate: ${data.date}\n輸入電量(Imp): ${data.day_kWh_Import} kWh\n輸出電量(Exp): ${data.day_kWh_Export} kWh\n用電量(Net): ${data.kWh_Net} kWh\nRTE: ${data.kWh_RTE} %`;
        sendLineNotify(message);
      } else {
        const message = `花蓮 4-1 案場\nDate: ${yesterday}\n昨日數值不存在`;
        console.log(message);
        sendLineNotify(message);
      }
    })
    .catch((err) => {
      console.error("Database Error:", err);
    });
}

// 每五分鐘執行一次
schedule.scheduleJob("0 8 * * *", () => {
  fetchDataAndNotify();
});

// 服務啟動時立即發送測試通知
sendLineNotify("電量通知服務啟用");

// 測試用立即發送通知
//message = "Hello!";
//sendLineNotify(message);

module.exports = router;
