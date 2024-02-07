// middleware.js
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
const dataUpdateEmitter = new EventEmitter();
require("dotenv").config();
const {
  calculateAverage,
  calculateAdd,
  totalWarningNum,
  totalAlarmNum,
  mapL_M_systemMode,
  counttotalWarningNum,
} = require("./function");

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

//***************************************************************************************************************** */
//定義 CouchDB 資料庫名稱
const databases = [
  "lc1_rf10", //0
  "lc2_rf10", //1
  "lc3_rf10", //2
  "lc4_rf10", //3
  "dwctrl", //4
  "log", //5
  "gc_rf10", //6
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
    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
    });

    const allData = await Promise.all(dataPromises); //取得所有資料庫的數值 存在陣列裡面 由零開始
    const lc1Data = allData[0];
    const lc2Data = allData[1];
    const lc3Data = allData[2];
    const lc4Data = allData[3];
    const dwctrlData = allData[4];
    const logData = allData[5];
    const gcData = allData[6];

    res.locals.navbarData = {
      title: "模式控制",
      stylesheets: [
        "../public/styles/style_template.css",
        "../public/styles/Mode_SysCtrl.css",
      ],
      permission: "admin",
      //Warning 警告 右邊 黃色
      //綠黃紅 調頻服務中、部分運轉、暫停服務 bit4+bit5
      L_M_systemMode: mapL_M_systemMode(
        gcData.System["400078"],
        gcData.System["400079"],
        gcData.System["400080"],
        gcData.System["400081"]
      ),
      //
      totalWarningNum: counttotalWarningNum(0),
      WarningNum_Meter: 0,
      // 408181:Oil temperature/408205: VCB Status(1、2)/408206:ACB Status(bit1 3 5)/Relay 408201-408203
      WarningNum_PCS: calculateAverage(
        lc1Data.PCS1[403002],
        lc1Data.PCS1[403034],
        lc1Data.PCS1[403035]
      ),
      WarningNum_Bat: lc1Data.BMS1[405028],
      WarningNum_Env: lc1Data.BSC1[406003],
      WarningNum_FF: lc1Data.BSC1[406005],

      //Alarm (紅色 左邊 錯誤)
      // totalAlarmNum: 0,
      // AlarmNum_Meter: 0,
      // AlarmNum_PCS:
      //   (lc1Data.PCS1[403001], lc1Data.PCS1[403036], lc1Data.PCS1[403038]),
      // AlarmNum_Bat: (lc1Data.BMS1[405030], lc1Data.BMS1[405032]),
      // AlarmNum_Env:
      //   (lc1Data.BSC1[406001] + lc1Data.BSC1[406007] + lc1Data.BSC1[406060],
      //   lc1Data.BSC1[406061]),
      // AlarmNum_FF: lc1Data.BSC1[406005],

      //系統資訊
      // L_M_freq: Other01Data.Freq[408026],
      // L_M_activeP: Other01Data.Freq[408019],
      // L_M_reactiveP: Other01Data.Freq[408021],
      // L_M_voltage: Other01Data.Freq[408007],
      // L_M_current: Other01Data.Freq[408017],
      // L_M_powerFactor: Other01Data.Freq[408025],
      // L_M_avgSOC: (lc1Data.BMS1[404007], lc1Data.BMS2[404007]),
      // L_M_minSOH: (lc1Data.BMS1[404005], lc1Data.BMS2[404005]),
      // L_M_SBSPM: GCDb.System[400037],
      // L_M_chgEtoday:
      //   (lc1Data.BMS1[404079], lc1Data.BMS1[404080], lc1Data.BMS1[404081]),
      // L_M_dcgEtoday:
      //   (lc1Data.BMS1[404082], lc1Data.BMS1[404083], lc1Data.BMS1[404084]),
    };
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
