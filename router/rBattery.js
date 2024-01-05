const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const Lc = require("../models/lcschema");
const Lc01 = Lc["Lc01"];
const Lc02 = Lc["Lc02"];
const Lc03 = Lc["Lc03"];
const Lc04 = Lc["Lc04"];
const router = express.Router();
const app = express();
const cors = require("cors");
const {
  scaleProcess,
  Convert_UInt_to_revBitString,
  Convert_UInt_to_BitString,
  mapWordStatus,
  getHighLowByte,
  Calculate_BMS_energy,
  Count_SpecificClosedBit,
  Determine_BGC_of_VcMaxDiff,
  Determine_BGC_of_TcMaxDiff,
  Determine_DL_of_RackHWStatus,
} = require("./function");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
router.use("/public", express.static(path.join(__dirname, "../public")));
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

router.get("/operateinfo/battery", async (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoSummary", { permission: "manager" });
});
//***************************************************************************************** */
//BMS的infodetail
router.get("/operateinfo/battery/infodetail/:pageNumber", async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pageNumber);
    //req.session.pageNumber = pageNumber;
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    //console.log("當前連接中的 collection 名稱：", collectionNames);

    let selectedCollection;

    // 根據 pageNumber 選擇不同的集合名稱
    const collectionMap = {
      1: "Lc01",
      2: "Lc01",
      3: "Lc02",
      4: "Lc02",
      5: "Lc03",
      6: "Lc03",
      7: "Lc04",
      // 8: "Lc04", // 如果需要處理 8，可以取消註解
    };

    selectedCollection = collectionMap[pageNumber];

    console.log(pageNumber);
    console.log(selectedCollection);

    if (!selectedCollection) {
      throw new Error(" infodetail : Invalid pageNumber ");
    }

    const baseNumber = Math.ceil(pageNumber / 2); // 取天花板值
    const subNumber = pageNumber % 2 === 0 ? 2 : 1;
    const No_of_BMS = `${baseNumber}-${subNumber}`;

    // 根據選擇的集合名稱查詢資料
    const lcData = await mongoose
      .model(selectedCollection)
      .findOne()
      .sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    //let processedPageNumber;
    if (pageNumber % 2 === 0) {
      // 偶數頁處理方式 傳遞資料給模板引擎，渲染頁面
      res.render("Op_Bat_InfoDetail", {
        permission: "manager",
        pageNumber,
        No_of_BMS,
        onlineV: scaleProcess(lcData.BMS2[404006], 0.1, 1),
        BMSsystemV: scaleProcess(lcData.BMS2[404002], 0.1, 1),
        BMSsystemI: scaleProcess(lcData.BMS2[404003], 0.1, 1),
        BMSsystemSOC: scaleProcess(lcData.BMS2[404007], 0.1, 1),
        BMSsystemSOH: scaleProcess(lcData.BMS2[404005], 0.1, 1),
        heartBeat: lcData.BMS2[404001],
        rackVoltDiff: scaleProcess(lcData.BMS2[404028], 0.1, 1),
        rackNoVmaxmin: getHighLowByte(lcData.BMS2[404042]),
        rackCurrDiff: scaleProcess(lcData.BMS2[404029], 0.1, 1),
        rackNoImaxmin: getHighLowByte(lcData.BMS2[404043]),
        rackSOCDiff: scaleProcess(lcData.BMS2[404027], 0.1, 1),
        V_cell_Max: scaleProcess(lcData.BMS2[404021], 0.0001, 4),
        rackNoVcMax: lcData.BMS2[404034],
        bmucellNoVcMax: getHighLowByte(lcData.BMS2[404035]),
        V_cell_Min: scaleProcess(lcData.BMS2[404022], 0.0001, 4),
        rackNoVcMin: lcData.BMS2[404036],
        bmucellNoVcMin: getHighLowByte(lcData.BMS2[404037]),
        V_cell_MaxDiff: scaleProcess(lcData.BMS2[404025], 0.1, 1),
        T_cell_Max: scaleProcess(lcData.BMS2[404023], 0.1, 1),
        rackNoTcMax: lcData.BMS2[404038],
        bmucellNoTcMax: getHighLowByte(lcData.BMS2[404039]),
        T_cell_Min: scaleProcess(lcData.BMS2[404024], 0.1, 1),
        rackNoTcMin: lcData.BMS2[404040],
        bmucellNoTcMin: getHighLowByte(lcData.BMS2[404041]),
        T_cell_MaxDiff: scaleProcess(lcData.BMS2[404026], 0.1, 1),
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
        tempAmb_1: scaleProcess(lcData.BMS2[404013], 0.1, 1),
        tempAmb_2: scaleProcess(lcData.BMS2[404014], 0.1, 1),
        rackNo_alarmCMU: lcData.BMS2[404054],
        rackNo_faultCMU: lcData.BMS2[404055],
        rackNo_faultPRelay: lcData.BMS2[404056],
        rackNo_faultNRelay: lcData.BMS2[404057],
        rackNo_faultFuse: lcData.BMS2[404058],
        rackNo_commSMUCMU: lcData.BMS2[404059],
        statusDI: Convert_UInt_to_revBitString(lcData.BMS2[404062], 16),
        faultHW: Convert_UInt_to_revBitString(lcData.BMS2[404048], 16),
        faultSMU: Convert_UInt_to_revBitString(lcData.BMS2[404061], 16),
        SOCcali: Convert_UInt_to_revBitString(lcData.BMS2[404060], 16),
        alarm: Convert_UInt_to_revBitString(lcData.BMS2[404044], 32),
        fault: Convert_UInt_to_revBitString(lcData.BMS2[404046], 32),
      });
    } else {
      // 奇數頁處理方式 傳遞資料給模板引擎，渲染頁面
      res.render("Op_Bat_InfoDetail", {
        permission: "manager",
        pageNumber,
        No_of_BMS,
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
        tempAmb_1: scaleProcess(lcData.BMS1[404013], 0.1, 1),
        tempAmb_2: scaleProcess(lcData.BMS1[404014], 0.1, 1),
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
        fault: Convert_UInt_to_revBitString(lcData.BMS1[404046], 32),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//***************************************************************************************** */
//BMS的RACK詳細資料
const rackWorkStatus_MT = {
  1: "開機",
  2: "自檢測",
  4: "工作",
  8: "故障",
  16: "關機",
  32: "升級",
  64: "ADC校正",
  128: "測試",
};

router.get("/operateinfo/battery/rack/:pageNumber", async (req, res) => {
  try {
    const pageNumber = parseInt(req.params.pageNumber);
    //req.session.pageNumber = pageNumber;
    const collections = mongoose.connection.collections;
    //const collectionNames = Object.keys(collections);
    //console.log("當前連接中的 collection 名稱：", collectionNames);

    // 根據 pageNumber 選擇不同的集合名稱
    const collectionMap = {
      1: "Lc01",
      2: "Lc01",
      3: "Lc02",
      4: "Lc02",
      5: "Lc03",
      6: "Lc03",
      7: "Lc04",
      // 8: "Lc04", // 如果需要處理 8，可以取消註解
    };

    let selectedCollection = collectionMap[pageNumber];

    console.log(pageNumber);
    console.log(selectedCollection);

    if (!selectedCollection) {
      throw new Error("rack : Invalid pageNumber");
    }

    const baseNumber = Math.ceil(pageNumber / 2); // 取天花板值
    const subNumber = pageNumber % 2 === 0 ? 2 : 1;
    const No_of_BMS = `${baseNumber}-${subNumber}`;

    // 根據選擇的集合名稱查詢資料
    const lcData = await mongoose
      .model(selectedCollection)
      .findOne()
      .sort({ time_log: -1 });

    if (!lcData) {
      throw new Error("No data found");
    }

    //let processedPageNumber;

    const isEvenPage = pageNumber % 2 === 0;
    const Lc_RackGroup = isEvenPage ? lcData.RackSub2 : lcData.RackSub1;

    res.render("Op_Bat_Rack", {
      permission: "manager",
      pageNumber,
      No_of_BMS,
      Mode_R01: mapWordStatus(Lc_RackGroup.Rack01[405009], rackWorkStatus_MT),
      V_rack_R01: scaleProcess(Lc_RackGroup.Rack01[405005], 0.1, 1),
      I_rack_R01: scaleProcess(Lc_RackGroup.Rack01[405002], 0.1, 1),
      SOC_R01: scaleProcess(Lc_RackGroup.Rack01[405006], 0.01, 2),
      SOH_R01: scaleProcess(Lc_RackGroup.Rack01[405004], 0.01, 2),
      Impedance_R01: scaleProcess(Lc_RackGroup.Rack01[405020], 0.1, 1),
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
      ),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("rack : Internal Server Error");
  }
});
//***************************************************************************************** */
app.use(bodyParser.json());

const database = {
  block1: "資料庫內容1",
  block2: "資料庫內容2",
  block3: "資料庫內容3",
};

router.post("/getData", (req, res) => {
  console.log('接收到前端請求');
  const blockId = req.body.blockId;
  console.log(blockId);
  const data = database[blockId];
  res.json(data);
});
//***************************************************************************************** */
module.exports = router;
//***************************************************************************************** */
