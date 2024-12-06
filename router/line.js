const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const config = require("./config");
const couchdbConfig = config.database;
const axios = require("axios");
require("dotenv").config();

const alarm = "alarm";
const test_alarm_nanoDb = nano.use(alarm);

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
    data: {},
  };

  return axios(request)
    .then((resp) => {
      console.log("Notify:", resp.data);
    })
    .catch((err) => {
      console.error(
        "Line Notify Error:",
        err.response.data,
        err.response.request.path
      );
    });
}
// 修改為：
module.exports = {
  router,
  sendLineNotify,
};
