const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const nano = require("nano");
//const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
const { Console } = require("console");
const { ok } = require("assert");
const couchDBUrl = "http://admin:ems45877096@192.168.8.101:5984";
const nanoDb = nano(couchDBUrl);

const router = express.Router();
const app = express();
const cors = require("cors");
const {
  Convert_UInt_to_revBitString,
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

//***************************************************************************************************************** */

router.get("/systeminfo", async (req, res) => {
  try {
    // 使用 map 遍歷所有資料庫名稱，創建 Nano 實例，並獲取最新文檔的 promise 陣列
    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
    });

    // 使用 Promise.all 等待所有 promise 完成，獲取"所有資料庫"中的最新數據
    //並利用陣列不同列數儲存不同資料庫
    // 在這裡處理 allData，它是一個包含所有資料庫最新數據的陣列

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

    res.render("Sys_Comm", {
      // Comm_GC_1: dcData.GC1[409127], //dc的存活要利用心跳去判斷
      // Comm_GC_2: dcData.GC2[409127],
      // Comm_HVAC_1: dcData.HVAC1[409129],
      // Comm_HVAC_2: dcData.HVAC2[409129],
      Comm_GC_1: 1,
      Comm_GC_2: 0,
      Comm_HVAC_1: 1,
      Comm_HVAC_2: 0,
      Comm_UPS_EMS: dcData.UPS1[409111],
      Comm_UPS_CCTV: dcData.UPS2[409111],
      //Comm_RIO_CtrlRoom: dcData.RIO_CtrlRoom[409121],
      Comm_RIO_CtrlRoom: 1,
      Comm_FreqMeter: dcData.Freq[409103],
      Comm_AuxM_MVCB: dcData.AuxM2[409109],
      Comm_Relay_MVCB: dcData.RelayMVCB[409117],
      Comm_UPS_MVCB: dcData.UPS3[409111],
      //Comm_Recloser: dcData.Recloser[409131],
      Comm_Recloser: 0,
      // Comm_RIO_MVCB_1: dcData.RIO_MVCB_1[409123],
      // Comm_RIO_MVCB_2: dcData.RIO_MVCB_2[409123],
      Comm_RIO_MVCB_1: 0,
      Comm_RIO_MVCB_2: 1,
      Comm_TH_MVCB: dcData.TH1[409115],
      Comm_Relay_VCB1: dcData.RelayVCB1[409119],
      Comm_Relay_VCB2: dcData.RelayVCB2[409119],
      Comm_Relay_VCB3: dcData.RelayVCB3[409119],
      Comm_Relay_VCB4: dcData.RelayVCB4[409119],
      Comm_Relay_VCB_Aux: dcData.RelayVCB5[409119],
      Comm_TR_Aux: dcData.TR5[409113],
      Comm_AuxM_total: 1,
      //Comm_AuxM_total: dcData.AuxMtot1[409107],
      Comm_AuxM_ESS1_1: dcData.AuxM3[409109],
      Comm_AuxM_ESS1_2: dcData.AuxM4[409109],
      Comm_AuxM_ESS2_1: dcData.AuxM5[409109],
      Comm_AuxM_ESS2_2: dcData.AuxM6[409109],
      Comm_AuxM_ESS3_1: dcData.AuxM7[409109],
      Comm_AuxM_ESS3_2: dcData.AuxM8[409109],
      Comm_AuxM_ESS4: dcData.AuxM9[409109],
      Comm_AuxM_CtrlRoom: dcData.AuxM1[409109],
      Comm_TR_1: dcData.TR1[409113],
      Comm_TR_2: dcData.TR2[409113],
      Comm_TR_3: dcData.TR3[409113],
      Comm_TR_4: dcData.TR4[409113],
      Comm_RIO_ACP_1: 0,
      Comm_RIO_ACP_2: 1,
      Comm_RIO_ACP_3: 0,
      Comm_RIO_ACP_4: 1,

      // Comm_RIO_ACP_1: dcData.RIO_ACP1[409125],
      // Comm_RIO_ACP_2: dcData.RIO_ACP2[409125],
      // Comm_RIO_ACP_3: dcData.RIO_ACP3[409125],
      // Comm_RIO_ACP_4: dcData.RIO_ACP4[409125],

      Comm_UPS_ACP: dcData.UPS4[409111],
      Comm_LC_1: dcData.LC1[409101],
      Comm_LC_2: dcData.LC2[409101],
      Comm_LC_3: dcData.LC3[409101],
      Comm_LC_4: dcData.LC4[409101],

      Comm_PCS1_1: Determine_DL_of_CommPCSBMS(
        dcData.LC1[409101],
        PCScomm_LC1[0]
      ),
      Comm_PCS1_2: Determine_DL_of_CommPCSBMS(
        dcData.LC1[409101],
        PCScomm_LC1[1]
      ),
      Comm_BMS1_1: Determine_DL_of_CommPCSBMS(
        dcData.LC1[409101],
        BMScomm_LC1[0]
      ),
      Comm_BMS1_2: Determine_DL_of_CommPCSBMS(
        dcData.LC1[409101],
        BMScomm_LC1[1]
      ),
      Comm_PCS2_1: Determine_DL_of_CommPCSBMS(
        dcData.LC2[409101],
        PCScomm_LC2[0]
      ),
      Comm_PCS2_2: Determine_DL_of_CommPCSBMS(
        dcData.LC2[409101],
        PCScomm_LC2[1]
      ),
      Comm_BMS2_1: Determine_DL_of_CommPCSBMS(
        dcData.LC2[409101],
        BMScomm_LC2[0]
      ),
      Comm_BMS2_2: Determine_DL_of_CommPCSBMS(
        dcData.LC2[409101],
        BMScomm_LC2[1]
      ),
      Comm_PCS3_1: Determine_DL_of_CommPCSBMS(
        dcData.LC3[409101],
        PCScomm_LC3[0]
      ),
      Comm_PCS3_2: Determine_DL_of_CommPCSBMS(
        dcData.LC3[409101],
        PCScomm_LC3[1]
      ),
      Comm_BMS3_1: Determine_DL_of_CommPCSBMS(
        dcData.LC3[409101],
        BMScomm_LC3[0]
      ),
      Comm_BMS3_2: Determine_DL_of_CommPCSBMS(
        dcData.LC3[409101],
        BMScomm_LC3[1]
      ),
      Comm_PCS4: Determine_DL_of_CommPCSBMS(dcData.LC4[409101], PCScomm_LC4[0]),
      Comm_BMS4: Determine_DL_of_CommPCSBMS(dcData.LC4[409101], BMScomm_LC4[0]),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

module.exports = router;
