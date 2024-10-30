const port = 3005;
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const router = express.Router();
const app = express();
const cors = require("cors");
const moment = require("moment");

const xlsx = require("xlsx-populate");
const fs = require("fs");
const cron = require("node-cron"); //指定幾點做什麼
const axios = require("axios"); //在server執行get

const config = require("./config");
const { Console } = require("console");
const {
  getDailyReportData,
  getMonthlyReportData,
  getYearReportData,
} = require("./getReportData");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

//報表
router.get("/report", (req, res) => {
  // num與fun
  let permission = req.body.permission;
  res.render("Rpt_Report", { permission: permission });
});

router.get("/report/report", (req, res) => {
  // num與fun
  let permission = req.body.permission;
  res.render("Rpt_Report", { permission: permission });
});

var specified_date; // 指定要撈哪天(會撈前一天) / 月(填4月會撈3月) / 年(填2024年會撈2023年)的資料

/*************************************************************************************************** */
router.get("/report/download-excel", async (req, res) => {
  //定期撈資料供下載存至地端or檔案不存在就自己撈資料
  try {
    console.log("手動下載開始");
    await queryReport(req, res);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Internal Server Error");
  }
});

/***************************************************************************************************** */
function flattenArray(arr) {
  return arr.reduce((acc, val) => {
    return Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val);
  }, []);
}
/***************************************************************************************************** */
var click_year, click_month, click_day;
const queryReport = async (req, res) => {
  //撈資料放入對應excel表格for前端手動下載
  const { templatePath, reportType, fileName } = req.query; //url要帶參數，fileName是從畫面上讀取的
  if (!templatePath) {
    return res.status(400).send("Missing templatePath parameter");
  }
  console.log("fileName:" + fileName);
  var queryDate = convertFileNameToDate(fileName);
  console.log("queryDate:" + queryDate);
  specified_date = moment(queryDate, "YYYY-MM-DD HH:mm:ss"); //設定搜尋日期
  //使用xlsx庫從指定的Excel模板路徑讀取工作簿。
  const workbook = await xlsx.fromFileAsync(templatePath);
  var couchData; //插入excel的數值

  if (reportType === "年報") {
    const couchData = await getYearReportData(specified_date);
    const year = specified_date.format("YYYY");
    const yearNumber = parseInt(year, 10); // 這樣轉成數字格式
    const { result = {}, previousYearData = {} } = couchData; // 提供預設值

    // 檢查並使用 result 的 sbspm 和 powerUseSum，並提供空陣列和 0 的預設值
    const resultSbspm = result.sbspm || Array(12).fill(Array(13).fill(0)); // 預設為包含 12 個空的 13 位陣列
    const resultPowerUseSum = result.powerUseSum || Array(13).fill(0); // 預設為包含 13 個 0 的陣列

    // 檢查並使用 previousYearData 的 sbspm 和 powerUseSum
    const previousYearSbspm = previousYearData.sbspm || [Array(13).fill(0)]; // 預設為包含 13 個 0 的一維陣列
    const previousYearPowerUseSum =
      previousYearData.powerUseSum || Array(13).fill(0); // 預設為包含 13 個 0 的陣列
    // updateExcel1DHorizon(workbook, yearNumber, 0, "N3"); // 年份
    // 更新 Excel
    updateExcel2DHorizon(workbook, resultSbspm, 0, "D6"); // 每個月的數值含每月加總(但不含輔助用電)
    updateExcel1DHorizon(workbook, previousYearSbspm[0], 0, "D19"); // 上一年同月份的 sbspm

    // 將輔助用電加總值包裝成陣列後垂直放入
    updateExcel1DVertical(workbook, [resultPowerUseSum[12]], 0, "P6"); // 當前年加總
    updateExcel1DVertical(workbook, [previousYearPowerUseSum[12]], 0, "P19"); // 上一年加總
  } else if (reportType === "月報") {
    // 從 getMonthlyReportData 取得 couchData 的三個物件
    const couchData = await getMonthlyReportData(specified_date);

    // 解構取得 thisMonth, lastMonth, lastYear
    const { thisMonth, lastMonth, lastYear } = couchData;

    // 1. 將 thisMonth 資料以二維、一維、一維的格式放入 Excel
    updateExcel2DHorizon(workbook, thisMonth.sbspm, 1, "D6"); // sbspm - 二維陣列
    updateExcel1DHorizon(
      workbook,
      thisMonth.auxPower.slice(1).map((val) => (val === null ? 0 : val)),
      0,
      "E6"
    );
    // auxPower - 從第二個元素(陣列位置1)開始，一維陣列，null 值轉為 0
    updateExcel1DHorizon(workbook, [thisMonth.powerUseSum_calculate], 0, "D6"); // powerUseSum_calculate - 單一數值

    // 2. 將 lastMonth 的特定數值放入 Excel
    // 提取 lastMonth 中 sbspm 的第 32 筆數據、auxPower 和 powerUseSum_calculate
    const lastMonthSbspm32 = lastMonth.sbspm[31] || [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]; // 若第 32 筆不存在則返回都是0的陣列
    const lastMonthAuxPower = lastMonth.auxPower.map((val) =>
      val === null ? 0 : val
    ); // auxPower，null 值轉為 0
    const lastMonthPowerUseSum = [lastMonth.powerUseSum_calculate]; // powerUseSum_calculate - 單一數值

    // 更新 Excel 以 lastMonth 資料
    updateExcel1DHorizon(workbook, lastMonthSbspm32, 1, "D38"); // sbspm 第 32 筆數據 - 一維陣列
    updateExcel1DHorizon(
      workbook,
      lastMonthAuxPower.slice(1).map((val) => (val === null ? 0 : val)),
      0,
      "E7"
    ); // auxPower - 從第二個元素開始，一維陣列，null 值轉為 0

    updateExcel1DHorizon(workbook, lastMonthPowerUseSum, 0, "D7"); // powerUseSum_calculate - 單一數值

    // 3. lastYear 的特定數值放入 Excel
    // 提取 lastYear 中 sbspm 的第 32 筆數據、auxPower 和 powerUseSum_calculate
    const lastYearSbspm32 = lastYear.sbspm[31] || [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]; // 若第 32 筆不存在則返回空陣列
    const lastYearAuxPower = lastYear.auxPower.map((val) =>
      val === null ? 0 : val
    ); // auxPower，null 值轉為 0
    const lastYearPowerUseSum = [lastYear.powerUseSum_calculate]; // powerUseSum_calculate - 單一數值

    // 更新 Excel 以 lastYear 資料
    updateExcel1DHorizon(workbook, lastYearSbspm32, 1, "D39"); // sbspm 第 32 筆數據 - 一維陣列
    updateExcel1DHorizon(
      workbook,
      lastYearAuxPower.slice(1).map((val) => (val === null ? 0 : val)),
      0,
      "E8"
    ); // auxPower - 從第二個元素開始，一維陣列，null 值轉為 0

    updateExcel1DHorizon(workbook, lastYearPowerUseSum, 0, "D8"); // powerUseSum_calculate - 單一數值
  } else if (reportType === "日報") {
    couchData = await getDailyReportData(specified_date);

    updateExcel2DHorizon(workbook, couchData.hour_final, 0, "D6"); //服務品質+SBSPM
    updateExcel1DVertical(workbook, couchData.elsedata1, 0, "F33"); //總用電量
    updateExcel1DVertical(workbook, couchData.elsedata2, 0, "J33"); //中止服務
    updateExcel2DHorizon(workbook, couchData.Date, 0, "H3"); //日期
  } else {
    console.log("前端回傳之報表種類異常: 應為年報/月報/日報");
  }

  //************後端將excel存於本機指定位置/////////////////////////////////////////////////////////
  divideFileName(fileName); //將獨到的日期拆分為y, m, d
  if (reportType === "年報") {
    directoryPath = path.join("C", "report", `${click_year}`); //下載後存在哪，要跟getReport api同步
  } else if (reportType === "月報") {
    directoryPath = path.join("C", "report", `${click_year}`); //下載後存在哪，要跟getReport api同步
  } else if (reportType === "日報") {
    directoryPath = path.join("C", "report", `${click_year}`, `${click_month}`); //下載後存在哪，要跟getReport api同步
  } else {
    console.log("參數設置錯誤，報表種類應為年報/月報/日報");
  }

  filePath = path.join(directoryPath, fileName); //檔名叫什麼
  // Check if the directory exists, create it if not
  console.log("Resolved absolute path:", path.resolve(directoryPath));
  if (!fs.existsSync(directoryPath)) {
    try {
      console.log("doesn't exist");
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log("Directory created successfully:", directoryPath);
    } catch (error) {
      console.error("Error creating directory:", error.message);
    }
  }

  await workbook.toFileAsync(filePath);
  console.log("報表儲存於", filePath);
  //回覆給前端/////////////////////////////////////////////////////////
  // Set up response headers for Excel file download
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment;");
  // Read the temporary file as a stream and pipe it to the response
  //設置HTTP響應標頭，指定返回的內容類型為Excel文件，並設置Content-Disposition標頭，提示瀏覽器以附件形式處理。
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
};

