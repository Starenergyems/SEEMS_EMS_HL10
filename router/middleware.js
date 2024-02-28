// middleware.js
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const app = express();
const server = http.createServer(app);

require("dotenv").config();
const {
  mapL_M_systemMode,
  counttotalWarningNum,
  countWarningNum_Meter,
  calculateWarningNum_PCS,
  calculateWarningNum_Bat,
  calculateWarningNum_Env,
  calculateWarningNum_FF,
  scaleProcess,
} = require("./function");

const { Console } = require("console");
const { ok } = require("assert");

const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
app.use(cookieParser());

//***************************************************************************************************************** */
const otherrf01nanoDb = nano.use("other_rf01");
const otherrf10nanoDb = nano.use("other_rf10");
const GCnanoDb = nano.use("gc_rf10");
const DCnanoDb = nano.use("dc_rf10");
const lc1nanoDb = nano.use("lc1_rf10");
const lc2nanoDb = nano.use("lc2_rf10");
const lc3nanoDb = nano.use("lc3_rf10");
const lc4nanoDb = nano.use("lc4_rf10");

const indexDef = {
  index: { fields: ["time"] },
  name: "time_index",
};

// 為每個資料庫創建索引
await GCnanoDb.createIndex(indexDef);
await DCnanoDb.createIndex(indexDef);
await otherrf10nanoDb.createIndex(indexDef);
await otherrf01nanoDb.createIndex(indexDef);
await lc1nanoDb.createIndex(indexDef);
await lc2nanoDb.createIndex(indexDef);
await lc3nanoDb.createIndex(indexDef);
await lc4nanoDb.createIndex(indexDef);

const mangoQuery = {
  selector: {
    time: { $exists: true },
  },
  sort: [{ time: "desc" }],
  limit: 1,
};

//***************************************************************************************************************** */

// 定義一個全區可用的中間件函數
const myMiddleware = (req, res, next) => {
  console.log("這是全區可用的中間件！");
  // 可以在這裡執行任何您需要的邏輯
  next(); // 繼續執行下一個中間件或路由處理程序
};

//***************************************************************************************************************** */
//中介軟體 - 在每個請求上設置 navbarData 和其他變數
// 創建資料庫實例
app.use(async (req, res, next) => {
  try {
    // 為每個資料庫創建索引並發送查詢
    Promise.all([
      GCnanoDb.createIndex(indexDef).then(() => GCnanoDb.find(mangoQuery)),
      DCnanoDb.createIndex(indexDef).then(() => DCnanoDb.find(mangoQuery)),
      otherrf10nanoDb
        .createIndex(indexDef)
        .then(() => otherrf10nanoDb.find(mangoQuery)),
      otherrf01nanoDb
        .createIndex(indexDef)
        .then(() => otherrf01nanoDb.find(mangoQuery)),
      lc1nanoDb.createIndex(indexDef).then(() => lc1nanoDb.find(mangoQuery)),
      lc2nanoDb.createIndex(indexDef).then(() => lc2nanoDb.find(mangoQuery)),
      lc3nanoDb.createIndex(indexDef).then(() => lc3nanoDb.find(mangoQuery)),
      lc4nanoDb.createIndex(indexDef).then(() => lc4nanoDb.find(mangoQuery)),
    ])
      .then(
        ([
          gcBody,
          dcBody,
          rf10Body,
          rf01Body,
          lc1Body,
          lc2Body,
          lc3Body,
          lc4Body,
        ]) => {
          const gcData = gcBody.docs[0];
          const DCData = dcBody.docs[0];
          const otherrf10Data = rf10Body.docs[0];
          const otherrf01Data = rf01Body.docs[0];
          const lc1Data = lc1Body.docs[0];
          const lc2Data = lc2Body.docs[0];
          const lc3Data = lc3Body.docs[0];
          const lc4Data = lc4Body.docs[0];

          // 在這裡將數據返回給前端或進行其他處理
          res.locals.navbarData = {
            title: "模式控制",
            stylesheets: [
              "../public/styles/style_template.css",
              "../public/styles/Mode_SysCtrl.css",
            ],
            permission: "admin",
            //******************************************************************************* */
            //綠黃紅 調頻服務中、部分運轉、暫停服務 bit4+bit5
            L_M_systemMode: mapL_M_systemMode(
              gcData.System["400078"],
              gcData.System["400079"],
              gcData.System["400080"],
              gcData.System["400081"]
            ),
            //右邊******************************************************************************* */
            //Warning 警告 右邊 黃色
            //計算*告警*總數
            totalWarningNum: 99999,
            //totalWarningNum: counttotalWarningNum(0),
            WarningNum_Meter: 99999,
            //WarningNum_Meter: countWarningNum_Meter(otherrf01Data),
            // 408181:Oil temperature/408205: VCB Status(1、2)/408206:ACB Status(bit1 3 5)/Relay 408201-408203
            //PCS
            WarningNum_PCS: 99999,
            //電池
            WarningNum_Bat: 99999,
            //環境
            WarningNum_Env: 99999,

            WarningNum_FF: 99999,

            //左邊******************************************************************************* */
            //計算*錯誤*總數 Alarm (紅色 左邊 錯誤)
            totalAlarmNum: 99999,
            AlarmNum_Meter: 99999,
            AlarmNum_PCS: 99999,
            AlarmNum_Bat: 99999,
            AlarmNum_Env: 99999,
            AlarmNum_FF: 99999,
            //*********************************************************************************** */
            //下方******************************************************************************* */
            //系統資訊

            L_M_freq: scaleProcess(otherrf01Data.Freq[408026], 1, 3),
            L_M_activeP: scaleProcess(otherrf01Data.Freq[408019], 1, 1),
            L_M_reactiveP: scaleProcess(otherrf01Data.Freq[408021], 1, 1),
            L_M_voltage: scaleProcess(otherrf01Data.Freq[408007], 1, 3),
            L_M_current: scaleProcess(otherrf01Data.Freq[408017], 1, 2),
            L_M_powerFactor: scaleProcess(otherrf01Data.Freq[408025], 1, 3),
            L_M_avgSOC: scaleProcess(gcDb.IEC61850[400129], 1, 3),
            L_M_minSOH: mapminSOH(lc1Data.BMS1[404005], lc1Data.BMS2[404005]),
            L_M_SBSPM: scaleProcess(gcDb.System[400037], 1, 0),
            L_M_chgEtoday: mapChgEtoday(
              lc1Data.BMS1[404079],
              lc1Data.BMS1[404080],
              lc1Data.BMS1[404081]
            ),
            L_M_dcgEtoday: mapDcgEtoday(
              lc1Data.BMS1[404082],
              lc1Data.BMS1[404083],
              lc1Data.BMS1[404084]
            ),
          };
        }
      )
      .catch((err) => {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
      });

    // 繼續執行下一個中間件或路由
    next();
  } catch (error) {
    // 處理錯誤
    console.error("無法執行 Mango 查詢：", error);
    res.status(500).send("Internal Server Error");
  }
});

//緊急停止按紐也要做

module.exports = {
  myMiddleware,
};
