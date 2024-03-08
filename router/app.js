// app.js
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const EventEmitter = require("events");
const cookieParser = require("cookie-parser");
const port = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require("dotenv").config();
const { submit } = require("./rLogin");
const schedule = require("node-schedule");
const config = require("./config");
//如果要換資料庫的host 改掉".database"

const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const { mapL_M_systemMode, scaleProcess, mapminSOH } = require("./function");

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
//資料庫引入
const otherrf01nanoDb = nano.use("other_rf01");
const otherrf10nanoDb = nano.use("other_rf10");
const GCnanoDb = nano.use("gc_rf10");
const DCnanoDb = nano.use("dc_rf10");
const lc1nanoDb = nano.use("lc1_rf10");
const lc2nanoDb = nano.use("lc2_rf10");
const lc3nanoDb = nano.use("lc3_rf10");
const lc4nanoDb = nano.use("lc4_rf10");
const alarmnanoDb = nano.use("alarm");

//***************************************************************************************************************** */
//時間索引
const indexDef = {
  index: { fields: ["time"] },
  name: "time_index",
};
//***************************************************************************************************************** */
// 為每個資料庫創建針對時間的索引
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
app.get("/", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body["username"];
    const password = req.body["password"];
    console.log(`Input Data：\nUSERMAIL = ${email}\nPASSWORD = ${password}`);

    const response = await submit(email, password);
    if (response["result"] === true) {
      console.log(response["text"]);
      res.cookie("token", response["token"]);
      //, { maxAge: 10, httpOnly: true });
      // if cookies add this the cookies will live 10s, and will not abandon after close browser.
      res.json({ redirect: "http://localhost:3000/operateinfo" });
    } else {
      res.status(401).send(response["text"]);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//身分驗證 暫時關閉
app.use("*", async (req, res, next) => {
  try {
    const authenticated = await authentication(req);
    if (authenticated === false) {
      return res.status(401).send("Unauthorized");
    } else {
      req.body = authenticated;
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//***************************************************************************************************************** */
//中介軟體 - 在每個請求上設置 navbarData 和其他變數
// 創建資料庫實例
const today = new Date();
const midnight = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  0,
  0,
  0,
  0
); // 當天 00:00:00:000
const mangoQueryforday = {
  selector: {
    time: { $gt: midnight.getTime() },
  },
  sort: [{ time: "desc" }],
  limit: 1,
};
// 創建定時任務
// 定義每天的 00:00:00 觸發的規則
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.second = 0;

let ChgEtoday0 = 0;
let DcgEtoday0 = 0;

// 創建定時任務
const job = schedule.scheduleJob(rule, async () => {
  try {
    // 執行資料庫查詢
    const result = await otherrf01nanoDb.find(mangoQueryforday);
    const otherrf01Data = result.docs[0];

    // 讀取相應的值並存入全域變數
    ChgEtoday0 = otherrf01Data.Freq[408028];
    DcgEtoday0 = otherrf01Data.Freq[408030];

    console.log("ChgEtoday0:", ChgEtoday0);
    console.log("mapDcgEtoday0:", DcgEtoday0);

    // 取消定時任務
    job.cancel();
  } catch (error) {
    console.error("Error:", error);
  }
});

const mangoQuery = {
  selector: {
    time: { $exists: true },
  },
  sort: [{ time: "desc" }],
  limit: 1,
};

//let navbarData = null; // 定義一個全局變數用於存儲 navbarData
app.use(async (req, res, next) => {
  //console.log("navbarDataObject", navbarDataObject);

  console.log("****res.locals", res.locals);
  const number = 99998888;
  res.locals.number = number;
  console.log("****res.locals", res.locals);
  // try {
  //   //req.locals = {};
  //   // 為每個資料庫創建索引並發送查詢
  //   const latestData = await getLatestValuesFromDatabase();
  //   console.log("latestData 輸出輸出輸出:" + latestData);
  //   Promise.all([
  //     GCnanoDb.createIndex(indexDef).then(() => GCnanoDb.find(mangoQuery)),
  //     otherrf01nanoDb
  //       .createIndex(indexDef)
  //       .then(() => otherrf01nanoDb.find(mangoQuery)),
  //     lc1nanoDb.createIndex(indexDef).then(() => lc1nanoDb.find(mangoQuery)),
  //     lc2nanoDb.createIndex(indexDef).then(() => lc2nanoDb.find(mangoQuery)),
  //     lc3nanoDb.createIndex(indexDef).then(() => lc3nanoDb.find(mangoQuery)),
  //     lc4nanoDb.createIndex(indexDef).then(() => lc4nanoDb.find(mangoQuery)),
  //   ])
  //     .then(([gcBody, rf01Body, lc1Body, lc2Body, lc3Body, lc4Body]) => {
  //       const gcData = gcBody.docs[0];
  //       const otherrf01Data = rf01Body.docs[0];
  //       const lc1Data = lc1Body.docs[0];
  //       const lc2Data = lc2Body.docs[0];
  //       const lc3Data = lc3Body.docs[0];
  //       const lc4Data = lc4Body.docs[0];

  //       // 在這裡將數據返回給前端或進行其他處理
  //       //req.body = { hello: "dsdjhsfjsfbjsb" };

  //       // 在 middleware 中設置全域變數
  //       app.use(async (req, res, next) => {
  //         try {
  //           req.locals = {};
  //           // 為每個資料庫創建索引並發送查詢
  //           const latestData = await getLatestValuesFromDatabase();
  //           console.log("輸出輸出輸出:" + latestData);
  //           Promise.all([
  //             GCnanoDb.createIndex(indexDef).then(() =>
  //               GCnanoDb.find(mangoQuery)
  //             ),
  //             otherrf01nanoDb
  //               .createIndex(indexDef)
  //               .then(() => otherrf01nanoDb.find(mangoQuery)),
  //             lc1nanoDb
  //               .createIndex(indexDef)
  //               .then(() => lc1nanoDb.find(mangoQuery)),
  //             lc2nanoDb
  //               .createIndex(indexDef)
  //               .then(() => lc2nanoDb.find(mangoQuery)),
  //             lc3nanoDb
  //               .createIndex(indexDef)
  //               .then(() => lc3nanoDb.find(mangoQuery)),
  //             lc4nanoDb
  //               .createIndex(indexDef)
  //               .then(() => lc4nanoDb.find(mangoQuery)),
  //           ])
  //             .then(
  //               ([gcBody, rf01Body, lc1Body, lc2Body, lc3Body, lc4Body]) => {
  //                 const gcData = gcBody.docs[0];
  //                 const otherrf01Data = rf01Body.docs[0];
  //                 const lc1Data = lc1Body.docs[0];
  //                 const lc2Data = lc2Body.docs[0];
  //                 const lc3Data = lc3Body.docs[0];
  //                 const lc4Data = lc4Body.docs[0];

  //                 // 將所有資料轉換為鍵值對形式
  //                 const navbarData = {
  //                   title: "模式控制",
  //                   stylesheets: [
  //                     "../public/styles/style_template.css",
  //                     "../public/styles/Mode_SysCtrl.css",
  //                   ],
  //                   permission: "admin",
  //                   //******************************************************************************* */
  //                   //綠黃紅 調頻服務中、部分運轉、暫停服務 bit4+bit5
  //                   L_M_systemMode: mapL_M_systemMode(
  //                     gcData.System["400078"],
  //                     gcData.System["400079"],
  //                     gcData.System["400080"],
  //                     gcData.System["400081"]
  //                   ),

  //                   //右邊******************************************************************************* */
  //                   //Warning 警告 右邊 黃色
  //                   //計算*告警*總數
  //                   //列出條件

  //                   totalWarningNum: latestData[7],
  //                   WarningNum_Meter: latestData[13],
  //                   WarningNum_PCS: latestData[10],
  //                   WarningNum_Bat: latestData[9],
  //                   WarningNum_Env: latestData[12],
  //                   WarningNum_FF: latestData[11],
  //                   //AlarmNum_sys: latestData[8],

  //                   //左邊******************************************************************************* */
  //                   //計算*錯誤*總數 Alarm (紅色 左邊 錯誤)
  //                   totalAlarmNum: latestData[0],
  //                   AlarmNum_Meter: latestData[6],
  //                   AlarmNum_PCS: latestData[3],
  //                   AlarmNum_Bat: latestData[2],
  //                   AlarmNum_Env: latestData[5],
  //                   AlarmNum_FF: latestData[4],
  //                   //WarningNum_System: latestData[1],

  //                   //*********************************************************************************** */
  //                   //下方******************************************************************************* */
  //                   //系統資訊(純數值顯示)

  //                   L_M_freq: scaleProcess(otherrf01Data.Freq[408026], 1, 3),
  //                   L_M_activeP: scaleProcess(otherrf01Data.Freq[408019], 1, 1),
  //                   L_M_reactiveP: scaleProcess(
  //                     otherrf01Data.Freq[408021],
  //                     1,
  //                     1
  //                   ),
  //                   L_M_voltage: scaleProcess(otherrf01Data.Freq[408007], 1, 3),
  //                   L_M_current: scaleProcess(otherrf01Data.Freq[408017], 1, 2),
  //                   L_M_powerFactor: scaleProcess(
  //                     otherrf01Data.Freq[408025],
  //                     1,
  //                     3
  //                   ),
  //                   L_M_avgSOC: scaleProcess(gcData.IEC61850[400129], 1, 3),
  //                   L_M_minSOH: mapminSOH(
  //                     lc1Data.BMS1[404005],
  //                     lc1Data.BMS2[404005],
  //                     lc2Data.BMS1[404005],
  //                     lc2Data.BMS2[404005],
  //                     lc3Data.BMS1[404005],
  //                     lc3Data.BMS2[404005],
  //                     lc4Data.BMS1[404005],
  //                     lc4Data.BMS2[404005]
  //                   ),
  //                   L_M_SBSPM: scaleProcess(gcData.System[400037], 1, 0),
  //                   L_M_chgEtoday: otherrf01Data.Freq[408028] - ChgEtoday0, //408028 kWh_Import
  //                   L_M_dcgEtoday: otherrf01Data.Freq[408030] - DcgEtoday0, //408030 kWh_Export
  //                 };

  //                 // 將所有資料轉換為鍵值對形式
  //                 const navbarDataEntries = Object.entries(navbarData);

  //                 // 將鍵值對數組轉換為物件
  //                 const navbarDataObject = navbarDataEntries.reduce(
  //                   (acc, [key, value]) => {
  //                     acc[key] = value;
  //                     return acc;
  //                   },
  //                   {}
  //                 );

  //                 // 將轉換後的資料放入 res.locals 中
  //                 res.locals.navbarData = navbarDataObject;
  //               }
  //             )
  //             .catch((err) => {
  //               console.error("Error:", err);
  //               res.status(500).send("Internal Server Error");
  //             });

  //           next();
  //         } catch (error) {
  //           // 處理錯誤
  //           console.error("無法執行 Mango 查詢：", error);
  //           res.status(500).send("Internal Server Error");
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       console.error("Error:", err);
  //       res.status(500).send("Internal Server Error");
  //     });

  //   //NavbarData = res.locals.navbarData;
  //   next();
  // } catch (error) {
  //   // 處理錯誤
  //   console.error("無法執行 Mango 查詢：", error);
  //   res.status(500).send("Internal Server Error");
  // }
  next();
});

// 創建一個函數來從資料庫中獲取最新的數值
async function getLatestValuesFromDatabase() {
  try {
    // 執行查詢操作以獲取最新的數值
    const alarmData = await alarmnanoDb.find({
      selector: { time: { $exists: true } },
      sort: [{ time: "desc" }],
      limit: 1000,
    });

    let Fault_system_num = 0;
    let Fault_battery_num = 0;
    let Fault_pcs_num = 0;
    let Fault_FFS_num = 0;
    let Fault_ENV_num = 0;
    let Fault_meter_num = 0;
    let Fault_num = 0;

    let Alarm_system_num = 0;
    let Alarm_battery_num = 0;
    let Alarm_pcs_num = 0;
    let Alarm_FFS_num = 0;
    let Alarm_ENV_num = 0;
    let Alarm_meter_num = 0;
    let Alarm_num = 0;

    for (let i = 0; i < alarmData.docs.length; i++) {
      // console.log(
      //   "***********************************************************"
      // );
      id = alarmData.docs[i]._id;
      // 使用 split 方法將字串以冒號分割成陣列，並取得最後一個元素
      const parts = id.split(":");
      const tag = parts[2]; // 4xxxxx
      const bits = parts[3]; // 位元值
      // console.log(
      //   "alarmData.docs._id: " + alarmData.docs[i]._id + "/ tag: " + tag,
      //   "/ bits: " + bits
      // );
      // console.log(
      //   i +
      //     " level:" +
      //     alarmData.docs[i].level +
      //     "  category:" +
      //     alarmData.docs[i].category
      // );
      //還沒復歸的
      if (alarmData.docs[i].recover === false) {
        //一個點內包含告警和錯誤
        if (tag === 406005) {
          //console.log("我屬於406005");
          if (bits === 0 || bits === 1) {
            Alarm_FFS_num++;
          } else if (bits === 2) {
            Fault_FFS_num++;
          }
        } else {
          //console.log("我有到等級區分");
          if (alarmData.docs[i].level === "Fault") {
            //console.log("我是錯誤 表上其實alarm");
            //錯誤
            if (alarmData.docs[i].category === "system") {
              Fault_system_num++;
            } else if (alarmData.docs[i].category === "battery") {
              Fault_battery_num++;
            } else if (alarmData.docs[i].category === "PCS") {
              Fault_pcs_num++;
            } else if (alarmData.docs[i].category === "FFS") {
              Fault_FFS_num++;
            } else if (alarmData.docs[i].category === "ENV") {
              Fault_ENV_num++;
            } else if (alarmData.docs[i].category === "meter") {
              Fault_meter_num++;
            } else {
              //特殊的點 不同的類型
              if (tag === 406001) {
                if (bits === 24 || bits === 25) {
                  Fault_meter_num++;
                } else {
                  Fault_FFS_num++;
                }
              } else if (tag === 406003) {
                if (bits === 23 || bits === 25 || bits === 26 || bits === 27) {
                  Fault_meter_num++;
                } else if (bits >= 0 && bits <= 15) {
                  Fault_FFS_num++;
                }
              }
            }
          }
          //警告
          if (alarmData.docs[i].level === "Alarm") {
            //console.log("我是警告");
            if (alarmData.docs[i].category === "system") {
              Alarm_system_num++;
            } else if (alarmData.docs[i].category === "battery") {
              Alarm_battery_num++;
            } else if (alarmData.docs[i].category === "PCS") {
              Alarm_pcs_num++;
            } else if (alarmData.docs[i].category === "FFS") {
              Alarm_FFS_num++;
            } else if (alarmData.docs[i].category === "ENV") {
              Alarm_ENV_num++;
            } else if (alarmData.docs[i].category === "meter") {
              Alarm_meter_num++;
            } else {
              //特殊的點 不同的類型
              if (tag === 406001) {
                if (bits === 24 || bits === 25) {
                  Alarm_meter_num++;
                } else {
                  Alarm_FFS_num++;
                }
              } else if (tag === 406003) {
                if (bits === 23 || bits === 25 || bits === 26 || bits === 27) {
                  Alarm_meter_num++;
                } else if (bits >= 0 && bits <= 15) {
                  Alarm_FFS_num++;
                }
              }
            }
          }
        }
      }
    }

    Fault_num =
      Fault_system_num +
      Fault_battery_num +
      Fault_pcs_num +
      Fault_FFS_num +
      Fault_ENV_num +
      Fault_meter_num;

    Alarm_num =
      Alarm_system_num +
      Alarm_battery_num +
      Alarm_pcs_num +
      Alarm_FFS_num +
      Alarm_ENV_num +
      Alarm_meter_num;
    console.log(
      "*************************統計********************************"
    );
    // console.log("Fault_system_num: " + Fault_system_num);
    // console.log("Fault_battery_num: " + Fault_battery_num);
    // console.log("Fault_FFS_num: " + Fault_FFS_num);
    // console.log("Fault_pcs_num: " + Fault_pcs_num);
    // console.log("Fault_ENV_num: " + Fault_ENV_num);
    // console.log("Fault_meter_num: " + Fault_meter_num);

    // console.log("Alarm_system_num: " + Alarm_system_num);
    // console.log("Alarm_battery_num: " + Alarm_battery_num);
    // console.log("Alarm_pcs_num: " + Alarm_pcs_num);
    // console.log("Alarm_FFS_num: " + Alarm_FFS_num);
    // console.log("Alarm_ENV_num: " + Alarm_ENV_num);
    // console.log("Alarm_meter_num: " + Alarm_meter_num);

    // console.log("Fault_num: " + Fault_num);
    // console.log("Alarm_num: " + Alarm_num);
    // console.log(alarmData.docs[1].category);
    // console.log(alarmData.docs[2].category);
    // 返回從資料庫中獲取的數值
    //return alarmData.docs[0];
    return [
      Fault_num,
      Fault_system_num,
      Fault_battery_num,
      Fault_pcs_num,
      Fault_FFS_num,
      Fault_ENV_num,
      Fault_meter_num,
      Alarm_num,
      Alarm_system_num,
      Alarm_battery_num,
      Alarm_pcs_num,
      Alarm_FFS_num,
      Alarm_ENV_num.Alarm_meter_num,
    ];
  } catch (error) {
    console.error("Error fetching latest values from alarm database:", error);
    throw error; // 把錯誤向外傳遞
  }
}

//***************************************************************************************************************** */
//const accountRouter = require("./rAccount");
const modeRouter = require("./rMode");
const meterRouter = require("./rMeter");
const pcsRouter = require("./rPCS");
const batteryRouter = require("./rBattery");
const commuRouter = require("./rCommu");
const deviceRouter = require("./rDevice");
const environmentRouter = require("./rEnvironment");
const eventRouter = require("./rEvent");
// reportRouter = require("./rReport");
const chartRouter = require("./rChart");
// const testRouter = require("./test");
const alarmRouter = require("./rAlarm");
// const { nextTick } = require("process");
// const middleware = require("./middleware");
// const login = require("./rLogin")
//app.use(authMiddleware);
const { authentication } = require("./authMiddleware");

//***************************************************************************************************************** */
// 使用這些路由
// app.use(authentication)
// app.use(accountRouter);
app.use(modeRouter);
app.use(meterRouter);
app.use(pcsRouter);
app.use(batteryRouter);
app.use(commuRouter);
app.use(deviceRouter);
app.use(environmentRouter);
app.use(eventRouter);
//app.use(reportRouter);
app.use(chartRouter);
//app.use(testRouter);
app.use(alarmRouter);
// app.use(middleware);

//***************************************************************************************************************** */

// app.get("/login", (req, res) => {
//   res.render("Login");
// });

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/health", (req, res) => {
  const isHealthy = true;
  if (isHealthy) {
    res.status(200).json({ status: "OK" });
  } else {
    res.status(500).json({ status: "Error" });
  }
});

server.listen(port, () => {
  console.log(`app.js 應用程式正在監聽端口 ${port}`);
});

// 在應用程式結束時，關閉伺服器
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// 新增定期更新函數，你需要根據實際需求實現這個函數
function updateDataPeriodically() {
  // 實現你的定期更新邏輯
  console.log("app.js : Data updated periodically...");
}

//module.exports = { nano };