const queryReport_auto = async (template) => {
  if (!template) {
    return res.status(400).send("Missing templatePath parameter");
  }
  let directoryPath, filePath, reportType;

  if (template === "YearReport") {
    reportType = "年報";
  } else if (template === "MonthReport") {
    reportType = "月報";
  } else if (template === "DayReport") {
    reportType = "日報";
  } else {
    console.error("報表模板檔名異常,應為YearReport, MonthReport, DayReport");
  }
  let today = formatedDate(new Date()); //今天幾號
  let queryDate = removeDatePart(template, today); //
  //console.log("today", today);

  yesterday(); //昨天幾年幾月幾日
  console.log("queryDate:" + queryDate);
  specified_date = moment(queryDate, "YYYY-MM-DD HH:mm:ss"); //設定搜尋日期
  var tempFilePath; //暫存的excel資料

  //使用xlsx庫從指定的Excel模板路徑讀取工作簿。
  let templatePath = "../public/report/" + template + ".xlsx";
  const workbook = await xlsx.fromFileAsync(templatePath);
  var couchData; //插入excel的數值
  // Fetch data from MongoDB
  if (reportType === "年報") {
    couchData = await getYearReportData(specified_date);
    updateExcel1DHorizon(workbook, couchData.result.sbspm, 0, "D6"); //每個月的數值含每月加總(但不含輔助用電)
    updateExcel1DHorizon(workbook, couchData.previousYearData.sbspm, 0, "D19");
    //-輔助用電 垂直放入就好
    updateExcel1DVertical(workbook, couchData.result.powerUseSum[12], 0, "P6"); //加總
    updateExcel1DVertical(
      workbook,
      couchData.previousYearData.powerUseSum[12],
      0,
      "P19"
    );
  } else if (reportType === "月報") {
    couchData = await getMonthlyReportData(specified_date);
    updateExcel2DHorizon(workbook, couchData.date, 0, "H3"); //日期
    updateExcel2DHorizon(workbook, couchData.date, 1, "K3"); //日期

    updateExcel2DHorizon(workbook, couchData.thisMonth.sbspm, 1, "D6"); //服務品質指標+SPM
    updateExcel1DHorizon(workbook, couchData.lastMonth.sbspm, 1, "D38"); //上期
    updateExcel1DHorizon(workbook, couchData.lastYear.sbspm, 1, "D39"); //去年同期

    updateExcel1DHorizon(
      workbook,
      couchData.thisMonth.powerUseSum_calculate,
      0,
      "D6"
    );
    updateExcel1DHorizon(workbook, couchData.thisMonth.auxPower[1], 0, "D6");
    updateExcel1DHorizon(
      workbook,
      couchData.lastMonth.powerUseSum_calculate,
      0,
      "D7"
    );
    updateExcel1DHorizon(workbook, couchData.lastMonth.auxPower[1], 0, "D7");
    updateExcel1DHorizon(
      workbook,
      couchData.lastYear.powerUseSum_calculate,
      0,
      "D8"
    );
    updateExcel1DHorizon(workbook, couchData.lastYear.auxPower[1], 0, "D8");

    // tempFilePath = path.join(__dirname, "temp.xlsx");
    // await workbook.toFileAsync(tempFilePath);
  } else if (reportType === "日報") {
    couchData = await getDailyReportData(specified_date);

    // Update the Excel file with MongoDB data，使用取得的MongoDB資料更新Excel工作簿。
    updateExcel2DHorizon(workbook, couchData.hour_final, 0, "D6"); //服務品質+SBSPM
    updateExcel1DVertical(workbook, couchData.elsedata1, 0, "F33"); //總用電量
    updateExcel1DVertical(workbook, couchData.elsedata2, 0, "J33"); //中止服務
    updateExcel2DHorizon(workbook, couchData.Date, 0, "H3"); //日期
    // tempFilePath = path.join(__dirname, "temp.xlsx");
    // await workbook.toFileAsync(tempFilePath);
  } else {
    console.log("前端回傳之報表種類異常: 應為年報/月報/日報");
  }

  if (template === "YearReport") {
    directoryPath = path.join("C", "report", `${yesterdayY}`); //下載後存在哪，要跟getReport api同步
    filePath = path.join(directoryPath, yesterdayY + "y.xlsx"); //檔名叫什麼
  } else if (template === "MonthReport") {
    directoryPath = path.join("C", "report", `${yesterdayY}`); //下載後存在哪，要跟getReport api同步

    filePath = path.join(
      directoryPath,
      `${yesterdayY}` + "y" + `${yesterdayM}` + "m.xlsx"
    ); //檔名叫什麼
  } else if (template === "DayReport") {
    directoryPath = path.join(
      //在linux中測試
      "C",
      "report",
      `${yesterdayY}`,
      `${yesterdayM}` //這個有成功存在"router" "/C/report/2024/3"
    );

    filePath = path.join(
      directoryPath,
      `${yesterdayY}` + "y" + `${yesterdayM}` + "m" + `${yesterdayD}` + "d.xlsx"
    ); //檔名叫什麼
  } else {
    console.log("參數設置錯誤");
  }

  // Check if the directory exists, create it if not
  console.log("Resolved absolute path:", path.resolve(directoryPath));
  if (!fs.existsSync(directoryPath)) {
    try {
      console.log("doesn't exist");
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log("Directory created successfully:", directoryPath);
    } catch (error) {
      console.error("Error creating directory:", error.message);
    }
  }

  await workbook.toFileAsync(filePath);
  console.log("報表儲存於", filePath);
};
// Function to transform the data

