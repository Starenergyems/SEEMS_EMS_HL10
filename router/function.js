const { timeLog, Console } = require("console");
const readline = require("readline");
//-------------------------------------------------------------------------------------------------
// 定義計算平均值的函數
function calculateAverage(...numbers) {
  if (numbers.length === 0) {
    return 0; // 避免除以零的情況
  }
  countWarningNum_Meter;
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

function scaleProcess(decimalValue, scale, point) {
  // 檢查輸入是否合法
  if (typeof decimalValue !== "number" || isNaN(decimalValue)) {
    if (decimalValue === null) {
      decimalValue = 0;
      console.log("decimalValue=null");
    } else if (typeof decimalValue === "string") {
      decimalValue = 0;
      console.log("decimalValue=" + decimalValue);
    } else {
      console.log("decimalValue must be a number.");
      return;
    }
  }

  if (typeof scale !== "number" || isNaN(scale)) {
    console.log("scale must be a number.");
    return;
  }

  if (typeof point !== "number" || isNaN(point)) {
    console.log("point must be a number.");
    return;
  }

  // 將 decimalValue 乘上 scale
  let result = decimalValue * scale;

  // 限制小數點位數
  result = result.toFixed(point);
  return result;
}

// 測試
console.log(scaleProcess(5, 2, 2)); // 10.00
console.log(scaleProcess(null, 2, 2)); // decimalValue=null
console.log(scaleProcess("test", 2, 2)); // decimalValue=test
console.log(scaleProcess(5, "test", 2)); // scale must be a number.
console.log(scaleProcess(5, 2, "test")); // point must be a number.

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

//***************************************************************************** */
//PCSWorkingStatus
function mapPCSworkStatus(lc1, lc2, lc3, lc4) {
  const sum = lc1 + lc2 + lc3 + lc4;
  if (sum === 7) {
    return "運轉中";
  } else if (sum <= 6 && sum >= 1) {
    return "部分運轉中";
  } else {
    return "停機";
  }
}

// console.log("pcs測試結果1:" + mapPCSworkStatus(2, 2, 2, 1));
// console.log("pcs測試結果2:" + mapPCSworkStatus(1, 1, 1, 1));
// console.log("pcs測試結果3:" + mapPCSworkStatus(0, 0, 0, 0));

function mapPCSonlineNum(lc1, lc2, lc3, lc4) {
  if (lc1 < 3 && lc2 < 3 && lc3 < 3 && lc4 < 3) {
    const sum = lc1 + lc2 + lc3 + lc4;
    return sum;
  } else {
    return "err?";
  }
}
//console.log("pcs加總測試結果1:" + mapPCSonlineNum(1, 2, 0, 1));

function mapModeActPas(input) {
  if (input === 0) {
    return "Active mode";
  }
  if (input === 1) {
    return "Passive mode";
  }
}
function mapModeQctrl(input) {
  if (input === 85) {
    return "Off";
  }
  if (input === 161) {
    return "Power factor mode";
  }
  if (input === 162) {
    return "Reactive power mode";
  }
}
function mapStandbyCmd(input) {
  if (input === 85) {
    return "PCS exit standby";
  }
  if (input === 170) {
    return "PCS standby";
  }
}
function mapModeLR(input) {
  if (input === 1) {
    return "Local & Remote";
  }
  if (input === 2) {
    return "Remote";
  }
  if (input === 3) {
    return "local";
  }
}
//***************************************************************************** */
//PCSWorkingMode
function mapPCSWorkingstatus(input1, input2) {
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
    15: "Communication exception",
  };

  const statusMap2 = {
    0: "On-grid constant current",
    1: "On-grid constant voltage",
    2: "On-grid constant power (AC)",
    3: "On-grid constant power (DC)",
    9: "On-grid mode",
    10: "Off-grid mode",
    11: "VSG mode",
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

function checkValues(value1, value2, value3) {
  // 判斷是否有任一數值不為零
  if (value1 !== 0 || value2 !== 0 || value3 !== 0) {
    return 1;
  } else {
    return 0;
  }
}

function workStatuschange(var1, var2, var3, var4) {
  // 將每個變數轉換為固定16位的二進制字串
  const binaryVar1 = var1.toString(2).padStart(16, "0");
  const binaryVar2 = var2.toString(2).padStart(16, "0");
  const binaryVar3 = var3.toString(2).padStart(16, "0");
  const binaryVar4 = var4.toString(2).padStart(16, "0");

  // 檢查每個位置上的位元是否只有一個1
  const isValid =
    countOnes(var1) === 1 &&
    countOnes(var2) === 1 &&
    countOnes(var3) === 1 &&
    countOnes(var4) === 1;

  if (isValid) {
    // 檢查位置是否一致
    const arePositionsEqual =
      binaryVar1 === binaryVar2 &&
      binaryVar1 === binaryVar3 &&
      binaryVar1 === binaryVar4;

    // 如果位置一致，返回位置號碼
    if (arePositionsEqual) {
      return parseInt(binaryVar1, 2);
    }
  }

  // 如果位置不一致或條件不滿足，返回 0
  return "0";
}

// Example Usage:
//const result = workStatuschange(1, 1, 1, 1);
//console.log(result);

function countOnes(value) {
  let count = 0;
  while (value) {
    count += value & 1;
    value >>= 1;
  }
  return count;
}

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
    console.log("調頻服務中");
    return "調頻服務中";
  } else {
    if (
      (var1_SubSys_Availability == 1 && var1_edReg == 1) ||
      (var2_SubSys_Availability == 1 && var2_edReg == 1) ||
      (var3_SubSys_Availability == 1 && var3_edReg == 1) ||
      (var4_SubSys_Availability == 1 && var4_edReg == 1)
    ) {
      console.log("部分服務中");
      return "部分服務中";
    } else {
      console.log("暫停服務");
      return "暫停服務";
    }
  }
}
//mapL_M_systemMode(32895, 127, 0, 127);
//******************************************************************************* */
// 告警總數量(右邊/黃色)
function counttotalWarningNum() { }
//******************************************************************************* */
// 電表總告警數量
function countWarningNum_Meter() { }
//******************************************************************************* */
// PCS總告警數量
function calculateWarningNum_PCS() { }

