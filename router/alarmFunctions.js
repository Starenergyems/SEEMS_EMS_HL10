const { timeLog } = require("console");
const readline = require("readline");

function Dataconversion(n) {
  // 檢查輸入是否合法
  if (typeof scale !== "number" || typeof point !== "number") {
    throw new Error("All parameters must be numbers");
  }

  // 將 decimalValue 乘上 scale
  let result = decimalValue * scale;

  // 限制小數點位數
  result = result.toFixed(point);
  return result;
}
