// const port = 3005;

const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const app = express(); // Create an Express application instance
const cors = require("cors");
const router = express.Router();
const moment = require("moment");
// const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
// const nano = nano(couchDBUrl);

const {
  scaleProcess,
  mapPCSworkStatus,
  Convert_UInt_to_revBitString,
  Convert_UInt_to_BitString,
  mapWordStatus,
  mapModeActPas,
  mapModeQctrl,
  mapStandbyCmd,
  mapModeLR,
  countPCSAlarmAndFault,
  mapPCSWorkingstatus,
  mapworkMode_page,
  mapworkStatus_page,
  mapgridStatus_page
} = require("./function");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

router.use(cors());
router.use("/public", express.static(path.join(__dirname, "../public")));
router.use(
  "/operateinfo",
  express.static(path.join(__dirname, "../public/operateinfo"))
);
router.use(
  "/operateinfo/pcs",
  express.static(path.join(__dirname, "../public/operateinfo/pcs"))
);

router.use(
  "/operateinfo/pcs/alarm/:id",
  express.static(path.join(__dirname, "../public"))
);

//****************************************************************************************************** */
const lc1_rf10 = "lc1_rf10";
const lc01Db = nano.use(lc1_rf10);
const lc2_rf10 = "lc2_rf10";
const lc02Db = nano.use(lc2_rf10);
const lc3_rf10 = "lc3_rf10";
const lc03Db = nano.use(lc3_rf10);
const lc4_rf10 = "lc4_rf10";
const lc04Db = nano.use(lc4_rf10);
const gc_rf10 = "gc_rf10";
const gcDb = nano.use(gc_rf10);

// 定義全域變數 記錄當天晚上的紀錄
let total_exp = 0;
let total_imp = 0;
let flag = 0;
let lc4_imp = 0;
let lc4_exp = 0;

async function getData() {
  const now = moment();
  const startOfDay = moment().startOf("day");
  if (flag === 0 || now.isSame(startOfDay, "day")) {
    const night = moment()
      .set({ hour: 00, minute: 00, second: 00, millisecond: 0 }) // 設置結束時間為 23:59:59.999
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.000[Z]");
    const nightoneseconds = moment()
      .set({ hour: 00, minute: 00, second: 01, millisecond: 0 }) // 設置結束時間為 23:59:59.999
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

    const filterTime = {
      selector: {
        time: {
          $gte: night, // 開始時間為大前天的 23:59:57
          $lte: nightoneseconds // 結束時間為大前天的 23:59:59
        }
      },
      limit: 1
    };

    const midnightData1 = await lc01Db.find(filterTime);
    const midnightData2 = await lc02Db.find(filterTime);
    const midnightData3 = await lc03Db.find(filterTime);
    const midnightData4 = await lc04Db.find(filterTime);

    //discharge capacity
    const expValue =
      midnightData1.docs[0].System["402062"] +
      midnightData2.docs[0].System["402062"] +
      midnightData3.docs[0].System["402062"] +
      midnightData4.docs[0].System["402062"];

    //charge capacity
    const impValue =
      midnightData1.docs[0].System["402060"] +
      midnightData2.docs[0].System["402060"] +
      midnightData3.docs[0].System["402060"] +
      midnightData4.docs[0].System["402060"];

    lc4_imp = midnightData4.docs[0].System["402060"];
    lc4_exp = midnightData4.docs[0].System["402062"];

    // 更新全域變數
    total_exp = expValue;
    total_imp = impValue;

    //console.log("PCS用電度數: " + total_exp + " / " + total_imp);
  }
  //console.log("呼叫getdata");
  flag = 1;
}
// 調用 getData 函數
getData();

// 定義 CouchDB 資料庫名稱
const databases = [
  "lc1_rf10", //0
  "lc2_rf10", //1
  "lc3_rf10", //2
  "lc4_rf10", //3
  "dwctrl", //4
  "log", //5
  "gc_rf10" //6
];

// 創建 Nano 實例的函式
// const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);
const createNanoInstance = (dbName) => nano.db.use(dbName);
// 設定index
const getLatestDocument = async (nano) => {
  const indexDef = {
    index: { fields: ["time"] },
    name: "time_index"
  };

  //建立index
  await nano.createIndex(indexDef);

  //利用mango作為篩選器
  const mangoQuery = {
    selector: {
      time: { $exists: true }
    },
    sort: [{ time: "desc" }],
    limit: 1
  };

  return new Promise((resolve, reject) => {
    nano.find(mangoQuery, (err, body) => {
      if (err) {
        console.error("Error:", err);
        reject(err);
        return;
      }

      const latestData = body.docs[0]; //把資料存到latestData裡面
      //console.log(`Latest data from ${nano.config.db}:`, latestData);
      resolve(latestData);
    });
  });
};

