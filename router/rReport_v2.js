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
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const { getDailyReportData } = require("./getReportData");
const gc_rf10 = "gc_rf10";
const gcDb = nano.use(gc_rf10);
const other_rf01 = "other_rf01";
const other01Db = nano.use(other_rf01);
const other_rf10 = "other_rf10";
const other10Db = nano.use(other_rf10);
const report = "report";
const reportDb = nano.use(report);
const monthly_report = "monthly_report";
const monthly_reportDb = nano.use(monthly_report);
const year_report = "year_report";
const Year_reportDb = nano.use(year_report);

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
var click_year, click_month, click_day;
// * 手動下載
const queryReport = async (req, res) => {
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
    couchData = await getYearData();
    const transformedDataforyear = transformData(couchData.dataforyear); //整理資料為陣列
    const transformedTot = transformOtherSumTotal(
      couchData.otherSumTotal,
      couchData.totMWHTotal
    );
    const transformedDataLast = transformDataLastDataYear(
      couchData.datayear_before_last
    );
    const months = [
      "D6",
      "K6",
      "D7",
      "K7",
      "D8",
      "K8",
      "D9",
      "K9",
      "D10",
      "K10",
      "D11",
      "K11",
      "D12",
      "K12",
      "D13",
      "K13",
      "D14",
      "K14",
      "D15",
      "K15",
      "D16",
      "K16",
      "D17",
      "K17",
    ];

    for (let i = 0; i < 12; i++) {
      updateExcel1DHorizon(
        workbook,
        transformedDataforyear[i][1],
        0,
        months[i * 2]
      );
      updateExcel1DHorizon(
        workbook,
        transformedDataforyear[i][2],
        0,
        months[i * 2 + 1]
      );
    }

    updateExcel1DHorizon(workbook, couchData.sumArrayTotal, 0, "D18"); //總共
    updateExcel1DHorizon(workbook, transformedTot, 0, "K18");
    updateExcel1DHorizon(workbook, transformedDataLast[0], 0, "D19"); //去年同期
    updateExcel1DHorizon(workbook, transformedDataLast[1], 0, "K19");

    // await workbook.toFileAsync(tempFilePath);
  } else if (reportType === "月報") {
    couchData = await getMonthData();
    updateExcel2DHorizon(workbook, couchData.lastMonthYearMonth, 0, "H3"); //日期
    updateExcel2DHorizon(workbook, couchData.lastMonthYearMonth, 1, "K3"); //日期
    updateExcel2DHorizon(workbook, couchData.data_exacutive_rate, 1, "D6"); //服務品質指標+SPM
    updateExcel2DHorizon(workbook, couchData.data_other_info, 1, "N6"); //總用電+中止+充放電效率
    updateExcel1DHorizon(workbook, couchData.other_sum, 1, "N37"); //total總用電+中止+充放電效率
    updateExcel1DHorizon(workbook, couchData.sumArray, 1, "D37"); //total服務品質指標
    updateExcel1DHorizon(workbook, couchData.averageArray, 1, "K37"); //total SPM
    updateExcel1DHorizon(workbook, couchData.last_month, 1, "D38"); //上期
    updateExcel1DHorizon(workbook, couchData.last_year, 1, "D39"); //去年同期

    updateExcel1DHorizon(workbook, couchData.power, 0, "D6");
    updateExcel1DHorizon(workbook, couchData.last_month_power, 0, "D7");
    updateExcel1DHorizon(workbook, couchData.last_year_power, 0, "D8");
    // await workbook.toFileAsync(tempFilePath);
  } else if (reportType === "日報") {
    couchData = await getDailyReportData(specified_date);
    updateExcel2DHorizon(workbook, couchData.hour_final, 0, "D6"); //服務品質+SBSPM
    updateExcel1DVertical(workbook, couchData.elsedata1, 0, "F33"); //總用電量
    updateExcel1DVertical(workbook, couchData.elsedata2, 0, "J33"); //中止服務
    updateExcel2DHorizon(workbook, couchData.Date, 0, "H3"); //日期
  } else {
    console.log("前端回傳之報表種類異常: 應為年報/月報/日報");
  }
  
  // - 後端將excel存於本機指定位置
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


