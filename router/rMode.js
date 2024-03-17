const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const router = express.Router();
const app = express();
const cors = require("cors");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

// const port = 3005;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
const {
  scaleProcess,
  mapSysMode,
  mapStatusAllBMS,
  mapStatusAllPCS,
  mapSysAvailability,
  mapStopCHGsched,
  mapAutoMan,
  mapBMSPCSstatus,
  mapAvail_SS,
  mapEdReg_SS,
  Scale_Data,
  Convert_UInt_to_revBitString,
  mapBitStatus,
  Convert_unixTime_to_dateTime,
  Convert_socRef_kWh_to_pct,
} = require("./function");

// const otherrf01nanoDb = nano.use("other_rf01");
// const otherrf10nanoDb = nano.use("other_rf10");
const gc_rf10 = "gc_rf10";
const GCnanoDb = nano.use(gc_rf10);

//app.use(myMiddleware);

//const { authentication } = require("./authMiddleware");

// app.get('*', (req, res, next) => {
//   // Assuming `authentication` returns true if authenticated, false otherwise
//   if (!authentication(req)) {
//     // If authentication fails, you may send a response or perform some other action
//     console.log("doaihdihas")
//     return res.status(401).send('Unauthorized');
//   }
//   // If authenticated, continue to the next middleware or route handler
// });

//app=router要記得改
//導向童話面作法同於METER

