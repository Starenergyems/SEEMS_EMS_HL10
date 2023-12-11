const { timeLog } = require("console");
const readline = require("readline");

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
