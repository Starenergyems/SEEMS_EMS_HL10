const { timeLog } = require("console");
const readline = require("readline");

//-------------------------------------------------------------------------------------------------
//文字轉換

function mapNumberToStatus(number) {
  if (number >= 2) {
    switch (number) {
      case 0:
        return "充電";
      case 1:
        return "放電";
      case 2:
        return "停止";
      default:
        return "N/A";
    }
  } else {
    return "N/A";
  }
}

module.exports = { mapNumberToStatus };

//引用方法
// const express = require('express');
// const router = express.Router();

// // 引用你的 translateStatus 函數
// const { translateStatus } = require('./path-to-your-translateStatus-file');

// // 假設你有一個路由處理程序
// router.get('/your/route', (req, res) => {
//   // 假設你從數據庫中讀取到了一個數字狀態
//   const statusFromDatabase = 1;

//   // 使用 translateStatus 將數字狀態轉換為文字描述
//   const translatedStatus = translateStatus(statusFromDatabase);

//   // 將結果傳遞給 EJS 模板
//   res.render('your_template', { translatedStatus });
// });

// module.exports = router;

//計算
// fun.js

const sumNumbers = (num1, num2) => {
  // 在這裡執行你的判斷和計算邏輯
  let sum = num1 + num2;

  // 四捨五入到小數點第二位
  sum = Math.round(sum * 100) / 100;
  return sum.toFixed(2);
};

// 將 sumNumbers 函式導出，以便其他檔案可以使用
module.exports = {
  sumNumbers,
};
//引用方法
// app.js

const express = require("express");
const app = express();
const fun = require("./fun"); // 引入 fun.js

// 使用 sumNumbers 函式
app.get("/calculate", (req, res) => {
  // 假設你有數字 num1 和 num2
  const num1 = 10;
  const num2 = 20;

  // 使用 sumNumbers 函式進行計算
  const result = fun.sumNumbers(num1, num2);

  // 將結果返回或者使用它進一步的處理
  res.send(`Result: ${result}`);
});

// 十進制轉二進制
const decToBin32 = (decimal) => {
  if (isNaN(decimal)) {
    throw new Error("Invalid input. Please provide a valid decimal number.");
  }
  return ("00000000000000000000000000000000" + decimal.toString(2)).slice(-32);
};
//-------------------------------------------------------------------------------------------------
//計算有幾個警告
const decToBincount = (decimal) => {
  if (isNaN(decimal)) {
    throw new Error("Invalid input. Please provide a valid decimal number.");
  }
  const binaryString = (
    "00000000000000000000000000000000" + decimal.toString(2)
  ).slice(-32);
  const countOnes = binaryString.split("1").length - 1;
  return { binaryString, countOnes };
};
//-------------------------------------------------------------------------------------------------
const decimalToBinaryArray = (decimal) => {
  // 檢查是否為有效的十進制數字
  if (isNaN(decimal)) {
    throw new Error("Invalid input. Please provide a valid decimal number.");
  }

  // 將十進制轉換為二進制字符串
  const binaryString = decimal.toString(2);

  // 確保二進制字符串的長度為32字元，不足的部分補0
  const paddedBinaryString =
    "00000000000000000000000000000000".slice(-32) + binaryString;

  // 將二進制字符串轉換為數字陣列，按照bit0開始的順序
  const binaryArray = Array.from(paddedBinaryString).map(Number);
  //binaryArray 反過來存放 這樣個別對應的位元才會是他的位置
  const reversedBinaryArray = Array.from(paddedBinaryString)
    .map(Number)
    .reverse();

  return reversedBinaryArray;
};

// // 使用範例
// const decimalValue = 32;

// try {
//   const binaryResult = decimalToBinaryArray(decimalValue);
//   console.log("Binary Result:", binaryResult);
//   console.log("Binary Result:", binaryResult.join(" "));
//   console.log("Binary [i]:", binaryResult[i]);
// } catch (error) {
//   console.error("Error:", error.message);
// };
//-------------------------------------------------------------------------------------------------
//時間計算

//-------------------------------------------------------------------------------------------------
//測試用
module.exports = {
  decToBin32,
  decimalToBinaryArray,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter a decimal value: ", (decimalValue) => {
  try {
    const binaryResult = decimalToBinaryArray(parseInt(decimalValue));
    console.log("Binary Result:", binaryResult);

    rl.question("Enter the index to retrieve (0-31): ", (bitIndex) => {
      const index = parseInt(bitIndex);
      if (isNaN(index) || index < 0 || index >= binaryResult.length) {
        console.error("Invalid index. Please provide a valid index.");
      } else {
        console.log(`Binary [${index}]: ${binaryResult[index]}`);
      }

      rl.close();
    });
  } catch (error) {
    console.error("Error:", error.message);
    rl.close();
  }
});
