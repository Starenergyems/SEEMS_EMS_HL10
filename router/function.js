const { timeLog } = require("console");
const readline = require("readline");

//chargeStatus
function scaleProcess(decimalValue, scale, point) {
  // 檢查輸入是否合法
  if (
    typeof decimalValue !== "number" ||
    typeof scale !== "number" ||
    typeof point !== "number"
  ) {
    throw new Error("All parameters must be numbers");
  }

  // 將 decimalValue 乘上 scale
  let result = decimalValue * scale;

  // 限制小數點位數
  result = result.toFixed(point);
  return result;
}

// const decimalValue = 150000;
// const scale = 0.001;
// const point = 2;
// const processedValue = scaleProcess(decimalValue, scale, point);
// console.log(processedValue); // 輸出：31.14

//-------------------------------------------------------------------------------------------------
//chargeStatus pcs充放電狀態
function mapchargeStatus(decimalValue) {
  const binaryString =
    decimalValue < 10
      ? `0${decimalValue.toString(2)}`
      : decimalValue.toString(2);
  //const binaryString = decimalValue.toString(2);
  console.log(decimalValue);
  // 檢查位元為1的數量，如果超過兩個以上，返回 "Error"
  if (decimalValue >= 3) {
    console.log(decimalValue);
    return "Error";
  } else if (decimalValue === 0) {
    return "Charging";
  } else if (decimalValue === 1) {
    return "Discharging";
  } else if (decimalValue === 2) {
    return "Non-working state";
  }
}

// const testDecimalValue = 2; // 這是一個十進制數值，可以根據你的實際情況更改
// const result = mapchargeStatus(testDecimalValue);
// console.log(result);

//***************************************************************************** */
//PCSWorkingStatus
function mapPCSWorkingStatus(decimalValue) {
  if (decimalValue === 0) {
    return "N/A";
  }

  const binaryString =
    decimalValue < 10
      ? `0${decimalValue.toString(2)}`
      : decimalValue.toString(2);

  const statusMapping = {
    0: "Running",
    3: "Key stop",
    4: "Standby",
    6: "Start in process",
    9: "Fault stop",
    10: "Alarm running",
    11: "Derating running",
    15: "Communication exception",
  };

  const onesCount = binaryString.split("1").length - 1;

  if (onesCount >= 2) {
    return "Error for too many bits";
  }

  let result = "";

  for (let i = 0; i < binaryString.length; i++) {
    const bit = binaryString[i];
    const position = binaryString.length - 1 - i;

    if (bit === "1" && statusMapping[position]) {
      // 使用 += 來串聯結果
      result += statusMapping[position] + ", ";
    } else if (bit === "1") {
      return "Error , not in list";
    }
  }

  // 移除結果字串末尾的逗號和空格
  result = result.slice(0, -2);

  return result;
}

// 使用例子
// const testdecimalValue = 8;
// const result = mapPCSWorkingStatus(testdecimalValue);
// console.log(result);

//***************************************************************************** */
//PCSWorkingMode
function mapPCSWorkingMode(decimalValue) {
  if (decimalValue == 0) {
    return "N/A";
  }

  const binaryString =
    decimalValue < 10
      ? `0${decimalValue.toString(2)}`
      : decimalValue.toString(2);

  const modeMapping = {
    0: "On-grid constant current",
    1: "On-grid constant voltage",
    2: "On-grid constant power (AC)",
    3: "On-grid constant power (DC)",
    9: "On-grid mode",
    10: "Off-grid mode",
    11: "VSG mode",
  };

  const onesCount = binaryString.split("1").length - 1;

  if (onesCount >= 2) {
    return "Error";
  }

  let result = "";

  for (let i = 0; i < binaryString.length; i++) {
    const bit = binaryString[i];
    const position = binaryString.length - 1 - i;

    if (bit === "1" && modeMapping[position]) {
      result = modeMapping[position];
    }
  }

  return result;
}

// 使用例子;
// const decimalValue = 2048; // 試試不同的數值
// const result = mapPCSWorkingMode(decimalValue);
// console.log(result);

//***************************************************************************** */
//gridStatus
function mapgridStatus(decimalValue) {
  // 將十進制數值轉換為二進制字符串
  const binaryString = decimalValue.toString(2);

  // 對照表
  const modeMapping = {
    0: "Off - grid",
    1: "On - grid",
  };

  if (decimalValue >= 2) {
    return "Error";
  } else if ((decimalValue = 0)) {
    return "Off - grid";
  } else if ((decimalValue = 1)) {
    return "On - grid";
  }
}

