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
//const { scaleProcess } = require("./function");

const { Console } = require("console");
const { ok } = require("assert");

const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

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
const alarmnanoDb = nano.use("alarm");

const indexDef = {
  index: { fields: ["time"] },
  name: "time_index",
};

// 為每個資料庫創建索引
GCnanoDb.createIndex(indexDef);
DCnanoDb.createIndex(indexDef);
otherrf10nanoDb.createIndex(indexDef);
otherrf01nanoDb.createIndex(indexDef);
lc1nanoDb.createIndex(indexDef);
lc2nanoDb.createIndex(indexDef);
lc3nanoDb.createIndex(indexDef);
lc4nanoDb.createIndex(indexDef);
alarmnanoDb.createIndex(indexDef);
//***************************************************************************************************************** */

// 定義一個全區可用的中間件函數
// const myMiddleware = (req, res, next) => {
//   console.log("這是全區可用的中間件！");
//   // 可以在這裡執行任何您需要的邏輯
//   next(); // 繼續執行下一個中間件或路由處理程序
// };

//***************************************************************************************************************** */
//中介軟體 - 在每個請求上設置 navbarData 和其他變數
// 創建資料庫實例
// app.use(async (req, res, next) => {
//   try {
//     // 為每個資料庫創建索引並發送查詢
//     Promise.all([
//       GCnanoDb.createIndex(indexDef).then(() => GCnanoDb.find(mangoQuery)),
//       DCnanoDb.createIndex(indexDef).then(() => DCnanoDb.find(mangoQuery)),
//       otherrf10nanoDb
//         .createIndex(indexDef)
//         .then(() => otherrf10nanoDb.find(mangoQuery)),
//       otherrf01nanoDb
//         .createIndex(indexDef)
//         .then(() => otherrf01nanoDb.find(mangoQuery)),
//       lc1nanoDb.createIndex(indexDef).then(() => lc1nanoDb.find(mangoQuery)),
//       lc2nanoDb.createIndex(indexDef).then(() => lc2nanoDb.find(mangoQuery)),
//       lc3nanoDb.createIndex(indexDef).then(() => lc3nanoDb.find(mangoQuery)),
//       lc4nanoDb.createIndex(indexDef).then(() => lc4nanoDb.find(mangoQuery)),
//       alarmnanoDb
//         .createIndex(indexDef)
//         .then(() => alarmnanoDb.find(mangoQuery)),
//     ])
//       .then(
//         ([
//           gcBody,
//           dcBody,
//           rf10Body,
//           rf01Body,
//           lc1Body,
//           lc2Body,
//           lc3Body,
//           lc4Body,
//           alarmbody,
//         ]) => {
//           const gcData = gcBody.docs[0];
//           const DCData = dcBody.docs[0];
//           const otherrf10Data = rf10Body.docs[0];
//           const otherrf01Data = rf01Body.docs[0];
//           const lc1Data = lc1Body.docs[0];
//           const lc2Data = lc2Body.docs[0];
//           const lc3Data = lc3Body.docs[0];
//           const lc4Data = lc4Body.docs[0];
//           const alarmData = alarmbody.docs[0];

//           // 在這裡將數據返回給前端或進行其他處理
//           res.locals.navbarData = {
//             title: "模式控制",
//             stylesheets: [
//               "../public/styles/style_template.css",
//               "../public/styles/Mode_SysCtrl.css",
//             ],
//             permission: "admin",
//             //******************************************************************************* */
//             //綠黃紅 調頻服務中、部分運轉、暫停服務 bit4+bit5
//             L_M_systemMode: mapL_M_systemMode(
//               gcData.System["400078"],
//               gcData.System["400079"],
//               gcData.System["400080"],
//               gcData.System["400081"]
//             ),

//             //右邊******************************************************************************* */
//             //Warning 警告 右邊 黃色
//             //計算*告警*總數
//             //列出條件
//             totalWarningNum: 99999, //計算目前alarm資料庫內有多少個錯誤 #"level": "Warning",
//             WarningNum_Meter: 99999, //計算目前alarm資料庫內有多少個meter #"content": & index =
//             WarningNum_PCS: 99999, //計算目前alarm資料庫內有多少個電表與盤體告警 #"content":pcs  & index =
//             WarningNum_Bat: 99999, //計算目前alarm資料庫內有多少個電池告警 #"content":pcs  & index =
//             WarningNum_Env: 99999, //計算目前alarm資料庫內有多少個環境告警 #"content":pcs  & index =
//             WarningNum_FF: 99999, //計算有多少個消防告警

//             //左邊******************************************************************************* */
//             //計算*錯誤*總數 Alarm (紅色 左邊 錯誤)
//             totalAlarmNum: 99999,
//             AlarmNum_Meter: 99999,
//             AlarmNum_PCS: 99999,
//             AlarmNum_Bat: 99999,
//             AlarmNum_Env: 99999,
//             AlarmNum_FF: 99999,

