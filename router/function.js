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
  } else if ((decimalValue === 0)) {
    return "Charging";
  } else if ((decimalValue === 1)) {
    return "Discharging";
  } else if ((decimalValue === 2)) {
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
const decimalValue = 0; // 試試不同的數值
const result = mapgridStatus(decimalValue);
console.log(result);

module.exports = {
  mapchargeStatus,
  scaleProcess,
  mapPCSWorkingStatus,
  mapPCSWorkingMode,
  mapgridStatus,
  // 其他導出的函數
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