// 使用例子;
// const decimalValue = 0; // 試試不同的數值
// const result = mapgridStatus(decimalValue);
// console.log(result);

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

// const ab = 13579.02468;
// console.log(ab.toFixed(2));

let i;
let j;

function Convert_UInt_to_revBitString(rawData, NumberOfDigit) {
  let rawBitString = rawData.toString(2);
  let BitString = rawBitString
    .padStart(NumberOfDigit, "0")
    .slice(-NumberOfDigit);

  let revBitString = "";
  for (i = 0; i < BitString.length; i++) {
    revBitString += BitString[NumberOfDigit - 1 - i];
  }

  return revBitString;
}

function Convert_UInt_to_BitString(rawData, NumberOfDigit) {
  let rawBitString = rawData.toString(2);
  let BitString = rawBitString
    .padStart(NumberOfDigit, "0")
    .slice(-NumberOfDigit);

  let NumberOfClosedBit = BitString.split("1").length - 1;

  return { bitString: BitString, num_ClosedBit: NumberOfClosedBit };
}

function mapWordStatus(rawData, mapTable) {
  let keysArray_MT = Object.keys(mapTable);

  for (i = 0; i < keysArray_MT.length; i++) {
    if (rawData == keysArray_MT[i]) {
      return mapTable[rawData];
    }
  }

  return "Not found(" + rawData + ")";
}

function mapBitStatus(bitString, mapTable, NumberOfBit) {
  if (NumberOfBit > bitString.length - 1) {
    return "bitNumber out of range";
  }

  let keysArray_MT = Object.keys(mapTable);

  for (i = 0; i < keysArray_MT.length; i++) {
    if (NumberOfBit == keysArray_MT[i]) {
      return mapTable[NumberOfBit][bitString[NumberOfBit]];
    }
  }

  return "Not found(bit" + NumberOfBit + " = " + bitString[NumberOfBit] + ")";
}

function getHighLowByte(rawData) {
  let LowByte = rawData % 256;
  let HighByte = (rawData - LowByte) / 256;

  return { hiByte: HighByte, loByte: LowByte };
}

function Convert_unixTime_to_dateTime(rawData) {
  let raw_DT = new Date(rawData * 1000);
  let yy = String(raw_DT.getFullYear()).padStart(4, "0");
  let mm = String(raw_DT.getMonth() + 1).padStart(2, "0");
  let dd = String(raw_DT.getDate()).padStart(2, "0");
  let hh = String(raw_DT.getHours()).padStart(2, "0");
  let m = String(raw_DT.getMinutes()).padStart(2, "0");
  let ss = String(raw_DT.getSeconds()).padStart(2, "0");

  return yy + "/" + mm + "/" + dd + " " + hh + ":" + m + ":" + ss;
}

function Calculate_BMS_energy(E_GWh, E_MWh, E_kWh) {
  let Energy = (E_GWh * 1000000 + E_MWh * 1000 + E_kWh) / 1000;

  return Energy.toFixed(1);
}

function Calculate_CPM10_energy(E_GWh, E_MWh, E_kWh) {
  let Energy = E_GWh * 1000000 + E_MWh * 1000 + E_kWh * 0.1;

  return Energy.toFixed(1);
}

function Calculate_N1450_PF(rawData) {
  if (rawData <= 1000) {
    return (rawData / 1000).toFixed(3);
  } else if (rawData <= 3000) {
    return ((2000 - rawData) / 1000).toFixed(3);
  } else {
    return ((rawData - 4000) / 1000).toFixed(3);
  }
}

function Calculate_Tr_oilTemp(rawData) {
  return ((rawData - 19999) / 10).toFixed(1);
}

function Count_SpecificClosedBit(rawData, NumberOfDigit, specificBitList) {
  let revBitString = Convert_UInt_to_revBitString(rawData, NumberOfDigit);

  let NumberOfSpClosedBit = 0;
  for (i = 0; i < specificBitList.length; i++) {
    if (revBitString[specificBitList[i]] === "1") {
      NumberOfSpClosedBit++;
    }
  }

  return NumberOfSpClosedBit;
}

