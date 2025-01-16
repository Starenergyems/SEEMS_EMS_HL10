// app.js
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const cron = require("node-cron"); //指定幾點做什麼
const EventEmitter = require("events");
const cookieParser = require("cookie-parser");
const port = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require("dotenv").config();
const {
  getconfig,
  submit,
  authentication,
  findaccount,
  updateaccount,
} = require("./rLogin");
const { fetchDataAndNotify } = require("./lineForPower.js");
const { sendSlackNotification } = require("./slack_api.js");
const {
  getDailyReportData,
  getMonthlyReportData,
  getYearReportData,
  startHourlyCheck,
} = require("./getReportData.js");
const { delprocessDocs, resetRequestCount } = require("./alarmFilter.js");
const { startMonitoring, startMonitoring400087 } = require("./heartbeat.js");
const schedule = require("node-schedule");
const config = require("./config");
const moment = require("moment");
const { autoDownload } = require("./rReport");
const axios = require("axios");
//const fetch = require("node-fetch");
//如果要換資料庫的host 改掉".database"

const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const { mapL_M_systemMode, scaleProcess, mapminSOH } = require("./function");
const { sendLineNotify } = require("./line");
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
const GC01nanoDb = nano.use("gc_rf01");
const DCnanoDb = nano.use("dc_rf10");
const lc1nanoDb = nano.use("lc1_rf10");
const lc2nanoDb = nano.use("lc2_rf10");
const lc3nanoDb = nano.use("lc3_rf10");
const lc4nanoDb = nano.use("lc4_rf10");
const alarmnanoDb = nano.use("alarm");
const report_hourDb = nano.use("report_hour");
const report_dayDb = nano.use("report_day");
const powerusageDb = nano.use("powerusage");
const report_monthlyDb = nano.use("report_monthly");

//***************************************************************************************************************** */
//時間索引
const indexDef = {
  index: { fields: ["time"] },
  name: "time_index",
};
//***************************************************************************************************************** */
// 為每個資料庫創建針對時間的索引
GCnanoDb.createIndex(indexDef);
GC01nanoDb.createIndex(indexDef);
DCnanoDb.createIndex(indexDef);
otherrf10nanoDb.createIndex(indexDef);
otherrf01nanoDb.createIndex(indexDef);
lc1nanoDb.createIndex(indexDef);
lc2nanoDb.createIndex(indexDef);
lc3nanoDb.createIndex(indexDef);
lc4nanoDb.createIndex(indexDef);
alarmnanoDb.createIndex(indexDef);
report_hourDb.createIndex(indexDef);
report_dayDb.createIndex(indexDef);
powerusageDb.createIndex(indexDef);
report_monthlyDb.createIndex(indexDef);
//***************************************************************************************************************** */
// Login page. URL = "/login", LOGIN_URL can redirect.
app.get("/login", async (req, res) => {
  // console.log("login lalala")
  res.clearCookie("token");
  const response = await getconfig();
  //console.log(response);
  let logintext = response["logintext"];
  //let logintext = "hi";
  getData();
  const Values = await getLatestValuesFromDatabase();
  //沒有計算 純粹讀取+換算
  const Values2 = await getLatestValuesFromDatabaseforother();

  var latestValues = {
    permission: req.body.permission,
    userAccount: req.body.id,
    totalAlarmNum: Values[0],
    AlarmNum_Sys: Values[1], //新增`
    AlarmNum_Bat: Values[2],
    AlarmNum_PCS: Values[3],
    AlarmNum_FF: Values[4],
    AlarmNum_Env: Values[5],
    AlarmNum_Meter: Values[6],
    //
    totalWarningNum: Values[7],
    WarningNum_Sys: Values[8], //新增
    WarningNum_Bat: Values[9],
    WarningNum_PCS: Values[10],
    WarningNum_FF: Values[11],
    WarningNum_Env: Values[12],
    WarningNum_Meter: Values[13],
  };

  var latestValues2 = {
    L_M_systemMode: Values2[0],
    L_M_freq: Values2[1],
    L_M_activeP: Values2[2],
    L_M_reactiveP: Values2[3],
    L_M_voltage: Values2[4],
    L_M_current: Values2[5],
    L_M_powerFactor: Values2[6],
    L_M_avgSOC: Values2[7],
    L_M_minSOH: Values2[8],
    L_M_SBSPM: Values2[9],
    L_M_chgEtoday: Values2[10],
    L_M_dcgEtoday: Values2[11],
  };
  // const response["logintext"] === undefined? logintext="" : logintext=response["logintext"];
  // console.log(logintext);
  // console.log("eee")
  const context = {
    logintext: `${logintext}`,
  };
  res.render("Login", { context: context, latestValues, latestValues2 });
});