//******************************************************************************* */
// 電池告警數量
function calculateWarningNum_Bat(...args) { }
//******************************************************************************* */
// 環境告警數量
// BSC告警數量
function calculateWarningNum_Env() { }
//******************************************************************************* */
// FF(消防)總告警數量
function calculateWarningNum_FF(...args) { }
//******************************************************************************* */
//******************************************************************************* */
//******************************************************************************* */
// 錯誤總數量(左邊/紅色)
function calculatetotalAlarmNum() { }
//******************************************************************************* */
// 電表總錯誤數量
function calculateAlarmNum_Meter() { }
//******************************************************************************* */
// PCS總錯誤數量
function calculatetAlarmNum_PCS() { }
//******************************************************************************* */
// 電池總錯誤數量
function calculatetAlarmNum_Bat() { }
//******************************************************************************* */
// 環境總錯誤數量
function calculatetAlarmNum_Env() { }
//******************************************************************************* */
// 消防總錯誤數量
function calculatetAlarmNum_FF() { }
//******************************************************************************* */
//******************************************************************************* */

//@*******************************************************************************@ */
//模式控制頁面相關
//對照系統可用性
function mapSysMode(SysMode) {
  const binary = SysMode.toString(2).padStart(32, "0");
  console.log("binary:" + binary);
  const bit = 31 - 15;
  console.log("bit:" + bit);
  if (binary[bit] === "0") {
    //console.log("Not Available");
    return "Not Available";
  } else if (binary[bit] === "1") {
    //console.log("Available");
    return "Available";
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

  console.log("pcs1_binary:" + pcs1_binary);
  console.log("pcs2_binary:" + pcs2_binary);
  console.log("pcs3_binary:" + pcs3_binary);
  console.log("pcs4_binary:" + pcs4_binary);

  const bit = 31 - 2;
  console.log("bit:" + bit);

  if (
    pcs1_binary[bit] === "1" ||
    pcs2_binary[bit] === "1" ||
    pcs3_binary[bit] === "1" ||
    pcs4_binary[bit] === "1"
  ) {
    console.log("Available");
    //return "Available";
  } else {
    console.log("Not Available");
    //return "Not Available";
  }
}
//mapStatusAllPCS(0, 0, 0, 0);
//******************************************************************************* */

function mapStatusAllBMS(bms1, bms2, bms3, bms4) {
  const bms1_binary = bms1.toString(2).padStart(32, "0");
  const bms2_binary = bms2.toString(2).padStart(32, "0");
  const bms3_binary = bms3.toString(2).padStart(32, "0");
  const bms4_binary = bms3.toString(2).padStart(32, "0");

  console.log("bms1_binary:" + bms1_binary);
  console.log("bms2_binary:" + bms2_binary);
  console.log("bms3_binary:" + bms3_binary);
  console.log("bms4_binary:" + bms4_binary);

  const bit0 = 31 - 0;
  const bit1 = 31 - 1;
  console.log("bit0:" + bit0);
  console.log("bit1:" + bit1);

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
    return "Available";
  } else {
    //console.log("Not Available");
    return "Not Available";
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
    return "Not Available";
  } else if (SysAvailability_binary[bit15] === "1") {
    //console.log("Available");
    return "Available";
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
    return "No";
  } else if (StopCHGsched_binary[bit14] === "1") {
    //console.log("Available");
    return "Yes";
  }
}

