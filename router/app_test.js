// app.js
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const EventEmitter = require("events");
const cookieParser = require("cookie-parser");
const port = 8888;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const dataUpdateEmitter = new EventEmitter();
require("dotenv").config();
const { calculateAverage, calculateAdd } = require("./function");
const { getconfig, submit } =  require("./rLogin");

const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const couchDBUrl = "http://admin:ems45877096@192.168.8.101:5984";
const nanoDb = nano(couchDBUrl);

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
app.use(cookieParser());

// 定義 CouchDB 資料庫名稱
const databases = [
  "lc1_rf10", //0
  "lc2_rf10", //1
  "lc3_rf10", //2
  "lc4_rf10", //3
  "GC", //4
  "other_rf01", //5
  "other_rf10", //6
  "dwctrl", //7
];
// 創建 Nano 實例的函式
const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);

// 設定index
const getLatestDocument = async (nanoDb) => {
  const indexDef = {
    index: { fields: ["time"] },
    name: "time_index",
  };

  //建立index
  await nanoDb.createIndex(indexDef);

  //利用mango作為篩選器
  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
  };

  return new Promise((resolve, reject) => {
    nanoDb.find(mangoQuery, (err, body) => {
      if (err) {
        console.error("Error:", err);
        reject(err);
        return;
      }

      const latestData = body.docs[0]; //把資料存到latestData裡面
      //console.log(`Latest data from ${nanoDb.config.db}:`, latestData);
      resolve(latestData);
    });
  });
};

//***************************************************************************************************************** */

// 引入多個路由檔案
// const accountRouter = require("./rAccount");
// const modeRouter = require(".c/rMode");
// const meterRouter = require("./rMeter");
// const pcsRouter = require("./rPCS");
// const batteryRouter = require("./rBattery");
// const commuRouter = require("./rCommu");
// const deviceRouter = require("./rDevice");
// const environmentRouter = require("./rEnvironment");
// const alarmRouter = require("./rAlarm");
// const eventRouter = require("./rEvent");
// const reportRouter = require("./rReport");
// const chartRouter = require("./rChart");
// const testRouter = require("./test");
// const alarmFunctions = require("./alarmFunctions");

// app.use(submit)
// 使用驗證
// app.use(authMiddleware);

// 使用這些路由
// app.use(accountRouter);
// app.use(modeRouter);
// app.use(meterRouter);
// app.use(pcsRouter);
// app.use(batteryRouter);
// app.use(commuRouter);
// app.use(deviceRouter);
// app.use(environmentRouter);
// app.use(alarmRouter);
// app.use(eventRouter);
// app.use(reportRouter);
// app.use(chartRouter);
// app.use(testRouter);
// app.use(alarmFunctions);
// 查看目前連線路徑
// app.use(login)

//************************************************************* */

//中介軟體 - 在每個請求上設置 navbarData 和其他變數
// app.use(async (req, res, next) => {
//   try {
//     // 使用 map 遍歷所有資料庫名稱，創建 Nano 實例，並獲取最新文檔的 promise 陣列
//     const dataPromises = databases.map(async (dbName) => {
//       const nanoDb = createNanoInstance(dbName);
//       return getLatestDocument(nanoDb);
//     });

//     const allData = await Promise.all(dataPromises); // 取得所有資料庫的數值 存在陣列裡面 由零開始
//     const lc1Data = allData[0];
//     const lc2Data = allData[1];
//     const lc3Data = allData[2];
//     const lc4Data = allData[3];
//     const GCData = allData[4];
//     const Other01Data = allData[4];

//     // 將這些數值設置到 res.locals 中
//     res.locals.navbarData = {
//       title: "模式控制",
//       stylesheets: [
//         "../public/styles/style_template.css",
//         "../public/styles/Mode_SysCtrl.css",
//       ],
//       permission: "admin",

//       L_M_systemMode:
//         (GCData.System[400078],
//         GCData.System[400079],
//         GCData.System[400080],
//         GCData.System[400081]),
//       //400078~400081 bit15 + bit5  + bit3