function Determine_BGC_of_VcMaxDiff(rawData) {
  if (rawData >= 500) {
    return "bgc_Red";
  } else if (rawData >= 400) {
    return "bgc_Orange";
  } else if (rawData >= 300) {
    return "bgc_Yellow";
  } else {
    return "";
  }
}

function Determine_BGC_of_TcMaxDiff(rawData) {
  if (rawData >= 60) {
    return "bgc_Red";
  } else if (rawData >= 40) {
    return "bgc_Orange";
  } else if (rawData >= 20) {
    return "bgc_Yellow";
  } else {
    return "";
  }
}

function Determine_DL_of_RackHWStatus(rawData) {
  let NumOfErr = Count_SpecificClosedBit(rawData, 16, [2, 3, 6, 7]);

  if (NumOfErr > 0) {
    return "setToClose";
  } else {
    return "";
  }
}

function Determine_DL_of_upsStatus2(rawData) {
  let revBitString = Convert_UInt_to_revBitString(rawData, 16);

  if (revBitString[15] === "1") {
    return "setToRed";
  } else if (revBitString[14] === "1") {
    return "setToGreen";
  } else {
    return "";
  }
}

function Determine_DL_of_CommPCSBMS(CommLC, CommPCSBMS) {
  if (CommLC === 0 && CommPCSBMS === "1") {
    return 0;
  } else {
    return 1;
  }
}

const rawData = 49152;
const NumberOfDigit = 16;
const pcsCHGStatus_MT = {
  17: "Charging",
  55: "Discharging",
  98: "Non-working state",
};
const sysCtrl_2_MT = {
  0: { 0: "否", 1: "是" },
  3: { 0: "禁用", 1: "啟用" },
  5: { 0: "頻率表", 1: "測試頻率" },
  6: { 0: "手動", 1: "自動" },
  9: { 0: "正常", 1: "異常" },
  10: { 0: "正常", 1: "通訊異常" },
  13: { 0: "SOC", 1: "Volt" },
};
const pcsWorkStatus_spBitList = [0, 1, 2, 5, 6, 10, 13, 14];

// let cd_BitString = Convert_UInt_to_revBitString(rawData, NumberOfDigit);
// for (i = 0; i < cd_BitString.length; i++) {
//   console.log(cd_BitString[i]);
// }

// let ef = Convert_UInt_to_BitString(rawData, NumberOfDigit);
// console.log(ef);
// console.log(ef.bitString);
// console.log(typeof ef.bitString);
// console.log(ef.num_ClosedBit);
// console.log(typeof ef.num_ClosedBit);

// let gh = mapWordStatus(rawData, pcsCHGStatus_MT);
// console.log(gh);

// const ij = mapBitStatus(cd_BitString, sysCtrl_2_MT, 1);
// console.log(ij);

// const kl = getHighLowByte(rawData);
// console.log(kl);
// console.log(kl["hiByte"]);
// console.log(kl.loByte);

// const mn = Convert_unixTime_to_dateTime(rawData);
// console.log(mn);

// const E_G = 123;
// const E_M = 987;
// const E_k = 1357;
// const op = Calculate_BMS_energy(E_G, E_M, E_k);
// console.log(op);

// const qr = Calculate_CPM10_energy(E_G, E_M, E_k);
// console.log(qr);

// const st = Calculate_N1450_PF(rawData);
// console.log(st);

// const uv = Calculate_Tr_oilTemp(rawData);
// console.log(uv);

// const wx = Count_SpecificClosedBit(rawData, NumberOfDigit, pcsWorkStatus_spBitList);
// console.log(wx);

// const yz = Determine_BGC_of_VcMaxDiff(rawData);
// console.log(yz);

// const ab_2 = Determine_DL_of_RackHWStatus(rawData);
// console.log(ab_2);

// const cd_2 = Determine_DL_of_upsStatus2(rawData);
// console.log(cd_2);

// let CommLC = 0;
// let CommPCSBMS = "1";
// const ef_2 = Determine_DL_of_CommPCSBMS(CommLC, CommPCSBMS);
// console.log(ef_2);

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */
// Alarm //--------------------------------------------------------------------------------
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
  402021: { name: "LC_System_System status", status: LC_System_402021 },
  402099: { name: "LC_System_Fault status", status: LC_System_402099 },
  402100: { name: "LC_System_Alarm status", status: LC_System_402100 },
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

