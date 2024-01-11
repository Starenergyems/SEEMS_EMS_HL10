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
