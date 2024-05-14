const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const cors = require("cors");
const socket = require("socket.io");
const http = require("http");
const e = require("connect-flash");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const axios = require("axios");
const moment = require("moment");
require('dotenv').config();

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
  402013: {
    name: "System CHG/DCG status",
    status: LC_System_402013,
    type: "int_bit",
    location: "ESS?x-1",
    line: false,
    category: "system",
  },
  402019: {
    name: "Running mode",
    status: LC_System_402019,
    type: "int_bit",
    location: "ESS?x-1",
    line: false,
    category: "system",
  },
  402020: {
    name: "Grid status",
    status: LC_System_402020,
    type: "int_bit",
    location: "ESS?x-1",
    line: false,
    category: "system",
  },
  402021: {
    name: "System status",
    status: LC_System_402021,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "system",
  },
  402048: {
    name: "PCS communication status",
    status: LC_System_402048,
    type: "bit_abnormal",
    location: "ESS?x-1",
    line: false,
    category: "pcs",
  },
  402050: {
    name: "BMS communication status",
    status: LC_System_402050,
    type: "bit_abnormal",
    location: "ESS?x-1",
    line: false,
    category: "battery",
  },
  402099: {
    name: "Fault status",
    status: LC_System_402099,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "system",
  },
  402100: {
    name: "Alarm status",
    status: LC_System_402100,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "system",
  },
};

