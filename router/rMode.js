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
const moment = require("moment");

// const port = 3005;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
const {
  Scale_Data,
  Convert_UInt_to_revBitString,
  mapBitStatus,
  Convert_unixTime_to_dateTime,
  Convert_socRef_kWh_to_pct,
  Determine_status_of_exeCmd,
  Determine_status_of_sbyCmd,
  get_Log_Time
} = require("./function");

// const otherrf01nanoDb = nano.use("other_rf01");
// const otherrf10nanoDb = nano.use("other_rf10");
const gc_rf10 = "gc_rf10";
const gc_rf01 = "gc_rf01";
const GC10nanoDb = nano.use(gc_rf10);
const GC01nanoDb = nano.use(gc_rf01);
const dwctrl = "dwctrl";
const dwctrlnanoDb = nano.use(dwctrl);

const createNanoInstance = (dbName) => nano.db.use(dbName);

const indexDef = {
  index: { fields: ["time"] },
  name: "time_index"
};

const mangoQuery = {
  selector: {
    time: { $exists: true }
  },
  sort: [{ time: "desc" }],
  limit: 1
};

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

/************************************************************************************ */

let SysCtrl_KeyValuePairs;

const sysCtrl_1_MT = {
  0: { 0: "不動作", 1: "切換" },
  1: { 0: "手動", 1: "自動" },
  2: { 0: "手動", 1: "自動" },
  3: { 0: "手動", 1: "自動" },
  4: { 0: "手動", 1: "自動" },
  8: { 0: "SOC", 1: "電壓" },
  9: { 0: "SOC", 1: "電壓" },
  10: { 0: "SOC", 1: "電壓" },
  11: { 0: "SOC", 1: "電壓" },
  15: { 0: "不動作", 1: "切換" }
};

const ss1_Status_MT = {
  0: { 0: "不可用", 1: "可用" },
  1: { 0: "不可用", 1: "可用" },
  2: { 0: "不可用", 1: "可用" },
  3: { 0: "不可用", 1: "可用" },
  4: { 0: "不可用", 1: "可用" },
  5: { 0: "停止", 1: "運行中" },
  6: { 0: "停止", 1: "運行中" },
  13: { 0: "藍", 1: "橘" },
  14: { 0: "依原定排程", 1: "停止排程" },
  15: { 0: "不可用", 1: "可用" }
};

const ss234_Status_MT = {
  0: { 0: "不可用", 1: "可用" },
  1: { 0: "不可用", 1: "可用" },
  2: { 0: "不可用", 1: "可用" },
  3: { 0: "不可用", 1: "可用" },
  4: { 0: "不可用", 1: "可用" },
  5: { 0: "停止", 1: "運行中" },
  6: { 0: "停止", 1: "運行中" }
};

