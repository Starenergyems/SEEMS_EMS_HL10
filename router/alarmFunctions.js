// testforalarm.js
const express = require("express");
const router = express.Router();
//const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");
const socket = require("socket.io");
const http = require("http");
const e = require("connect-flash");
const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
const axios = require("axios");
const moment = require('moment');

const lc1_rf01 = "lc1_rf01";
const lc1nanoDb = nano.use(lc1_rf01);
const lc2_rf01 = "lc2_rf01";
const lc2nanoDb = nano.use(lc2_rf01);
const lc3_rf01 = "lc3_rf01";
const lc3nanoDb = nano.use(lc3_rf01);
const lc4_rf01 = "lc4_rf01";
const lc4nanoDb = nano.use(lc4_rf01);
const alarm = "alarm";
const alarmnanoDb = nano.use(alarm);
//************************************************************* */
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
router.use(cors());
//************************************************************* */
// 創建 http 伺服器
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("okay");
// });

// 使用 WebSocket 連接伺服器
//const io = socket(server);

// 在資料庫連線時建立 changeStream
// mongoose.connection.once("open", () => {
//   const lc01ChangeStream = Lc01.watch();
//   const lc02ChangeStream = Lc02.watch();
//   const lc03ChangeStream = Lc03.watch();
//   const lc04ChangeStream = Lc04.watch();
//   const dcChangeStream = Dc.watch();
//   const gcChangeStream = Gc.watch();

//   // 監聽 change event
//   lc01ChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "lc01Table" });
//   });

//   lc02ChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "lc02Table" });
//   });

//   lc03ChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "lc03Table" });
//   });

//   lc04ChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "lc04Table" });
//   });

//   dcChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "dcTable" });
//   });

//   gcChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "gcTable" });
//   });
// });

// Socket.io 事件監聽
// io.on("connection", (socket) => {
//   console.log("alarmFun : A user connected");

//   // 斷開連接
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// Alarm //--------------------------------------------------------------------------------
const LC_System_402013 = {
  0: "Charging", 
  1: "Discharging", 
  2: "Non-operating mode",
};

const LC_System_402019 = {
  0: "Grid mode",
  1: "Off-grid mode",
};

const LC_System_402020 = {
  0: "Grid abnormal",
  1: "Grid normal",
};

const LC_System_402021 = {
  0: "Self-checking",
  1: "Microgrid power supply starting",
  2: "Grid power supply starting",
  3: "Microgrid power supply running",
  4: "Grid power supply running",
  5: "Fault",
  6: "Stopping",
  7: "Stopped",
  8: "Emergency stop",
  9: "Standby",
};

const LC_System_402048 = {
  0: "PCS_1_Comm_Error",
  1: "PCS_2_Comm_Error",
};

const LC_System_402050 = {
  0: "BMS_1_Comm_Error",
  1: "BMS_2_Comm_Error",
};

const LC_System_402099 = {
  0: "PCS fault",
  1: "LC-PCS communication fault",
  2: "System start fault",
  3: "Host computer communication fault",
  4: "PCS not ready fault",
  5: "LC-SMU communication fault",
  6: "SMU fault",
  7: "LC-BSC communication fault",
  8: "BSC fault",
  9: "Ctrlbox Node fault",
};

const LC_System_402100 = {
  0: "PCS unit alarm",
  1: "PCS unit fault",
  2: "LC-PCS communication alarm",
  3: "Low battery unit alarm",
  4: "High battery unit alarm",
  5: "LC-SMU communication alarm",
  6: "SMU unit alarm",
  7: "SMU unit fault",
  8: "Ammeter communication alarm",
  9: "PCS not ready alarm",
  10: "LC-BSC communication alarm",
  11: "BSC unit alarm",
  12: "BSC unit fault",
  13: "Measurement and Control comm fault alarm",
  14: "Ctrlbox Node Alarm",
};

const LC_System_error_table = {
  402013: { name: "LC_System_System CHG/DCG status", status: LC_System_402013, type: "int", location: "pending" },
  402019: { name: "LC_System_Running mode", status: LC_System_402019, type: "int", location: "pending" },
  402020: { name: "LC_System_Grid status", status: LC_System_402020, type: "int", location: "pending" },
  402021: { name: "LC_System_System status", status: LC_System_402021, type: "bit", location: "pending" },
  402048: { name: "LC_System_PCS communication status", status: LC_System_402048, type: "bit_abnormal", location: "pending" },
  402050: { name: "LC_System_BMS communication status", status: LC_System_402050, type: "bit_abnormal", location: "pending" },
  402099: { name: "LC_System_Fault status", status: LC_System_402099, type: "bit", location: "pending" },
  402100: { name: "LC_System_Alarm status", status: LC_System_402100, type: "bit", location: "pending" },
};

const LC_PCS_403001 = {
  1: "LV room door-opening protection",
  2: "Local emergency stop",
  3: "Remote emergency stop",
  5: "Smoke detection in low pressure room",
  13: "BMS communication exception",
  15: "Goose communication exception",
};

const LC_PCS_403002 = {
  1: "Heartbeat stopped",
  2: "Measuring board communication exception",
  10: "Distribution power supply exception",
};

const LC_PCS_403004 = {
  0: "Gas trip",
  1: "Gas alarm",
  2: "Oil temperature alarm",
  3: "Oil temperature trip",
  4: "Low oil level trip",
  5: "Low oil level alarm",
  6: "Oil pressure trip",
  8: "Medium voltage load switch 1",
  9: "Medium voltage load switch 2",
  10: "Medium voltage circuit breaker",
  11: "Medium voltage isolation switch",
  13: "High oil level alarm",
  14: "Winding temperature trip",
  15: "Winding temperature alarm",
};

const LC_PCS_403008 = {
  min: 0,
  max: 655,
  scale: 0.01,  
};

const LC_PCS_403009 = {
  6: "HV chamber access control",
  11: "External emergency stop",
  13: "HV chamber smoke sensor",
  14: "HV remote control",
};

const LC_PCS_403011 = {
  0: "Medium voltage load switch",
  1: "HV remote control opening",
  3: "BMS dry node",
  4: "Source network load fast power dispatch",
  6: "HV chamber remote control closing",
  7: "Transformer room access control",
  8: "Transformer room smoke sensor",
  9: "UPS fault alarm",
  10: "Grid node",
  11: "Medium voltage grounding switch",
  12: "Medium voltage grounding switch 1",
  13: "Medium voltage grounding switch 2",
  14: "Medium voltage grounding switch 3",
  15: "High oil level trip",
  16: "BMS dry node 1",
  17: "BMS dry node 2",
  18: "Load switch T-A",
  19: "Load switch T-B",
  20: "Load switch T-AB",
  21: "Load switch A-B",
};

const LC_PCS_403034 = {
  0: "Temperature exception alarm",
  1: "Low insulation impedance alarm",
  2: "GFRT running",
  4: "DC fuse exception",
  6: "DC sensor exception",
  7: "DC SPD alarm",
  8: "AC SPD alarm",
  9: "Battery voltage high",
  10: "Battery voltage low",
  12: "DC switch exception",
  13: "Fan 1 exception",
};

