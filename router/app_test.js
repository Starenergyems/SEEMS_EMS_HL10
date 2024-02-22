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
const { getconfig, findaccount, updateaccount, datetime, uuid, submit} =  require("./rLogin");

const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const couchDBUrl = "http://admin:ems45877096@192.168.1.12:5984";
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

app.get("/login", (req, res) => {
  // res.render("Login", { navbarData: res.locals.navbarData });
  res.render("Login");
});

app.post("/login", async (req, res) => {
  // The submit data from loginpage, input by user.
  const email = req.body['username']; 
  const password = req.body['password'];
  console.log(`Input Data：\nUSERMAIL = ${email}\nPASSWORD = ${password}`);
  
  try {
    const response = await submit(email, password);
    console.log(response);
    if (response["result"] === true) {
      console.log(response["text"])
      res.cookie('token', response['token']); // Setting the cookie
      // res.render("main"); // Sending the response
      // res.redirect("Mode_SysCtrl", { permission: "manager" });
    // } else {
    //   // Handle unsuccessful login
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle error
  }
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