const LC_PCS_403058 = {
  1: "AC switch status",
  2: "DC switch status",
  3: "DC fuse status",
  4: "DC auxiliary switch 1 status",
  5: "DC auxiliary switch 2 status",
};

const LC_PCS_error_table = {
  403001: { name: "LC_PCS_Overall fault status", status: LC_PCS_403001 },
  403002: { name: "LC_PCS_Overall alarm status", status: LC_PCS_403002 },
  403004: { name: "LC_PCS_Transformer node status", status: LC_PCS_403004 },
  403009: { name: "LC_PCS_Transformer node status1", status: LC_PCS_403009 },
  403011: { name: "LC_PCS_Transformer node status2", status: LC_PCS_403011 },
  403034: { name: "LC_PCS_Alarm status1", status: LC_PCS_403034 },
  403035: { name: "LC_PCS_Alarm status2", status: LC_PCS_403035 },
  403036: { name: "LC_PCS_Fault status1", status: LC_PCS_403036 },
  403038: { name: "LC_PCS_Fault status2", status: LC_PCS_403038 },
  403049: { name: "LC_PCS_Working status", status: LC_PCS_403049 },
  403058: { name: "LC_PCS_Node status", status: LC_PCS_403058 },
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
  404011: { name: "LC_BMS_System mode", status: LC_BMS_404011 },
  404044: { name: "LC_BMS_CMU alarm word", status: LC_BMS_404044 },
  404046: { name: "LC_BMS_CMU fault word", status: LC_BMS_404046 },
  404048: { name: "LC_BMS_Hardware fault word", status: LC_BMS_404048 },
  404061: { name: "LC_BMS_SMU fault status", status: LC_BMS_404061 },
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
  405028: { name: "LC_Rack_CMU alarm word", status: LC_Rack_405028 },
  405030: { name: "LC_Rack_CMU fault word", status: LC_Rack_405030 },
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

// const LC_BSC_406007 = {
//   0: 'Comm error',
//   1: 'Stop',
//   2: 'Running',
//   3: 'Fault',
//   85: 'Not configured',
// }

const LC_BSC_error_table = {
  406001: { name: "LC_BSC_Fault status", status: LC_BSC_406001 },
  406003: { name: "LC_BSC_Alarm status", status: LC_BSC_406003 },
  //406007:{name: 'LC_BSC_HVAC_1 running status', status:LC_Rack_406007},
};

const LC_error_table = {
  System:LC_System_error_table,
  PCS:LC_PCS_error_table,
  BMS:LC_BMS_error_table,
  BSC:LC_BSC_error_table,
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
  min: -3000,
  max: 4000,
  scale: 0.1
};

const Other_408187 = {
  min: 0,
  max: 100,
  scale: 0.1
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
  408154: { name: "UPS status", status: Other_408154 },
  408186: { name: "Temperature", status: Other_408186 },
  408187: { name: "Humidity", status: Other_408187 },
  408201: { name: "Relay_MVCB-1", status: Other_408201 },
  408202: { name: "Relay_MVCB-2", status: Other_408202 },
  408203: { name: "Relay_VCB", status: Other_408203 },
  408204: { name: "FFS Status", status: Other_408204 },
  408205: { name: "VCB Status", status: Other_408205 },
  408206: { name: "ACB Status", status: Other_408206 },
  408207: { name: "ACB Control", status: Other_408207 },
};

const DC_error_table = {
  409101 : { name: "LC_Comm_Error", status: 1 },
  409103 : { name: "Freq-M_Comm_Error", status: 1 },
  409105 : { name: "ACPM_Comm_Error", status: 1 },
  409107 : { name: "AuxMtot_Comm_Error", status: 1 },
  409109 : { name: "AuxM_Comm_Error", status: 1 },
  409111 : { name: "UPS_Comm_Error", status: 1 },
  409113 : { name: "TR_Comm_Error", status: 1 },
  409115 : { name: "TH_Comm_Error", status: 1 },
  409117 : { name: "RelayMVCB_Comm_Error", status: 1 },
  409119 : { name: "RelayVCB_Comm_Error", status: 1 },
  409121 : { name: "I/O_FFS_Comm_Error", status: 1 },
  409123 : { name: "I/O_VCB_Comm_Error", status: 1 },
  409125 : { name: "I/O_ACBStatus_Comm_Error", status: 1 },
};

const GC_400033 = {
  threshold: 9500,
  count: 4,
}

const GC_400129 = {
  min: "Min_SOC_Limit",
  max: "Max_SOC_Limit",
  capacity: 3500000, //kWh
}

const GC_error_table = {
  400033 : { name: "SBSPM", status: GC_400033},
  400129 : { name: "SOC", status: GC_400129},
};

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

function mapBitToStatus(rawData, statusDict) {
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
  const mappedValues = [];

  // Iterate through each bit in the bit string
  for (let i = 0; i < bitString_rev.length; i++) {
    // Check if the current bit is set (1)
    if (bitString_rev[i] === "1") {
      // Find the corresponding value in the statusDict using the index
      const matchedValue = statusDict[i];

      // Add the matched value to the result array or use a placeholder for unmatched indices
      mappedValues.push(matchedValue !== undefined ? matchedValue : "Unknown");
    }
  }
  return mappedValues;
}

function checkPartialMatch(k, array) {
  // Convert a to lowercase for case-insensitive matching
  const lowercase_key = k.toLowerCase();
  // Iterate over each item in the array b
  for (const item of array) {
    // Convert the current item to lowercase for case-insensitive matching
    const lowercase_Item = item.toLowerCase();
    // Check if lowercaseA is included in lowercaseItem
    if (lowercase_key.includes(lowercase_Item)) {
      return item; // Return the matched item
    }
  }
  return null; // Return null if no match is found
}

function error_result_gen(item, error_table) {
  //console.dir(item)
  //console.log(Object.keys(item._doc)) //mongodb obj, data is under the _doc key
  //console.log(Object.keys(error_table))
  const error_result = {};
  for (let key in item._doc) {
    if (item._doc.hasOwnProperty(key)) {
      if (checkPartialMatch(key, Object.keys(error_table))) {
        key_error = checkPartialMatch(key, Object.keys(error_table));
        //console.log(key_error)
        error_result[key] = [];
        for (const tag in error_table[key_error]) {
          //console.log(key)
          //console.log(tag)
          //console.log(item[key][tag])
          //console.log(error_table[key_error][tag]['name'])
          //console.log(item[key])
          //console.log(mapBitToStatus(item[key][tag], error_table[key_error][tag]['status']))
          error_arr = mapBitToStatus(
            item[key][tag],
            error_table[key_error][tag]["status"]
          );
          if (error_arr.length > 0) {
            console.log(error_arr);
            error_result[key].push({
              tag: tag,
              name: error_table[key_error][tag]["name"],
              warning: error_arr,
            });
          }
        }
      }
    }
  }
  return error_result;
}

module.exports = {
  mapchargeStatus,
  scaleProcess,
  mapPCSWorkingStatus,
  mapPCSWorkingMode,
  mapgridStatus,
  // 其他導出的函數
  Convert_UInt_to_revBitString,
  Convert_UInt_to_BitString,
  mapWordStatus,
  mapBitStatus,
  getHighLowByte,
  Convert_unixTime_to_dateTime,
  Calculate_BMS_energy,
  Calculate_CPM10_energy,
  Calculate_N1450_PF,
  Calculate_Tr_oilTemp,
  Count_SpecificClosedBit,
  Determine_BGC_of_VcMaxDiff,
  Determine_BGC_of_TcMaxDiff,
  Determine_DL_of_RackHWStatus,
  Determine_DL_of_upsStatus2,
  Determine_DL_of_CommPCSBMS,
  error_result_gen,
  LC_error_table,
  Other_error_table,
  DC_error_table,
  GC_error_table,
};
// //***************************************************************************** */
// //轉換存陣列
// const decimalToBinaryArray = (decimal) => {
//   // 檢查是否為有效的十進制數字
//   if (isNaN(decimal)) {
//     throw new Error("Invalid input. Please provide a valid decimal number.");
//   }

//   // 將十進制轉換為二進制字符串
//   const binaryString = decimal.toString(2);

//   // 確保二進制字符串的長度為32字元，不足的部分補0
//   const paddedBinaryString =
//     "00000000000000000000000000000000".slice(-32) + binaryString;

//   // 將二進制字符串轉換為數字陣列，按照bit0開始的順序
//   const binaryArray = Array.from(paddedBinaryString).map(Number);
//   //binaryArray 反過來存放 這樣個別對應的位元才會是他的位置
//   const reversedBinaryArray = Array.from(paddedBinaryString)
//     .map(Number)
//     .reverse();

//   return reversedBinaryArray;
// };

// module.exports = { decimalToBinaryArray };

// // // 使用範例
// // const decimalValue = 32;

// // try {
// //   const binaryResult = decimalToBinaryArray(decimalValue);
// //   console.log("Binary Result:", binaryResult);
// //   console.log("Binary Result:", binaryResult.join(" "));
// //   console.log("Binary [i]:", binaryResult[i]);
// // } catch (error) {
// //   console.error("Error:", error.message);
// // };

// //********************************************************************************************************** */
// //********************************************************************************************************** */
// function BMSmapNumberToStatus(number) {
//   if (number >= 2) {
//     switch (number) {
//       case 0:
//         return "充電";
//       case 1:
//         return "放電";
//       case 2:
//         return "停止";
//       default:
//         return "N/A";
//     }
//   } else {
//     return "N/A";
//   }
// }

// module.exports = { BMSmapNumberToStatus };

// //引用方法
// // const express = require('express');
// // const router = express.Router();

// // // 引用你的 translateStatus 函數
// // const { translateStatus } = require('./path-to-your-translateStatus-file');

// // // 假設你有一個路由處理程序
// // router.get('/your/route', (req, res) => {
// //   // 假設你從數據庫中讀取到了一個數字狀態
// //   const statusFromDatabase = 1;

// //   // 使用 translateStatus 將數字狀態轉換為文字描述
// //   const translatedStatus = translateStatus(statusFromDatabase);

// //   // 將結果傳遞給 EJS 模板
// //   res.render('your_template', { translatedStatus });
// // });

// // module.exports = router;

// //計算
// // fun.js

// const sumNumbers = (num1, num2) => {
//   // 在這裡執行你的判斷和計算邏輯
//   let sum = num1 + num2;

//   // 四捨五入到小數點第二位
//   sum = Math.round(sum * 100) / 100;
//   return sum.toFixed(2);
// };

// // 將 sumNumbers 函式導出，以便其他檔案可以使用
// module.exports = {
//   sumNumbers,
// };
// //引用方法
// // app.js

// const express = require("express");
// const app = express();
// const fun = require("./fun"); // 引入 fun.js

// // 使用 sumNumbers 函式
// app.get("/calculate", (req, res) => {
//   // 假設你有數字 num1 和 num2
//   const num1 = 10;
//   const num2 = 20;

//   // 使用 sumNumbers 函式進行計算
//   const result = fun.sumNumbers(num1, num2);

//   // 將結果返回或者使用它進一步的處理
//   res.send(`Result: ${result}`);
// });

// // 十進制轉二進制
// const decToBin32 = (decimal) => {
//   if (isNaN(decimal)) {
//     throw new Error("Invalid input. Please provide a valid decimal number.");
//   }
//   return ("00000000000000000000000000000000" + decimal.toString(2)).slice(-32);
// };
// //-------------------------------------------------------------------------------------------------
// //計算有幾個警告
// const decToBincount = (decimal) => {
//   if (isNaN(decimal)) {
//     throw new Error("Invalid input. Please provide a valid decimal number.");
//   }
//   const binaryString = (
//     "00000000000000000000000000000000" + decimal.toString(2)
//   ).slice(-32);
//   const countOnes = binaryString.split("1").length - 1;
//   return { binaryString, countOnes };
// };

// //-------------------------------------------------------------------------------------------------

// //-------------------------------------------------------------------------------------------------
// //時間計算

// //-------------------------------------------------------------------------------------------------
// //測試用
// // module.exports = {
// //   decToBin32,
// //   decimalToBinaryArray,
// // };

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// //測試
// rl.question("Enter a decimal value: ", (decimalValue) => {
//   try {
//     const binaryResult = decimalToBinaryArray(parseInt(decimalValue));
//     console.log("Binary Result:", binaryResult);

//     rl.question("Enter the index to retrieve (0-31): ", (bitIndex) => {
//       const index = parseInt(bitIndex);
//       if (isNaN(index) || index < 0 || index >= binaryResult.length) {
//         console.error("Invalid index. Please provide a valid index.");
//       } else {
//         console.log(`Binary [${index}]: ${binaryResult[index]}`);
//       }

//       rl.close();
//     });
//   } catch (error) {
//     console.error("Error:", error.message);
//     rl.close();
//   }
// });