const LC_PCS_403063 = {
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

const LC_PCS_403067 = {
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

const LC_PCS_403102 = {
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

const LC_PCS_403106 = {
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

const LC_PCS_403534 = {
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

const LC_PCS_403538 = {
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

const LC_PCS_error_table = {
  // 403001: { name: "LC_PCS_Overall fault status", status: LC_PCS_403001, type: "bit", location: "ESS?x-1", line: true },
  // 403002: { name: "LC_PCS_Overall alarm status", status: LC_PCS_403002, type: "bit", location: "ESS?x-1", line: true },
  // 403004: { name: "LC_PCS_Transformer node status", status: LC_PCS_403004, type: "bit", location: "ESS?x-1", line: true },
  // 403008: { name: "LC_PCS_Leakage current", status: LC_PCS_403008, type: "valve", location: "ESS?x-1", line: false },
  // 403009: { name: "LC_PCS_Transformer node status1", status: LC_PCS_403009, type: "bit", location: "ESS?x-1", line: true },
  // 403011: { name: "LC_PCS_Transformer node status2", status: LC_PCS_403011, type: "bit", location: "ESS?x-1", line: true },
  // 403034: { name: "LC_PCS_Alarm status1", status: LC_PCS_403034, type: "bit", location: "ESS?x-1", line: true },
  // 403035: { name: "LC_PCS_Alarm status2", status: LC_PCS_403035, type: "bit", location: "ESS?x-1", line: true },
  // 403036: { name: "LC_PCS_Fault status1", status: LC_PCS_403036, type: "bit", location: "ESS?x-1", line: true },
  // 403038: { name: "LC_PCS_Fault status2", status: LC_PCS_403038, type: "bit", location: "ESS?x-1", line: true },
  // 403040: { name: "LC_PCS_Charge status", status: LC_PCS_403040, type: "int_bit", location: "ESS?x-1", line: false },
  // 403049: { name: "LC_PCS_Working status", status: LC_PCS_403049, type: "bit", location: "ESS?x-1", line: true },
  // 403054: { name: "LC_PCS_Grid status", status: LC_PCS_403054, type: "int_bit", location: "ESS?x-1", line: false },
  // 403058: { name: "LC_PCS_Node status", status: LC_PCS_403058, type: "bit", location: "ESS?x-1", line: true },
  403063: {
    name: "Unit 1_Alarm status1",
    status: LC_PCS_403063,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "pcs",
  },
  403067: {
    name: "Unit 1_Fault status2",
    status: LC_PCS_403067,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "pcs",
  },
  403102: {
    name: "Unit 2_Alarm status1",
    status: LC_PCS_403102,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "pcs",
  },
  403106: {
    name: "Unit 2_Fault status2",
    status: LC_PCS_403106,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "pcs",
  },
  403534: {
    name: "Alarm status1",
    status: LC_PCS_403534,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "pcs",
  },
  403538: {
    name: "Fault status2",
    status: LC_PCS_403538,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "pcs",
  },
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
  404011: {
    name: "System mode",
    status: LC_BMS_404011,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "battery",
  },
  404044: {
    name: "CMU alarm word",
    status: LC_BMS_404044,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "battery",
  },
  404046: {
    name: "CMU fault word",
    status: LC_BMS_404046,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "battery",
  },
  404048: {
    name: "Hardware fault word",
    status: LC_BMS_404048,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "battery",
  },
  404061: {
    name: "SMU fault status",
    status: LC_BMS_404061,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "battery",
  },
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
  405028: {
    name: "CMU alarm word",
    status: LC_Rack_405028,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "battery",
  },
  405030: {
    name: "CMU fault word",
    status: LC_Rack_405030,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "battery",
  },
};

const LC_BSC_406001 = {
  0: "BSP AC Contactor open",
  1: "System EPO",
  2: "BSP AC SPD",
  3: "BSP UPS utility fail",
  4: "BCP internal over temperature",
  5: "BSP power supply over temperature",
  6: "FFS fault",
  7: "FFS fire alarm(消防水霧啟動)",
  8: "FFS spray",
  9: "Container door open",
  10: "BCP1-1 DC SPD",
  11: "BCP1-1 fuse",
  12: "BCP1-2 fuse",
  15: "BSP transformer over temperature",
  24: "UPS fault",
  25: "BSC-UPS communication fault",
  26: "Low combustible gas concentration alarm",
  27: "High combustible gas concentration alarm"
  
};

const LC_BSC_406003 = {
  0: "BSP AC Contactor open",
  1: "System EPO",
  2: "BSP AC SPD",
  3: "BSP UPS utility fail",
  4: "BCP internal over temperature",
  5: "BSP power supply over temperature",
  6: "FFS fault",
  7: "FFS fire alarm(消防水霧啟動)",
  8: "FFS spray",
  9: "Container door open",
  10: "BCP1-1 DC SPD",
  11: "BCP1-1 fuse",
  12: "BCP1-2 fuse",
  15: "BSP transformer over temperature",
  23: "Humiture sensor communication alarm",
  25: "Ammeter communication alarm",
  26: "HVAC alarm",
  27: "HVAC communication alarm"

};

const LC_BSC_406005 = {
  // 0: "FFS alarm 1_Smoke or Temperature",
  // 1: "FFS alarm 2_Smoke and Temperature",
  // 2: "FFS fault",
  0: "FFS alarm 1_可燃氣體",
  1: "FFS alarm 2_可燃氣體",
  2: "FFS fault",
};

const LC_BSC_406007 = {
  0: "Comm error",
  1: "Stop",
  2: "Running",
  3: "Fault",
  85: "Not configured",
};

const LC_BSC_406009 = {
  0: "Comm error",
  1: "Stop",
  2: "Running",
  3: "Fault",
  85: "Not configured",
};

// const LC_BSC_406011 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406013 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406015 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406017 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406019 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406021 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406023 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406025 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406027 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406029 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406031 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406033 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406035 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406037 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406039 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406041 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406043 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

// const LC_BSC_406045 = {
//   0: "Comm error",
//   1: "Stop",
//   2: "Running",
//   3: "Fault",
//   85: "Not configured",
// };

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
  406001: {
    name: "Fault status",
    status: LC_BSC_406001,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "FFS",
  },
  406003: {
    name: "Alarm status",
    status: LC_BSC_406003,
    type: "bit",
    location: "ESS?x-1",
    line: true,
    category: "FFS", //ENV?
  },
  406005: {
    name: "FFS status",
    status: LC_BSC_406005,
    type: "bit",
    location: "ESS?x-1",
    line: false,
    category: "FFS",
  },
  406007: {
    name: "HVAC_1 running status",
    status: LC_BSC_406007,
    type: "int_bit",
    location: "ESS?x-1",
    line: true,
    category: "ENV",
  },
  406009: {
    name: "HVAC_2 running status",
    status: LC_BSC_406009,
    type: "int_bit",
    location: "ESS?x-1",
    line: true,
    category: "ENV",
  },
  // 406011: {
  //   name: "HVAC_3 running status",
  //   status: LC_BSC_406011,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406013: {
  //   name: "HVAC_4 running status",
  //   status: LC_BSC_406013,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406015: {
  //   name: "HVAC_5 running status",
  //   status: LC_BSC_406015,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406017: {
  //   name: "HVAC_6 running status",
  //   status: LC_BSC_406017,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406019: {
  //   name: "HVAC_7 running status",
  //   status: LC_BSC_406019,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406021: {
  //   name: "HVAC_8 running status",
  //   status: LC_BSC_406021,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406023: {
  //   name: "HVAC_9 running status",
  //   status: LC_BSC_406023,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406025: {
  //   name: "HVAC_10 running status",
  //   status: LC_BSC_406025,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406027: {
  //   name: "HVAC_11 running status",
  //   status: LC_BSC_406027,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406029: {
  //   name: "HVAC_12 running status",
  //   status: LC_BSC_406029,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406031: {
  //   name: "HVAC_13 running status",
  //   status: LC_BSC_406031,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406033: {
  //   name: "HVAC_14 running status",
  //   status: LC_BSC_406033,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406035: {
  //   name: "HVAC_15 running status",
  //   status: LC_BSC_406035,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406037: {
  //   name: "HVAC_16 running status",
  //   status: LC_BSC_406037,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406039: {
  //   name: "HVAC_17 running status",
  //   status: LC_BSC_406039,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406041: {
  //   name: "HVAC_18 running status",
  //   status: LC_BSC_406041,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406043: {
  //   name: "HVAC_19 running status",
  //   status: LC_BSC_406043,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  // 406045: {
  //   name: "HVAC_20 running status",
  //   status: LC_BSC_406045,
  //   type: "int_bit",
  //   location: "ESS?x-1",
  //   line: true,
  //   category: "ENV",
  // },
  406047: {
    name: "TH_1 Temperature",
    status: LC_BSC_406047,
    type: "valve",
    location: "ESS?x-1",
    line: false,
    category: "ENV",
  },
  406048: {
    name: "TH_1 Humidity",
    status: LC_BSC_406048,
    type: "valve",
    location: "ESS?x-1",
    line: false,
    category: "ENV",
  },
  406049: {
    name: "TH_2 Temperature",
    status: LC_BSC_406049,
    type: "valve",
    location: "ESS?x-1",
    line: false,
    category: "ENV",
  },
  406050: {
    name: "TH_2 Humidity",
    status: LC_BSC_406050,
    type: "valve",
    location: "ESS?x-1",
    line: false,
    category: "ENV",
  },
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

const Other_408200 = {
  1: "50-1",
  0: "51-1",
  2: "51N-1",
  3: "50N-1",
  4: "51G-1",
  5: "50G-1",
  6: "51-2",
  7: "50-2",
  8: "51N-2",
  9: "50N-2",
  10: "51G-2",
  11: "50G-2",
  12: "51-3",
  13: "50-3",
  14: "51N-3",
  15: "50N-3",
};

const Other_408201 = {
  0: "51G-3",
  1: "50G-3",
  2: "51-4",
  3: "50-4",
  4: "51N-4",
  5: "50N-4",
  6: "51G-4",
  7: "50G-4",
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
  4: "51G-1",
  5: "50G-1",
  6: "51-2",
  7: "50-2",
  8: "51N-2",
  9: "50N-2",
  10: "51G-2",
  11: "50G-2",
};

const Other_408204 = {
  0: "BSP AC Breaker Disconnect 2 Fault",
  1: "Emergency Shutdowm Fault",
  2: "BSP Lightening Protection Failure Fault",
  3: "BSP-UPS Grid Power Disconnect Fault",
  4: "BCP Internal Overtemperature Fault",
  5: "BSP Power Supply Overtemperature Fault",
  6: "FFS System Fault",
  7: "FFS Fire Fault",
  8: "FFS Gas Release Fault",
  9: "BSP Transformer Overtemperature Fault",
  10: "BCP1-1 DC Lightening Protection Falut",
  11: "BCP1-1 Fuse Fault",
  12: "BCP1-2 DC Lightening Protection Falut",
  13: "BCP1-2 Fuse Fault",
  14: "System Compartment Door Open Fault",
  15: "N/A",
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

const Other_408208 = {
  0: "Auto",
  1: "Manual",
  2: "Off",
};

const Other_408209 = {
  4: "Relay Buzzer",
  5: "Relay On",
  6: "Relay Off",
};

const Other_408210 = {
  0: "Fail",
  1: "Reclose",
  2: "Buzzer",
  3: "Ext. Lock",
  4: "Error Trip",
  5: "Standby",
};

const Other_error_table = {
  408154: {
    name: "UPS status",
    status: Other_408154,
    type: "bit",
    location: "device",
    line: true,
    category: "meter",
  },
  408186: {
    name: "Temperature",
    status: Other_408186,
    type: "valve",
    location: "Control Room",
    line: true,
    category: "ENV",
  },
  408187: {
    name: "Humidity",
    status: Other_408187,
    type: "valve",
    location: "Control Room",
    line: true,
    category: "ENV",
  },
  408200: {
    name: "Relay_MVCB-0",
    status: Other_408200,
    type: "bit",
    location: "MVCB",
    line: true,
    category: "meter",
  },
  408201: {
    name: "Relay_MVCB-1",
    status: Other_408201,
    type: "bit",
    location: "MVCB",
    line: true,
    category: "meter",
  },
  408202: {
    name: "Relay_MVCB-2",
    status: Other_408202,
    type: "bit",
    location: "MVCB",
    line: true,
    category: "meter",
  },
  408203: {
    name: "Relay_VCB",
    status: Other_408203,
    type: "bit",
    location: "device",
    line: true,
    category: "meter",
  },
  408204: {
    name: "FFS Fault",
    status: Other_408204,
    type: "bit",
    location: "FFS Control Room",
    line: true,
    category: "meter",
  },
  408205: {
    name: "VCB Status",
    status: Other_408205,
    type: "bit",
    location: "device",
    line: true,
    category: "meter",
  },
  408206: {
    name: "ACB Status",
    status: Other_408206,
    type: "bit",
    location: "device",
    line: true,
    category: "meter",
  },
  408207: {
    name: "ACB Control",
    status: Other_408207,
    type: "bit",
    location: "device",
    line: true,
    category: "meter",
  },
  408208: {
    name: "Recloser mode",
    status: Other_408208,
    type: "bit",
    location: "device",
    line: true,
    category: "meter",
  },
  408209: {
    name: "Relay status",
    status: Other_408209,
    type: "bit",
    location: "device",
    line: true,
    category: "meter",
  },
  408210: {
    name: "Recloser status",
    status: Other_408210,
    type: "bit",
    location: "device",
    line: true,
    category: "meter",
  },
};

const DC_error_table = {
  409101: {
    name: "LC_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "system",
  },
  409103: {
    name: "Freq-M_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409105: {
    name: "ACPM_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409107: {
    name: "AuxMtot_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409109: {
    name: "AuxM_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409111: {
    name: "UPS_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409113: {
    name: "TR_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409115: {
    name: "TH_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409117: {
    name: "RelayMVCB_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409119: {
    name: "RelayVCB_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409121: {
    name: "RIO_CtrlRoom_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409123: {
    name: "RIO_MVCB_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409125: {
    name: "RIO_ACP_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
  409127: {
    name: "GC_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "system",
  },
  409129: {
    name: "HVAC_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "ENV",
  },
  409131: {
    name: "Recloser_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
};

const GC_400037 = {
  threshold: 9500,
  scale: 0.01,
};

const GC_400076 = {
  0: "Switch all Sub_System to Auto Mode ( 0: Do nothing, 1: Switch )",
  1: "Sub_System_1 Operation Mode ( 0: Manual, 1: Auto )",
  2: "Sub_System_2 Operation Mode ( 0: Manual, 1: Auto )",
  3: "Sub_System_3 Operation Mode ( 0: Manual, 1: Auto )",
  4: "Sub_System_4 Operation Mode ( 0: Manual, 1: Auto )",
  8: "Sub_System_1 SOC Judgment Basis ( 0: SOC, 1: Voltage )",
  9: "Sub_System_2 SOC Judgment Basis ( 0: SOC, 1: Voltage )",
  10: "Sub_System_3 SOC Judgment Basis ( 0: SOC, 1: Voltage )",
  11: "Sub_System_4 SOC Judgment Basis ( 0: SOC, 1: Voltage )",
  15: "Switch all Sub_System to Manual Mode ( 0: Do nothing, 1: Switch )",
};

const GC_400077 = {
  0: "Freq_Source ( 0: Real Freq, 1: Test Freq )",
  1: "Use Freq Cmd ( 0: No, 1: Yes )",
  2: "Use P_schedule ( 0: No, 1: Yes )",
  3: "Use P_LS_API ( 0: No, 1: Yes )",
  4: "Use SOC_API ( 0: No, 1: Yes )",
  5: "Auto Calculate SOC_ideal ( 0: No, 1: Yes )",
  6: "Use MTE P_schedule ( 0: No, 1: Yes )",
  7: "Use MTE P_LS/SOC ( 0: No, 1: Yes )",
  8: "Delay P_PCS_set ( 0: Disable, 1: Enable )",
  9: "Enable API ( 0: Disable, 1: Enable )",
  10: "Enable Schedule ( 0: Disable, 1: Enable )",
};

const GC_400078 = {
  0: "ESS_1 Availability ( 0: Not Available, 1: Available )",
  1: "ESS_2 Availability ( 0: Not Available, 1: Available )",
  2: "PCS_1 Availability ( 0: Not Available, 1: Available )",
  3: "ESS & PCS Availability ( 0: Not Available, 1: Available )",
  4: "Sub_System_1 Availability ( 0: Not Available, 1: Available )",
  5: "E-dReg ( 0: Stop, 1: Running )",
  6: "V-Q ( 0: Stop, 1: Running )",
  13: "V-Q Hysteresis ( 0: Blue, 1: Orange )",
  14: "Force P_LS to 0 ( 0: No, 1: Yes )",
  15: "System Availability ( 0: Not Available, 1: Available )",
};

const GC_400079 = {
  0: "ESS_3 Availability ( 0: Not Available, 1: Available )",
  1: "ESS_4 Availability ( 0: Not Available, 1: Available )",
  2: "PCS_2 Availability ( 0: Not Available, 1: Available )",
  3: "ESS & PCS Availability ( 0: Not Available, 1: Available )",
  4: "Sub_System_2 Availability ( 0: Not Available, 1: Available )",
  5: "E-dReg ( 0: Stop, 1: Running )",
  6: "V-Q ( 0: Stop, 1: Running )",
};

const GC_400080 = {
  0: "ESS_5 Availability ( 0: Not Available, 1: Available )",
  1: "ESS_6 Availability ( 0: Not Available, 1: Available )",
  2: "PCS_3 Availability ( 0: Not Available, 1: Available )",
  3: "ESS & PCS Availability ( 0: Not Available, 1: Available )",
  4: "Sub_System_3 Availability ( 0: Not Available, 1: Available )",
  5: "E-dReg ( 0: Stop, 1: Running )",
  6: "V-Q ( 0: Stop, 1: Running )",
};

const GC_400081 = {
  0: "ESS_7 Availability ( 0: Not Available, 1: Available )",
  1: "ESS_8 Availability ( 0: Not Available, 1: Available )",
  2: "PCS_4 Availability ( 0: Not Available, 1: Available )",
  3: "ESS & PCS Availability ( 0: Not Available, 1: Available )",
  4: "Sub_System_4 Availability ( 0: Not Available, 1: Available )",
  5: "E-dReg ( 0: Stop, 1: Running )",
  6: "V-Q ( 0: Stop, 1: Running )",
};

const GC_400129 = {
  min: 400007,
  max: 400006,
  scale: 0.01,
  capacity: 3500000
};

const GC_400989 = {
  scale: 1000,
};

const GC_400991 = {
  scale: 1000,
};

const GC_400993 = {
  scale: 0.001,
};

const GC_400995 = {
  scale: 1000,
};

const GC_400997 = {
  scale: 1000,
};

const GC_400999 = {
  scale: 0.001,
};

const GC_error_table = {
  400037: {
    name: "SBSPM",
    status: GC_400037,
    type: "threshold",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400076: {
    name: "System_Control_1",
    status: GC_400076,
    type: "bit_bidirection",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400077: {
    name: "System_Control_2",
    status: GC_400077,
    type: "bit_bidirection",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400078: {
    name: "Sub_System_1_Status",
    status: GC_400078,
    type: "bit_bidirection",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400079: {
    name: "Sub_System_2_Status",
    status: GC_400079,
    type: "bit_bidirection",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400080: {
    name: "Sub_System_3_Status",
    status: GC_400080,
    type: "bit_bidirection",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400081: {
    name: "Sub_System_4_Status",
    status: GC_400081,
    type: "bit_bidirection",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400129: {
    name: "SOC",
    status: GC_400129,
    type: "valve",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400989: {
    name: "緊急調度指令1_開始時間",
    status: GC_400989,
    type: "int_timestamp",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400991: {
    name: "緊急調度指令1_結束時間",
    status: GC_400991,
    type: "int_timestamp",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400993: {
    name: "緊急調度指令1_充放電量",
    status: GC_400993,
    type: "int_charge",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400995: {
    name: "緊急調度指令2_開始時間",
    status: GC_400995,
    type: "int_timestamp",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400997: {
    name: "緊急調度指令2_結束時間",
    status: GC_400997,
    type: "int_timestamp",
    location: "Control Room",
    line: true,
    category: "system",
  },
  400999: {
    name: "緊急調度指令2_充放電量",
    status: GC_400999,
    type: "int_charge",
    location: "Control Room",
    line: true,
    category: "system",
  },
};

const Heartbeat_error_table = {
  409101: {
    name: "LC_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "system",
  },
  409103: {
    name: "Freq-M_Comm_Error",
    status: 1,
    type: "int_bit",
    location: "Control Room",
    line: true,
    category: "meter",
  },
};

// Alarm DB //--------------------------------------------------------------------------------
//各別名稱產生錯誤對照表
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

//根據錯誤類別產生對應告警文件(存進資料庫) <- 這段由dc完成
function creat_Alarm_DB_docs(nanoDB) {
  let alarm_doc_array = [];
  for (let [key, value] of Object.entries(Alarm_DB_config)) {
    for (let [k, v] of Object.entries(value)) {
      let alarm_doc = {};
      if (v["type"] !== "valve") {
        for (let [_k, _v] of Object.entries(v["status"])) {
          alarm_doc = {
            _id: `${key}:${k}:${_k}`,
            time: "time",
            device: key,
            location: v["location"],
            level: `${
              v["name"].toLowerCase().includes("fault") ? "Fault" : "Alarm"
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
              v["name"].toLowerCase().includes("fault") ? "Fault" : "Alarm"
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
      }
    }
  }
  return alarm_doc_array;
}

// 初始化資料庫的函數 (Function to initialize the database)
function init_Alarm_DB(nanoDB) {
  const alarm_doc_array = creat_Alarm_DB_docs(nanoDB);

//批次插入初始文檔(Bulk insert initial documents)
  nanoDB
    .bulk({ docs: alarm_doc_array })
    .then((response) => {
      console.log("Database initialized successfully.");

      // Create the initialization flag document
      return nanoDB.insert({ _id: "init_flag", initialized: true });
    })
    .then(() => {
      console.log("Initialization flag created.");
    })
    .catch((err) => {
      console.error("Error initializing database:", err);
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
  const bitlength = getLargestKey(statusDict) + 1;
  //console.log(bitlength);
  const rawBitString = rawData.toString(2);
  const bit_value_array = rawBitString
    .padStart(bitlength, "0")
    .slice(-bitlength)
    .split("")
    .reverse()
  // console.log(bit_value_array);

  const bitString_rev = bit_value_array.join("");
  // console.log(bitString_rev);

  // Iterate through each bit in the bit string
  for (let i = 0; i < bitString_rev.length; i++) {
    // Check if the current bit is set (1)
    // console.log(statusDict[i])
    if ((bitString_rev[i] === bit_status) || (bit_status === "bidirection")) {
      // Find the corresponding value in the statusDict using the index
      let matchedValue = statusDict[i];

      // Add the matched value to the result array or use a placeholder for unmatched indices
      // error_arr.push(matchedValue !== undefined ? matchedValue : "Unknown");
      if (matchedValue !== undefined) {
        error_arr.push(matchedValue);
        bit_arr.push(i);
      }
    }
  }
  // console.log([error_arr, bit_arr, bit_value_array]);
  return [error_arr, bit_arr, bitString_rev];
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

function createErrorRecord(
  _id,
  db_name,
  time,
  error_table_tag,
  device,
  tag,
  content,
  value,
  occurrence_time,
  line,
  category
) {
  let location = error_table_tag["location"];
  if (
    db_name.includes("lc") &&
    error_table_tag["location"].includes("ESS?x-1")
  ) {
    const x = db_name.match(/lc(\d+)_rf10/)[1];
    location = error_table_tag["location"].replace("?x", x);
  } else if (
    db_name.includes("other") &&
    error_table_tag["location"].includes("device")
  ) {
    if (error_table_tag["name"].includes("UPS")) {
      location = device;
    } else if (error_table_tag["name"].includes("VCB")) {
      location = device.replace("Status", "");
      if (location === "VCB5") {
        location = "AUX-VCB";
      }
    } else if (error_table_tag["name"].includes("ACB Status")) {
      location = "ACP-A" + device.replace("ACBStatus", "");
    } else if (error_table_tag["name"].includes("ACB Control")) {
      location = "ACP-A" + device.replace("ACBControl", "");
    }
  }
  // console.log(location);
  // console.log(error_table_tag["location"]);
  return {
    _id: _id,
    db_name: db_name,
    time: time,
    location: location,
    device: device,
    tag: tag,
    level: content.toLowerCase().includes("fault") ? "Fault" : "Alarm",
    content: content,
    value: value,
    read: false,
    recover: false,
    recover_time: "",
    occurrence_time: occurrence_time,
    line: line,
    category: category,
  };
}

function LC_error_result_unit(
  time,
  occurrence_time,
  db_name,
  error_table,
  key_error,
  tag,
  value,
  device,
  error_result
) {
  let error_type = error_table[key_error][tag]["type"];

  if (error_type.includes("bit")) {
    let error_arr = [];
    let bit_arr = [];
    let bit_status;
    if (error_type === "bit") {
      bit_status = "1";
      [error_arr, bit_arr, bit_value_array] = mapBitToStatus(
        value,
        error_table[key_error][tag]["status"],
        error_arr,
        bit_arr,
        bit_status
      );
    } else if (error_type === "bit_abnormal") {
      bit_status = "0";
      [error_arr, bit_arr, bit_value_array] = mapBitToStatus(
        value,
        error_table[key_error][tag]["status"],
        error_arr,
        bit_arr,
        bit_status
      );
    }
    if (bit_arr.length > 0) {
      for (let i = 0; i < bit_arr.length; i++) {
        const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}:${bit_arr[i]}`;
        const line = error_table[key_error][tag]["line"];
        const category = error_table[key_error][tag]["category"];
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[key_error][tag],
          device,
          tag,
          error_table[key_error][tag]["name"] + ":" + error_arr[i],
          bit_status,
          occurrence_time,
          line,
          category
        );
        // console.log(error_result[_id])
      }
    }
  } else {
    if (error_type === "int_bit") {
      const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}`;
      const content = error_table[key_error][tag]["status"][value];
      const line = error_table[key_error][tag]["line"];
      const category = error_table[key_error][tag]["category"];
      if (content) {
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[key_error][tag],
          device,
          tag,
          error_table[key_error][tag]["name"] + ":" + content,
          value,
          occurrence_time,
          line,
          category
        );
      }
    } else if (error_type === "valve") {
      value = value * error_table[key_error][tag]["status"]["scale"];
      let min = error_table[key_error][tag]["status"]["min"];
      let max = error_table[key_error][tag]["status"]["max"];
      // console.log(v)
      let content = "";
      if (value < min) {
        content = "Lower valve";
      } else if (value > max) {
        content = "Greater valve";
      }
      if (content) {
        const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}`;
        const line = error_table[key_error][tag]["line"];
        const category = error_table[key_error][tag]["category"];
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[key_error][tag],
          device,
          tag,
          error_table[key_error][tag]["name"] + ":" + content,
          value,
          occurrence_time,
          line,
          category
        );
      }
    }
  }
}

function LC_error_result_gen(item, db_name, error_table = LC_error_table) {
  //console.dir(item)
  //console.log(Object.keys(item._doc)) //mongodb obj, data is under the _doc key
  //console.log(Object.keys(error_table))
  const time = current_locale_time();
  const occurrence_time = item.time;
  let error_result = {};
  let null_tags = [];
  // let _recover_doc = {};

  // const alarmnanoDb = nano.use("alarm");
  // alarmnanoDb
  //   .list()
  //   .then((body) => {
  //     return alarmnanoDb.find({
  //       selector: {
  //         db_name: db_name,
  //         // recover: { $exists: true, $eq: false },
  //       },
  //       limit: body.total_rows,
  //       use_index: ["rAlarm_ddoc", "db_name_recover_index"],
  //     });
  //   })
  //   .then((response) => {
  //     // console.log(response.docs);
  //     console.log("alarmnanoDb");
  //     const _alarm_ids = [];

  //     // // Iterate through the list of objects
  //     // for (let i = 0; i < listOfObjects.length; i++) {
  //     //   // Retrieve _id from each object and push it to the ids array
  //     //   ids.push(listOfObjects[i]._id);
  //     // }
  //   })

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
            let device = `${key}`;
            // console.log(key_error, tag, value, device)
            // console.log(typeof value)

            if (value === 0 || value) {
              LC_error_result_unit(
                time,
                occurrence_time,
                db_name,
                error_table,
                key_error,
                tag,
                value,
                device,
                error_result
              )
            } else if (value === null) {
              null_tags.push(tag);
            }
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
              let device = `${key}_${inner_key}`;
              if (value === 0 || value) {
                LC_error_result_unit(
                  time,
                  occurrence_time,
                  db_name,
                  error_table,
                  key_error,
                  tag,
                  value,
                  device,
                  error_result
                );
              } else if (value === null) {
                null_tags.push(tag);
              }
            }
          }
        }
      }
    }
  }
  return {"error_result": error_result, "null_tags": null_tags};
}

function DC_error_result_gen(item, db_name, error_table = DC_error_table) {
  const time = current_locale_time();
  const occurrence_time = item.time;
  let error_result = {};
  let null_tags = [];
  // console.log(Object.keys(error_table))
  for (let [key, v] of Object.entries(item)) {
    if (typeof v === "object" && v !== null) {
      //console.log(Object.keys(value))
      for (let [tag, value] of Object.entries(v)) {
        if (Object.keys(error_table).includes(tag)) {
          // console.log(key, tag, status)
          const device = `${key}`;
          const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}`;
          const content = error_table[tag]["name"];
          const line = error_table[tag]["line"];
          const category = error_table[tag]["category"];
          if (value === error_table[tag]["status"]) {
            error_result[_id] = createErrorRecord(
              _id,
              db_name,
              time,
              error_table[tag],
              device,
              tag,
              error_table[tag]["name"] + ":" + content,
              value,
              occurrence_time,
              line,
              category
            );
          } else if (value === null) {
            null_tags.push(tag);
          }
        }
      }
    }
  }
  return {"error_result": error_result, "null_tags": null_tags};
}

function Other_error_result_unit(
  time,
  occurrence_time,
  db_name,
  error_table,
  tag,
  value,
  device,
  error_result
) {
  let error_type = error_table[tag]["type"];

  if (error_type.includes("bit")) {
    let error_arr = [];
    let bit_arr = [];
    let bit_status;
    if (error_type === "bit") {
      bit_status = "1";
      [error_arr, bit_arr, bit_value_array] = mapBitToStatus(
        value,
        error_table[tag]["status"],
        error_arr,
        bit_arr,
        bit_status
      );
    } else if (error_type === "bit_abnormal") {
      bit_status = "0";
      [error_arr, bit_arr, bit_value_array] = mapBitToStatus(
        value,
        error_table[tag]["status"],
        error_arr,
        bit_arr,
        bit_status
      );
    }
    if (bit_arr.length > 0) {
      for (let i = 0; i < bit_arr.length; i++) {
        const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}:${bit_arr[i]}`;
        const line = error_table[tag]["line"];
        const category = error_table[tag]["category"];
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[tag],
          device,
          tag,
          error_table[tag]["name"] + ":" + error_arr[i],
          bit_status,
          occurrence_time,
          line,
          category
        );
      }
    }
  } else {
    if (error_type === "int_bit") {
      const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}`;
      const content = error_table[tag]["status"][value];
      const line = error_table[tag]["line"];
      const category = error_table[tag]["category"];
      if (content) {
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[tag],
          device,
          tag,
          error_table[tag]["name"] + ":" + content,
          value,
          occurrence_time,
          line,
          category
        );
      }
    } else if (error_type === "valve") {
      value = value * error_table[tag]["status"]["scale"];
      let min = error_table[tag]["status"]["min"];
      let max = error_table[tag]["status"]["max"];
      // console.log(v)
      let content = "";
      if (value < min) {
        content = "Lower valve";
      } else if (value > max) {
        content = "Greater valve";
      }
      if (content) {
        const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}`;
        const line = error_table[tag]["line"];
        const category = error_table[tag]["category"];
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[tag],
          device,
          tag,
          error_table[tag]["name"] + ":" + content,
          value,
          occurrence_time,
          line,
          category
        );
      }
    }
  }
}

function Other_error_result_gen(
  item,
  db_name,
  error_table = Other_error_table
) {
  const time = current_locale_time();
  const occurrence_time = item.time;
  let error_result = {};
  let null_tags = [];
  // console.log(Object.keys(error_table))
  for (let [key, v] of Object.entries(item)) {
    if (typeof v === "object" && v !== null) {
      //console.log(Object.keys(v))
      for (let [tag, value] of Object.entries(v)) {
        if (Object.keys(error_table).includes(tag)) {
          // console.log(key, tag, value)
          let device = `${key}`;
          if (value === 0 || value) {
            Other_error_result_unit(
              time,
              occurrence_time,
              db_name,
              error_table,
              tag,
              value,
              device,
              error_result
            );
          } else if (value === null) {
            null_tags.push(tag);
          }
        }
      }
    }
  }
  return {"error_result": error_result, "null_tags": null_tags};
}

function GC_error_result_unit(
  time,
  occurrence_time,
  db_name,
  error_table,
  tag,
  value,
  device,
  error_result,
  Max_SOC_Limit,
  Min_SOC_Limit,
  SBSPM_arr,
) {
  let error_type = error_table[tag]["type"];
  // console.log(error_table[tag]["name"])
  if (error_type === "bit_bidirection") {
    let error_arr = [];
    let bit_arr = [];
    let bit_status = 'bidirection';
    [error_arr, bit_arr, bit_value_array] = mapBitToStatus(
      value,
      error_table[tag]["status"],
      error_arr,
      bit_arr,
      bit_status
    );

    if (bit_arr.length > 0) {
      for (let i = 0; i < bit_arr.length; i++) {
        const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}:${bit_arr[i]}`;
        const line = error_table[tag]["line"];
        const category = error_table[tag]["category"];
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[tag],
          device,
          tag,
          error_table[tag]["name"] + ":" + error_arr[i],
          bit_value_array[i],
          occurrence_time,
          line,
          category
        );
      }
    }
  } else {
    if (error_type === "int_timestamp") {
      value = value * error_table[tag]["status"]["scale"];
      const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}`;
      const line = error_table[tag]["line"];
      const category = error_table[tag]["category"];
      // console.log(timestamp_to_datetime(value));
      if (typeof value === 'number') {
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[tag],
          device,
          tag,
          error_table[tag]["name"],
          timestamp_to_datetime(value),
          occurrence_time,
          line,
          category
        );
      }
    } else if (error_type === "int_charge") {
      value = value * error_table[tag]["status"]["scale"];
      const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}`;
      const line = error_table[tag]["line"];
      const category = error_table[tag]["category"];
      if (typeof value === 'number') {
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[tag],
          device,
          tag,
          error_table[tag]["name"],
          value,
          occurrence_time,
          line,
          category
        );
      }
    } else if (error_table[tag]["name"] === "SOC") {
      // console.log(value)
      value = value / error_table[tag]["status"]["capacity"] * 100;
      // console.log(value)
      // console.log(Min_SOC_Limit)
      // console.log(Max_SOC_Limit)
      let content = "";
      if (value < Min_SOC_Limit) {
        content = "Lower valve";
      } else if (value > Max_SOC_Limit) {
        content = "Greater valve";
      }
      if (content) {
        const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}`;
        const line = error_table[tag]["line"];
        const category = error_table[tag]["category"];
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[tag],
          device,
          tag,
          error_table[tag]["name"] + ":" + content,
          value,
          occurrence_time,
          line,
          category
        );
      }
    } else if (error_table[tag]["name"] === "SBSPM") {
      SBSPM_performance = SBSPM_arr.every(function(element) {
        return element <= error_table[tag]["status"]["threshold"];});
      // console.log(SBSPM_arr, SBSPM_performance);

      let content = "";
      if (SBSPM_performance) {
        content = "Lower SBSPM_performance";
      }
      if (content) {
        const _id = `${db_name.replace(/_rf10/g, "")}:${device}:${tag}`;
        const line = error_table[tag]["line"];
        const category = error_table[tag]["category"];
        error_result[_id] = createErrorRecord(
          _id,
          db_name,
          time,
          error_table[tag],
          device,
          tag,
          error_table[tag]["name"] + ":" + content,
          SBSPM_arr,
          occurrence_time,
          line,
          category
        );
      }
    }
  }
}

function GC_error_result_gen(
  item,
  db_name,
  error_table = GC_error_table
) {
  const time = current_locale_time();
  const occurrence_time = item.time;
  let error_result = {};
  let null_tags = [];
  const Max_SOC_Limit = item.System[400006] * 0.1;
  const Min_SOC_Limit = item.System[400007] * 0.1;
  fifoPush(item.System[400037])
  // console.log(SBSPM_arr);
  // console.log(Max_SOC_Limit, Min_SOC_Limit);

  for (let [key, v] of Object.entries(item)) {
    // console.log(key, v);
    if (typeof v === "object" && v !== null) {
      for (let [tag, value] of Object.entries(v)) {
        // console.log(tag, value);
        if (Object.keys(error_table).includes(tag)) {
          // console.log(key, tag, value)
          let device = `${key}`;
          if (value === 0 || value) {
            GC_error_result_unit(
              time,
              occurrence_time,
              db_name,
              error_table,
              tag,
              value,
              device,
              error_result,
              Max_SOC_Limit,
              Min_SOC_Limit,
              SBSPM_arr,
            );
          } else if (value === null) {
            null_tags.push(tag);
          }
        }
      }
    }
  }
  return {"error_result": error_result, "null_tags": null_tags};
}


function compare_trigger_alarms(error_result, response) {
  // console.log(error_result)
  // console.log(response)
  let triggering_alarm_array = [];
  Object.keys(error_result).forEach((key) => {
    triggering_alarm_array.push(key);
  });
  // console.log("triggering_alarm_array")
  // console.log(triggering_alarm_array);

  let triggered_alarm_array = [];
  response.docs.forEach((element) => triggered_alarm_array.push(element._id));
  // console.log("triggered_alarm_array")
  // console.log(triggered_alarm_array);

  const remain = triggering_alarm_array.filter((element) =>
    triggered_alarm_array.includes(element)
  );
  const income = triggering_alarm_array.filter(
    (element) => !triggered_alarm_array.includes(element)
  );
  const recover = triggered_alarm_array.filter(
    (element) => !triggering_alarm_array.includes(element)
  );

  return {
    remain,
    income,
    recover,
  };
}

function update_trigger_alarms_atomic(error_result, compare_result, nanoDB) {
  // update for the remain alarms
  // console.log("remain_promises");
  const remain_promises = compare_result.remain.map((_id) => {
    return nanoDB
      .get(_id)
      .then((doc) => {
        doc.recover = false;
        doc.time = error_result[_id]["time"];
        doc.value = error_result[_id]["value"];
        // console.log(doc);
        return nanoDB.insert(doc);
      })
      .catch((err) => {
        if (err.statusCode === 404) {
          console.error(
            "Data not found in update_trigger_alarms:",
            err.request.data
          );
        } else if (err.statusCode === 409) {
          console.error(
            "Error update conflict update_trigger_alarms flag:",
            err.request.data
          );
        } else {
          console.error("Error checking update_trigger_alarms flag:", err);
        }
      });
  });
  // update for the new income alarms
  // console.log("income_promises");
  const income_promises = compare_result.income.map((_id) => {
    return nanoDB
      .get(_id)
      .then((doc) => {
        console.error("Data existed in update_trigger_alarms:", doc._id);
      })
      .catch((err) => {
        if (err.statusCode === 404) {
          nanoDB.insert(error_result[_id]);
        } else if (err.statusCode === 409) {
          console.error(
            "Error update conflict update_trigger_alarms flag:",
            err.request.data
          );
        } else {
          console.error("Error checking update_trigger_alarms flag:", err);
        }
      });
  });

  // update for the recover alarms
  // console.log("recover_promises");
  const recover_promises = compare_result.recover.map((_id) => {
    return nanoDB
      .get(_id)
      .then((doc) => {
        doc.recover = true;
        doc.recover_time = current_locale_time();
        // console.log(doc);
        return nanoDB.insert(doc);
      })
      .catch((err) => {
        if (err.statusCode === 404) {
          console.error(
            "Data not found in update_trigger_alarms:",
            err.request.data
          );
        } else if (err.statusCode === 409) {
          console.error(
            "Error update conflict update_trigger_alarms flag:",
            err.request.data
          );
        } else {
          console.error("Error checking update_trigger_alarms flag:", err);
        }
      });
  });

  const promises = [
    ...remain_promises,
    ...income_promises,
    ...recover_promises,
  ];
  // Use Promise.all to wait for all promises to resolve
  Promise.all(promises)
    .then(() => {
      console.log("Promise.all in update_trigger_alarms: Suc!");
    })
    .catch((err) => {
      console.error("Error in Promise.all in update_trigger_alarms:", err);
    });
}

function update_trigger_alarms_batch(
  error_result,
  compare_result,
  nanoDB,
  hisnanoDB,
  data_item,
  null_tags,
  line_flag = false
) {
  // console.log(data_item.System["402001"]);
  // console.log(error_result)
  // console.log(compare_result)
  return new Promise((resolve, reject) => {
    let remain_result = [];
    let income_result = [];
    let recover_result = [];

    Promise.resolve("Initial data")
      .then(() => {
        // update for the remain alarms (Recongnized as an error from the filter func which also is the error remian in the AlarmDB)
        // console.log("remain_promises");
        if (compare_result.remain.length > 0) {
          // fetch an array of _id from the AlarmDB
          remain_result = nanoDB
            .fetch({ keys: compare_result.remain })
            .then((resp) => {
              let docs_batch = [];
              let hisAlarm_batch = [];
              try {
                resp.rows.forEach((element) => {
                  // In case, the _id has not yet inserted in the DB
                  // then line notify + insert to DB
                  if (element.hasOwnProperty("error")) {
                    const _id = element.key;
                    const tag = error_result[_id]["tag"];
                    // const tag = _id.split(":")[2]
                    const line = error_result[_id]["line"];
                    delete error_result[_id]["line"];
                    if (!null_tags.includes(tag)) {
                      if (line_flag && line) {
                        sendLineNotify(error_result[_id]);
                      }
                      docs_batch.push(error_result[_id]);
  
                      const obj = error_result[_id];
                      const newObj = { ...obj };
                      delete newObj["_id"];
                      hisAlarm_batch.push(newObj);
                    };

                    // The cases which the _id has been inserted into the DB once
                  } else if (element.hasOwnProperty("doc")) {
                    const _id = element.id;
                    const tag = error_result[_id]["tag"];
                    const line = error_result[_id]["line"];
                    delete error_result[_id]["line"];
                    // Case 1: it remains in the DB correctly
                    // Then, update the doc with current status and values
                    // the read boolean should follow the current setting from the DB
                    if (element.doc) {
                      let doc = element.doc;
                      let error_element = error_result[_id];
                      // console.log(error_result[_id]["_id"])
                      if (!null_tags.includes(tag)) {
                        // console.log(doc._id, doc.value)
                        if (doc.value.toString() !== error_element["value"].toString()) {
                          error_element["_rev"] = doc._rev;
                          error_element["read"] = doc.read;
                          // error_element["recover"] = false;
                          if (line_flag && line) {
                            sendLineNotify(error_element);
                          }
                          docs_batch.push(error_element);
  
                          const obj = error_element[_id];
                          const newObj = { ...obj };
                          delete newObj["_id"];
                          hisAlarm_batch.push(newObj);
                        };
                      };

                      // Case 2: it has been deleted before and not existed in the db currently
                      // then line notify + insert to DB
                    } else {
                      if (!null_tags.includes(tag)) {
                        if (line_flag && line) {
                          sendLineNotify(error_result[_id]);
                        }
                        docs_batch.push(error_result[_id]);
  
                        const obj = error_result[_id];
                        const newObj = { ...obj };
                        delete newObj["_id"];
                        hisAlarm_batch.push(newObj);
                      };
                    }
                  }
                });
              } catch (error) {
                console.log(error);
              }
              // console.log(docs_batch)
              return Promise.all([
                nanoDB.bulk({ docs: docs_batch }),
                hisnanoDB.bulk({ docs: hisAlarm_batch }),
              ]);
            });
          // console.log("remain_result");
        }
      })
      .then(() => {
        // update for the new income alarms (Recongnized as an error from the filter func which also is not yet an error in the AlarmDB)
        // console.log("income_promises");
        if (compare_result.income.length > 0) {
          // fetch an array of _id from the AlarmDB
          income_result = nanoDB
            .fetch({ keys: compare_result.income })
            .then((resp) => {
              // console.log(resp.rows)
              let docs_batch = [];
              let hisAlarm_batch = [];
              try {
                resp.rows.forEach((element) => {
                  // In case, the _id has not yet inserted in the DB
                  // then line notify + insert to DB
                  if (element.hasOwnProperty("error")) {
                    const _id = element.key;
                    const tag = error_result[_id]["tag"];
                    const line = error_result[_id]["line"];
                    delete error_result[_id]["line"];
                    if (!null_tags.includes(tag)) {
                      if (line_flag && line) {
                        sendLineNotify(error_result[_id]);
                      }
                      docs_batch.push(error_result[_id]);
  
                      const obj = error_result[_id];
                      const newObj = { ...obj };
                      delete newObj["_id"];
                      hisAlarm_batch.push(newObj);
                    };

                    // The cases which the _id has been inserted into the DB once
                  } else if (element.hasOwnProperty("doc")) {
                    const _id = element.id;
                    const tag = error_result[_id]["tag"];
                    const line = error_result[_id]["line"];
                    delete error_result[_id]["line"];
                    // Case 1: it is somehow remain in the DB although it should be a newcomer
                    // Then, update the doc with current status and values
                    // the read boolean should follow the current setting from the DB
                    if (element.doc) {
                      // console.log(element.doc);
                      let doc = element.doc;
                      let error_element = error_result[_id];
                      if (!null_tags.includes(tag)) {
                        if (doc.value.toString() !== error_element["value"].toString()) {
                          error_element["_rev"] = doc._rev;
                          error_element["read"] = doc.read;
                          if (line_flag && line) {
                            sendLineNotify(error_element);
                          }
                          docs_batch.push(error_element);
  
                          const obj = error_element[_id];
                          const newObj = { ...obj };
                          delete newObj["_id"];
                          hisAlarm_batch.push(newObj);
                        };
                      };

                      // Case 2: it has been deleted before and not existed in the db currently
                      // then line notify + insert to DB
                    } else {
                      if (!null_tags.includes(tag)) {
                        if (line_flag && line) {
                          sendLineNotify(error_result[_id]);
                        }
                        docs_batch.push(error_result[_id]);
  
                        const obj = error_result[_id];
                        const newObj = { ...obj };
                        delete newObj["_id"];
                        hisAlarm_batch.push(newObj);
                      };
                    }
                  }
                });
              } catch (error) {
                console.log(error);
              }
              // console.log(docs_batch)
              return Promise.all([
                nanoDB.bulk({ docs: docs_batch }),
                hisnanoDB.bulk({ docs: hisAlarm_batch }),
              ]);
            });
          // console.log("income_result");
        }
      })
      .then(() => {
        // update for the recover alarms (Not recongnized as an error from the filter func which also is currently an error in the AlarmDB)
        // console.log("recover_promises");
        // console.log(compare_result.recover)
        if (compare_result.recover.length > 0) {
          // fetch an array of _id from the AlarmDB
          recover_result = nanoDB
            .fetch({ keys: compare_result.recover })
            .then((resp) => {
              let docs_batch = [];
              let hisAlarm_batch = [];
              try {
                resp.rows.forEach((element) => {
                  // As the _id is fetched in the DB
                  // Do nothing if _id is not found in the DB
                  if (element.hasOwnProperty("doc")) {
                    const _id = element.id;
                    let doc = element.doc;
                    // console.log(_id.split(':'))
                    const _device = _id.split(':')[1];
                    const _tag = _id.split(':')[2];
                    const _bit = _id.split(':')[3];
                    // console.log(_device, _tag, _bit)
                    let _value = undefined;
                    if (_bit) {
                      _value = '0';
                      // console.log(_value)
                    } else {
                      // console.log(_id);
                      // console.log(doc);
                      // console.log(data_item);
                      // console.log(_tag);
                      // console.log(_device);
                      _value = data_item[_device][_tag];
                      // console.log(_value)
                    }

                    // console.log(doc)
                    // const line = error_result[_id]["line"];
                    // delete error_result[_id]["line"];
                    if (!doc.recover) {
                      // Set the recover boolean as true and the time to the current time as it is not an error now
                      doc.value = _value;
                      doc.recover = true;
                      doc.recover_time = current_locale_time();
                      // if the recover and read boolean are both true: del the doc
                      if (line_flag) {
                        sendLineNotify(doc);
                      }
                      if (doc.recover && doc.read) {
                        doc._deleted = true;
                      }
                      docs_batch.push(doc);

                      const obj = doc;
                      const newObj = { ...obj };
                      delete newObj["_id"];
                      delete newObj["_deleted"];
                      hisAlarm_batch.push(newObj);
                    }
                    else {
                      // do nothing
                    };
                  }
                });
              } catch (error) {
                console.log(error);
              }
              // console.log(docs_batch)
              return Promise.all([
                nanoDB.bulk({ docs: docs_batch }),
                hisnanoDB.bulk({ docs: hisAlarm_batch }),
              ]);
            });
          // console.log("recover_result");
        }
      })
      .then(() => {
        // console.log({
        //   remain_result,
        //   income_result,
        //   recover_result,
        // });
        resolve({
          remain_result,
          income_result,
          recover_result,
        });
      })
      .catch((error) => {
        reject(error);
      });
    // const promises = [
    //   remain_promises,
    //   income_promises,
    //   recover_promises,
    // ];
    // console.log(promises);
    // // Use Promise.all to wait for all promises to resolve
    // Promise.all(promises)
    //     .then(() => {
    //         console.log("Promise.all in update_trigger_alarms: Suc!");
    //     })
    //     .catch(err => {
    //         console.error('Error in Promise.all in update_trigger_alarms:', err);
    //     });
  });
}
// 
function sendLineNotify(error_result_item) {
  const message = `
  ID: ${error_result_item["_id"]} 
  Level: ${error_result_item["level"]} 
  Location: ${error_result_item["location"]}
  Device: ${error_result_item["device"]}
  Value: ${error_result_item["value"]}
  Warning:
    ${error_result_item["content"].replace(/\[|\]/g, "_")}
  Recover is ${error_result_item["recover"]}
  `;
  
  const request = {
    method: "post",
    //url: 'http://192.168.8.112/line-notify',
    url: "https://notify-api.line.me/api/notify",
    headers: {
      Authorization: `Bearer ${process.env.LineNotifyToken}`,
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
      console.error(
        "Line Notify Error",
        err.response.data,
        err.response.request.path
      );
    });
}

function current_locale_time() {
  const date = new Date();
  // console.log(date)

  // const formattedString = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSSSSZ");
  const formattedString = moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  // console.log(formattedString);
  return formattedString;
}

function timestamp_to_datetime(timestamp) {
  const ts_datetime = moment(timestamp).format("YYYY-MM-DDTHH:mm:ssZ");

  // console.log(ts_datetime);
  return ts_datetime;
}

let SBSPM_arr = [];
// Function to perform FIFO push operation
function fifoPush(element) {
  // Add the element to the end of the array
  if (element !== null ) {
    SBSPM_arr.push(element);
    
    // If the length of the array exceeds the maximum length, remove the first element
    if (SBSPM_arr.length > 4) {
      SBSPM_arr = SBSPM_arr.slice(1);
    };
    // console.log(SBSPM_arr)
  }
}

function alarm_processor(
  original_nanoDB,
  mangoQuery,
  error_result_gen_func,
  alarm_nanoDB,
  hisalarm_nanoDB
) {
  return new Promise((resolve, reject) => {
    original_nanoDB
      .find(mangoQuery)
      .then((response) => {
        const db_name = original_nanoDB["config"]["db"];
        const item = response.docs[0];
        // console.log(item);
        const result = error_result_gen_func(item, db_name);
        const error_result = result.error_result;
        const null_tags = result.null_tags;

        // console.log(error_result);

        alarm_nanoDB
          .list()
          .then((body) => {
            return alarm_nanoDB.find({
              selector: {
                db_name: db_name,
                // recover: { $exists: true, $eq: false },
              },
              limit: body.total_rows,
              use_index: ["rAlarm_ddoc", "db_name_recover_index"],
            });
          })
          .then((response) => {
            const compare_result = compare_trigger_alarms(
              error_result,
              response
            );
            // console.log(compare_result);
            const alarm_db_promise = update_trigger_alarms_batch(
              error_result,
              compare_result,
              alarm_nanoDB,
              hisalarm_nanoDB,
              item,
              null_tags,
              true
            );

            // Move this functionality to func: update_trigger_alarms_batch
            // const hisAlarm_batch = Object.values(error_result).map((obj) => {
            //   // Create a shallow copy of the object and modify the copy
            //   const newObj = { ...obj };
            //   delete newObj["_id"];
            //   return newObj;
            // });
            // const hisalarm_db_promise = hisalarm_nanoDB.bulk({
            //   docs: hisAlarm_batch,
            // });

            // console.log([alarm_db_promise, hisalarm_db_promise]);
            Promise.all([alarm_db_promise])
              .then(() => {
                resolve("alarm_db_promise and hisalarm_db_promise: Suc!");
              })
              .catch((err) => {
                reject(
                  "Error in alarm_db_promise and hisalarm_db_promise:",
                  err
                );
              });
          });
      })
      .catch((err) => {
        if (err.statusCode === 404) {
          reject("Data not found in alarm_promise:", err.request.data);
        } else if (err.statusCode === 409) {
          reject("Error update conflict alarm_promise:", err.request.data);
        } else {
          console.log(err);
          reject("Error checking alarm_promise:", err);
        }
      });
  });
}


// 修改為：
module.exports = {
  router,
  LC_error_result_gen,
  DC_error_result_gen,
  Other_error_result_gen,
  GC_error_result_gen,
  compare_trigger_alarms,
  update_trigger_alarms_batch,
  alarm_processor,
};