async function query_SysCtrl_KeyValuePairs() {
  await GC10nanoDb.createIndex(indexDef);
  await GC01nanoDb.createIndex(indexDef);

  try {
    const result10 = await GC10nanoDb.find(mangoQuery);
    const result01 = await GC01nanoDb.find(mangoQuery);

    const GC10Data = result10.docs[0];
    // console.log("Value[400078]:", GC10Data.System[400078]);

    const GC01Data = result01.docs[0];
    // console.log("Value[400107]:", GC01Data.IEC61850[400107]);

    const sysCtrl1_rBitS = Convert_UInt_to_revBitString(GC10Data.System[400076], 16);
    const ss1_Status_rBitS = Convert_UInt_to_revBitString(GC10Data.System[400078], 16);
    const ss2_Status_rBitS = Convert_UInt_to_revBitString(GC10Data.System[400079], 16);
    const ss3_Status_rBitS = Convert_UInt_to_revBitString(GC10Data.System[400080], 16);
    const ss4_Status_rBitS = Convert_UInt_to_revBitString(GC10Data.System[400081], 16);

    SysCtrl_KeyValuePairs = {
      permission: "manager",

      sysAvailability: mapBitStatus(ss1_Status_rBitS, ss1_Status_MT, 15),
      SOC: Scale_Data(GC01Data.IEC61850[400129], ((0.01 * 1) / (4472 * 7)) * 100, 1),
      SBSPM: Scale_Data(GC01Data.IEC61850[400133], 0.01, 1),

      sysMode: "不動作",
      P_Project: Scale_Data(GC10Data.System[400001], 0.01, 2),
      P_LoadShift: Scale_Data(GC10Data.System[400002], 0.001, 3),
      statusAllPCS: "不動作",
      statusAllBMS: "不動作",
      stopCHGsched: mapBitStatus(ss1_Status_rBitS, ss1_Status_MT, 14),
      // sysMode: mapSysMode(
      //   GC10Data.System[400078] //5 15
      // ),
      // statusAllPCS: mapStatusAllPCS(
      //   GC10Data.System[400078], //bit2
      //   GC10Data.System[400079], //bit2
      //   GC10Data.System[400080], //bit2
      //   GC10Data.System[400081] //bit2
      // ),
      // statusAllBMS: mapStatusAllBMS(
      //   GC10Data.System[400078], //BIT0、BIT1
      //   GC10Data.System[400079], //BIT0、BIT1
      //   GC10Data.System[400080], //BIT0、BIT1
      //   GC10Data.System[400081] //BIT0、BIT1
      // ),

      Freq_A: Scale_Data(GC10Data.System[400016], 0.01, 2),
      Freq_B: Scale_Data(GC10Data.System[400017], 0.01, 2),
      Freq_C: Scale_Data(GC10Data.System[400018], 0.01, 2),
      Freq_D: Scale_Data(GC10Data.System[400019], 0.01, 2),
      Freq_E: Scale_Data(GC10Data.System[400020], 0.01, 2),
      Freq_F: Scale_Data(GC10Data.System[400021], 0.01, 2),

      P_t: Scale_Data(GC10Data.System[400022], 0.1, 1),
      P_u: Scale_Data(GC10Data.System[400023], 0.1, 1),
      P_v: Scale_Data(GC10Data.System[400024], 0.1, 1),
      P_w: Scale_Data(GC10Data.System[400025], 0.1, 1),
      P_x: Scale_Data(GC10Data.System[400026], 0.1, 1),
      P_y: Scale_Data(GC10Data.System[400027], 0.1, 1),

      Freq_now: Scale_Data(GC10Data.System[400039], 0.001, 3),
      P_out_pct: Scale_Data(GC10Data.System[400040], 0.01, 2),
      Freq_target: Scale_Data(GC10Data.MTE[410010], 0.01, 2),

      P_base_SS1: Scale_Data(GC10Data.System[400028], 1, 0),
      P_base_SS2: Scale_Data(GC10Data.System[400029], 1, 0),
      P_base_SS3: Scale_Data(GC10Data.System[400030], 1, 0),
      P_base_SS4: Scale_Data(GC10Data.System[400031], 1, 0),

      Q_base_SS1: Scale_Data(GC10Data.System[400056], 1, 0),
      Q_base_SS2: Scale_Data(GC10Data.System[400057], 1, 0),
      Q_base_SS3: Scale_Data(GC10Data.System[400058], 1, 0),
      Q_base_SS4: Scale_Data(GC10Data.System[400059], 1, 0),

      AutoMan_SS1: mapBitStatus(sysCtrl1_rBitS, sysCtrl_1_MT, 1),
      AutoMan_SS2: mapBitStatus(sysCtrl1_rBitS, sysCtrl_1_MT, 2),
      AutoMan_SS3: mapBitStatus(sysCtrl1_rBitS, sysCtrl_1_MT, 3),
      AutoMan_SS4: mapBitStatus(sysCtrl1_rBitS, sysCtrl_1_MT, 4),

      BMSPCSstatus_SS1: mapBitStatus(ss1_Status_rBitS, ss1_Status_MT, 3),
      BMSPCSstatus_SS2: mapBitStatus(ss2_Status_rBitS, ss234_Status_MT, 3),
      BMSPCSstatus_SS3: mapBitStatus(ss3_Status_rBitS, ss234_Status_MT, 3),
      BMSPCSstatus_SS4: mapBitStatus(ss4_Status_rBitS, ss234_Status_MT, 3),

      Avail_SS1: mapBitStatus(ss1_Status_rBitS, ss1_Status_MT, 4),
      Avail_SS2: mapBitStatus(ss2_Status_rBitS, ss234_Status_MT, 4),
      Avail_SS3: mapBitStatus(ss3_Status_rBitS, ss234_Status_MT, 4),
      Avail_SS4: mapBitStatus(ss4_Status_rBitS, ss234_Status_MT, 4),

      EdReg_SS1: mapBitStatus(ss1_Status_rBitS, ss1_Status_MT, 5),
      EdReg_SS2: mapBitStatus(ss2_Status_rBitS, ss234_Status_MT, 5),
      EdReg_SS3: mapBitStatus(ss3_Status_rBitS, ss234_Status_MT, 5),
      EdReg_SS4: mapBitStatus(ss4_Status_rBitS, ss234_Status_MT, 5)
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

router.get("/mode", (req, res) => {
  // 在這裡修改重定向的方式，可以直接將 URL 修改為 "/mode/sysctrl"
  // 如果需要傳遞額外資訊，可以使用查詢字串或 session 等機制
  res.redirect("/mode/sysctrl");
});

//系統模式控制頁面切換
router.get("/mode/sysctrl", async (req, res) => {
  try {
    await query_SysCtrl_KeyValuePairs();
    //console.log(SysCtrl_KeyValuePairs);

    res.render("Mode_SysCtrl", SysCtrl_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/mode/sysctrl/:data", async (req, res) => {
  try {
    await query_SysCtrl_KeyValuePairs();

    res.json(SysCtrl_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/************************************************************************************ */

router.post("/set_freqVsP_Data", async (req, res) => {
  try {
    const setV_Freq_raw = req.body.setValue_Freq;
    const setV_P_raw = req.body.setValue_P;

    let response;

    let check_num = 0;
    let i;

    for (i = 0; i < setV_Freq_raw.length; i++) {
      if (setV_Freq_raw[i] !== "" && !Number.isNaN(Number(setV_Freq_raw[i]))) {
        check_num++;
      }
    }
    for (i = 0; i < setV_P_raw.length; i++) {
      if (setV_P_raw[i] !== "" && !Number.isNaN(Number(setV_P_raw[i]))) {
        check_num++;
      }
    }

    if (check_num === 12) {
      const freq_scale = 0.01;
      const p_scale = 0.1;
      const freq_decPlace = 2;
      const p_decPlace = 1;

      let setV_Freq = [];
      let setV_P = [];

      setV_Freq[0] = Math.round(Number(setV_Freq_raw[0]) / freq_scale);
      setV_Freq[1] = Math.round(Number(setV_Freq_raw[1]) / freq_scale);
      setV_Freq[2] = Math.round(Number(setV_Freq_raw[2]) / freq_scale);
      setV_Freq[3] = Math.round(Number(setV_Freq_raw[3]) / freq_scale);
      setV_Freq[4] = Math.round(Number(setV_Freq_raw[4]) / freq_scale);
      setV_Freq[5] = Math.round(Number(setV_Freq_raw[5]) / freq_scale);
      setV_P[0] = Math.round(Number(setV_P_raw[0]) / p_scale);
      setV_P[1] = Math.round(Number(setV_P_raw[1]) / p_scale);
      setV_P[2] = Math.round(Number(setV_P_raw[2]) / p_scale);
      setV_P[3] = Math.round(Number(setV_P_raw[3]) / p_scale);
      setV_P[4] = Math.round(Number(setV_P_raw[4]) / p_scale);
      setV_P[5] = Math.round(Number(setV_P_raw[5]) / p_scale);

      const freq_minLimit = 5800;
      const freq_maxLimit = 6100;
      const p_minLimit = -1000;
      const p_maxLimit = 1000;

      for (i = 0; i < setV_Freq.length; i++) {
        if (setV_Freq[i] >= freq_minLimit && setV_Freq[i] <= freq_maxLimit) {
          check_num++;
        }
      }
      for (i = 0; i < setV_P.length; i++) {
        if (setV_P[i] >= p_minLimit && setV_P[i] <= p_maxLimit) {
          check_num++;
        }
      }

      if (check_num === 24) {
        // const dataPromises = databases.map(async (dbName) => {
        //   const nano = createNanoInstance(dbName);
        //   return getLatestDocument(nano);
        // });

        // const allData = await Promise.all(dataPromises);
        // const dwctrlData = allData[4];

        await dwctrlnanoDb.createIndex(indexDef);
        const dataGot = await dwctrlnanoDb.find(mangoQuery);
        const dwctrlData = dataGot.docs[0];
        const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));

        freqVsP_MT = {
          F_A: {
            dataID: "W400016",
            log_dataName: `Freq_A`,
            log_dataValue: setV_Freq[0],
            scale: freq_scale,
            decPlace: freq_decPlace,
            unit: "Hz"
          },
          F_B: {
            dataID: "W400017",
            log_dataName: `Freq_B`,
            log_dataValue: setV_Freq[1],
            scale: freq_scale,
            decPlace: freq_decPlace,
            unit: "Hz"
          },
          F_C: {
            dataID: "W400018",
            log_dataName: `Freq_C`,
            log_dataValue: setV_Freq[2],
            scale: freq_scale,
            decPlace: freq_decPlace,
            unit: "Hz"
          },
          F_D: {
            dataID: "W400019",
            log_dataName: `Freq_D`,
            log_dataValue: setV_Freq[3],
            scale: freq_scale,
            decPlace: freq_decPlace,
            unit: "Hz"
          },
          F_E: {
            dataID: "W400020",
            log_dataName: `Freq_E`,
            log_dataValue: setV_Freq[4],
            scale: freq_scale,
            decPlace: freq_decPlace,
            unit: "Hz"
          },
          F_F: {
            dataID: "W400021",
            log_dataName: `Freq_F`,
            log_dataValue: setV_Freq[5],
            scale: freq_scale,
            decPlace: freq_decPlace,
            unit: "Hz"
          },
          P_t: {
            dataID: "W400022",
            log_dataName: `P_t`,
            log_dataValue: setV_P[0],
            scale: p_scale,
            decPlace: p_decPlace,
            unit: "%"
          },
          P_u: {
            dataID: "W400023",
            log_dataName: `P_u`,
            log_dataValue: setV_P[1],
            scale: p_scale,
            decPlace: p_decPlace,
            unit: "%"
          },
          P_v: {
            dataID: "W400024",
            log_dataName: `P_v`,
            log_dataValue: setV_P[2],
            scale: p_scale,
            decPlace: p_decPlace,
            unit: "%"
          },
          P_w: {
            dataID: "W400025",
            log_dataName: `P_w`,
            log_dataValue: setV_P[3],
            scale: p_scale,
            decPlace: p_decPlace,
            unit: "%"
          },
          P_x: {
            dataID: "W400026",
            log_dataName: `P_x`,
            log_dataValue: setV_P[4],
            scale: p_scale,
            decPlace: p_decPlace,
            unit: "%"
          },
          P_y: {
            dataID: "W400027",
            log_dataName: `P_y`,
            log_dataValue: setV_P[5],
            scale: p_scale,
            decPlace: p_decPlace,
            unit: "%"
          }
        };

        newdwctrlData["system"]["W400016"] = setV_Freq[0];
        newdwctrlData["system"]["W400017"] = setV_Freq[1];
        newdwctrlData["system"]["W400018"] = setV_Freq[2];
        newdwctrlData["system"]["W400019"] = setV_Freq[3];
        newdwctrlData["system"]["W400020"] = setV_Freq[4];
        newdwctrlData["system"]["W400021"] = setV_Freq[5];
        newdwctrlData["system"]["W400022"] = setV_P[0];
        newdwctrlData["system"]["W400023"] = setV_P[1];
        newdwctrlData["system"]["W400024"] = setV_P[2];
        newdwctrlData["system"]["W400025"] = setV_P[3];
        newdwctrlData["system"]["W400026"] = setV_P[4];
        newdwctrlData["system"]["W400027"] = setV_P[5];

        //const accountDb = createNanoInstance("account");
        //存入資料庫的時區問題
        const currentDate = new Date();
        const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // Offset in milliseconds
        const localTime = new Date(currentDate - timezoneOffset);
        //const isoString = localTime.toISOString().replace("Z", "+08:00");
        const isoString = moment
          .utcOffset("+0800")
          .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

        // 刪除_id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
        newdwctrlData.time = isoString;
        delete newdwctrlData._id;
        delete newdwctrlData._rev;
        await nano.use("dwctrl").insert(newdwctrlData); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))

        //log紀錄
        const logDb = createNanoInstance("log");

        let doc = [];
        let log_dataValue = [];
        for (i = 0; i < Object.keys(freqVsP_MT).length; i++) {
          log_dataValue[i] = Scale_Data(
            freqVsP_MT[Object.keys(freqVsP_MT)[i]].log_dataValue,
            freqVsP_MT[Object.keys(freqVsP_MT)[i]].scale,
            freqVsP_MT[Object.keys(freqVsP_MT)[i]].decPlace
          );

          doc[i] = {
            tag: `system.${freqVsP_MT[Object.keys(freqVsP_MT)[i]].dataID}`,
            time: isoString,
            category: "系統模式10",
            device: "GC",
            username: "SE0008",
            content: `將${freqVsP_MT[Object.keys(freqVsP_MT)[i]].log_dataName}設為${log_dataValue[i]} ${freqVsP_MT[Object.keys(freqVsP_MT)[i]].unit}`
          };
          // console.log(doc[i]);

          let result = await logDb.insert(doc[i]); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))
        }

        response = { status: "ok", alertMessage: "NA" };
      } else {
        console.log("數值範圍有誤@@@###");
        response = { status: "error", alertMessage: "數值範圍有誤！" };
      }
    } else {
      console.log("數值型式有誤~~~!!!");
      response = { status: "error", alertMessage: "數值型式有誤！" };
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

/************************************************************************************ */

router.post("/get_socRef_Data", async (req, res) => {
  try {
    await GC10nanoDb.createIndex(indexDef);

    const dataGot = await GC10nanoDb.find(mangoQuery);

    const GC10Data = dataGot.docs[0];

    const response = {
      socMax: Scale_Data(GC10Data.System[400006], 0.1, 1),
      socMin: Scale_Data(GC10Data.System[400007], 0.1, 1),
      voltMax: Scale_Data(GC10Data.System[400008], 0.1, 1),
      voltMin: Scale_Data(GC10Data.System[400009], 0.1, 1),
      socUpperB: Scale_Data(GC10Data.System[400032], 0.1, 1),
      socLowerB: Scale_Data(GC10Data.System[400033], 0.1, 1),
      voltUpperB: Scale_Data(GC10Data.System[400034], 0.1, 1),
      voltLowerB: Scale_Data(GC10Data.System[400035], 0.1, 1)
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/set_socRef_Data", async (req, res) => {
  try {
    const setV_SOC_raw = req.body.setValue_SOC;
    const setV_Volt_raw = req.body.setValue_Volt;

    let response;

    let check_num = 0;
    let i;

    for (i = 0; i < setV_SOC_raw.length; i++) {
      if (setV_SOC_raw[i] !== "" && !Number.isNaN(Number(setV_SOC_raw[i]))) {
        check_num++;
      }
    }
    for (i = 0; i < setV_Volt_raw.length; i++) {
      if (setV_Volt_raw[i] !== "" && !Number.isNaN(Number(setV_Volt_raw[i]))) {
        check_num++;
      }
    }

    if (check_num === 8) {
      const soc_scale = 0.1;
      const volt_scale = 0.1;
      const soc_decPlace = 1;
      const volt_decPlace = 1;

      let setV_SOC = [];
      let setV_Volt = [];

      setV_SOC[0] = Math.round(Number(setV_SOC_raw[0]) / soc_scale);
      setV_SOC[1] = Math.round(Number(setV_SOC_raw[1]) / soc_scale);
      setV_SOC[2] = Math.round(Number(setV_SOC_raw[2]) / soc_scale);
      setV_SOC[3] = Math.round(Number(setV_SOC_raw[3]) / soc_scale);
      setV_Volt[0] = Math.round(Number(setV_Volt_raw[0]) / volt_scale);
      setV_Volt[1] = Math.round(Number(setV_Volt_raw[1]) / volt_scale);
      setV_Volt[2] = Math.round(Number(setV_Volt_raw[2]) / volt_scale);
      setV_Volt[3] = Math.round(Number(setV_Volt_raw[3]) / volt_scale);

      const soc_minLimit = 0;
      const soc_maxLimit = 1000;
      const volt_minLimit = 7000;
      const volt_maxLimit = 15000;

      for (i = 0; i < setV_SOC.length; i++) {
        if (setV_SOC[i] >= soc_minLimit && setV_SOC[i] <= soc_maxLimit) {
          check_num++;
        }
      }
      for (i = 0; i < setV_Volt.length; i++) {
        if (setV_Volt[i] >= volt_minLimit && setV_Volt[i] <= volt_maxLimit) {
          check_num++;
        }
      }

      if (check_num === 16) {
        await dwctrlnanoDb.createIndex(indexDef);
        const dataGot = await dwctrlnanoDb.find(mangoQuery);
        const dwctrlData = dataGot.docs[0];
        const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));

        socRef_MT = {
          SOC_MaxL: {
            dataID: "W400006",
            log_dataName: `SOC保護上限`,
            log_dataValue: setV_SOC[0],
            scale: soc_scale,
            decPlace: soc_decPlace,
            unit: "%"
          },
          SOC_MinL: {
            dataID: "W400007",
            log_dataName: `SOC保護下限`,
            log_dataValue: setV_SOC[1],
            scale: soc_scale,
            decPlace: soc_decPlace,
            unit: "%"
          },
          SOC_UB: {
            dataID: "W400032",
            log_dataName: `SOC理想範圍上限`,
            log_dataValue: setV_SOC[2],
            scale: soc_scale,
            decPlace: soc_decPlace,
            unit: "%"
          },
          SOC_LB: {
            dataID: "W400033",
            log_dataName: `SOC理想範圍下限`,
            log_dataValue: setV_SOC[3],
            scale: soc_scale,
            decPlace: soc_decPlace,
            unit: "%"
          },
          V_MaxL: {
            dataID: "W400008",
            log_dataName: `電壓保護上限`,
            log_dataValue: setV_Volt[0],
            scale: volt_scale,
            decPlace: volt_decPlace,
            unit: "V"
          },
          V_MinL: {
            dataID: "W400009",
            log_dataName: `電壓保護下限`,
            log_dataValue: setV_Volt[1],
            scale: volt_scale,
            decPlace: volt_decPlace,
            unit: "V"
          },
          V_UB: {
            dataID: "W400034",
            log_dataName: `電壓理想範圍上限`,
            log_dataValue: setV_Volt[2],
            scale: volt_scale,
            decPlace: volt_decPlace,
            unit: "V"
          },
          V_LB: {
            dataID: "W400035",
            log_dataName: `電壓理想範圍下限`,
            log_dataValue: setV_Volt[3],
            scale: volt_scale,
            decPlace: volt_decPlace,
            unit: "V"
          }
        };

        newdwctrlData["system"]["W400006"] = setV_SOC[0];
        newdwctrlData["system"]["W400007"] = setV_SOC[1];
        newdwctrlData["system"]["W400032"] = setV_SOC[2];
        newdwctrlData["system"]["W400033"] = setV_SOC[3];
        newdwctrlData["system"]["W400008"] = setV_Volt[0];
        newdwctrlData["system"]["W400009"] = setV_Volt[1];
        newdwctrlData["system"]["W400034"] = setV_Volt[2];
        newdwctrlData["system"]["W400035"] = setV_Volt[3];

        //const accountDb = createNanoInstance("account");
        //存入資料庫的時區問題
        const currentDate = new Date();
        const timezoneOffset = currentDate.getTimezoneOffset() * 60000; // Offset in milliseconds
        const localTime = new Date(currentDate - timezoneOffset);
        const isoString = localTime.toISOString().replace("Z", "+08:00");

        // 刪除_id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
        newdwctrlData.time = isoString;
        delete newdwctrlData._id;
        delete newdwctrlData._rev;
        await nano.use("dwctrl").insert(newdwctrlData); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))
        // console.log(newdwctrlData.system);

        //log紀錄
        const logDb = createNanoInstance("log");

        let doc = [];
        let log_dataValue = [];
        for (i = 0; i < Object.keys(socRef_MT).length; i++) {
          log_dataValue[i] = Scale_Data(
            socRef_MT[Object.keys(socRef_MT)[i]].log_dataValue,
            socRef_MT[Object.keys(socRef_MT)[i]].scale,
            socRef_MT[Object.keys(socRef_MT)[i]].decPlace
          );

          doc[i] = {
            tag: `system.${socRef_MT[Object.keys(socRef_MT)[i]].dataID}`,
            time: isoString,
            category: "系統模式11",
            device: "GC",
            username: "SE0008",
            content: `將${socRef_MT[Object.keys(socRef_MT)[i]].log_dataName}設為${log_dataValue[i]} ${socRef_MT[Object.keys(socRef_MT)[i]].unit}`
          };
          // console.log(doc[i]);

          let result = await logDb.insert(doc[i]); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))
        }

        response = { status: "ok", alertMessage: "NA" };
      } else {
        console.log("數值範圍有誤@@@###");
        response = { status: "error", alertMessage: "數值範圍有誤！" };
      }
    } else {
      console.log("數值型式有誤~~~!!!");
      response = { status: "error", alertMessage: "數值型式有誤！" };
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

/************************************************************************************ */
let Schd_KeyValuePairs;
let dateNumber = 0;
const date_MT = {
  0: { dicName: "Today", subTitle: "今日排程(", buttonContext: "明日排程" },
  1: { dicName: "Tomorrow", subTitle: "明日排程(", buttonContext: "今日排程" }
};

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
  10: { 0: "禁用", 1: "啟用" }
};

async function query_Schd_KeyValuePairs(req) {
  await GC10nanoDb.createIndex(indexDef);

  try {
    const result = await GC10nanoDb.find(mangoQuery);

    const GCData = result.docs[0];

    let rawDateTime_now = new Date();
    let rawDateTime_schd;
    let unixTime_now = Math.floor(rawDateTime_now.getTime() / 1000);

    if (dateNumber === 0) {
      rawDateTime_schd = rawDateTime_now;
    } else {
      rawDateTime_schd = new Date(
        rawDateTime_now.getTime() + 1000 * 60 * 60 * 24
      );
    }

    let yy = rawDateTime_schd.getFullYear();
    let mm = String(rawDateTime_schd.getMonth() + 1).padStart(2, "0");
    let dd = String(rawDateTime_schd.getDate()).padStart(2, "0");
    // let ss = String(rawDateTime_schd.getSeconds()).padStart(2, '0');

    const sysCtrl2_rBitS = Convert_UInt_to_revBitString(
      GCData.System[400077],
      16
    );

    Schd_KeyValuePairs = {
      // permission: "manager",
      permission: req.body.permission,

      use_P_schd: mapBitStatus(sysCtrl2_rBitS, sysCtrl_2_MT, 2),
      use_P_LS: mapBitStatus(sysCtrl2_rBitS, sysCtrl_2_MT, 3),
      use_SOC_ref: mapBitStatus(sysCtrl2_rBitS, sysCtrl_2_MT, 4),
      autoCal_SOC_ideal: mapBitStatus(sysCtrl2_rBitS, sysCtrl_2_MT, 5),
      use_MTE_P_96Q: mapBitStatus(sysCtrl2_rBitS, sysCtrl_2_MT, 6),
      use_MTE_API: mapBitStatus(sysCtrl2_rBitS, sysCtrl_2_MT, 7),
      use_Freq_Cmd: mapBitStatus(sysCtrl2_rBitS, sysCtrl_2_MT, 1),
      freqSource: mapBitStatus(sysCtrl2_rBitS, sysCtrl_2_MT, 0),
      Freq_test: Scale_Data(GCData.MTE[410001], 0.01, 2),

      exeCmd: Determine_status_of_exeCmd(
        unixTime_now,
        GCData.API[400989],
        GCData.API[400991]
      ),
      sbyCmd: Determine_status_of_sbyCmd(
        unixTime_now,
        GCData.API[400995],
        GCData.API[400997]
      ),
      exeCmd_StartDT: Convert_unixTime_to_dateTime(GCData.API[400989]),
      sbyCmd_StartDT: Convert_unixTime_to_dateTime(GCData.API[400995]),
      exeCmd_StopDT: Convert_unixTime_to_dateTime(GCData.API[400991]),
      sbyCmd_StopDT: Convert_unixTime_to_dateTime(GCData.API[400997]),
      exeCmd_P: Scale_Data(GCData.API[400993], 1, 0),
      sbyCmd_P: Scale_Data(GCData.API[400999], 1, 0),

      schdDate: `${date_MT[dateNumber].subTitle}${yy}/${mm}/${dd})`, // _@_${ss}
      goToAnotherDay: date_MT[dateNumber].buttonContext,

      P_schd_00_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401001],
        0.01,
        2
      ),
      P_schd_00_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401002],
        0.01,
        2
      ),
      P_schd_00_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401003],
        0.01,
        2
      ),
      P_schd_00_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401004],
        0.01,
        2
      ),
      P_schd_01_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401005],
        0.01,
        2
      ),
      P_schd_01_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401006],
        0.01,
        2
      ),
      P_schd_01_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401007],
        0.01,
        2
      ),
      P_schd_01_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401008],
        0.01,
        2
      ),
      P_schd_02_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401009],
        0.01,
        2
      ),
      P_schd_02_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401010],
        0.01,
        2
      ),
      P_schd_02_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401011],
        0.01,
        2
      ),
      P_schd_02_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401012],
        0.01,
        2
      ),
      P_schd_03_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401013],
        0.01,
        2
      ),
      P_schd_03_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401014],
        0.01,
        2
      ),
      P_schd_03_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401015],
        0.01,
        2
      ),
      P_schd_03_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401016],
        0.01,
        2
      ),
      P_schd_04_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401017],
        0.01,
        2
      ),
      P_schd_04_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401018],
        0.01,
        2
      ),
      P_schd_04_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401019],
        0.01,
        2
      ),
      P_schd_04_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401020],
        0.01,
        2
      ),
      P_schd_05_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401021],
        0.01,
        2
      ),
      P_schd_05_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401022],
        0.01,
        2
      ),
      P_schd_05_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401023],
        0.01,
        2
      ),
      P_schd_05_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401024],
        0.01,
        2
      ),
      P_schd_06_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401025],
        0.01,
        2
      ),
      P_schd_06_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401026],
        0.01,
        2
      ),
      P_schd_06_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401027],
        0.01,
        2
      ),
      P_schd_06_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401028],
        0.01,
        2
      ),
      P_schd_07_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401029],
        0.01,
        2
      ),
      P_schd_07_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401030],
        0.01,
        2
      ),
      P_schd_07_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401031],
        0.01,
        2
      ),
      P_schd_07_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401032],
        0.01,
        2
      ),
      P_schd_08_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401033],
        0.01,
        2
      ),
      P_schd_08_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401034],
        0.01,
        2
      ),
      P_schd_08_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401035],
        0.01,
        2
      ),
      P_schd_08_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401036],
        0.01,
        2
      ),
      P_schd_09_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401037],
        0.01,
        2
      ),
      P_schd_09_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401038],
        0.01,
        2
      ),
      P_schd_09_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401039],
        0.01,
        2
      ),
      P_schd_09_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401040],
        0.01,
        2
      ),
      P_schd_10_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401041],
        0.01,
        2
      ),
      P_schd_10_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401042],
        0.01,
        2
      ),
      P_schd_10_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401043],
        0.01,
        2
      ),
      P_schd_10_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401044],
        0.01,
        2
      ),
      P_schd_11_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401045],
        0.01,
        2
      ),
      P_schd_11_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401046],
        0.01,
        2
      ),
      P_schd_11_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401047],
        0.01,
        2
      ),
      P_schd_11_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401048],
        0.01,
        2
      ),
      P_schd_12_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401049],
        0.01,
        2
      ),
      P_schd_12_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401050],
        0.01,
        2
      ),
      P_schd_12_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401051],
        0.01,
        2
      ),
      P_schd_12_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401052],
        0.01,
        2
      ),
      P_schd_13_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401053],
        0.01,
        2
      ),
      P_schd_13_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401054],
        0.01,
        2
      ),
      P_schd_13_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401055],
        0.01,
        2
      ),
      P_schd_13_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401056],
        0.01,
        2
      ),
      P_schd_14_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401057],
        0.01,
        2
      ),
      P_schd_14_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401058],
        0.01,
        2
      ),
      P_schd_14_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401059],
        0.01,
        2
      ),
      P_schd_14_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401060],
        0.01,
        2
      ),
      P_schd_15_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401061],
        0.01,
        2
      ),
      P_schd_15_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401062],
        0.01,
        2
      ),
      P_schd_15_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401063],
        0.01,
        2
      ),
      P_schd_15_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401064],
        0.01,
        2
      ),
      P_schd_16_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401065],
        0.01,
        2
      ),
      P_schd_16_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401066],
        0.01,
        2
      ),
      P_schd_16_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401067],
        0.01,
        2
      ),
      P_schd_16_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401068],
        0.01,
        2
      ),
      P_schd_17_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401069],
        0.01,
        2
      ),
      P_schd_17_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401070],
        0.01,
        2
      ),
      P_schd_17_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401071],
        0.01,
        2
      ),
      P_schd_17_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401072],
        0.01,
        2
      ),
      P_schd_18_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401073],
        0.01,
        2
      ),
      P_schd_18_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401074],
        0.01,
        2
      ),
      P_schd_18_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401075],
        0.01,
        2
      ),
      P_schd_18_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401076],
        0.01,
        2
      ),
      P_schd_19_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401077],
        0.01,
        2
      ),
      P_schd_19_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401078],
        0.01,
        2
      ),
      P_schd_19_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401079],
        0.01,
        2
      ),
      P_schd_19_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401080],
        0.01,
        2
      ),
      P_schd_20_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401081],
        0.01,
        2
      ),
      P_schd_20_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401082],
        0.01,
        2
      ),
      P_schd_20_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401083],
        0.01,
        2
      ),
      P_schd_20_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401084],
        0.01,
        2
      ),
      P_schd_21_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401085],
        0.01,
        2
      ),
      P_schd_21_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401086],
        0.01,
        2
      ),
      P_schd_21_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401087],
        0.01,
        2
      ),
      P_schd_21_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401088],
        0.01,
        2
      ),
      P_schd_22_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401089],
        0.01,
        2
      ),
      P_schd_22_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401090],
        0.01,
        2
      ),
      P_schd_22_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401091],
        0.01,
        2
      ),
      P_schd_22_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401092],
        0.01,
        2
      ),
      P_schd_23_0: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401093],
        0.01,
        2
      ),
      P_schd_23_1: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401094],
        0.01,
        2
      ),
      P_schd_23_2: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401095],
        0.01,
        2
      ),
      P_schd_23_3: Scale_Data(
        GCData.Schedule[date_MT[dateNumber].dicName][401096],
        0.01,
        2
      ),

      P_cmd_00_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400201],
        1,
        0
      ),
      P_cmd_00_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400203],
        1,
        0
      ),
      P_cmd_00_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400205],
        1,
        0
      ),
      P_cmd_00_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400207],
        1,
        0
      ),
      P_cmd_01_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400209],
        1,
        0
      ),
      P_cmd_01_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400211],
        1,
        0
      ),
      P_cmd_01_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400213],
        1,
        0
      ),
      P_cmd_01_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400215],
        1,
        0
      ),
      P_cmd_02_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400217],
        1,
        0
      ),
      P_cmd_02_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400219],
        1,
        0
      ),
      P_cmd_02_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400221],
        1,
        0
      ),
      P_cmd_02_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400223],
        1,
        0
      ),
      P_cmd_03_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400225],
        1,
        0
      ),
      P_cmd_03_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400227],
        1,
        0
      ),
      P_cmd_03_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400229],
        1,
        0
      ),
      P_cmd_03_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400231],
        1,
        0
      ),
      P_cmd_04_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400233],
        1,
        0
      ),
      P_cmd_04_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400235],
        1,
        0
      ),
      P_cmd_04_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400237],
        1,
        0
      ),
      P_cmd_04_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400239],
        1,
        0
      ),
      P_cmd_05_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400241],
        1,
        0
      ),
      P_cmd_05_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400243],
        1,
        0
      ),
      P_cmd_05_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400245],
        1,
        0
      ),
      P_cmd_05_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400247],
        1,
        0
      ),
      P_cmd_06_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400249],
        1,
        0
      ),
      P_cmd_06_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400251],
        1,
        0
      ),
      P_cmd_06_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400253],
        1,
        0
      ),
      P_cmd_06_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400255],
        1,
        0
      ),
      P_cmd_07_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400257],
        1,
        0
      ),
      P_cmd_07_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400259],
        1,
        0
      ),
      P_cmd_07_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400261],
        1,
        0
      ),
      P_cmd_07_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400263],
        1,
        0
      ),
      P_cmd_08_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400265],
        1,
        0
      ),
      P_cmd_08_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400267],
        1,
        0
      ),
      P_cmd_08_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400269],
        1,
        0
      ),
      P_cmd_08_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400271],
        1,
        0
      ),
      P_cmd_09_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400273],
        1,
        0
      ),
      P_cmd_09_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400275],
        1,
        0
      ),
      P_cmd_09_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400277],
        1,
        0
      ),
      P_cmd_09_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400279],
        1,
        0
      ),
      P_cmd_10_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400281],
        1,
        0
      ),
      P_cmd_10_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400283],
        1,
        0
      ),
      P_cmd_10_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400285],
        1,
        0
      ),
      P_cmd_10_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400287],
        1,
        0
      ),
      P_cmd_11_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400289],
        1,
        0
      ),
      P_cmd_11_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400291],
        1,
        0
      ),
      P_cmd_11_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400293],
        1,
        0
      ),
      P_cmd_11_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400295],
        1,
        0
      ),
      P_cmd_12_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400297],
        1,
        0
      ),
      P_cmd_12_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400299],
        1,
        0
      ),
      P_cmd_12_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400301],
        1,
        0
      ),
      P_cmd_12_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400303],
        1,
        0
      ),
      P_cmd_13_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400305],
        1,
        0
      ),
      P_cmd_13_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400307],
        1,
        0
      ),
      P_cmd_13_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400309],
        1,
        0
      ),
      P_cmd_13_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400311],
        1,
        0
      ),
      P_cmd_14_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400313],
        1,
        0
      ),
      P_cmd_14_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400315],
        1,
        0
      ),
      P_cmd_14_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400317],
        1,
        0
      ),
      P_cmd_14_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400319],
        1,
        0
      ),
      P_cmd_15_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400321],
        1,
        0
      ),
      P_cmd_15_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400323],
        1,
        0
      ),
      P_cmd_15_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400325],
        1,
        0
      ),
      P_cmd_15_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400327],
        1,
        0
      ),
      P_cmd_16_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400329],
        1,
        0
      ),
      P_cmd_16_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400331],
        1,
        0
      ),
      P_cmd_16_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400333],
        1,
        0
      ),
      P_cmd_16_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400335],
        1,
        0
      ),
      P_cmd_17_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400337],
        1,
        0
      ),
      P_cmd_17_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400339],
        1,
        0
      ),
      P_cmd_17_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400341],
        1,
        0
      ),
      P_cmd_17_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400343],
        1,
        0
      ),
      P_cmd_18_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400345],
        1,
        0
      ),
      P_cmd_18_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400347],
        1,
        0
      ),
      P_cmd_18_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400349],
        1,
        0
      ),
      P_cmd_18_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400351],
        1,
        0
      ),
      P_cmd_19_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400353],
        1,
        0
      ),
      P_cmd_19_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400355],
        1,
        0
      ),
      P_cmd_19_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400357],
        1,
        0
      ),
      P_cmd_19_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400359],
        1,
        0
      ),
      P_cmd_20_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400361],
        1,
        0
      ),
      P_cmd_20_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400363],
        1,
        0
      ),
      P_cmd_20_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400365],
        1,
        0
      ),
      P_cmd_20_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400367],
        1,
        0
      ),
      P_cmd_21_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400369],
        1,
        0
      ),
      P_cmd_21_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400371],
        1,
        0
      ),
      P_cmd_21_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400373],
        1,
        0
      ),
      P_cmd_21_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400375],
        1,
        0
      ),
      P_cmd_22_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400377],
        1,
        0
      ),
      P_cmd_22_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400379],
        1,
        0
      ),
      P_cmd_22_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400381],
        1,
        0
      ),
      P_cmd_22_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400383],
        1,
        0
      ),
      P_cmd_23_0: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400385],
        1,
        0
      ),
      P_cmd_23_1: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400387],
        1,
        0
      ),
      P_cmd_23_2: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400389],
        1,
        0
      ),
      P_cmd_23_3: Scale_Data(
        GCData.API[date_MT[dateNumber].dicName][400391],
        1,
        0
      ),

      socRef_00_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400393]
      ),
      socRef_00_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400395]
      ),
      socRef_00_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400397]
      ),
      socRef_00_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400399]
      ),
      socRef_01_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400401]
      ),
      socRef_01_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400403]
      ),
      socRef_01_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400405]
      ),
      socRef_01_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400407]
      ),
      socRef_02_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400409]
      ),
      socRef_02_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400411]
      ),
      socRef_02_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400413]
      ),
      socRef_02_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400415]
      ),
      socRef_03_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400417]
      ),
      socRef_03_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400419]
      ),
      socRef_03_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400421]
      ),
      socRef_03_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400423]
      ),
      socRef_04_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400425]
      ),
      socRef_04_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400427]
      ),
      socRef_04_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400429]
      ),
      socRef_04_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400431]
      ),
      socRef_05_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400433]
      ),
      socRef_05_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400435]
      ),
      socRef_05_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400437]
      ),
      socRef_05_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400439]
      ),
      socRef_06_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400441]
      ),
      socRef_06_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400443]
      ),
      socRef_06_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400445]
      ),
      socRef_06_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400447]
      ),
      socRef_07_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400449]
      ),
      socRef_07_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400451]
      ),
      socRef_07_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400453]
      ),
      socRef_07_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400455]
      ),
      socRef_08_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400457]
      ),
      socRef_08_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400459]
      ),
      socRef_08_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400461]
      ),
      socRef_08_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400463]
      ),
      socRef_09_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400465]
      ),
      socRef_09_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400467]
      ),
      socRef_09_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400469]
      ),
      socRef_09_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400471]
      ),
      socRef_10_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400473]
      ),
      socRef_10_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400475]
      ),
      socRef_10_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400477]
      ),
      socRef_10_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400479]
      ),
      socRef_11_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400481]
      ),
      socRef_11_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400483]
      ),
      socRef_11_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400485]
      ),
      socRef_11_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400487]
      ),
      socRef_12_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400489]
      ),
      socRef_12_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400491]
      ),
      socRef_12_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400493]
      ),
      socRef_12_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400495]
      ),
      socRef_13_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400497]
      ),
      socRef_13_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400499]
      ),
      socRef_13_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400501]
      ),
      socRef_13_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400503]
      ),
      socRef_14_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400505]
      ),
      socRef_14_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400507]
      ),
      socRef_14_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400509]
      ),
      socRef_14_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400511]
      ),
      socRef_15_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400513]
      ),
      socRef_15_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400515]
      ),
      socRef_15_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400517]
      ),
      socRef_15_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400519]
      ),
      socRef_16_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400521]
      ),
      socRef_16_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400523]
      ),
      socRef_16_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400525]
      ),
      socRef_16_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400527]
      ),
      socRef_17_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400529]
      ),
      socRef_17_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400531]
      ),
      socRef_17_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400533]
      ),
      socRef_17_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400535]
      ),
      socRef_18_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400537]
      ),
      socRef_18_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400539]
      ),
      socRef_18_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400541]
      ),
      socRef_18_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400543]
      ),
      socRef_19_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400545]
      ),
      socRef_19_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400547]
      ),
      socRef_19_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400549]
      ),
      socRef_19_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400551]
      ),
      socRef_20_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400553]
      ),
      socRef_20_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400555]
      ),
      socRef_20_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400557]
      ),
      socRef_20_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400559]
      ),
      socRef_21_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400561]
      ),
      socRef_21_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400563]
      ),
      socRef_21_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400565]
      ),
      socRef_21_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400567]
      ),
      socRef_22_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400569]
      ),
      socRef_22_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400571]
      ),
      socRef_22_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400573]
      ),
      socRef_22_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400575]
      ),
      socRef_23_0: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400577]
      ),
      socRef_23_1: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400579]
      ),
      socRef_23_2: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400581]
      ),
      socRef_23_3: Convert_socRef_kWh_to_pct(
        GCData.API[date_MT[dateNumber].dicName][400583]
      )
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

