const { timeLog } = require("console");
const readline = require("readline");

let input;
let content;
// function Dataconversion(n) {
//   // 檢查輸入是否合法
//   if (typeof scale !== "number" || typeof point !== "number") {
//     throw new Error("All parameters must be numbers");
//   }

//   // 將 decimalValue 乘上 scale
//   let result = decimalValue * scale;

//   // 限制小數點位數
//   result = result.toFixed(point);
//   return result;
// }
//時間格式轉換

//判斷地點
function dataForLocation(input) {
  if (input > 0) {
    return "高壓盤";
  } else if (input > 10 && input < 100) {
    return "低壓盤";
  } else if (input > 10 && input < 100) {
    return "戶外";
  } else if (input > 10 && input < 100) {
    return "電池櫃 ";
  }
}
//判斷設備
function dataForDevice(input) {
  if (input > 0) {
    return "冷氣";
  } else if (input > 10 && input < 100) {
    return "變壓器";
  } else if (input > 10 && input < 100) {
    return "保護電驛";
  } else if (input > 10 && input < 100) {
    return "BMS";
  }
}
//判斷程度
function dataForLevel(input) {
  if (input > 0 && input < 10) {
    return "告警";
  } else {
    return "錯誤";
  }
}
//判斷內容
function dataForcontent(input) {
  if (input > 0 && input < 10) {
    return "A";
  } else if (input > 10 && input < 100) {
    return "B";
  }
}
//判斷已讀復歸
//顯示復歸時間
