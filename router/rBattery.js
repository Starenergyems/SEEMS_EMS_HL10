// const port=3005;

const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");
const router = express.Router();
const app = express();
const cors = require("cors");
const {
  calculateAverage,
  scaleProcess,
  Convert_UInt_to_revBitString,
  mapWordStatus,
  getHighLowByte,
  Calculate_BMS_energy,
  Determine_BGC_of_VcMaxDiff,
  Determine_BGC_of_TcMaxDiff,
  Determine_DL_of_RackHWStatus,
  checkValuesalarm,
  checkValuesFault,
  workStatuschange,
  maponGridStatus,
  workStatus_LC,
  maponGridStatus_LC,
  mapBMSMode
} = require("./function");

const { Console } = require("console");
const { ok } = require("assert");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

////////////////////////////////////////////////////////////////////////////////////////////////
router.use("/public", express.static(path.join(__dirname, "../public"))); //app要改回router
router.use(
  "/operateinfo",
  express.static(path.join(__dirname, "../public/operateinfo"))
);
router.use(
  "/operateinfo/battery",
  express.static(path.join(__dirname, "../public/operateinfo/pcs"))
);
router.use(
  "/operateinfo/battery/infodetail",
  express.static(path.join(__dirname, "../public"))
);
// 共同的中間件，處理 /operateinfo/pcs/infodetail/1、2、3、4、5 及其子路徑下的靜態文件
router.use(
  "/operateinfo/battery/infodetail/:id",
  express.static(path.join(__dirname, "../public"))
);
router.use(
  "/operateinfo/battery/rack",
  express.static(path.join(__dirname, "../public"))
);
router.use(
  "/operateinfo/battery/rack/:id",
  express.static(path.join(__dirname, "../public"))
);

router.use(cors());
//***************************************************************************************************************** */
// 定義 CouchDB 資料庫名稱
const databases = [
  "lc1_rf10", //0
  "lc2_rf10", //1
  "lc3_rf10", //2
  "lc4_rf10", //3
  "dwctrl", //4
  "log" //5
];
// 創建 Nano 實例的函式
//const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);
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

//***************************************************************************************************************** */

router.get("/operateinfo", (req, res) => {
  //以下app要改回router
  res.redirect("/operateinfo/battery");
});

//
var batterySum_variables;

