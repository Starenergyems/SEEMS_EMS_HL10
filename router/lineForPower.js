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
const other_rf01 = "other_rf01";
const other01Db = nano.use(other_rf01);

//********************************************************************************* */
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
//********************************************************************************* */

console.log("執行lineForPower.js");

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

async function fetchDataAndNotify() {
  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD"); // 修正為昨日日期
  try {
    const body = await powerusageDb.find({
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
    });

    if (body.docs.length > 0) {
      const data = body.docs[0];
      const message = `花蓮 4-1 案場\nDate: ${data.date}\n輸入電量(Imp): ${data.day_kWh_Import} kWh\n輸出電量(Exp): ${data.day_kWh_Export} kWh\n用電量(Net): ${data.kWh_Net} kWh\nRTE: ${data.kWh_RTE} %`;
      await sendLineNotify(message);
    } else {
      const yesterdaytime = moment().subtract(1, "days"); // 保持 moment 對象
      // 呼叫 getFullDayPowerUsage 函數，傳入參數 type = "D" 和 specifiedTime = yesterday
      const result = await getFullDayPowerUsage("D", yesterdaytime);

      // 處理返回的結果，這裡假設 result 包含需要的電量數據，如果 result 是空的，則代表無法獲取數據
      const message =
        result && result.data
          ? `花蓮 4-1 案場\nDate: ${yesterday}\n輸入電量(Imp): ${result.data.day_kWh_Import} kWh\n輸出電量(Exp): ${result.data.day_kWh_Export} kWh\n用電量(Net): ${result.data.kWh_Net} kWh\nRTE: ${result.data.kWh_RTE} %`
          : `花蓮 4-1 案場\nDate: ${yesterday}\n昨日數值不存在`;

      console.log(message);
      await sendLineNotify(message);
      await sendSlackNotification(message);
    }
  } catch (err) {
    console.error("Database Error:", err);
  }
}

// 每天八點執行一次
schedule.scheduleJob("0 8 * * *", () => {
  fetchDataAndNotify();
});

// 服務啟動時立即發送測試通知
// sendLineNotify("電量通知服務v.1 啟用中~");

// 測試用立即發送通知
//message = "Hello!";
//sendLineNotify(message);

module.exports = router;