// * 自動下載
const queryReport_auto = async (template) => {
  //撈資料放入對應excel表格for後端自動下載呼叫
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
  //console.log("queryDate:" + queryDate);
  specified_date = moment(queryDate, "YYYY-MM-DD HH:mm:ss"); //設定搜尋日期
  var tempFilePath; //暫存的excel資料
  //使用xlsx庫從指定的Excel模板路徑讀取工作簿。
  let templatePath = "../public/report/" + template + ".xlsx";
  const workbook = await xlsx.fromFileAsync(templatePath);
  var couchData; //插入excel的數值
  // Fetch data from MongoDB
  if (reportType === "年報") {
    couchData = await getYearData();
    const transformedDataforyear = transformData(couchData.dataforyear); //整理資料為陣列
    const transformedTot = transformOtherSumTotal(
      couchData.otherSumTotal,
      couchData.totMWHTotal
    );
    const transformedDataLast = transformDataLastDataYear(
      couchData.datayear_before_last
    );
    updateExcel1DHorizon(workbook, transformedDataforyear[0][1], 0, "D6"); //1月
    updateExcel1DHorizon(workbook, transformedDataforyear[0][2], 0, "K6");
    updateExcel1DHorizon(workbook, transformedDataforyear[1][1], 0, "D7"); //2月
    updateExcel1DHorizon(workbook, transformedDataforyear[1][2], 0, "K7");
    updateExcel1DHorizon(workbook, transformedDataforyear[2][1], 0, "D8"); //3月
    updateExcel1DHorizon(workbook, transformedDataforyear[2][2], 0, "K8");
    updateExcel1DHorizon(workbook, transformedDataforyear[3][1], 0, "D9"); //4月
    updateExcel1DHorizon(workbook, transformedDataforyear[3][2], 0, "K9");
    updateExcel1DHorizon(workbook, transformedDataforyear[4][1], 0, "D10"); //5月
    updateExcel1DHorizon(workbook, transformedDataforyear[4][2], 0, "K10");
    updateExcel1DHorizon(workbook, transformedDataforyear[5][1], 0, "D11"); //6月
    updateExcel1DHorizon(workbook, transformedDataforyear[5][2], 0, "K11");
    updateExcel1DHorizon(workbook, transformedDataforyear[6][1], 0, "D12"); //7月
    updateExcel1DHorizon(workbook, transformedDataforyear[6][2], 0, "K12");
    updateExcel1DHorizon(workbook, transformedDataforyear[7][1], 0, "D13"); //8月
    updateExcel1DHorizon(workbook, transformedDataforyear[7][2], 0, "K13");
    updateExcel1DHorizon(workbook, transformedDataforyear[8][1], 0, "D14"); //9月
    updateExcel1DHorizon(workbook, transformedDataforyear[8][2], 0, "K14");
    updateExcel1DHorizon(workbook, transformedDataforyear[9][1], 0, "D15"); //10月
    updateExcel1DHorizon(workbook, transformedDataforyear[9][2], 0, "K15");
    updateExcel1DHorizon(workbook, transformedDataforyear[10][1], 0, "D16"); //11月
    updateExcel1DHorizon(workbook, transformedDataforyear[10][2], 0, "K16");
    updateExcel1DHorizon(workbook, transformedDataforyear[11][1], 0, "D17"); //12月
    updateExcel1DHorizon(workbook, transformedDataforyear[11][2], 0, "K17");

    updateExcel1DHorizon(workbook, couchData.sumArrayTotal, 0, "D18"); //總共
    updateExcel1DHorizon(workbook, transformedTot, 0, "K18");
    updateExcel1DHorizon(workbook, transformedDataLast[0], 0, "D19"); //去年同期
    updateExcel1DHorizon(workbook, transformedDataLast[1], 0, "K19");
    // tempFilePath = path.join(__dirname, "temp.xlsx");
    // await workbook.toFileAsync(tempFilePath);
  } else if (reportType === "月報") {
    couchData = await getMonthData();
    updateExcel2DHorizon(workbook, couchData.lastMonthYearMonth, 0, "H3"); //日期
    updateExcel2DHorizon(workbook, couchData.lastMonthYearMonth, 1, "K3"); //日期
    updateExcel2DHorizon(workbook, couchData.data_exacutive_rate, 1, "D6"); //服務品質指標+SPM
    updateExcel2DHorizon(workbook, couchData.data_other_info, 1, "N6"); //總用電+中止+充放電效率
    updateExcel1DHorizon(workbook, couchData.other_sum, 1, "N37"); //total總用電+中止+充放電效率
    updateExcel1DHorizon(workbook, couchData.sumArray, 1, "D37"); //total服務品質指標
    updateExcel1DHorizon(workbook, couchData.averageArray, 1, "K37"); //total SPM
    updateExcel1DHorizon(workbook, couchData.last_month, 1, "D38"); //上期
    updateExcel1DHorizon(workbook, couchData.last_year, 1, "D39"); //去年同期

    updateExcel1DHorizon(workbook, couchData.power, 0, "D6");
    updateExcel1DHorizon(workbook, couchData.last_month_power, 0, "D7");
    updateExcel1DHorizon(workbook, couchData.last_year_power, 0, "D8");

    // tempFilePath = path.join(__dirname, "temp.xlsx");
    // await workbook.toFileAsync(tempFilePath);
  } else if (reportType === "日報") {
    //couchData = await getDayData();
    couchData = await getReportData(specified_date);

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
      `${yesterdayM}`
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
function transformData(data) {
  //年報用，每月值整理成陣列
  const transformedData = [];

  for (let i = 0; i < data.length; i += 8) {
    const monthData = [
      [data[i]], // Month string
      data[i + 1], // Numerical data
      [
        data[i + 2],
        data[i + 3],
        data[i + 4],
        data[i + 5],
        data[i + 6],
        data[i + 7],
      ], // Financial data
    ];
    transformedData.push(monthData);
  }
  return transformedData;
}

function transformDataLastDataYear(data, data1) {
  //年報用，上期資料整理成陣列
  const transformedData = [
    data[0],
    [data[1], data[2], data[3], data[4], data[5], data[6], data1], // Financial data
  ];
  return transformedData;
}

function transformOtherSumTotal(data) {
  //整理順序格式為陣列
  const transformedData = [data[3], data[0], data[1], data[2], data[5]];
  return transformedData;
}

function convertFileNameToDate(inputFileName) {
  //將畫面上的名稱轉成搜尋日期(會搜尋昨天/上個月/去年，所以要+1天)
  // Extract the date parts from the filename using a regular expression
  const regex = /(\d{4})y(?:(\d{1,2})m?(?:(\d{1,2})d)?)?\.xlsx/;
  const match = inputFileName.match(regex);
  if (!match) {
    throw new Error("Invalid filename format");
  }
  // Extracted date parts
  const year = match[1];
  const month = match[2] || "01";
  const day = match[3] || "01"; // Default to '01' if day is not present

  // Create a Date object using the extracted parts
  const parsedDate = new Date(`${year}-${month}-${day}`);

  if (match[3]) {
    //如果有日期就是日報，日期+1
    //console.log("日+1");
    parsedDate.setDate(parsedDate.getDate() + 1);
  } else if (match[2]) {
    //如果無日期有月份。就是月報，月份+1
    //console.log("月+1");
    parsedDate.setMonth(parsedDate.getMonth() + 1);
    parsedDate.setDate(1);
  } else {
    //如果是年報，年份+1
    //console.log("年+1");
    parsedDate.setFullYear(parsedDate.getFullYear() + 1);
  }

  // Adjust day, month, and year values for the formatted date
  const formattedYear = parsedDate.getFullYear();
  const formattedMonth = (parsedDate.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const formattedDay = parsedDate.getDate().toString().padStart(2, "0");

  // Format the date as "yyyy-MM-dd 00:00:00"
  const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay} 00:00:00`;
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
    mongoData = [];
  } else {
    mongoData = queryData;
  }
  //console.log("mongoData length:", mongoData.length);
  const startCell = excelStart; //塞在excel哪裡

  if (mongoData.includes("-")) {
    //判斷是否為日期(2024-01-01)
    // Convert the column index to the corresponding letter (D, E, F, ...)
    const colLetter = String.fromCharCode(charToAscii(startCell.charAt(0)));
    // Calculate the target cell based on the starting cell and indices
    const targetCell = colLetter + parseInt(startCell.slice(1));
    // Write the value to the target cell
    sheet.cell(targetCell).value(mongoData);
  } else {
    mongoData.forEach((data, rowIndex) => {
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
    mongoData = [];
  } else {
    mongoData = queryData;
  }
  //console.log("mongoData length:", mongoData.length);
  const startCell = excelStart; //塞在excel哪裡

  mongoData.forEach((data, rowIndex) => {
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
  //(範本位置，插入資料，插入位址)
  const sheet = workbook.sheet(sheetNum); //第幾個分頁(第一個為0)
  //console.log("insert:", queryData);
  if (queryData == undefined) {
    mongoData = [];
  } else {
    mongoData = queryData;
  }
  //console.log("mongoData length:", mongoData.length);
  //console.log("一維矩陣橫向新增");
  const startCell = excelStart; //塞在excel哪裡

  if (mongoData.includes("-")) {
    //判斷是否為日期(2024-01-01)
    // Convert the column index to the corresponding letter (D, E, F, ...)
    const colLetter = String.fromCharCode(charToAscii(startCell.charAt(0)));
    // Calculate the target cell based on the starting cell and indices
    const targetCell = colLetter + parseInt(startCell.slice(1));
    // Write the value to the target cell
    sheet.cell(targetCell).value(mongoData);
  } else {
    mongoData.forEach((data, rowIndex) => {
      // Convert the column index to the corresponding letter (D, E, F, ...)
      const colLetter = String.fromCharCode(
        charToAscii(startCell.charAt(0)) + rowIndex
      );
      // Calculate the target cell based on the starting cell and indices
      const targetCell = colLetter + parseInt(startCell.slice(1));
      //console.log("targetCell:" + targetCell);
      // Write the value to the target cell
      sheet.cell(targetCell).value(data);
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
// - 使用 cron 來定時執行報表生成
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