function convertFileNameToDate(inputFileName) {
  // 匹配檔名格式的正則表達式
  const regex = /(\d{4})y(?:(\d{1,2})m?(?:(\d{1,2})d)?)?\.xlsx/;
  const match = inputFileName.match(regex);

  if (!match) {
    throw new Error("Invalid filename format");
  }

  // 從檔名中提取年、月、日部分
  const year = match[1];
  const month = match[2] || "01";
  const day = match[3] || "01";

  // 將提取的日期組裝成日期字串，並保留為輸入的值，不進行任何調整
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} 00:00:00`;

  return formattedDate;
}

function divideFileName(inputFileName) {
  //將畫面上的名稱轉成分開的y,m,d, 用於設定手動下載的存檔路徑
  // Extract the date parts from the filename using a regular expression
  const regex = /(\d{4})y(?:(\d{1,2})m?(?:(\d{1,2})d)?)?\.xlsx/;
  const match = inputFileName.match(regex);
  if (!match) {
    throw new Error("Invalid filename format");
  }
  // Extracted date parts
  click_year = match[1];
  click_month = match[2];
  click_day = match[3];
  return click_year, click_month, click_day;
}

// Update Excel file with MongoDB data
function updateExcel2DHorizon(workbook, queryData, sheetNum, excelStart) {
  //(範本位置，插入資料，第幾個分頁，插入位址)
  const sheet = workbook.sheet(sheetNum); //第幾個分頁(第一頁是0)
  //console.log("insert:", queryData);
  if (queryData == undefined) {
    couchData = [];
  } else {
    couchData = queryData;
  }
  //console.log("couchDatalength:", couchData.length);
  const startCell = excelStart; //塞在excel哪裡

  if (couchData.includes("-")) {
    //判斷是否為日期(2024-01-01)
    // Convert the column index to the corresponding letter (D, E, F, ...)
    const colLetter = String.fromCharCode(charToAscii(startCell.charAt(0)));
    // Calculate the target cell based on the starting cell and indices
    const targetCell = colLetter + parseInt(startCell.slice(1));
    // Write the value to the target cell
    sheet.cell(targetCell).value(couchData);
  } else {
    couchData.forEach((data, rowIndex) => {
      //console.log("data length:", data.length);
      if (data.length > 1) {
        //判斷是否為二維陣列
        data.forEach((cellValue, colIndex) => {
          // Convert the column index to the corresponding letter (D, E, F, ...)
          const colLetter = String.fromCharCode(
            charToAscii(startCell.charAt(0)) + colIndex
          );
          // Calculate the target cell based on the starting cell and indices
          const targetCell =
            colLetter + (parseInt(startCell.slice(1)) + rowIndex);
          //console.log("targetCell:" + targetCell);
          // Write the value to the target cell
          sheet.cell(targetCell).value(cellValue);
        });
      } else {
        //一維陣列垂直新增
        // Convert the column index to the corresponding letter (D, E, F, ...)
        const colLetter = String.fromCharCode(charToAscii(startCell.charAt(0)));
        // Calculate the target cell based on the starting cell and indices
        const targetCell =
          colLetter + (parseInt(startCell.slice(1)) + rowIndex);
        //console.log("targetCell:" + targetCell);
        // Write the value to the target cell
        sheet.cell(targetCell).value(data);
      }
    });
  }
}

//一維陣列垂直新增於表格
function updateExcel1DVertical(workbook, queryData, sheetNum, excelStart) {
  //(範本位置，插入資料，第幾個分頁，插入位址)
  const sheet = workbook.sheet(sheetNum); //第幾個分頁(第一頁是0)
  //console.log("insert:", queryData);
  if (queryData == undefined) {
    couchData = [];
  } else {
    couchData = queryData;
  }
  //console.log("couchDatalength:", couchData.length);
  const startCell = excelStart; //塞在excel哪裡

  couchData.forEach((data, rowIndex) => {
    // Convert the column index to the corresponding letter (D, E, F, ...)
    const colLetter = String.fromCharCode(charToAscii(startCell.charAt(0)));
    // Calculate the target cell based on the starting cell and indices
    const targetCell = colLetter + (parseInt(startCell.slice(1)) + rowIndex);
    //console.log("targetCell:" + targetCell);
    // Write the value to the target cell
    sheet.cell(targetCell).value(data);
  });
}

// 一維矩陣更新excel，橫放
function updateExcel1DHorizon(workbook, queryData, sheetNum, excelStart) {
  const sheet = workbook.sheet(sheetNum);
  const startCell = excelStart;

  // 初始化 couchData 為 queryData 或空數組
  const couchData = queryData || [];

  if (couchData.includes("-")) {
    // 日期格式 (例如 "2024-01-01") 的處理
    const targetCell = startCell;
    sheet.cell(targetCell).value(couchData);
  } else {
    couchData.forEach((data, rowIndex) => {
      // 當前行的目標單元格
      const colLetter = String.fromCharCode(startCell.charCodeAt(0) + rowIndex);
      const targetCell = colLetter + parseInt(startCell.slice(1));

      // 寫入數據，確保 data 定義且不為 null
      if (data !== undefined && data !== null) {
        sheet.cell(targetCell).value(data);
      } else {
        console.warn(`Skipping undefined or null value at row ${rowIndex}`);
      }
    });
  }
}

function charToAscii(char) {
  //字母轉成ASCII code
  if (char.length === 1) {
    return char.charCodeAt(0);
  } else {
    console.error("Input must be a single character.");
    return null;
  }
}

/***************************************************************************** */
router.get("/report/getFile", (req, res) => {
  //點擊尋找已存好的檔案
  //const folderPath = path.join('C', 'EMS', 'Report'); //要去哪找檔案
  const fileName = req.query.fileName; //要找哪個檔案
  const folderPath = req.query.folderPath; //要去哪找檔案

  if (!fileName || !folderPath) {
    return res.status(400).send("Missing parameter");
  }

  const filePath = path.join(folderPath, fileName);
  //console.log("目標位置:" + filePath);
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    console.log("後端開始尋找檔案");
    if (err) {
      res.status(404).json({
        status: "error",
        message: `${fileName} does not exist in ${folderPath}`,
      });
    } else {
      // If the file exists, read and send its content
      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.status(500).json({
            status: "error",
            message: `Error reading ${fileName}: ${readErr}`,
          });
        } else {
          res.send(data);
        }
      });
    }
  });
});

function yesterday() {
  //用來控制自動下載的檔名，應為昨天的日期or上個月or去年
  // Get the current date and time
  let currentDate = new Date();

  // Calculate yesterday's date
  let yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(currentDate.getDate() - 1);

  // Separate year, month, and day
  yesterdayY = yesterdayDate.getFullYear();
  yesterdayM = yesterdayDate.getMonth() + 1; // Months are zero-based in JavaScript
  yesterdayD = yesterdayDate.getDate();

  // Log the result
  console.log(
    `Yesterday's date was: ${yesterdayY}-${yesterdayM}-${yesterdayD}`
  );
}