const LC_PCS_403035 = {
  0: "Branch board communication exception",
  1: "AC switch exception",
  2: "Fan 2 exception",
  3: "AC main contactor contact exception",
};

const LC_PCS_403036 = {
  0: "DC under voltage",
  1: "DC over voltage",
  2: "AC under voltage",
  3: "AC over voltage",
  4: "AC under frequency",
  5: "AC over frequency",
  6: "AC contactor fault",
  7: "Island protection",
  9: "Module protection",
  10: "Module over temperature",
  11: "Reactor over temperature",
  12: "Transformer over temperature",
  13: "Leakage current protection",
  15: "Overload protection",
  17: "Fan 1 fault",
  18: "DC fuse fault",
  20: "DC over current",
  21: "AC over current",
  23: "Ambient temperature exception",
  24: "Hardware fault",
};

const LC_PCS_403038 = {
  0: "Insulation impedance",
  1: "AC SPD fault",
  2: "Sampling fault",
  3: "Battery polarity reversed",
  5: "LCD-DSP communication fault",
  6: "AC current imbalance 1",
  7: "Host fault",
  8: "DC SPD fault",
  10: "DC component fault",
  11: "DC switch fault",
  12: "Machine code duplication fault",
  13: "Parallel communication fault",
  14: "Control cabinet temperature fault",
  16: "AC voltage imbalance fault",
  19: "AC switch fault",
  20: "Soft start fault",
  21: "DC voltage sampling fault",
  22: "Fan 2 fault",
  23: "AC current imbalance 2",
  24: "AC current imbalance 3",
  25: "Driver board fault",
  26: "Midpoint potential shift",
  27: "Carrier synchronization fault",
};

const LC_PCS_403040 = {
  0: "Charging",
  1: "Discharging",
  2: "Non-working state",
};

const LC_PCS_403049 = {
  0: "Running",
  3: "Key stop",
  4: "Standby",
  6: "Start in process",
  9: "Fault stop",
  10: "Alarm running",
  11: "Derating running",
  15: "Communication exception",
};

const LC_PCS_403054 = {
  0: "Off-grid",
  1: "On-grid",
};

const LC_PCS_403058 = {
  1: "AC switch status",
  2: "DC switch status",
  3: "DC fuse status",
  4: "DC auxiliary switch 1 status",
  5: "DC auxiliary switch 2 status",
};

const LC_PCS_error_table = {
  403001: { name: "LC_PCS_Overall fault status", status: LC_PCS_403001, type: "bit", location: "pending" },
  403002: { name: "LC_PCS_Overall alarm status", status: LC_PCS_403002, type: "bit", location: "pending" },
  403004: { name: "LC_PCS_Transformer node status", status: LC_PCS_403004, type: "bit", location: "pending" },
  403008: { name: "LC_PCS_Leakage current", status: LC_PCS_403008, type: "valve", location: "pending" },
  403009: { name: "LC_PCS_Transformer node status1", status: LC_PCS_403009, type: "bit", location: "pending" },
  403011: { name: "LC_PCS_Transformer node status2", status: LC_PCS_403011, type: "bit", location: "pending" },
  403034: { name: "LC_PCS_Alarm status1", status: LC_PCS_403034, type: "bit", location: "pending" },
  403035: { name: "LC_PCS_Alarm status2", status: LC_PCS_403035, type: "bit", location: "pending" },
  403036: { name: "LC_PCS_Fault status1", status: LC_PCS_403036, type: "bit", location: "pending" },
  403038: { name: "LC_PCS_Fault status2", status: LC_PCS_403038, type: "bit", location: "pending" },
  403040: { name: "LC_PCS_Charge status", status: LC_PCS_403040, type: "int", location: "pending" },
  403049: { name: "LC_PCS_Working status", status: LC_PCS_403049, type: "bit", location: "pending" },
  403054: { name: "LC_PCS_Grid status", status: LC_PCS_403054, type: "int", location: "pending" },
  403058: { name: "LC_PCS_Node status", status: LC_PCS_403058, type: "bit", location: "pending" },
};

const LC_BMS_404011 = {
  0: "First SOC calibrate tip clear[CMD]",
  1: "Second SOC calibrate tip clear[CMD]",
  2: "First SOC calibrate tip clear cancel[CMD]",
  3: "Second SOC calibrate tip clear cancel[CMD]",
  8: "Ready",
  9: "Idle",
  10: "Off-line",
  12: "Main switch off[CMD]",
  13: "Main switch on[CMD]",
  14: "Discharge mode",
  15: "Charge mode",
};

const LC_BMS_404044 = {
  0: "Cell over voltage alarm",
  1: "Cell under voltage alarm",
  2: "Total over voltage alarm",
  3: "Total under voltage alarm",
  4: "Pack over voltage alarm",
  5: "Pack under voltage alarm",
  6: "Cell voltage difference alarm",
  8: "Pack voltage difference alarm",
  9: "Cell over temperature alarm",
  10: "Cell low temperature alarm",
  11: "Cell temperature difference alarm",
  12: "Insulation leakage current alarm",
  20: "Over current alarm",
};

const LC_BMS_404046 = {
  0: "Cell over voltage fault",
  1: "Cell under voltage fault",
  2: "Total over voltage fault",
  3: "Total under voltage fault",
  4: "Pack over voltage fault",
  5: "Pack under voltage fault",
  7: "Total voltage difference fault",
  9: "Cell over temperature fault",
  10: "Cell low temperature fault",
  12: "Insulation leakage current fault",
  13: "CMU-BMU communication fault",
  14: "Voltage sample fault",
  15: "Temperature sample fault",
  17: "Current sample fault",
  18: "CMU-SMU communication fault",
  20: "Over current fault",
  21: "Polarity reversed fault",
  22: "Fuse fault",
  23: "Contactor fault",
};

const LC_BMS_404048 = {
  0: "Positive relay fault",
  1: "Negative relay fault",
  2: "Positive relay close fail",
  3: "Negative relay close fail",
  4: "Fuse open",
};

const LC_BMS_404061 = {
  0: "SMU-CMU communication fault",
  11: "Rack number protection",
  15: "System stop",
};

const LC_BMS_error_table = {
  404011: { name: "LC_BMS_System mode", status: LC_BMS_404011, type: "bit", location: "pending" },
  404044: { name: "LC_BMS_CMU alarm word", status: LC_BMS_404044, type: "bit", location: "pending" },
  404046: { name: "LC_BMS_CMU fault word", status: LC_BMS_404046, type: "bit", location: "pending" },
  404048: { name: "LC_BMS_Hardware fault word", status: LC_BMS_404048, type: "bit", location: "pending" },
  404061: { name: "LC_BMS_SMU fault status", status: LC_BMS_404061, type: "bit", location: "pending" },
};

const LC_Rack_405028 = {
  0: "Cell over voltage alarm",
  1: "Cell under voltage alarm",
  2: "Total over voltage alarm",
  3: "Total under voltage alarm",
  4: "Pack over voltage alarm",
  5: "Pack under voltage alarm",
  6: "Cell voltage difference alarm",
  8: "Pack voltage difference alarm",
  9: "Cell over temperature alarm",
  10: "Cell low temperature alarm",
  11: "Cell temperature difference alarm",
  12: "Insulation leakage current alarm",
  20: "Over current alarm",
};