// - 副程式: 獲得全天(日報)電力使用資訊
async function getFullDayPowerUsage(type, specifiedTime) {
  console.log("執行日報中電力資訊獲取，執行日期為: ", specifiedTime.format());
  console.log("類型(type): ", type);
  // 設定 startTime 和 endTime 為當天的00:00:00.000和23:59:59.000，並加上時區偏移
  const targetDay = specifiedTime.format("YYYY-MM-DD");
  const startTime = moment(targetDay + "T00:00:00.000+08:00").format(
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  );
  const endTime = moment(targetDay + "T23:59:59.000+08:00").format(
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  );
  console.log("全日的電量之startTime: ", startTime);
  console.log("全日的電量之endTime: ", endTime);

  // 在powerusagedb中檢查是否已存在相應的數據
  const filter = {
    selector: {
      type: type, // 類型符合傳入的type
      date: targetDay, // 日期符合targetDay
    },
    limit: 1, // 只需要檢查是否至少有一條數據存在
  };

  const existingData = await powerusageDb.find(filter);
  if (existingData.docs.length > 0) {
    console.log("已存在相應數據，跳過讀取other01Db，並直接回傳數值。");
    const data = existingData.docs[0];
    //console.log("該日充放電資料為: ", existingData.docs);
    return {
      complete: true,
      data: data,
      message: "Data already exists.",
    };
  } else {
    console.log(
      "未找到相應數據，繼續處理讀取other01Db，以獲取全日用電量數據..."
    );

    // 設置一秒後的時間
    const startTimePlusOneSecond = moment(startTime)
      .add(1, "seconds")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[+08:00]");

    // 搜尋startTime到startTime+1秒的資料
    const startFilter = {
      selector: {
        time: { $gte: startTime, $lt: startTimePlusOneSecond },
      },
      limit: 10,
      sort: [{ time: "asc" }],
    };

    const startResults = await other01Db.find(startFilter);
    const start_kWh_Import = startResults.docs.map((doc) => doc.Freq["408028"]);
    const start_kWh_Export = startResults.docs.map((doc) => doc.Freq["408030"]);
    const start_kVARh_Import = startResults.docs.map(
      (doc) => doc.Freq["408032"]
    );
    const start_kVARh_Export = startResults.docs.map(
      (doc) => doc.Freq["408034"]
    );

    // 設置一秒後的時間點，這次是從endTime開始
    const endTimePlusOneSecond = moment(endTime)
      .add(1, "seconds")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[+08:00]");

    // 搜尋endTime到endTime+1秒的資料
    const endFilter = {
      selector: {
        time: { $gte: endTime, $lt: endTimePlusOneSecond },
      },
      limit: 10,
      sort: [{ time: "asc" }],
    };

    const endResults = await other01Db.find(endFilter);
    const end_kWh_Import = endResults.docs.map((doc) => doc.Freq["408028"]);
    const end_kWh_Export = endResults.docs.map((doc) => doc.Freq["408030"]);
    const end_kVARh_Import = endResults.docs.map((doc) => doc.Freq["408032"]);
    const end_kVARh_Export = endResults.docs.map((doc) => doc.Freq["408034"]);

    // 顯示各陣列的數值
    // console.log("start_kWh_Import: ", start_kWh_Import);
    // console.log("start_kWh_Export: ", start_kWh_Export);
    // console.log("start_kVARh_Import: ", start_kVARh_Import);
    // console.log("start_kVARh_Export: ", start_kVARh_Export);

    // console.log("end_kWh_Import: ", end_kWh_Import);
    // console.log("end_kWh_Export: ", end_kWh_Export);
    // console.log("end_kVARh_Import: ", end_kVARh_Import);
    // console.log("end_kVARh_Export: ", end_kVARh_Export);

    // 定義檢查函數
    function getValidValue(arr) {
      for (let i = 0; i < arr.length; i++) {
        //console.log("檢查中的索引 i: ", i, " 值: ", arr[i]);
        if (arr[i] !== 0 && arr[i] !== "") {
          return arr[i];
        }
      }
      console.log("當日電量顯示異常");
      return null;
    }

    // 驗證並取得有效值
    const valid_start_kWh_Import = getValidValue(start_kWh_Import);
    const valid_end_kWh_Import = getValidValue(end_kWh_Import);

    const valid_start_kWh_Export = getValidValue(start_kWh_Export);
    const valid_end_kWh_Export = getValidValue(end_kWh_Export);

    const valid_start_kVARh_Import = getValidValue(start_kVARh_Import);
    const valid_end_kVARh_Import = getValidValue(end_kVARh_Import);

    const valid_start_kVARh_Export = getValidValue(start_kVARh_Export);
    const valid_end_kVARh_Export = getValidValue(end_kVARh_Export);

    // 確保所有值都有效
    if (
      valid_start_kWh_Import !== null &&
      valid_end_kWh_Import !== null &&
      valid_start_kWh_Export !== null &&
      valid_end_kWh_Export !== null &&
      valid_start_kVARh_Import !== null &&
      valid_end_kVARh_Import !== null &&
      valid_start_kVARh_Export !== null &&
      valid_end_kVARh_Export !== null
    ) {
      // 計算差值
      const day_kWh_Import =
        (valid_end_kWh_Import - valid_start_kWh_Import) / 10;
      //console.log("day_kWh_Import (kWh Import 差值): ", day_kWh_Import);

      const day_kWh_Export =
        (valid_end_kWh_Export - valid_start_kWh_Export) / 10;
      //console.log("day_kWh_Export (kWh Export 差值): ", day_kWh_Export);
      const kWh_Net = parseFloat(
        ((day_kWh_Import - day_kWh_Export) / 10).toFixed(2)
      );
      //console.log("kWh_Net(差值): ", kWh_Net);

      const day_kVARh_Import =
        (valid_end_kVARh_Import - valid_start_kVARh_Import) / 10;
      // console.log("day_kVARh_Import (kVARh Import 差值): ", day_kVARh_Import);

      const day_kVARh_Export =
        (valid_end_kVARh_Export - valid_start_kVARh_Export) / 10;
      // console.log("day_kVARh_Export (kVARh Export 差值): ", day_kVARh_Export);
      const kVARh_Net = parseFloat((day_kVARh_Import - day_kVARh_Export) / 10);
      // console.log("kVARh_Net(差值): ", kVARh_Net);
      let kWh_RTE = 0;
      kWh_RTE = parseFloat(
        ((day_kWh_Export / day_kWh_Import) * 100).toFixed(2)
      );

      // 建立新doc並存入powerusageDb
      const newDoc = {
        type: type,
        date: targetDay,
        day_kWh_Import: day_kWh_Import,
        day_kWh_Export: day_kWh_Export,
        kWh_Net: kWh_Net,
        day_kVARh_Import: day_kVARh_Import,
        day_kVARh_Export: day_kVARh_Export,
        kVARh_Net: kVARh_Net,
        kWh_RTE: kWh_RTE,
      };
      const saveResult = await powerusageDb.insert(newDoc);
      console.log("全日用電量數值已存入資料庫，資料內容如下: ", saveResult);
      return {
        complete: true,
        data: newDoc,
        message: "Data created.",
      };
    } else {
      console.log("當日電量顯示異常");
    }
  }

  return { complete: false, message: "Data processing completed." };
}
