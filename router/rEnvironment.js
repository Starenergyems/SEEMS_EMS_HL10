const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Lc = require("../models/lcschema");
const Lc01 = Lc['Lc01'];
const Lc02 = Lc['Lc02'];
const Lc03 = Lc['Lc03'];
const Lc04 = Lc['Lc04'];
const port = 3000;
const Dc = require("../models/dcschema");
const router = express.Router();
const app = express();
const cors = require("cors");
const {
  scaleProcess,
  mapWordStatus,
  Determine_DL_of_upsStatus2,
} = require("./function");

// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是環境，當前數據庫名稱：", currentDBName);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);


const acuOnOff_MT = { 0: "停機", 1: "啟動" };
const acuRunStatus_MT = { 0: "通訊異常", 1: "停機", 2: "運轉中", 3: "故障", 85: "未配置" };
const upsMode_MT = {
  66: "Battery mode",
  67: "Converter mode",
  68: "Shutdown mode",
  69: "HE/ECO mode",
  70: "Fault mode",
  76: "Line mode",
  80: "Power on mode",
  83: "Standby mode",
  84: "Battery test",
  89: "Bypass mode"
};

router.get("/systeminfo/environment", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    console.log("當前連接中的 collection 名稱：", collectionNames);

    const lc1Data = await Lc01.findOne().sort({ time_log: -1 });
    const lc2Data = await Lc02.findOne().sort({ time_log: -1 });
    const lc3Data = await Lc03.findOne().sort({ time_log: -1 });
    const lc4Data = await Lc04.findOne().sort({ time_log: -1 });

    if (!lc1Data) {
      throw new Error("No LC_01 data found");
    }
    if (!lc2Data) {
      throw new Error("No LC_02 data found");
    }
    if (!lc3Data) {
      throw new Error("No LC_03 data found");
    }
    if (!lc4Data) {
      throw new Error("No LC_04 data found");
    }

    res.render("Sys_Environment", {
      acuOnOff_1: mapWordStatus(lc1Data.Ctrl[407018], acuOnOff_MT),
      acuHeatT_1: scaleProcess(lc1Data.Ctrl[407016], 0.1, 1),
      acuCoolT_1: scaleProcess(lc1Data.Ctrl[407017], 0.1, 1),

      acuOnOff_2: mapWordStatus(lc2Data.Ctrl[407018], acuOnOff_MT),
      acuHeatT_2: scaleProcess(lc2Data.Ctrl[407016], 0.1, 1),
      acuCoolT_2: scaleProcess(lc2Data.Ctrl[407017], 0.1, 1),

      acuOnOff_3: mapWordStatus(lc3Data.Ctrl[407018], acuOnOff_MT),
      acuHeatT_3: scaleProcess(lc3Data.Ctrl[407016], 0.1, 1),
      acuCoolT_3: scaleProcess(lc3Data.Ctrl[407017], 0.1, 1),

      acuOnOff_4: mapWordStatus(lc4Data.Ctrl[407018], acuOnOff_MT),
      acuHeatT_4: scaleProcess(lc4Data.Ctrl[407016], 0.1, 1),
      acuCoolT_4: scaleProcess(lc4Data.Ctrl[407017], 0.1, 1),

      acu_1_Status_1_1: mapWordStatus(lc1Data.BSC1[406007], acuRunStatus_MT),
      acu_1_Temp_1_1: scaleProcess(lc1Data.BSC1[406008], 0.1, 1),
      acu_1_Status_1_2: mapWordStatus(lc1Data.BSC2[406007], acuRunStatus_MT),
      acu_1_Temp_1_2: scaleProcess(lc1Data.BSC2[406008], 0.1, 1),
      acu_2_Status_1_1: mapWordStatus(lc1Data.BSC1[406009], acuRunStatus_MT),
      acu_2_Temp_1_1: scaleProcess(lc1Data.BSC1[406010], 0.1, 1),
      acu_2_Status_1_2: mapWordStatus(lc1Data.BSC2[406009], acuRunStatus_MT),
      acu_2_Temp_1_2: scaleProcess(lc1Data.BSC2[406010], 0.1, 1),
      acu_3_Status_1_1: mapWordStatus(lc1Data.BSC1[406011], acuRunStatus_MT),
      acu_3_Temp_1_1: scaleProcess(lc1Data.BSC1[406012], 0.1, 1),
      acu_3_Status_1_2: mapWordStatus(lc1Data.BSC2[406011], acuRunStatus_MT),
      acu_3_Temp_1_2: scaleProcess(lc1Data.BSC2[406012], 0.1, 1),
      acu_4_Status_1_1: mapWordStatus(lc1Data.BSC1[406013], acuRunStatus_MT),
      acu_4_Temp_1_1: scaleProcess(lc1Data.BSC1[406014], 0.1, 1),
      acu_4_Status_1_2: mapWordStatus(lc1Data.BSC2[406013], acuRunStatus_MT),
      acu_4_Temp_1_2: scaleProcess(lc1Data.BSC2[406014], 0.1, 1),
      th_1_Temp_1_1: scaleProcess(lc1Data.BSC1[406047], 0.1, 1),
      th_1_Humidity_1_1: scaleProcess(lc1Data.BSC1[406048], 0.1, 1),
      th_1_Temp_1_2: scaleProcess(lc1Data.BSC2[406047], 0.1, 1),
      th_1_Humidity_1_2: scaleProcess(lc1Data.BSC2[406048], 0.1, 1),
      th_2_Temp_1_1: scaleProcess(lc1Data.BSC1[406049], 0.1, 1),
      th_2_Humidity_1_1: scaleProcess(lc1Data.BSC1[406050], 0.1, 1),
      th_2_Temp_1_2: scaleProcess(lc1Data.BSC2[406049], 0.1, 1),
      th_2_Humidity_1_2: scaleProcess(lc1Data.BSC2[406050], 0.1, 1),
      upsMode_1_1: mapWordStatus(lc1Data.BSC1[406063], upsMode_MT),
      upsMode_1_2: mapWordStatus(lc1Data.BSC2[406063], upsMode_MT),
      upsLoad_1_1: scaleProcess(lc1Data.BSC1[406057], 0.1, 1),
      upsLoad_1_2: scaleProcess(lc1Data.BSC2[406057], 0.1, 1),
      upsVout_1_1: scaleProcess(lc1Data.BSC1[406054], 0.1, 1),
      upsVout_1_2: scaleProcess(lc1Data.BSC2[406054], 0.1, 1),
      upsIout_1_1: scaleProcess(lc1Data.BSC1[406056], 0.01, 2),
      upsIout_1_2: scaleProcess(lc1Data.BSC2[406056], 0.01, 2),
      upsTemp_1_1: scaleProcess(lc1Data.BSC1[406059], 0.1, 1),
      upsTemp_1_2: scaleProcess(lc1Data.BSC2[406059], 0.1, 1),
      upsSOC_1_1: scaleProcess(lc1Data.BSC1[406062], 0.1, 1),
      upsSOC_1_2: scaleProcess(lc1Data.BSC2[406062], 0.1, 1),

      acu_1_Status_2_1: mapWordStatus(lc2Data.BSC1[406007], acuRunStatus_MT),
      acu_1_Temp_2_1: scaleProcess(lc2Data.BSC1[406008], 0.1, 1),
      acu_1_Status_2_2: mapWordStatus(lc2Data.BSC2[406007], acuRunStatus_MT),
      acu_1_Temp_2_2: scaleProcess(lc2Data.BSC2[406008], 0.1, 1),
      acu_2_Status_2_1: mapWordStatus(lc2Data.BSC1[406009], acuRunStatus_MT),
      acu_2_Temp_2_1: scaleProcess(lc2Data.BSC1[406010], 0.1, 1),
      acu_2_Status_2_2: mapWordStatus(lc2Data.BSC2[406009], acuRunStatus_MT),
      acu_2_Temp_2_2: scaleProcess(lc2Data.BSC2[406010], 0.1, 1),
      acu_3_Status_2_1: mapWordStatus(lc2Data.BSC1[406011], acuRunStatus_MT),
      acu_3_Temp_2_1: scaleProcess(lc2Data.BSC1[406012], 0.1, 1),
      acu_3_Status_2_2: mapWordStatus(lc2Data.BSC2[406011], acuRunStatus_MT),
      acu_3_Temp_2_2: scaleProcess(lc2Data.BSC2[406012], 0.1, 1),
      acu_4_Status_2_1: mapWordStatus(lc2Data.BSC1[406013], acuRunStatus_MT),
      acu_4_Temp_2_1: scaleProcess(lc2Data.BSC1[406014], 0.1, 1),
      acu_4_Status_2_2: mapWordStatus(lc2Data.BSC2[406013], acuRunStatus_MT),
      acu_4_Temp_2_2: scaleProcess(lc2Data.BSC2[406014], 0.1, 1),
      th_1_Temp_2_1: scaleProcess(lc2Data.BSC1[406047], 0.1, 1),
      th_1_Humidity_2_1: scaleProcess(lc2Data.BSC1[406048], 0.1, 1),
      th_1_Temp_2_2: scaleProcess(lc2Data.BSC2[406047], 0.1, 1),
      th_1_Humidity_2_2: scaleProcess(lc2Data.BSC2[406048], 0.1, 1),
      th_2_Temp_2_1: scaleProcess(lc2Data.BSC1[406049], 0.1, 1),
      th_2_Humidity_2_1: scaleProcess(lc2Data.BSC1[406050], 0.1, 1),
      th_2_Temp_2_2: scaleProcess(lc2Data.BSC2[406049], 0.1, 1),
      th_2_Humidity_2_2: scaleProcess(lc2Data.BSC2[406050], 0.1, 1),
      upsMode_2_1: mapWordStatus(lc2Data.BSC1[406063], upsMode_MT),
      upsMode_2_2: mapWordStatus(lc2Data.BSC2[406063], upsMode_MT),
      upsLoad_2_1: scaleProcess(lc2Data.BSC1[406057], 0.1, 1),
      upsLoad_2_2: scaleProcess(lc2Data.BSC2[406057], 0.1, 1),
      upsVout_2_1: scaleProcess(lc2Data.BSC1[406054], 0.1, 1),
      upsVout_2_2: scaleProcess(lc2Data.BSC2[406054], 0.1, 1),
      upsIout_2_1: scaleProcess(lc2Data.BSC1[406056], 0.01, 2),
      upsIout_2_2: scaleProcess(lc2Data.BSC2[406056], 0.01, 2),
      upsTemp_2_1: scaleProcess(lc2Data.BSC1[406059], 0.1, 1),
      upsTemp_2_2: scaleProcess(lc2Data.BSC2[406059], 0.1, 1),
      upsSOC_2_1: scaleProcess(lc2Data.BSC1[406062], 0.1, 1),
      upsSOC_2_2: scaleProcess(lc2Data.BSC2[406062], 0.1, 1),

      acu_1_Status_3_1: mapWordStatus(lc3Data.BSC1[406007], acuRunStatus_MT),
      acu_1_Temp_3_1: scaleProcess(lc3Data.BSC1[406008], 0.1, 1),
      acu_1_Status_3_2: mapWordStatus(lc3Data.BSC2[406007], acuRunStatus_MT),
      acu_1_Temp_3_2: scaleProcess(lc3Data.BSC2[406008], 0.1, 1),
      acu_2_Status_3_1: mapWordStatus(lc3Data.BSC1[406009], acuRunStatus_MT),
      acu_2_Temp_3_1: scaleProcess(lc3Data.BSC1[406010], 0.1, 1),
      acu_2_Status_3_2: mapWordStatus(lc3Data.BSC2[406009], acuRunStatus_MT),
      acu_2_Temp_3_2: scaleProcess(lc3Data.BSC2[406010], 0.1, 1),
      acu_3_Status_3_1: mapWordStatus(lc3Data.BSC1[406011], acuRunStatus_MT),
      acu_3_Temp_3_1: scaleProcess(lc3Data.BSC1[406012], 0.1, 1),
      acu_3_Status_3_2: mapWordStatus(lc3Data.BSC2[406011], acuRunStatus_MT),
      acu_3_Temp_3_2: scaleProcess(lc3Data.BSC2[406012], 0.1, 1),
      acu_4_Status_3_1: mapWordStatus(lc3Data.BSC1[406013], acuRunStatus_MT),
      acu_4_Temp_3_1: scaleProcess(lc3Data.BSC1[406014], 0.1, 1),
      acu_4_Status_3_2: mapWordStatus(lc3Data.BSC2[406013], acuRunStatus_MT),
      acu_4_Temp_3_2: scaleProcess(lc3Data.BSC2[406014], 0.1, 1),
      th_1_Temp_3_1: scaleProcess(lc3Data.BSC1[406047], 0.1, 1),
      th_1_Humidity_3_1: scaleProcess(lc3Data.BSC1[406048], 0.1, 1),
      th_1_Temp_3_2: scaleProcess(lc3Data.BSC2[406047], 0.1, 1),
      th_1_Humidity_3_2: scaleProcess(lc3Data.BSC2[406048], 0.1, 1),
      th_2_Temp_3_1: scaleProcess(lc3Data.BSC1[406049], 0.1, 1),
      th_2_Humidity_3_1: scaleProcess(lc3Data.BSC1[406050], 0.1, 1),
      th_2_Temp_3_2: scaleProcess(lc3Data.BSC2[406049], 0.1, 1),
      th_2_Humidity_3_2: scaleProcess(lc3Data.BSC2[406050], 0.1, 1),
      upsMode_3_1: mapWordStatus(lc3Data.BSC1[406063], upsMode_MT),
      upsMode_3_2: mapWordStatus(lc3Data.BSC2[406063], upsMode_MT),
      upsLoad_3_1: scaleProcess(lc3Data.BSC1[406057], 0.1, 1),
      upsLoad_3_2: scaleProcess(lc3Data.BSC2[406057], 0.1, 1),
      upsVout_3_1: scaleProcess(lc3Data.BSC1[406054], 0.1, 1),
      upsVout_3_2: scaleProcess(lc3Data.BSC2[406054], 0.1, 1),
      upsIout_3_1: scaleProcess(lc3Data.BSC1[406056], 0.01, 2),
      upsIout_3_2: scaleProcess(lc3Data.BSC2[406056], 0.01, 2),
      upsTemp_3_1: scaleProcess(lc3Data.BSC1[406059], 0.1, 1),
      upsTemp_3_2: scaleProcess(lc3Data.BSC2[406059], 0.1, 1),
      upsSOC_3_1: scaleProcess(lc3Data.BSC1[406062], 0.1, 1),
      upsSOC_3_2: scaleProcess(lc3Data.BSC2[406062], 0.1, 1),

      acu_1_Status_4_1: mapWordStatus(lc4Data.BSC1[406007], acuRunStatus_MT),
      acu_1_Temp_4_1: scaleProcess(lc4Data.BSC1[406008], 0.1, 1),
      acu_2_Status_4_1: mapWordStatus(lc4Data.BSC1[406009], acuRunStatus_MT),
      acu_2_Temp_4_1: scaleProcess(lc4Data.BSC1[406010], 0.1, 1),
      acu_3_Status_4_1: mapWordStatus(lc4Data.BSC1[406011], acuRunStatus_MT),
      acu_3_Temp_4_1: scaleProcess(lc4Data.BSC1[406012], 0.1, 1),
      acu_4_Status_4_1: mapWordStatus(lc4Data.BSC1[406013], acuRunStatus_MT),
      acu_4_Temp_4_1: scaleProcess(lc4Data.BSC1[406014], 0.1, 1),
      th_1_Temp_4_1: scaleProcess(lc4Data.BSC1[406047], 0.1, 1),
      th_1_Humidity_4_1: scaleProcess(lc4Data.BSC1[406048], 0.1, 1),
      th_2_Temp_4_1: scaleProcess(lc4Data.BSC1[406049], 0.1, 1),
      th_2_Humidity_4_1: scaleProcess(lc4Data.BSC1[406050], 0.1, 1),
      upsMode_4_1: mapWordStatus(lc4Data.BSC1[406063], upsMode_MT),
      upsLoad_4_1: scaleProcess(lc4Data.BSC1[406057], 0.1, 1),
      upsVout_4_1: scaleProcess(lc4Data.BSC1[406054], 0.1, 1),
      upsIout_4_1: scaleProcess(lc4Data.BSC1[406056], 0.01, 2),
      upsTemp_4_1: scaleProcess(lc4Data.BSC1[406059], 0.1, 1),
      upsSOC_4_1: scaleProcess(lc4Data.BSC1[406062], 0.1, 1),

      upsStatus1_1_1_rawD: lc1Data.BSC1[406060],
      upsStatus1_1_2_rawD: lc1Data.BSC2[406060],
      DL_of_upsStatus2_1_1: Determine_DL_of_upsStatus2(lc1Data.BSC1[406061]),
      DL_of_upsStatus2_1_2: Determine_DL_of_upsStatus2(lc1Data.BSC2[406061]),
      bscAlarm_1_1_rawD: lc1Data.BSC1[406003],
      bscAlarm_1_2_rawD: lc1Data.BSC2[406003],
      bscFault_1_1_rawD: lc1Data.BSC1[406001],
      bscFault_1_2_rawD: lc1Data.BSC2[406001],
      ffsStatus_1_1_rawD: lc1Data.BSC1[406005],
      ffsStatus_1_2_rawD: lc1Data.BSC2[406005],

      upsStatus1_2_1_rawD: lc2Data.BSC1[406060],
      upsStatus1_2_2_rawD: lc2Data.BSC2[406060],
      DL_of_upsStatus2_2_1: Determine_DL_of_upsStatus2(lc2Data.BSC1[406061]),
      DL_of_upsStatus2_2_2: Determine_DL_of_upsStatus2(lc2Data.BSC2[406061]),
      bscAlarm_2_1_rawD: lc2Data.BSC1[406003],
      bscAlarm_2_2_rawD: lc2Data.BSC2[406003],
      bscFault_2_1_rawD: lc2Data.BSC1[406001],
      bscFault_2_2_rawD: lc2Data.BSC2[406001],
      ffsStatus_2_1_rawD: lc2Data.BSC1[406005],
      ffsStatus_2_2_rawD: lc2Data.BSC2[406005],

      upsStatus1_3_1_rawD: lc3Data.BSC1[406060],
      upsStatus1_3_2_rawD: lc3Data.BSC2[406060],
      DL_of_upsStatus2_3_1: Determine_DL_of_upsStatus2(lc3Data.BSC1[406061]),
      DL_of_upsStatus2_3_2: Determine_DL_of_upsStatus2(lc3Data.BSC2[406061]),
      bscAlarm_3_1_rawD: lc3Data.BSC1[406003],
      bscAlarm_3_2_rawD: lc3Data.BSC2[406003],
      bscFault_3_1_rawD: lc3Data.BSC1[406001],
      bscFault_3_2_rawD: lc3Data.BSC2[406001],
      ffsStatus_3_1_rawD: lc3Data.BSC1[406005],
      ffsStatus_3_2_rawD: lc3Data.BSC2[406005],

      upsStatus1_4_1_rawD: lc4Data.BSC1[406060],
      DL_of_upsStatus2_4_1: Determine_DL_of_upsStatus2(lc4Data.BSC1[406061]),
      bscAlarm_4_1_rawD: lc4Data.BSC1[406003],
      bscFault_4_1_rawD: lc4Data.BSC1[406001],
      ffsStatus_4_1_rawD: lc4Data.BSC1[406005],

    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