//       //警告
//       totalWarningNum,
//       WarningNum_Meter: 0,
//       //408181:Oil temperature/408205: VCB Status(1、2)/408206:ACB Status(bit1 3 5)/Relay 408201-408203
//       WarningNum_PCS: calculateAverage(
//         lc1Data.PCS1[403002],
//         lc1Data.PCS1[403034],
//         lc1Data.PCS1[403035]
//       ),
//       WarningNum_Bat: lc1Data.BMS1[405028],
//       WarningNum_Env: lc1Data.BSC1[406003],
//       WarningNum_FF: lc1Data.BSC1[406005],
//       //錯誤
//       totalAlarmNum,
//       AlarmNum_Meter,
//       AlarmNum_PCS:
//         (lc1Data.PCS1[403001], lc1Data.PCS1[403036], lc1Data.PCS1[403038]),
//       AlarmNum_Bat: (lc1Data.BMS1[405030], lc1Data.BMS1[405032]),
//       AlarmNum_Env:
//         (lc1Data.BSC1[406001] + lc1Data.BSC1[406007] + lc1Data.BSC1[406060],
//         lc1Data.BSC1[406061]),
//       AlarmNum_FF: lc1Data.BSC1[406005],

//       //系統資訊
//       L_M_freq: Other01Data.Freq[408026],
//       L_M_activeP: Other01Data.Freq[408019],
//       L_M_reactiveP: Other01Data.Freq[408021],
//       L_M_voltage: Other01Data.Freq[408007],
//       L_M_current: Other01Data.Freq[408017],
//       L_M_powerFactor: Other01Data.Freq[408025],
//       L_M_avgSOC: (lc1Data.BMS1[404007], lc1Data.BMS2[404007]),
//       L_M_minSOH: (lc1Data.BMS1[404005], lc1Data.BMS2[404005]),
//       L_M_SBSPM: GCData.System[400037],
//       L_M_chgEtoday:
//         (lc1Data.BMS1[404079], lc1Data.BMS1[404080], lc1Data.BMS1[404081]),
//       L_M_dcgEtoday:
//         (lc1Data.BMS1[404082], lc1Data.BMS1[404083], lc1Data.BMS1[404084]),
//     };
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }

//   // 將其他變數也設置到 res.locals 中，這些是例子，實際上應該是你的應用的真實數值
//   res.locals.someOtherValue = "This is another value";

//   next();
// });

//緊急停止按紐也要做

app.get("/", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {
  // getconfig()
  submit()
  // initialize();
  console.log(5,req)})
  // When login page submit through backend to db
  
  // const username = req.body['username']
  // const password = req.body['password']
  // console.log(username, password)});


app.get("/login", (req, res) => {
  res.render("Login", { navbarData: res.locals.navbarData });
});

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
  console.log(`應用程式正在監聽端口 ${port}`);
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


// note
// 我也建議直接學jsx的框架，但基礎DOM的操作還是要有概念，bootstrap就不用浪費時間去摸了，直接改用tailwindcss比較有機會在不同框架裡面使用。

// 至於你想學vue、react還是其他新出的框架就真的比較沒差了，但我會建議找有支援jsx的框架，solid、qwik我覺得都還算蠻不錯的，但基底其實都是從react的概念延伸的，
// 如果後面想學full stack的話還可以轉使用 Next、remix這些框架，但是基礎的概念是一樣的。 

// 所以基礎觀念夠好、要摸不同的框架其實不難也蠻容易上手的，搞清楚自己學這個工具是要拿來處理怎樣的問題比較重要，不要因為別人學而學！

// const db_USERNAME = "admin"; // Couchdb username use for login db.
// const db_PASSWORD = "ems45877096"; // Couchdb password use for login db.
// const db_IP = "192.168.8.101"; // Couchdb IPv4 address.
// const db_PORT = "5984"; // Couchdb service use port.

// const db_account = "account"; // The account database name.
// const doc_CONFIG = "CONFIG"; // The account setting doc id.

// // login page html id variable declare
// const id_EMAIL = "userAccount"; // The email input element's id.
// const id_PASSWORD = "userPassword"; //  The password input element's id.
// const id_TEXT = ""; // Show hint text element's id.

// ////////////////////////////////////////////////////////////////////////////////////////
// // Do not need change.

// const db_URL = "http://" + db_IP + ":" + db_PORT; // Use for fetch database function.
// // const db_URL = couchDBUrl; // Use for fetch database function.
// const AUTHORIZATION = "Basic " + btoa(`${db_USERNAME}:${db_PASSWORD}`);

// ////////////////////////////////////////////////////////////////////////////////////////
// // Do not need change, when load Login.js execute