const LC_Rack_405030 = {
  0: "Cell over voltage fault",
  1: "Cell under voltage fault",
  2: "Total over voltage fault",
  3: "Total under voltage fault",
  4: "Pack over voltage fault",
  5: "Pack under voltage fault",
  7: "Total voltage difference fault",
  9: "Cell over temperature fault",
  10: "Cell low temperature fault",
  12: "Insulation leakage current fault",
  13: "CMU-BMU communication fault",
  14: "Voltage sample fault",
  15: "Temperature sample fault",
  17: "Current sample fault",
  18: "CMU-BMU communication fault",
  20: "Over current fault",
  21: "Polarity reversed fault",
  22: "Fuse fault",
  23: "Contactor fault",
};

const LC_Rack_error_table = {
  405028: { name: "LC_Rack_CMU alarm word", status: LC_Rack_405028, type: "bit", location: "pending" },
  405030: { name: "LC_Rack_CMU fault word", status: LC_Rack_405030, type: "bit", location: "pending" },
};

const LC_BSC_406001 = {
  0: "Node 1 fault",
  1: "Node 2 fault",
  2: "Node 3 fault",
  3: "Node 4 fault",
  4: "Node 5 fault",
  5: "Node 6 fault",
  6: "Node 7 fault",
  7: "Node 8 fault",
  8: "Node 9 fault",
  9: "Node 10 fault",
  10: "Node 11 fault",
  11: "Node 12 fault",
  12: "Node 13 fault",
  13: "Node 14 fault",
  14: "Node 15 fault",
  15: "Node 16 fault",
  24: "UPS fault",
  25: "BSC-UPS communication fault",
  26: "Low combustible gas concentration alarm",
  27: "High combustible gas concentration alarm",
};

const LC_BSC_406003 = {
  0: "Node 1 alarm",
  1: "Node 2 alarm",
  2: "Node 3 alarm",
  3: "Node 4 alarm",
  4: "Node 5 alarm",
  5: "Node 6 alarm",
  6: "Node 7 alarm",
  7: "Node 8 alarm",
  8: "Node 9 alarm",
  9: "Node 10 alarm",
  10: "Node 11 alarm",
  11: "Node 12 alarm",
  12: "Node 13 alarm",
  13: "Node 14 alarm",
  14: "Node 15 alarm",
  15: "Node 16 alarm",
  23: "Humiture sensor communication alarm",
  25: "Ammeter communication alarm",
  26: "HVAC alarm",
  27: "HVAC communication alarm",
};

const LC_BSC_406005 = {
  0: "FFS alarm 1_Smoke or Temperature",
  1: "FFS alarm 2_Smoke and Temperature",
  2: "FFS fault",
};

const LC_BSC_406007 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406009 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406011 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406013 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406015 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406017 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406019 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406021 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406023 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406025 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406027 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406029 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406031 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406033 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406035 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406037 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406039 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406041 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406043 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406045 = {
  0: 'Comm error',
  1: 'Stop',
  2: 'Running',
  3: 'Fault',
  85: 'Not configured',
};

const LC_BSC_406047 = {
  min: -100,
  max: 200,
  scale: 0.1,  
};

const LC_BSC_406048 = {
  min: 0,
  max: 100,
  scale: 0.1,  
};

const LC_BSC_406049 = {
  min: -100,
  max: 200,
  scale: 0.1,  
};

const LC_BSC_406050 = {
  min: 0,
  max: 100,
  scale: 0.1,  
};

const LC_BSC_error_table = {
  406001: { name: "LC_BSC_Fault status", status: LC_BSC_406001, type: "bit", location: "pending" },
  406003: { name: "LC_BSC_Alarm status", status: LC_BSC_406003, type: "bit", location: "pending" },
  406005: { name: "LC_BSC_FFS status", status: LC_BSC_406005, type: "bit", location: "pending" },
  406007: { name: 'LC_BSC_HVAC_1 running status', status: LC_BSC_406007, type: "int", location: "pending" },
  406009: { name: 'LC_BSC_HVAC_2 running status', status: LC_BSC_406009, type: "int", location: "pending" },
  406011: { name: 'LC_BSC_HVAC_3 running status', status: LC_BSC_406011, type: "int", location: "pending" },
  406013: { name: 'LC_BSC_HVAC_4 running status', status: LC_BSC_406013, type: "int", location: "pending" },
  406015: { name: 'LC_BSC_HVAC_5 running status', status: LC_BSC_406015, type: "int", location: "pending" },
  406017: { name: 'LC_BSC_HVAC_6 running status', status: LC_BSC_406017, type: "int", location: "pending" },
  406019: { name: 'LC_BSC_HVAC_7 running status', status: LC_BSC_406019, type: "int", location: "pending" },
  406021: { name: 'LC_BSC_HVAC_8 running status', status: LC_BSC_406021, type: "int", location: "pending" },
  406023: { name: 'LC_BSC_HVAC_9 running status', status: LC_BSC_406023, type: "int", location: "pending" },
  406025: { name: 'LC_BSC_HVAC_10 running status', status: LC_BSC_406025, type: "int", location: "pending" },
  406027: { name: 'LC_BSC_HVAC_11 running status', status: LC_BSC_406027, type: "int", location: "pending" },
  406029: { name: 'LC_BSC_HVAC_12 running status', status: LC_BSC_406029, type: "int", location: "pending" },
  406031: { name: 'LC_BSC_HVAC_13 running status', status: LC_BSC_406031, type: "int", location: "pending" },
  406033: { name: 'LC_BSC_HVAC_14 running status', status: LC_BSC_406033, type: "int", location: "pending" },
  406035: { name: 'LC_BSC_HVAC_15 running status', status: LC_BSC_406035, type: "int", location: "pending" },
  406037: { name: 'LC_BSC_HVAC_16 running status', status: LC_BSC_406037, type: "int", location: "pending" },
  406039: { name: 'LC_BSC_HVAC_17 running status', status: LC_BSC_406039, type: "int", location: "pending" },
  406041: { name: 'LC_BSC_HVAC_18 running status', status: LC_BSC_406041, type: "int", location: "pending" },
  406043: { name: 'LC_BSC_HVAC_19 running status', status: LC_BSC_406043, type: "int", location: "pending" },
  406045: { name: 'LC_BSC_HVAC_20 running status', status: LC_BSC_406045, type: "int", location: "pending" },
  406047: { name: 'LC_BSC_TH_1 Temperature', status: LC_BSC_406047, type: "valve", location: "pending" },
  406048: { name: 'LC_BSC_TH_1 Humidity', status: LC_BSC_406048, type: "valve", location: "pending" },
  406049: { name: 'LC_BSC_TH_2 Temperature', status: LC_BSC_406049, type: "valve", location: "pending" },
  406050: { name: 'LC_BSC_TH_2 Humidity', status: LC_BSC_406050, type: "valve", location: "pending" },
};