function formatedDate(date) {
  //Date格式轉換成2023年1月1日.xlsx
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is zero-based
  const day = date.getDate();
  return `${year}年${month}月${day}日.xlsx`;
}
function removeDatePart(template, formattedDate) {
  //後續會使用是否有"月""日"來判斷要如何搜尋資料，沒有"日"就是月報，沒有"日月"就是年報
  // Regular expression to match both date formats
  const regex = /^(\d{4})年(\d{1,2})月(\d{1,2})日.xlsx$/;

  // Extract year and month parts based on the matched format
  const match = formattedDate.match(regex);
  let year, month;
  if (match) {
    year = match[1];
    month = match[2];
    day = match[3];
    if (template === "YearReport") {
      return year + "年.xlsx";
    } else if (template === "MonthReport") {
      return year + "年" + month + "月.xlsx";
    } else {
      return year + "年" + month + "月" + day + "日.xlsx";
    }
  }

  // Default filename if the format doesn't match
  console.error("輸入格式異常, 應為ex:2023年1月1日.xlsx");
  return "output.xlsx";
}
var yesterdayY, yesterdayM, yesterdayD;

cron.schedule("0 2 1 1 *", async () => {
  // 秒 分 時 日 月 星期幾 由右到左對照，每年1月1日2:00執行產出前一年年報
  try {
    console.log("Cron job: year report download start");
    await queryReport_auto("YearReport");
    console.log("Cron job: done");
  } catch (error) {
    console.error("Cron job: Error generating Excel file:", error);
  }
});

cron.schedule("30 1 1 * *", async () => {
  // 秒 分 時 日 月 星期幾 由右到左對照，每月1日1:30執行產出前一月月報
  try {
    console.log("Cron job: month report download start");
    await queryReport_auto("MonthReport");
    console.log("Cron job: done");
  } catch (error) {
    console.error("Cron job: Error generating Excel file:", error);
  }
});

cron.schedule("0 1 * * *", async () => {
  // 秒 分 時 日 月 星期幾 由右到左對照，每日1:00執行產出前一天日報
  try {
    console.log("Cron job: day report download start");
    await queryReport_auto("DayReport");
    console.log("Cron job: done");
  } catch (error) {
    console.error("Cron job: Error generating Excel file:", error);
  }
});

module.exports = router;