var sysctrl_variables;
async function query_Syscrtl_variables() {
  const indexDef = {
    index: { fields: ["time"] },
    name: "time_index",
  };
  await GCnanoDb.createIndex(indexDef);

  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
  };

  try {
    const result = await GCnanoDb.find(mangoQuery);

    const GCData = result.docs[0];
    const value = GCData.System[400078];
    console.log("Value:", value);

    sysctrl_variables = {
      permission: "manager",
      sysAvailability: mapSysAvailability(GCData.System[400078]), //15
      SOC: scaleProcess(GCData.System[400036], 0.1, 1),
      SBSPM: scaleProcess(GCData.System[400037], 0.01, 1),
      sysMode: mapSysMode(
        GCData.System[400078] //5 15
      ),

      P_Project: scaleProcess(GCData.System[400001], 0.01, 1),
      P_LoadShift: scaleProcess(GCData.System[400002], 0.001, 1),
      statusAllPCS: mapStatusAllPCS(
        GCData.System[400078], //bit2
        GCData.System[400079], //bit2
        GCData.System[400080], //bit2
        GCData.System[400081] //bit2
      ),
      statusAllBMS: mapStatusAllBMS(
        GCData.System[400078], //BIT0、BIT1
        GCData.System[400079], //BIT0、BIT1
        GCData.System[400080], //BIT0、BIT1
        GCData.System[400081] //BIT0、BIT1
      ),

      stopCHGsched: mapStopCHGsched(GCData.System[400078]), //bit 14: Force P_LS to 0 ( 0: No, 1: Yes )
      Freq_A: scaleProcess(GCData.System[400016], 0.01, 2),
      Freq_B: scaleProcess(GCData.System[400017], 0.01, 2),
      Freq_C: scaleProcess(GCData.System[400018], 0.01, 2),
      Freq_D: scaleProcess(GCData.System[400019], 0.01, 2),
      Freq_E: scaleProcess(GCData.System[400020], 0.01, 2),
      Freq_F: scaleProcess(GCData.System[400021], 0.01, 2),

      P_t: scaleProcess(GCData.System[400022], 0.1, 1),
      P_u: scaleProcess(GCData.System[400023], 0.1, 1),
      P_v: scaleProcess(GCData.System[400024], 0.1, 1),
      P_w: scaleProcess(GCData.System[400025], 0.1, 1),
      P_x: scaleProcess(GCData.System[400026], 0.1, 1),
      P_y: scaleProcess(GCData.System[400027], 0.1, 1),

      //實功基準值
      P_base_SS1: GCData.System[400028],
      P_base_SS2: GCData.System[400029],
      P_base_SS3: GCData.System[400030],
      P_base_SS4: GCData.System[400031],

      //虛功基準值
      Q_base_SS1: GCData.System[400056],
      Q_base_SS2: GCData.System[400057],
      Q_base_SS3: GCData.System[400058],
      Q_base_SS4: GCData.System[400059],

      //子系統運作模式
      AutoMan_SS1: mapAutoMan(GCData.System[400076], 1), //bit 1
      AutoMan_SS1_Light: mapAutoMan(GCData.System[400076], 1),
      AutoMan_SS2: mapAutoMan(GCData.System[400076], 2),
      AutoMan_SS2_Light: mapAutoMan(GCData.System[400076], 2),
      AutoMan_SS3: mapAutoMan(GCData.System[400076], 3), //bit 3
      AutoMan_SS3_Light: mapAutoMan(GCData.System[400076], 3),
      AutoMan_SS4: mapAutoMan(GCData.System[400076], 4), //bit 4
      AutoMan_SS4_Light: mapAutoMan(GCData.System[400076], 4),

      //電池與PCS狀態
      BMSPCSstatus_SS1_Light: mapBMSPCSstatus(GCData.System[400078]), //bit3
      BMSPCSstatus_SS1: mapBMSPCSstatus(GCData.System[400078]),
      BMSPCSstatus_SS2_Light: mapBMSPCSstatus(GCData.System[400079]), //bit3
      BMSPCSstatus_SS2: mapBMSPCSstatus(GCData.System[400079]),
      BMSPCSstatus_SS3_Light: mapBMSPCSstatus(GCData.System[400080]), //bit3
      BMSPCSstatus_SS3: mapBMSPCSstatus(GCData.System[400080]), //bit3
      BMSPCSstatus_SS4_Light: mapBMSPCSstatus(GCData.System[400081]), //bit3
      BMSPCSstatus_SS4: mapBMSPCSstatus(GCData.System[400081]),

      //子系統可用性
      Avail_SS1_Light: mapAvail_SS(GCData.System[400078]), //bit4
      Avail_SS1: mapAvail_SS(GCData.System[400078]),
      Avail_SS2_Light: mapAvail_SS(GCData.System[400079]), //bit4
      Avail_SS2: mapAvail_SS(GCData.System[400079]),
      Avail_SS3_Light: mapAvail_SS(GCData.System[400080]), //bit4
      Avail_SS3: mapAvail_SS(GCData.System[400080]),
      Avail_SS4_Light: mapAvail_SS(GCData.System[400081]), //bit4
      Avail_SS4: mapAvail_SS(GCData.System[400081]),

      //E-dReg服務狀態
      EdReg_SS1_Light: mapEdReg_SS(GCData.System[400078]), //bit5
      EdReg_SS1: mapEdReg_SS(GCData.System[400078]), //bit5
      EdReg_SS2_Light: mapEdReg_SS(GCData.System[400079]), //bit5
      EdReg_SS2: mapEdReg_SS(GCData.System[400079]), //bit5
      EdReg_SS3_Light: mapEdReg_SS(GCData.System[400080]), //bit5
      EdReg_SS3: mapEdReg_SS(GCData.System[400080]), //bit5
      EdReg_SS4_Light: mapEdReg_SS(GCData.System[400081]), //bit5
      EdReg_SS4: mapEdReg_SS(GCData.System[400081]), //bit5
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// async function query_Syscrtl_variables() {
//   const indexDef = {
//     index: { fields: ["time"] },
//     name: "time_index",
//   };
//   await GCnanoDb.createIndex(indexDef);

//   const mangoQuery = {
//     selector: {
//       time: { $exists: true },
//     },
//     sort: [{ time: "desc" }],
//     limit: 1,
//   };

//   await GCnanoDb.find(mangoQuery, async (err, body) => {
//     if (err) {
//       console.error("Error:", err);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     const GCData = body.docs[0]; // 取得數據的第一個元素
//     console.log("test" + GCData.System[400078]);

//   });
// }

router.get("/mode", (req, res) => {
  // 在這裡修改重定向的方式，可以直接將 URL 修改為 "/mode/sysctrl"
  // 如果需要傳遞額外資訊，可以使用查詢字串或 session 等機制
  res.redirect("/mode/sysctrl");
});

//系統模式控制頁面切換
router.get("/mode/sysctrl", async (req, res) => {
  await query_Syscrtl_variables();
  console.log(sysctrl_variables);
  res.render("Mode_SysCtrl", sysctrl_variables);
});

router.get("/mode/sysctrl/:data", async (req, res) => {
  await query_Syscrtl_variables();
  console.log(sysctrl_variables);
  res.json(sysctrl_variables);
});

/******排程**************************************************************/
let Schd_KeyValuePairs;
let dateNumber = 0;
const date_MT = {
  0: { dicName: "Today", subTitle: "今日排程(2024/03/15)", buttonContext: "明日排程" },
  1: { dicName: "Tomorrow", subTitle: "明日排程(2024/03/16)", buttonContext: "今日排程" },
};

async function query_Schd_KeyValuePairs() {
  const indexDef = {
    index: { fields: ["time"] },
    name: "time_index",
  };
  await GCnanoDb.createIndex(indexDef);

  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
  };

  try {
    const result = await GCnanoDb.find(mangoQuery);

    const GCData = result.docs[0];
    const value = GCData.Schedule.Today[401002];
    console.log("Value:", value);

    const sysCtrl_2_MT = {
      0: { 0: "頻率表", 1: "測試用頻率" },
      1: { 0: "否", 1: "是" },
      2: { 0: "否", 1: "是" },
      3: { 0: "否", 1: "是" },
      4: { 0: "否", 1: "是" },
      5: { 0: "否", 1: "是" },
      6: { 0: "否", 1: "是" },
      7: { 0: "否", 1: "是" },
      8: { 0: "禁用", 1: "啟用" },
      9: { 0: "禁用", 1: "啟用" },
      10: { 0: "禁用", 1: "啟用" },
    };

    Schd_KeyValuePairs = {
      permission: "manager",

      // P_Project: scaleProcess(GCData.System[400001], 0.01, 1),
      use_P_schd: mapBitStatus(Convert_UInt_to_revBitString(GCData.System[400077], 16), sysCtrl_2_MT, 2),
      use_P_LS: mapBitStatus(Convert_UInt_to_revBitString(GCData.System[400077], 16), sysCtrl_2_MT, 3),
      use_SOC_ref: mapBitStatus(Convert_UInt_to_revBitString(GCData.System[400077], 16), sysCtrl_2_MT, 4),
      autoCal_SOC_ideal: mapBitStatus(Convert_UInt_to_revBitString(GCData.System[400077], 16), sysCtrl_2_MT, 5),
      use_MTE_P_96Q: mapBitStatus(Convert_UInt_to_revBitString(GCData.System[400077], 16), sysCtrl_2_MT, 6),
      use_MTE_API: mapBitStatus(Convert_UInt_to_revBitString(GCData.System[400077], 16), sysCtrl_2_MT, 7),
      use_Freq_Cmd: mapBitStatus(Convert_UInt_to_revBitString(GCData.System[400077], 16), sysCtrl_2_MT, 1),
      freqSource: mapBitStatus(Convert_UInt_to_revBitString(GCData.System[400077], 16), sysCtrl_2_MT, 0),
      Freq_test: Scale_Data(GCData.MTE[410001], 0.01, 2),

      exeCmdInd: "Done",
      exeCmdStatus: "執行結束",
      sbyCmdInd: "Standby",
      sbyCmdStatus: "待命中",
      exeCmd_StartDT: Convert_unixTime_to_dateTime(GCData.API[400989]),
      sbyCmd_StartDT: Convert_unixTime_to_dateTime(GCData.API[400995]),
      exeCmd_StopDT: Convert_unixTime_to_dateTime(GCData.API[400991]),
      sbyCmd_StopDT: Convert_unixTime_to_dateTime(GCData.API[400997]),
      exeCmd_P: Scale_Data(GCData.API[400993], 1, 0),
      sbyCmd_P: Scale_Data(GCData.API[400999], 1, 0),

      P_schd_00_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401001], 0.01, 2),
      P_schd_00_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401002], 0.01, 2),
      P_schd_00_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401003], 0.01, 2),
      P_schd_00_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401004], 0.01, 2),
      P_schd_01_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401005], 0.01, 2),
      P_schd_01_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401006], 0.01, 2),
      P_schd_01_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401007], 0.01, 2),
      P_schd_01_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401008], 0.01, 2),
      P_schd_02_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401009], 0.01, 2),
      P_schd_02_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401010], 0.01, 2),
      P_schd_02_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401011], 0.01, 2),
      P_schd_02_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401012], 0.01, 2),
      P_schd_03_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401013], 0.01, 2),
      P_schd_03_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401014], 0.01, 2),
      P_schd_03_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401015], 0.01, 2),
      P_schd_03_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401016], 0.01, 2),
      P_schd_04_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401017], 0.01, 2),
      P_schd_04_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401018], 0.01, 2),
      P_schd_04_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401019], 0.01, 2),
      P_schd_04_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401020], 0.01, 2),
      P_schd_05_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401021], 0.01, 2),
      P_schd_05_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401022], 0.01, 2),
      P_schd_05_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401023], 0.01, 2),
      P_schd_05_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401024], 0.01, 2),
      P_schd_06_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401025], 0.01, 2),
      P_schd_06_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401026], 0.01, 2),
      P_schd_06_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401027], 0.01, 2),
      P_schd_06_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401028], 0.01, 2),
      P_schd_07_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401029], 0.01, 2),
      P_schd_07_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401030], 0.01, 2),
      P_schd_07_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401031], 0.01, 2),
      P_schd_07_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401032], 0.01, 2),
      P_schd_08_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401033], 0.01, 2),
      P_schd_08_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401034], 0.01, 2),
      P_schd_08_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401035], 0.01, 2),
      P_schd_08_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401036], 0.01, 2),
      P_schd_09_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401037], 0.01, 2),
      P_schd_09_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401038], 0.01, 2),
      P_schd_09_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401039], 0.01, 2),
      P_schd_09_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401040], 0.01, 2),
      P_schd_10_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401041], 0.01, 2),
      P_schd_10_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401042], 0.01, 2),
      P_schd_10_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401043], 0.01, 2),
      P_schd_10_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401044], 0.01, 2),
      P_schd_11_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401045], 0.01, 2),
      P_schd_11_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401046], 0.01, 2),
      P_schd_11_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401047], 0.01, 2),
      P_schd_11_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401048], 0.01, 2),
      P_schd_12_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401049], 0.01, 2),
      P_schd_12_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401050], 0.01, 2),
      P_schd_12_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401051], 0.01, 2),
      P_schd_12_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401052], 0.01, 2),
      P_schd_13_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401053], 0.01, 2),
      P_schd_13_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401054], 0.01, 2),
      P_schd_13_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401055], 0.01, 2),
      P_schd_13_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401056], 0.01, 2),
      P_schd_14_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401057], 0.01, 2),
      P_schd_14_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401058], 0.01, 2),
      P_schd_14_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401059], 0.01, 2),
      P_schd_14_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401060], 0.01, 2),
      P_schd_15_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401061], 0.01, 2),
      P_schd_15_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401062], 0.01, 2),
      P_schd_15_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401063], 0.01, 2),
      P_schd_15_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401064], 0.01, 2),
      P_schd_16_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401065], 0.01, 2),
      P_schd_16_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401066], 0.01, 2),
      P_schd_16_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401067], 0.01, 2),
      P_schd_16_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401068], 0.01, 2),
      P_schd_17_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401069], 0.01, 2),
      P_schd_17_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401070], 0.01, 2),
      P_schd_17_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401071], 0.01, 2),
      P_schd_17_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401072], 0.01, 2),
      P_schd_18_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401073], 0.01, 2),
      P_schd_18_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401074], 0.01, 2),
      P_schd_18_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401075], 0.01, 2),
      P_schd_18_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401076], 0.01, 2),
      P_schd_19_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401077], 0.01, 2),
      P_schd_19_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401078], 0.01, 2),
      P_schd_19_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401079], 0.01, 2),
      P_schd_19_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401080], 0.01, 2),
      P_schd_20_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401081], 0.01, 2),
      P_schd_20_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401082], 0.01, 2),
      P_schd_20_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401083], 0.01, 2),
      P_schd_20_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401084], 0.01, 2),
      P_schd_21_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401085], 0.01, 2),
      P_schd_21_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401086], 0.01, 2),
      P_schd_21_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401087], 0.01, 2),
      P_schd_21_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401088], 0.01, 2),
      P_schd_22_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401089], 0.01, 2),
      P_schd_22_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401090], 0.01, 2),
      P_schd_22_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401091], 0.01, 2),
      P_schd_22_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401092], 0.01, 2),
      P_schd_23_0: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401093], 0.01, 2),
      P_schd_23_1: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401094], 0.01, 2),
      P_schd_23_2: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401095], 0.01, 2),
      P_schd_23_3: Scale_Data(GCData.Schedule[date_MT[dateNumber].dicName][401096], 0.01, 2),

      P_cmd_00_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400201], 1, 0),
      P_cmd_00_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400203], 1, 0),
      P_cmd_00_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400205], 1, 0),
      P_cmd_00_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400207], 1, 0),
      P_cmd_01_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400209], 1, 0),
      P_cmd_01_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400211], 1, 0),
      P_cmd_01_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400213], 1, 0),
      P_cmd_01_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400215], 1, 0),
      P_cmd_02_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400217], 1, 0),
      P_cmd_02_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400219], 1, 0),
      P_cmd_02_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400221], 1, 0),
      P_cmd_02_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400223], 1, 0),
      P_cmd_03_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400225], 1, 0),
      P_cmd_03_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400227], 1, 0),
      P_cmd_03_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400229], 1, 0),
      P_cmd_03_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400231], 1, 0),
      P_cmd_04_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400233], 1, 0),
      P_cmd_04_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400235], 1, 0),
      P_cmd_04_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400237], 1, 0),
      P_cmd_04_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400239], 1, 0),
      P_cmd_05_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400241], 1, 0),
      P_cmd_05_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400243], 1, 0),
      P_cmd_05_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400245], 1, 0),
      P_cmd_05_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400247], 1, 0),
      P_cmd_06_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400249], 1, 0),
      P_cmd_06_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400251], 1, 0),
      P_cmd_06_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400253], 1, 0),
      P_cmd_06_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400255], 1, 0),
      P_cmd_07_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400257], 1, 0),
      P_cmd_07_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400259], 1, 0),
      P_cmd_07_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400261], 1, 0),
      P_cmd_07_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400263], 1, 0),
      P_cmd_08_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400265], 1, 0),
      P_cmd_08_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400267], 1, 0),
      P_cmd_08_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400269], 1, 0),
      P_cmd_08_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400271], 1, 0),
      P_cmd_09_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400273], 1, 0),
      P_cmd_09_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400275], 1, 0),
      P_cmd_09_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400277], 1, 0),
      P_cmd_09_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400279], 1, 0),

      P_cmd_10_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400281], 1, 0),
      P_cmd_10_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400283], 1, 0),
      P_cmd_10_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400285], 1, 0),
      P_cmd_10_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400287], 1, 0),
      P_cmd_11_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400289], 1, 0),
      P_cmd_11_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400291], 1, 0),
      P_cmd_11_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400293], 1, 0),
      P_cmd_11_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400295], 1, 0),
      P_cmd_12_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400297], 1, 0),
      P_cmd_12_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400299], 1, 0),
      P_cmd_12_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400301], 1, 0),
      P_cmd_12_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400303], 1, 0),
      P_cmd_13_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400305], 1, 0),
      P_cmd_13_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400307], 1, 0),
      P_cmd_13_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400309], 1, 0),
      P_cmd_13_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400311], 1, 0),
      P_cmd_14_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400313], 1, 0),
      P_cmd_14_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400315], 1, 0),
      P_cmd_14_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400317], 1, 0),
      P_cmd_14_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400319], 1, 0),
      P_cmd_15_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400321], 1, 0),
      P_cmd_15_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400323], 1, 0),
      P_cmd_15_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400325], 1, 0),
      P_cmd_15_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400327], 1, 0),
      P_cmd_16_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400329], 1, 0),
      P_cmd_16_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400331], 1, 0),
      P_cmd_16_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400333], 1, 0),
      P_cmd_16_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400335], 1, 0),
      P_cmd_17_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400337], 1, 0),
      P_cmd_17_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400339], 1, 0),
      P_cmd_17_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400341], 1, 0),
      P_cmd_17_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400343], 1, 0),
      P_cmd_18_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400345], 1, 0),
      P_cmd_18_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400347], 1, 0),
      P_cmd_18_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400349], 1, 0),
      P_cmd_18_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400351], 1, 0),
      P_cmd_19_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400353], 1, 0),
      P_cmd_19_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400355], 1, 0),
      P_cmd_19_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400357], 1, 0),
      P_cmd_19_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400359], 1, 0),

      P_cmd_20_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400361], 1, 0),
      P_cmd_20_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400363], 1, 0),
      P_cmd_20_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400365], 1, 0),
      P_cmd_20_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400367], 1, 0),
      P_cmd_21_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400369], 1, 0),
      P_cmd_21_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400371], 1, 0),
      P_cmd_21_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400373], 1, 0),
      P_cmd_21_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400375], 1, 0),
      P_cmd_22_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400377], 1, 0),
      P_cmd_22_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400379], 1, 0),
      P_cmd_22_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400381], 1, 0),
      P_cmd_22_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400383], 1, 0),
      P_cmd_23_0: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400385], 1, 0),
      P_cmd_23_1: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400387], 1, 0),
      P_cmd_23_2: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400389], 1, 0),
      P_cmd_23_3: Scale_Data(GCData.API[date_MT[dateNumber].dicName][400391], 1, 0),

      socRef_00_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400393]),
      socRef_00_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400395]),
      socRef_00_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400397]),
      socRef_00_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400399]),
      socRef_01_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400401]),
      socRef_01_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400403]),
      socRef_01_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400405]),
      socRef_01_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400407]),
      socRef_02_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400409]),
      socRef_02_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400411]),
      socRef_02_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400413]),
      socRef_02_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400415]),
      socRef_03_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400417]),
      socRef_03_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400419]),
      socRef_03_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400421]),
      socRef_03_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400423]),
      socRef_04_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400425]),
      socRef_04_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400427]),
      socRef_04_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400429]),
      socRef_04_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400431]),
      socRef_05_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400433]),
      socRef_05_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400435]),
      socRef_05_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400437]),
      socRef_05_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400439]),
      socRef_06_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400441]),
      socRef_06_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400443]),
      socRef_06_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400445]),
      socRef_06_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400447]),
      socRef_07_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400449]),
      socRef_07_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400451]),
      socRef_07_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400453]),
      socRef_07_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400455]),
      socRef_08_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400457]),
      socRef_08_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400459]),
      socRef_08_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400461]),
      socRef_08_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400463]),
      socRef_09_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400465]),
      socRef_09_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400467]),
      socRef_09_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400469]),
      socRef_09_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400471]),

      socRef_10_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400473]),
      socRef_10_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400475]),
      socRef_10_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400477]),
      socRef_10_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400479]),
      socRef_11_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400481]),
      socRef_11_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400483]),
      socRef_11_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400485]),
      socRef_11_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400487]),
      socRef_12_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400489]),
      socRef_12_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400491]),
      socRef_12_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400493]),
      socRef_12_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400495]),
      socRef_13_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400497]),
      socRef_13_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400499]),
      socRef_13_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400501]),
      socRef_13_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400503]),
      socRef_14_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400505]),
      socRef_14_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400507]),
      socRef_14_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400509]),
      socRef_14_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400511]),
      socRef_15_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400513]),
      socRef_15_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400515]),
      socRef_15_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400517]),
      socRef_15_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400519]),
      socRef_16_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400521]),
      socRef_16_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400523]),
      socRef_16_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400525]),
      socRef_16_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400527]),
      socRef_17_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400529]),
      socRef_17_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400531]),
      socRef_17_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400533]),
      socRef_17_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400535]),
      socRef_18_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400537]),
      socRef_18_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400539]),
      socRef_18_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400541]),
      socRef_18_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400543]),
      socRef_19_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400545]),
      socRef_19_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400547]),
      socRef_19_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400549]),
      socRef_19_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400551]),

      socRef_20_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400553]),
      socRef_20_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400555]),
      socRef_20_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400557]),
      socRef_20_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400559]),
      socRef_21_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400561]),
      socRef_21_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400563]),
      socRef_21_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400565]),
      socRef_21_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400567]),
      socRef_22_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400569]),
      socRef_22_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400571]),
      socRef_22_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400573]),
      socRef_22_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400575]),
      socRef_23_0: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400577]),
      socRef_23_1: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400579]),
      socRef_23_2: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400581]),
      socRef_23_3: Convert_socRef_kWh_to_pct(GCData.API[date_MT[dateNumber].dicName][400583]),
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

router.get("/mode/schedule", async (req, res) => {
  try {
    await query_Schd_KeyValuePairs();
    console.log(Schd_KeyValuePairs);

    res.render("Mode_Schedule", Schd_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/mode/schedule/:data", async (req, res) => {
  try {
    await query_Schd_KeyValuePairs();

    res.json(Schd_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/change_dateNumber", async (req, res) => {
  try {
    console.log("接收到前端請求");

    if (dateNumber === 0) {
      dateNumber = 1;
    } else {
      dateNumber = 0;
    }

    console.log(dateNumber);

    await query_Schd_KeyValuePairs();

    const response = {
      dateNumber: dateNumber,
      scheduleDate: date_MT[dateNumber].subTitle,
      anotherDay: date_MT[dateNumber].buttonContext,
      KVPairs: Schd_KeyValuePairs,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
// app.listen(port, () => {
//   console.log(`mode.js 應用程式正在監聽端口 ${port}`);
// });