const LC_error_table = {
  System: LC_System_error_table,
  PCS: LC_PCS_error_table,
  BMS: LC_BMS_error_table,
  BSC: LC_BSC_error_table,
  Rack: LC_Rack_error_table,
};

const Other_408154 = {
  0: "Enable alarm buzzer",
  1: "Shutdown timer countdown started",
  2: "Self-testing mode",
  3: "Online mode",
  4: "Fault",
  5: "Bypass mode",
  6: "Battery SOC low",
  7: "Utility abnormal",
};

const Other_408186 = {
  min: -300,
  max: 400,
  scale: 0.1,
};

const Other_408187 = {
  min: 0,
  max: 100,
  scale: 0.1,
};

const Other_408201 = {
  0: "51-1",
  1: "50-1",
  2: "51N-1",
  3: "50N-1",
  4: "51-2",
  5: "50-2",
  6: "51N-2",
  7: "50N-2",
  8: "51-3",
  9: "50-3",
  10: "51N-3",
  11: "50N-3",
  12: "51-4",
  13: "50-4",
  14: "51N-4",
  15: "50N-4",
};

const Other_408202 = {
  0: "27/59-1",
  1: "27/59-2",
  2: "27/59-3",
  3: "27/59-4",
  4: "59NIT",
  5: "59NDT",
  6: "81-1",
  7: "81-2",
  8: "81-3",
  9: "81-4",
};

const Other_408203 = {
  0: "51-1",
  1: "50-1",
  2: "51N-1",
  3: "50N-1",
  4: "51-2",
  5: "50-2",
  6: "51N-2",
  7: "50N-2",
  8: "51-3",
  9: "50-3",
  10: "51N-3",
  11: "50N-3",
  12: "51-4",
  13: "50-4",
  14: "51N-4",
  15: "50N-4",
};

const Other_408204 = {
  0: "FFS_01",
  1: "FFS_02",
  2: "FFS_03",
  3: "FFS_04",
  4: "FFS_05",
  5: "FFS_06",
  6: "FFS_07",
  7: "FFS_08",
  8: "FFS_09",
  9: "FFS_010",
  10: "FFS_011",
  11: "FFS_012",
  12: "FFS_013",
  13: "FFS_014",
  14: "FFS_015",
  15: "FFS_016",
};

const Other_408205 = {
  0: "VCB_Close",
  1: "VCB_Open",
  2: "VCB_Trip",
};

const Other_408206 = {
  0: "ACB_#-1_Close",
  1: "ACB_#-1_Open",
  2: "ACB_#-2_Close",
  3: "ACB_#-2_Open",
  4: "ACB_#-3_Close",
  5: "ACB_#-3_Open",
};

const Other_408207 = {
  0: "ACB_#-1_Close Ctrl",
  1: "ACB_#-1_Open Ctrl",
  2: "ACB_#-2_Close Ctrl",
  3: "ACB_#-2_Open Ctrl",
  4: "ACB_#-3_Close Ctrl",
  5: "ACB_#-3_Open Ctrl",
};

const Other_error_table = {
  408154: { name: "Other_UPS status", status: Other_408154, type: "bit", location: "pending" },
  408186: { name: "Other_Temperature", status: Other_408186, type: "valve", location: "pending" },
  408187: { name: "Other_Humidity", status: Other_408187, type: "valve", location: "pending" },
  408201: { name: "Other_Relay_MVCB-1", status: Other_408201, type: "bit", location: "pending" },
  408202: { name: "Other_Relay_MVCB-2", status: Other_408202, type: "bit", location: "pending" },
  408203: { name: "Other_Relay_VCB", status: Other_408203, type: "bit", location: "pending" },
  408204: { name: "Other_FFS Status", status: Other_408204, type: "bit", location: "pending" },
  408205: { name: "Other_VCB Status", status: Other_408205, type: "bit", location: "pending" },
  408206: { name: "Other_ACB Status", status: Other_408206, type: "bit", location: "pending" },
  408207: { name: "Other_ACB Control", status: Other_408207, type: "bit", location: "pending" },
};

const DC_error_table = {
  409101: { name: "DC_LC_Comm_Error", status: 1, type: "int", location: "pending" },
  409103: { name: "DC_Freq-M_Comm_Error", status: 1, type: "int", location: "pending" },
  409105: { name: "DC_ACPM_Comm_Error", status: 1, type: "int", location: "pending" },
  409107: { name: "DC_AuxMtot_Comm_Error", status: 1, type: "int", location: "pending" },
  409109: { name: "DC_AuxM_Comm_Error", status: 1, type: "int", location: "pending" },
  409111: { name: "DC_UPS_Comm_Error", status: 1, type: "int", location: "pending" },
  409113: { name: "DC_TR_Comm_Error", status: 1, type: "int", location: "pending" },
  409115: { name: "DC_TH_Comm_Error", status: 1, type: "int", location: "pending" },
  409117: { name: "DC_RelayMVCB_Comm_Error", status: 1, type: "int", location: "pending" },
  409119: { name: "DC_RelayVCB_Comm_Error", status: 1, type: "int", location: "pending" },
  409121: { name: "DC_RIO_CtrlRoom_Comm_Error", status: 1, type: "int", location: "pending" },
  409123: { name: "DC_RIO_MVCB_Comm_Error", status: 1, type: "int", location: "pending" },
  409125: { name: "DC_RIO_ACP_Comm_Error", status: 1, type: "int", location: "pending" },
  409127: { name: "DC_GC_Comm_Error", status: 1, type: "int", location: "pending" },
};

const GC_400033 = {
  threshold: 9500,
  count: 4,
};

const GC_400129 = {
  min: "Min_SOC_Limit",
  max: "Max_SOC_Limit",
  capacity: 3500000, //kWh
};

const GC_error_table = {
  400033: { name: "SBSPM", status: GC_400033, type: "threshold", location: "pending" },
  400129: { name: "SOC", status: GC_400129, type: "valve", location: "pending" },
};

