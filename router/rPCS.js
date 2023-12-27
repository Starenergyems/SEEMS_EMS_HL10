const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Lc = require("../models/lcschema");
const Lc01 = Lc['Lc01'];
const Lc02 = Lc['Lc02'];
const Lc03 = Lc['Lc03'];
const Lc04 = Lc['Lc04'];
// const Lc01 = require("../models/lcschema");
const app = express(); // Create an Express application instance
const cors = require("cors");
const router = express.Router();
const {
  scaleProcess,
  mapchargeStatus,                 //
  mapPCSWorkingStatus,             //
  Convert_UInt_to_revBitString,
  Convert_UInt_to_BitString,
  mapWordStatus,
  mapBitStatus,
  getHighLowByte,
  Convert_unixTime_to_dateTime,
  Calculate_BMS_energy,
  Calculate_CPM10_energy,
  Calculate_N1450_PF,
  Calculate_Tr_oilTemp,
  Count_SpecificClosedBit,
} = require("./function");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
// 共同的中間件，處理 /operateinfo/pcs/infodetail/1、2、3、4、5 及其子路徑下的靜態文件
router.use(
  "/operateinfo/pcs/infodetail/:id",
  express.static(path.join(__dirname, "../public"))
);

router.use(cors());

//pcs主頁
router.get("/operateinfo/pcs", async (req, res) => {
  res.render("Op_PCS_InfoSummary");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/operateinfo/pcs/infodetail", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

//多台pcs狀態 更改數字即可
router.get("/operateinfo/pcs/InfoDetail/100", async (req, res) => {
  try {
    // 獲取當前連接的所有 collection 名稱
    const collections = mongoose.connection.collections;

    // 轉換為 collection 名稱的數組
    const collectionNames = Object.keys(collections);

    console.log("當前連接中的 collection 名稱：", collectionNames);

    // 從數據庫中查詢 Other1 資料
    const lcData = await Lc01.findOne().sort({ time_log: -1 });

    // 檢查是否有找到數據
    if (!lcData) {
      throw new Error("No data found");
    }

    // 定義屬性和相應的比例和小數點位數
    const scaleAndPointMapping = {
      403001: { scale: 0.1, point: 1 },
      403002: { scale: 0.1, point: 1 },
      403004: { scale: 0.1, point: 2 },
      403006: { scale: 0.1, point: 2 },
      403007: { scale: 1, point: 0 },
      403009: { scale: 1, point: 0 },
    };

    // 定義處理函數映射表
    const processFunctions = {
      403007: mapchargeStatus,
      403009: mapPCSWorkingStatus,
    };
    const data = {};
    //scaleProcess 是一個通用的轉換函數，可以應用在所有的屬性上，而 processFunctions 主要用於那些需要特殊處理的屬性。

    Object.entries(scaleAndPointMapping).forEach(
      ([property, { scale, point }]) => {
        const originalValue = lcData.PCS1[property];
        const scaledValue = scaleProcess(originalValue, scale, point);

        // 如果有定義對應的處理函數，則應用
        const processFunction = processFunctions[property];
        const processedValue = processFunction
          ? processFunction(scaledValue)
          : scaledValue;

        data[property] = processedValue;
      }
    );

    const pcsCHGStatus_MT = {
      0: "Charging",
      1: "Discharging",
      2: "Non-working state"
    };
    const hvacStatus_MT = {
      0: "Comm error",
      1: "Stop",
      2: "Running",
      3: "Fault",
      85: "Not configured"
    };
    const upsMode_MT = {
      66: "Battery mode",
      67: "Converter mode",
      68: "Shutdown mode",
      69: "HE/ECO mode",
      70: "Fault mode",
      76: "Line mode",
      80: "Power on mode",
      83: "Standby mode",
      84: "Battery test mode",
      89: "Bypass mode"
    };
    const reactiveReg_MT = {
      85: "Off",
      161: "Power factor mode",
      162: "Reactive power mode"
    };
    const SS_status_MT = {
      0: { 0: "不可用", 1: "可用" },
      1: { 0: "停止", 1: "運行" },
      2: { 0: "否", 1: "是" },
      3: { 0: "禁用", 1: "啟用" },
      5: { 0: "頻率表", 1: "測試頻率" },
      6: { 0: "手動", 1: "自動" },
      9: { 0: "正常", 1: "異常" },
      12: { 0: "正常", 1: "通訊異常" },
      13: { 0: "SOC", 1: "Volt" },
      14: { 0: "藍", 1: "橘" },
    };
    const Alm_spBitList = [1, 3, 4, 7, 8, 9, 11, 12, 15];

    let Rack2_11_405010_HLB = getHighLowByte(lcData.RackSub2.Rack11[405010]);
    let Rack2_11_405001_BitStr = Convert_UInt_to_revBitString(lcData.RackSub2.Rack11[405001], 16);
    let Rack2_11_405030 = Convert_UInt_to_BitString(lcData.RackSub2.Rack11[405030], 16);

    // 將數據傳遞給 EJS 模板，包括所有變數
    res.render("../views/test_meter", {
      overallFault: data["403001"],
      overallAlarm: data["403002"],
      Transformernodestatus: data["403004"], //暫無出現 先用描述暫代
      Transformeroiltemperature: data["403006"], //暫無出現 先用描述暫代
      HB_Counts: data["403007"],
      leakage: data["403009"],
      PCS1_403011: lcData.PCS1[403011],
      PCS1_403013: lcData.PCS1[403013],
      Sys_402002: lcData.System[402002],

      Rack2_11_405002: lcData.RackSub2.Rack11[405002],
      Rack2_11_405002_AS: scaleProcess(lcData.RackSub2.Rack11[405002], 0.01, 1),
      Rack2_11_405004: mapWordStatus(lcData.RackSub2.Rack11[405004], pcsCHGStatus_MT),
      Rack2_11_405005: mapWordStatus(lcData.RackSub2.Rack11[405005], hvacStatus_MT),
      Rack2_11_405006: mapWordStatus(lcData.RackSub2.Rack11[405006], upsMode_MT),
      Rack2_11_405009: mapWordStatus(lcData.RackSub2.Rack11[405009], reactiveReg_MT),
      Rack2_11_405010_rawD: lcData.RackSub2.Rack11[405010],
      Rack2_11_405010: Rack2_11_405010_HLB,
      Rack2_11_405010_H: Rack2_11_405010_HLB["hiByte"],
      Rack2_11_405010_L: Rack2_11_405010_HLB.loByte,
      Rack2_11_405011: Convert_unixTime_to_dateTime(lcData.RackSub2.Rack11[405011]),
      BMS_CHG_E: Calculate_BMS_energy(lcData.RackSub2.Rack11[405012], lcData.RackSub2.Rack11[405013], lcData.RackSub2.Rack11[405014]),
      AuxMeter_E: Calculate_CPM10_energy(lcData.RackSub2.Rack11[405015], lcData.RackSub2.Rack11[405016], lcData.RackSub2.Rack11[405017]),
      Rack2_11_405020: Calculate_N1450_PF(lcData.RackSub2.Rack11[405020]),
      Rack2_11_405028: Calculate_Tr_oilTemp(lcData.RackSub2.Rack11[405028]),
      Rack2_11_405001_rawD: lcData.RackSub2.Rack11[405001],
      Rack2_11_405001: Rack2_11_405001_BitStr,
      Rack2_11_405001_b0_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 0),
      Rack2_11_405001_b1_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 1),
      Rack2_11_405001_b2_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 2),
      Rack2_11_405001_b3_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 3),
      Rack2_11_405001_b4_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 4),
      Rack2_11_405001_b5_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 5),
      Rack2_11_405001_b6_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 6),
      Rack2_11_405001_b7_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 7),
      Rack2_11_405001_b8_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 8),
      Rack2_11_405001_b9_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 9),
      Rack2_11_405001_b10_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 10),
      Rack2_11_405001_b11_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 11),
      Rack2_11_405001_b12_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 12),
      Rack2_11_405001_b13_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 13),
      Rack2_11_405001_b14_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 14),
      Rack2_11_405001_b15_status: mapBitStatus(Rack2_11_405001_BitStr, SS_status_MT, 15),

      Rack2_11_405030_rawD: lcData.RackSub2.Rack11[405030],
      Rack2_11_405030: Rack2_11_405030,

      Alm_SBL: Alm_spBitList,
      Rack2_11_405032_rawD: lcData.RackSub2.Rack11[405032],
      Rack2_11_405032_BitStr: Convert_UInt_to_revBitString(lcData.RackSub2.Rack11[405032], 16),
      Rack2_11_405032: Count_SpecificClosedBit(lcData.RackSub2.Rack11[405032], 16, Alm_spBitList),

    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//多台pcs警告
