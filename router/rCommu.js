// const port = 3006;
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

//const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
//const nano = nano(couchDBUrl);

const router = express.Router();
const app = express();
const cors = require("cors");
const {
  Convert_UInt_to_revBitString,
  Determine_DL_of_CommDevice,
  Determine_DL_of_CommPCSBMS,
} = require("./function");

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

//***************************************************************************************************************** */
// 定義 CouchDB 資料庫名稱
const databases = ["lc1_rf10", "lc2_rf10", "lc3_rf10", "lc4_rf10", "dc_rf10"];

// 創建 Nano 實例的函式
//const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);
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

//***************************************************************************************************************** */

router.get("/systeminfo", (req, res) => {
  res.redirect("/systeminfo/comm");
});

//***************************************************************************************************************** */

let Comm_KeyValuePairs;

async function query_Comm_KeyValuePairs(req) {
  // 使用 map 遍歷所有資料庫名稱，創建 Nano 實例，並獲取最新文檔的 promise 陣列
  const dataPromises = databases.map(async (dbName) => {
    const nano = createNanoInstance(dbName);
    return getLatestDocument(nano);
  });

  // 使用 Promise.all 等待所有 promise 完成，獲取"所有資料庫"中的最新數據
  const allData = await Promise.all(dataPromises); //取得所有資料庫的數值 存在陣列裡面 由零開始
  const lc1Data = allData[0];
  const lc2Data = allData[1];
  const lc3Data = allData[2];
  const lc4Data = allData[3];
  const dcData = allData[4];

  let PCScomm_LC1 = Convert_UInt_to_revBitString(lc1Data.System[402048], 32);
  let BMScomm_LC1 = Convert_UInt_to_revBitString(lc1Data.System[402050], 32);
  let PCScomm_LC2 = Convert_UInt_to_revBitString(lc2Data.System[402048], 32);
  let BMScomm_LC2 = Convert_UInt_to_revBitString(lc2Data.System[402050], 32);
  let PCScomm_LC3 = Convert_UInt_to_revBitString(lc3Data.System[402048], 32);
  let BMScomm_LC3 = Convert_UInt_to_revBitString(lc3Data.System[402050], 32);
  let PCScomm_LC4 = Convert_UInt_to_revBitString(lc4Data.System[402048], 32);
  let BMScomm_LC4 = Convert_UInt_to_revBitString(lc4Data.System[402050], 32);


  Comm_KeyValuePairs = {
    permission: req.body.permission,
    Comm_EMS_1: "setToClose",
    Comm_EMS_2: "setToClose",
    Comm_DC: "setToClose",        //dc的存活要利用心跳去判斷
    Comm_HMI: "setToClose",
    Comm_GC_1: Determine_DL_of_CommDevice(dcData.GC1[409127]),
    Comm_GC_2: Determine_DL_of_CommDevice(dcData.GC2[409127]),
    Comm_HVAC_1: Determine_DL_of_CommDevice(dcData.HVAC1[409129]),
    Comm_HVAC_2: Determine_DL_of_CommDevice(dcData.HVAC2[409129]),
    Comm_UPS_EMS: Determine_DL_of_CommDevice(dcData.UPS1[409111]),
    Comm_UPS_CCTV: Determine_DL_of_CommDevice(dcData.UPS2[409111]),
    Comm_RIO_CtrlRoom: Determine_DL_of_CommDevice(dcData.RIO_CtrlRoom[409121]),
    Comm_FreqMeter: Determine_DL_of_CommDevice(dcData.Freq[409103]),
    Comm_AuxM_MVCB: Determine_DL_of_CommDevice(dcData.AuxM2[409109]),               // 看能否換個順序
    Comm_Relay_MVCB: Determine_DL_of_CommDevice(dcData.RelayMVCB[409117]),
    Comm_UPS_MVCB: Determine_DL_of_CommDevice(dcData.UPS3[409111]),
    Comm_Recloser: Determine_DL_of_CommDevice(dcData.Recloser[409131]),
    Comm_RIO_MVCB_1: Determine_DL_of_CommDevice(dcData.RIO_MVCB_1[409123]),
    Comm_RIO_MVCB_2: Determine_DL_of_CommDevice(dcData.RIO_MVCB_2[409123]),
    Comm_TH_MVCB: Determine_DL_of_CommDevice(dcData.TH1[409115]),
    Comm_Relay_VCB1: Determine_DL_of_CommDevice(dcData.RelayVCB1[409119]),
    Comm_Relay_VCB2: Determine_DL_of_CommDevice(dcData.RelayVCB2[409119]),
    Comm_Relay_VCB3: Determine_DL_of_CommDevice(dcData.RelayVCB3[409119]),
    Comm_Relay_VCB4: Determine_DL_of_CommDevice(dcData.RelayVCB4[409119]),
    Comm_Relay_VCB_Aux: Determine_DL_of_CommDevice(dcData.RelayVCB5[409119]),
    Comm_TR_Aux: Determine_DL_of_CommDevice(dcData.TR5[409113]),
    Comm_AuxM_total: Determine_DL_of_CommDevice(dcData.AuxMtot1[409107]),
    Comm_AuxM_ESS1_1: Determine_DL_of_CommDevice(dcData.AuxM3[409109]),             // 看能否換個順序
    Comm_AuxM_ESS1_2: Determine_DL_of_CommDevice(dcData.AuxM4[409109]),             // 看能否換個順序
    Comm_AuxM_ESS2_1: Determine_DL_of_CommDevice(dcData.AuxM5[409109]),             // 看能否換個順序
    Comm_AuxM_ESS2_2: Determine_DL_of_CommDevice(dcData.AuxM6[409109]),             // 看能否換個順序
    Comm_AuxM_ESS3_1: Determine_DL_of_CommDevice(dcData.AuxM7[409109]),             // 看能否換個順序
    Comm_AuxM_ESS3_2: Determine_DL_of_CommDevice(dcData.AuxM8[409109]),             // 看能否換個順序
    Comm_AuxM_ESS4: Determine_DL_of_CommDevice(dcData.AuxM9[409109]),               // 看能否換個順序
    Comm_AuxM_CtrlRoom: Determine_DL_of_CommDevice(dcData.AuxM1[409109]),           // 看能否換個順序
    Comm_TR_1: Determine_DL_of_CommDevice(dcData.TR1[409113]),
    Comm_TR_2: Determine_DL_of_CommDevice(dcData.TR2[409113]),
    Comm_TR_3: Determine_DL_of_CommDevice(dcData.TR3[409113]),
    Comm_TR_4: Determine_DL_of_CommDevice(dcData.TR4[409113]),
    Comm_RIO_ACP_1: Determine_DL_of_CommDevice(dcData.RIO_ACP1[409125]),
    Comm_RIO_ACP_2: Determine_DL_of_CommDevice(dcData.RIO_ACP2[409125]),
    Comm_RIO_ACP_3: Determine_DL_of_CommDevice(dcData.RIO_ACP3[409125]),
    Comm_RIO_ACP_4: Determine_DL_of_CommDevice(dcData.RIO_ACP4[409125]),
    Comm_UPS_ACP: Determine_DL_of_CommDevice(dcData.UPS4[409111]),
    Comm_LC_1: Determine_DL_of_CommDevice(dcData.LC1[409101]),
    Comm_LC_2: Determine_DL_of_CommDevice(dcData.LC2[409101]),
    Comm_LC_3: Determine_DL_of_CommDevice(dcData.LC3[409101]),
    Comm_LC_4: Determine_DL_of_CommDevice(dcData.LC4[409101]),
    Comm_PCS1_1: Determine_DL_of_CommPCSBMS(dcData.LC1[409101], PCScomm_LC1[0]),
    Comm_PCS1_2: Determine_DL_of_CommPCSBMS(dcData.LC1[409101], PCScomm_LC1[1]),
    Comm_BMS1_1: Determine_DL_of_CommPCSBMS(dcData.LC1[409101], BMScomm_LC1[0]),
    Comm_BMS1_2: Determine_DL_of_CommPCSBMS(dcData.LC1[409101], BMScomm_LC1[1]),
    Comm_PCS2_1: Determine_DL_of_CommPCSBMS(dcData.LC2[409101], PCScomm_LC2[0]),
    Comm_PCS2_2: Determine_DL_of_CommPCSBMS(dcData.LC2[409101], PCScomm_LC2[1]),
    Comm_BMS2_1: Determine_DL_of_CommPCSBMS(dcData.LC2[409101], BMScomm_LC2[0]),
    Comm_BMS2_2: Determine_DL_of_CommPCSBMS(dcData.LC2[409101], BMScomm_LC2[1]),
    Comm_PCS3_1: Determine_DL_of_CommPCSBMS(dcData.LC3[409101], PCScomm_LC3[0]),
    Comm_PCS3_2: Determine_DL_of_CommPCSBMS(dcData.LC3[409101], PCScomm_LC3[1]),
    Comm_BMS3_1: Determine_DL_of_CommPCSBMS(dcData.LC3[409101], BMScomm_LC3[0]),
    Comm_BMS3_2: Determine_DL_of_CommPCSBMS(dcData.LC3[409101], BMScomm_LC3[1]),
    Comm_PCS4: Determine_DL_of_CommPCSBMS(dcData.LC4[409101], PCScomm_LC4[0]),
    Comm_BMS4: Determine_DL_of_CommPCSBMS(dcData.LC4[409101], BMScomm_LC4[0]),
  };
}

router.get("/systeminfo/comm", async (req, res) => {
  try {
    // let permission = req.body.permission;
    await query_Comm_KeyValuePairs(req);
    res.render("Sys_Comm", Comm_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/systeminfo/comm/:data", async (req, res) => {
  try {
    await query_Comm_KeyValuePairs(req);
    res.json(Comm_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

module.exports = router;
// app.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });
