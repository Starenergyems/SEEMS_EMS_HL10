const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const port = 3005;
const router = express.Router();
const app = express();
const cors = require("cors");

//const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
//const nano = nano(couchDBUrl);

const {
  scaleProcess,
  mapWordStatus,
  Determine_DL_of_upsStatus2,
  mapUPSwarning,
} = require("./function");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

const acuOnOff_MT = { 0: "停機", 1: "啟動" };
const acuRunStatus_MT = {
  0: "通訊異常",
  1: "停機",
  2: "運轉中",
  3: "故障",
  85: "未配置",
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
  84: "Battery test",
  89: "Bypass mode",
};

// 定義 CouchDB 資料庫名稱
const databases = [
  "lc1_rf10", //0
  "lc2_rf10", //1
  "lc3_rf10", //2
  "lc4_rf10", //3
  "dwctrl", //4
  "log", //5
  "other_rf01", //6
  "other_rf10", //7
];

// 創建 Nano 實例的函式
// const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);
const createNanoInstance = (dbName) => nano.db.use(dbName);
// 設定index
const getLatestDocument = async (nano) => {
  const indexDef = {
    index: { fields: ["time"] },
    name: "time_index",
  };

  //建立index
  await nano.createIndex(indexDef);

  //利用mango作為篩選器
  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
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
/************************************************************************************ */
var Env_variables;
async function queryEnv_variables() {
  // 使用 map 遍歷所有資料庫名稱，創建 Nano 實例，並獲取最新文檔的 promise 陣列
  const dataPromises = databases.map(async (dbName) => {
    const nano = createNanoInstance(dbName);
    return getLatestDocument(nano);
  });

  const allData = await Promise.all(dataPromises); //取得所有資料庫的數值 存在陣列裡面 由零開始
  const lc1Data = allData[0];
  const lc2Data = allData[1];
  const lc3Data = allData[2];
  const lc4Data = allData[3];
  const dwctrlData = allData[4];
  const logData = allData[5];
  const other01Data = allData[6];
  const other10Data = allData[7];

  Env_variables = {
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

    acu_1_Status_2_1: mapWordStatus(lc2Data.BSC1[406007], acuRunStatus_MT),
    acu_1_Temp_2_1: scaleProcess(lc2Data.BSC1[406008], 0.1, 1),
    acu_1_Status_2_2: mapWordStatus(lc2Data.BSC2[406007], acuRunStatus_MT),
    acu_1_Temp_2_2: scaleProcess(lc2Data.BSC2[406008], 0.1, 1),
    acu_2_Status_2_1: mapWordStatus(lc2Data.BSC1[406009], acuRunStatus_MT),
    acu_2_Temp_2_1: scaleProcess(lc2Data.BSC1[406010], 0.1, 1),
    acu_2_Status_2_2: mapWordStatus(lc2Data.BSC2[406009], acuRunStatus_MT),
    acu_2_Temp_2_2: scaleProcess(lc2Data.BSC2[406010], 0.1, 1),

    acu_1_Status_3_1: mapWordStatus(lc3Data.BSC1[406007], acuRunStatus_MT),
    acu_1_Temp_3_1: scaleProcess(lc3Data.BSC1[406008], 0.1, 1),
    acu_1_Status_3_2: mapWordStatus(lc3Data.BSC2[406007], acuRunStatus_MT),
    acu_1_Temp_3_2: scaleProcess(lc3Data.BSC2[406008], 0.1, 1),
    acu_2_Status_3_1: mapWordStatus(lc3Data.BSC1[406009], acuRunStatus_MT),
    acu_2_Temp_3_1: scaleProcess(lc3Data.BSC1[406010], 0.1, 1),
    acu_2_Status_3_2: mapWordStatus(lc3Data.BSC2[406009], acuRunStatus_MT),
    acu_2_Temp_3_2: scaleProcess(lc3Data.BSC2[406010], 0.1, 1),

    acu_1_Status_4_1: mapWordStatus(lc4Data.BSC1[406007], acuRunStatus_MT),
    acu_1_Temp_4_1: scaleProcess(lc4Data.BSC1[406008], 0.1, 1),
    acu_2_Status_4_1: mapWordStatus(lc4Data.BSC1[406009], acuRunStatus_MT),
    acu_2_Temp_4_1: scaleProcess(lc4Data.BSC1[406010], 0.1, 1),

    /***************************************** */
    ctrl_hvac_1_open: scaleProcess(other10Data.HVAC1[408101], 1, 1),
    ctrl_hvac_1_mode: scaleProcess(other10Data.HVAC1[408102], 1, 1),
    ctrl_hvac_1_fanSpd: scaleProcess(other10Data.HVAC1[408103], 1, 1),
    ctrl_hvac_1_tempSet: scaleProcess(other10Data.HVAC1[408104], 1, 1),
    ctrl_hvac_1_temp: scaleProcess(other10Data.HVAC1[408105], 1, 1),
    ctrl_hvac_1_humid: scaleProcess(other10Data.HVAC1[408106], 1, 1),
    ctrl_hvac_1_error: scaleProcess(other10Data.HVAC1[408107], 1, 1),

    ctrl_hvac_2_open: scaleProcess(other10Data.HVAC2[408101], 1, 1),
    ctrl_hvac_2_mode: scaleProcess(other10Data.HVAC2[408102], 1, 1),
    ctrl_hvac_2_fanSpd: scaleProcess(other10Data.HVAC2[408103], 1, 1),
    ctrl_hvac_2_tempSet: scaleProcess(other10Data.HVAC2[408104], 1, 1),
    ctrl_hvac_2_temp: scaleProcess(other10Data.HVAC2[408105], 1, 1),
    ctrl_hvac_2_humid: scaleProcess(other10Data.HVAC2[408106], 1, 1),
    ctrl_hvac_2_error: scaleProcess(other10Data.HVAC2[408107], 1, 1),

    ups_MVCB_volt: scaleProcess(other10Data.UPS3[408151], 0.1, 1),
    ups_MVCB_temp: scaleProcess(other10Data.UPS3[408152], 0.1, 1),
    ups_MVCB_status: scaleProcess(other10Data.UPS3[408153], 1, 1),
    ups_MVCB_power: scaleProcess(other10Data.UPS3[408154], 1, 1),

    ups_ACP_volt: scaleProcess(other10Data.UPS4[408151], 0.1, 1),
    ups_ACP_temp: scaleProcess(other10Data.UPS4[408152], 0.1, 1),
    ups_ACP_status: scaleProcess(other10Data.UPS4[408153], 1, 1),
    ups_ACP_power: scaleProcess(other10Data.UPS4[408154], 1, 1),

    ups_EMS_SOC: scaleProcess(other10Data.UPS1[408163], 1, 1),
    ups_EMS_timeLeft: scaleProcess(other10Data.UPS1[408164], 1, 1),
    ups_EMS_mode: scaleProcess(other10Data.UPS1[408165], 1, 1),
    ups_EMS_error: scaleProcess(other10Data.UPS1[408166], 1, 1),

    ups_EMS_408161_bit9: mapUPSwarning(other10Data.UPS1[408161], 9),
    ups_EMS_408161_bit11: mapUPSwarning(other10Data.UPS1[408161], 11),
    ups_EMS_408161_bit12: mapUPSwarning(other10Data.UPS1[408161], 12),
    ups_EMS_408162_bit6: mapUPSwarning(other10Data.UPS1[408162], 6),
    ups_EMS_408162_bit8: mapUPSwarning(other10Data.UPS1[408162], 8),
    ups_EMS_408162_bit10: mapUPSwarning(other10Data.UPS1[408162], 10),
    ups_EMS_408162_bit11: mapUPSwarning(other10Data.UPS1[408162], 11),
    ups_EMS_408162_bit12: mapUPSwarning(other10Data.UPS1[408162], 12),
    ups_EMS_408162_bit13: mapUPSwarning(other10Data.UPS1[408162], 13),
    ups_EMS_408162_bit14: mapUPSwarning(other10Data.UPS1[408162], 14),
    ups_EMS_408162_bit15: mapUPSwarning(other10Data.UPS1[408162], 15),

    ups_CMS_SOC: scaleProcess(other10Data.UPS2[408163], 1, 1),
    ups_CMS_timeLeft: scaleProcess(other10Data.UPS2[408164], 1, 1),
    ups_CMS_mode: scaleProcess(other10Data.UPS2[408165], 1, 1),
    ups_CMS_error: scaleProcess(other10Data.UPS2[408166], 1, 1),

    ups_CMS_408161_bit9: mapUPSwarning(other10Data.UPS2[408161], 9),
    ups_CMS_408161_bit11: mapUPSwarning(other10Data.UPS2[408161], 11),
    ups_CMS_408161_bit12: mapUPSwarning(other10Data.UPS2[408161], 12),
    ups_CMS_408162_bit6: mapUPSwarning(other10Data.UPS2[408162], 6),
    ups_CMS_408162_bit8: mapUPSwarning(other10Data.UPS2[408162], 8),
    ups_CMS_408162_bit10: mapUPSwarning(other10Data.UPS2[408162], 10),
    ups_CMS_408162_bit11: mapUPSwarning(other10Data.UPS2[408162], 11),
    ups_CMS_408162_bit12: mapUPSwarning(other10Data.UPS2[408162], 12),
    ups_CMS_408162_bit13: mapUPSwarning(other10Data.UPS2[408162], 13),
    ups_CMS_408162_bit14: mapUPSwarning(other10Data.UPS2[408162], 14),
    ups_CMS_408162_bit15: mapUPSwarning(other10Data.UPS2[408162], 15),
    //還要轉換
    bscAlarm_1_1_rawD: lc1Data.BSC1[406003],
    bscAlarm_1_2_rawD: lc1Data.BSC2[406003],
    bscFault_1_1_rawD: lc1Data.BSC1[406001],
    bscFault_1_2_rawD: lc1Data.BSC2[406001],
    ffsStatus_1_1_rawD: lc1Data.BSC1[406005],
    ffsStatus_1_2_rawD: lc1Data.BSC2[406005],

    bscAlarm_2_1_rawD: lc2Data.BSC1[406003],
    bscAlarm_2_2_rawD: lc2Data.BSC2[406003],
    bscFault_2_1_rawD: lc2Data.BSC1[406001],
    bscFault_2_2_rawD: lc2Data.BSC2[406001],
    ffsStatus_2_1_rawD: lc2Data.BSC1[406005],
    ffsStatus_2_2_rawD: lc2Data.BSC2[406005],

    bscAlarm_3_1_rawD: lc3Data.BSC1[406003],
    bscAlarm_3_2_rawD: lc3Data.BSC2[406003],
    bscFault_3_1_rawD: lc3Data.BSC1[406001],
    bscFault_3_2_rawD: lc3Data.BSC2[406001],
    ffsStatus_3_1_rawD: lc3Data.BSC1[406005],
    ffsStatus_3_2_rawD: lc3Data.BSC2[406005],

    bscAlarm_4_1_rawD: lc4Data.BSC1[406003],
    bscFault_4_1_rawD: lc4Data.BSC1[406001],
    ffsStatus_4_1_rawD: lc4Data.BSC1[406005],
  };
}

router.get("/systeminfo/environment", async (req, res) => {
  try {
    await queryEnv_variables();
    res.render("Sys_Environment", Env_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/systeminfo/environment/:data", async (req, res) => {
  try {
    await queryEnv_variables();
    res.json(Env_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//******************************************************************** */
//環境控制下方彈出視窗
router.post("/getDataforenv", async (req, res) => {
  try {
    console.log("接收到環境監控的前端請求");
    const blockId = req.body.blockId;
    console.log("blockId:" + blockId); //回傳1-7 代表1-1~4-4

    const dataPromises = databases.map(async (dbName) => {
      const nano = createNanoInstance(dbName);
      return getLatestDocument(nano);
    });
    const BSCName = blockId % 2 === 1 ? "BSC1" : "BSC2";
    const allData = await Promise.all(dataPromises); //獲得所有LC01-4的數值
    const lcnum = Math.ceil(blockId / 2);
    const lcData = allData[lcnum - 1];
    console.log("lcnum:" + lcnum);
    console.log("BSCName:" + BSCName);

    const upsMode = lcData[BSCName]["406063"];
    const upsLoad = lcData[BSCName]["406057"];
    const upsVout = lcData[BSCName]["406054"];
    const upsIout = lcData[BSCName]["406056"];
    const upsTemp = lcData[BSCName]["406059"];
    const upsSOC = lcData[BSCName]["406062"];
    const upsStatus1 = lcData[BSCName]["406060"];
    const upsStatus2 = lcData[BSCName]["406061"];
    const bscAlarm = lcData[BSCName]["406003"];
    const bscFault = lcData[BSCName]["406001"];
    const ffsStatus = lcData[BSCName]["406005"];

    // console.log(
    //   "upsMode:" + upsMode,
    //   "upsLoad:" + upsLoad,
    //   "upsVout:" + upsVout,
    //   "upsIout:" + upsIout,
    //   "upsIout:" + upsIout,
    //   "upsSOC:" + upsSOC,
    //   "upsStatus1:" + upsStatus1,
    //   "upsStatus2:" + upsStatus2,
    //   "bscAlarm:" + bscAlarm,
    //   "bscFault:" + bscFault,
    //   "ffsStatus:" + ffsStatus
    // );

    //回傳數值到前端(JSON格式)
    const data = {
      upsMode,
      upsLoad,
      upsVout,
      upsIout,
      upsTemp,
      upsSOC,
      upsStatus1,
      upsStatus2,
      bscAlarm,
      bscFault,
      ffsStatus,
    };
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("伺服器錯誤");
  }
});

module.exports = router;
// app.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });
