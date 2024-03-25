const { timeLog, Console } = require("console");
const readline = require("readline");
//-------------------------------------------------------------------------------------------------
// 定義計算平均值的函數
function calculateAverage(...numbers) {
  if (numbers.length === 0) {
    return 0; // 避免除以零的情況
  }
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

// 加總
function calculateAdd(...numbers) {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum;
}
//-------------------------------------------------------------------------------------------------
//單位轉換
function scaleProcess(decimalValue, scale, point) {
  // 檢查輸入是否合法
  if (decimalValue === null || scale === null || point === null) {
    return "#*#";
  }

  // 將 decimalValue 乘上 scale
  let result = decimalValue * scale;

  // 限制小數點位數
  result = result.toFixed(point);
  return result;
}

//-------------------------------------------------------------------------------------------------
//chargeStatus pcs充放電狀態
function mapchargeStatus(decimalValue) {
  const binaryString =
    decimalValue < 10
      ? `0${decimalValue.toString(2)}`
      : decimalValue.toString(2);
  //const binaryString = decimalValue.toString(2);
  // console.log(decimalValue);
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
//***************************************************************************** */
function mapworkStatus_page(decimalValue) {
  // 將十進制數值轉換為二進制字串
  const binaryString = decimalValue.toString(2).padStart(32, "0");

  // 尋找第一個為1的位元的索引
  const indexOfOne = 32 - binaryString.indexOf("1");

  // 根據索引對應的位元，返回相應的狀態
  const statuses = {
    0: "運作中",
    3: "停止-Key stop",
    4: "準備中",
    6: "啟動中",
    9: "停止-錯誤",
    10: "運作-告警",
    11: "降載運作",
    15: "通訊異常"
  };

  return statuses[indexOfOne] || "Unknown status";
}

// // 範例使用
// const decimalValue = 8; // 這裡使用8作為範例，代表第四位元為1
// const status = mapworkStatus_page(decimalValue);
// console.log(status); // 輸出目前的狀態

// bit 0: Running
// bit 3: Key stop
// bit 4: Standby
// bit 6: Starting
// bit 9: Fault stop
// bit 10: Alarm running
// bit 11: Derated running
// bit 15: Communication exception
//***************************************************************************** */

function mapworkMode_page(decimalValue) {
  // 將十進制數值轉換為二進制字串
  const binaryString = decimalValue.toString(2).padStart(32, "0");

  // 尋找第一個為1的位元的索引
  const indexOfOne = 32 - binaryString.indexOf("1");

  // 根據索引對應的位元，返回相應的狀態
  const statuses = {
    0: "On-grid constant current",
    1: "On-grid constant voltage",
    2: "On-grid constant power (AC)",
    3: "On-grid constant power (DC)",
    9: "On-grid mode",
    10: "Off-grid mode",
    11: "VSG mode"
  };

  return statuses[indexOfOne] || "Unknown status";
}
// bit 0: On-grid constant current
// bit 1: On-grid constant voltage
// bit 2: On-grid constant power (AC)
// bit 3: On-grid constant power (DC)
// bit 9: On-grid mode
// bit 10: Off-grid mode
// bit 11: VSG mode

function mapgridStatus_page() { }
//***************************************************************************** */
//PCSWorkingStatus
function mapPCSworkStatus(lc1, lc2, lc3, lc4) {
  //console.log("#1;" + lc1 + "#2;" + lc2 + "#3;" + lc3 + "#4;" + lc4);
  if (lc1 === null || lc2 === null || lc3 === null || lc4 === null) {
    return "#*#";
  }
  const sum = lc1 + lc2 + lc3 + lc4;
  if (sum === 7) {
    return "運轉中";
  } else if (sum <= 6 && sum >= 1) {
    return "部分運轉中";
  } else {
    return "停機";
  }
}

function mapModeActPas(input) {
  if (input === 0) {
    return "主動";
  }
  if (input === 1) {
    return "被動";
  }
}
function mapModeQctrl(input) {
  if (input === 85) {
    return "關閉";
  }
  if (input === 161) {
    return "功因模式";
  }
  if (input === 162) {
    return "功率(kVar)模式";
  }
}
function mapStandbyCmd(input) {
  if (input === 85) {
    return "停止待機";
  }
  if (input === 170) {
    return "待機";
  }
}
function mapModeLR(input) {
  if (input === 0) {
    return "本地 & 遠端";
  }
  if (input === 1) {
    return "遠端";
  }
  if (input === 2) {
    return "本地";
  } else {
    return "undefined";
  }
}
//***************************************************************************** */
//PCSWorkingMode
function mapPCSWorkingstatus(input1, input2) {
  // 檢查參數是否為 undefined
  if (input1 === undefined || input2 === undefined) {
    return "undefined";
  }

  // 將參數轉換為二進制並填補為固定長度為32
  const binary1 = input1.toString(2).padStart(32, "0");
  const binary2 = input2.toString(2).padStart(32, "0");

  // 定義對應的狀態
  const statusMap1 = {
    0: "Running",
    3: "Key stop",
    4: "Standby",
    6: "Starting",
    9: "Fault stop",
    10: "Alarm running",
    11: "Derated running",
    15: "Communication exception"
  };

  const statusMap2 = {
    0: "On-grid constant current",
    1: "On-grid constant voltage",
    2: "On-grid constant power (AC)",
    3: "On-grid constant power (DC)",
    9: "On-grid mode",
    10: "Off-grid mode",
    11: "VSG mode"
  };

  // 處理第一個變數
  let result1 = "";
  for (let bit in statusMap1) {
    if (binary1[31 - bit] === "1") {
      result1 += statusMap1[bit] + ", ";
    }
  }
  // 移除最後的逗號和空格
  result1 = result1.slice(0, -2);

  // 處理第二個變數
  let result2 = "";
  for (let bit in statusMap2) {
    if (binary2[31 - bit] === "1") {
      result2 += statusMap2[bit] + ", ";
    }
  }
  // 移除最後的逗號和空格
  result2 = result2.slice(0, -2);

  // 回傳組合後的結果
  return result1 + result2;
}

//計算pcs告警和錯誤的總數
function countPCSAlarmAndFault(input1, input2, input3) {
  // 檢查參數是否為 undefined
  if (input1 === undefined || input2 === undefined || input3 === undefined) {
    return 0; // 或者返回其他預設值，具體取決於你的需求
  }

  // 將參數轉換為二進制並填補為固定長度為32
  const binary1 = input1.toString(2).padStart(32, "0");
  const binary2 = input2.toString(2).padStart(32, "0");
  const binary3 = input3.toString(2).padStart(32, "0");

  // 計算三個變數的二進制中包含的1的總數
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if (binary1[i] === "1") count++;
    if (binary2[i] === "1") count++;
    if (binary3[i] === "1") count++;
  }

  // 回傳三個變數的二進制中1的總數
  return count;
}

//***************************************************************************** */
//gridStatus
function mapgridStatus(decimalValue) {
  // 將十進制數值轉換為二進制字符串
  const binaryString = decimalValue.toString(2);

  // 對照表

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

let i;
let j;

function Scale_Data(rawData, scale, decPlace) {
  if (rawData === undefined) {
    return "*#*";
  }

  if (rawData === null) {
    return "#*#";
  }

  let scaledData = rawData * scale;

  return scaledData.toFixed(decPlace);
}

function Convert_UInt_to_revBitString(rawData, NumberOfDigit) {
  let revBitString = "";

  if (rawData === null) {
    for (i = 0; i < NumberOfDigit; i++) {
      revBitString += "#";
    }
    return revBitString;
  }

  let rawBitString = rawData.toString(2);
  let BitString = rawBitString
    .padStart(NumberOfDigit, "0")
    .slice(-NumberOfDigit);

  for (i = 0; i < NumberOfDigit; i++) {
    revBitString += BitString[NumberOfDigit - 1 - i];
  }

  return revBitString;
}

function Convert_UInt_to_BitString(rawData, NumberOfDigit) {
  let BitString = "";

  if (rawData === null) {
    for (i = 0; i < NumberOfDigit; i++) {
      BitString += "#";
    }
    return { bitString: BitString, num_ClosedBit: "#*#" };
  }

  let rawBitString = rawData.toString(2);
  BitString = rawBitString.padStart(NumberOfDigit, "0").slice(-NumberOfDigit);

  let NumberOfClosedBit = BitString.split("1").length - 1;

  return { bitString: BitString, num_ClosedBit: NumberOfClosedBit };
}

function mapWordStatus(rawData, mapTable) {
  if (rawData === null) {
    return "#*#";
  }

  let keysArray_MT = Object.keys(mapTable);

  for (i = 0; i < keysArray_MT.length; i++) {
    if (rawData == keysArray_MT[i]) {
      return mapTable[rawData];
    }
  }

  return `Not found(${rawData})`;
}

function mapBitStatus(bitString, mapTable, NumberOfBit) {
  if (bitString[0] === "#") {
    return "#*#";
  }

  if (NumberOfBit > bitString.length - 1) {
    return "bitNumber out of range";
  }

  let keysArray_MT = Object.keys(mapTable);

  for (i = 0; i < keysArray_MT.length; i++) {
    if (NumberOfBit == keysArray_MT[i]) {
      return mapTable[NumberOfBit][bitString[NumberOfBit]];
    }
  }

  return `Not found(bit${NumberOfBit} = ${bitString[NumberOfBit]})`;
}

function getHighLowByte(rawData) {
  if (rawData === null) {
    return { hiByte: "#*#", loByte: "#*#" };
  }

  let LowByte = rawData % 256;
  let HighByte = (rawData - LowByte) / 256;

  return { hiByte: HighByte, loByte: LowByte };
}

function Convert_unixTime_to_dateTime(rawData) {
  if (rawData === null) {
    return "####/##/## ##:##:##";
  }

  let raw_DT = new Date(rawData * 1000);
  let yy = String(raw_DT.getFullYear()).padStart(4, "0");
  let mm = String(raw_DT.getMonth() + 1).padStart(2, "0");
  let dd = String(raw_DT.getDate()).padStart(2, "0");
  let hh = String(raw_DT.getHours()).padStart(2, "0");
  let m = String(raw_DT.getMinutes()).padStart(2, "0");
  let ss = String(raw_DT.getSeconds()).padStart(2, "0");

  return `${yy}/${mm}/${dd} ${hh}:${m}:${ss}`;
}

function Calculate_BMS_energy(E_GWh, E_MWh, E_kWh) {
  if (E_GWh === null || E_MWh === null || E_kWh === null) {
    return "#*#*#";
  }

  let Energy = (E_GWh * 1000000 + E_MWh * 1000 + E_kWh) / 1000;

  return Energy.toFixed(1);
}

function Calculate_CPM10_energy(E_GWh, E_MWh, E_kWh) {
  if (E_GWh === null || E_MWh === null || E_kWh === null) {
    return "#*#*#";
  }

  let Energy = E_GWh * 1000000 + E_MWh * 1000 + E_kWh * 0.1;

  return Energy.toFixed(1);
}

function Calculate_N1450_PF(rawData) {
  if (rawData === null) {
    return "#*#";
  }

  if (rawData <= 1000) {
    return (rawData / 1000).toFixed(3);
  } else if (rawData <= 3000) {
    return ((2000 - rawData) / 1000).toFixed(3);
  } else {
    return ((rawData - 4000) / 1000).toFixed(3);
  }
}

function Calculate_Tr_oilTemp(rawData) {
  if (rawData === null) {
    return "#*#";
  }

  return ((rawData - 19999) / 10).toFixed(1);
}

function Count_SpecificClosedBit(rawData, NumberOfDigit, specificBitList) {
  if (rawData === null) {
    return "#*#";
  }

  let revBitString = Convert_UInt_to_revBitString(rawData, NumberOfDigit);

  let NumberOfSpClosedBit = 0;
  for (i = 0; i < specificBitList.length; i++) {
    if (revBitString[specificBitList[i]] === "1") {
      NumberOfSpClosedBit++;
    }
  }

  return NumberOfSpClosedBit;
}

function Convert_socRef_kWh_to_pct(rawData) {
  if (rawData === null) {
    return "#*#";
  }

  return (
    ((rawData + (4472 * 7 - 10000 * 2.5) / 2) / (4472 * 7)) *
    100
  ).toFixed(1);
}

function Determine_BGC_of_VcMaxDiff(data_maxV, data_minV) {
  if (data_maxV === null || data_minV === null) {
    return "bgc_ErrData";
  }

  let maxDiff = data_maxV - data_minV;
  if (maxDiff >= 500) {
    return "bgc_Red";
  } else if (maxDiff >= 400) {
    return "bgc_Orange";
  } else if (maxDiff >= 300) {
    return "bgc_Yellow";
  } else {
    return "";
  }
}

function Determine_BGC_of_TcMaxDiff(data_maxV, data_minV) {
  if (data_maxV === null || data_minV === null) {
    return "bgc_ErrData";
  }

  let maxDiff = data_maxV - data_minV;
  if (maxDiff >= 60) {
    return "bgc_Red";
  } else if (maxDiff >= 40) {
    return "bgc_Orange";
  } else if (maxDiff >= 20) {
    return "bgc_Yellow";
  } else {
    return "";
  }
}

function Determine_DL_of_RackHWStatus(rawData) {
  if (rawData === null) {
    return "ErrData";
  }

  let NumOfErr = Count_SpecificClosedBit(rawData, 16, [2, 3, 6, 7]);

  if (NumOfErr > 0) {
    return "setToClose";
  } else {
    return "";
  }
}

function Determine_DL_of_upsStatus2(rawData) {
  if (rawData === null) {
    return "ErrData";
  }

  let revBitString = Convert_UInt_to_revBitString(rawData, 16);

  if (revBitString[15] === "1") {
    return "setToRed";
  } else if (revBitString[14] === "1") {
    return "setToGreen";
  } else {
    return "";
  }
}

function Determine_DL_of_AlarmWord(rawData) {
  if (rawData === null) {
    return "ErrData";
  }

  if (rawData > 0) {
    return "setToClose";
  } else {
    return "";
  }
}

function Determine_DL_of_AlarmWords(alarmDataArray) {
  let sum = 0;

  for (i = 0; i < alarmDataArray.length; i++) {
    if (alarmDataArray[i] === null) {
      return "ErrData";
    } else {
      sum += alarmDataArray[i];
    }
  }

  if (sum > 0) {
    return "setToClose";
  } else {
    return "";
  }
}

function Determine_DL_of_CommDevice(rawData) {
  if (rawData === null) {
    return "ErrData";
  }

  if (rawData === 0) {
    return "setToClose";
  } else {
    return "";
  }
}

function Determine_DL_of_CommPCSBMS(CommLC, CommPCSBMS) {
  if (CommLC === null || CommPCSBMS === "#") {
    return "ErrData";
  }

  if (CommLC === 0 && CommPCSBMS === "1") {
    return "setToClose";
  } else {
    return "";
  }
}

function Determine_statusL_of_recloser(recloserStatus, recloserRelay) {
  if (recloserStatus === null || recloserRelay === null) {
    return "ErrData";
  }

  if (recloserStatus % 32 > 0 || recloserRelay > 0) {
    return "setToClose";
  } else {
    return "";
  }
}

function Determine_statusL_of_VCB(closeStatus, openStatus, tripStatus) {
  if (closeStatus === "#" || openStatus === "#" || tripStatus === "#") {
    return "ErrData";
  }

  if (tripStatus === "1" || closeStatus === openStatus) {
    return "Err";
  } else if (closeStatus === "1") {
    return "setToClose";
  } else {
    return "";
  }
}

function Determine_statusL_of_ACB(closeStatus, openStatus) {
  if (closeStatus === "#" || openStatus === "#") {
    return "ErrData";
  }

  if (closeStatus === openStatus) {
    return "Err";
  } else if (closeStatus === "1") {
    return "setToClose";
  } else {
    return "";
  }
}

function Determine_status_of_exeCmd(unixTime_Now, startTime_eCmd, endTime_eCmd) {
  if (startTime_eCmd === null || endTime_eCmd === null) {
    return { indicator: "#*#", status: "#*#", bgColor: "ErrData" };
  }

  if (unixTime_Now >= startTime_eCmd) {
    if (unixTime_Now < endTime_eCmd) {
      return { indicator: "Running", status: "執行中", bgColor: "running" };
    } else {
      return { indicator: "Done", status: "執行結束", bgColor: "" };
    }
  } else {
    return { indicator: "@@@", status: "@@@", bgColor: "Err" };
  }
}

function Determine_status_of_sbyCmd(unixTime_Now, startTime_sCmd, endTime_sCmd) {
  if (startTime_sCmd === null || endTime_sCmd === null) {
    return { indicator: "#*#", status: "#*#", bgColor: "ErrData" };
  }

  if (unixTime_Now >= startTime_sCmd) {
    return { indicator: "Done", status: "待命結束", bgColor: "" };
  } else {
    return { indicator: "Standby", status: "待命中", bgColor: "standby" };
  }
}

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

function checkValuesFault(v1, v2, v3) {
  // 轉換數值為二進制並填補為 32 位元
  const binary1 = v1.toString(2).padStart(32, "0");
  const binary2 = v2.toString(2).padStart(32, "0");
  const binary3 = v3.toString(2).padStart(32, "0");

  // 檢查特定位元是否包含 1 404046/404048/404061
  const positions1 = [
    0, 1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 20, 21, 22, 23
  ]; // 第一個數值要檢查的位置
  const positions2 = [0, 1, 2, 3, 4]; // 第二個數值要檢查的位置
  const positions3 = [0, 11, 15]; // 第三個數值要檢查的位置

  // 檢查第一個數值的指定位置是否包含 1
  for (let position of positions1) {
    if (binary1.charAt(31 - position) === "1") {
      return 1; // 若指定位置出現 1，則返回 1
    }
  }

  // 檢查第二個數值的指定位置是否包含 1
  for (let position of positions2) {
    if (binary2.charAt(31 - position) === "1") {
      return 1; // 若指定位置出現 1，則返回 1
    }
  }

  // 檢查第三個數值的指定位置是否包含 1
  for (let position of positions3) {
    if (binary3.charAt(31 - position) === "1") {
      return 1; // 若指定位置出現 1，則返回 1
    }
  }

  return 0; // 若所有指定位置都沒有出現 1，則返回 0
}

// 測試
//console.log(checkValuesFault(44046, 404048, 404061)); // 1

// 1: Open
// 2: Close
// 3: Reset
function maponGridStatus_LC(input) {
  if (input === 1) {
    return "切離";
  }
  if (input === 2) {
    return "投入";
  }
  if (input === 3) {
    return "故障復位";
  }
  return "未定義";
}

function checkValuesalarm(values) {
  const binary1 = values.toString(2).padStart(32, "0");
  const positions1 = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 20];
  // 檢查第一個數值的指定位置是否包含 1
  for (let position of positions1) {
    if (binary1.charAt(31 - position) === "1") {
      return 1; // 若指定位置出現 1，則返回 1
    }
  }
  return 0; // 若所有指定位置都沒有出現 1，則返回 0
}
//電池總攬下的電池狀態
// bit 0: First SOC calibrate tip clear[CMD]
// bit 1: Second SOC calibrate tip clear[CMD]
// bit 2: First SOC calibrate tip clear cancel[CMD]
// bit 3: Second SOC calibrate tip clear cancel[CMD]
// bit 8: Ready
// bit 9: Idle
// bit 10: Off-line
// bit 12: Main switch off[CMD]
// bit 13: Main switch on[CMD]
// bit 14: Discharge mode
// bit 15: Charge mode

//電池總攬
function workStatuschange(var1, var2, var3, var4, var5, var6, var7) {
  // 將變數轉換為二進制並固定長度為32
  const binaryInputs = [
    var1 != null
      ? var1.toString(2).padStart(32, "0")
      : "00000000000000000000000000000000",
    var2 != null
      ? var2.toString(2).padStart(32, "0")
      : "00000000000000000000000000000000",
    var3 != null
      ? var3.toString(2).padStart(32, "0")
      : "00000000000000000000000000000000",
    var4 != null
      ? var4.toString(2).padStart(32, "0")
      : "00000000000000000000000000000000",
    var5 != null
      ? var5.toString(2).padStart(32, "0")
      : "00000000000000000000000000000000",
    var6 != null
      ? var6.toString(2).padStart(32, "0")
      : "00000000000000000000000000000000",
    var7 != null
      ? var7.toString(2).padStart(32, "0")
      : "00000000000000000000000000000000"
  ];

  // 初始化總和為0
  let sum = 0;

  // 檢查每個二進制輸入的第8和第13位是否為1
  for (let i = 0; i < binaryInputs.length; i++) {
    if (binaryInputs[i][31 - 8] === "1" && binaryInputs[i][31 - 13] === "1") {
      sum += 1;
    }
  }

  if (sum === 0) {
    console.log("0");
    return "停機";
  } else if (sum === 7) {
    console.log("7");
    return "正常";
  } else {
    console.log("");
    return "部分運作";
  }
}

// 測試函數
// const result = workStatuschange(8448, 8448, 8448, 8448, 8448, 8448, 8448);
// console.log(result); // 這將輸出符合條件的總和
//******************************************************************************* */
function workStatus_LC(input) {
  if (input === 0) {
    return "併網";
  } else if (input === 1) {
    return "離網";
  }
}

// "0: Grid mode
// 1: Off-grid mode"

//******************************************************************************* */
function maponGridStatus(input1, input2, input3, input4) {
  const sum = input1 + input2 + input3 + input4;
  if (sum === 0) {
    return "併網";
  } else if (sum === 4) {
    return "離網";
  } else {
    return "部分併網";
  }
}

//******************************************************************************* */
function mapBMSMode(input) {
  const binary = input.toString(2).padStart(32, "0");
  //console.log("binary:" + binary);
  const bit8 = 31 - 8;
  const bit13 = 31 - 13;
  const bit9 = 31 - 9;
  const bit12 = 31 - 12;

  //console.log("bit15:" + bit15);
  if (binary[bit8] === "1" || binary[bit13] === "1") {
    //console.log("Not Available");
    return "運轉中";
  } else if (binary[bit9] === "1" && binary[bit12] === "1") {
    //console.log("Available");
    return "停機中";
  }
  return "檢查";
}

// bit 0: First SOC calibrate tip clear[CMD]
// bit 1: Second SOC calibrate tip clear[CMD]
// bit 2: First SOC calibrate tip clear cancel[CMD]
// bit 3: Second SOC calibrate tip clear cancel[CMD]
// bit 8: Ready
// bit 9: Idle
// bit 10: Off-line
// bit 12: Main switch off[CMD]
// bit 13: Main switch on[CMD]
// bit 14: Discharge mode
// bit 15: Charge mode
//******************************************************************************* */
//側邊欄位
//最上面的狀態顯示轉換
function mapL_M_systemMode(var1, var2, var3, var4) {
  // 將 var1 轉換為二進制字串
  const bVar1 = var1.toString(2).padStart(32, "0");
  const bVar2 = var2.toString(2).padStart(32, "0");
  const bVar3 = var3.toString(2).padStart(32, "0");
  const bVar4 = var4.toString(2).padStart(32, "0");
  //console.log("binaryVar1: " + bVar1);

  // 提取特定位元的值
  const binaryArray1 = bVar1.split("").reverse(); // 反轉字串並轉換為字元陣列
  const binaryArray2 = bVar2.split("").reverse(); // 反轉字串並轉換為字元陣列
  const binaryArray3 = bVar3.split("").reverse(); // 反轉字串並轉換為字元陣列
  const binaryArray4 = bVar4.split("").reverse(); // 反轉字串並轉換為字元陣列

  const SystemAvailability = parseInt(binaryArray1[14] || "0"); // bit15 總系統狀態

  const var1_SubSys_Availability = parseInt(binaryArray1[3] || "0"); // bit4
  const var1_edReg = parseInt(binaryArray1[4] || "0"); // bit5
  const var2_SubSys_Availability = parseInt(binaryArray2[3] || "0"); // bit4
  const var2_edReg = parseInt(binaryArray2[4] || "0"); // bit5
  const var3_SubSys_Availability = parseInt(binaryArray3[3] || "0"); // bit4
  const var3_edReg = parseInt(binaryArray3[4] || "0"); // bit5
  const var4_SubSys_Availability = parseInt(binaryArray4[3] || "0"); // bit4
  const var4_edReg = parseInt(binaryArray4[4] || "0"); // bit5

  if (
    var1_SubSys_Availability == 1 &&
    var1_edReg == 1 &&
    var2_SubSys_Availability == 1 &&
    var2_edReg == 1 &&
    var3_SubSys_Availability == 1 &&
    var3_edReg == 1 &&
    var4_SubSys_Availability == 1 &&
    var4_edReg == 1
  ) {
    //console.log("調頻服務中");
    return "調頻服務中";
  } else {
    if (
      (var1_SubSys_Availability == 1 && var1_edReg == 1) ||
      (var2_SubSys_Availability == 1 && var2_edReg == 1) ||
      (var3_SubSys_Availability == 1 && var3_edReg == 1) ||
      (var4_SubSys_Availability == 1 && var4_edReg == 1)
    ) {
      //console.log("部分服務中");
      return "部分服務中";
    } else {
      //console.log("暫停服務");
      return "暫停服務";
    }
  }
}
//mapL_M_systemMode(32895, 127, 0, 127);
//******************************************************************************* */
function mapminSOH(...input) {
  if (input.length === 0) {
    throw new Error("至少需要提供一個數值作為參數");
  }

  let min = input[0]; // 將第一個數值視為最小值

  // 遍歷所有傳入的數值，找到最小值
  for (let i = 1; i < input.length; i++) {
    if (input[i] < min) {
      min = input[i];
    }
  }

  return min;
}
//@*******************************************************************************@ */
//模式控制頁面相關
//對照系統可用性
function mapSysMode(SysMode) {
  const binary = SysMode.toString(2).padStart(32, "0");
  //console.log("binary:" + binary);
  const bit15 = 31 - 15;
  const bit5 = 31 - 5;
  //console.log("bit15:" + bit15);
  //console.log("bit5:" + bit5);
  if (binary[bit15] === "0") {
    //console.log("Not Available");
    return "停機";
  } else if (binary[bit15] === "1" && binary[bit5] === "1") {
    //console.log("Available");
    return "E-dreg";
  }
}

// mapSysMode(0);
// mapSysMode(32768);
//******************************************************************************* */

function mapStatusAllPCS(pcs1, pcs2, pcs3, pcs4) {
  const pcs1_binary = pcs1.toString(2).padStart(32, "0");
  const pcs2_binary = pcs2.toString(2).padStart(32, "0");
  const pcs3_binary = pcs3.toString(2).padStart(32, "0");
  const pcs4_binary = pcs4.toString(2).padStart(32, "0");

  // console.log("pcs1_binary:" + pcs1_binary);
  // console.log("pcs2_binary:" + pcs2_binary);
  // console.log("pcs3_binary:" + pcs3_binary);
  // console.log("pcs4_binary:" + pcs4_binary);

  const bit = 31 - 2;
  //console.log("bit:" + bit);

  if (
    pcs1_binary[bit] === "1" ||
    pcs2_binary[bit] === "1" ||
    pcs3_binary[bit] === "1" ||
    pcs4_binary[bit] === "1"
  ) {
    //console.log("Available");
    return "全部投入";
  } else if (
    pcs1_binary[bit] === "0" ||
    pcs2_binary[bit] === "0" ||
    pcs3_binary[bit] === "0" ||
    pcs4_binary[bit] === "0"
  ) {
    //console.log("Available");
    return "全部切離";
  } else {
    //console.log("Not Available");
    return "部分投入";
  }
}
//mapStatusAllPCS(0, 0, 0, 0);
//******************************************************************************* */

function mapStatusAllBMS(bms1, bms2, bms3, bms4) {
  const bms1_binary = bms1.toString(2).padStart(32, "0");
  const bms2_binary = bms2.toString(2).padStart(32, "0");
  const bms3_binary = bms3.toString(2).padStart(32, "0");
  const bms4_binary = bms4.toString(2).padStart(32, "0");

  // console.log("bms1_binary:" + bms1_binary);
  // console.log("bms2_binary:" + bms2_binary);
  // console.log("bms3_binary:" + bms3_binary);
  // console.log("bms4_binary:" + bms4_binary);

  const bit0 = 31 - 0;
  const bit1 = 31 - 1;
  // console.log("bit0:" + bit0);
  // console.log("bit1:" + bit1);

  if (
    bms1_binary[bit0] === "1" ||
    bms2_binary[bit0] === "1" ||
    bms3_binary[bit0] === "1" ||
    bms4_binary[bit0] === "1" ||
    bms1_binary[bit1] === "1" ||
    bms2_binary[bit1] === "1" ||
    bms3_binary[bit1] === "1" ||
    bms4_binary[bit1] === "1"
  ) {
    //console.log("Available");
    return "全部投入";
  } else if (
    bms1_binary[bit0] === "0" ||
    bms2_binary[bit0] === "0" ||
    bms3_binary[bit0] === "0" ||
    bms4_binary[bit0] === "0" ||
    bms1_binary[bit1] === "0" ||
    bms2_binary[bit1] === "0" ||
    bms3_binary[bit1] === "0" ||
    bms4_binary[bit1] === "0"
  ) {
    //console.log("Not Available");
    return "部分投入";
  } else {
    //console.log("Not Available");
    return "全部切離";
  }
}
//******************************************************************************* */
function mapSysAvailability(SysAvailability) {
  const SysAvailability_binary = SysAvailability.toString(2).padStart(32, "0");
  //console.log("SysAvailability_binary:" + SysAvailability_binary);

  const bit15 = 31 - 15;
  //console.log("bit15:" + bit15);
  if (SysAvailability_binary[bit15] === "0") {
    //console.log("Not Available");
    return "異常";
  } else if (SysAvailability_binary[bit15] === "1") {
    //console.log("Available");
    return "正常";
  }
}

function mapStopCHGsched(StopCHGsched) {
  //bit 14: Force P_LS to 0 ( 0: No, 1: Yes )
  const StopCHGsched_binary = StopCHGsched.toString(2).padStart(32, "0");
  //console.log("StopCHGsched_binary:" + StopCHGsched_binary);
  const bit14 = 31 - 14;
  //console.log("bit14:" + bit14);
  if (StopCHGsched_binary[bit14] === "0") {
    //console.log("Not Available");
    return "停止排程";
  } else if (StopCHGsched_binary[bit14] === "1") {
    //console.log("Available");
    return "執行排程";
  }
}

//******************************************************************************* */
function mapAutoMan(input, bit) {
  //( 0: Manual, 1: Auto )
  const input_binary = input.toString(2).padStart(32, "0");
  const bits = 31 - bit;
  if (input_binary[bits] === "0") {
    //console.log("Manual");
    return "手動";
  } else if (input_binary[bits] === "1") {
    //console.log("Auto");
    return "自動";
  }
}
//******************************************************************************* *///******************************************************************************* */
//bit 3: ESS & PCS Availability ( 0: Not Available, 1: Available )
function mapBMSPCSstatus(input) {
  const input_binary = input.toString(2).padStart(32, "0");
  const bits3 = 31 - 3;
  if (input_binary[bits3] === "0") {
    //console.log("Not Available");
    return "異常";
  } else if (input_binary[bits3] === "1") {
    //console.log("Available");
    return "正常";
  }
}
//******************************************************************************* *///******************************************************************************* */
function mapAvail_SS(input) {
  const input_binary = input.toString(2).padStart(32, "0");
  const bits4 = 31 - 4;
  if (input_binary[bits4] === "0") {
    //console.log("Not Available");
    return "異常";
  } else if (input_binary[bits4] === "1") {
    //console.log("Available");
    return "正常";
  }
}
//******************************************************************************* *///******************************************************************************* */
function mapAvail_SS(input) {
  const input_binary = input.toString(2).padStart(32, "0");
  const bits4 = 31 - 4;
  if (input_binary[bits4] === "0") {
    //console.log("Not Available");
    return "異常";
  } else if (input_binary[bits4] === "1") {
    //console.log("Available");
    return "正常";
  }
}
//******************************************************************************* *///******************************************************************************* */
//bit 5: E-dReg ( 0: Stop, 1: Running )
function mapEdReg_SS(input) {
  const input_binary = input.toString(2).padStart(32, "0");
  const bits5 = 31 - 5;
  if (input_binary[bits5] === "0") {
    //console.log("Not Available");
    return "異常";
  } else if (input_binary[bits5] === "1") {
    //console.log("Available");
    return "正常";
  }
}

//******************************************************************************* *///******************************************************************************* */

function mapUPSwarning(inputs, checkbit) {
  if (inputs === "" || inputs === null) {
    return "inputisnull";
  } else {
    // 將 inputs 轉換為二進制
    let binaryInput = "";
    if (typeof inputs === "number") {
      binaryInput = inputs.toString(2).padStart(32, "0"); // 將數字轉換為固定長度的二進制字符串
    } else if (typeof inputs === "string") {
      // 如果 inputs 是字符串，則將每個字符轉換為二進制
      for (let i = 0; i < inputs.length; i++) {
        const charCode = inputs.charCodeAt(i);
        const binaryCharCode = charCode.toString(2);
        binaryInput += binaryCharCode.padStart(32, "0"); // 補齊為8位二進制
      }
    } else {
      //console.log("invalidinput");
      return "invalidinput"; // 如果 inputs 不是字符串也不是數字，則返回無效輸入
    }

    //console.log("binaryInput:" + binaryInput);

    // 檢查二進制轉換後的 inputs 中，與 checkbit 位置對應的數字是否為 1
    let result = binaryInput[31 - checkbit] === "1" ? "1" : "0";

    //console.log(result);
    return result;
  }
}

// mapUPSwarning(512, 9);
// mapUPSwarning(1024, 10);
// mapUPSwarning(10, 1);
// mapUPSwarning(2, 1);

//******************************************************************************* *///******************************************************************************* */

module.exports = {
  calculateAverage,
  mapchargeStatus,
  scaleProcess,
  countPCSAlarmAndFault,
  mapgridStatus,
  Scale_Data,
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
  Convert_socRef_kWh_to_pct,
  Determine_BGC_of_VcMaxDiff,
  Determine_BGC_of_TcMaxDiff,
  Determine_DL_of_RackHWStatus,
  Determine_DL_of_upsStatus2,
  Determine_DL_of_AlarmWord,
  Determine_DL_of_AlarmWords,
  Determine_DL_of_CommDevice,
  Determine_DL_of_CommPCSBMS,
  Determine_statusL_of_recloser,
  Determine_statusL_of_VCB,
  Determine_statusL_of_ACB,
  Determine_status_of_exeCmd,
  Determine_status_of_sbyCmd,
  workStatuschange,
  calculateAdd,
  //****************** */
  mapL_M_systemMode,
  mapminSOH,
  mapModeActPas,
  mapModeQctrl,
  mapStandbyCmd,
  mapModeLR,
  mapPCSWorkingstatus,
  //****************** */
  mapSysMode,
  mapStatusAllBMS,
  mapStatusAllPCS,
  mapSysAvailability,
  mapStopCHGsched,
  mapAutoMan,
  mapBMSPCSstatus,
  mapAvail_SS,
  mapEdReg_SS,
  //****************** */
  mapUPSwarning,
  mapworkMode_page,
  mapworkStatus_page,
  mapPCSworkStatus,
  mapgridStatus_page,
  maponGridStatus,
  workStatus_LC,
  checkValuesFault,
  checkValuesalarm,
  maponGridStatus_LC,
  mapBMSMode
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

const rawData = 0;
const NumberOfDigit = 16;
const pcsCHGStatus_MT = {
  17: "Charging",
  55: "Discharging",
  98: "Non-working state"
};
const sysCtrl_2_MT = {
  0: { 0: "否", 1: "是" },
  3: { 0: "禁用", 1: "啟用" },
  5: { 0: "頻率表", 1: "測試頻率" },
  6: { 0: "手動", 1: "自動" },
  9: { 0: "正常", 1: "異常" },
  10: { 0: "正常", 1: "通訊異常" },
  13: { 0: "SOC", 1: "Volt" }
};
const pcsWorkStatus_spBitList = [0, 1, 2, 5, 6, 10, 13, 14, 17, 20, 22];

// let ab = Scale_Data(rawData, 0.01, 1);
// console.log(ab);

// let cd_BitString = Convert_UInt_to_revBitString(rawData, NumberOfDigit);
// console.log(cd_BitString);

// let ef = Convert_UInt_to_BitString(rawData, NumberOfDigit);
// console.log(ef);
// console.log(ef.bitString);
// console.log(typeof ef.bitString);
// console.log(ef.num_ClosedBit);
// console.log(typeof ef.num_ClosedBit);

// let gh = mapWordStatus(rawData, pcsCHGStatus_MT);
// console.log(gh);

// const ij = mapBitStatus(cd_BitString, sysCtrl_2_MT, 6);
// console.log(ij);

// const kl = getHighLowByte(rawData);
// console.log(kl);
// console.log(kl["hiByte"]);
// console.log(kl.loByte);

// const mn = Convert_unixTime_to_dateTime(rawData);
// console.log(mn);

// const E_G = 123;
// const E_M = 987;
// const E_k = 456;
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

// const maxData = 276;
// const minData = 256;
// const yz = Determine_BGC_of_TcMaxDiff(maxData, minData);
// console.log(yz);

// const ab_2 = Determine_DL_of_RackHWStatus(rawData);
// console.log(ab_2);

// const cd_2 = Determine_DL_of_upsStatus2(rawData);
// console.log(cd_2);

// const ef_2 = Determine_DL_of_CommDevice(rawData);
// console.log(ef_2);

// let CommLC = 0;
// let CommPCSBMS = "1";
// const ef_2 = Determine_DL_of_CommPCSBMS(CommLC, CommPCSBMS);
// console.log(ef_2);

// const rawData1 = 1;
// const rawData2 = 1;
// const rawData3 = 0;
// const rawData4 = 0;
// const rawData5 = 0;
// const gh_2 = Determine_statusL_of_recloser(rawData1, rawData2);
// console.log(gh_2);

// const data3 = "10011";
// const ij_2 = Determine_statusL_of_VCB(data3[0], data3[1], data3[2]);
// console.log(ij_2);
// const kl_2 = Determine_statusL_of_ACB(data3[3], data3[4]);
// console.log(kl_2);

// const mn_2 = Determine_DL_of_AlarmWord(rawData1);
// console.log(mn_2);
// const op_2 = Determine_DL_of_AlarmWords([rawData1, rawData2, rawData3, rawData4]);
// console.log(op_2);

// const qr_2 = Convert_socRef_kWh_to_pct(rawData);
// console.log(qr_2);

// const unixTime_Now = 13;
// const startTime = 15;
// const endTime = 19;
// const st_2 = Determine_status_of_exeCmd(unixTime_Now, startTime, endTime);
// console.log(st_2);
// const uv_2 = Determine_status_of_sbyCmd(unixTime_Now, startTime, endTime);
// console.log(uv_2);

/////////////////////////////////////////////////////////////////////////

// let ab_123 = setTimeout(function () { console.log('x 秒後執行 console'); }, 3000);
// let ab_234 = setTimeout(function () { console.log('y 秒後執行 console'); }, 3300);
// setTimeout(function () { console.log('z 秒後執行 console'); }, 3600);
// console.log(ab_123);
// console.log(ab_234);

// function b() {
//   console.log("b");
// }

// setTimeout(b, 5000) // 5 秒後出現 b

/////////////////////////////////////////////////////////////////////////

// let test_data = 17;
// test_setTimeout(test_data);
// console.log(test_data);

// function test_setTimeout(abc) {
//   console.log(`開始, ans=${abc}`);
//   setTimeout(function () { mani_number(abc); }, 3000);
//   console.log(`緊接著setTimeout, ans=${abc}`);
// }

// function mani_number(num) {
//   num = num * 2 + 10;
//   console.log(`setTimeout後(?), ans=${num}`);
// }

/////////////////////////////////////////////////////////////////////////

// let abcde_123 = "o";
// console.log(Number(abcde_123));
// console.log(typeof Number(abcde_123));
