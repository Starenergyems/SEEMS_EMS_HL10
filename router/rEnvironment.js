const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const router = express.Router();
const app = express();
const cors = require("cors");

const {
  scaleProcess,
  mapWordStatus,
  Determine_DL_of_upsStatus2,
} = require("./function");

const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const couchDBUrl = "http://admin:ems45877096@192.168.8.101:5984";
const nanoDb = nano(couchDBUrl);

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

router.get("/systeminfo/environment", async (req, res) => {
  try {
    // 使用 map 遍歷所有資料庫名稱，創建 Nano 實例，並獲取最新文檔的 promise 陣列
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

//******************************************************************** */
//環境控制下方彈出視窗
router.post("/getDataforenv", async (req, res) => {
  try {
    console.log("接收到環境監控的前端請求");
    const blockId = req.body.blockId;
    console.log("blockId:" + blockId); //回傳1-7 代表1-1~4-4

    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
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

//******************************************************************** */
//空調起停 SET按鈕把數值帶入
router.post("/getDataForacuOnOff", async (req, res) => {
  try {
    //console.log("接收到前端請求");
    const blockId = req.body.blockId; //可以得到是哪台lc
    const selectedValue = req.body.selectedValue; //選取方塊的區塊的數字

    console.log("getDataFor acuOnOff blockId:" + blockId);

    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
    });

    const allData = await Promise.all(dataPromises);
    const num = blockId - 1; //存放位置從零開始所以要減一
    const lcData = allData[num];

    const data = lcData.Ctrl["407018"]; //回傳目前數

    //console.log("Ruturn: " + lcData.Ctrl["407008"]);
    //回傳要帶點
    res.json(data);
    if (!lcData) {
      throw new Error("No data found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//空調起停 按下去的SET按鈕
router.post("/envbackendEndpoint", async (req, res) => {
  try {
    console.log("rEnvironment 接收到前端請求");
    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
    });

    const allData = await Promise.all(dataPromises); //取得所有資料庫目前最新的一筆的數值 存在陣列裡面 由零開始
    const lc1Data = allData[0];
    const lc2Data = allData[1];
    const lc3Data = allData[2];
    const lc4Data = allData[3];
    const dwctrlData = allData[4];
    const selectedValue = req.body.selectedValue; //選取方塊的區塊的數字
    console.log("後端得到的selectedValue:" + selectedValue);
    const lcnum = req.body.lcnum; //LC4_BMS併網狀態
    console.log("後端得到的lcnum:", lcnum);
    // 使用正規表達式提取數字部分
    const matchResult = lcnum.match(/\d+/);
    // 如果有匹配到數字，取得lc數值
    const extractedNumber = matchResult ? parseInt(matchResult[0], 10) : null;
    console.log("extractedNumber:" + extractedNumber); //提取出來的lc數值
    // 修改 407008 這個點的數值
    const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));
    //將最新的數值存到新的位置

    if (extractedNumber == 1) {
      newdwctrlData.lc1.W407018 = selectedValue;
      console.log("newdwctrlData.lc1.W407008:" + newdwctrlData.lc1.W407018);
    } else if (extractedNumber == 2) {
      newdwctrlData.lc2.W407018 = selectedValue;
      console.log("newdwctrlData.lc2.W407008:" + newdwctrlData.lc2.W407018);
    } else if (extractedNumber == 3) {
      newdwctrlData.lc3.W407018 = selectedValue;
      console.log("newdwctrlData.lc3.W407008:" + newdwctrlData.lc3.W407018);
    } else if (extractedNumber == 4) {
      newdwctrlData.lc4.W407018 = selectedValue;
      console.log("newdwctrlData.lc4.W407008:" + newdwctrlData.lc4.W407018);
    }
    const currentDate = new Date();
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localTime = new Date(currentDate - timezoneOffset);
    const isoString = localTime.toISOString().replace("Z", "+08:00");

    // 刪除_id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
    newdwctrlData.time = isoString;
    delete newdwctrlData._id;
    delete newdwctrlData._rev;
    await nanoDb.use("dwctrl").insert(newdwctrlData);
    // console.log(
    //   "newdwctrlData 1讀取到的資料是:" + JSON.stringify(newdwctrlData, null, 2)
    // );

    //log紀錄
    let content;

    if (selectedValue == 1) {
      content = "啟動";
    } else if (selectedValue == 2) {
      content = "停止";
    }

    const logDb = createNanoInstance("log");
    //const accountDb = createNanoInstance("account");

    const doc = {
      tag: `LC${extractedNumber}_rf10.Ctrl.407018`,
      time: isoString,
      category: "設備控制",
      device: `LC${extractedNumber}`,
      username: "SE0008",
      content: `將LC${extractedNumber}空調啟停設為${content}`,
    };

    console.log("log內容是:" + doc);

    if (selectedValue != 0) {
      const result = await logDb.insert(doc);
      console.log(result);
    }

    //console.log("Document added to database. ID: " + result.id);
    const data = { ststus: ok };
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//******************************************************************** */
//空調制熱溫度 SET按鈕把數值帶入
router.post("/getDataForacuHeat", async (req, res) => {
  try {
    //console.log("接收到前端請求");
    const blockId = req.body.blockId; //可以得到是哪台lc
    const selectedValue = req.body.selectedValue; //選取方塊的區塊的數字

    console.log("getDataFor acuOnOff blockId:" + blockId);

    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
    });

    const allData = await Promise.all(dataPromises);
    const num = blockId - 1; //存放位置從零開始所以要減一
    const lcData = allData[num];

    const data = lcData.Ctrl["407018"]; //回傳目前數

    //console.log("Ruturn: " + lcData.Ctrl["407008"]);
    //回傳要帶點
    res.json(data);
    if (!lcData) {
      throw new Error("No data found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//空調起停 SET按鈕按下去的彈出視窗將數值設定

router.post("/acuHeatbackendEndpoint", async (req, res) => {
  try {
    console.log("rEnvironment 接收到前端請求");
    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
    });

    const allData = await Promise.all(dataPromises); //取得所有資料庫目前最新的一筆的數值 存在陣列裡面 由零開始
    const lc1Data = allData[0];
    const lc2Data = allData[1];
    const lc3Data = allData[2];
    const lc4Data = allData[3];
    const dwctrlData = allData[4];
    const selectedValue = req.body.selectedValue; //選取方塊的區塊的數字
    console.log("後端得到的selectedValue:" + selectedValue);
    const lcnum = req.body.lcnum; //LC4_BMS併網狀態
    console.log("後端得到的lcnum:", lcnum);
    // 使用正規表達式提取數字部分
    const matchResult = lcnum.match(/\d+/);
    // 如果有匹配到數字，取得lc數值
    const extractedNumber = matchResult ? parseInt(matchResult[0], 10) : null;
    console.log("extractedNumber:" + extractedNumber); //提取出來的lc數值
    // 修改 407008 這個點的數值
    const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));
    //將最新的數值存到新的位置

    if (extractedNumber == 1) {
      newdwctrlData.lc1.W407018 = selectedValue;
      console.log("newdwctrlData.lc1.W407008:" + newdwctrlData.lc1.W407018);
    } else if (extractedNumber == 2) {
      newdwctrlData.lc2.W407018 = selectedValue;
      console.log("newdwctrlData.lc2.W407008:" + newdwctrlData.lc2.W407018);
    } else if (extractedNumber == 3) {
      newdwctrlData.lc3.W407018 = selectedValue;
      console.log("newdwctrlData.lc3.W407008:" + newdwctrlData.lc3.W407018);
    } else if (extractedNumber == 4) {
      newdwctrlData.lc4.W407018 = selectedValue;
      console.log("newdwctrlData.lc4.W407008:" + newdwctrlData.lc4.W407018);
    }
    const currentDate = new Date();
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localTime = new Date(currentDate - timezoneOffset);
    const isoString = localTime.toISOString().replace("Z", "+08:00");

    // 刪除_id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
    newdwctrlData.time = isoString;
    delete newdwctrlData._id;
    delete newdwctrlData._rev;
    await nanoDb.use("dwctrl").insert(newdwctrlData);
    // console.log(
    //   "newdwctrlData 1讀取到的資料是:" + JSON.stringify(newdwctrlData, null, 2)
    // );

    //log紀錄
    let content;

    if (selectedValue == 1) {
      content = "啟動";
    } else if (selectedValue == 2) {
      content = "停止";
    }

    const logDb = createNanoInstance("log");
    //const accountDb = createNanoInstance("account");

    const doc = {
      tag: `LC${extractedNumber}_rf10.Ctrl.407018`,
      time: isoString,
      category: "設備控制",
      device: `LC${extractedNumber}`,
      username: "SE0008",
      content: `將LC${extractedNumber}空調啟停設為${content}`,
    };

    console.log("log內容是:" + doc);

    if (selectedValue != 0) {
      const result = await logDb.insert(doc);
      console.log(result);
    }

    //console.log("Document added to database. ID: " + result.id);
    const data = { ststus: ok };
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