// Alarm DB //--------------------------------------------------------------------------------
const Alarm_DB_config = { 
  lc1_rf10_System: LC_System_error_table,
  lc1_rf10_BMS1: LC_BMS_error_table,
  lc1_rf10_PCS1: LC_PCS_error_table,
  lc1_rf10_BSC1: LC_BSC_error_table,
  lc1_rf10_BMS2: LC_BMS_error_table,
  lc1_rf10_PCS2: LC_PCS_error_table,
  lc1_rf10_BSC2: LC_BSC_error_table,
  lc1_rf10_RackSub1_Rack01: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack02: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack03: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack04: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack05: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack06: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack07: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack08: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack09: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack10: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack11: LC_Rack_error_table,
  lc1_rf10_RackSub1_Rack12: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack01: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack02: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack03: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack04: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack05: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack06: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack07: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack08: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack09: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack10: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack11: LC_Rack_error_table,
  lc1_rf10_RackSub2_Rack12: LC_Rack_error_table,
  lc2_rf10_System: LC_System_error_table,
  lc2_rf10_BMS1: LC_BMS_error_table,
  lc2_rf10_PCS1: LC_PCS_error_table,
  lc2_rf10_BSC1: LC_BSC_error_table,
  lc2_rf10_BMS2: LC_BMS_error_table,
  lc2_rf10_PCS2: LC_PCS_error_table,
  lc2_rf10_BSC2: LC_BSC_error_table,
  lc2_rf10_RackSub1_Rack01: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack02: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack03: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack04: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack05: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack06: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack07: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack08: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack09: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack10: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack11: LC_Rack_error_table,
  lc2_rf10_RackSub1_Rack12: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack01: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack02: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack03: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack04: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack05: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack06: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack07: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack08: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack09: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack10: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack11: LC_Rack_error_table,
  lc2_rf10_RackSub2_Rack12: LC_Rack_error_table,
  lc3_rf10_System: LC_System_error_table,
  lc3_rf10_BMS1: LC_BMS_error_table,
  lc3_rf10_PCS1: LC_PCS_error_table,
  lc3_rf10_BSC1: LC_BSC_error_table,
  lc3_rf10_BMS2: LC_BMS_error_table,
  lc3_rf10_PCS2: LC_PCS_error_table,
  lc3_rf10_BSC2: LC_BSC_error_table,
  lc3_rf10_RackSub1_Rack01: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack02: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack03: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack04: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack05: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack06: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack07: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack08: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack09: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack10: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack11: LC_Rack_error_table,
  lc3_rf10_RackSub1_Rack12: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack01: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack02: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack03: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack04: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack05: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack06: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack07: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack08: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack09: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack10: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack11: LC_Rack_error_table,
  lc3_rf10_RackSub2_Rack12: LC_Rack_error_table,
  lc4_rf10_System: LC_System_error_table,
  lc4_rf10_BMS1: LC_BMS_error_table,
  lc4_rf10_PCS1: LC_PCS_error_table,
  lc4_rf10_BSC1: LC_BSC_error_table,
  lc4_rf10_BMS2: LC_BMS_error_table,
  lc4_rf10_PCS2: LC_PCS_error_table,
  lc4_rf10_BSC2: LC_BSC_error_table,
  lc4_rf10_RackSub1_Rack01: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack02: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack03: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack04: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack05: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack06: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack07: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack08: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack09: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack10: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack11: LC_Rack_error_table,
  lc4_rf10_RackSub1_Rack12: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack01: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack02: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack03: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack04: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack05: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack06: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack07: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack08: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack09: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack10: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack11: LC_Rack_error_table,
  lc4_rf10_RackSub2_Rack12: LC_Rack_error_table,
  dc_rf10: DC_error_table,
  other_rf10: Other_error_table,
  gc_rf10: GC_error_table,
};

function creat_Alarm_DB_docs(nanoDB,) {
  let alarm_doc_array = []
  for (let [key, value] of Object.entries(Alarm_DB_config)) {
    for (let [k, v] of Object.entries(value)) {
      let alarm_doc = {};
      if (v["type"] !== 'valve') {
        for (let [_k, _v] of Object.entries(v["status"])) {
          alarm_doc = {
            _id: `${key}:${k}:${_k}`,
            time: "time",
            device: key,
            location: v["location"],
            level: `${
              v["name"]
                .toLowerCase()
                .includes("fault")
                ? "Fault"
                : "Alarm"
            }`,
            content: `${v["name"]}:${_v}`,
            value: "value",
            trigger: false,
            read: false,
            recover: false,
            recover_time: "recover_time",
            occurrence_time: "occurrence_time",
          };
          alarm_doc_array.push(alarm_doc);
        }
      } else {
        const valve_status = {
          0: "Lower valve",
          1: "Greater valve",
        };
        for (let [_k, _v] of Object.entries(valve_status)) {
          alarm_doc = {
            _id: `${key}:${k}:${_k}`,
            time: "time",
            device: key,
            location: v["location"],
            level: `${
              v["name"]
                .toLowerCase()
                .includes("fault")
                ? "Fault"
                : "Alarm"
            }`,
            content:`${v["name"]}:${_v}`,
            value: "value",
            trigger: false,
            read: false,
            recover: false,
            recover_time: "recover_time",
            occurrence_time: "occurrence_time",
          };
          alarm_doc_array.push(alarm_doc);
        }
      }
    }
  }
  return alarm_doc_array
}

// Function to initialize the database
function init_Alarm_DB(nanoDB,) {
  const alarm_doc_array = creat_Alarm_DB_docs(nanoDB,)

  // Bulk insert initial documents
  nanoDB.bulk({ docs: alarm_doc_array })
    .then(response => {
      console.log('Database initialized successfully.');

      // Create the initialization flag document
      return nanoDB.insert({ _id: 'init_flag', initialized: true });
    })
    .then(() => {
      console.log('Initialization flag created.');
    })
    .catch(err => {
      console.error('Error initializing database:', err);
    });
}
// Functions //--------------------------------------------------------------------------------
function getLargestKey(obj) {
  // Get all keys of the object
  const keys = Object.keys(obj);
  // Check if there are any keys
  if (keys.length === 0) {
    return undefined; // or handle the case when the object is empty
  }
  // Convert keys to numbers and find the maximum
  const maxKey = Math.max(...keys.map(Number));
  return maxKey;
}

function mapBitToStatus(rawData, statusDict, error_arr, bit_arr, bit_status) {
  const bitlength = getLargestKey(statusDict);
  //console.log(bitlength);
  const rawBitString = rawData.toString(2);
  const bitString_rev = rawBitString
    .padStart(bitlength, "0")
    .slice(-bitlength)
    .split("")
    .reverse()
    .join("");
  //console.log(bitString_rev);

  // Iterate through each bit in the bit string
  for (let i = 0; i < bitString_rev.length; i++) {
    // Check if the current bit is set (1)
    if (bitString_rev[i] === bit_status) {
      // Find the corresponding value in the statusDict using the index
      let matchedValue = statusDict[i];

      // Add the matched value to the result array or use a placeholder for unmatched indices
      // error_arr.push(matchedValue !== undefined ? matchedValue : "Unknown");
      if (matchedValue !== undefined) {
        error_arr.push(matchedValue);
        bit_arr.push(i)
      }
    }
  }
  return [error_arr, bit_arr];
}

function checkPartialMatch(k, array) {
  // Convert a to lowercase for case-insensitive matching
  const lowercase_key = k.toLowerCase();
  // Iterate over each item in the array b
  for (let item of array) {
    // Convert the current item to lowercase for case-insensitive matching
    const lowercase_Item = item.toLowerCase();
    // Check if lowercaseA is included in lowercaseItem
    if (lowercase_key.includes(lowercase_Item)) {
      return item; // Return the matched item
    }
  }
  return null; // Return null if no match is found
}