router.get("/mode/schedule", async (req, res) => {
  try {
    await query_Schd_KeyValuePairs(req);
    //console.log(Schd_KeyValuePairs);

    res.render("Mode_Schedule", Schd_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/mode/schedule/:data", async (req, res) => {
  try {
    await query_Schd_KeyValuePairs(req);

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

    await query_Schd_KeyValuePairs(req);

    const response = {
      dateNumber: dateNumber,
      KVPairs: Schd_KeyValuePairs
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

/************************************************************************************ */

let Date_of_Schd_set = "Today";

router.post("/record_Date_of_Schedule_to_be_set", async (req, res) => {
  try {
    const Date_of_Schedule_set = req.body.Date_of_Schedule_set.slice(0, 4);
    console.log(req.body.Date_of_Schedule_set);
    console.log(Date_of_Schedule_set);

    if (Date_of_Schedule_set === "明日排程") {
      Date_of_Schd_set = "Tomorrow";
    } else {
      Date_of_Schd_set = "Today";
    }

    res.json(Date_of_Schd_set);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


router.post("/set_Schedule_Data", async (req, res) => {
  try {
    const setV_P_schd_raw = req.body.setValue_P_schd;
    const setV_P_cmd_raw = req.body.setValue_P_cmd;

    let response;

    let check_num = 0;
    let i;

    for (i = 0; i < setV_P_schd_raw.length; i++) {
      if (setV_P_schd_raw[i] !== "" && !Number.isNaN(Number(setV_P_schd_raw[i]))) {
        check_num++;
      }
      if (setV_P_cmd_raw[i] !== "" && !Number.isNaN(Number(setV_P_cmd_raw[i]))) {
        check_num++;
      }
    }
    console.log(check_num);

    if (check_num === 192) {
      const P_schd_scale = 0.01;
      const P_cmd_scale = 1;

      let setV_P_schd = [];
      let setV_P_cmd = [];

      for (i = 0; i < setV_P_schd_raw.length; i++) {
        setV_P_schd.push(Math.round(Number(setV_P_schd_raw[i]) / P_schd_scale));
        setV_P_cmd.push(Math.round(Number(setV_P_cmd_raw[i]) / P_cmd_scale));
      }

      const P_schd_minLimit = 0;
      const P_schd_maxLimit = 1000;
      const P_cmd_minLimit = -10000;
      const P_cmd_maxLimit = 10000;

      for (i = 0; i < setV_P_schd.length; i++) {
        if (setV_P_schd[i] >= P_schd_minLimit && setV_P_schd[i] <= P_schd_maxLimit) {
          check_num++;
        }
        if (setV_P_cmd[i] >= P_cmd_minLimit && setV_P_cmd[i] <= P_cmd_maxLimit) {
          check_num++;
        }
      }
      console.log(check_num);

      if (check_num === 384) {
        await dwctrlnanoDb.createIndex(indexDef);
        const dataGot = await dwctrlnanoDb.find(mangoQuery);
        const dwctrlData = dataGot.docs[0];
        const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));

        for (i = 0; i < setV_P_schd.length; i++) {
          newdwctrlData["schedule"][Date_of_Schd_set]["W" + (401001 + i)] = setV_P_schd[i];
          newdwctrlData["API"][Date_of_Schd_set]["W" + (400201 + i * 2)] = setV_P_cmd[i];
        }

        //const accountDb = createNanoInstance("account");
        const logTime = get_Log_Time();

        // 刪除_id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
        newdwctrlData.time = logTime;
        delete newdwctrlData._id;
        delete newdwctrlData._rev;
        await nano.use("dwctrl").insert(newdwctrlData); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))
        // console.log(newdwctrlData.API);
        // console.log(newdwctrlData.schedule);

        //log紀錄
        const logDb = createNanoInstance("log");

        let schedule_MT = { Today: "今日排程", Tomorrow: "明日排程" };

        const doc = {
          tag: `schedule.${Date_of_Schd_set} & API.${Date_of_Schd_set}`,
          time: logTime,
          category: "系統模式12",
          device: "GC",
          username: req.body.id,
          //username: "SE0008"
          content: `修改${schedule_MT[Date_of_Schd_set]}得標量、電能移轉量設定值`
        };
        // console.log(doc);

        const result = await logDb.insert(doc); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))

        response = { status: "ok", alertMessage: "NA" };
      } else {
        console.log("數值範圍有誤@@@###");
        response = { status: "error", alertMessage: "數值範圍有誤！" };
      }
    } else {
      console.log("數值型式有誤~~~!!!");
      response = { status: "error", alertMessage: "數值型式有誤！" };
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

/************************************************************************************ */

module.exports = router;
// app.listen(port, () => {
//   console.log(`mode.js 應用程式正在監聽端口 ${port}`);
// });