async function querySumData(req) {
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

  batterySum_variables = {
    //**************************************** */
    //BMS資訊總覽
    //workStatus: "正常", //檢查四個LC狀態
    permission: req.body.permission,
    workStatus: workStatuschange(
      lc1Data.BMS1["404011"],
      lc1Data.BMS2["404011"],
      lc2Data.BMS1["404011"],
      lc2Data.BMS2["404011"],
      lc3Data.BMS1["404011"],
      lc3Data.BMS2["404011"],
      lc4Data.BMS1["404011"]
    ), //檢查四個LC狀態

    onGridStatus: maponGridStatus(
      lc1Data.System["402019"],
      lc2Data.System["402019"],
      lc3Data.System["402019"],
      lc4Data.System["402019"]
    ), //併網狀態
    //hl_4-1_10MW.LC#_RF10.System.402064

    onlineNum:
      lc1Data.System["402089"] +
      lc2Data.System["402089"] +
      lc3Data.System["402089"] +
      lc4Data.System["402089"],

    systemV: scaleProcess(
      calculateAverage(
        lc1Data.BMS1["404002"],
        lc1Data.BMS2["404002"],
        lc2Data.BMS1["404002"],
        lc2Data.BMS2["404002"],
        lc3Data.BMS1["404002"],
        lc3Data.BMS2["404002"],
        lc4Data.BMS1["404002"]
      ),
      0.1,
      1
    ),

    //所有BMS電壓平均
    systemI: scaleProcess(
      calculateAverage(
        lc1Data.BMS1["404003"],
        lc1Data.BMS2["404003"],
        lc2Data.BMS1["404003"],
        lc2Data.BMS2["404003"],
        lc3Data.BMS1["404003"],
        lc3Data.BMS2["404003"],
        lc4Data.BMS1["404003"]
      ),
      0.1,
      1
    ), //所有BMS電流平均
    systemSOC: scaleProcess(
      calculateAverage(
        lc1Data.BMS1["404007"],
        lc1Data.BMS2["404007"],
        lc2Data.BMS1["404007"],
        lc2Data.BMS2["404007"],
        lc3Data.BMS1["404007"],
        lc3Data.BMS2["404007"],
        lc4Data.BMS1["404007"]
      ),
      0.1,
      1
    ),
    systemSOH: scaleProcess(
      calculateAverage(
        lc1Data.BMS1["404005"],
        lc1Data.BMS2["404005"],
        lc2Data.BMS1["404005"],
        lc2Data.BMS2["404005"],
        lc3Data.BMS1["404005"],
        lc3Data.BMS2["404005"],
        lc4Data.BMS1["404005"]
      ),
      0.1,
      1
    ),

    // avgContainerTemp: calculateAverage(
    //   lc1Data.BSC1["406047"],
    //   lc1Data.BSC1["406049"],
    //   lc1Data.BSC2["406047"],
    //   lc1Data.BSC2["406049"],
    //   lc2Data.BSC1["406047"],
    //   lc2Data.BSC1["406049"],
    //   lc2Data.BSC2["406047"],
    //   lc2Data.BSC2["406049"],
    //   lc3Data.BSC1["406047"],
    //   lc3Data.BSC1["406049"],
    //   lc3Data.BSC2["406047"],
    //   lc3Data.BSC2["406049"],
    //   lc4Data.BSC1["406047"],
    //   lc4Data.BSC1["406049"]
    // ),

    // heartBeat: lc1Data.System["402018"], //心跳還要再看用哪個為主 應該不會是各LC的

    //************************************************************************************************ */
    //lc01
    onlineNum_LC1: lc1Data.BMS1["404008"] + lc1Data.BMS2["404008"],

    workStatus_LC1: workStatus_LC(lc1Data.System["402019"]),

    onGridStatus_LC1: maponGridStatus_LC(lc1Data.Ctrl["407008"]), //下行目前已完成 等檢查下行是否正確寫入 顯示目前控制狀態

    voltage_LC1: scaleProcess(
      calculateAverage(lc1Data.BMS1["404002"], lc1Data.BMS2["404002"]),
      0.1,
      1
    ),
    current_LC1: scaleProcess(
      calculateAverage(lc1Data.BMS1["404003"], lc1Data.BMS1["404003"]),
      0.1,
      1
    ),

    SOC_LC1: scaleProcess(
      calculateAverage(lc1Data.BMS1["404007"], lc1Data.BMS2["404007"]),
      0.1,
      1
    ),
    SOH_LC1: scaleProcess(
      calculateAverage(lc1Data.BMS1["404005"], lc1Data.BMS2["404005"]),
      0.1,
      1
    ),

    // containerTemp_LC1: calculateAverage(
    //   lc1Data.BSC1["406047"],
    //   lc1Data.BSC1["406049"],
    //   lc1Data.BSC2["406047"],
    //   lc1Data.BSC2["406049"]
    // ),

    V_cell_Max_LC1: scaleProcess(
      Math.max(lc1Data.BMS1["404021"], lc1Data.BMS2["404021"]),
      0.0001,
      3
    ),
    V_cell_Min_LC1: scaleProcess(
      Math.min(lc1Data.BMS1["404022"], lc1Data.BMS2["404022"]),
      0.0001,
      3
    ),
    V_cell_MaxDiff_LC1: scaleProcess(
      Math.max(lc1Data.BMS1["404025"], lc1Data.BMS2["404025"]),
      0.1,
      1
    ),
    T_cell_Max_LC1: scaleProcess(
      Math.max(lc1Data.BMS1["404023"], lc1Data.BMS2["404023"]),
      0.1,
      1
    ),
    T_cell_Min_LC1: scaleProcess(
      Math.min(lc1Data.BMS1["404024"], lc1Data.BMS2["404024"]),
      0.1,
      1
    ),
    T_cell_MaxDiff_LC1: scaleProcess(
      Math.max(lc1Data.BMS1["404026"], lc1Data.BMS2["404026"]),
      0.1,
      1
    ),

    alarm_BMS1_1: checkValuesalarm(lc1Data.BMS1["404044"]),
    alarm_BMS1_2: checkValuesalarm(lc1Data.BMS2["404044"]),

    //要做判斷 回傳一個結果 紅燈1和綠燈0
    fault_BMS1_1: checkValuesFault(
      lc1Data.BMS1["404046"],
      lc1Data.BMS1["404048"],
      lc1Data.BMS1["404061"]
    ),

    fault_BMS1_2: checkValuesFault(
      lc1Data.BMS2["404046"],
      lc1Data.BMS2["404048"],
      lc1Data.BMS2["404061"]
    ),
    //************************************************************************************************ */
    //lc02
    onlineNum_LC2: lc2Data.BMS1["404008"] + lc2Data.BMS2["404008"],

    workStatus_LC2: workStatus_LC(lc2Data.System["402019"]), //還需轉換輸出結果

    onGridStatus_LC2: maponGridStatus_LC(lc2Data.Ctrl["407008"]), //下行目前已完成 等檢查下行是否正確寫入 顯示目前控制狀態

    voltage_LC2: scaleProcess(
      calculateAverage(lc2Data.BMS1["404002"], lc2Data.BMS1["404002"]),
      0.1,
      1
    ),
    current_LC2: scaleProcess(
      calculateAverage(lc2Data.BMS1["404003"], lc2Data.BMS1["404003"]),
      0.1,
      1
    ),

    SOC_LC2: scaleProcess(
      calculateAverage(lc2Data.BMS1["404007"], lc2Data.BMS2["404007"]),
      0.1,
      1
    ),
    SOH_LC2: scaleProcess(
      calculateAverage(lc2Data.BMS1["404005"], lc2Data.BMS2["404005"]),
      0.1,
      1
    ),

    // containerTemp_LC2: calculateAverage(
    //   lc2Data.BSC1["406047"],
    //   lc2Data.BSC1["406049"],
    //   lc2Data.BSC2["406047"],
    //   lc2Data.BSC2["406049"]
    // ),

    V_cell_Max_LC2: scaleProcess(
      Math.max(lc2Data.BMS1["404021"], lc2Data.BMS2["404021"]),
      0.0001,
      3
    ),
    V_cell_Min_LC2: scaleProcess(
      Math.min(lc2Data.BMS1["404022"], lc2Data.BMS2["404022"]),
      0.0001,
      3
    ),
    V_cell_MaxDiff_LC2: scaleProcess(
      Math.max(lc2Data.BMS1["404025"], lc2Data.BMS2["404025"]),
      0.1,
      1
    ),
    T_cell_Max_LC2: scaleProcess(
      Math.max(lc2Data.BMS1["404023"], lc2Data.BMS2["404023"]),
      0.1,
      1
    ),
    T_cell_Min_LC2: scaleProcess(
      Math.min(lc2Data.BMS1["404024"], lc2Data.BMS2["404024"]),
      0.1,
      1
    ),
    T_cell_MaxDiff_LC2: scaleProcess(
      Math.max(lc2Data.BMS1["404026"], lc2Data.BMS2["404026"]),
      0.1,
      1
    ),

    alarm_BMS2_1: checkValuesalarm(lc2Data.BMS1["404044"]),
    alarm_BMS2_2: checkValuesalarm(lc2Data.BMS2["404044"]),

    //要做判斷 回傳一個結果 紅燈1和綠燈0
    fault_BMS2_1: checkValuesFault(
      lc2Data.BMS1["404046"],
      lc2Data.BMS1["404048"],
      lc2Data.BMS1["404061"]
    ),

    fault_BMS2_2: checkValuesFault(
      lc2Data.BMS2["404046"],
      lc2Data.BMS2["404048"],
      lc2Data.BMS2["404061"]
    ),
    //************************************************************************************************ */
    //LC3
    onlineNum_LC3: lc3Data.BMS1["404008"] + lc3Data.BMS2["404008"],

    workStatus_LC3: workStatus_LC(lc3Data.System["402019"]), //還需轉換輸出結果

    onGridStatus_LC3: maponGridStatus_LC(lc3Data.Ctrl["407008"]), //下行目前已完成 等檢查下行是否正確寫入 顯示目前控制狀態

    voltage_LC3: scaleProcess(
      calculateAverage(lc3Data.BMS1["404002"], lc3Data.BMS1["404002"]),
      0.1,
      1
    ),
    current_LC3: scaleProcess(
      calculateAverage(lc3Data.BMS1["404003"], lc3Data.BMS1["404003"]),
      0.1,
      1
    ),

    SOC_LC3: scaleProcess(
      calculateAverage(lc3Data.BMS1["404007"], lc3Data.BMS2["404007"]),
      0.1,
      1
    ),
    SOH_LC3: scaleProcess(
      calculateAverage(lc3Data.BMS1["404005"], lc3Data.BMS2["404005"]),
      0.1,
      1
    ),

    // containerTemp_LC3: calculateAverage(
    //   lc3Data.BSC1["406047"],
    //   lc3Data.BSC1["406049"],
    //   lc3Data.BSC2["406047"],
    //   lc3Data.BSC2["406049"]
    // ),

    V_cell_Max_LC3: scaleProcess(
      Math.max(lc3Data.BMS1["404021"], lc3Data.BMS2["404021"]),
      0.0001,
      3
    ),
    V_cell_Min_LC3: scaleProcess(
      Math.min(lc3Data.BMS1["404022"], lc3Data.BMS2["404022"]),
      0.0001,
      3
    ),
    V_cell_MaxDiff_LC3: scaleProcess(
      Math.max(lc3Data.BMS1["404025"], lc3Data.BMS2["404025"]),
      0.1,
      1
    ),
    T_cell_Max_LC3: scaleProcess(
      Math.max(lc3Data.BMS1["404023"], lc3Data.BMS2["404023"]),
      0.1,
      1
    ),
    T_cell_Min_LC3: scaleProcess(
      Math.min(lc3Data.BMS1["404024"], lc3Data.BMS2["404024"]),
      0.1,
      1
    ),
    T_cell_MaxDiff_LC3: scaleProcess(
      Math.max(lc3Data.BMS1["404026"], lc3Data.BMS2["404026"]),
      0.1,
      1
    ),

    alarm_BMS3_1: checkValuesalarm(lc3Data.BMS1["404044"]),
    alarm_BMS3_2: checkValuesalarm(lc3Data.BMS2["404044"]),

    //要做判斷 回傳一個結果 紅燈1和綠燈0
    fault_BMS3_1: checkValuesFault(
      lc3Data.BMS1["404046"],
      lc3Data.BMS1["404048"],
      lc3Data.BMS1["404061"]
    ),

    fault_BMS3_2: checkValuesFault(
      lc3Data.BMS2["404046"],
      lc3Data.BMS2["404048"],
      lc3Data.BMS2["404061"]
    ),
    //************************************************************************************************ */
    //LC4
    onlineNum_LC4: lc4Data.BMS1["404008"],

    workStatus_LC4: workStatus_LC(lc4Data.System["402019"]), //還需轉換輸出結果

    onGridStatus_LC4: maponGridStatus_LC(lc4Data.Ctrl["407008"]), //下行目前已完成 等檢查下行是否正確寫入 顯示目前控制狀態

    voltage_LC4: calculateAverage(scaleProcess(lc4Data.BMS1["404002"], 0.1, 1)),
    current_LC4: scaleProcess(
      calculateAverage(lc4Data.BMS1["404003"], lc4Data.BMS1["404003"]),
      0.1,
      1
    ),

    SOC_LC4: scaleProcess(lc4Data.BMS1["404007"], 0.1, 1),
    SOH_LC4: scaleProcess(lc4Data.BMS1["404005"], 0.1, 1),

    // containerTemp_LC4: calculateAverage(
    //   lc4Data.BSC1["406047"],
    //   lc4Data.BSC1["406049"]
    // ),

    V_cell_Max_LC4: scaleProcess(lc4Data.BMS1["404021"], 0.0001, 3),
    V_cell_Min_LC4: scaleProcess(lc4Data.BMS1["404022"], 0.0001, 3),
    V_cell_MaxDiff_LC4: scaleProcess(lc4Data.BMS1["404025"], 0.1, 1),
    T_cell_Max_LC4: scaleProcess(lc4Data.BMS1["404023"], 0.1, 1),
    T_cell_Min_LC4: scaleProcess(lc4Data.BMS1["404024"], 0.1, 1),
    T_cell_MaxDiff_LC4: scaleProcess(lc4Data.BMS1["404026"], 0.1, 1),

    alarm_BMS4_1: checkValuesalarm(lc4Data.BMS1["404044"]),

    //要做判斷 回傳一個結果 紅燈1和綠燈0
    fault_BMS4_1: checkValuesFault(
      lc4Data.BMS1["404046"],
      lc4Data.BMS1["404048"],
      lc4Data.BMS1["404061"]
    )
  };
}