//pcs主頁
var pcs_summary_variables;
async function queryPcsSum(req) {
  const dataPromises = databases.map(async (dbName) => {
    const nano = createNanoInstance(dbName);
    return getLatestDocument(nano);
  });

  const allData = await Promise.all(dataPromises); //取得所有資料庫的數值 存在陣列裡面 由零開始
  lc1Data = allData[0];
  lc2Data = allData[1];
  lc3Data = allData[2];
  lc4Data = allData[3];
  gcData = allData[6];

  pcs_summary_variables = {
    permission: req.body.permission,
    workStatus: mapPCSworkStatus(
      lc1Data.System[402052],
      lc2Data.System[402052],
      lc3Data.System[402052],
      lc4Data.System[402052]
    ),
    onlineNum:
      lc1Data.System[402052] +
      lc2Data.System[402052] +
      lc3Data.System[402052] +
      lc4Data.System[402052],

    totalP: scaleProcess(
      lc1Data.System[402055] +
        lc2Data.System[402055] +
        lc3Data.System[402055] +
        lc4Data.System[402055],
      0.1,
      1
    ),

    totalQ: scaleProcess(
      lc1Data.System[402057] +
        lc2Data.System[402057] +
        lc3Data.System[402057] +
        lc4Data.System[402057],
      0.1,
      1
    ),

    totalRatedP: scaleProcess(gcData.System[400005], 0.1, 1),

    today_E_chg: scaleProcess(
      lc1Data.System[402060] +
        lc2Data.System[402060] +
        lc3Data.System[402060] +
        lc4Data.System[402060] -
        total_imp,
      0.01,
      1
    ),
    today_E_dcg: scaleProcess(
      lc1Data.System[402062] +
        lc2Data.System[402062] +
        lc3Data.System[402062] +
        lc4Data.System[402062] -
        total_exp,
      0.1,
      1
    ),

    tot_E_chg: scaleProcess(
      lc1Data.System[402060] +
        lc2Data.System[402060] +
        lc3Data.System[402060] +
        lc4Data.System[402060],
      0.001,
      2
    ),
    tot_E_dcg: scaleProcess(
      lc1Data.System[402062] +
        lc2Data.System[402062] +
        lc3Data.System[402062] +
        lc4Data.System[402062],
      0.001,
      2
    ),
    //******************************************************************** */
    //lc1
    onlineNum_LC1: lc1Data.System[402052],
    ratedP_LC1: 3450, //這個數值是固定的 1725*2
    activePower_LC1: scaleProcess(lc1Data.System[402055], 0.1, 1),
    reactivePower_LC1: scaleProcess(lc1Data.System[402057], 0.1, 1),
    today_E_chg_LC1: scaleProcess(lc1Data.System[402060], 0.1, 1),
    today_E_dcg_LC1: scaleProcess(lc1Data.System[402062], 0.1, 1),
    tot_E_chg_LC1: scaleProcess(lc1Data.System[402060], 1, 1),
    tot_E_dcg_LC1: scaleProcess(lc1Data.System[402062], 1, 1),

    alarm_PCS1_1: countPCSAlarmAndFault(
      lc1Data.PCS[403063],
      lc1Data.PCS[403064],
      lc1Data.PCS[403144]
    ),
    fault_PCS1_1: countPCSAlarmAndFault(
      lc1Data.PCS[403065],
      lc1Data.PCS[403067],
      lc1Data.PCS[403146]
    ),

    alarm_PCS1_2: countPCSAlarmAndFault(
      lc1Data.PCS[403102],
      lc1Data.PCS[403103],
      lc1Data.PCS[403148]
    ),
    fault_PCS1_2: countPCSAlarmAndFault(
      lc1Data.PCS[403104],
      lc1Data.PCS[403106],
      lc1Data.PCS[403150]
    ),

    modeActPas_LC1: mapModeActPas(lc1Data.Ctrl[407010]),
    modeQctrl_LC1: mapModeQctrl(lc1Data.Ctrl[407011]),
    standbyCmd_LC1: mapStandbyCmd(lc1Data.Ctrl[407012]),
    modeLR_LC1: mapModeLR(lc1Data.Ctrl[407013]),

    //lc2
    onlineNum_LC2: lc2Data.System[402052],
    ratedP_LC2: 3450, //這個數值是固定的 1725*2
    activePower_LC2: scaleProcess(lc2Data.System[402055], 0.1, 1),
    reactivePower_LC2: scaleProcess(lc2Data.System[402057], 0.1, 1),
    today_E_chg_LC2: scaleProcess(lc2Data.System[402060], 0.1, 1),
    today_E_dcg_LC2: scaleProcess(lc2Data.System[402062], 0.1, 1),
    tot_E_chg_LC2: scaleProcess(lc2Data.System[402060], 1, 1),
    tot_E_dcg_LC2: scaleProcess(lc2Data.System[402062], 1, 1),

    alarm_PCS2_1: countPCSAlarmAndFault(
      lc2Data.PCS[403063],
      lc2Data.PCS[403064],
      lc2Data.PCS[403144]
    ),
    fault_PCS2_1: countPCSAlarmAndFault(
      lc2Data.PCS[403065],
      lc2Data.PCS[403067],
      lc2Data.PCS[403146]
    ),

    alarm_PCS2_2: countPCSAlarmAndFault(
      lc2Data.PCS[403102],
      lc2Data.PCS[403103],
      lc2Data.PCS[403148]
    ),
    fault_PCS2_2: countPCSAlarmAndFault(
      lc2Data.PCS[403104],
      lc2Data.PCS[403106],
      lc2Data.PCS[403150]
    ),

    modeActPas_LC2: mapModeActPas(lc2Data.Ctrl[407010]),
    modeQctrl_LC2: mapModeQctrl(lc2Data.Ctrl[407011]),
    standbyCmd_LC2: mapStandbyCmd(lc2Data.Ctrl[407012]),
    modeLR_LC2: mapModeLR(lc2Data.Ctrl[407013]),

    //lc3
    onlineNum_LC3: lc3Data.System[402052],
    ratedP_LC3: 3450, //這個數值是固定的 1725*2
    activePower_LC3: scaleProcess(lc3Data.System[402055], 0.1, 1),
    reactivePower_LC3: scaleProcess(lc3Data.System[402057], 0.1, 1),
    today_E_chg_LC3: scaleProcess(lc3Data.System[402064], 0.1, 1), //算
    today_E_dcg_LC3: scaleProcess(lc3Data.System[402066], 0.1, 1), //算
    tot_E_chg_LC3: scaleProcess(lc3Data.System[402060], 1, 1),
    tot_E_dcg_LC3: scaleProcess(lc3Data.System[402062], 1, 1),

    alarm_PCS3_1: countPCSAlarmAndFault(
      lc3Data.PCS[403063],
      lc3Data.PCS[403064],
      lc3Data.PCS[403144]
    ),
    fault_PCS3_1: countPCSAlarmAndFault(
      lc3Data.PCS[403065],
      lc3Data.PCS[403067],
      lc3Data.PCS[403146]
    ),

    alarm_PCS3_2: countPCSAlarmAndFault(
      lc3Data.PCS[403102],
      lc3Data.PCS[403103],
      lc3Data.PCS[403148]
    ),
    fault_PCS3_2: countPCSAlarmAndFault(
      lc3Data.PCS[403104],
      lc3Data.PCS[403106],
      lc3Data.PCS[403150]
    ),

    modeActPas_LC3: mapModeActPas(lc3Data.Ctrl[407010]),
    modeQctrl_LC3: mapModeQctrl(lc3Data.Ctrl[407011]),
    standbyCmd_LC3: mapStandbyCmd(lc3Data.Ctrl[407012]),
    modeLR_LC3: mapModeLR(lc3Data.Ctrl[407013]),

    //lc4
    onlineNum_LC4: lc4Data.System[402052],
    ratedP_LC4: 1725, //這個數值是固定的 1725
    activePower_LC4: scaleProcess(lc4Data.System[402055], 0.1, 1),
    reactivePower_LC4: scaleProcess(lc4Data.System[402057], 0.1, 1),
    today_E_chg_LC4: scaleProcess(lc4Data.System[402060] - lc4_imp, 0.1, 1), //算
    today_E_dcg_LC4: scaleProcess(lc4Data.System[402062] - lc4_exp, 0.1, 1), //算
    tot_E_chg_LC4: scaleProcess(lc4Data.System[402060], 1, 1),
    tot_E_dcg_LC4: scaleProcess(lc4Data.System[402062], 1, 1),

    alarm_PCS4_1: countPCSAlarmAndFault(
      lc4Data.PCS[403534],
      lc4Data.PCS[403535],
      0
    ),
    fault_PCS4_1: countPCSAlarmAndFault(
      lc4Data.PCS[403536],
      lc4Data.PCS[403538],
      0
    ),

    modeActPas_LC4: mapModeActPas(lc4Data.Ctrl[407010]),
    modeQctrl_LC4: mapModeQctrl(lc4Data.Ctrl[407011]),
    standbyCmd_LC4: mapStandbyCmd(lc4Data.Ctrl[407012]),
    modeLR_LC4: mapModeLR(lc4Data.Ctrl[407013])
  };
}
router.get("/operateinfo/pcs", async (req, res) => {
  try {
    await queryPcsSum(req);
    //console.log("workStatus" + workStatus);
    res.render("Op_PCS_InfoSummary", pcs_summary_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/:data", async (req, res) => {
  try {
    await queryPcsSum(req);
    res.json(pcs_summary_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//************************************************************************************************************************************************ */
//整合換頁功能
//infodetail換頁及路由設定
const pcsCHGStatus_MT = { 0: "充電", 1: "放電", 2: "非工作狀態" };
const pcsGridStatus_MT = { 0: "離網", 1: "併網" };

var pcsDetail_variables;
var pageNumber;

//PCS
async function queryPcsDetail() {
  // 使用 map 遍歷所有資料庫名稱，創建 Nano 實例，並獲取最新文檔的 promise 陣列
  const dataPromises = databases.map(async (dbName) => {
    const nano = createNanoInstance(dbName);
    return getLatestDocument(nano);
  });

  const allData = await Promise.all(dataPromises); //取得所有資料庫的數值 存在陣列裡面 由零開始
  const baseNumber = Math.ceil(pageNumber / 2); // 取天花板值
  const subNumber = pageNumber % 2 === 0 ? 2 : 1;
  const No_of_PCS = `${baseNumber}-${subNumber}`;

  // 根據選擇的集合名稱查詢資料
  let lcData; // 在 if 區塊外部聲明變數

  if (pageNumber == 1 || pageNumber == 2) {
    lcData = allData[0];
  } else if (pageNumber == 3 || pageNumber == 4) {
    lcData = allData[1];
  } else if (pageNumber == 5 || pageNumber == 6) {
    lcData = allData[2];
  } else if (pageNumber == 7) {
    lcData = allData[3];
  } else {
    throw new Error("Invalid pageNumber");
  }
  //console.log("lcData:" + lcData);
  //let processedPageNumber;
  if (pageNumber % 2 === 1 && pageNumber <= 6) {
    // 奇數頁處理方式 傳遞資料給模板引擎，渲染頁面
    pcsDetail_variables = {
      permission: "manager",
      pageNumber,
      No_of_PCS: No_of_PCS,
      workStatus: mapworkStatus_page(lcData.PCS[403078]),
      workMode: mapworkMode_page(lcData.PCS[403080]),
      //Workingstatus
      chargeStatus: mapWordStatus(lcData.PCS[403069], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS[403074], 0.00001, 3), //畫面顯示MWh所以會比點表再乘0.001
      tot_E_dcg: scaleProcess(lcData.PCS[403076], 0.00001, 3), //畫面顯示MWh所以會比點表再乘0.001
      // max_P_chg: scaleProcess(lcData.PCS[403066], 0.1, 1), //刪除
      // max_P_dcg: scaleProcess(lcData.PCS[403067], 0.1, 1), //刪除
      // max_Q_l: scaleProcess(lcData.PCS[403068], 0.1, 1), //刪除
      // max_Q_c: scaleProcess(lcData.PCS[403069], 0.1, 1), //刪除
      HB_Counts: lcData.PCS[403039],
      leakage_I: scaleProcess(lcData.PCS[403044], 0.01, 2),
      //gridStatus: mapgridStatus_page(lcData.PCS[403054], pcsGridStatus_MT), //刪除
      activePower: scaleProcess(lcData.PCS[403059], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS[403061], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS[403085], 0.001, 3),

      voltageRS: scaleProcess(lcData.PCS[403053], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS[403054], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS[403055], 0.1, 1),
      currentR: scaleProcess(lcData.PCS[403056], 0.1, 1),
      currentS: scaleProcess(lcData.PCS[403057], 0.1, 1),
      currentT: scaleProcess(lcData.PCS[403058], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS[403084], 0.01, 2),

      pElectrodeR: scaleProcess(lcData.PCS[403023], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS[403025], 0.01, 2),

      DCvoltage: scaleProcess(lcData.PCS[403050], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS[403051], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS[403052], 0.1, 1),

      overallFault: lcData.PCS[403140],
      overallAlarm: lcData.PCS[403037],

      faultStatus: lcData.PCS[403065] + lcData.PCS[403067],
      //faultStatus3:lcData.PCS[403146],
      alarmStatus: lcData.PCS[403063] + lcData.PCS[403064],
      //alarmStatus3: lcData.PCS[403144],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS[403086], 16)
      // innerTemp: scaleProcess(lcData.PCS[403057], 0.1, 1),
      // moduleTemp1: scaleProcess(lcData.PCS[403014], 0.1, 1),
      // moduleTemp2: scaleProcess(lcData.PCS[403015], 0.1, 1),
      // moduleTemp3: scaleProcess(lcData.PCS[403016], 0.1, 1),
    };
  } else if (pageNumber % 2 === 0 && pageNumber <= 6) {
    // 偶數頁處理方式 傳遞資料給模板引擎，渲染頁面
    pcsDetail_variables = {
      permission: "manager",
      pageNumber,
      No_of_PCS,
      Workingstatus: mapPCSWorkingstatus(
        lcData.PCS[403078],
        lcData.PCS[403080]
      ),
      chargeStatus: mapWordStatus(lcData.PCS[403108], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS[403113], 0.00001, 3), //畫面顯示MWh所以會比點表再乘0.001
      tot_E_dcg: scaleProcess(lcData.PCS[403115], 0.00001, 3), //畫面顯示MWh所以會比點表再乘0.001
      // max_P_chg: scaleProcess(lcData.PCS[403066], 0.1, 1),
      // max_P_dcg: scaleProcess(lcData.PCS[403067], 0.1, 1),
      // max_Q_l: scaleProcess(lcData.PCS[403068], 0.1, 1),
      // max_Q_c: scaleProcess(lcData.PCS[403069], 0.1, 1),
      HB_Counts: lcData.PCS[403039],
      leakage_I: scaleProcess(lcData.PCS[403044], 0.01, 2),
      // gridStatus: mapgridStatus_page(lcData.PCS[403054], pcsGridStatus_MT),
      activePower: scaleProcess(lcData.PCS[403098], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS[403100], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS[403124], 0.001, 3),
      voltageRS: scaleProcess(lcData.PCS[403092], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS[403093], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS[403094], 0.1, 1),
      currentR: scaleProcess(lcData.PCS[403095], 0.1, 1),
      currentS: scaleProcess(lcData.PCS[403096], 0.1, 1),
      currentT: scaleProcess(lcData.PCS[403097], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS[403123], 0.01, 2),

      pElectrodeR: scaleProcess(lcData.PCS[403023], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS[403025], 0.01, 2),

      DCvoltage: scaleProcess(lcData.PCS[403089], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS[403090], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS[403091], 0.1, 1),

      //
      overallFault: lcData.PCS[403140],
      overallAlarm: lcData.PCS[403037],
      faultStatus: lcData.PCS[403104] + lcData.PCS[403106],
      //faultStatus3:lcData.PCS[403150],
      alarmStatus: lcData.PCS[403102] + lcData.PCS[403103],
      //alarmStatus3: lcData.PCS[403148],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS[403125], 16)
      // innerTemp: scaleProcess(lcData.PCS[403057], 0.1, 1),
      // moduleTemp1: scaleProcess(lcData.PCS[403014], 0.1, 1),
      // moduleTemp2: scaleProcess(lcData.PCS[403015], 0.1, 1),
      // moduleTemp3: scaleProcess(lcData.PCS[403016], 0.1, 1),
    };
    //單台 LC4-pcs7
  } else if (pageNumber == 7) {
    pcsDetail_variables = {
      permission: "manager",
      pageNumber,
      No_of_PCS,
      workStatus: mapworkStatus_page(lcData.PCS[403549]),
      workMode: mapworkMode_page(lcData.PCS[403551]),
      chargeStatus: mapWordStatus(lcData.PCS[403540], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS[403545], 0.00001, 3), //畫面顯示MWh所以會比點表再乘0.001
      tot_E_dcg: scaleProcess(lcData.PCS[403547], 0.00001, 3), //畫面顯示MWh所以會比點表再乘0.001
      max_P_chg: scaleProcess(lcData.PCS[403566], 0.1, 1),
      max_P_dcg: scaleProcess(lcData.PCS[403567], 0.1, 1),
      max_Q_l: scaleProcess(lcData.PCS[403568], 0.1, 1),
      max_Q_c: scaleProcess(lcData.PCS[403569], 0.1, 1),
      HB_Counts: lcData.PCS[403507],
      leakage_I: scaleProcess(lcData.PCS[403508], 0.01, 2),
      gridStatus: mapgridStatus_page(lcData.PCS[403554], pcsGridStatus_MT),
      activePower: scaleProcess(lcData.PCS[403526], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS[403528], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS[403556], 0.001, 3),
      voltageRS: scaleProcess(lcData.PCS[403520], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS[403521], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS[403522], 0.1, 1),
      currentR: scaleProcess(lcData.PCS[403523], 0.1, 1),
      currentS: scaleProcess(lcData.PCS[403524], 0.1, 1),
      currentT: scaleProcess(lcData.PCS[403525], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS[403555], 0.01, 2),
      pElectrodeR: scaleProcess(lcData.PCS[403530], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS[403532], 0.01, 2),
      DCvoltage: scaleProcess(lcData.PCS[403517], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS[403518], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS[403519], 0.1, 1),
      overallFault: lcData.PCS[403501],
      overallAlarm: lcData.PCS[403502],
      faultStatus: lcData.PCS[403536] + lcData.PCS[403538],
      alarmStatus: lcData.PCS[403534] + lcData.PCS[403535],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS[403558], 16),
      innerTemp: scaleProcess(lcData.PCS[403557], 0.1, 1),
      moduleTemp1: scaleProcess(lcData.PCS[403514], 0.1, 1),
      moduleTemp2: scaleProcess(lcData.PCS[403515], 0.1, 1),
      moduleTemp3: scaleProcess(lcData.PCS[403516], 0.1, 1)
    };
  } else {
    console.log("頁數超出範圍!");
  }
}
/***************************************************************** */
router.get("/operateinfo/pcs/infodetail/:pageNumber", async (req, res) => {
  try {
    //獲取目前切換的頁數
    pageNumber = parseInt(req.params.pageNumber);
    await queryPcsDetail();

    if (pageNumber === 7) {
      res.render("Op_PCS_InfoDetail", pcsDetail_variables);
    } else {
      res.render("Op_PCS_InfoDetail_LC1_3", pcsDetail_variables);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get(
  "/operateinfo/pcs/infodetail/:pageNumber/:data",
  async (req, res) => {
    try {
      //獲取目前切換的頁數
      pageNumber = parseInt(req.params.pageNumber);
      await queryPcsDetail();
      const responseData = pcsDetail_variables;
      //console.log(responseData);
      res.json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//************************************************************************************************************************************************ */
//alarm告警換頁
var pcsAlarm_variables;
async function queryPcsAlarm() {
  // 使用 map 遍歷所有資料庫名稱，創建 Nano 實例，並獲取最新文檔的 promise 陣列
  const dataPromises = databases.map(async (dbName) => {
    const nano = createNanoInstance(dbName);
    return getLatestDocument(nano);
  });

  const allData = await Promise.all(dataPromises); //取得所有資料庫的數值 存在陣列裡面 由零開始
  const baseNumber = Math.ceil(pageNumber / 2); // 取天花板值
  const subNumber = pageNumber % 2 === 0 ? 2 : 1;
  const No_of_PCS = `${baseNumber}-${subNumber}`;

  // 根據選擇的集合名稱查詢資料
  let lcData; // 在 if 區塊外部聲明變數
  if (pageNumber == 1 || pageNumber == 2) {
    lcData = allData[0];
  } else if (pageNumber == 3 || pageNumber == 4) {
    lcData = allData[1];
  } else if (pageNumber == 5 || pageNumber == 6) {
    lcData = allData[2];
  } else if (pageNumber == 7) {
    lcData = allData[3];
  } else {
    throw new Error("Invalid pageNumber");
  }

  //let processedPageNumber;

  if (pageNumber % 2 === 1 && pageNumber <= 6) {
    // 奇數頁處理方式 傳遞資料給模板引擎，渲染頁面
    pcsAlarm_variables = {
      permission: "manager",
      pageNumber,
      No_of_PCS,
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS[403140], 16)
        .num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS[403037], 16)
        .num_ClosedBit,
      noFault:
        Convert_UInt_to_BitString(lcData.PCS[403065], 32).num_ClosedBit +
        Convert_UInt_to_BitString(lcData.PCS[403067], 32).num_ClosedBit,
      noAlarm:
        Convert_UInt_to_BitString(lcData.PCS[403063], 16).num_ClosedBit +
        Convert_UInt_to_BitString(lcData.PCS[403064], 16).num_ClosedBit,

      OF: Convert_UInt_to_revBitString(lcData.PCS[403140], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS[403037], 16),

      Alarm1: Convert_UInt_to_revBitString(lcData.PCS[403063], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS[403064], 16),
      Alarm3: Convert_UInt_to_revBitString(lcData.PCS[403144], 16),
      Fault1: Convert_UInt_to_revBitString(lcData.PCS[403065], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS[403067], 32),
      Fault3: Convert_UInt_to_revBitString(lcData.PCS[403146], 32)
    };
  } else if (pageNumber % 2 === 0 && pageNumber <= 6) {
    // 偶數頁處理方式 傳遞資料給模板引擎，渲染頁面
    pcsAlarm_variables = {
      permission: "manager",
      pageNumber,
      No_of_PCS,
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS[403140], 16)
        .num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS[403037], 16)
        .num_ClosedBit,
      noFault:
        Convert_UInt_to_BitString(lcData.PCS[403104], 32).num_ClosedBit +
        Convert_UInt_to_BitString(lcData.PCS[403106], 32).num_ClosedBit,

      //
      noAlarm:
        Convert_UInt_to_BitString(lcData.PCS[403102], 16).num_ClosedBit +
        Convert_UInt_to_BitString(lcData.PCS[403103], 16).num_ClosedBit,

      //
      OF: Convert_UInt_to_revBitString(lcData.PCS[403140], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS[403037], 16),

      Alarm1: Convert_UInt_to_revBitString(lcData.PCS[403102], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS[403103], 16),
      Alarm3: Convert_UInt_to_revBitString(lcData.PCS[403148], 16), //NEW
      Fault1: Convert_UInt_to_revBitString(lcData.PCS[403104], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS[403106], 32), //NEW
      Fault3: Convert_UInt_to_revBitString(lcData.PCS[403150], 32)
    };
  } else if (pageNumber == 7) {
    pcsAlarm_variables = {
      permission: "manager",
      pageNumber,
      No_of_PCS,
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS[403501], 16)
        .num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS[403502], 16)
        .num_ClosedBit,
      noFault:
        Convert_UInt_to_BitString(lcData.PCS[403536], 32).num_ClosedBit +
        Convert_UInt_to_BitString(lcData.PCS[403538], 32).num_ClosedBit,
      noAlarm:
        Convert_UInt_to_BitString(lcData.PCS[403534], 16).num_ClosedBit +
        Convert_UInt_to_BitString(lcData.PCS[403535], 16).num_ClosedBit,
      OF: Convert_UInt_to_revBitString(lcData.PCS[403501], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS[403502], 16),
      Alarm1: Convert_UInt_to_revBitString(lcData.PCS[403534], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS[403535], 16),
      Fault1: Convert_UInt_to_revBitString(lcData.PCS[403536], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS[403538], 32)
    };
  } else {
    console.log("err");
  }
}

router.get("/operateinfo/pcs/alarm/:pageNumber", async (req, res) => {
  try {
    //const pageNumber = req.session.pageNumber;
    pageNumber = parseInt(req.params.pageNumber);
    await queryPcsAlarm();

    if (pageNumber == 7) {
      res.render("Op_PCS_Alarm", pcsAlarm_variables);
    } else {
      res.render("Op_PCS_Alarm_LC1_3", pcsAlarm_variables);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/alarm/:pageNumber/:data", async (req, res) => {
  try {
    pageNumber = parseInt(req.params.pageNumber);
    await queryPcsAlarm();
    res.json(pcsAlarm_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/*router.get("/operateinfo/pcs/alarm_lc13/:pageNumber", async (req, res) => {
  try {
    pageNumber = parseInt(req.params.pageNumber);
    console.log(pageNumber);
    await queryPcsAlarm();
    res.render("Op_PCS_Alarm_LC1_3", pcsAlarm_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/alarm_lc13/:pageNumber/:data", async (req, res) => {
  try {
    pageNumber = parseInt(req.params.pageNumber);
    await queryPcsAlarm();
    res.json(pcsAlarm_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});*/

let dVS_Data_dataName;
let dVS_Data_numInDataGroup;
let dVS_Data_scale;
let dVS_Data_decPlace;
let dVS_Data_minLimit;
let dVS_Data_maxLimit;
let dVS_Data_unit;

router.post("/get_dVS_Data_WhenClicking", async (req, res) => {
  try {
    console.log("接收到前端請求");
    dVS_Data_dataName = req.body.dataName;
    dVS_Data_numInDataGroup = req.body.numInDataGroup;

    const data_MT = {
      setBut_P_LC: {
        dbName_gD: `lc${dVS_Data_numInDataGroup}_rf10`,
        dicName: "Ctrl",
        dataID: 407078,
        scale: 1,
        decPlace: 0,
        minLimit: -5000,
        maxLimit: 5000,
        unit: "kW"
      },
      setBut_acuHeatT: {
        dbName_gD: `lc${dVS_Data_numInDataGroup}_rf10`,
        dicName: "Ctrl",
        dataID: 407016,
        scale: 0.1,
        decPlace: 1,
        minLimit: -1000,
        maxLimit: 2000,
        unit: "°C"
      },
      setBut_acuCoolT: {
        dbName_gD: `lc${dVS_Data_numInDataGroup}_rf10`,
        dicName: "Ctrl",
        dataID: 407017,
        scale: 0.1,
        decPlace: 1,
        minLimit: -1000,
        maxLimit: 2000,
        unit: "°C"
      }
      //
      //
      //
    };

    const data_AfM = data_MT[dVS_Data_dataName];
    dVS_Data_scale = data_AfM.scale;
    dVS_Data_decPlace = data_AfM.decPlace;
    dVS_Data_minLimit = data_AfM.minLimit;
    dVS_Data_maxLimit = data_AfM.maxLimit;
    dVS_Data_unit = data_AfM.unit;
    console.log(data_AfM.dbName_gD);

    const dataPromises = databases.map(async (dbName) => {
      const nano = createNanoInstance(dbName);
      return getLatestDocument(nano);
    });

    const allData = await Promise.all(dataPromises);

    const getData_raw =
      allData[databases.indexOf(data_AfM.dbName_gD)][data_AfM.dicName][
        data_AfM.dataID
      ];
    const response = {
      originData: scaleProcess(getData_raw, data_AfM.scale, data_AfM.decPlace),
      dataRange: `數值範圍: ${scaleProcess(data_AfM.minLimit, data_AfM.scale, data_AfM.decPlace)}~${scaleProcess(data_AfM.maxLimit, data_AfM.scale, data_AfM.decPlace)} ${data_AfM.unit}`,
      unit: data_AfM.unit
    };

    res.json(response);
    // if (!lcData) {
    //   throw new Error("No data found");
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/set_dVS_Data", async (req, res) => {
  try {
    const setValue_raw = req.body.setValue;

    let response;

    if (setValue_raw !== "" && !Number.isNaN(Number(setValue_raw))) {
      const data_MT = {
        setBut_P_LC: {
          dicName: `lc${dVS_Data_numInDataGroup}`,
          dataID: "W407078",
          category: "設備控制",
          device: `LC${dVS_Data_numInDataGroup}`,
          log_dataName: `LC${dVS_Data_numInDataGroup}輸出實功`
        },
        setBut_acuHeatT: {
          dicName: `lc${dVS_Data_numInDataGroup}`,
          dataID: "W407016",
          category: "設備控制123",
          device: `LC${dVS_Data_numInDataGroup}`,
          log_dataName: `LC${dVS_Data_numInDataGroup}空調制熱溫度`
        },
        setBut_acuCoolT: {
          dicName: `lc${dVS_Data_numInDataGroup}`,
          dataID: "W407017",
          category: "設備控制456",
          device: `LC${dVS_Data_numInDataGroup}`,
          log_dataName: `LC${dVS_Data_numInDataGroup}空調制冷溫度`
        }
        //
        //
        //
        //
      };

      const data_AfM = data_MT[dVS_Data_dataName];
      const setValue = Math.round(Number(setValue_raw) / dVS_Data_scale);
      console.log(setValue);

      if (setValue >= dVS_Data_minLimit && setValue <= dVS_Data_maxLimit) {
        const dataPromises = databases.map(async (dbName) => {
          const nano = createNanoInstance(dbName);
          return getLatestDocument(nano);
        });

        const allData = await Promise.all(dataPromises);
        const dwctrlData = allData[4];
        const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));

        newdwctrlData[data_AfM.dicName][data_AfM.dataID] = setValue;

        //const accountDb = createNanoInstance("account");
        //存入資料庫的時區問題
        const currentDate = new Date();
        const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // Offset in milliseconds
        const localTime = new Date(currentDate - timezoneOffset);
        const isoString = localTime.toISOString().replace("Z", "+08:00");

        // 刪除_id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
        newdwctrlData.time = isoString;
        delete newdwctrlData._id;
        delete newdwctrlData._rev;
        await nano.use("dwctrl").insert(newdwctrlData);
        // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))

        //log紀錄
        const logDb = createNanoInstance("log");

        const doc = {
          tag: `${data_AfM.dicName}.${data_AfM.dataID}`,
          time: isoString,
          category: data_AfM.category,
          device: data_AfM.device,
          username: "SE0008",
          content: `將${data_AfM.log_dataName}設為${(Math.round(Number(setValue_raw) / dVS_Data_scale) * dVS_Data_scale).toFixed(dVS_Data_decPlace)} ${dVS_Data_unit}`
        };
        console.log(doc);

        // if (selectedValue != 0) {
        const result = await logDb.insert(doc);
        // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))
        //   //console.log(result);
        // }

        //console.log("Document added to database. ID: " + result.id);
        response = {
          ststus: ok,
          alarmCMU_rawD: 314159,
          faultCMU_rawD: 6626,
          DL_of_statusHW: 1602
        };
      } else {
        console.log("數值範圍有誤~~~");
        response = { status: "error" };
      }
    } else {
      console.log("數值輸入錯誤~@@");
      response = { status: "error" };
    }
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

let dSS_Data_dataName;
let dSS_Data_numInDataGroup;
let dSS_Data_bitNum;
let dSS_Data_status_MT;

router.post("/get_dSS_Data_WhenClicking", async (req, res) => {
  try {
    console.log("接收到前端請求");
    dSS_Data_dataName = req.body.dataName;
    dSS_Data_numInDataGroup = req.body.numInDataGroup;

    const data_MT = {
      setBut_modeAP: {
        dbName_gD: `lc${dSS_Data_numInDataGroup}_rf10`,
        dicName: "Ctrl",
        dataID: 407010,
        bitNum: 999,
        status_MT: { " 0": "主動", " 1": "被動" }
      },
      setBut_modeQctrl: {
        dbName_gD: `lc${dSS_Data_numInDataGroup}_rf10`,
        dicName: "Ctrl",
        dataID: 407011,
        bitNum: 999,
        status_MT: {
          " 162": "功率(kVar)模式",
          " 161": "功因模式",
          " 85": "關閉"
        }
      },
      setBut_standbyCmd: {
        dbName_gD: `lc${dSS_Data_numInDataGroup}_rf10`,
        dicName: "Ctrl",
        dataID: 407012,
        bitNum: 999,
        status_MT: { " 170": "待機", " 85": "停止待機" }
      },
      setBut_modeLR: {
        dbName_gD: `lc${dSS_Data_numInDataGroup}_rf10`,
        dicName: "Ctrl",
        dataID: 407013,
        bitNum: 999,
        status_MT: { " 0": "本地 & 遠端", " 1": "遠端", " 2": "本地" }
      },
      setBut_acuOnOff: {
        dbName_gD: `lc${dSS_Data_numInDataGroup}_rf10`,
        dicName: "Ctrl",
        dataID: 407018,
        bitNum: 999,
        status_MT: { " 1": "啟動", " 0": "停止" }
      }
      //
      //
    };

    const data_AfM = data_MT[dSS_Data_dataName];
    dSS_Data_bitNum = data_AfM.bitNum;
    dSS_Data_status_MT = data_AfM.status_MT;
    // console.log(data_AfM.dbName_gD);

    const dataPromises = databases.map(async (dbName) => {
      const nano = createNanoInstance(dbName);
      return getLatestDocument(nano);
    });

    const allData = await Promise.all(dataPromises);

    const getData_raw =
      allData[databases.indexOf(data_AfM.dbName_gD)][data_AfM.dicName][
        data_AfM.dataID
      ];

    let getData;
    if (data_AfM.bitNum === 999) {
      getData = `${getData_raw}`;
    } else {
      getData = Convert_UInt_to_revBitString(getData_raw, 32)[data_AfM.bitNum];
    }

    const response = { originData: getData, status_MT: data_AfM.status_MT };

    res.json(response);
    // if (!lcData) {
    //   throw new Error("No data found");
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/set_dSS_Data", async (req, res) => {
  try {
    const setValue_raw = req.body.setValue;

    const data_MT = {
      setBut_modeAP: {
        dicName: `lc${dSS_Data_numInDataGroup}`,
        dataID: "W407010",
        category: "設備控制",
        device: `LC${dSS_Data_numInDataGroup}`,
        log_dataName: `LC${dSS_Data_numInDataGroup}主/被動模式`
      },
      setBut_modeQctrl: {
        dicName: `lc${dSS_Data_numInDataGroup}`,
        dataID: "W407011",
        category: "設備控制9101",
        device: `LC${dSS_Data_numInDataGroup}`,
        log_dataName: `LC${dSS_Data_numInDataGroup}虛功模式`
      },
      setBut_standbyCmd: {
        dicName: `lc${dSS_Data_numInDataGroup}`,
        dataID: "W407012",
        category: "設備控制2531",
        device: `LC${dSS_Data_numInDataGroup}`,
        log_dataName: `LC${dSS_Data_numInDataGroup}PCS待機指令`
      },
      setBut_modeLR: {
        dicName: `lc${dSS_Data_numInDataGroup}`,
        dataID: "W407013",
        category: "設備控制4587",
        device: `LC${dSS_Data_numInDataGroup}`,
        log_dataName: `LC${dSS_Data_numInDataGroup}本地/遠端模式`
      },
      setBut_acuOnOff: {
        dicName: `lc${dSS_Data_numInDataGroup}`,
        dataID: "W407018",
        category: "設備控制7096",
        device: `LC${dSS_Data_numInDataGroup}`,
        log_dataName: `LC${dSS_Data_numInDataGroup}空調啟停`
      }
      //
      //
    };

    const data_AfM = data_MT[dSS_Data_dataName];

    const dataPromises = databases.map(async (dbName) => {
      const nano = createNanoInstance(dbName);
      return getLatestDocument(nano);
    });

    const allData = await Promise.all(dataPromises);
    const dwctrlData = allData[4];
    const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));

    let setValue;
    if (dSS_Data_bitNum === 999) {
      setValue = Number(setValue_raw);
    } else {
      let setValue_old = Convert_UInt_to_BitString(
        newdwctrlData[data_AfM.dicName][data_AfM.dataID],
        32
      ).bitString;
      console.log(setValue_old);
      setValue_old =
        setValue_old.slice(0, 31 - dSS_Data_bitNum) +
        setValue_raw.slice(1) +
        setValue_old.slice(31 - dSS_Data_bitNum + 1);
      console.log(setValue_old);
      setValue = parseInt(setValue_old, 2);
    }

    console.log(setValue);
    newdwctrlData[data_AfM.dicName][data_AfM.dataID] = setValue;

    //const accountDb = createNanoInstance("account");
    //存入資料庫的時區問題
    const currentDate = new Date();
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localTime = new Date(currentDate - timezoneOffset);
    const isoString = localTime.toISOString().replace("Z", "+08:00");

    // 刪除_id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
    newdwctrlData.time = isoString;
    delete newdwctrlData._id;
    delete newdwctrlData._rev;
    await nano.use("dwctrl").insert(newdwctrlData); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))

    //log紀錄
    const logDb = createNanoInstance("log");

    const doc = {
      tag: `${data_AfM.dicName}.${data_AfM.dataID}`,
      time: isoString,
      category: data_AfM.category,
      device: data_AfM.device,
      username: "SE0008",
      content: `將${data_AfM.log_dataName}設為${dSS_Data_status_MT[setValue_raw]}`
    };
    console.log(doc);

    // if (selectedValue != 0) {
    const result = await logDb.insert(doc); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))
    //   //console.log(result);
    // }

    //console.log("Document added to database. ID: " + result.id);
    let response = {
      ststus: ok,
      alarmCMU_rawD: 314159,
      faultCMU_rawD: 6626,
      DL_of_statusHW: 1602
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//************************************************************************************************************** */

// router.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });

//************************************************************************************************************** */
//點位顏色範例
// router.get("/operateinfo/pcs/InfoDetail/100", async (req, res) => {
//   try {
//     // 獲取當前連接的所有 collection 名稱
//     //const collections = mongoose.connection.collections;

//     // 轉換為 collection 名稱的數組
//     //const collectionNames = Object.keys(collections);

//     //console.log("當前連接中的 collection 名稱：", collectionNames);

//     // 從數據庫中查詢 Other1 資料
//     //const lcData = await Lc01.findOne().sort({ time_log: -1 });

//     // 檢查是否有找到數據
//     // if (!lcData) {
//     //   throw new Error("No data found");
//     // }

//     // 定義屬性和相應的比例和小數點位數
//     const scaleAndPointMapping = {
//       403001: { scale: 0.1, point: 1 },
//       403002: { scale: 0.1, point: 1 },
//       403004: { scale: 0.1, point: 2 },
//       403006: { scale: 0.1, point: 2 },
//       403007: { scale: 1, point: 0 },
//       403009: { scale: 1, point: 0 },
//     };

//     // 定義處理函數映射表
//     const processFunctions = {
//       403007: mapchargeStatus,
//       403009: mapPCSWorkingStatus,
//     };
//     const data = {};
//     //scaleProcess 是一個通用的轉換函數，可以應用在所有的屬性上，而 processFunctions 主要用於那些需要特殊處理的屬性。

//     Object.entries(scaleAndPointMapping).forEach(
//       ([property, { scale, point }]) => {
//         const originalValue = lcData.PCS[property];
//         const scaledValue = scaleProcess(originalValue, scale, point);

//         // 如果有定義對應的處理函數，則應用
//         const processFunction = processFunctions[property];
//         const processedValue = processFunction
//           ? processFunction(scaledValue)
//           : scaledValue;

//         data[property] = processedValue;
//       }
//     );

//     const pcsCHGStatus_MT = {
//       0: "Charging",
//       1: "Discharging",
//       2: "Non-working state",
//     };
//     const hvacStatus_MT = {
//       0: "Comm error",
//       1: "Stop",
//       2: "Running",
//       3: "Fault",
//       85: "Not configured",
//     };
//     const upsMode_MT = {
//       66: "Battery mode",
//       67: "Converter mode",
//       68: "Shutdown mode",
//       69: "HE/ECO mode",
//       70: "Fault mode",
//       76: "Line mode",
//       80: "Power on mode",
//       83: "Standby mode",
//       84: "Battery test mode",
//       89: "Bypass mode",
//     };
//     const reactiveReg_MT = {
//       85: "Off",
//       161: "Power factor mode",
//       162: "Reactive power mode",
//     };
//     const SS_status_MT = {
//       0: { 0: "不可用", 1: "可用" },
//       1: { 0: "停止", 1: "運行" },
//       2: { 0: "否", 1: "是" },
//       3: { 0: "禁用", 1: "啟用" },
//       5: { 0: "頻率表", 1: "測試頻率" },
//       6: { 0: "手動", 1: "自動" },
//       9: { 0: "正常", 1: "異常" },
//       12: { 0: "正常", 1: "通訊異常" },
//       13: { 0: "SOC", 1: "Volt" },
//       14: { 0: "藍", 1: "橘" },
//     };
//     const Alm_spBitList = [1, 3, 4, 7, 8, 9, 11, 12, 15];

//     let Rack2_11_405010_HLB = getHighLowByte(lcData.RackSub2.Rack11[405010]);
//     let Rack2_11_405001_BitStr = Convert_UInt_to_revBitString(
//       lcData.RackSub2.Rack11[405001],
//       16
//     );
//     let Rack2_11_405030 = Convert_UInt_to_BitString(
//       lcData.RackSub2.Rack11[405030],
//       16
//     );

//     // 將數據傳遞給 EJS 模板，包括所有變數
//     res.render("../views/test_meter", {
//       permission: "manager",
//       overallFault: data["403001"],
//       overallAlarm: data["403002"],
//       Transformernodestatus: data["403004"], //暫無出現 先用描述暫代
//       Transformeroiltemperature: data["403006"], //暫無出現 先用描述暫代
//       HB_Counts: data["403007"],
//       leakage: data["403009"],
//       PCS1_403011: lcData.PCS[403011],
//       PCS1_403013: lcData.PCS[403013],
//       Sys_402002: lcData.System[402002],

//       Rack2_11_405002: lcData.RackSub2.Rack11[405002],
//       Rack2_11_405002_AS: scaleProcess(lcData.RackSub2.Rack11[405002], 0.01, 1),
//       Rack2_11_405004: mapWordStatus(
//         lcData.RackSub2.Rack11[405004],
//         pcsCHGStatus_MT
//       ),
//       Rack2_11_405005: mapWordStatus(
//         lcData.RackSub2.Rack11[405005],
//         hvacStatus_MT
//       ),
//       Rack2_11_405006: mapWordStatus(
//         lcData.RackSub2.Rack11[405006],
//         upsMode_MT
//       ),
//       Rack2_11_405009: mapWordStatus(
//         lcData.RackSub2.Rack11[405009],
//         reactiveReg_MT
//       ),
//       Rack2_11_405010_rawD: lcData.RackSub2.Rack11[405010],
//       Rack2_11_405010: Rack2_11_405010_HLB,
//       Rack2_11_405010_H: Rack2_11_405010_HLB["hiByte"],
//       Rack2_11_405010_L: Rack2_11_405010_HLB.loByte,
//       Rack2_11_405011: Convert_unixTime_to_dateTime(
//         lcData.RackSub2.Rack11[405011]
//       ),
//       BMS_CHG_E: Calculate_BMS_energy(
//         lcData.RackSub2.Rack11[405012],
//         lcData.RackSub2.Rack11[405013],
//         lcData.RackSub2.Rack11[405014]
//       ),
//       AuxMeter_E: Calculate_CPM10_energy(
//         lcData.RackSub2.Rack11[405015],
//         lcData.RackSub2.Rack11[405016],
//         lcData.RackSub2.Rack11[405017]
//       ),
//       Rack2_11_405020: Calculate_N1450_PF(lcData.RackSub2.Rack11[405020]),
//       Rack2_11_405028: Calculate_Tr_oilTemp(lcData.RackSub2.Rack11[405028]),
//       Rack2_11_405001_rawD: lcData.RackSub2.Rack11[405001],
//       Rack2_11_405001: Rack2_11_405001_BitStr,
//       Rack2_11_405001_b0_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         0
//       ),
//       Rack2_11_405001_b1_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         1
//       ),
//       Rack2_11_405001_b2_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         2
//       ),
//       Rack2_11_405001_b3_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         3
//       ),
//       Rack2_11_405001_b4_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         4
//       ),
//       Rack2_11_405001_b5_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         5
//       ),
//       Rack2_11_405001_b6_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         6
//       ),
//       Rack2_11_405001_b7_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         7
//       ),
//       Rack2_11_405001_b8_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         8
//       ),
//       Rack2_11_405001_b9_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         9
//       ),
//       Rack2_11_405001_b10_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         10
//       ),
//       Rack2_11_405001_b11_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         11
//       ),
//       Rack2_11_405001_b12_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         12
//       ),
//       Rack2_11_405001_b13_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         13
//       ),
//       Rack2_11_405001_b14_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         14
//       ),
//       Rack2_11_405001_b15_status: mapBitStatus(
//         Rack2_11_405001_BitStr,
//         SS_status_MT,
//         15
//       ),

//       Rack2_11_405030_rawD: lcData.RackSub2.Rack11[405030],
//       Rack2_11_405030: Rack2_11_405030,

//       Alm_SBL: Alm_spBitList,
//       Rack2_11_405032_rawD: lcData.RackSub2.Rack11[405032],
//       Rack2_11_405032_BitStr: Convert_UInt_to_revBitString(
//         lcData.RackSub2.Rack11[405032],
//         16
//       ),
//       Rack2_11_405032: Count_SpecificClosedBit(
//         lcData.RackSub2.Rack11[405032],
//         16,
//         Alm_spBitList
//       ),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });
