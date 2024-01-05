const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const Dc = require("../models/dcschema");
const Lc = require("../models/lcschema");
const Lc01 = Lc["Lc01"];
const Lc02 = Lc["Lc02"];
const Lc03 = Lc["Lc03"];
const Lc04 = Lc["Lc04"];
const router = express.Router();
const app = express();
const cors = require("cors");
const {
  Convert_UInt_to_revBitString,
  Determine_DL_of_CommPCSBMS,
} = require("./function");

// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是連線狀態，當前數據庫名稱：", currentDBName);
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
app.use(cors());
//app.use(myMiddleware);

// router.get("/systeminfo", (req, res) => {
//   // num與fun
//   res.render("Sys_Comm");
// });

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/systeminfo", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    //console.log("當前連接中的 collection 名稱：", collectionNames);

    const dcData = await Dc.findOne().sort({ time_log: -1 });
    const lc1Data = await Lc01.findOne().sort({ time_log: -1 });
    const lc2Data = await Lc02.findOne().sort({ time_log: -1 });
    const lc3Data = await Lc03.findOne().sort({ time_log: -1 });
    const lc4Data = await Lc04.findOne().sort({ time_log: -1 });

    if (!dcData) {
      throw new Error("No DC data found");
    }
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

    let PCScomm_LC1 = Convert_UInt_to_revBitString(lc1Data.System[402048], 32);
    let BMScomm_LC1 = Convert_UInt_to_revBitString(lc1Data.System[402050], 32);
    let PCScomm_LC2 = Convert_UInt_to_revBitString(lc2Data.System[402048], 32);
    let BMScomm_LC2 = Convert_UInt_to_revBitString(lc2Data.System[402050], 32);
    let PCScomm_LC3 = Convert_UInt_to_revBitString(lc3Data.System[402048], 32);
    let BMScomm_LC3 = Convert_UInt_to_revBitString(lc3Data.System[402050], 32);
    let PCScomm_LC4 = Convert_UInt_to_revBitString(lc4Data.System[402048], 32);
    let BMScomm_LC4 = Convert_UInt_to_revBitString(lc4Data.System[402050], 32);

    res.render("Sys_Comm", {
      Comm_GC_1: dcData.GC1[409127],
      Comm_GC_2: dcData.GC2[409127],
      Comm_HVAC_1: dcData.HVAC1[409129],
      Comm_HVAC_2: dcData.HVAC2[409129],
      Comm_UPS_EMS: dcData.UPS1[409111],
      Comm_UPS_CCTV: dcData.UPS2[409111],
      Comm_RIO_CtrlRoom: dcData.RIO_CtrlRoom[409121],
      Comm_FreqMeter: dcData.Freq[409103],
      Comm_AuxM_MVCB: dcData.AuxM2[409109],
      Comm_Relay_MVCB: dcData.RelayMVCB[409117],
      Comm_UPS_MVCB: dcData.UPS3[409111],
      Comm_Recloser: dcData.Recloser[409131],
      Comm_RIO_MVCB_1: dcData.RIO_MVCB_1[409123],
      Comm_RIO_MVCB_2: dcData.RIO_MVCB_2[409123],
      Comm_TH_MVCB: dcData.TH1[409115],
      Comm_Relay_VCB1: dcData.RelayVCB1[409119],
      Comm_Relay_VCB2: dcData.RelayVCB2[409119],
      Comm_Relay_VCB3: dcData.RelayVCB3[409119],
      Comm_Relay_VCB4: dcData.RelayVCB4[409119],
      Comm_Relay_VCB_Aux: dcData.RelayVCB5[409119],
      Comm_TR_Aux: dcData.TR5[409113],
      Comm_AuxM_total: dcData.AuxMtot1[409107],
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
      Comm_RIO_ACP_1: dcData.RIO_ACP1[409125],
      Comm_RIO_ACP_2: dcData.RIO_ACP2[409125],
      Comm_RIO_ACP_3: dcData.RIO_ACP3[409125],
      Comm_RIO_ACP_4: dcData.RIO_ACP4[409125],
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
