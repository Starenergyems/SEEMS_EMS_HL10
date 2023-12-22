const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Lc01 = require("../models/lcschema");
const app = express(); // Create an Express application instance
const cors = require("cors");
const router = express.Router();
const {
  scaleProcess,
  mapchargeStatus,
  mapPCSWorkingStatus,
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
router.get("/operateinfo/pcs/InfoDetail/1", async (req, res) => {
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
    const Alm_spBitList = [0, 1, 2, 5, 6, 10, 13, 14];

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

router.get("/operateinfo/pcs/infodetail/2", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/3", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/4", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/5", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/6", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/7", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/alarm", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/1", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/2", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/3", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/4", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/5", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/6", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/7", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

module.exports = router;