app.get(["/", "/signin"], (req, res) => {
  res.redirect("/login");
});

//////////////////////////////////////////////////////////////////////////////

app.post("/login", async (req, res) => {
  try {
    // console.log(req.ip);
    const email = req.body["username"];
    const password = req.body["password"];
    //console.log(`Input Data：\nUSERMAIL = ${email}\nPASSWORD = ${password}`);
    // const config = await getconfig()
    // console.log(config.duration*3600)
    const response = await submit(email, password);
    if (response["result"] === true && response["repwd"] !== 1) {
      res.cookie("token", response["token"], {
        maxAge: 3600000, // 1 hour in milliseconds
        httpOnly: true, // Optional, makes the cookie accessible only via HTTP(S) requests, not JavaScript
      });
      //{ maxAge: config.duration*3600, httpOnly: true }
      //, { maxAge: 10, httpOnly: true });
      // if cookies add this the cookies will live 10s, and will not abandon after close browser.
      //const localhost = "localhost";
      const HOST_IP = process.env.HOST_IP;
      res.json({ redirect: `/mode` });
    } else if (response["result"] === true && response["repwd"] === 1) {
      res.cookie("token", response["token"], {
        maxAge: 3600000, // 1 hour in milliseconds
        httpOnly: true, // Optional, makes the cookie accessible only via HTTP(S) requests, not JavaScript
      });
      res.json({ redirect: `/repassword` });
    } else {
      res.json({ text: response["text"] });
      // res.status(401).send(response["text"]);
    }
    // addlog(response["id"],response["text"])
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//////////////////////////////////////////////////////////////////////////////
app.get("/repassword", async (req, res) => {
  const config = await getconfig();
  // console.log(config)
  const content = {
    minTotal: config.atleast,
    maxTotal: config.atmost,
    minUpper: config.upper,
    minLower: config.lower,
    minSpe: config.special,
    minNum: config.number,
  };
  res.render("repassword", content);
});

app.post("/repassword", async (req, res) => {
  console.log("repassword");
  try {
    const config = await getconfig();
    // const token = req.cookies.token
    const response = req.body;
    const old = response.old;
    const newa = response.newa;
    const newb = response.newb;
    const token = req.cookies.token;
    const account = await findaccount("", token);
    const id = account.id;
    let password = account.password;
    let digitCount = 0;
    let upperCaseCount = 0;
    let lowerCaseCount = 0;
    let specialCharCount = 0;
    // console.log("gagaaga")
    for (let i = 0; i < newa.length; i++) {
      const char = newa[i];
      if (/[0-9]/.test(char)) {
        digitCount++;
      } else if (/[A-Z]/.test(char)) {
        upperCaseCount++;
      } else if (/[a-z]/.test(char)) {
        lowerCaseCount++;
      } else {
        specialCharCount++;
      }
    }
    // console.log(password, old, newa, newb)
    // console.log(digitCount, upperCaseCount, lowerCaseCount, specialCharCount)
    // console.log(config["number"], config["upper"], config["lower"], config["special"])

    if (
      password !== old ||
      old === newa ||
      newa !== newb ||
      old === "" ||
      newa === "" ||
      newb === "" ||
      digitCount < config["number"] ||
      upperCaseCount < config["upper"] ||
      lowerCaseCount < config["lower"] ||
      specialCharCount < config["special"]
    ) {
      console.log("Input data error.");
      res.json({ text: `輸入資料錯誤` });
    } else {
      password = newa;
      await updateaccount(id, "", password, "", (repwd = 0));
      console.log("Change password success.");
      res.json({ redirect: `/mode` });
      // return res.redirect(302, "/mode");
      // console.log("跳轉失敗")
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//身分驗證
app.use("*", async (req, res, next) => {
  try {
    const authenticated = await authentication(req);
    if (authenticated === false) {
      return res.redirect(302, "/login");
    } else if (authenticated === 1) {
      return res.redirect(302, "/repassword");
    } else {
      req.customData = authenticated;
      req.body.id = authenticated.id;
      req.body.permission = authenticated.permission;
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//***************************************************************************************************************** */
//側欄用
const lc1_rf10 = "lc1_rf10";
const lc01Db = nano.use(lc1_rf10);
const lc2_rf10 = "lc2_rf10";
const lc02Db = nano.use(lc2_rf10);
const lc3_rf10 = "lc3_rf10";
const lc03Db = nano.use(lc3_rf10);
const lc4_rf10 = "lc4_rf10";
const lc04Db = nano.use(lc4_rf10);
const other_rf01 = "other_rf01";
const other_rf10 = "other_rf10";
const rf01Db = nano.use(other_rf01);
const rf10Db = nano.use(other_rf10);
let ChgEtoday0 = 0;
let DcgEtoday0 = 0;
let flag = 0;

async function getData() {
  const now = moment();
  const startOfDay = moment().startOf("day").add(1, "second"); // 當天的第二秒
  if (flag === 0 || now.isSame(startOfDay, "day")) {
    const night = moment()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.000[Z]");
    const nightoneseconds = moment()
      .set({ hour: 0, minute: 1, second: 0, millisecond: 0 })
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

    const filterTime = {
      selector: {
        time: {
          $gte: night,
          $lte: nightoneseconds,
        },
      },
      limit: 10,
    };

    const midnightData = await rf01Db.find(filterTime);
    //console.log("midnightData", midnightData);

    //discharge capacity
    for (let i = 0; i < 10; i++) {
      if (
        midnightData.docs[i] &&
        midnightData.docs[i].Freq["408030"] !== null
      ) {
        const expValue = midnightData.docs[i].Freq["408030"];
        //console.log("i: " , i);
        //console.log("expValue: " , expValue);
        //charge capacity
        const impValue = midnightData.docs[i].Freq["408028"];
        //console.log("impValue: " , impValue);
        // 更新全域變數
        ChgEtoday0 = impValue; //408028 充電
        DcgEtoday0 = expValue; //408030 放電
        //console.log("零時的用電度數: " + ChgEtoday0 + " / " + DcgEtoday0);
        // 退出迴圈
        break;
      }
    }

    //console.log("呼叫getdata");
    flag = 1;
  }
}

/************************************************************************* */
//Navbar資料api

const mangoQuery = {
  selector: {
    time: { $exists: true },
  },
  sort: [{ time: "desc" }],
  limit: 1,
};

app.get("/navbar", async (req, res) => {
  try {
    // 呼叫函式並取
    getData();
    const Values = await getLatestValuesFromDatabase();
    //沒有計算 純粹讀取+換算
    const Values2 = await getLatestValuesFromDatabaseforother();

    var latestValues = {
      permission: req.body.permission,
      userAccount: req.body.id,
      totalAlarmNum: Values[0],
      AlarmNum_Sys: Values[1], //新增
      AlarmNum_Bat: Values[2],
      AlarmNum_PCS: Values[3],
      AlarmNum_FF: Values[4],
      AlarmNum_Env: Values[5],
      AlarmNum_Meter: Values[6],
      //
      totalWarningNum: Values[7],
      WarningNum_Sys: Values[8], //新增
      WarningNum_Bat: Values[9],
      WarningNum_PCS: Values[10],
      WarningNum_FF: Values[11],
      WarningNum_Env: Values[12],
      WarningNum_Meter: Values[13],
    };

    var latestValues2 = {
      L_M_systemMode: Values2[0],
      L_M_freq: Values2[1],
      L_M_activeP: Values2[2],
      L_M_reactiveP: Values2[3],
      L_M_voltage: Values2[4],
      L_M_current: Values2[5],
      L_M_powerFactor: Values2[6],
      L_M_avgSOC: Values2[7],
      L_M_minSOH: Values2[8],
      L_M_SBSPM: Values2[9],
      L_M_chgEtoday: Values2[10],
      L_M_dcgEtoday: Values2[11],
    };
    //console.log("latestValues",latestValues);
    res.send({ latestValues, latestValues2 });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
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
    // console.log(
    //   "*************************統計********************************"
    // );
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
      Alarm_ENV_num,
      Alarm_meter_num,
    ];
  } catch (error) {
    console.error("Error fetching latest values from alarm database:", error);
    throw error; // 把錯誤向外傳遞
  }
}

// 創建一個函數來從資料庫中獲取最新的數值
async function getLatestValuesFromDatabaseforother() {
  try {
    const [gcBody, rf01Body, lc1Body, lc2Body, lc3Body, lc4Body] =
      await Promise.all([
        GCnanoDb.createIndex(indexDef).then(() => GCnanoDb.find(mangoQuery)),
        otherrf01nanoDb
          .createIndex(indexDef)
          .then(() => otherrf01nanoDb.find(mangoQuery)),
        lc1nanoDb.createIndex(indexDef).then(() => lc1nanoDb.find(mangoQuery)),
        lc2nanoDb.createIndex(indexDef).then(() => lc2nanoDb.find(mangoQuery)),
        lc3nanoDb.createIndex(indexDef).then(() => lc3nanoDb.find(mangoQuery)),
        lc4nanoDb.createIndex(indexDef).then(() => lc4nanoDb.find(mangoQuery)),
      ]);

    // 取得每個資料庫的第一條資料
    const gcData = gcBody.docs[0];
    const otherrf01Data = rf01Body.docs[0];
    const lc1Data = lc1Body.docs[0];
    const lc2Data = lc2Body.docs[0];
    const lc3Data = lc3Body.docs[0];
    const lc4Data = lc4Body.docs[0];
    //console.log("++++gcData ",gcData);
    const L_M_systemMode = mapL_M_systemMode(
      gcData.System["400078"],
      gcData.System["400079"],
      gcData.System["400080"],
      gcData.System["400081"]
    );

    //系統資訊(純數值顯示)

    const L_M_freq = scaleProcess(otherrf01Data.Freq[408026] / 65536, 1, 3);
    const L_M_activeP = scaleProcess(
      (otherrf01Data.Freq[408019] * 200 * 100) / 65536,
      0.001,
      1
    ); //data*CT*PT/655356
    const L_M_reactiveP = scaleProcess(
      (otherrf01Data.Freq[408021] * 200 * 100) / 65536,
      0.001,
      1
    );
    const L_M_voltage = scaleProcess(
      (otherrf01Data.Freq[408007] * 100) / 65536,
      0.001,
      2
    ); //data*PT/65536
    const L_M_curren = scaleProcess(
      (otherrf01Data.Freq[408017] * 200) / 65536,
      1,
      2
    ); //data*CT/65536
    const L_M_powerFactor = scaleProcess(
      Math.abs(gcData.IEC61850[400127]),
      0.01,
      2
    );
    const L_M_avgSOC = scaleProcess(
      gcData.IEC61850[400129] / (447200 * 7),
      100,
      1
    ); //單位kwh轉%，7台4472
    const L_M_minSOH = scaleProcess(
      mapminSOH(
        lc1Data.BMS1[404005],
        lc1Data.BMS2[404005],
        lc2Data.BMS1[404005],
        lc2Data.BMS2[404005],
        lc3Data.BMS1[404005],
        lc3Data.BMS2[404005],
        lc4Data.BMS1[404005]
      ),
      0.1,
      1
    );
    const L_M_SBSPM = scaleProcess(gcData.System[400037], 0.01, 1);
    const L_M_chgEtoday = scaleProcess(
      otherrf01Data.Freq["408028"] - ChgEtoday0,
      0.1,
      1
    ); //408028 kWh_Import
    const L_M_dcgEtoday = scaleProcess(
      otherrf01Data.Freq["408030"] - DcgEtoday0,
      0.1,
      1
    ); //408030 kWh_Export

    //console.log("現在充電: " + L_M_chgEtoday);
    // console.log("零時充電: " + ChgEtoday0);
    // console.log("當日充電: " + otherrf01Data.Freq["408028"]);

    //console.log("現在放電: " + L_M_dcgEtoday);
    // console.log("零時放電: " + DcgEtoday0);
    // console.log("當日放電: " + otherrf01Data.Freq["408030"]);
    return [
      L_M_systemMode,
      L_M_freq,
      L_M_activeP,
      L_M_reactiveP,
      L_M_voltage,
      L_M_curren,
      L_M_powerFactor,
      L_M_avgSOC,
      L_M_minSOH,
      L_M_SBSPM,
      L_M_chgEtoday,
      L_M_dcgEtoday,
    ];
  } catch (error) {
    console.error("Error fetching latest values from alarm database:", error);
    throw error; // 把錯誤向外傳遞ogin fail
  }
}

//***************************************************************************************************************** */
const accountRouter = require("./rAccount");
const modeRouter = require("./rMode");
const meterRouter = require("./rMeter");
const pcsRouter = require("./rPCS");
const batteryRouter = require("./rBattery");
const commuRouter = require("./rCommu");
const deviceRouter = require("./rDevice");
const environmentRouter = require("./rEnvironment");
const eventRouter = require("./rEvent");
const reportRouter = require("./rReport");
const chartRouter = require("./rChart");
const alarmRouter = require("./rAlarm");
// const { nextTick } = require("process");-**-/*-/*-

const login = require("./rLogin");
const { permission } = require("process");

//***************************************************************************************************************** */
// 使用這些路由
// // app.use(authentication)
app.use(accountRouter);
app.use(modeRouter);
app.use(meterRouter);
app.use(pcsRouter);
app.use(batteryRouter);
app.use(commuRouter);
app.use(deviceRouter);
app.use(environmentRouter);
app.use(eventRouter);
app.use(reportRouter);
app.use(chartRouter);
app.use(alarmRouter);

//***************************************************************************************************************** */

app.get("/error", (req, res) => {
  res.render("error");
});

server.listen(port, () => {
  console.log(`4-1 應用程式正在監聽端口 ${port}`);
  const emsnumber = process.env.EMS_NUM;
  const HOST_IP = process.env.HOST_IP;
  const message = {
    device: "Server",
    tag: "Reboot",
    value: "1",
    occurrence_time: new Date(),
    recover: false,
    level: "Alarm",
    content: `EMS${emsnumber}主程式重新啟動 !! 主機IP為：${HOST_IP}`,
  };

  sendLineNotify(message.content); // 只發送文字訊息至 LINE
  sendSlackNotification(message); // 發送物件到 Slack
});

// 在應用程式結束時，關閉伺服器
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    const emsnumber = process.env.EMS_NUM;
    const HOST_IP = process.env.HOST_IP;
    const message = `
  EMS${emsnumber}主程式已停止運作 !!
  主機IP為：${HOST_IP}`;
    sendLineNotify(message);
    sendSlackNotification(message);
    process.exit(0);
  });
});

//////////////////////////////////////////////////////////////////////////////

// app.get("/health", (req, res) => {
//   const isHealthy = true;
//   if (isHealthy) {
//     res.status(200).json({ status: "OK" });
//   } else {
//     res.status(500).json({ status: "Error" });
//   }
// });

//module.exports = { nano };
app.get("/getPermission", (req, res) => {
  var permission = req.body.permission;
  res.send({ permission: permission });
});

startHourlyCheck();

let isRunning = false;

schedule.scheduleJob("0 8 * * *", async () => {
  if (isRunning) {
    //console.log("Task is already running. Skipping...");
    return;
  }
  isRunning = true; // 設置鎖
  try {
    await fetchDataAndNotify();
  } catch (error) {
    console.error("Error during task execution:", error);
  } finally {
    isRunning = false; // 解鎖
  }
});

// 1. 定期在當天 00:30 執行日報生成，傳入前一天的時間
cron.schedule("30 0 * * *", async () => {
  const specifiedTime = moment().subtract(1, "days").startOf("day");
  console.log(`執行日報生成，傳入時間：${specifiedTime.format()}`);
  await getDailyReportData(specifiedTime);
});

// 2. 定期在每月 1 日 01:15 執行月報生成，傳入前一個月的時間並指定為每月1日1:15
cron.schedule("30 1 1 * *", async () => {
  const specifiedTime = moment().subtract(1, "months").startOf("month").set({
    hour: 1,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  console.log(`執行月報生成，傳入時間：${specifiedTime.format()}`);
  await getMonthlyReportData(specifiedTime);
});

// 3. 每年 1 月 1 日 02:00:00 執行年報生成，傳入前一年的時間
cron.schedule("0 0 2 1 *", async () => {
  const specifiedTime = moment().subtract(1, "years").startOf("year");
  console.log(`執行年報生成，傳入時間：${specifiedTime.format()}`);
  await getYearReportData(specifiedTime);
});

resetRequestCount();
setInterval(delprocessDocs, 2000);
startMonitoring();
startMonitoring400087();
