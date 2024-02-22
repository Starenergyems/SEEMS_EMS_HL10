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

function scaleProcess(decimalValue, scale, point) {
  // 檢查輸入是否合法
  if (
    typeof decimalValue !== "number" ||
    typeof scale !== "number" ||
    typeof point !== "number"
  ) {
    console.log("All parameters must be numbers");
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

  // console.log("SystemAvailability: " + SystemAvailability);
  // console.log("binaryArray1: " + binaryArray1);
  // console.log("binaryArray2: " + binaryArray2);
  // console.log("binaryArray3: " + binaryArray3);
  // console.log("binaryArray4: " + binaryArray4);
  // console.log("****************************************");
  // console.log("1-bit4: " + var1_SubSys_Availability);
  // console.log("1-bit5: " + var1_edReg);
  // console.log("2-bit4: " + var2_SubSys_Availability);
  // console.log("2-bit5: " + var2_edReg);
  // console.log("3-bit4: " + var3_SubSys_Availability);
  // console.log("3-bit5: " + var3_edReg);
  // console.log("4-bit4: " + var4_SubSys_Availability);
  // console.log("4-bit5: " + var4_edReg);
  // console.log("****************************************");

  // 0: Not Available, 1: Available
  // if (SystemAvailability == 1) {
  //   return "System is not available";
  // }
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
function counttotalWarningNum() {}
//******************************************************************************* */
// 電表總告警數量
function countWarningNum_Meter() {}
//******************************************************************************* */
// PCS總告警數量
function calculateWarningNum_PCS(
  lc1_all,
  lc1_u1_1,
  lc1_u1_2,
  lc1_u1_3,
  lc1_u2_1,
  lc1_u2_2,
  lc1_u2_3,
  lc2_all,
  lc2_u1_1,
  lc2_u1_2,
  lc2_u1_3,
  lc2_u2_1,
  lc2_u2_2,
  lc2_u2_3,
  lc3_all,
  lc3_u1_1,
  lc3_u1_2,
  lc3_u1_3,
  lc3_u2_1,
  lc3_u2_2,
  lc3_u2_3,
  lc4_all,
  lc4_u1,
  lc4_u2
) {
  // 定義一個輔助函數來計算二進制中的 1 的數量
  function countOnes(binary, name) {
    const onesCount = (binary.toString(2).match(/1/g) || []).length;
    //console.log(`${name}: ${onesCount}`);
    return onesCount;
  }

  // 定義一個函數來檢查 1 的數量是否超過限制
  function checkOnes(name, value, limit) {
    const onesCount = countOnes(value, name);
    if (onesCount > limit) {
      onesCount == 0;
      console.log(`Warning: ${name} has more than ${limit} ones.`);
    }
    return onesCount;
  }

  let totalOnes = 0;

  // 處理 lc1
  const lc1_all_ones = checkOnes("lc1_all", lc1_all, 3);
  const lc1_u1_1_ones = checkOnes("lc1_u1_1", lc1_u1_1, 11);
  const lc1_u1_2_ones = checkOnes("lc1_u1_2", lc1_u1_2, 4);
  const lc1_u1_3_ones = checkOnes("lc1_u1_3", lc1_u1_3, 3);
  const lc1_u2_1_ones = checkOnes("lc1_u2_1", lc1_u2_1, 11);
  const lc1_u2_2_ones = checkOnes("lc1_u2_2", lc1_u2_2, 4);
  const lc1_u2_3_ones = checkOnes("lc1_u2_3", lc1_u2_3, 3);

  // 處理 lc2
  const lc2_all_ones = checkOnes("lc2_all", lc2_all, 3);
  const lc2_u1_1_ones = checkOnes("lc2_u1_1", lc2_u1_1, 11);
  const lc2_u1_2_ones = checkOnes("lc2_u1_2", lc2_u1_2, 4);
  const lc2_u1_3_ones = checkOnes("lc2_u1_3", lc2_u1_3, 3);
  const lc2_u2_1_ones = checkOnes("lc2_u2_1", lc2_u2_1, 11);
  const lc2_u2_2_ones = checkOnes("lc2_u2_2", lc2_u2_2, 4);
  const lc2_u2_3_ones = checkOnes("lc2_u2_3", lc2_u2_3, 3);

  // 處理 lc3
  const lc3_all_ones = checkOnes("lc3_all", lc3_all, 3);
  const lc3_u1_1_ones = checkOnes("lc3_u1_1", lc3_u1_1, 11);
  const lc3_u1_2_ones = checkOnes("lc3_u1_2", lc3_u1_2, 4);
  const lc3_u1_3_ones = checkOnes("lc3_u1_3", lc3_u1_3, 3);
  const lc3_u2_1_ones = checkOnes("lc3_u2_1", lc3_u2_1, 11);
  const lc3_u2_2_ones = checkOnes("lc3_u2_2", lc3_u2_2, 4);
  const lc3_u2_3_ones = checkOnes("lc3_u2_3", lc3_u2_3, 3);

  // 處理 lc4
  const lc4_all_ones = checkOnes("lc4_all", lc4_all, 3);
  const lc4_u1_ones = checkOnes("lc4_u1", lc4_u1, 11);
  const lc4_u2_ones = checkOnes("lc4_u2", lc4_u2, 4);

  totalOnes =
    lc1_all_ones +
    lc1_u1_1_ones +
    lc1_u1_2_ones +
    lc1_u1_3_ones +
    lc1_u2_1_ones +
    lc1_u2_2_ones +
    lc1_u2_3_ones +
    lc2_all_ones +
    lc2_u1_1_ones +
    lc2_u1_2_ones +
    lc2_u1_3_ones +
    lc2_u2_1_ones +
    lc2_u2_2_ones +
    lc2_u2_3_ones +
    lc3_all_ones +
    lc3_u1_1_ones +
    lc3_u1_2_ones +
    lc3_u1_3_ones +
    lc3_u2_1_ones +
    lc3_u2_2_ones +
    lc3_u2_3_ones +
    lc4_all_ones +
    lc4_u1_ones +
    lc4_u2_ones;

  //console.log(`Total ones: ${totalOnes}`);

  return totalOnes;
}
// calculateWarningNum_PCS(
//   10, // lc1_all,
//   1, // lc1_u1_1,
//   0, // lc1_u1_2,
//   0, // lc1_u1_3,
//   0, // lc1_u2_1,
//   0, // lc1_u2_2,
//   0, // lc1_u2_3,
//   0, // lc2_all,
//   46, // lc2_u1_1,
//   0, // lc2_u1_2,
//   0, // lc2_u1_3,
//   0, // lc2_u2_1,
//   0, //lc2_u2_2,
//   0, // lc2_u2_3,
//   0, // lc3_all,
//   0, // lc3_u1_1,
//   0, // lc3_u1_2,
//   0, // lc3_u1_3,
//   0, // lc3_u2_1,
//   0, // lc3_u2_2,
//   5, // lc3_u2_3,
//   0, // lc4_all,
//   0, // lc4_u1,
//   0 // lc4_u2
// );

//******************************************************************************* */
// 電池總告警數量
// BSC告警數量
function cal_BSC(...args) {
  let totalOnes = 0;

  // 遍歷傳入的所有參數
  for (let i = 0; i < args.length; i++) {
    const binary = args[i].toString(2); // 將參數轉換為二進制

    // 檢查二進制中的位元，只計算出現在 bit0 或 bit1 的 1 的個數
    totalOnes += (binary[0] === "1" ? 1 : 0) + (binary[1] === "1" ? 1 : 0);
  }

  return totalOnes; // 返回計算的結果
}

// 測試示例
// console.log("test1:" + cal_BSC(3, 0, 0)); // 2，因為 10 的二進制是 1010，有兩個 1 在 bit0 或 bit1 上
// console.log("test2:" + cal_BSC(7, 7, 7)); // 9，因為 1 的二進制是 1，有一個 1 在 bit0 上

function cal_HVAC(...args) {
  let totalCount = 0;

  // 遍歷傳入的所有參數
  for (let i = 0; i < args.length; i++) {
    const binary = args[i].toString(2); // 將參數轉換為二進制

    // 檢查二進制中的位元，如果只有 bit2 出現 1，則 totalCount 不加 1，否則加 1
    if (binary[2] === "1") {
      if (binary.slice(0, 2).includes("1")) {
        totalCount++;
      }
    } else {
      // 如果 bit2 是 0 且其他 bit 出現 1，則 totalCount 加 1
      if (binary.slice(0, 2).includes("1")) {
        totalCount++;
      }
    }
  }

  return totalCount; // 返回計算的結果
}

// 測試示例
// console.log("HVAC test1:" + cal_HVAC(1, 2, 1));
// console.log("HVAC test2:" + cal_HVAC(0, 2, 0));
// console.log("HVAC test3:" + cal_HVAC(0, 0, 7));

function cal_Temperature(...args) {
  let countOverTemp = 0;

  // 遍歷傳入的所有參數
  for (let i = 0; i < args.length; i++) {
    // 如果變數介於400到550之間，則計數加 1
    if (args[i] >= 400 && args[i] < 550) {
      countOverTemp++;
    }
  }

  return countOverTemp; // 返回計算的結果
}

// 測試示例
console.log("Temperature test1:" + cal_Temperature(300, 400, 500)); // 1，只有一個變數大於 400
console.log("Temperature test2:" + cal_Temperature(450, 410, 390)); // 2，有兩個變數大於 400
console.log("Temperature test3:" + cal_Temperature(350, 200, 300)); // 0，沒有變數大於 400

function cal_Humidity(...args) {
  let countOverHumidity = 0;
  // 遍歷傳入的所有參數
  for (let i = 0; i < args.length; i++) {
    // 如果變數(濕度)介於650~800，則計數加 1
    if (args[i] >= 650 && args[i] < 800) {
      countOverHumidity++;
    }
  }
  return countOverHumidity; // 返回計算的結果
}
//測試示例
console.log("Humidity test1:" + cal_Humidity(300, 400, 799)); // 1，只有一個變數大於 650
console.log("Humidity test2:" + cal_Humidity(700, 700, 900)); // 0，沒有變數大於 400
console.log("Humidity test3:" + cal_Humidity(700, 800, 900)); // 0，沒有變數大於 400

function cal_UPS_1(...args) {
  let totalups1Ones = 0;
  const binaryArray = [];

  // 遍歷傳入的所有參數
  for (let i = 0; i < args.length; i++) {
    const binary = args[i].toString(2).padStart(32, '0'); // 將參數轉換為固定長度的二進制，並在左邊補零
    //const reversedBinary = binary.split('').reverse(); // 反轉二進制字串並轉換為陣列
    //binaryArray.push(reversedBinary); // 將反轉後的二進制陣列存入 binaryArray 中
    //console.log(binary);

    //bit 7
    if (binary[24] === "1") {
      totalups1Ones ++;
    }
    //bit 4
    if (binary[27] == "1") {
      // 將計算的結果加到總數中
      totalups1Ones ++;
    }
  }

  //console.log(binaryArray); // 輸出反轉後的二進制陣列
  return totalups1Ones; // 返回計算的結果
}

// 測試示例
// console.log("***********************************************");
// console.log("cal_UPS_1 test1:" + cal_UPS_1(16)); // 正確的結果應該是1
// console.log("cal_UPS_1 test2:" + cal_UPS_1(128)); // 正確的結果應該是0
// console.log("cal_UPS_1 test3:" + cal_UPS_1(16, 128)); // 正確的結果應該是2


function cal_UPS_2(...args) {
  let totalups2Ones = 0;

  // 遍歷傳入的所有參數
  for (let i = 0; i < args.length; i++) {
    const binary = args[i].toString(2).padStart(32, '0'); 
    //console.log(binary);
    // 檢查二進制中的位元，只有 bit15 出現 1 且 bit14 不是 1 才計算
    if (binary[16] === "1" && binary[17] !== "1") {
      // 將計算的結果加到總數中
      totalups2Ones ++;
    }
  }

  return totalups2Ones; // 返回計算的結果
}

// 測試示例
// console.log("***********************************************");
// console.log("cal_UPS_2 test1:" + cal_UPS_2(32768, 16384, 8192));

function calculateWarningNum_Bat(
  BSC_result,
  HVAC_result,
  Temperature_result,
  Humidity_result,
  UPS_1_result,
  UPS_2_result
) {
  return (
    BSC_result +
    HVAC_result +
    Temperature_result +
    Humidity_result +
    UPS_1_result +
    UPS_2_result
  );
}

const WarningNum_Env = calculateWarningNum_Bat(
  cal_BSC(0, 0, 0),
  cal_HVAC(0, 0, 0),
  cal_Temperature(0, 0, 0), //0
  cal_Humidity(0, 0, 759), //1
  cal_UPS_1(0, 0, 0), //
  cal_UPS_2(0, 0, 0) //3
);

console.log("環境警告數量：", WarningNum_Env);
//******************************************************************************* */
// 環境總告警數量
function calculateWarningNum_Env() {
  // 定義一個輔助函數來計算二進制中的 1 的數量
  // function countOnes(binary) {
  //   return (binary.toString(2).match(/1/g) || []).length;
  // }

  // 計算所有變數中的 1 的總數
  // let totalOnes = 0;

  // args.forEach((value) => {
  //   totalOnes += countOnes(value);
  // });

  return totalOnes;
}
//******************************************************************************* */
// FF(消防)總告警數量
function calculateWarningNum_FF(...args) {
  // 定義一個輔助函數來計算二進制中的 1 的數量
  function countOnes(binary) {
    return (binary.toString(2).match(/1/g) || []).length;
  }

  // 計算所有變數中的 1 的總數
  let totalOnes = 0;

  args.forEach((value) => {
    totalOnes += countOnes(value);
  });

  return totalOnes;
}

//******************************************************************************* */
// // 呼叫函數並傳遞參數，然後輸出結果
// const totalWarnings = calculateWarningNum_Bat(
//   1, // lc1_bms1,
//   4, // lc1_bms2,
//   11, // lc1_rs1_r1,
//   0, // lc1_rs1_r2,
//   0, // lc1_rs1_r3,
//   0, // lc1_rs1_r4,
//   0, // lc1_rs1_r5,
//   0, // lc1_rs1_r6,
//   0, // lc1_rs1_r7,
//   0, // lc1_rs1_r8,
//   0, // lc1_rs1_r9,
//   0, // lc1_rs1_r10,
//   0, // lc1_rs1_r11,
//   0, // lc1_rs1_r12,
//   0, // lc1_rs2_r1,
//   0, // lc1_rs2_r2,
//   0, // lc1_rs2_r3,
//   0, // lc1_rs2_r4,
//   0, // lc1_rs2_r5,
//   0, // lc1_rs2_r6,
//   0, // lc1_rs2_r7,
//   0, // lc1_rs2_r8,
//   0, // lc1_rs2_r9,
//   0, // lc1_rs2_r10,
//   0, // lc1_rs2_r11,
//   0, // lc1_rs2_r12,
//   0, // lc2_bms1,
//   0, // lc2_bms2,
//   0, // lc2_rs1_r1,
//   0, // lc2_rs1_r2,
//   0, // lc2_rs1_r3,
//   0, // lc2_rs1_r4,
//   0, // lc2_rs1_r5,
//   0, // lc2_rs1_r6,
//   0, // lc2_rs1_r7,
//   0, // lc2_rs1_r8,
//   0, // lc2_rs1_r9,
//   0, // lc2_rs1_r10,
//   0, // lc2_rs1_r11,
//   0, // lc2_rs1_r12,
//   0, // lc2_rs2_r1,
//   0, // lc2_rs2_r2,
//   0, // lc2_rs2_r3,
//   0, // lc2_rs2_r4,
//   0, // lc2_rs2_r5,
//   0, // lc2_rs2_r6,
//   0, // lc2_rs2_r7,
//   0, // lc2_rs2_r8,
//   0, // lc2_rs2_r9,
//   0, // lc2_rs2_r10,
//   0, // lc2_rs2_r11,
//   0, // lc2_rs2_r12,
//   0, // lc3_bms1,
//   0, // lc3_bms2,
//   0, // lc3_rs1_r1,
//   0, // lc3_rs1_r2,
//   0, // lc3_rs1_r3,
//   0, // lc3_rs1_r4,
//   0, // lc3_rs1_r5,
//   0, // lc3_rs1_r6,
//   0, // lc3_rs1_r7,
//   0, // lc3_rs1_r8,
//   0, // lc3_rs1_r9,
//   0, // lc3_rs1_r10,
//   0, // lc3_rs1_r11,
//   0, // lc3_rs1_r12,
//   0, // lc3_rs2_r1,
//   0, // lc3_rs2_r2,
//   0, // lc3_rs2_r3,
//   0, // lc3_rs2_r4,
//   0, // lc3_rs2_r5,
//   0, // lc3_rs2_r6,
//   0, // lc3_rs2_r7,
//   0, // lc3_rs2_r8,
//   0, // lc3_rs2_r9,
//   0, // lc3_rs2_r10,
//   0, // lc3_rs2_r11,
//   0, // lc3_rs2_r12,
//   0, // lc4_bms1,
//   0, // lc4_bms2,
//   0, // lc4_rs1_r1,
//   0, // lc4_rs1_r2,
//   0, // lc4_rs1_r3,
//   0, // lc4_rs1_r4,
//   0, // lc4_rs1_r5,
//   0, // lc4_rs1_r6,
//   0, // lc4_rs1_r7,
//   0, // lc4_rs1_r8,
//   0, // lc4_rs1_r9,
//   0, // lc4_rs1_r10,
//   0, // lc4_rs1_r11,
//   0, // lc4_rs1_r12,
//   0, // lc4_rs2_r1,
//   0, // lc4_rs2_r2,
//   0, // lc4_rs2_r3,
//   0, // lc4_rs2_r4,
//   0, // lc4_rs2_r5,
//   0, // lc4_rs2_r6,
//   0, // lc4_rs2_r7,
//   0, // lc4_rs2_r8,
//   0, // lc4_rs2_r9,
//   0, // lc4_rs2_r10,
//   0, // lc4_rs2_r11,
//   0 // lc4_rs2_r12
// );

// console.log(`Total ones: ${totalWarnings}`);
//******************************************************************************* */
//******************************************************************************* */
//******************************************************************************* */
//******************************************************************************* */
// 錯誤總數量(左邊/紅色)
function calculatetotalAlarmNum() {}
//******************************************************************************* */
// 電表總錯誤數量
function calculateAlarmNum_Meter() {}
//******************************************************************************* */
// PCS總錯誤數量
function calculatetAlarmNum_PCS() {}
//******************************************************************************* */
// 電池總錯誤數量
function calculatetAlarmNum_Bat() {}
//******************************************************************************* */
// 環境總錯誤數量
function calculatetAlarmNum_Env() {}
//******************************************************************************* */
// 消防總錯誤數量
function calculatetAlarmNum_FF() {}
//******************************************************************************* */
//******************************************************************************* */
//******************************************************************************* */
//系統資訊

module.exports = {
  calculateAverage,
  mapchargeStatus,
  scaleProcess,
  mapPCSWorkingStatus,
  mapPCSWorkingMode,
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
  mapL_M_systemMode,
  calculateWarningNum_PCS,
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