function LC_error_result_unit(time, occurrence_time, error_table, key_error, tag, value, device, error_result,) {  
  let error_type = error_table[key_error][tag]["type"];

  if (error_type.includes("bit")) {
    let error_arr = [];
    let bit_arr = [];
    if (error_type === "bit") {
      bit_status = "1";
      [error_arr, bit_arr] = mapBitToStatus(
        value,
        error_table[key_error][tag]["status"],
        error_arr,
        bit_arr,
        bit_status,
      );
    } else if (error_type === "bit_abnormal") {
      bit_status = "0";
      [error_arr, bit_arr] = mapBitToStatus(
        value,
        error_table[key_error][tag]["status"],
        error_arr,
        bit_arr,
        bit_status,
      );
    }
    if (bit_arr.length > 0) {
      for (let i = 0; i < bit_arr.length; i++) {
        error_result[`${device}:${tag}:${bit_arr[i]}`] = {
          _id: `${device}:${tag}:${bit_arr[i]}`,
          time: time,
          location: error_table[key_error][tag]["location"],
          device: device,
          level: `${
            error_table[key_error][tag]["name"]
              .toLowerCase()
              .includes("fault")
              ? "Fault"
              : "Alarm"
          }`,
          content: error_arr[i],
          value: bit_status,
          read: false,
          recover: false,
          recover_time: "",
          occurrence_time: occurrence_time,
        };
        // console.log(error_result[`${device}:${tag}:${bit_arr[i]}`])
      }
    };
  } else {
    if (error_type === "int") {
      if (error_table[key_error][tag]["status"][value]) {
        error_result[`${device}:${tag}:${value}`] = {
          _id: `${device}:${tag}:${value}`,
          time: time,
          location: error_table[key_error][tag]["location"],
          device: device,
          level: `${
            error_table[key_error][tag]["name"]
              .toLowerCase()
              .includes("fault")
              ? "Fault"
              : "Alarm"
          }`,
          content: error_table[key_error][tag]["status"][value],
          value: value,
          read: false,
          recover: false,
          recover_time: "",
          occurrence_time: occurrence_time,
        };
        // console.log(error_result[`${device}:${tag}:${value}`])
      };
    } else if (error_type === "valve") {
      value = value * error_table[key_error][tag]["status"]["scale"];
      let min = error_table[key_error][tag]["status"]["min"];
      let max = error_table[key_error][tag]["status"]["max"];
      // console.log(v)
      let valve_status = "";
      let content = "";
      if (value < min) {valve_status = "0"; content = "Lower valve"; } else if (value > max) {valve_status = "1"; content = "Greater valve"; };
      if (valve_status && content) {
        error_result[`${device}:${tag}:${valve_status}`] = {
          _id: `${device}:${tag}:${valve_status}`,
          time: time,
          location: error_table[key_error][tag]["location"],
          device: device,
          level: `${
            error_table[key_error][tag]["name"]
              .toLowerCase()
              .includes("fault")
              ? "Fault"
              : "Alarm"
          }`,
          content: content,
          value: value,
          read: false,
          recover: false,
          recover_time: "",
          occurrence_time: occurrence_time,
        };
        // console.log(error_result[`${device}:${tag}:${valve_status}`])
      }
    }
  }
}

function LC_error_result_gen(item, db_name, error_table=LC_error_table) {
  //console.dir(item)
  //console.log(Object.keys(item._doc)) //mongodb obj, data is under the _doc key
  //console.log(Object.keys(error_table))
  const time = current_locale_time();
  const occurrence_time = item.time;
  const error_result = {};
  for (let key in item) {
    if (item.hasOwnProperty(key)) {
      key_error = checkPartialMatch(key, Object.keys(error_table));
      if (key_error) {
        // console.log(key_error)
        if (key_error !== "Rack") {
          for (let tag in error_table[key_error]) {
            // console.log(key)
            // console.log(tag)
            // console.log(item[key][tag])
            //console.log(error_table[key_error][tag]['name'])
            // console.log(item[key])
            //console.log(mapBitToStatus(item[key][tag], error_table[key_error][tag]['status']))
            let value = item[key][tag];
            let device = `${db_name}_${key}`;
            LC_error_result_unit(time, occurrence_time, error_table, key_error, tag, value, device, error_result,);
          }
        } else {
          inner_item = item[key];
          for (let inner_key in inner_item) {
            for (let tag in error_table[key_error]) {
              // console.log(inner_item[inner_key][tag])
              //console.log(error_table[key_error][tag]['name'])
              //console.log(item[key])
              //console.log(mapBitToStatus(item[key][tag], error_table[key_error][tag]['status']))
              let value = inner_item[inner_key][tag];
              let device = `${db_name}_${key}_${inner_key}`;
              LC_error_result_unit(time, occurrence_time, error_table, key_error, tag, value, device, error_result,);
            }
          }
        }
      }
    }
  }
  return error_result;
}

function DC_error_result_gen(item, db_name, error_table=DC_error_table) {
  const time = current_locale_time();
  const occurrence_time = item.time;
  const error_result = [];
  // console.log(Object.keys(error_table))
  for (let [key, v] of Object.entries(item)) {
    if (typeof v === "object" && v !== null) {
      //console.log(Object.keys(value))
      for (let [tag, value] of Object.entries(v)) {
        if (Object.keys(error_table).includes(tag)) {
          // console.log(key, tag, status)
          if (value === error_table[tag]["status"]) {
            let device = `${db_name}_${key}`;
            
            error_msg = {
              time: time,
              location: db_name,
              device: device,
              level: `${
                error_table[tag]["name"].toLowerCase().includes("fault")
                  ? "Fault"
                  : "Alarm"
              }`,
              content: [
                `${tag}:${error_table[tag]["name"]}`,
                error_table[tag]["name"],
              ],
              value: value,
              read: false,
              recover: false,
              recover_time: "",
              occurrence_time: occurrence_time,
            };
            error_result.push(error_msg);
          }
        }
      }
    }
  }
  return error_result;
}

function Other_error_result_unit(db_name, time, occurrence_time, error_table, tag, value, device, error_result,) {
  let error_arr = [];
  let error_type = error_table[tag]["type"];

  if (error_type === "bit") {
    [error_arr, value] = mapBitToStatus(
      value,
      error_table[tag]["status"],
      error_arr
    );
  } else if (error_type === "int") {
    if (error_table[tag]["status"][value]) {
      error_arr.push(error_table[tag]["status"][value]);
    };
  } else if (error_type === "bit_abnormal") {
    [error_arr, value] = mapBitToStatus_abnormal(
      value,
      error_table[tag]["status"],
      error_arr
    );
  } else if (error_type === "valve") {
    value = value * error_table[tag]["status"]["scale"];
    let min = error_table[tag]["status"]["min"];
    let max = error_table[tag]["status"]["max"];
    // console.log(v)
    if (value < min) {
      error_arr.push(`Value is less than ${min}`);
    } else if (value > max) {
      error_arr.push(`Value is greater than ${max}`);
    }
  }
  if (error_arr.length > 0) {
    // console.log(error_arr);
    for (const e of error_arr) {
      // console.log(e);
      error_msg = {
        time: time,
        location: db_name,
        device: device,
        level: `${
          error_table[tag]["name"]
            .toLowerCase()
            .includes("fault")
            ? "Fault"
            : "Alarm"
        }`,
        content: [
          `${tag}:${error_table[tag]["name"]}`,
          e,
        ],
        value: value,
        read: false,
        recover: false,
        recover_time: "",
        occurrence_time: occurrence_time,
      };
      error_result.push(error_msg);
    }
  }
}

