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

//SET按鈕 控制下行
// router.post("/backendEndpoint", async (req, res) => {
//   try {
//     //const nanoDb = nano.use("dwctrl");
//     const dataPromises = databases.map(async (dbName) => {
//       const nanoDb = createNanoInstance(dbName);
//       return getLatestDocument(nanoDb);
//     });

//     // 使用 Promise.all 等待所有 promise 完成，獲取"所有資料庫"中的最新數據
//     //並利用陣列不同列數儲存不同資料庫
//     // 在這裡處理 allData，它是一個包含所有資料庫最新數據的陣列

//     const allData = await Promise.all(dataPromises); //取得所有資料庫目前最新的一筆的數值 存在陣列裡面 由零開始
//     const dwctrlData = allData[4];

//     console.log("接收到前端請求");
//     const selectedValue = req.body.selectedValue; //選取方塊的區塊的數字
//     const lcnum = req.body.lcnum; //LC4_BMS併網狀態
//     //console.log("selectedValue:" + selectedValue);
//     //console.log("lcnum:" + lcnum);
//     // 使用正規表達式提取數字部分
//     const matchResult = lcnum.match(/\d+/);
//     // 如果有匹配到數字，取得lc數值
//     const extractedNumber = matchResult ? parseInt(matchResult[0], 10) : null;
//     //console.log("extractedNumber:" + extractedNumber); //提取出來的lc數值
//     // 修改 407008 這個點的數值
//     const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));
//     //將最新的數值存到新的位置

//     if (extractedNumber == 1) {
//       newdwctrlData.lc1.W407008 = selectedValue;
//       console.log("newdwctrlData.lc1.W407008:" + newdwctrlData.lc1.W407008);
//     } else if (extractedNumber == 2) {
//       newdwctrlData.lc2.W407008 = selectedValue;
//       console.log("newdwctrlData.lc2.W407008:" + newdwctrlData.lc2.W407008);
//     } else if (extractedNumber == 3) {
//       newdwctrlData.lc3.W407008 = selectedValue;
//       console.log("newdwctrlData.lc3.W407008:" + newdwctrlData.lc3.W407008);
//     } else if (extractedNumber == 4) {
//       newdwctrlData.lc4.W407008 = selectedValue;
//       console.log("newdwctrlData.lc4.W407008:" + newdwctrlData.lc4.W407008);
//     }

//     // 刪除 _id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
//     newdwctrlData.time = new Date().toISOString();
//     delete newdwctrlData._id;
//     delete newdwctrlData._rev;
//     await nanoDb.use("dwctrl").insert(newdwctrlData);
//     // console.log(
//     //   "newdwctrlData 1讀取到的資料是:" + JSON.stringify(newdwctrlData, null, 2)
//     // );

//     //log紀錄
//     let content;

//     if (selectedValue == 1) {
//       content = "切離";
//     } else if (selectedValue == 2) {
//       content = "投入";
//     } else if (selectedValue == 3) {
//       content = "故障復位";
//     } else {
//       content = "未知動作";
//     }

//     const logDb = createNanoInstance("log");
//     //const accountDb = createNanoInstance("account");
//     const currentTime = new Date().toISOString();
//     const doc = {
//       tag: `LC${extractedNumber}_rf10.Ctrl.407008`,
//       time: currentTime,
//       category: "設備控制",
//       device: `LC${extractedNumber}`,
//       username: "SE0008",
//       content: `將LC${extractedNumber}BMS併網狀態設為${content}`,
//     };

//     const result = await logDb.insert(doc);
//     console.log("Document added to database. ID: " + result.id);
//     const data = { ststus: ok };
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

// app.use(bodyParser.json());

// //各rack單獨彈出視窗
// router.post("/getData", async (req, res) => {
//   try {
//     console.log("接收到前端請求");
//     const blockId = req.body.blockId;
//     console.log("blockId:" + blockId);

//     console.log("globalPageNumber:" + globalPageNumber);

//     const dataPromises = databases.map(async (dbName) => {
//       const nanoDb = createNanoInstance(dbName);
//       return getLatestDocument(nanoDb);
//     });

//     const allData = await Promise.all(dataPromises);
//     const baseNumber = Math.ceil(globalPageNumber / 2);
//     const isEvenPage = globalPageNumber % 2 === 0;
//     const num = baseNumber - 1;
//     const lcData = allData[num];
//     console.log("num: " + num);
//     const Lc_RackGroup = isEvenPage ? lcData.RackSub2 : lcData.RackSub1;
//     console.log("判斷isEvenPage??" + isEvenPage);
//     console.log("Lc_RackGroup: " + Lc_RackGroup);

//     const collectionMap = {
//       1: "Rack01",
//       2: "Rack02",
//       3: "Rack03",
//       4: "Rack04",
//       5: "Rack05",
//       6: "Rack06",
//       7: "Rack07",
//       8: "Rack08",
//       9: "Rack09",
//       10: "Rack10",
//       11: "Rack11",
//       12: "Rack12",
//     };

//     let selectedCollection = collectionMap[blockId];
//     const alarmCMU_rawD = Lc_RackGroup[selectedCollection][405028];
//     const faultCMU_rawD = Lc_RackGroup[selectedCollection][405030];
//     const DL_of_statusHW = Lc_RackGroup[selectedCollection][405032];

//     console.log("alarmCMU_rawD: " + alarmCMU_rawD);
//     console.log("faultCMU_rawD: " + faultCMU_rawD);
//     console.log("DL_of_statusHW: " + DL_of_statusHW);
//     console.log("selectedCollection: " + selectedCollection);

//     const data = {
//       alarmCMU_rawD: alarmCMU_rawD.toString(2),
//       faultCMU_rawD: faultCMU_rawD.toString(2),
//       DL_of_statusHW: DL_of_statusHW.toString(2),
//     };

//     res.json(data);

//     if (!lcData) {
//       throw new Error("No data found");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("伺服器錯誤");
//   }
// });

module.exports = router;
