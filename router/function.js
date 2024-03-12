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
  if (typeof decimalValue !== "number" || isNaN(decimalValue)) {
    if (decimalValue === null) {
      return "NAN//";
      decimalValue = 0;
      //console.log("decimalValue = null");
    } else if (typeof decimalValue === "string") {
      decimalValue = 0;
      return "string//";
      //console.log("decimalValue=" + decimalValue);
    } else {
      //console.log("decimalValue must be a number.");
      return "OXO//";
    }
  }

  if (typeof scale !== "number" || isNaN(scale)) {
    //console.log("scale must be a number.");
    return "scale NAN//";
  }

  if (typeof point !== "number" || isNaN(point)) {
    //console.log("point must be a number.");
    return "number NAN//";
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

function mapPCSonlineNum(lc1, lc2, lc3, lc4) {
  if (lc1 < 3 && lc2 < 3 && lc3 < 3 && lc4 < 3) {
    const sum = lc1 + lc2 + lc3 + lc4;
    return sum;
  } else {
    return "err?";
  }
}

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

  if (rawData === null ) {
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
  // 待優化
  let keysArray_MT = Object.keys(mapTable);

  for (i = 0; i < keysArray_MT.length; i++) {
    if (rawData == keysArray_MT[i]) {
      return mapTable[rawData];
    }
  }

  return "Not found(" + rawData + ")";
}

function mapBitStatus(bitString, mapTable, NumberOfBit) {
  // 待優化
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

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

function checkValues(value1, value2, value3) {
  // 判斷是否有任一數值不為零
  if (value1 !== 0 || value2 !== 0 || value3 !== 0) {
    return 1;
  } else {
    return 0;
  }
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
      : "00000000000000000000000000000000",
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
  mapPCSworkStatus,
  mapPCSonlineNum,
  calculateAverage,
  mapchargeStatus,
  scaleProcess,
  //mapPCSWorkingMode,
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
  Determine_BGC_of_VcMaxDiff,
  Determine_BGC_of_TcMaxDiff,
  Determine_DL_of_RackHWStatus,
  Determine_DL_of_upsStatus2,
  Determine_DL_of_CommDevice,
  Determine_DL_of_CommPCSBMS,
  Determine_statusL_of_recloser,
  Determine_statusL_of_VCB,
  Determine_statusL_of_ACB,
  checkValues,
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
  //counttotalWarningNum,
  //countWarningNum_Meter,
  //calculateWarningNum_PCS,
  //calculateWarningNum_Bat,
  //calculateWarningNum_FF,
  //cal_BSC,
  //cal_HVAC,
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
  //****************** */
  mapUPSwarning,
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

const rawData = 57913;
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
const pcsWorkStatus_spBitList = [0, 1, 2, 5, 6, 10, 13, 14, 17, 20, 22];