// async function initialize() {
//   await getconfig();
// }

// ////////////////////////////////////////////////////////////////////////////////////////
// // Variable declare, config data.
// var atleast; // The maximum password length.
// var atmost; // The minimum password length.
// var upper; // Uppercase alphbet at least in password. ABC
// var lower; // Lowercase alphbet at least in password. abc
// var special; // Special character at least in password. !@#
// var num; // Nunber at least in password. 123
// var locktimes; // System setting for how many times login failure to lock the account.
// var suspendtime; // System setting for how long to lock the account. unit is hour
// var logintext; // Show in login page html.
// var duration; // new var Cookies maintain time. unit is hour.

// // Use to get couchdb CONFIG doc. Purpose for getting CONFIG doc.
// async function getconfig() {
//   const URL = `${db_URL}/${db_account}/${doc_CONFIG}`;
// //   await fetch(URL, {
// //     method: "GET",
// //     headers: { Authorization: AUTHORIZATION },
// //     credentials: "include", // HTTP authentication in the request.
// //   })
// //     .then((response) => {
// //       if (!response.ok) {
// //         throw new Error("Request failed");
// //       }
// //       return response.json();
// //     })
// //     .then((data) => {
// //       data.atleast === undefined
// //         ? (atleast = 5)
// //         : (atleast = parseInt(data.atleast));
// //       data.atmost === undefined
// //         ? (atmost = 10)
// //         : (atmost = parseInt(data.atmost));
// //       data.upper === undefined ? (upper = 1) : (upper = parseInt(data.upper));
// //       data.lower === undefined ? (lower = 1) : (lower = parseInt(data.lower));
// //       data.special === undefined
// //         ? (special = 1)
// //         : (special = parseInt(data.special));
// //       data.num === undefined ? (num = 1) : (num = parseInt(data.num));
// //       data.locktimes === undefined
// //         ? (locktimes = 3)
// //         : (locktimes = parseInt(data.locktimes));
// //       data.suspendtime === undefined
// //         ? (suspendtime = "永久")
// //         : (suspendtime = data.suspendtime);
// //       data.logintext === undefined
// //         ? (logintext = "登入頁面提示字元")
// //         : (logintext = data.logintext);
// //       data.duration === undefined
// //         ? (duration = "")
// //         : (duration = data.duration);

// //       // console.log(`atleast: ${atleast}`);
// //       // console.log(`atmost: ${atmost}`);
// //       // console.log(`upper: ${upper}`);
// //       // console.log(`lower: ${lower}`);
// //       // console.log(`special: ${special}`);
// //       // console.log(`num: ${num}`);
// //       // console.log(`locktimes: ${locktimes}, ${typeof(locktimes)}`);
// //       // console.log(`suspendtime: ${suspendtime}`);
// //       // console.log(`logintext: ${logintext}`);
// //     })
// //     .catch((error) => {
// //       console.error("Error:", error.message);
// //     });
// // }


// try {
//   const response = await fetch(URL, {
//     method: "GET",
//     headers: { Authorization: AUTHORIZATION },
//     credentials: "include", // HTTP authentication in the request.
//   });
//   if (!response.ok) {
//     throw new Error(`Request failed with status ${response.status}`);
//   }
//   const data = await response.json();
//   data.atleast === undefined ? (atleast = 5) : (atleast = parseInt(data.atleast));
//   data.atmost === undefined ? (atmost = 10) : (atmost = parseInt(data.atmost));
//   data.upper === undefined ? (upper = 1) : (upper = parseInt(data.upper));
//   data.lower === undefined ? (lower = 1) : (lower = parseInt(data.lower));
//   data.special === undefined ? (special = 1) : (special = parseInt(data.special));
//   data.num === undefined ? (num = 1) : (num = parseInt(data.num));
//   data.locktimes === undefined ? (locktimes = 3) : (locktimes = parseInt(data.locktimes));
//   data.suspendtime === undefined ? (suspendtime = "永久") : (suspendtime = data.suspendtime);
//   data.logintext === undefined ? (logintext = "登入頁面提示字元") : (logintext = data.logintext);
//   data.duration === undefined ? (duration = "") : (duration = data.duration);

//   // Output the retrieved data for debugging
//   console.log(`Retrieved data:`, data);
// } catch (error) {
//   console.error("Error:", error.message);
// }
// }