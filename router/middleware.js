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
  mapL_M_systemMode,
  counttotalWarningNum,
  countWarningNum_Meter,
  calculateWarningNum_PCS,
} = require("./function");

const { Console } = require("console");
const { ok } = require("assert");

const nano = require("nano")("http://admin:ems45877096@192.168.1.12:5984");
const gc_rf10 = "gc_rf10";
const gcDb = nano.use(gc_rf10);
const dc_rf10 = "dc_rf10";
const dcDb = nano.use(dc_rf10);
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
      totalWarningNum: counttotalWarningNum(0),
      WarningNum_Meter: countWarningNum_Meter(0),
      // 408181:Oil temperature/408205: VCB Status(1、2)/408206:ACB Status(bit1 3 5)/Relay 408201-408203
      //PCS
      WarningNum_PCS: calculateWarningNum_PCS(
        //lc1
        lc1Data.PCS[403037], //Overall alarm status
        lc1Data.PCS[403063], //Unit 1_Alarm status1
        lc1Data.PCS[403064], //Unit 1_Alarm status2
        lc1Data.PCS[403144], //Unit 1_Alarm status3
        lc1Data.PCS[403102], //Unit 2_Alarm status1
        lc1Data.PCS[403103], //Unit 2_Alarm status2
        lc1Data.PCS[403148], //Unit 2_Alarm status3

        //lc2
        lc2Data.PCS[403037], //Overall alarm status
        lc2Data.PCS[403063], //Unit 1_Alarm status1
        lc2Data.PCS[403064], //Unit 1_Alarm status2
        lc2Data.PCS[403144], //Unit 1_Alarm status3
        lc2Data.PCS[403102], //Unit 2_Alarm status1
        lc2Data.PCS[403103], //Unit 2_Alarm status2
        lc2Data.PCS[403148], //Unit 2_Alarm status3

        //lc3
        lc3Data.PCS[403037], //Overall alarm status
        lc3Data.PCS[403063], //Unit 1_Alarm status1
        lc3Data.PCS[403064], //Unit 1_Alarm status2
        lc3Data.PCS[403144], //Unit 1_Alarm status3
        lc3Data.PCS[403102], //Unit 2_Alarm status1
        lc3Data.PCS[403103], //Unit 2_Alarm status2
        lc3Data.PCS[403148], //Unit 2_Alarm status3

        //lc4
        lc4Data.PCS[403502], //Overall alarm status
        lc4Data.PCS[403534], //Alarm status1
        lc4Data.PCS[403535] //Alarm status2
      ),
      //電池
      WarningNum_Bat: calculateWarningNum_Bat(
        lc1Data.BMS1[404044],
        lc1Data.BMS2[404044],
        lc1Data.RackSub1.Rack01[405028],
        lc1Data.RackSub1.Rack02[405028],
        lc1Data.RackSub1.Rack03[405028],
        lc1Data.RackSub1.Rack04[405028],
        lc1Data.RackSub1.Rack05[405028],
        lc1Data.RackSub1.Rack06[405028],
        lc1Data.RackSub1.Rack07[405028],
        lc1Data.RackSub1.Rack08[405028],
        lc1Data.RackSub1.Rack09[405028],
        lc1Data.RackSub1.Rack10[405028],
        lc1Data.RackSub1.Rack11[405028],
        lc1Data.RackSub1.Rack12[405028],
        lc1Data.RackSub2.Rack01[405028],
        lc1Data.RackSub2.Rack02[405028],
        lc1Data.RackSub2.Rack03[405028],
        lc1Data.RackSub2.Rack04[405028],
        lc1Data.RackSub2.Rack05[405028],
        lc1Data.RackSub2.Rack06[405028],
        lc1Data.RackSub2.Rack07[405028],
        lc1Data.RackSub2.Rack08[405028],
        lc1Data.RackSub2.Rack09[405028],
        lc1Data.RackSub2.Rack10[405028],
        lc1Data.RackSub2.Rack11[405028],
        lc1Data.RackSub2.Rack12[405028],
        lc2Data.BMS1[404044],
        lc2Data.BMS2[404044],
        lc2Data.RackSub1.Rack01[405028],
        lc2Data.RackSub1.Rack02[405028],
        lc2Data.RackSub1.Rack03[405028],
        lc2Data.RackSub1.Rack04[405028],
        lc2Data.RackSub1.Rack05[405028],
        lc2Data.RackSub1.Rack06[405028],
        lc2Data.RackSub1.Rack07[405028],
        lc2Data.RackSub1.Rack08[405028],
        lc2Data.RackSub1.Rack09[405028],
        lc2Data.RackSub1.Rack10[405028],
        lc2Data.RackSub1.Rack11[405028],
        lc2Data.RackSub1.Rack12[405028],
        lc2Data.RackSub2.Rack01[405028],
        lc2Data.RackSub2.Rack02[405028],
        lc2Data.RackSub2.Rack03[405028],
        lc2Data.RackSub2.Rack04[405028],
        lc2Data.RackSub2.Rack05[405028],
        lc2Data.RackSub2.Rack06[405028],
        lc2Data.RackSub2.Rack07[405028],
        lc2Data.RackSub2.Rack08[405028],
        lc2Data.RackSub2.Rack09[405028],
        lc2Data.RackSub2.Rack10[405028],
        lc2Data.RackSub2.Rack11[405028],
        lc2Data.RackSub2.Rack12[405028],
        lc3Data.BMS1[404044],
        lc3Data.BMS2[404044],
        lc3Data.RackSub1.Rack01[405028],
        lc3Data.RackSub1.Rack02[405028],
        lc3Data.RackSub1.Rack03[405028],
        lc3Data.RackSub1.Rack04[405028],
        lc3Data.RackSub1.Rack05[405028],
        lc3Data.RackSub1.Rack06[405028],
        lc3Data.RackSub1.Rack07[405028],
        lc3Data.RackSub1.Rack08[405028],
        lc3Data.RackSub1.Rack09[405028],
        lc3Data.RackSub1.Rack10[405028],
        lc3Data.RackSub1.Rack11[405028],
        lc3Data.RackSub1.Rack12[405028],
        lc3Data.RackSub2.Rack01[405028],
        lc3Data.RackSub2.Rack02[405028],
        lc3Data.RackSub2.Rack03[405028],
        lc3Data.RackSub2.Rack04[405028],
        lc3Data.RackSub2.Rack05[405028],
        lc3Data.RackSub2.Rack06[405028],
        lc3Data.RackSub2.Rack07[405028],
        lc3Data.RackSub2.Rack08[405028],
        lc3Data.RackSub2.Rack09[405028],
        lc3Data.RackSub2.Rack10[405028],
        lc3Data.RackSub2.Rack11[405028],
        lc3Data.RackSub2.Rack12[405028],
        lc4Data.BMS1[404044],
        lc4Data.BMS2[404044],
        lc4Data.RackSub1.Rack01[405028],
        lc4Data.RackSub1.Rack02[405028],
        lc4Data.RackSub1.Rack03[405028],
        lc4Data.RackSub1.Rack04[405028],
        lc4Data.RackSub1.Rack05[405028],
        lc4Data.RackSub1.Rack06[405028],
        lc4Data.RackSub1.Rack07[405028],
        lc4Data.RackSub1.Rack08[405028],
        lc4Data.RackSub1.Rack09[405028],
        lc4Data.RackSub1.Rack10[405028],
        lc4Data.RackSub1.Rack11[405028],
        lc4Data.RackSub1.Rack12[405028]
      ),
      //環境
      WarningNum_Env: calculateWarningNum(
        cal_BSC(
          //Alarm status
          lc1Data.BSC1[406003],
          lc1Data.BSC2[406003],
          lc2Data.BSC1[406003],
          lc2Data.BSC2[406003],
          lc3Data.BSC1[406003],
          lc3Data.BSC2[406003],
          lc4Data.BSC1[406003],
          lc4Data.BSC2[406003]
        ),
        cal_HVAC(
          //HVAC
          lc1Data.BSC1[406007], //BIT2 =1 之外都是錯
          lc1Data.BSC1[406009],
          lc1Data.BSC1[406011],
          lc1Data.BSC1[406013],
          lc1Data.BSC1[406015],
          lc1Data.BSC1[406017],
          lc1Data.BSC1[406019],
          lc1Data.BSC1[406021],
          lc1Data.BSC1[406023],
          lc1Data.BSC1[406025],
          lc1Data.BSC1[406027],
          lc1Data.BSC1[406029],
          lc1Data.BSC1[406031],
          lc1Data.BSC1[406033],
          lc1Data.BSC1[406035],
          lc1Data.BSC1[406037],
          lc1Data.BSC1[406039],
          lc1Data.BSC1[406041],
          lc1Data.BSC1[406043],
          lc1Data.BSC1[406045],

          lc1Data.BSC2[406007],
          lc1Data.BSC2[406009],
          lc1Data.BSC2[406011],
          lc1Data.BSC2[406013],
          lc1Data.BSC2[406015],
          lc1Data.BSC2[406017],
          lc1Data.BSC2[406019],
          lc1Data.BSC2[406021],
          lc1Data.BSC2[406023],
          lc1Data.BSC2[406025],
          lc1Data.BSC2[406027],
          lc1Data.BSC2[406029],
          lc1Data.BSC2[406031],
          lc1Data.BSC2[406033],
          lc1Data.BSC2[406035],
          lc1Data.BSC2[406037],
          lc1Data.BSC2[406039],
          lc1Data.BSC2[406041],
          lc1Data.BSC2[406043],
          lc1Data.BSC2[406045],

          lc2Data.BSC1[406007], //BIT2 =1 之外都是錯
          lc2Data.BSC1[406009],
          lc2Data.BSC1[406011],
          lc2Data.BSC1[406013],
          lc2Data.BSC1[406015],
          lc2Data.BSC1[406017],
          lc2Data.BSC1[406019],
          lc2Data.BSC1[406021],
          lc2Data.BSC1[406023],
          lc2Data.BSC1[406025],
          lc2Data.BSC1[406027],
          lc2Data.BSC1[406029],
          lc2Data.BSC1[406031],
          lc2Data.BSC1[406033],
          lc2Data.BSC1[406035],
          lc2Data.BSC1[406037],
          lc2Data.BSC1[406039],
          lc2Data.BSC1[406041],
          lc2Data.BSC1[406043],
          lc2Data.BSC1[406045],

          lc2Data.BSC2[406007],
          lc2Data.BSC2[406009],
          lc2Data.BSC2[406011],
          lc2Data.BSC2[406013],
          lc2Data.BSC2[406015],
          lc2Data.BSC2[406017],
          lc2Data.BSC2[406019],
          lc2Data.BSC2[406021],
          lc2Data.BSC2[406023],
          lc2Data.BSC2[406025],
          lc2Data.BSC2[406027],
          lc2Data.BSC2[406029],
          lc2Data.BSC2[406031],
          lc2Data.BSC2[406033],
          lc2Data.BSC2[406035],
          lc2Data.BSC2[406037],
          lc2Data.BSC2[406039],
          lc2Data.BSC2[406041],
          lc2Data.BSC2[406043],
          lc2Data.BSC2[406045],

          lc3Data.BSC1[406007], //BIT2 =1 之外都是錯
          lc3Data.BSC1[406009],
          lc3Data.BSC1[406011],
          lc3Data.BSC1[406013],
          lc3Data.BSC1[406015],
          lc3Data.BSC1[406017],
          lc3Data.BSC1[406019],
          lc3Data.BSC1[406021],
          lc3Data.BSC1[406023],
          lc3Data.BSC1[406025],
          lc3Data.BSC1[406027],
          lc3Data.BSC1[406029],
          lc3Data.BSC1[406031],
          lc3Data.BSC1[406033],
          lc3Data.BSC1[406035],
          lc3Data.BSC1[406037],
          lc3Data.BSC1[406039],
          lc3Data.BSC1[406041],
          lc3Data.BSC1[406043],
          lc3Data.BSC1[406045],

          lc3Data.BSC2[406007],
          lc3Data.BSC2[406009],
          lc3Data.BSC2[406011],
          lc3Data.BSC2[406013],
          lc3Data.BSC2[406015],
          lc3Data.BSC2[406017],
          lc3Data.BSC2[406019],
          lc3Data.BSC2[406021],
          lc3Data.BSC2[406023],
          lc3Data.BSC2[406025],
          lc3Data.BSC2[406027],
          lc3Data.BSC2[406029],
          lc3Data.BSC2[406031],
          lc3Data.BSC2[406033],
          lc3Data.BSC2[406035],
          lc3Data.BSC2[406037],
          lc3Data.BSC2[406039],
          lc3Data.BSC2[406041],
          lc3Data.BSC2[406043],
          lc3Data.BSC2[406045],

          lc4Data.BSC1[406007], //BIT2 =1 之外都是錯
          lc4Data.BSC1[406009],
          lc4Data.BSC1[406011],
          lc4Data.BSC1[406013],
          lc4Data.BSC1[406015],
          lc4Data.BSC1[406017],
          lc4Data.BSC1[406019],
          lc4Data.BSC1[406021],
          lc4Data.BSC1[406023],
          lc4Data.BSC1[406025],
          lc4Data.BSC1[406027],
          lc4Data.BSC1[406029],
          lc4Data.BSC1[406031],
          lc4Data.BSC1[406033],
          lc4Data.BSC1[406035],
          lc4Data.BSC1[406037],
          lc4Data.BSC1[406039],
          lc4Data.BSC1[406041],
          lc4Data.BSC1[406043],
          lc4Data.BSC1[406045]
        ),
        cal_Temperature(
          //TH
          lc1Data.BSC1[406047],
          lc1Data.BSC1[406049],
          lc1Data.BSC2[406047],
          lc1Data.BSC2[406049],

          lc2Data.BSC1[406047],
          lc2Data.BSC1[406049],
          lc2Data.BSC2[406047],
          lc2Data.BSC2[406049],

          lc3Data.BSC1[406047],
          lc3Data.BSC1[406049],
          lc3Data.BSC2[406047],
          lc3Data.BSC2[406049],

          lc4Data.BSC1[406047],
          lc4Data.BSC1[406049],
          lc4Data.BSC2[406047],
          lc4Data.BSC2[406049]
        ),

        cal_Humidity(
          //TH
          lc1Data.BSC1[406048],
          lc1Data.BSC1[406050],
          lc1Data.BSC2[406048],
          lc1Data.BSC2[406050],

          lc2Data.BSC1[406048],
          lc2Data.BSC1[406050],
          lc2Data.BSC2[406048],
          lc2Data.BSC2[406050],

          lc3Data.BSC1[406048],
          lc3Data.BSC1[406050],
          lc3Data.BSC2[406048],
          lc3Data.BSC2[406050],

          lc4Data.BSC1[406048],
          lc4Data.BSC1[406050],
          lc4Data.BSC2[406048],
          lc4Data.BSC2[406050]
        ),
        //UPS
        cal_UPS_1(
          lc1Data.BSC1[406060],
          lc1Data.BSC2[406060],
          lc2Data.BSC1[406060],
          lc2Data.BSC2[406060],
          lc3Data.BSC1[406060],
          lc3Data.BSC2[406060],
          lc4Data.BSC1[406060],
          lc4Data.BSC2[406060]
        ),
        cal_UPS_2(
          lc1Data.BSC1[406061],
          lc1Data.BSC2[406061],
          lc2Data.BSC1[406061],
          lc2Data.BSC2[406061],
          lc3Data.BSC1[406061],
          lc3Data.BSC2[406061],
          lc4Data.BSC1[406061],
          lc4Data.BSC2[406061]
        )
      ),
      WarningNum_FF: calculateWarningNum_FF(
        lc1Data.BSC1[406005],
        lc1Data.BSC2[406005],
        lc2Data.BSC1[406005],
        lc2Data.BSC2[406005],
        lc3Data.BSC1[406005],
        lc3Data.BSC2[406005],
        lc4Data.BSC1[406005],
        lc4Data.BSC2[406005]
      ), //bit0&1

      //左邊******************************************************************************* */
      //計算*錯誤*總數 Alarm (紅色 左邊 錯誤)
      totalAlarmNum: 0,
      AlarmNum_Meter: 0,

      AlarmNum_PCS:
        (lc1Data.PCS1[403001], lc1Data.PCS1[403036], lc1Data.PCS1[403038]),
      AlarmNum_Bat:
        (lc1Data.BMS1[404046], lc1Data.BMS1[405030], lc1Data.BMS1[405032]),
      AlarmNum_Env:
        (lc1Data.BSC1[406001] + lc1Data.BSC1[406007] + lc1Data.BSC1[406060],
        lc1Data.BSC1[406061]),
      AlarmNum_FF: lc1Data.BSC1[406005], //bit2

      //下方******************************************************************************* */
      //系統資訊
      L_M_freq: Other01Data.Freq[408026],
      L_M_activeP: Other01Data.Freq[408019],
      L_M_reactiveP: Other01Data.Freq[408021],
      L_M_voltage: Other01Data.Freq[408007],
      L_M_current: Other01Data.Freq[408017],
      L_M_powerFactor: Other01Data.Freq[408025],
      L_M_avgSOC: (lc1Data.BMS1[404007], lc1Data.BMS2[404007]),
      L_M_minSOH: (lc1Data.BMS1[404005], lc1Data.BMS2[404005]),
      L_M_SBSPM: GCDb.System[400037],
      L_M_chgEtoday:
        (lc1Data.BMS1[404079], lc1Data.BMS1[404080], lc1Data.BMS1[404081]),
      L_M_dcgEtoday:
        (lc1Data.BMS1[404082], lc1Data.BMS1[404083], lc1Data.BMS1[404084]),
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