//             //*********************************************************************************** */
//             //下方******************************************************************************* */
//             //系統資訊(純數值顯示)

//             L_M_freq: scaleProcess(otherrf01Data.Freq[408026], 1, 3),
//             L_M_activeP: scaleProcess(otherrf01Data.Freq[408019], 1, 1),
//             L_M_reactiveP: scaleProcess(otherrf01Data.Freq[408021], 1, 1),
//             L_M_voltage: scaleProcess(otherrf01Data.Freq[408007], 1, 3),
//             L_M_current: scaleProcess(otherrf01Data.Freq[408017], 1, 2),
//             L_M_powerFactor: scaleProcess(otherrf01Data.Freq[408025], 1, 3),
//             L_M_avgSOC: scaleProcess(gcDb.IEC61850[400129], 1, 3),
//             L_M_minSOH: mapminSOH(lc1Data.BMS1[404005], lc1Data.BMS2[404005]),
//             L_M_SBSPM: scaleProcess(gcDb.System[400037], 1, 0),
//             L_M_chgEtoday: mapChgEtoday(), //
//             L_M_dcgEtoday: mapDcgEtoday(), //
//           };
//         }
//       )
//       .catch((err) => {
//         console.error("Error:", err);
//         res.status(500).send("Internal Server Error");
//       });

//     // 繼續執行下一個中間件或路由
//     next();
//   } catch (error) {
//     // 處理錯誤
//     console.error("無法執行 Mango 查詢：", error);
//     res.status(500).send("Internal Server Error");
//   }
// });
// 創建一個函數來從資料庫中獲取最新的數值
async function getLatestValuesFromDatabase() {
  try {
    // 執行查詢操作以獲取最新的數值
    const alarmData = await alarmnanoDb.find({
      selector: { time: { $exists: true } },
      sort: [{ time: "desc" }],
      //limit: 10000,
    });

    const Fault_system_num = 0;
    const Fault_battery_num = 0;
    const Fault_FFS_num = 0;
    const Fault_ENV_num = 0;
    const Fault_meter_num = 0;
    const Fault_num = 0;

    for (let i = 0; i < alarmData.docs.length; i++) {
      if (alarmData.docs[i].recover === "false") {
        if (alarmData.docs[i].level === "Fault") {
          //錯誤
          if (alarmData.docs[i].category === "system") {
            Fault_system_num++;
          } else if (alarmData.docs[i].category === "battery") {
            Fault_battery_num++;
          } else if (alarmData.docs[i].category === "FFS") {
            Fault_FFS_num++;
          } else if (alarmData.docs[i].category === "ENV") {
            Fault_ENV_num++;
          } else if (alarmData.docs[i].category === "meter") {
            Fault_meter_num++;
          } else {
            id = alarmData.docs[i]._id;
            // 使用 split 方法將字串以冒號分割成陣列，並取得最後一個元素
            const parts = id.split(":");
            const tag = parts[2]; // 冒號後的數字
            const bits = parts[3]; // 冒號後的數字
            if (tag === 406001) {
              if (bits === 24 || bits === 25) {
                Fault_meter_num++;
              } else {
                Fault_FFS_num++;
              }
            }
            if (tag === 406003) {
              if (bits === 24 || bits === 25) {
                Fault_meter_num++;
              } else {
                Fault_FFS_num++;
              }
            }
          }
        }
        //警告
        else if (alarmData.docs[i].level === "Alarm") {
          if (alarmData.docs[i].category === "system") {
          } else if (alarmData.docs[i].category === "battery") {
          } else if (alarmData.docs[i].category === "FFS") {
          } else if (alarmData.docs[i].category === "ENV") {
          } else if (alarmData.docs[i].category === "meter") {
          } else {
          }
        }
      }

      console.log(
        i +
          " level:" +
          alarmData.docs[i].level +
          "  category:" +
          alarmData.docs[i].category
      );
    }
    // console.log(alarmData.docs[1].category);
    // console.log(alarmData.docs[2].category);
    // 返回從資料庫中獲取的數值
    //return alarmData.docs[0];
  } catch (error) {
    console.error("Error fetching latest values from alarm database:", error);
    throw error; // 把錯誤向外傳遞
  }
}
getLatestValuesFromDatabase();

// 在中介軟體或路由中調用這個函數，以便在渲染頁面之前獲取最新的數值並將其傳遞給前端
// app.use(async (req, res, next) => {
//   try {
//     const latestValues = await getLatestValuesFromDatabase();
//     res.locals.latestValues = latestValues; // 將最新的數值存儲在 res.locals 中
//     next();
//   } catch (error) {
//     console.error("Error fetching latest values:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// 在渲染頁面時，使用前端模板引擎將最新的數值插入到側邊欄位中
// app.get("/renderPage", (req, res) => {
//   const latestValues = res.locals.latestValues;
//   // 這裡返回渲染頁面的程式碼，並將 latestValues 傳遞給前端模板引擎
// });

//緊急停止按紐也要做

// module.exports = {
//   myMiddleware,
// };