//******************************************************************************* */
function mapAutoMan(input, bit) {
  //( 0: Manual, 1: Auto )
  const input_binary = input.toString(2).padStart(32, "0");
  const bits = 31 - bit;
  if (input_binary[bits] === "0") {
    //console.log("Manual");
    return "Manual";
  } else if (input_binary[bits] === "1") {
    //console.log("Auto");
    return "Auto";
  }
}
//******************************************************************************* *///******************************************************************************* */
//bit 3: ESS & PCS Availability ( 0: Not Available, 1: Available )
function mapBMSPCSstatus(input) {
  const input_binary = input.toString(2).padStart(32, "0");
  const bits3 = 31 - 3;
  if (input_binary[bits3] === "0") {
    //console.log("Not Available");
    return "Not Available";
  } else if (input_binary[bits3] === "1") {
    //console.log("Available");
    return "Available";
  }
}
//******************************************************************************* *///******************************************************************************* */
function mapAvail_SS(input) {
  const input_binary = input.toString(2).padStart(32, "0");
  const bits4 = 31 - 4;
  if (input_binary[bits4] === "0") {
    //console.log("Not Available");
    return "Not Available";
  } else if (input_binary[bits4] === "1") {
    //console.log("Available");
    return "Available";
  }
}
//******************************************************************************* *///******************************************************************************* */
function mapAvail_SS(input) {
  const input_binary = input.toString(2).padStart(32, "0");
  const bits4 = 31 - 4;
  if (input_binary[bits4] === "0") {
    //console.log("Not Available");
    return "Not Available";
  } else if (input_binary[bits4] === "1") {
    //console.log("Available");
    return "Available";
  }
}
//******************************************************************************* *///******************************************************************************* */
//bit 5: E-dReg ( 0: Stop, 1: Running )
function mapEdReg_SS(input) {
  const input_binary = input.toString(2).padStart(32, "0");
  const bits5 = 31 - 5;
  if (input_binary[bits5] === "0") {
    //console.log("Not Available");
    return "Not Available";
  } else if (input_binary[bits5] === "1") {
    //console.log("Available");
    return "Available";
  }
}
//******************************************************************************* *///******************************************************************************* */

module.exports = {
  mapPCSworkStatus,
  mapPCSonlineNum,
  calculateAverage,
  mapchargeStatus,
  scaleProcess,
  //mapPCSWorkingMode,
  mapgridStatus,
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
  checkValues,
  workStatuschange,
  calculateAdd,
  //****************** */
  // mapL_M_systemMode,
  // counttotalWarningNum,
  // countWarningNum_Meter,
  // calculateWarningNum_PCS,
  // calculateWarningNum_Bat,
  // calculateWarningNum_FF,
  // cal_BSC,
  // cal_HVAC,
  // cal_Temperature,
  // cal_Humidity,
  // cal_UPS_1,
  // cal_UPS_2,
  // calculateWarningNum_Env,
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

//-------------------------------------------------------------------------------------------------
