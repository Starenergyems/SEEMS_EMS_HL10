const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const cors = require("cors");
const socket = require("socket.io");
const http = require("http");
const e = require("connect-flash");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const axios = require("axios");
const moment = require("moment");
require('dotenv').config();

const test_alarm = "test_alarm";
const test_alarm_nanoDb = nano.use(test_alarm);
const test_hisalarm = "test_hisalarm";
const test_hisalarm_nanoDb = nano.use(test_hisalarm);

//************************************************************* */
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));


// function sendLineNotify(error_result_item) {
//     const message = `
//     ID: ${error_result_item["_id"]} 
//     Level: ${error_result_item["level"]} 
//     Location: ${error_result_item["location"]}
//     Device: ${error_result_item["device"]}
//     Value: ${error_result_item["value"]}
//     Warning:
//       ${error_result_item["content"].replace(/\[|\]/g, "_")}
//     Recover is ${error_result_item["recover"]}
//     `;
    
//     const request = {
//       method: "post",
//       //url: 'http://192.168.8.112/line-notify',
//       url: "https://notify-api.line.me/api/notify",
//       headers: {
//         Authorization: `Bearer ${process.env.LineNotifyToken}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       params: {
//         message: message,
//       },
//     };
  
//     axios(request)
//       .then((resp) => {
//         console.log(resp.data);
//       })
//       .catch((err) => {
//         console.error(
//           "Line Notify Error",
//           err.response.data,
//           err.response.request.path
//         );
//       });
//   }
  
//   function current_locale_time() {
//     const date = new Date();
//     // console.log(date)
  
//     // const formattedString = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ");
//     const formattedString = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  
//     // console.log(formattedString);
//     return formattedString;
//   }
  
//   function timestamp_to_datetime(timestamp) {
//     const ts_datetime = moment(timestamp).format("YYYY-MM-DDTHH:mm:ssZ");
  
//     // console.log(ts_datetime);
//     return ts_datetime;
//   }

const axios = require('axios');
const accessToken = '7brkubEfNqOzx8Y4PEgiwrRXqU7sdMwXBWgfoLHwWI6';
function sendLineNotify() {
    const message = `Hi`;
    
    const request = {
      method: "post",
      //url: 'http://192.168.8.112/line-notify',
      url: "https://notify-api.line.me/api/notify",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        message: message,
      },
    };
  
    axios(request)
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((err) => {
        console.error(
          "Line Notify Error",
          err.response.data,
          err.response.request.path
        );
      });
  }

sendLineNotify();

// 修改為：
module.exports = {
    router,
  };