// router.get("/operateinfo/pcs/alarm/1", async (req, res) => {
// });

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

const pcsCHGStatus_MT = { 0: "充電", 1: "放電", 2: "非工作狀態" };
const pcsGridStatus_MT = { 0: "離網", 1: "併網" };

router.get("/operateinfo/pcs/infodetail/1", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc01.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_InfoDetail", {
      No_of_PCS: "1-1",

      chargeStatus: mapWordStatus(lcData.PCS1[403040], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS1[403045], 0.01, 1),
      tot_E_dcg: scaleProcess(lcData.PCS1[403047], 0.01, 1),
      max_P_chg: scaleProcess(lcData.PCS1[403066], 0.1, 1),
      max_P_dcg: scaleProcess(lcData.PCS1[403067], 0.1, 1),
      max_Q_l: scaleProcess(lcData.PCS1[403068], 0.1, 1),
      max_Q_c: scaleProcess(lcData.PCS1[403069], 0.1, 1),
      HB_Counts: lcData.PCS1[403007],
      leakage_I: scaleProcess(lcData.PCS1[403008], 0.01, 2),
      gridStatus: mapWordStatus(lcData.PCS1[403054], pcsGridStatus_MT),
      activePower: scaleProcess(lcData.PCS1[403026], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS1[403028], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS1[403056], 0.001, 3),
      voltageRS: scaleProcess(lcData.PCS1[403020], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS1[403021], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS1[403022], 0.1, 1),
      currentR: scaleProcess(lcData.PCS1[403023], 0.1, 1),
      currentS: scaleProcess(lcData.PCS1[403024], 0.1, 1),
      currentT: scaleProcess(lcData.PCS1[403025], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS1[403055], 0.01, 2),
      pElectrodeR: scaleProcess(lcData.PCS1[403030], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS1[403032], 0.01, 2),
      DCvoltage: scaleProcess(lcData.PCS1[403017], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS1[403018], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS1[403019], 0.1, 1),
      overallFault: lcData.PCS1[403001],
      overallAlarm: lcData.PCS1[403002],
      faultStatus: lcData.PCS1[403036] + lcData.PCS1[403038],
      alarmStatus: lcData.PCS1[403034] + lcData.PCS1[403035],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS1[403058], 16),
      innerTemp: scaleProcess(lcData.PCS1[403057], 0.1, 1),
      moduleTemp1: scaleProcess(lcData.PCS1[403014], 0.1, 1),
      moduleTemp2: scaleProcess(lcData.PCS1[403015], 0.1, 1),
      moduleTemp3: scaleProcess(lcData.PCS1[403016], 0.1, 1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/infodetail/2", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc01.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_InfoDetail", {
      No_of_PCS: "1-2",

      chargeStatus: mapWordStatus(lcData.PCS2[403040], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS2[403045], 0.01, 1),
      tot_E_dcg: scaleProcess(lcData.PCS2[403047], 0.01, 1),
      max_P_chg: scaleProcess(lcData.PCS2[403066], 0.1, 1),
      max_P_dcg: scaleProcess(lcData.PCS2[403067], 0.1, 1),
      max_Q_l: scaleProcess(lcData.PCS2[403068], 0.1, 1),
      max_Q_c: scaleProcess(lcData.PCS2[403069], 0.1, 1),
      HB_Counts: lcData.PCS2[403007],
      leakage_I: scaleProcess(lcData.PCS2[403008], 0.01, 2),
      gridStatus: mapWordStatus(lcData.PCS2[403054], pcsGridStatus_MT),
      activePower: scaleProcess(lcData.PCS2[403026], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS2[403028], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS2[403056], 0.001, 3),
      voltageRS: scaleProcess(lcData.PCS2[403020], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS2[403021], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS2[403022], 0.1, 1),
      currentR: scaleProcess(lcData.PCS2[403023], 0.1, 1),
      currentS: scaleProcess(lcData.PCS2[403024], 0.1, 1),
      currentT: scaleProcess(lcData.PCS2[403025], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS2[403055], 0.01, 2),
      pElectrodeR: scaleProcess(lcData.PCS2[403030], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS2[403032], 0.01, 2),
      DCvoltage: scaleProcess(lcData.PCS2[403017], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS2[403018], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS2[403019], 0.1, 1),
      overallFault: lcData.PCS2[403001],
      overallAlarm: lcData.PCS2[403002],
      faultStatus: lcData.PCS2[403036] + lcData.PCS2[403038],
      alarmStatus: lcData.PCS2[403034] + lcData.PCS2[403035],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS2[403058], 16),
      innerTemp: scaleProcess(lcData.PCS2[403057], 0.1, 1),
      moduleTemp1: scaleProcess(lcData.PCS2[403014], 0.1, 1),
      moduleTemp2: scaleProcess(lcData.PCS2[403015], 0.1, 1),
      moduleTemp3: scaleProcess(lcData.PCS2[403016], 0.1, 1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/infodetail/3", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc02.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_InfoDetail", {
      No_of_PCS: "2-1",

      chargeStatus: mapWordStatus(lcData.PCS1[403040], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS1[403045], 0.01, 1),
      tot_E_dcg: scaleProcess(lcData.PCS1[403047], 0.01, 1),
      max_P_chg: scaleProcess(lcData.PCS1[403066], 0.1, 1),
      max_P_dcg: scaleProcess(lcData.PCS1[403067], 0.1, 1),
      max_Q_l: scaleProcess(lcData.PCS1[403068], 0.1, 1),
      max_Q_c: scaleProcess(lcData.PCS1[403069], 0.1, 1),
      HB_Counts: lcData.PCS1[403007],
      leakage_I: scaleProcess(lcData.PCS1[403008], 0.01, 2),
      gridStatus: mapWordStatus(lcData.PCS1[403054], pcsGridStatus_MT),
      activePower: scaleProcess(lcData.PCS1[403026], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS1[403028], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS1[403056], 0.001, 3),
      voltageRS: scaleProcess(lcData.PCS1[403020], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS1[403021], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS1[403022], 0.1, 1),
      currentR: scaleProcess(lcData.PCS1[403023], 0.1, 1),
      currentS: scaleProcess(lcData.PCS1[403024], 0.1, 1),
      currentT: scaleProcess(lcData.PCS1[403025], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS1[403055], 0.01, 2),
      pElectrodeR: scaleProcess(lcData.PCS1[403030], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS1[403032], 0.01, 2),
      DCvoltage: scaleProcess(lcData.PCS1[403017], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS1[403018], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS1[403019], 0.1, 1),
      overallFault: lcData.PCS1[403001],
      overallAlarm: lcData.PCS1[403002],
      faultStatus: lcData.PCS1[403036] + lcData.PCS1[403038],
      alarmStatus: lcData.PCS1[403034] + lcData.PCS1[403035],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS1[403058], 16),
      innerTemp: scaleProcess(lcData.PCS1[403057], 0.1, 1),
      moduleTemp1: scaleProcess(lcData.PCS1[403014], 0.1, 1),
      moduleTemp2: scaleProcess(lcData.PCS1[403015], 0.1, 1),
      moduleTemp3: scaleProcess(lcData.PCS1[403016], 0.1, 1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/infodetail/4", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc02.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_InfoDetail", {
      No_of_PCS: "2-2",

      chargeStatus: mapWordStatus(lcData.PCS2[403040], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS2[403045], 0.01, 1),
      tot_E_dcg: scaleProcess(lcData.PCS2[403047], 0.01, 1),
      max_P_chg: scaleProcess(lcData.PCS2[403066], 0.1, 1),
      max_P_dcg: scaleProcess(lcData.PCS2[403067], 0.1, 1),
      max_Q_l: scaleProcess(lcData.PCS2[403068], 0.1, 1),
      max_Q_c: scaleProcess(lcData.PCS2[403069], 0.1, 1),
      HB_Counts: lcData.PCS2[403007],
      leakage_I: scaleProcess(lcData.PCS2[403008], 0.01, 2),
      gridStatus: mapWordStatus(lcData.PCS2[403054], pcsGridStatus_MT),
      activePower: scaleProcess(lcData.PCS2[403026], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS2[403028], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS2[403056], 0.001, 3),
      voltageRS: scaleProcess(lcData.PCS2[403020], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS2[403021], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS2[403022], 0.1, 1),
      currentR: scaleProcess(lcData.PCS2[403023], 0.1, 1),
      currentS: scaleProcess(lcData.PCS2[403024], 0.1, 1),
      currentT: scaleProcess(lcData.PCS2[403025], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS2[403055], 0.01, 2),
      pElectrodeR: scaleProcess(lcData.PCS2[403030], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS2[403032], 0.01, 2),
      DCvoltage: scaleProcess(lcData.PCS2[403017], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS2[403018], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS2[403019], 0.1, 1),
      overallFault: lcData.PCS2[403001],
      overallAlarm: lcData.PCS2[403002],
      faultStatus: lcData.PCS2[403036] + lcData.PCS2[403038],
      alarmStatus: lcData.PCS2[403034] + lcData.PCS2[403035],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS2[403058], 16),
      innerTemp: scaleProcess(lcData.PCS2[403057], 0.1, 1),
      moduleTemp1: scaleProcess(lcData.PCS2[403014], 0.1, 1),
      moduleTemp2: scaleProcess(lcData.PCS2[403015], 0.1, 1),
      moduleTemp3: scaleProcess(lcData.PCS2[403016], 0.1, 1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/infodetail/5", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc03.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_InfoDetail", {
      No_of_PCS: "3-1",

      chargeStatus: mapWordStatus(lcData.PCS1[403040], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS1[403045], 0.01, 1),
      tot_E_dcg: scaleProcess(lcData.PCS1[403047], 0.01, 1),
      max_P_chg: scaleProcess(lcData.PCS1[403066], 0.1, 1),
      max_P_dcg: scaleProcess(lcData.PCS1[403067], 0.1, 1),
      max_Q_l: scaleProcess(lcData.PCS1[403068], 0.1, 1),
      max_Q_c: scaleProcess(lcData.PCS1[403069], 0.1, 1),
      HB_Counts: lcData.PCS1[403007],
      leakage_I: scaleProcess(lcData.PCS1[403008], 0.01, 2),
      gridStatus: mapWordStatus(lcData.PCS1[403054], pcsGridStatus_MT),
      activePower: scaleProcess(lcData.PCS1[403026], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS1[403028], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS1[403056], 0.001, 3),
      voltageRS: scaleProcess(lcData.PCS1[403020], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS1[403021], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS1[403022], 0.1, 1),
      currentR: scaleProcess(lcData.PCS1[403023], 0.1, 1),
      currentS: scaleProcess(lcData.PCS1[403024], 0.1, 1),
      currentT: scaleProcess(lcData.PCS1[403025], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS1[403055], 0.01, 2),
      pElectrodeR: scaleProcess(lcData.PCS1[403030], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS1[403032], 0.01, 2),
      DCvoltage: scaleProcess(lcData.PCS1[403017], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS1[403018], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS1[403019], 0.1, 1),
      overallFault: lcData.PCS1[403001],
      overallAlarm: lcData.PCS1[403002],
      faultStatus: lcData.PCS1[403036] + lcData.PCS1[403038],
      alarmStatus: lcData.PCS1[403034] + lcData.PCS1[403035],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS1[403058], 16),
      innerTemp: scaleProcess(lcData.PCS1[403057], 0.1, 1),
      moduleTemp1: scaleProcess(lcData.PCS1[403014], 0.1, 1),
      moduleTemp2: scaleProcess(lcData.PCS1[403015], 0.1, 1),
      moduleTemp3: scaleProcess(lcData.PCS1[403016], 0.1, 1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/infodetail/6", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc03.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_InfoDetail", {
      No_of_PCS: "3-2",

      chargeStatus: mapWordStatus(lcData.PCS2[403040], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS2[403045], 0.01, 1),
      tot_E_dcg: scaleProcess(lcData.PCS2[403047], 0.01, 1),
      max_P_chg: scaleProcess(lcData.PCS2[403066], 0.1, 1),
      max_P_dcg: scaleProcess(lcData.PCS2[403067], 0.1, 1),
      max_Q_l: scaleProcess(lcData.PCS2[403068], 0.1, 1),
      max_Q_c: scaleProcess(lcData.PCS2[403069], 0.1, 1),
      HB_Counts: lcData.PCS2[403007],
      leakage_I: scaleProcess(lcData.PCS2[403008], 0.01, 2),
      gridStatus: mapWordStatus(lcData.PCS2[403054], pcsGridStatus_MT),
      activePower: scaleProcess(lcData.PCS2[403026], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS2[403028], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS2[403056], 0.001, 3),
      voltageRS: scaleProcess(lcData.PCS2[403020], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS2[403021], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS2[403022], 0.1, 1),
      currentR: scaleProcess(lcData.PCS2[403023], 0.1, 1),
      currentS: scaleProcess(lcData.PCS2[403024], 0.1, 1),
      currentT: scaleProcess(lcData.PCS2[403025], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS2[403055], 0.01, 2),
      pElectrodeR: scaleProcess(lcData.PCS2[403030], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS2[403032], 0.01, 2),
      DCvoltage: scaleProcess(lcData.PCS2[403017], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS2[403018], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS2[403019], 0.1, 1),
      overallFault: lcData.PCS2[403001],
      overallAlarm: lcData.PCS2[403002],
      faultStatus: lcData.PCS2[403036] + lcData.PCS2[403038],
      alarmStatus: lcData.PCS2[403034] + lcData.PCS2[403035],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS2[403058], 16),
      innerTemp: scaleProcess(lcData.PCS2[403057], 0.1, 1),
      moduleTemp1: scaleProcess(lcData.PCS2[403014], 0.1, 1),
      moduleTemp2: scaleProcess(lcData.PCS2[403015], 0.1, 1),
      moduleTemp3: scaleProcess(lcData.PCS2[403016], 0.1, 1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/infodetail/7", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc04.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_InfoDetail", {
      No_of_PCS: "4-1",

      chargeStatus: mapWordStatus(lcData.PCS1[403040], pcsCHGStatus_MT),
      tot_E_chg: scaleProcess(lcData.PCS1[403045], 0.01, 1),
      tot_E_dcg: scaleProcess(lcData.PCS1[403047], 0.01, 1),
      max_P_chg: scaleProcess(lcData.PCS1[403066], 0.1, 1),
      max_P_dcg: scaleProcess(lcData.PCS1[403067], 0.1, 1),
      max_Q_l: scaleProcess(lcData.PCS1[403068], 0.1, 1),
      max_Q_c: scaleProcess(lcData.PCS1[403069], 0.1, 1),
      HB_Counts: lcData.PCS1[403007],
      leakage_I: scaleProcess(lcData.PCS1[403008], 0.01, 2),
      gridStatus: mapWordStatus(lcData.PCS1[403054], pcsGridStatus_MT),
      activePower: scaleProcess(lcData.PCS1[403026], 0.1, 1),
      reactivePower: scaleProcess(lcData.PCS1[403028], 0.1, 1),
      powerFactor: scaleProcess(lcData.PCS1[403056], 0.001, 3),
      voltageRS: scaleProcess(lcData.PCS1[403020], 0.1, 1),
      voltageST: scaleProcess(lcData.PCS1[403021], 0.1, 1),
      voltageTR: scaleProcess(lcData.PCS1[403022], 0.1, 1),
      currentR: scaleProcess(lcData.PCS1[403023], 0.1, 1),
      currentS: scaleProcess(lcData.PCS1[403024], 0.1, 1),
      currentT: scaleProcess(lcData.PCS1[403025], 0.1, 1),
      gridFreq: scaleProcess(lcData.PCS1[403055], 0.01, 2),
      pElectrodeR: scaleProcess(lcData.PCS1[403030], 0.01, 2),
      nElectrodeR: scaleProcess(lcData.PCS1[403032], 0.01, 2),
      DCvoltage: scaleProcess(lcData.PCS1[403017], 0.1, 1),
      DCcurrent: scaleProcess(lcData.PCS1[403018], 0.1, 1),
      DCpower: scaleProcess(lcData.PCS1[403019], 0.1, 1),
      overallFault: lcData.PCS1[403001],
      overallAlarm: lcData.PCS1[403002],
      faultStatus: lcData.PCS1[403036] + lcData.PCS1[403038],
      alarmStatus: lcData.PCS1[403034] + lcData.PCS1[403035],
      nodeStatus: Convert_UInt_to_revBitString(lcData.PCS1[403058], 16),
      innerTemp: scaleProcess(lcData.PCS1[403057], 0.1, 1),
      moduleTemp1: scaleProcess(lcData.PCS1[403014], 0.1, 1),
      moduleTemp2: scaleProcess(lcData.PCS1[403015], 0.1, 1),
      moduleTemp3: scaleProcess(lcData.PCS1[403016], 0.1, 1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/alarm", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/1", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc01.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_Alarm", {
      No_of_PCS: "1-1",
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS1[403001], 16).num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS1[403002], 16).num_ClosedBit,
      noFault: Convert_UInt_to_BitString(lcData.PCS1[403036], 32).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS1[403038], 32).num_ClosedBit,
      noAlarm: Convert_UInt_to_BitString(lcData.PCS1[403034], 16).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS1[403035], 16).num_ClosedBit,
      OF: Convert_UInt_to_revBitString(lcData.PCS1[403001], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS1[403002], 16),
      Alarm1: Convert_UInt_to_revBitString(lcData.PCS1[403034], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS1[403035], 16),
      Fault1: Convert_UInt_to_revBitString(lcData.PCS1[403036], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS1[403038], 32),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/alarm/2", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc01.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_Alarm", {
      No_of_PCS: "1-2",
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS2[403001], 16).num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS2[403002], 16).num_ClosedBit,
      noFault: Convert_UInt_to_BitString(lcData.PCS2[403036], 32).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS2[403038], 32).num_ClosedBit,
      noAlarm: Convert_UInt_to_BitString(lcData.PCS2[403034], 16).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS2[403035], 16).num_ClosedBit,
      OF: Convert_UInt_to_revBitString(lcData.PCS2[403001], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS2[403002], 16),
      Alarm1: Convert_UInt_to_revBitString(lcData.PCS2[403034], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS2[403035], 16),
      Fault1: Convert_UInt_to_revBitString(lcData.PCS2[403036], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS2[403038], 32),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/alarm/3", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc02.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_Alarm", {
      No_of_PCS: "2-1",
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS1[403001], 16).num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS1[403002], 16).num_ClosedBit,
      noFault: Convert_UInt_to_BitString(lcData.PCS1[403036], 32).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS1[403038], 32).num_ClosedBit,
      noAlarm: Convert_UInt_to_BitString(lcData.PCS1[403034], 16).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS1[403035], 16).num_ClosedBit,
      OF: Convert_UInt_to_revBitString(lcData.PCS1[403001], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS1[403002], 16),
      Alarm1: Convert_UInt_to_revBitString(lcData.PCS1[403034], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS1[403035], 16),
      Fault1: Convert_UInt_to_revBitString(lcData.PCS1[403036], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS1[403038], 32),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/alarm/4", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc02.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_Alarm", {
      No_of_PCS: "2-2",
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS2[403001], 16).num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS2[403002], 16).num_ClosedBit,
      noFault: Convert_UInt_to_BitString(lcData.PCS2[403036], 32).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS2[403038], 32).num_ClosedBit,
      noAlarm: Convert_UInt_to_BitString(lcData.PCS2[403034], 16).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS2[403035], 16).num_ClosedBit,
      OF: Convert_UInt_to_revBitString(lcData.PCS2[403001], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS2[403002], 16),
      Alarm1: Convert_UInt_to_revBitString(lcData.PCS2[403034], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS2[403035], 16),
      Fault1: Convert_UInt_to_revBitString(lcData.PCS2[403036], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS2[403038], 32),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/alarm/5", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc03.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_Alarm", {
      No_of_PCS: "3-1",
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS1[403001], 16).num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS1[403002], 16).num_ClosedBit,
      noFault: Convert_UInt_to_BitString(lcData.PCS1[403036], 32).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS1[403038], 32).num_ClosedBit,
      noAlarm: Convert_UInt_to_BitString(lcData.PCS1[403034], 16).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS1[403035], 16).num_ClosedBit,
      OF: Convert_UInt_to_revBitString(lcData.PCS1[403001], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS1[403002], 16),
      Alarm1: Convert_UInt_to_revBitString(lcData.PCS1[403034], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS1[403035], 16),
      Fault1: Convert_UInt_to_revBitString(lcData.PCS1[403036], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS1[403038], 32),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/alarm/6", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc03.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_Alarm", {
      No_of_PCS: "3-2",
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS2[403001], 16).num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS2[403002], 16).num_ClosedBit,
      noFault: Convert_UInt_to_BitString(lcData.PCS2[403036], 32).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS2[403038], 32).num_ClosedBit,
      noAlarm: Convert_UInt_to_BitString(lcData.PCS2[403034], 16).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS2[403035], 16).num_ClosedBit,
      OF: Convert_UInt_to_revBitString(lcData.PCS2[403001], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS2[403002], 16),
      Alarm1: Convert_UInt_to_revBitString(lcData.PCS2[403034], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS2[403035], 16),
      Fault1: Convert_UInt_to_revBitString(lcData.PCS2[403036], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS2[403038], 32),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/pcs/alarm/7", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lcData = await Lc04.findOne().sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    res.render("Op_PCS_Alarm", {
      No_of_PCS: "4-1",
      noOverallFault: Convert_UInt_to_BitString(lcData.PCS1[403001], 16).num_ClosedBit,
      noOverallAlarm: Convert_UInt_to_BitString(lcData.PCS1[403002], 16).num_ClosedBit,
      noFault: Convert_UInt_to_BitString(lcData.PCS1[403036], 32).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS1[403038], 32).num_ClosedBit,
      noAlarm: Convert_UInt_to_BitString(lcData.PCS1[403034], 16).num_ClosedBit + Convert_UInt_to_BitString(lcData.PCS1[403035], 16).num_ClosedBit,
      OF: Convert_UInt_to_revBitString(lcData.PCS1[403001], 16),
      OA: Convert_UInt_to_revBitString(lcData.PCS1[403002], 16),
      Alarm1: Convert_UInt_to_revBitString(lcData.PCS1[403034], 16),
      Alarm2: Convert_UInt_to_revBitString(lcData.PCS1[403035], 16),
      Fault1: Convert_UInt_to_revBitString(lcData.PCS1[403036], 32),
      Fault2: Convert_UInt_to_revBitString(lcData.PCS1[403038], 32),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

module.exports = router;
