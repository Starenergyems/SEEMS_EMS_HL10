const express = require("express");
const path = require("path");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const other_rf01 = "other_rf01";
const other_rf10 = "other_rf10";
const rf01Db = nano.use(other_rf01);
const rf10Db = nano.use(other_rf10);
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");

const {
  scaleProcess,
  Scale_Data,
  Determine_statusL_of_VCB,
  Determine_statusL_of_ACB,
  Determine_DL_of_AlarmWord,
  Determine_DL_of_AlarmWords,
  Determine_statusL_of_recloser,
  Calculate_Tr_oilTemp,
  Calculate_N1450_PF,
  Convert_UInt_to_revBitString,
  Calculate_CPM10_energy,
  Convert_UInt_to_BitString,
  get_Log_Time
} = require("./function");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public"))); // "/public",
app.use(cors());

/************************************************************************************ */

const dwctrl = "dwctrl";
const dwctrlnanoDb = nano.use(dwctrl);

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

// 定義 CouchDB 資料庫名稱
const databases = [
  "other_rf10", //0
  "other_rf01" //1
];

// 創建 Nano 實例的函式
// const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);
const createNanoInstance = (dbName) => nano.db.use(dbName);
// 設定index
const getLatestDocument = async (nanoDb) => {
  const indexDef = {
    index: { fields: ["time"] },
    name: "time_index"
  };

  //建立index
  await nanoDb.createIndex(indexDef);

  //利用mango作為篩選器
  const mangoQuery = {
    selector: {
      time: { $exists: true }
    },
    sort: [{ time: "desc" }],
    limit: 1
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
/************************************************************************************ */
let SLD_KeyValuePairs;
let num_RelayVCB = 2;
const relayVCB_MT = {
  1: { dicName: "RelayVCB1", pUW_title: "VCB盤1保護電驛" },
  2: { dicName: "RelayVCB2", pUW_title: "VCB盤2保護電驛" },
  3: { dicName: "RelayVCB3", pUW_title: "VCB盤3保護電驛" },
  4: { dicName: "RelayVCB4", pUW_title: "VCB盤4保護電驛" },
  5: { dicName: "RelayVCB5", pUW_title: "輔電VCB盤保護電驛" }
};

async function query_SLD_KeyValuePairs(req) {
  // 使用 map 遍歷所有資料庫名稱，創建 Nano 實例，並獲取最新文檔的 promise 陣列
  const dataPromises = databases.map(async (dbName) => {
    const nanoDb = createNanoInstance(dbName);
    return getLatestDocument(nanoDb);
  });

  const allData = await Promise.all(dataPromises); //取得所有資料庫的數值 存在陣列裡面 由零開始
  const other10Data = allData[0];
  const other01Data = allData[1];

  const MVCB_rBitS = Convert_UInt_to_revBitString(other10Data.VCBStatus0[408205], 16);
  const VCB1_rBitS = Convert_UInt_to_revBitString(other10Data.VCBStatus1[408205], 16);
  const VCB2_rBitS = Convert_UInt_to_revBitString(other10Data.VCBStatus2[408205], 16);
  const VCB3_rBitS = Convert_UInt_to_revBitString(other10Data.VCBStatus3[408205], 16);
  const VCB4_rBitS = Convert_UInt_to_revBitString(other10Data.VCBStatus4[408205], 16);
  const VCB_aux_rBitS = Convert_UInt_to_revBitString(other10Data.VCBStatus5[408205], 16);
  const ACB1_rBitS = Convert_UInt_to_revBitString(other10Data.ACBStatus1[408206], 16);
  const ACB2_rBitS = Convert_UInt_to_revBitString(other10Data.ACBStatus2[408206], 16);
  const ACB3_rBitS = Convert_UInt_to_revBitString(other10Data.ACBStatus3[408206], 16);
  const ACB4_rBitS = Convert_UInt_to_revBitString(other10Data.ACBStatus4[408206], 16);

  SLD_KeyValuePairs = {
    // permission: "manager",
    permission: req.body.permission,

    statusL_of_MVCB: Determine_statusL_of_VCB(MVCB_rBitS[0], MVCB_rBitS[1], MVCB_rBitS[2]),
    statusL_of_VCB1: Determine_statusL_of_VCB(VCB1_rBitS[0], VCB1_rBitS[1], VCB1_rBitS[2]),
    statusL_of_VCB2: Determine_statusL_of_VCB(VCB2_rBitS[0], VCB2_rBitS[1], VCB2_rBitS[2]),
    statusL_of_VCB3: Determine_statusL_of_VCB(VCB3_rBitS[0], VCB3_rBitS[1], VCB3_rBitS[2]),
    statusL_of_VCB4: Determine_statusL_of_VCB(VCB4_rBitS[0], VCB4_rBitS[1], VCB4_rBitS[2]),
    statusL_of_VCB_aux: Determine_statusL_of_VCB(VCB_aux_rBitS[0], VCB_aux_rBitS[1], VCB_aux_rBitS[2]),

    statusL_of_ACB1_1: Determine_statusL_of_ACB(ACB1_rBitS[0], ACB1_rBitS[1]),
    statusL_of_ACB1_2: Determine_statusL_of_ACB(ACB1_rBitS[2], ACB1_rBitS[3]),
    statusL_of_ACB1_3: Determine_statusL_of_ACB(ACB1_rBitS[4], ACB1_rBitS[5]),
    statusL_of_ACB2_1: Determine_statusL_of_ACB(ACB2_rBitS[0], ACB2_rBitS[1]),
    statusL_of_ACB2_2: Determine_statusL_of_ACB(ACB2_rBitS[2], ACB2_rBitS[3]),
    statusL_of_ACB2_3: Determine_statusL_of_ACB(ACB2_rBitS[4], ACB2_rBitS[5]),
    statusL_of_ACB3_1: Determine_statusL_of_ACB(ACB3_rBitS[0], ACB3_rBitS[1]),
    statusL_of_ACB3_2: Determine_statusL_of_ACB(ACB3_rBitS[2], ACB3_rBitS[3]),
    statusL_of_ACB3_3: Determine_statusL_of_ACB(ACB3_rBitS[4], ACB3_rBitS[5]),
    statusL_of_ACB4_1: Determine_statusL_of_ACB(ACB4_rBitS[0], ACB4_rBitS[1]),

    statusL_of_relayMVCB: Determine_DL_of_AlarmWords([other10Data.RelayMVCB[408200], other10Data.RelayMVCB[408201], other10Data.RelayMVCB[408202]]),
    relayMVCB_S0: Convert_UInt_to_revBitString(other10Data.RelayMVCB[408200], 16),
    relayMVCB_S1: Convert_UInt_to_revBitString(other10Data.RelayMVCB[408201], 16),
    relayMVCB_S2: Convert_UInt_to_revBitString(other10Data.RelayMVCB[408202], 16),

    statusL_of_relayVCB1: Determine_DL_of_AlarmWord(other10Data.RelayVCB1[408203]),
    statusL_of_relayVCB2: Determine_DL_of_AlarmWord(other10Data.RelayVCB2[408203]),
    statusL_of_relayVCB3: Determine_DL_of_AlarmWord(other10Data.RelayVCB3[408203]),
    statusL_of_relayVCB4: Determine_DL_of_AlarmWord(other10Data.RelayVCB4[408203]),
    statusL_of_relayVCB_aux: Determine_DL_of_AlarmWord(other10Data.RelayVCB5[408203]),
    relayVCB: Convert_UInt_to_revBitString(other10Data[relayVCB_MT[num_RelayVCB].dicName][408203], 16),

    statusL_of_recloser: Determine_statusL_of_recloser(other10Data.Recloser[408210], other10Data.Recloser[408209]),
    recloserMode: Convert_UInt_to_revBitString(other10Data.Recloser[408208], 16),
    recloserStatus: Convert_UInt_to_revBitString(other10Data.Recloser[408210], 16),
    recloserRelay: Convert_UInt_to_revBitString(other10Data.Recloser[408209], 16),

    temp_TR1: Calculate_Tr_oilTemp(other10Data.TR1[408181]),
    temp_TR2: Calculate_Tr_oilTemp(other10Data.TR2[408181]),
    temp_TR3: Calculate_Tr_oilTemp(other10Data.TR3[408181]),
    temp_TR4: Calculate_Tr_oilTemp(other10Data.TR4[408181]),
    temp_TR_aux: Calculate_Tr_oilTemp(other10Data.TR5[408181]),

    V_Freq: Scale_Data(other01Data.Freq[408007], ((1 / 65536) * 100) / 1000, 3),
    I_Freq: Scale_Data(other01Data.Freq[408017], (1 / 65536) * 200, 2),
    P_Freq: Scale_Data(other01Data.Freq[408019], ((1 / 65536) * 100 * 200) / 1000, 1),
    Q_Freq: Scale_Data(other01Data.Freq[408021], ((1 / 65536) * 100 * 200) / 1000, 1),
    V_ab_Freq: Scale_Data(other01Data.Freq[408001], ((1 / 65536) * 100) / 1000, 3),
    V_bc_Freq: Scale_Data(other01Data.Freq[408003], ((1 / 65536) * 100) / 1000, 3),
    V_ca_Freq: Scale_Data(other01Data.Freq[408005], ((1 / 65536) * 100) / 1000, 3),
    I_a_Freq: Scale_Data(other01Data.Freq[408009], (1 / 65536) * 200, 2),
    I_b_Freq: Scale_Data(other01Data.Freq[408011], (1 / 65536) * 200, 2),
    I_c_Freq: Scale_Data(other01Data.Freq[408013], (1 / 65536) * 200, 2),
    S_Freq: Scale_Data(other01Data.Freq[408023], ((1 / 65536) * 100 * 200) / 1000, 1),
    PF_Freq: Calculate_N1450_PF(other01Data.Freq[408025]),
    Freq_Freq: Scale_Data(other01Data.Freq[408026], 1 / 65536, 3),
    AE_imp_Freq: Scale_Data(other01Data.Freq[408028], 0.1, 1),
    AE_exp_Freq: Scale_Data(other01Data.Freq[408030], 0.1, 1),
    RE_imp_Freq: Scale_Data(other01Data.Freq[408032], 0.1, 1),
    RE_exp_Freq: Scale_Data(other01Data.Freq[408034], 0.1, 1)
  };
}

router.get("/operateinfo", (req, res) => {
  // num與fun
  res.redirect("/operateinfo/singlelinediagram");
});

router.get("/operateinfo/singlelinediagram", async (req, res) => {
  try {
    await query_SLD_KeyValuePairs(req);
    //console.log(SLD_KeyValuePairs);

    res.render("Op_Meter_SLD", SLD_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/singlelinediagram/:data", async (req, res) => {
  try {
    await query_SLD_KeyValuePairs(req);

    res.json(SLD_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/************************************************************************************ */

router.post("/change_num_of_RelayVCB", async (req, res) => {
  try {
    //console.log("接收到前端請求");
    num_RelayVCB = req.body.num_of_RelayVCB;
    //console.log(num_RelayVCB);

    await query_SLD_KeyValuePairs(req);

    const response = {
      title_of_pUW: relayVCB_MT[num_RelayVCB].pUW_title,
      relayVCB_revBitString: SLD_KeyValuePairs.relayVCB
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

let num_CB;

router.post("/record_num_of_CB", async (req, res) => {
  try {
    num_CB = req.body.num_of_CB;
    console.log(num_CB);

    const response = "status = ok~";

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/set_CB_Data", async (req, res) => {
  try {
    const setBit_raw = req.body.setValue;

    const CB_group = `ACB${num_CB[0]}`;
    const setBit = (Number(num_CB[2]) - 1) * 2 + Number(setBit_raw);

    await dwctrlnanoDb.createIndex(indexDef);
    const dataGot = await dwctrlnanoDb.find(mangoQuery);
    const dwctrlData = dataGot.docs[0];
    const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));

    let setValue;

    let setValue_old = Convert_UInt_to_BitString(newdwctrlData[CB_group].W408207, 32).bitString;
    console.log(setValue_old);
    setValue_old = setValue_old.slice(0, 31 - setBit) + "1" + setValue_old.slice(31 - setBit + 1);
    console.log(setValue_old);
    setValue = parseInt(setValue_old, 2);

    console.log(setValue);
    newdwctrlData[CB_group].W408207 = setValue;

    //const accountDb = createNanoInstance("account");
    const logTime = get_Log_Time();

    // 刪除_id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
    newdwctrlData.time = logTime;
    delete newdwctrlData._id;
    delete newdwctrlData._rev;
    await nano.use("dwctrl").insert(newdwctrlData); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))

    //log紀錄
    const logDb = createNanoInstance("log");

    const data_MT = { 0: "投入", 1: "切離" };

    const doc = {
      tag: `${CB_group}.W408207`,
      time: logTime,
      category: "設備控制01",
      device: `ACB${num_CB}`,
      username: req.body.id,
      content: `將ACB${num_CB}${data_MT[setBit_raw]}`
    };
    console.log(doc);

    // if (selectedValue != 0) {
    const result = await logDb.insert(doc); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))
    //console.log(result);
    // }

    //console.log("Document added to database. ID: " + result.id);

    setTimeout(function () { reset_CB_Data(CB_group, setBit); }, 2000);

    let response = { status: "ok", alarmCMU_rawD: 314159, faultCMU_rawD: 6626, DL_of_statusHW: 1602 };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

async function reset_CB_Data(CB_group, setBit) {
  console.log("執行reset_CB_Data!!!");

  await dwctrlnanoDb.createIndex(indexDef);
  const dataGot = await dwctrlnanoDb.find(mangoQuery);
  const dwctrlData = dataGot.docs[0];
  const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));

  let setValue;

  let setValue_old = Convert_UInt_to_BitString(newdwctrlData[CB_group].W408207, 32).bitString;
  console.log(setValue_old);
  setValue_old = setValue_old.slice(0, 31 - setBit) + "0" + setValue_old.slice(31 - setBit + 1);
  console.log(setValue_old);
  setValue = parseInt(setValue_old, 2);

  console.log(setValue);
  newdwctrlData[CB_group].W408207 = setValue;

  //const accountDb = createNanoInstance("account");
  const logTime = get_Log_Time();

  // 刪除_id 屬性，CouchDB 會自動生成 且更新時間為目前電腦系統時間
  newdwctrlData.time = logTime;
  delete newdwctrlData._id;
  delete newdwctrlData._rev;
  await nano.use("dwctrl").insert(newdwctrlData); // ~~~~~~!!!!!!!!@@@@@@@@@@@@@########$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&*********((((((((()))))))))
}

/************************************************************************************ */

// router.get("/operateinfo/mainmeter", async (req, res) => {
//   try {
//     const indexDef = {
//       index: { fields: ["time"] },
//       name: "time_index",
//     };
//     await rf01Db.createIndex(indexDef);

//     const mangoQuery = {
//       selector: {
//         time: { $exists: true },
//       },
//       sort: [{ time: "desc" }],
//       limit: 1,
//     };

//     rf01Db.find(mangoQuery, async (err, body) => {
//       if (err) {
//         console.error("Error:", err);
//         res.status(500).send("Internal Server Error");
//         return;
//       }

//       const other1Data = body.docs[0]; // 取得數據的第一個元素
//       //console.log("AA----------------------------------------------AA");
//       //console.log(other1Data);

//       const scaleAndPointMapping = {
//         408001: { scale: 0.1, point: 1 },
//         408003: { scale: 0.1, point: 1 },
//         408005: { scale: 0.1, point: 1 },
//         408007: { scale: 0.1, point: 2 },
//         408009: { scale: 0.1, point: 2 },
//         408011: { scale: 0.1, point: 2 },
//         408013: { scale: 0.1, point: 2 },
//         408015: { scale: 0.1, point: 2 },
//         408017: { scale: 0.1, point: 2 },
//         408019: { scale: 0.1, point: 2 },
//         408021: { scale: 0.1, point: 2 },
//         408023: { scale: 0.1, point: 2 },
//         408025: { scale: 0.1, point: 2 },
//         408026: { scale: 0.1, point: 2 },
//         408028: { scale: 0.1, point: 2 },
//         408030: { scale: 0.1, point: 2 },
//         408032: { scale: 0.1, point: 2 },
//         408034: { scale: 0.1, point: 2 },
//       };

//       const data = {};

//       Object.entries(scaleAndPointMapping).forEach(
//         ([property, { scale, point }]) => {
//           const originalValue = other1Data.Freq[property];
//           const scaledValue = scaleProcess(originalValue, scale, point);
//           data[property] = scaledValue;
//           // console.log("屬性", property);
//           // console.log("原始數值", originalValue);
//           // console.log("轉換後數值", scaledValue);
//         }
//       );
//       //因為都是 Freq  所以直接利用迴圈先跑
//       res.render("Op_Meter_MainMeter", {
//         volt_ab: data["408001"],
//         volt_bc: data["408003"],
//         volt_ca: data["408005"],
//         volt_avg: data["408007"],
//         curr_a: data["408009"],
//         curr_b: data["408011"],
//         curr_c: data["408013"],
//         curr_n: data["408015"],
//         curr_avg: data["408017"],
//         activePower: data["408019"],
//         reactivePower: data["408021"],
//         apparentPower: data["408023"],
//         powerFactor: data["408025"],
//         Freq: data["408026"],
//         kwh_imp: data["408028"],
//         kwh_exp: data["408030"],
//         kvarh_imp: data["408032"],
//         kvarh_exp: data["408034"],
//         other1Data, // 確保 other1Data 也被傳遞
//         permission: "manager",
//         // ... 其他屬性的渲染可以類似地添加
//         //permission: "manager",
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

/************************************************************************************ */

const databases_AuxM = [
  "other_rf10" //0
];

let AuxM_KeyValuePairs;

async function query_AuxM_KeyValuePairs() {
  // 使用 map 遍歷所有資料庫名稱，創建 Nano 實例，並獲取最新文檔的 promise 陣列
  const dataPromises = databases_AuxM.map(async (dbName) => {
    const nanoDb = createNanoInstance(dbName);
    return getLatestDocument(nanoDb);
  });

  const allData = await Promise.all(dataPromises); //取得所有資料庫的數值 存在陣列裡面 由零開始
  const other10Data = allData[0];

  AuxM_KeyValuePairs = {
    permission: "manager",

    V_Aux_total: Scale_Data(other10Data.AuxMtot1[408069], 0.1, 1),
    I_Aux_total: Scale_Data(other10Data.AuxMtot1[408071], 0.001, 2),
    P_Aux_total: Scale_Data(other10Data.AuxMtot1[408073], 0.001, 1),
    E_Aux_total: Scale_Data(other10Data.AuxMtot1[408075], 0.1, 1),

    V_Aux_ESS1_1: Scale_Data(other10Data.AuxM1[408077], 0.1, 1),
    I_Aux_ESS1_1: Scale_Data(other10Data.AuxM1[408078], 0.01, 2),
    P_Aux_ESS1_1: Scale_Data(other10Data.AuxM1[408079], 0.1, 1),
    E_Aux_ESS1_1: Calculate_CPM10_energy(other10Data.AuxM1[408080], other10Data.AuxM1[408081], other10Data.AuxM1[408082]),

    V_Aux_ESS1_2: Scale_Data(other10Data.AuxM2[408077], 0.1, 1),
    I_Aux_ESS1_2: Scale_Data(other10Data.AuxM2[408078], 0.01, 2),
    P_Aux_ESS1_2: Scale_Data(other10Data.AuxM2[408079], 0.1, 1),
    E_Aux_ESS1_2: Calculate_CPM10_energy(other10Data.AuxM2[408080], other10Data.AuxM2[408081], other10Data.AuxM2[408082]),

    V_Aux_ESS2_1: Scale_Data(other10Data.AuxM3[408077], 0.1, 1),
    I_Aux_ESS2_1: Scale_Data(other10Data.AuxM3[408078], 0.01, 2),
    P_Aux_ESS2_1: Scale_Data(other10Data.AuxM3[408079], 0.1, 1),
    E_Aux_ESS2_1: Calculate_CPM10_energy(other10Data.AuxM3[408080], other10Data.AuxM3[408081], other10Data.AuxM3[408082]),

    V_Aux_ESS2_2: Scale_Data(other10Data.AuxM4[408077], 0.1, 1),
    I_Aux_ESS2_2: Scale_Data(other10Data.AuxM4[408078], 0.01, 2),
    P_Aux_ESS2_2: Scale_Data(other10Data.AuxM4[408079], 0.1, 1),
    E_Aux_ESS2_2: Calculate_CPM10_energy(other10Data.AuxM4[408080], other10Data.AuxM4[408081], other10Data.AuxM4[408082]),

    V_Aux_ESS3_1: Scale_Data(other10Data.AuxM5[408077], 0.1, 1),
    I_Aux_ESS3_1: Scale_Data(other10Data.AuxM5[408078], 0.01, 2),
    P_Aux_ESS3_1: Scale_Data(other10Data.AuxM5[408079], 0.1, 1),
    E_Aux_ESS3_1: Calculate_CPM10_energy(other10Data.AuxM5[408080], other10Data.AuxM5[408081], other10Data.AuxM5[408082]),

    V_Aux_ESS3_2: Scale_Data(other10Data.AuxM6[408077], 0.1, 1),
    I_Aux_ESS3_2: Scale_Data(other10Data.AuxM6[408078], 0.01, 2),
    P_Aux_ESS3_2: Scale_Data(other10Data.AuxM6[408079], 0.1, 1),
    E_Aux_ESS3_2: Calculate_CPM10_energy(other10Data.AuxM6[408080], other10Data.AuxM6[408081], other10Data.AuxM6[408082]),

    V_Aux_ESS4: Scale_Data(other10Data.AuxM7[408077], 0.1, 1),
    I_Aux_ESS4: Scale_Data(other10Data.AuxM7[408078], 0.01, 2),
    P_Aux_ESS4: Scale_Data(other10Data.AuxM7[408079], 0.1, 1),
    E_Aux_ESS4: Calculate_CPM10_energy(other10Data.AuxM7[408080], other10Data.AuxM7[408081], other10Data.AuxM7[408082]),

    V_Aux_HV: Scale_Data(other10Data.AuxM9[408077], 0.1, 1),
    I_Aux_HV: Scale_Data(other10Data.AuxM9[408078], 0.01, 2),
    P_Aux_HV: Scale_Data(other10Data.AuxM9[408079], 0.1, 1),
    E_Aux_HV: Calculate_CPM10_energy(other10Data.AuxM9[408080], other10Data.AuxM9[408081], other10Data.AuxM9[408082]),

    V_Aux_CtrlRoom: Scale_Data(other10Data.AuxM8[408077], 0.1, 1),
    I_Aux_CtrlRoom: Scale_Data(other10Data.AuxM8[408078], 0.01, 2),
    P_Aux_CtrlRoom: Scale_Data(other10Data.AuxM8[408079], 0.1, 1),
    E_Aux_CtrlRoom: Calculate_CPM10_energy(other10Data.AuxM8[408080], other10Data.AuxM8[408081], other10Data.AuxM8[408082])
  };
}

router.get("/operateinfo/auxmeter", async (req, res) => {
  try {
    await query_AuxM_KeyValuePairs();
    //console.log(AuxM_KeyValuePairs);

    res.render("Op_Meter_AuxMeter", AuxM_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/auxmeter/:data", async (req, res) => {
  try {
    await query_AuxM_KeyValuePairs();

    res.json(AuxM_KeyValuePairs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