router.get("/operateinfo/battery", async (req, res) => {
  try {
    await querySumData(req);
    // console.log(batterySum_variables);
    // console.log("**************");
    res.render("Op_Bat_InfoSummary", batterySum_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/battery/data", async (req, res) => {
  try {
    querySumData(req); //重新撈資料
    const responseData = batterySum_variables;

    res.json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//***************************************************************************************** */
//Op_Bat_InfoSummary.js
///operateinfo/battery SET按鈕把數值帶入打勾
router.post("/getDataForSet", async (req, res) => {
  try {
    //console.log("接收到前端請求");
    permission: req.body.permission;
    const blockId = req.body.blockId; //可以得到是哪台lc
    console.log("Op_Bat_InfoSummary.js getDataForSet blockId:" + blockId);

    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
    });

    const allData = await Promise.all(dataPromises);
    const num = blockId - 1; //存放位置從零開始所以要減一
    const lcData = allData[num];

    const data = lcData.Ctrl["407008"]; //回傳目前數

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

//SET按鈕 控制下行
router.post("/backendEndpoint", async (req, res) => {
  try {
    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
    });
    permission: req.body.permission;
    const allData = await Promise.all(dataPromises); //取得所有資料庫目前最新的一筆的數值 存在陣列裡面 由零開始
    const dwctrlData = allData[4];

    //console.log("接收到前端請求");
    const selectedValue = req.body.selectedValue; //選取方塊的區塊的數字
    const lcnum = req.body.lcnum; //LC4_BMS併網狀態
    // 使用正規表達式提取數字部分
    const matchResult = lcnum.match(/\d+/);
    // 如果有匹配到數字，取得lc數值
    const extractedNumber = matchResult ? parseInt(matchResult[0], 10) : null;
    //console.log("extractedNumber:" + extractedNumber); //提取出來的lc數值
    // 修改 407008 這個點的數值

    const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));

    if (extractedNumber == 1) {
      newdwctrlData.lc1.W407008 = selectedValue;
    } else if (extractedNumber == 2) {
      newdwctrlData.lc2.W407008 = selectedValue;
    } else if (extractedNumber == 3) {
      newdwctrlData.lc3.W407008 = selectedValue;
    } else if (extractedNumber == 4) {
      newdwctrlData.lc4.W407008 = selectedValue;
    }
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
    await nano.use("dwctrl").insert(newdwctrlData);
    // console.log(
    //   "newdwctrlData 1讀取到的資料是:" + JSON.stringify(newdwctrlData, null, 2)
    // );

    //log紀錄
    let content;

    if (selectedValue == 1) {
      content = "切離";
    } else if (selectedValue == 2) {
      content = "投入";
    } else if (selectedValue == 3) {
      content = "故障復位";
    }

    const logDb = createNanoInstance("log");

    const doc = {
      tag: `LC${extractedNumber}_rf10.Ctrl.407008`,
      time: isoString,
      category: "設備控制",
      device: `LC${extractedNumber}`,
      username: req.body.id,
      content: `將LC${extractedNumber}BMS併網狀態設為${content}`
    };
    //console.log(doc);

    if (selectedValue != 0) {
      const result = await logDb.insert(doc);
      //console.log(result);
    }

    //console.log("Document added to database. ID: " + result.id);
    const data = { ststus: ok };
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//***************************************************************************************** */
//BMS的infodetail
let globalPageNumber = 0;
var pageNumber;
var batteryDetail_variables;

async function queryDetailData(req) {
  // 定義資料庫集合的映射
  const collectionMap = {
    1: "Lc01",
    2: "Lc01",
    3: "Lc02",
    4: "Lc02",
    5: "Lc03",
    6: "Lc03",
    7: "Lc04"
    // 8: "Lc04", // 如果需要處理 8，可以取消註解
  };

  // 根據 pageNumber 選擇不同的集合名稱
  const selectedCollection = collectionMap[pageNumber];
  // 根據 pageNumber 選擇不同的集合名稱

  //console.log("pageNumber: " + pageNumber);
  //console.log("selectedCollection: " + selectedCollection);

  if (!selectedCollection) {
    throw new Error("infodetail: Invalid pageNumber");
  }
  if (!selectedCollection) {
    throw new Error("infodetail: Invalid pageNumber");
  }

  const baseNumber = Math.ceil(pageNumber / 2); // 取天花板值 得到第幾組也可以得到lc的組數
  const subNumber = pageNumber % 2 === 0 ? 2 : 1; //第N組的第一台或是第二台
  const No_of_BMS = `${baseNumber}-${subNumber}`; //a-b 第幾組的第幾台
  console.log(No_of_BMS);

  const dataPromises = databases.map(async (dbName) => {
    const nanoDb = createNanoInstance(dbName);
    return getLatestDocument(nanoDb);
  });

  const allData = await Promise.all(dataPromises); //取得所有資料庫的數值 存在陣列裡面 由零開始
  // const lc1Data = allData[0];
  // const lc2Data = allData[1];
  // const lc3Data = allData[2];
  // const lc4Data = allData[3];
  const num = baseNumber - 1; //因為陣列位置從零開始存 所以要少一
  const lcData = allData[num];
  //console.log("num: " + num);
  //console.log("baseNumber:" + baseNumber);

  if (!lcData) {
    throw new Error("No data found~");
  }

  //let processedPageNumber;
  if (pageNumber % 2 === 0) {
    // 偶數頁處理方式 傳遞資料給模板引擎，渲染頁面
    batteryDetail_variables = {
      permission: req.body.permission,
      pageNumber,
      No_of_BMS,
      BMSMode: mapBMSMode(lcData.BMS2[404011]),
      onlineNum: lcData.BMS2[404008],
      onlineV: scaleProcess(lcData.BMS2[404006], 0.1, 1),
      BMSsystemV: scaleProcess(lcData.BMS2[404002], 0.1, 1),
      BMSsystemI: scaleProcess(lcData.BMS2[404003], 0.1, 1),
      BMSsystemSOC: scaleProcess(lcData.BMS2[404007], 0.1, 1),
      BMSsystemSOH: scaleProcess(lcData.BMS2[404005], 0.1, 1),
      heartBeat: lcData.BMS2[404001],
      //電池機櫃
      rackVoltDiff: scaleProcess(lcData.BMS2[404028], 0.1, 1),
      rackNoVmaxmin: getHighLowByte(lcData.BMS2[404042]),
      rackCurrDiff: scaleProcess(lcData.BMS2[404029], 0.1, 1),
      rackNoImaxmin: getHighLowByte(lcData.BMS2[404043]),
      rackSOCDiff: scaleProcess(lcData.BMS2[404027], 0.1, 1),
      //電池電芯
      //最高電芯電壓 位置
      V_cell_Max: scaleProcess(lcData.BMS2[404021], 0.0001, 4),
      rackNoVcMax: lcData.BMS2[404034],
      bmucellNoVcMax: getHighLowByte(lcData.BMS2[404035]), //bmuNoVcMax & cellNoVcMax
      //最低電芯電壓 位置
      V_cell_Min: scaleProcess(lcData.BMS2[404022], 0.0001, 4),
      rackNoVcMin: lcData.BMS2[404036],
      bmucellNoVcMin: getHighLowByte(lcData.BMS2[404037]),
      //最大電芯壓差
      V_cell_MaxDiff: scaleProcess(lcData.BMS2[404025], 0.1, 1),
      //最高電芯溫度 位置
      T_cell_Max: scaleProcess(lcData.BMS2[404023], 0.1, 1),
      rackNoTcMax: lcData.BMS2[404038],
      bmucellNoTcMax: getHighLowByte(lcData.BMS2[404039]),
      //最低電芯溫度 位置
      T_cell_Min: scaleProcess(lcData.BMS2[404024], 0.1, 1),
      rackNoTcMin: lcData.BMS2[404040],
      bmucellNoTcMin: getHighLowByte(lcData.BMS2[404041]),
      //最大電芯溫差
      T_cell_MaxDiff: scaleProcess(lcData.BMS2[404026], 0.1, 1),
      //總充放電量
      totalChgE: Calculate_BMS_energy(
        lcData.BMS2[404079],
        lcData.BMS2[404080],
        lcData.BMS2[404081]
      ),
      totalDcgE: Calculate_BMS_energy(
        lcData.BMS2[404082],
        lcData.BMS2[404083],
        lcData.BMS2[404084]
      ),
      // tempAmb_1: scaleProcess(lcData.BMS2[404013], 0.1, 1),
      // tempAmb_2: scaleProcess(lcData.BMS2[404014], 0.1, 1),
      //故障告警位置 rack
      rackNo_alarmCMU: lcData.BMS2[404054],
      rackNo_faultCMU: lcData.BMS2[404055],
      rackNo_faultPRelay: lcData.BMS2[404056],
      rackNo_faultNRelay: lcData.BMS2[404057],
      rackNo_faultFuse: lcData.BMS2[404058],
      rackNo_commSMUCMU: lcData.BMS2[404059],
      //DI狀態
      statusDI: Convert_UInt_to_revBitString(lcData.BMS2[404062], 16),
      //硬體故障
      faultHW: Convert_UInt_to_revBitString(lcData.BMS2[404048], 16),
      //SMU故障
      faultSMU: Convert_UInt_to_revBitString(lcData.BMS2[404061], 16),
      //SOC 校準
      SOCcali: Convert_UInt_to_revBitString(lcData.BMS2[404060], 16),
      //CMU故障與告警
      alarm: Convert_UInt_to_revBitString(lcData.BMS2[404044], 32),
      fault: Convert_UInt_to_revBitString(lcData.BMS2[404046], 32)
    };
  } else {
    // 奇數頁處理方式 傳遞資料給模板引擎，渲染頁面
    batteryDetail_variables = {
      permission: req.body.permission,
      pageNumber,
      No_of_BMS,
      BMSMode: mapBMSMode(lcData.BMS1[404011]),
      onlineNum: lcData.BMS1[404008],
      onlineV: scaleProcess(lcData.BMS1[404006], 0.1, 1),
      BMSsystemV: scaleProcess(lcData.BMS1[404002], 0.1, 1),
      BMSsystemI: scaleProcess(lcData.BMS1[404003], 0.1, 1),
      BMSsystemSOC: scaleProcess(lcData.BMS1[404007], 0.1, 1),
      BMSsystemSOH: scaleProcess(lcData.BMS1[404005], 0.1, 1),
      heartBeat: lcData.BMS1[404001],
      rackVoltDiff: scaleProcess(lcData.BMS1[404028], 0.1, 1),
      rackNoVmaxmin: getHighLowByte(lcData.BMS1[404042]),
      rackCurrDiff: scaleProcess(lcData.BMS1[404029], 0.1, 1),
      rackNoImaxmin: getHighLowByte(lcData.BMS1[404043]),
      rackSOCDiff: scaleProcess(lcData.BMS1[404027], 0.1, 1),
      V_cell_Max: scaleProcess(lcData.BMS1[404021], 0.0001, 4),
      rackNoVcMax: lcData.BMS1[404034],
      bmucellNoVcMax: getHighLowByte(lcData.BMS1[404035]),
      V_cell_Min: scaleProcess(lcData.BMS1[404022], 0.0001, 4),
      rackNoVcMin: lcData.BMS1[404036],
      bmucellNoVcMin: getHighLowByte(lcData.BMS1[404037]),
      V_cell_MaxDiff: scaleProcess(lcData.BMS1[404025], 0.1, 1),
      T_cell_Max: scaleProcess(lcData.BMS1[404023], 0.1, 1),
      rackNoTcMax: lcData.BMS1[404038],
      bmucellNoTcMax: getHighLowByte(lcData.BMS1[404039]),
      T_cell_Min: scaleProcess(lcData.BMS1[404024], 0.1, 1),
      rackNoTcMin: lcData.BMS1[404040],
      bmucellNoTcMin: getHighLowByte(lcData.BMS1[404041]),
      T_cell_MaxDiff: scaleProcess(lcData.BMS1[404026], 0.1, 1),
      totalChgE: Calculate_BMS_energy(
        lcData.BMS1[404079],
        lcData.BMS1[404080],
        lcData.BMS1[404081]
      ),
      totalDcgE: Calculate_BMS_energy(
        lcData.BMS1[404082],
        lcData.BMS1[404083],
        lcData.BMS1[404084]
      ),
      // tempAmb_1: scaleProcess(lcData.BMS1[404013], 0.1, 1),
      // tempAmb_2: scaleProcess(lcData.BMS1[404014], 0.1, 1),

      rackNo_alarmCMU: lcData.BMS1[404054],
      rackNo_faultCMU: lcData.BMS1[404055],
      rackNo_faultPRelay: lcData.BMS1[404056],
      rackNo_faultNRelay: lcData.BMS1[404057],
      rackNo_faultFuse: lcData.BMS1[404058],
      rackNo_commSMUCMU: lcData.BMS1[404059],
      statusDI: Convert_UInt_to_revBitString(lcData.BMS1[404062], 16),
      faultHW: Convert_UInt_to_revBitString(lcData.BMS1[404048], 16),
      faultSMU: Convert_UInt_to_revBitString(lcData.BMS1[404061], 16),
      SOCcali: Convert_UInt_to_revBitString(lcData.BMS1[404060], 16),
      alarm: Convert_UInt_to_revBitString(lcData.BMS1[404044], 32),
      fault: Convert_UInt_to_revBitString(lcData.BMS1[404046], 32)
    };
  }
}

router.get("/operateinfo/battery/infodetail/:pageNumber", async (req, res) => {
  try {
    pageNumber = parseInt(req.params.pageNumber);
    globalPageNumber = parseInt(req.params.pageNumber);
    //console.log(pageNumber);
    await queryDetailData(req);
    res.render("Op_Bat_InfoDetail", batteryDetail_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get(
  "/operateinfo/battery/infodetail/:pageNumber/:data",
  async (req, res) => {
    try {
      pageNumber = parseInt(req.params.pageNumber);
      globalPageNumber = parseInt(req.params.pageNumber);
      await queryDetailData(req);
      const responseData = batteryDetail_variables;
      //permission: req.body.permission,
      res.json(responseData);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
// //***************************************************************************************** */
// //BMS的RACK詳細資料
const rackWorkStatus_MT = {
  1: "開機",
  2: "自檢測",
  4: "工作",
  8: "故障",
  16: "關機",
  32: "升級",
  64: "ADC校正",
  128: "測試"
};
var batteryRack_variables;
async function queryRackData(req) {
  //req.session.pageNumber = pageNumber;
  //const collectionNames = Object.keys(collections);
  //console.log("當前連接中的 globalPageNumber 名稱：", globalPageNumber);
  // 根據 pageNumber 選擇不同的集合名稱
  const collectionMap = {
    1: "Lc01",
    2: "Lc01",
    3: "Lc02",
    4: "Lc02",
    5: "Lc03",
    6: "Lc03",
    7: "Lc04"
    // 8: "Lc04", // 如果需要處理 8，可以取消註解
  };

  let selectedCollection = collectionMap[pageNumber];
  // console.log("-------------------------------------------------------");
  // console.log("頁數 pageNumber: " + pageNumber);
  // console.log("selectedCollection: " + selectedCollection);

  if (!selectedCollection) {
    throw new Error("rack : Invalid pageNumber");
  }

  const baseNumber = Math.ceil(pageNumber / 2); // 取天花板值
  const subNumber = pageNumber % 2 === 0 ? 2 : 1;
  const No_of_BMS = `${baseNumber}-${subNumber}`;

  // 根據選擇的集合名稱查詢資料

  const dataPromises = databases.map(async (dbName) => {
    const nanoDb = createNanoInstance(dbName);
    return getLatestDocument(nanoDb);
  });

  const allData = await Promise.all(dataPromises);

  const num = baseNumber - 1; //因為陣列位置從零開始存 所以要少一
  const lcData = allData[num];
  // console.log("num: " + num);
  // console.log("對應資料庫要抓到哪個-baseNumber: " + baseNumber);
  //console.log("baseNumber:" + baseNumber);

  if (!lcData) {
    throw new Error("No data found");
  }

  //let processedPageNumber;

  const isEvenPage = pageNumber % 2 === 0;
  const Lc_RackGroup = isEvenPage ? lcData.RackSub2 : lcData.RackSub1;
  // console.log("判斷isEvenPage??" + isEvenPage);
  // console.log("Lc_RackGroup: " + Lc_RackGroup);
  batteryRack_variables = {
    permission: req.body.permission,
    pageNumber,
    No_of_BMS,
    Mode_R01: mapWordStatus(Lc_RackGroup.Rack01[405009], rackWorkStatus_MT),
    V_rack_R01: scaleProcess(Lc_RackGroup.Rack01[405005], 0.1, 1),
    I_rack_R01: scaleProcess(Lc_RackGroup.Rack01[405002], 0.1, 1),
    SOC_R01: scaleProcess(Lc_RackGroup.Rack01[405006], 0.01, 2),
    SOH_R01: scaleProcess(Lc_RackGroup.Rack01[405004], 0.01, 2),
    Impedance_R01: scaleProcess(Lc_RackGroup.Rack01[405020], 0.1, 1),
    //
    V_cell_Max_R01: scaleProcess(Lc_RackGroup.Rack01[405010], 0.0001, 4),
    bmucellNoVcMax_R01: getHighLowByte(Lc_RackGroup.Rack01[405011]),
    V_cell_Min_R01: scaleProcess(Lc_RackGroup.Rack01[405012], 0.0001, 4),
    bmucellNoVcMin_R01: getHighLowByte(Lc_RackGroup.Rack01[405013]),
    V_cell_MaxDiff_R01: scaleProcess(
      Lc_RackGroup.Rack01[405010] - Lc_RackGroup.Rack01[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R01: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack01[405010] - Lc_RackGroup.Rack01[405012]
    ),
    T_cell_Max_R01: scaleProcess(Lc_RackGroup.Rack01[405014], 0.1, 1),
    bmucellNoTcMax_R01: getHighLowByte(Lc_RackGroup.Rack01[405015]),
    T_cell_Min_R01: scaleProcess(Lc_RackGroup.Rack01[405016], 0.1, 1),
    bmucellNoTcMin_R01: getHighLowByte(Lc_RackGroup.Rack01[405017]),
    T_cell_MaxDiff_R01: scaleProcess(
      Lc_RackGroup.Rack01[405014] - Lc_RackGroup.Rack01[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R01: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack01[405014] - Lc_RackGroup.Rack01[405016]
    ),
    alarmCMU_R01_rawD: Lc_RackGroup.Rack01[405028],
    faultCMU_R01_rawD: Lc_RackGroup.Rack01[405030],
    DL_of_statusHW_R01: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack01[405032]
    ),

    Mode_R02: mapWordStatus(Lc_RackGroup.Rack02[405009], rackWorkStatus_MT),
    V_rack_R02: scaleProcess(Lc_RackGroup.Rack02[405005], 0.1, 1),
    I_rack_R02: scaleProcess(Lc_RackGroup.Rack02[405002], 0.1, 1),
    SOC_R02: scaleProcess(Lc_RackGroup.Rack02[405006], 0.01, 2),
    SOH_R02: scaleProcess(Lc_RackGroup.Rack02[405004], 0.01, 2),
    Impedance_R02: scaleProcess(Lc_RackGroup.Rack02[405020], 0.1, 1),
    V_cell_Max_R02: scaleProcess(Lc_RackGroup.Rack02[405010], 0.0001, 4),
    bmucellNoVcMax_R02: getHighLowByte(Lc_RackGroup.Rack02[405011]),
    V_cell_Min_R02: scaleProcess(Lc_RackGroup.Rack02[405012], 0.0001, 4),
    bmucellNoVcMin_R02: getHighLowByte(Lc_RackGroup.Rack02[405013]),
    V_cell_MaxDiff_R02: scaleProcess(
      Lc_RackGroup.Rack02[405010] - Lc_RackGroup.Rack02[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R02: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack02[405010] - Lc_RackGroup.Rack02[405012]
    ),
    T_cell_Max_R02: scaleProcess(Lc_RackGroup.Rack02[405014], 0.1, 1),
    bmucellNoTcMax_R02: getHighLowByte(Lc_RackGroup.Rack02[405015]),
    T_cell_Min_R02: scaleProcess(Lc_RackGroup.Rack02[405016], 0.1, 1),
    bmucellNoTcMin_R02: getHighLowByte(Lc_RackGroup.Rack02[405017]),
    T_cell_MaxDiff_R02: scaleProcess(
      Lc_RackGroup.Rack02[405014] - Lc_RackGroup.Rack02[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R02: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack02[405014] - Lc_RackGroup.Rack02[405016]
    ),
    alarmCMU_R02_rawD: Lc_RackGroup.Rack02[405028],
    faultCMU_R02_rawD: Lc_RackGroup.Rack02[405030],
    DL_of_statusHW_R02: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack02[405032]
    ),

    Mode_R03: mapWordStatus(Lc_RackGroup.Rack03[405009], rackWorkStatus_MT),
    V_rack_R03: scaleProcess(Lc_RackGroup.Rack03[405005], 0.1, 1),
    I_rack_R03: scaleProcess(Lc_RackGroup.Rack03[405002], 0.1, 1),
    SOC_R03: scaleProcess(Lc_RackGroup.Rack03[405006], 0.01, 2),
    SOH_R03: scaleProcess(Lc_RackGroup.Rack03[405004], 0.01, 2),
    Impedance_R03: scaleProcess(Lc_RackGroup.Rack03[405020], 0.1, 1),
    V_cell_Max_R03: scaleProcess(Lc_RackGroup.Rack03[405010], 0.0001, 4),
    bmucellNoVcMax_R03: getHighLowByte(Lc_RackGroup.Rack03[405011]),
    V_cell_Min_R03: scaleProcess(Lc_RackGroup.Rack03[405012], 0.0001, 4),
    bmucellNoVcMin_R03: getHighLowByte(Lc_RackGroup.Rack03[405013]),
    V_cell_MaxDiff_R03: scaleProcess(
      Lc_RackGroup.Rack03[405010] - Lc_RackGroup.Rack03[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R03: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack03[405010] - Lc_RackGroup.Rack03[405012]
    ),
    T_cell_Max_R03: scaleProcess(Lc_RackGroup.Rack03[405014], 0.1, 1),
    bmucellNoTcMax_R03: getHighLowByte(Lc_RackGroup.Rack03[405015]),
    T_cell_Min_R03: scaleProcess(Lc_RackGroup.Rack03[405016], 0.1, 1),
    bmucellNoTcMin_R03: getHighLowByte(Lc_RackGroup.Rack03[405017]),
    T_cell_MaxDiff_R03: scaleProcess(
      Lc_RackGroup.Rack03[405014] - Lc_RackGroup.Rack03[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R03: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack03[405014] - Lc_RackGroup.Rack03[405016]
    ),
    alarmCMU_R03_rawD: Lc_RackGroup.Rack03[405028],
    faultCMU_R03_rawD: Lc_RackGroup.Rack03[405030],
    DL_of_statusHW_R03: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack03[405032]
    ),

    Mode_R04: mapWordStatus(Lc_RackGroup.Rack04[405009], rackWorkStatus_MT),
    V_rack_R04: scaleProcess(Lc_RackGroup.Rack04[405005], 0.1, 1),
    I_rack_R04: scaleProcess(Lc_RackGroup.Rack04[405002], 0.1, 1),
    SOC_R04: scaleProcess(Lc_RackGroup.Rack04[405006], 0.01, 2),
    SOH_R04: scaleProcess(Lc_RackGroup.Rack04[405004], 0.01, 2),
    Impedance_R04: scaleProcess(Lc_RackGroup.Rack04[405020], 0.1, 1),
    V_cell_Max_R04: scaleProcess(Lc_RackGroup.Rack04[405010], 0.0001, 4),
    bmucellNoVcMax_R04: getHighLowByte(Lc_RackGroup.Rack04[405011]),
    V_cell_Min_R04: scaleProcess(Lc_RackGroup.Rack04[405012], 0.0001, 4),
    bmucellNoVcMin_R04: getHighLowByte(Lc_RackGroup.Rack04[405013]),
    V_cell_MaxDiff_R04: scaleProcess(
      Lc_RackGroup.Rack04[405010] - Lc_RackGroup.Rack04[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R04: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack04[405010] - Lc_RackGroup.Rack04[405012]
    ),
    T_cell_Max_R04: scaleProcess(Lc_RackGroup.Rack04[405014], 0.1, 1),
    bmucellNoTcMax_R04: getHighLowByte(Lc_RackGroup.Rack04[405015]),
    T_cell_Min_R04: scaleProcess(Lc_RackGroup.Rack04[405016], 0.1, 1),
    bmucellNoTcMin_R04: getHighLowByte(Lc_RackGroup.Rack04[405017]),
    T_cell_MaxDiff_R04: scaleProcess(
      Lc_RackGroup.Rack04[405014] - Lc_RackGroup.Rack04[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R04: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack04[405014] - Lc_RackGroup.Rack04[405016]
    ),
    alarmCMU_R04_rawD: Lc_RackGroup.Rack04[405028],
    faultCMU_R04_rawD: Lc_RackGroup.Rack04[405030],
    DL_of_statusHW_R04: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack04[405032]
    ),

    Mode_R05: mapWordStatus(Lc_RackGroup.Rack05[405009], rackWorkStatus_MT),
    V_rack_R05: scaleProcess(Lc_RackGroup.Rack05[405005], 0.1, 1),
    I_rack_R05: scaleProcess(Lc_RackGroup.Rack05[405002], 0.1, 1),
    SOC_R05: scaleProcess(Lc_RackGroup.Rack05[405006], 0.01, 2),
    SOH_R05: scaleProcess(Lc_RackGroup.Rack05[405004], 0.01, 2),
    Impedance_R05: scaleProcess(Lc_RackGroup.Rack05[405020], 0.1, 1),
    V_cell_Max_R05: scaleProcess(Lc_RackGroup.Rack05[405010], 0.0001, 4),
    bmucellNoVcMax_R05: getHighLowByte(Lc_RackGroup.Rack05[405011]),
    V_cell_Min_R05: scaleProcess(Lc_RackGroup.Rack05[405012], 0.0001, 4),
    bmucellNoVcMin_R05: getHighLowByte(Lc_RackGroup.Rack05[405013]),
    V_cell_MaxDiff_R05: scaleProcess(
      Lc_RackGroup.Rack05[405010] - Lc_RackGroup.Rack05[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R05: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack05[405010] - Lc_RackGroup.Rack05[405012]
    ),
    T_cell_Max_R05: scaleProcess(Lc_RackGroup.Rack05[405014], 0.1, 1),
    bmucellNoTcMax_R05: getHighLowByte(Lc_RackGroup.Rack05[405015]),
    T_cell_Min_R05: scaleProcess(Lc_RackGroup.Rack05[405016], 0.1, 1),
    bmucellNoTcMin_R05: getHighLowByte(Lc_RackGroup.Rack05[405017]),
    T_cell_MaxDiff_R05: scaleProcess(
      Lc_RackGroup.Rack05[405014] - Lc_RackGroup.Rack05[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R05: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack05[405014] - Lc_RackGroup.Rack05[405016]
    ),
    alarmCMU_R05_rawD: Lc_RackGroup.Rack05[405028],
    faultCMU_R05_rawD: Lc_RackGroup.Rack05[405030],
    DL_of_statusHW_R05: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack05[405032]
    ),

    Mode_R06: mapWordStatus(Lc_RackGroup.Rack06[405009], rackWorkStatus_MT),
    V_rack_R06: scaleProcess(Lc_RackGroup.Rack06[405005], 0.1, 1),
    I_rack_R06: scaleProcess(Lc_RackGroup.Rack06[405002], 0.1, 1),
    SOC_R06: scaleProcess(Lc_RackGroup.Rack06[405006], 0.01, 2),
    SOH_R06: scaleProcess(Lc_RackGroup.Rack06[405004], 0.01, 2),
    Impedance_R06: scaleProcess(Lc_RackGroup.Rack06[405020], 0.1, 1),
    V_cell_Max_R06: scaleProcess(Lc_RackGroup.Rack06[405010], 0.0001, 4),
    bmucellNoVcMax_R06: getHighLowByte(Lc_RackGroup.Rack06[405011]),
    V_cell_Min_R06: scaleProcess(Lc_RackGroup.Rack06[405012], 0.0001, 4),
    bmucellNoVcMin_R06: getHighLowByte(Lc_RackGroup.Rack06[405013]),
    V_cell_MaxDiff_R06: scaleProcess(
      Lc_RackGroup.Rack06[405010] - Lc_RackGroup.Rack06[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R06: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack06[405010] - Lc_RackGroup.Rack06[405012]
    ),
    T_cell_Max_R06: scaleProcess(Lc_RackGroup.Rack06[405014], 0.1, 1),
    bmucellNoTcMax_R06: getHighLowByte(Lc_RackGroup.Rack06[405015]),
    T_cell_Min_R06: scaleProcess(Lc_RackGroup.Rack06[405016], 0.1, 1),
    bmucellNoTcMin_R06: getHighLowByte(Lc_RackGroup.Rack06[405017]),
    T_cell_MaxDiff_R06: scaleProcess(
      Lc_RackGroup.Rack06[405014] - Lc_RackGroup.Rack06[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R06: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack06[405014] - Lc_RackGroup.Rack06[405016]
    ),
    alarmCMU_R06_rawD: Lc_RackGroup.Rack06[405028],
    faultCMU_R06_rawD: Lc_RackGroup.Rack06[405030],
    DL_of_statusHW_R06: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack06[405032]
    ),

    Mode_R07: mapWordStatus(Lc_RackGroup.Rack07[405009], rackWorkStatus_MT),
    V_rack_R07: scaleProcess(Lc_RackGroup.Rack07[405005], 0.1, 1),
    I_rack_R07: scaleProcess(Lc_RackGroup.Rack07[405002], 0.1, 1),
    SOC_R07: scaleProcess(Lc_RackGroup.Rack07[405006], 0.01, 2),
    SOH_R07: scaleProcess(Lc_RackGroup.Rack07[405004], 0.01, 2),
    Impedance_R07: scaleProcess(Lc_RackGroup.Rack07[405020], 0.1, 1),
    V_cell_Max_R07: scaleProcess(Lc_RackGroup.Rack07[405010], 0.0001, 4),
    bmucellNoVcMax_R07: getHighLowByte(Lc_RackGroup.Rack07[405011]),
    V_cell_Min_R07: scaleProcess(Lc_RackGroup.Rack07[405012], 0.0001, 4),
    bmucellNoVcMin_R07: getHighLowByte(Lc_RackGroup.Rack07[405013]),
    V_cell_MaxDiff_R07: scaleProcess(
      Lc_RackGroup.Rack07[405010] - Lc_RackGroup.Rack07[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R07: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack07[405010] - Lc_RackGroup.Rack07[405012]
    ),
    T_cell_Max_R07: scaleProcess(Lc_RackGroup.Rack07[405014], 0.1, 1),
    bmucellNoTcMax_R07: getHighLowByte(Lc_RackGroup.Rack07[405015]),
    T_cell_Min_R07: scaleProcess(Lc_RackGroup.Rack07[405016], 0.1, 1),
    bmucellNoTcMin_R07: getHighLowByte(Lc_RackGroup.Rack07[405017]),
    T_cell_MaxDiff_R07: scaleProcess(
      Lc_RackGroup.Rack07[405014] - Lc_RackGroup.Rack07[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R07: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack07[405014] - Lc_RackGroup.Rack07[405016]
    ),
    alarmCMU_R07_rawD: Lc_RackGroup.Rack07[405028],
    faultCMU_R07_rawD: Lc_RackGroup.Rack07[405030],
    DL_of_statusHW_R07: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack07[405032]
    ),

    Mode_R08: mapWordStatus(Lc_RackGroup.Rack08[405009], rackWorkStatus_MT),
    V_rack_R08: scaleProcess(Lc_RackGroup.Rack08[405005], 0.1, 1),
    I_rack_R08: scaleProcess(Lc_RackGroup.Rack08[405002], 0.1, 1),
    SOC_R08: scaleProcess(Lc_RackGroup.Rack08[405006], 0.01, 2),
    SOH_R08: scaleProcess(Lc_RackGroup.Rack08[405004], 0.01, 2),
    Impedance_R08: scaleProcess(Lc_RackGroup.Rack08[405020], 0.1, 1),
    V_cell_Max_R08: scaleProcess(Lc_RackGroup.Rack08[405010], 0.0001, 4),
    bmucellNoVcMax_R08: getHighLowByte(Lc_RackGroup.Rack08[405011]),
    V_cell_Min_R08: scaleProcess(Lc_RackGroup.Rack08[405012], 0.0001, 4),
    bmucellNoVcMin_R08: getHighLowByte(Lc_RackGroup.Rack08[405013]),
    V_cell_MaxDiff_R08: scaleProcess(
      Lc_RackGroup.Rack08[405010] - Lc_RackGroup.Rack08[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R08: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack08[405010] - Lc_RackGroup.Rack08[405012]
    ),
    T_cell_Max_R08: scaleProcess(Lc_RackGroup.Rack08[405014], 0.1, 1),
    bmucellNoTcMax_R08: getHighLowByte(Lc_RackGroup.Rack08[405015]),
    T_cell_Min_R08: scaleProcess(Lc_RackGroup.Rack08[405016], 0.1, 1),
    bmucellNoTcMin_R08: getHighLowByte(Lc_RackGroup.Rack08[405017]),
    T_cell_MaxDiff_R08: scaleProcess(
      Lc_RackGroup.Rack08[405014] - Lc_RackGroup.Rack08[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R08: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack08[405014] - Lc_RackGroup.Rack08[405016]
    ),
    alarmCMU_R08_rawD: Lc_RackGroup.Rack08[405028],
    faultCMU_R08_rawD: Lc_RackGroup.Rack08[405030],
    DL_of_statusHW_R08: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack08[405032]
    ),

    Mode_R09: mapWordStatus(Lc_RackGroup.Rack09[405009], rackWorkStatus_MT),
    V_rack_R09: scaleProcess(Lc_RackGroup.Rack09[405005], 0.1, 1),
    I_rack_R09: scaleProcess(Lc_RackGroup.Rack09[405002], 0.1, 1),
    SOC_R09: scaleProcess(Lc_RackGroup.Rack09[405006], 0.01, 2),
    SOH_R09: scaleProcess(Lc_RackGroup.Rack09[405004], 0.01, 2),
    Impedance_R09: scaleProcess(Lc_RackGroup.Rack09[405020], 0.1, 1),
    V_cell_Max_R09: scaleProcess(Lc_RackGroup.Rack09[405010], 0.0001, 4),
    bmucellNoVcMax_R09: getHighLowByte(Lc_RackGroup.Rack09[405011]),
    V_cell_Min_R09: scaleProcess(Lc_RackGroup.Rack09[405012], 0.0001, 4),
    bmucellNoVcMin_R09: getHighLowByte(Lc_RackGroup.Rack09[405013]),
    V_cell_MaxDiff_R09: scaleProcess(
      Lc_RackGroup.Rack09[405010] - Lc_RackGroup.Rack09[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R09: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack09[405010] - Lc_RackGroup.Rack09[405012]
    ),
    T_cell_Max_R09: scaleProcess(Lc_RackGroup.Rack09[405014], 0.1, 1),
    bmucellNoTcMax_R09: getHighLowByte(Lc_RackGroup.Rack09[405015]),
    T_cell_Min_R09: scaleProcess(Lc_RackGroup.Rack09[405016], 0.1, 1),
    bmucellNoTcMin_R09: getHighLowByte(Lc_RackGroup.Rack09[405017]),
    T_cell_MaxDiff_R09: scaleProcess(
      Lc_RackGroup.Rack09[405014] - Lc_RackGroup.Rack09[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R09: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack09[405014] - Lc_RackGroup.Rack09[405016]
    ),
    alarmCMU_R09_rawD: Lc_RackGroup.Rack09[405028],
    faultCMU_R09_rawD: Lc_RackGroup.Rack09[405030],
    DL_of_statusHW_R09: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack09[405032]
    ),

    Mode_R10: mapWordStatus(Lc_RackGroup.Rack10[405009], rackWorkStatus_MT),
    V_rack_R10: scaleProcess(Lc_RackGroup.Rack10[405005], 0.1, 1),
    I_rack_R10: scaleProcess(Lc_RackGroup.Rack10[405002], 0.1, 1),
    SOC_R10: scaleProcess(Lc_RackGroup.Rack10[405006], 0.01, 2),
    SOH_R10: scaleProcess(Lc_RackGroup.Rack10[405004], 0.01, 2),
    Impedance_R10: scaleProcess(Lc_RackGroup.Rack10[405020], 0.1, 1),
    V_cell_Max_R10: scaleProcess(Lc_RackGroup.Rack10[405010], 0.0001, 4),
    bmucellNoVcMax_R10: getHighLowByte(Lc_RackGroup.Rack10[405011]),
    V_cell_Min_R10: scaleProcess(Lc_RackGroup.Rack10[405012], 0.0001, 4),
    bmucellNoVcMin_R10: getHighLowByte(Lc_RackGroup.Rack10[405013]),
    V_cell_MaxDiff_R10: scaleProcess(
      Lc_RackGroup.Rack10[405010] - Lc_RackGroup.Rack10[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R10: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack10[405010] - Lc_RackGroup.Rack10[405012]
    ),
    T_cell_Max_R10: scaleProcess(Lc_RackGroup.Rack10[405014], 0.1, 1),
    bmucellNoTcMax_R10: getHighLowByte(Lc_RackGroup.Rack10[405015]),
    T_cell_Min_R10: scaleProcess(Lc_RackGroup.Rack10[405016], 0.1, 1),
    bmucellNoTcMin_R10: getHighLowByte(Lc_RackGroup.Rack10[405017]),
    T_cell_MaxDiff_R10: scaleProcess(
      Lc_RackGroup.Rack10[405014] - Lc_RackGroup.Rack10[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R10: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack10[405014] - Lc_RackGroup.Rack10[405016]
    ),
    alarmCMU_R10_rawD: Lc_RackGroup.Rack10[405028],
    faultCMU_R10_rawD: Lc_RackGroup.Rack10[405030],
    DL_of_statusHW_R10: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack10[405032]
    ),

    Mode_R11: mapWordStatus(Lc_RackGroup.Rack11[405009], rackWorkStatus_MT),
    V_rack_R11: scaleProcess(Lc_RackGroup.Rack11[405005], 0.1, 1),
    I_rack_R11: scaleProcess(Lc_RackGroup.Rack11[405002], 0.1, 1),
    SOC_R11: scaleProcess(Lc_RackGroup.Rack11[405006], 0.01, 2),
    SOH_R11: scaleProcess(Lc_RackGroup.Rack11[405004], 0.01, 2),
    Impedance_R11: scaleProcess(Lc_RackGroup.Rack11[405020], 0.1, 1),
    V_cell_Max_R11: scaleProcess(Lc_RackGroup.Rack11[405010], 0.0001, 4),
    bmucellNoVcMax_R11: getHighLowByte(Lc_RackGroup.Rack11[405011]),
    V_cell_Min_R11: scaleProcess(Lc_RackGroup.Rack11[405012], 0.0001, 4),
    bmucellNoVcMin_R11: getHighLowByte(Lc_RackGroup.Rack11[405013]),
    V_cell_MaxDiff_R11: scaleProcess(
      Lc_RackGroup.Rack11[405010] - Lc_RackGroup.Rack11[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R11: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack11[405010] - Lc_RackGroup.Rack11[405012]
    ),
    T_cell_Max_R11: scaleProcess(Lc_RackGroup.Rack11[405014], 0.1, 1),
    bmucellNoTcMax_R11: getHighLowByte(Lc_RackGroup.Rack11[405015]),
    T_cell_Min_R11: scaleProcess(Lc_RackGroup.Rack11[405016], 0.1, 1),
    bmucellNoTcMin_R11: getHighLowByte(Lc_RackGroup.Rack11[405017]),
    T_cell_MaxDiff_R11: scaleProcess(
      Lc_RackGroup.Rack11[405014] - Lc_RackGroup.Rack11[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R11: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack11[405014] - Lc_RackGroup.Rack11[405016]
    ),
    alarmCMU_R11_rawD: Lc_RackGroup.Rack11[405028],
    faultCMU_R11_rawD: Lc_RackGroup.Rack11[405030],
    DL_of_statusHW_R11: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack11[405032]
    ),

    Mode_R12: mapWordStatus(Lc_RackGroup.Rack12[405009], rackWorkStatus_MT),
    V_rack_R12: scaleProcess(Lc_RackGroup.Rack12[405005], 0.1, 1),
    I_rack_R12: scaleProcess(Lc_RackGroup.Rack12[405002], 0.1, 1),
    SOC_R12: scaleProcess(Lc_RackGroup.Rack12[405006], 0.01, 2),
    SOH_R12: scaleProcess(Lc_RackGroup.Rack12[405004], 0.01, 2),
    Impedance_R12: scaleProcess(Lc_RackGroup.Rack12[405020], 0.1, 1),
    V_cell_Max_R12: scaleProcess(Lc_RackGroup.Rack12[405010], 0.0001, 4),
    bmucellNoVcMax_R12: getHighLowByte(Lc_RackGroup.Rack12[405011]),
    V_cell_Min_R12: scaleProcess(Lc_RackGroup.Rack12[405012], 0.0001, 4),
    bmucellNoVcMin_R12: getHighLowByte(Lc_RackGroup.Rack12[405013]),
    V_cell_MaxDiff_R12: scaleProcess(
      Lc_RackGroup.Rack12[405010] - Lc_RackGroup.Rack12[405012],
      0.1,
      1
    ),
    bgc_VcMaxDiff_R12: Determine_BGC_of_VcMaxDiff(
      Lc_RackGroup.Rack12[405010] - Lc_RackGroup.Rack12[405012]
    ),
    T_cell_Max_R12: scaleProcess(Lc_RackGroup.Rack12[405014], 0.1, 1),
    bmucellNoTcMax_R12: getHighLowByte(Lc_RackGroup.Rack12[405015]),
    T_cell_Min_R12: scaleProcess(Lc_RackGroup.Rack12[405016], 0.1, 1),
    bmucellNoTcMin_R12: getHighLowByte(Lc_RackGroup.Rack12[405017]),
    T_cell_MaxDiff_R12: scaleProcess(
      Lc_RackGroup.Rack12[405014] - Lc_RackGroup.Rack12[405016],
      0.1,
      1
    ),
    bgc_TcMaxDiff_R12: Determine_BGC_of_TcMaxDiff(
      Lc_RackGroup.Rack12[405014] - Lc_RackGroup.Rack12[405016]
    ),
    alarmCMU_R12_rawD: Lc_RackGroup.Rack12[405028],
    faultCMU_R12_rawD: Lc_RackGroup.Rack12[405030],
    DL_of_statusHW_R12: Determine_DL_of_RackHWStatus(
      Lc_RackGroup.Rack12[405032]
    )
  };
}

router.get("/operateinfo/battery/rack/:pageNumber", async (req, res) => {
  try {
    pageNumber = parseInt(req.params.pageNumber);
    globalPageNumber = parseInt(req.params.pageNumber);
    await queryRackData(req);
    res.render("Op_Bat_Rack", batteryRack_variables);
  } catch (error) {
    console.error(error);
    res.status(500).send("rack : Internal Server Error");
  }
});

router.get("/operateinfo/battery/rack/:pageNumber/:data", async (req, res) => {
  try {
    pageNumber = parseInt(req.params.pageNumber);
    globalPageNumber = parseInt(req.params.pageNumber);
    await queryRackData(req);
    const responseData = batteryRack_variables;
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send("rack : Internal Server Error");
  }
});
// //***************************************************************************************** */
router.use(bodyParser.json());

//各rack單獨彈出視窗
router.post("/getData", async (req, res) => {
  try {
    console.log("接收到前端請求");
    const blockId = req.body.blockId;
    console.log("blockId:" + blockId);

    console.log("globalPageNumber:" + globalPageNumber);

    const dataPromises = databases.map(async (dbName) => {
      const nanoDb = createNanoInstance(dbName);
      return getLatestDocument(nanoDb);
    });

    const allData = await Promise.all(dataPromises);
    const baseNumber = Math.ceil(globalPageNumber / 2);
    const isEvenPage = globalPageNumber % 2 === 0;
    const num = baseNumber - 1;
    const lcData = allData[num];
    //console.log("num: " + num);
    const Lc_RackGroup = isEvenPage ? lcData.RackSub2 : lcData.RackSub1;
    //console.log("判斷isEvenPage??" + isEvenPage);
    //console.log("Lc_RackGroup: " + Lc_RackGroup);

    const collectionMap = {
      1: "Rack01",
      2: "Rack02",
      3: "Rack03",
      4: "Rack04",
      5: "Rack05",
      6: "Rack06",
      7: "Rack07",
      8: "Rack08",
      9: "Rack09",
      10: "Rack10",
      11: "Rack11",
      12: "Rack12"
    };

    //判斷帶入哪個rack
    let selectedCollection = collectionMap[blockId];
    const alarmCMU_rawD = Lc_RackGroup[selectedCollection][405028];
    const faultCMU_rawD = Lc_RackGroup[selectedCollection][405030];
    const DL_of_statusHW = Lc_RackGroup[selectedCollection][405032];

    // console.log("alarmCMU_rawD: " + alarmCMU_rawD);
    // console.log("faultCMU_rawD: " + faultCMU_rawD);
    // console.log("DL_of_statusHW: " + DL_of_statusHW);
    // console.log("selectedCollection: " + selectedCollection);

    //回傳數值到前端 尚未帶點
    const data = {
      alarmCMU_rawD: alarmCMU_rawD.toString(2),
      faultCMU_rawD: faultCMU_rawD.toString(2),
      DL_of_statusHW: DL_of_statusHW.toString(2)
    };

    res.json(data);

    if (!lcData) {
      throw new Error("No data found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("伺服器錯誤");
  }
});

//***************************************************************************************** */
module.exports = router;

// app.listen(port, () => {
//    console.log(`應用程式正在監聽端口 ${port}`);
//  });