function Other_error_result_gen(item, db_name, error_table=Other_error_table) {
  const time = current_locale_time();
  const occurrence_time = item.time;
  const error_result = [];
  // console.log(Object.keys(error_table))
  for (let [key, v] of Object.entries(item)) {
    if (typeof v === "object" && v !== null) {
      //console.log(Object.keys(v))
      for (let [tag, value] of Object.entries(v)) {
        if (Object.keys(error_table).includes(tag)) {
          // console.log(key, tag, value)
          let device = `${db_name}_${key}`;
          Other_error_result_unit(db_name, time, occurrence_time, error_table, tag, value, device, error_result,)
        }
      }
    }
  }
  return error_result;
}

function compare_trigger_alarms(error_result, response) {
  // console.log(error_result)
  // console.log(response)
  let triggering_alarm_array = [];
  Object.keys(error_result).forEach(key => {
    triggering_alarm_array.push(key);
  });
  // console.log(triggering_alarm_array);

  let triggered_alarm_array = [];
  response.docs.forEach(element => triggered_alarm_array.push(element._id));
  // console.log(triggered_alarm_array);

  const remain = triggering_alarm_array.filter(element => triggered_alarm_array.includes(element));
  const income = triggering_alarm_array.filter(element => !triggered_alarm_array.includes(element));
  const recover = triggered_alarm_array.filter(element => !triggering_alarm_array.includes(element));

  return {
    remain,
    income,
    recover,
  }
}

function update_trigger_alarms_atomic(error_result, compare_result, nanoDB) {
  // update for the remain alarms
  // console.log("remain_promises");
  const remain_promises = compare_result.remain.map(_id => {
    return nanoDB.get(_id)
        .then(doc => {
            doc.recover = false;
            doc.time = error_result[_id]["time"];
            doc.value = error_result[_id]["value"];
            // console.log(doc);
            return nanoDB.insert(doc);
        })
        .catch(err => {
            if (err.statusCode === 404) {
                console.error('Data not found in update_trigger_alarms:', err.request.data);
            } else if (err.statusCode === 409) {
                console.error('Error update conflict update_trigger_alarms flag:', err.request.data)
            } else {
                console.error('Error checking update_trigger_alarms flag:', err.request.data);
            }
        });
  });
  // update for the new income alarms
  // console.log("income_promises");
  const income_promises = compare_result.income.map(_id => {
      return nanoDB.get(_id)
          .then(doc => {
            console.error('Data existed in update_trigger_alarms:', doc._id);
          }) 
          .catch(err => {
              if (err.statusCode === 404) {
                  nanoDB.insert(error_result[_id]);
              } else if (err.statusCode === 409) {
                  console.error('Error update conflict update_trigger_alarms flag:', err.request.data)
              } else {
                  console.error('Error checking update_trigger_alarms flag:', err.request.data);
              }
          });
  });

  // update for the recover alarms
  // console.log("recover_promises");
  const recover_promises = compare_result.recover.map(_id => {
    return nanoDB.get(_id)
        .then(doc => {
            doc.recover = true;
            doc.recover_time = current_locale_time(); 
            // console.log(doc);
            return nanoDB.insert(doc);
        })
        .catch(err => {
            if (err.statusCode === 404) {
                console.error('Data not found in update_trigger_alarms:', err.request.data);
            } else if (err.statusCode === 409) {
                console.error('Error update conflict update_trigger_alarms flag:', err.request.data)
            } else {
                console.error('Error checking update_trigger_alarms flag:', err.request.data);
            }
        });
  });

  const promises = [
    ...remain_promises, 
    ...income_promises, 
    ...recover_promises
  ];
  // Use Promise.all to wait for all promises to resolve
  Promise.all(promises)
      .then(() => {
          console.log("Promise.all in update_trigger_alarms: Suc!");
      })
      .catch(err => {
          console.error('Error in Promise.all in update_trigger_alarms:', err.request.data);
      });
}

function update_trigger_alarms_batch(error_result, compare_result, nanoDB, line_flag=false) {
  // update for the remain alarms
  // console.log("remain_promises");
  let remain_promises = true;
  if (compare_result.remain.length > 0) {
    remain_promises = nanoDB.fetch({keys: compare_result.remain})
      .then((resp) => {
        let docs_batch = resp.rows.map((element) => {
          if (element.hasOwnProperty("error")) {
            const _id = element.key;
            return error_result[_id];
          } else if (element.hasOwnProperty("doc")) {
            const _id = element.doc._id;
            let doc = element.doc;
            error_result[_id]["_rev"] = doc._rev;
            return error_result[_id];
          }
        })
        // console.log(docs_batch)
        return nanoDB.bulk({docs: docs_batch});
      })
      .catch(err => {
          if (err.statusCode === 404) {
              console.error('Data not found in update_trigger_alarms:', err.request.data);
          } else if (err.statusCode === 409) {
              console.error('Error update conflict update_trigger_alarms flag:', err.request.data)
          } else {
              console.error('Error checking update_trigger_alarms flag:', err.request.data);
          }
      })
  };
  
  // update for the new income alarms
  // console.log("income_promises");
  let income_promises = true;
  if (compare_result.income.length > 0) {
    income_promises = nanoDB.fetch({keys: compare_result.income})
      .then((resp) => {
        // console.log(resp)
        let docs_batch = resp.rows.map((element) => {
          if (element.hasOwnProperty("error")) {
            const _id = element.key;
            if (line_flag) {
              sendLineNotify(error_result[_id]);
            }
            return error_result[_id];
          } else if (element.hasOwnProperty("doc")) {
            const _id = element.doc._id;
            let doc = element.doc;
            error_result[_id]["_rev"] = doc._rev;
            return error_result[_id];
          }
        })
        // console.log(docs_batch)
        return nanoDB.bulk({docs: docs_batch});
      })
      .catch(err => {
          if (err.statusCode === 404) {
              console.error('Data not found in update_trigger_alarms:', err.request.data);
          } else if (err.statusCode === 409) {
              console.error('Error update conflict update_trigger_alarms flag:', err.request.data)
          } else {
              console.error('Error checking update_trigger_alarms flag:', err);
          }
      })
  };
  
  // update for the recover alarms
  // console.log("recover_promises");
  let recover_promises = true;
  if (compare_result.recover.length > 0) {
    recover_promises = nanoDB.fetch({keys: compare_result.recover})
      .then((resp) => {
        let docs_batch = resp.rows.map((element) => {
         if (element.hasOwnProperty("doc")) {
            const _id = element.doc._id;
            let doc = element.doc;
            doc.recover = true;
            doc.recover_time = current_locale_time(); 
            return doc;
          }
        })
        // console.log(docs_batch)
        return nanoDB.bulk({docs: docs_batch});
      })
      .catch(err => {
          if (err.statusCode === 404) {
              console.error('Data not found in update_trigger_alarms:', err.request.data);
          } else if (err.statusCode === 409) {
              console.error('Error update conflict update_trigger_alarms flag:', err.request.data)
          } else {
              console.error('Error checking update_trigger_alarms flag:', err.request.data);
          }
      })
  };

  const promises = [
    remain_promises, 
    income_promises, 
    recover_promises,
  ];
  console.log(promises);
  // Use Promise.all to wait for all promises to resolve
  Promise.all(promises)
      .then(() => {
          console.log("Promise.all in update_trigger_alarms: Suc!");
      })
      .catch(err => {
          console.error('Error in Promise.all in update_trigger_alarms:', err);
      });
}

function sendLineNotify(error_result_item) {
  const message = `
    \nLevel: \n  ${error_result_item["level"]} 
    \nLocation: \n  ${error_result_item["location"]}
    \nDevice: \n  ${error_result_item["device"]}
    \nValue: \n  ${error_result_item["value"]}
    \nWarning: \n  ${error_result_item["content"].replace(/\[|\]/g, "_")}
  `
  const accessToken = "HoAxmTKOKPFSq2bPOQyP0d0Wn270PX30FQRbNC2RLpz";
  const request = {
    method: "post",
    //url: 'http://192.168.8.112/line-notify',
    url: "https://notify-api.line.me/api/notify",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      message: message,
    },
  };

  axios(request)
    .then((resp) => {
      console.log(resp.data);
    })
    .catch((err) => {
      console.error("Line Notify Error", err.response.data ,err.response.request.path);
    });
}

function current_locale_time() {
  const date = new Date();

  const formattedString = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ');

  return formattedString;
}
//************************************************************* */
router.use(async (req, res, next) => {
  try {
    const indexDef = {
      index: { fields: ["time"] },
      name: "time_index",
    };

    await lc1nanoDb.createIndex(indexDef);
    await lc2nanoDb.createIndex(indexDef);
    await lc3nanoDb.createIndex(indexDef);
    await lc4nanoDb.createIndex(indexDef);

    const mangoQuery = {
      selector: {
        time: { $exists: true },
      },
      sort: [{ time: "desc" }],
      limit: 1,
    };

    lc1nanoDb.find(mangoQuery, async (err, body) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const Data = body.docs[0]; // 取得數據的第一個元素
      console.log("AA----------------------------------------------AA");
      console.log(Data);

      const data = {};

      Object.entries(scaleAndPointMapping).forEach(
        ([property, { scale, point }]) => {
          const originalValue = Data.Freq[property];
          const scaledValue = scaleProcess(originalValue, scale, point);
          data[property] = scaledValue;
          console.log("屬性", property);
          console.log("原始數值", originalValue);
          console.log("轉換後數值", scaledValue);
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
  next(); // 繼續執行後續的中間件或路由處理
});

// router.use(async (req, res, next) => {
//   try {
//     // 中間件的內容

//     // 假設你已經處理了數據並將結果存儲在 data 中
//     res.json({ success: true, data }); // 將數據以 JSON 格式發送到客戶端
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// });

//************************************************************* */
// async function getAllData() {
//   try {
//     // 使用 find 方法來取得整個 Lc01 Collection 的數據
//     const allData = await lc01Data.find({});
//     console.log("All Lc01 Collection Data:", allData);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }
// // 呼叫函數以取得整個 Collection 的數據
// getAllData();

//************************************************************* */
// async function getSpecificDocumentById(documentId) {
//   try {
//     // 使用 findById 方法來取得"指定"文檔的數據
//     const specificDocument = await lc01Data.findById(documentId);
//     console.log("Specific Lc01 Document Data:", specificDocument);
//   } catch (error) {
//     console.error("Error fetching specific document:", error);
//   }
// }

// // 呼叫函數以取得指定文檔的數據，替換 'yourDocumentId' 為實際的文檔 ID
// getSpecificDocumentById("yourDocumentId");

//************************************************************* */
//取得最新的一筆數據，並且只擷取 PCS1 中的 403001 欄位
// async function getLatestData() {
//   try {
//     // 使用 findOne 方法來取得"最新的" Lc01 文檔
//     const latestData = await lc01Data.findOne(
//       {},
//       {},
//       { sort: { time_log: -1 } }
//     );

//     // 檢查是否有找到文檔
//     if (latestData) {
//       // 取出指定的欄位，可選的鏈接運算符 ? 在取得值之前檢查 PCS1 是否存在
//       const pcs1Value = latestData.PCS1?.["403001"];

//       // 輸出結果
//       console.log("Latest Data - PCS1 403001:", pcs1Value);
//     } else {
//       console.log("No data found");
//     }
//   } catch (error) {
//     console.error("Error fetching latest data:", error);
//   }
// }

// 呼叫函數以取得最新的文檔中的指定欄位
//getLatestData();

//************************************************************* */
// async function processData(data, latestAlarmData, Alarm, error_table) {
//   // 創建一個 Set 來存儲已經存在於 Alarm 中的文檔的 _id
//   //console.log("A New data in Data:", data);
//   //console.log("B New data in Data:", latestAlarmData);
//   const existingIds = new Set(
//     latestAlarmData.map((item) => item._id.toString())
//   );

//   // 遍歷 data，將不在 Alarm 中的文檔加入 Alarm，或更新已存在的文檔
//   for (const item of data) {
//     //console.log('here')
//     //console.log(item)

//     const idString = item._id.toString();
//     const existingDoc = latestAlarmData.find(
//       (doc) => doc._id.toString() === idString
//     );

//     console.log(error_result_gen(item, error_table));

//     if (!existingDoc) {
//       // 如果 Alarm 中沒有該文檔，則新增
//       if (item.value > 50000) {
//         await Alarm.create({
//           _id: item._id,
//           value: item.value,
//           timestamp: item.timestamp,
//         });

//         // 添加 console.log 语句以输出 lc01Data 中的数值
//         //console.log("New data in Data:", item.value);
//       }
//     } else {
//       // 如果 Alarm 中已經存在該文檔，則更新數值或刪除
//       if (item.value > 50000) {
//         // 更新數值
//         if (existingDoc.value !== item.value) {
//           await Alarm.findByIdAndUpdate(existingDoc._id, {
//             value: item.value,
//             timestamp: item.timestamp,
//           });

//           // 添加 console.log 语句以输出 lc01Data 中的数值
//           //console.log("Updated data in lc01Data:", item.value);
//         }
//       } else {
//         // 小於等於 50000 則刪除
//         await Alarm.findByIdAndDelete(existingDoc._id);

//         // 添加 console.log 语句以输出 lc01Data 中的数值
//         //console.log("Deleted data in lc01Data:", item.value);
//       }
//     }
//     existingIds.add(idString);
//   }
// }

router.get("/testforalarm", (req, res) => {
  // 在這裡定義渲染 middleware 頁面的邏輯
  res.render("testforalarm");
});

// 修改為：
module.exports = {
  router,
  LC_error_result_gen,
  DC_error_result_gen,
  Other_error_result_gen,
  sendLineNotify,
  init_Alarm_DB,
  compare_trigger_alarms,
  update_trigger_alarms_batch,
};
