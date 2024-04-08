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
  res.render("Rpt_Report");
});

router.get("/report/report", (req, res) => {
  // num與fun
  res.render("Rpt_Report");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */
//const templatePath = path.join(__dirname, '..', 'public/report', 'Report.xlsx');//模板的位置
// const DayTemPath = path.join(
//   __dirname,
//   "..",
//   "public/report",
//   "DayReport.xlsx"
// );
// const MonthTemPath = path.join(
//   __dirname,
//   "..",
//   "public/report",
//   "MonthReport.xlsx"
// );
// const YearTemPath = path.join(
//   __dirname,
//   "..",
//   "public/report",
//   "YearReport.xlsx"
// );

var specified_date; // 指定要撈哪天(會撈前一天) / 月(填4月會撈3月) / 年(填2024年會撈2023年)的資料
var specified_date_clone1;
var specified_date_clone2;
var specified_date_clone3;
var specified_date_clone4;
var specified_date_clone5;
var specified_date_clone6;
var specified_date_clone7;
var specified_date_clone8;
var specified_date_clone9;
var specified_date_clone10;
var specified_date_clone11;
var specified_date_clone12;
var specified_date_clone13;
var specified_date_clone14;
var specified_date_clone15;
var specified_date_clone16;
var specified_date_clone17;
var specified_date_clone18;
var specified_date_clone19;
var specified_date_clone20;
var specified_date_clone21;
var specified_date_clone22;
var specified_date_clone23;

/*************************************************************************************************** */

//測試用 直接指定下載時間
//const specified_date = moment();
//const specified_date = moment("2023-01-01", "YYYY-MM-DD"); // 指定為 2023 年 1 月 1 日
// const input_dateandtime = "2023-01-01 00:00:00";

//var specified_date = moment("2024-03-15 00:00:00", "YYYY-MM-DD HH:mm:ss"); // 指定為 2024 年 3 月 1 日的凌晨 12 點

// console.log("specified_date: " + specified_date.format("YYYY-MM-DD HH:mm:ss"));

// const specified_date_clone1 = specified_date.clone();
// const specified_date_clone2 = specified_date.clone();
// const specified_date_clone3 = specified_date.clone();
// const specified_date_clone4 = specified_date.clone();
// const specified_date_clone5 = specified_date.clone();
// const specified_date_clone6 = specified_date.clone();
// const specified_date_clone7 = specified_date.clone();
// const specified_date_clone8 = specified_date.clone();
// const specified_date_clone9 = specified_date.clone();
// const specified_date_clone10 = specified_date.clone();
// const specified_date_clone11 = specified_date.clone();
// const specified_date_clone12 = specified_date.clone();
// const specified_date_clone13 = specified_date.clone();
// const specified_date_clone14 = specified_date.clone();
// const specified_date_clone15 = specified_date.clone();
// const specified_date_clone16 = specified_date.clone();
// const specified_date_clone17 = specified_date.clone();
// const specified_date_clone18 = specified_date.clone();
// const specified_date_clone19 = specified_date.clone();
// const specified_date_clone20 = specified_date.clone();
// const specified_date_clone21 = specified_date.clone();
// const specified_date_clone22 = specified_date.clone();
// const specified_date_clone23 = specified_date.clone();
// console.log(
//   "specified_date_clone: " + specified_date_clone.format("YYYY-MM-DD HH:mm:ss")
// );

/*************************************************************************************************** */


router.get("/report/download-excel", async (req, res) => {
  //定期撈資料供下載存至地端or檔案不存在就自己撈資料
  try {
    await queryReport(req, res)
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Internal Server Error");
  }
});
/***************************************************************************************************** */
var click_year, click_month, click_day
const queryReport = async (req, res) => {//撈資料放入對應excel表格for前端手動下載
  const { templatePath, reportType, fileName } = req.query; //url要帶參數，fileName是從畫面上讀取的
  if (!templatePath) {
    return res.status(400).send("Missing templatePath parameter");
  }
  console.log("fileName:" + fileName);
  var queryDate = convertFileNameToDate(fileName);
  console.log("queryDate:" + queryDate);
  specified_date = moment(queryDate, "YYYY-MM-DD HH:mm:ss"); //設定搜尋日期

  specified_date_clone1 = specified_date.clone();
  specified_date_clone2 = specified_date.clone();
  specified_date_clone3 = specified_date.clone();
  specified_date_clone4 = specified_date.clone();
  specified_date_clone5 = specified_date.clone();
  specified_date_clone6 = specified_date.clone();
  specified_date_clone7 = specified_date.clone();
  specified_date_clone8 = specified_date.clone();
  specified_date_clone9 = specified_date.clone();
  specified_date_clone10 = specified_date.clone();
  specified_date_clone11 = specified_date.clone();
  specified_date_clone12 = specified_date.clone();
  specified_date_clone13 = specified_date.clone();
  specified_date_clone14 = specified_date.clone();
  specified_date_clone15 = specified_date.clone();
  specified_date_clone16 = specified_date.clone();
  specified_date_clone17 = specified_date.clone();
  specified_date_clone18 = specified_date.clone();
  specified_date_clone19 = specified_date.clone();
  specified_date_clone20 = specified_date.clone();
  specified_date_clone21 = specified_date.clone();
  specified_date_clone22 = specified_date.clone();
  specified_date_clone23 = specified_date.clone();

  //使用xlsx庫從指定的Excel模板路徑讀取工作簿。
  const workbook = await xlsx.fromFileAsync(templatePath);
  var couchData; //插入excel的數值
  tempFilePath = path.join( //站存檔位址
    __dirname,
    "C",
    "report",
    "temp",
    "temp.xlsx");
  // Fetch data from MongoDB
  if (reportType === "年報") {
    couchData = await getYearData();
    const transformedDataforyear = transformData(couchData.dataforyear); //整理資料為陣列
    const transformedTot = transformOtherSumTotal(couchData.otherSumTotal, couchData.totMWHTotal);
    const transformedDataLast = transformDataLastDataYear(couchData.datayear_before_last);

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
    couchData = await getDayData();

    // Update the Excel file with MongoDB data，使用取得的MongoDB資料更新Excel工作簿。
    updateExcel2DHorizon(workbook, couchData.hour_final, 0, "D6"); //服務品質+SBSPM
    updateExcel1DVertical(workbook, couchData.elsedata1, 0, "F33"); //總用電量
    updateExcel1DVertical(workbook, couchData.elsedata2, 0, "J33"); //中止服務
    updateExcel2DHorizon(workbook, couchData.Date, 0, "H3"); //日期
    // await workbook.toFileAsync(tempFilePath);
  } else {
    console.log("前端回傳之報表種類異常: 應為年報/月報/日報");
  }
//************後端將excel存於本機指定位置/////////////////////////////////////////////////////////
divideFileName(fileName); //將獨到的日期拆分為y, m, d
  if (reportType === "年報") {
    directoryPath = path.join(
      "C",
      "report",
      `${click_year}`
    ); //下載後存在哪，要跟getReport api同步

  } else if (reportType === "月報") {
        directoryPath = path.join(
        "C",
        "report",
      `${click_year}`
    ); //下載後存在哪，要跟getReport api同步

  } else if (reportType === "日報") {
    // directoryPath = path.join(
    //   //在linux中測試
    //   "/",
    //   "home",
    //   "hl10_4-1",
    //   "report",
    //   `${yesterdayY}`,
    //   `${yesterdayM}`
    // ); 
      directoryPath = path.join(
      //在linux中測試
      "/",
      "home",
      "seems",
      "report",
      `${click_year}`,
      `${click_month}` //這個有成功存在"router" "/C/report/2024/3"
    ); //下載後存在哪，要跟getReport api同步

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

  // // Remove the temporary file after sending the response
  // fileStream.on("end", () => {
  //   fs.unlinkSync(tempFilePath);
  // });

}

const queryReport_auto = async (template) => {//撈資料放入對應excel表格for後端自動下載呼叫
  
  if (!template) {
    return res.status(400).send("Missing templatePath parameter");
  }
  let directoryPath, filePath, reportType;

    if (template === "YearReport"){
      reportType = "年報";
    } else if (template === "MonthReport"){
      reportType = "月報"
    } else if (template === "DayReport"){
      reportType = "日報"
    } else {
      console.error("報表模板檔名異常,應為YearReport, MonthReport, DayReport")
    }
    let today =  formatedDate(new Date());//今天幾號
    let queryDate = removeDatePart(template, today); //
    console.log("today", today);

    yesterday(); //昨天幾年幾月幾日
  console.log("queryDate:" + queryDate);
  specified_date = moment(queryDate, "YYYY-MM-DD HH:mm:ss"); //設定搜尋日期

  specified_date_clone1 = specified_date.clone();
  specified_date_clone2 = specified_date.clone();
  specified_date_clone3 = specified_date.clone();
  specified_date_clone4 = specified_date.clone();
  specified_date_clone5 = specified_date.clone();
  specified_date_clone6 = specified_date.clone();
  specified_date_clone7 = specified_date.clone();
  specified_date_clone8 = specified_date.clone();
  specified_date_clone9 = specified_date.clone();
  specified_date_clone10 = specified_date.clone();
  specified_date_clone11 = specified_date.clone();
  specified_date_clone12 = specified_date.clone();
  specified_date_clone13 = specified_date.clone();
  specified_date_clone14 = specified_date.clone();
  specified_date_clone15 = specified_date.clone();
  specified_date_clone16 = specified_date.clone();
  specified_date_clone17 = specified_date.clone();
  specified_date_clone18 = specified_date.clone();
  specified_date_clone19 = specified_date.clone();
  specified_date_clone20 = specified_date.clone();
  specified_date_clone21 = specified_date.clone();
  specified_date_clone22 = specified_date.clone();
  specified_date_clone23 = specified_date.clone();

  var tempFilePath; //暫存的excel資料

  //使用xlsx庫從指定的Excel模板路徑讀取工作簿。
  let templatePath = "../public/report/" + template + ".xlsx";
  const workbook = await xlsx.fromFileAsync(templatePath);
  var couchData; //插入excel的數值
  // Fetch data from MongoDB
  if (reportType === "年報") {
    couchData = await getYearData();
    const transformedDataforyear = transformData(couchData.dataforyear); //整理資料為陣列
    const transformedTot = transformOtherSumTotal(couchData.otherSumTotal, couchData.totMWHTotal);
    const transformedDataLast = transformDataLastDataYear(couchData.datayear_before_last);

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
    couchData = await getDayData();

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
    // directoryPath = path.join(
    //   "/",
    //   "home",
    //   "hl10_4-1",
    //   "report",
    //   `${yesterdayY}`
    // ); //下載後存在哪，要跟getReport api同步
    directoryPath = path.join(
      "C",
      "report",
      `${yesterdayY}`
    ); //下載後存在哪，要跟getReport api同步
    filePath = path.join(directoryPath, yesterdayY + "y.xlsx"); //檔名叫什麼
  } else if (template === "MonthReport") {
    // directoryPath = path.join(
    //   "/",
    //   "home",
    //   "seems",
    //   "Documents",
    //   "report",
    //   `${yesterdayY}`
    // ); //下載後存在哪，要跟getReport api同步
        directoryPath = path.join(
        "C",
        "report",
      `${yesterdayY}`
    ); //下載後存在哪，要跟getReport api同步

    filePath = path.join(
      directoryPath,
      `${yesterdayY}` + "y" + `${yesterdayM}` + "m.xlsx"
    ); //檔名叫什麼

  } else if (template === "DayReport") {
    // directoryPath = path.join(
    //   //在linux中測試
    //   "/",
    //   "home",
    //   "hl10_4-1",
    //   "report",
    //   `${yesterdayY}`,
    //   `${yesterdayM}`
    // ); 
      directoryPath = path.join(
      //在linux中測試
      "C",
      "report",
      `${yesterdayY}`,
      `${yesterdayM}` //這個有成功存在"router" "/C/report/2024/3"
    ); //下載後存在哪，要跟getReport api同步
    // directoryPath = path.join(
    //   //在linux中測試
    //   "/",
    //   "home",
    //   "seems",
    //   "Documents",
    //   "report",
    //   `${yesterdayY}`,
    //   `${yesterdayM}`
    // ); //下載後存在哪，要跟getReport api同步

    filePath = path.join(
      directoryPath,
      `${yesterdayY}` +
        "y" +
        `${yesterdayM}` +
        "m" +
        `${yesterdayD}` +
        "d.xlsx"
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
}
// Function to transform the data
function transformData(data) { //年報用，每月值整理成陣列
  const transformedData = [];

  for (let i = 0; i < data.length; i += 8) {
    const monthData = [
      [data[i]], // Month string
      data[i + 1], // Numerical data
      [data[i + 2], data[i + 3], data[i + 4], data[i + 5], data[i + 6], data[i + 7]] // Financial data
    ];
    transformedData.push(monthData);
  }

  return transformedData;
}

function transformDataLastDataYear(data, data1) { //年報用，上期資料整理成陣列
  const transformedData = [
    data[0], 
    [data[1], data[2], data[3], data[4], data[5], data[6], data1] // Financial data
  ];

  return transformedData;
}
// //百分比對照
// function Conversionpercentage(randomNumber) {
//   let result = (randomNumber / 100).toFixed(1);
//   return parseFloat(result);
// }

function transformOtherSumTotal(data) { //整理順序格式為陣列
  const transformedData = [      
    data[3], 
    data[0], 
    data[1],
    data[2], 
    data[5]
  ];

  return transformedData;
}
//百分比對照
function Conversionpercentage(randomNumber) {
  let result = (randomNumber / 100).toFixed(1);
  return parseFloat(result);
}

//日報讀值
async function getDayData() {
  try {
    let average45 = 0;
    //取得86403秒的SPM的數值********************************************************************* */
    // 計算大前天的時間範圍
    const dayBeforeYesterdayStart = specified_date_clone1
      .subtract(2, "days") //改時間 原本是2
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }) // 設置結束時間為 23:59:59.999
      .subtract(3, "seconds") // 減去2秒到23:59:57
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

    const dayBeforeYesterdayEnd = specified_date_clone2
      .subtract(2, "days") //改時間 原本是2
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }) // 設置結束時間為 23:59:59.999
      //.endOf("day")
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    //console.log("Day Before Yesterday Start Time:", dayBeforeYesterdayStart);
    //console.log("Day Before Yesterday End Time:", dayBeforeYesterdayEnd);

    // 初始化存儲數值的陣列
    let data = [];

    // 定義篩選器條件，查詢大前天的數據
    const filterDayBeforeYesterday = {
      selector: {
        time: {
          $gte: dayBeforeYesterdayStart, // 開始時間為大前天的 23:59:57
          $lte: dayBeforeYesterdayEnd // 結束時間為大前天的 23:59:59
        }
      },
      limit: 3 //只讀取最後三秒
    };

    // 使用篩選器查詢大前天的數據
    const dayBeforeYesterdayData = await gcDb.find(filterDayBeforeYesterday);
    data.push(
      ...dayBeforeYesterdayData.docs.map((doc) => doc.System["400037"])
    );

    console.log("Data length fetched for day before yesterday:", data.length);
    console.log("Data fetched for day before yesterday:", data);
    console.log("********************************************");

    // 計算昨天的時間範圍
    const yesterdayStart = specified_date_clone3
      .subtract(1, "days") //改時間 原本是1
      .startOf("day")
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    const yesterdayEnd = specified_date_clone4
      .subtract(1, "days") //改時間 原本是1
      .startOf("day")
      .subtract(1, "seconds") // 減去1秒到昨天的 23:59:59
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    // // 新增一個陣列暫存每個小時的資料
    // const tempData = [];

    // // 依序讀取後續的資料，每次增加一小時
    // for (let i = 0; i < 24; i++) {
    //   // 計算時間段的起始時間和結束時間
    //   const intervalStart = moment(yesterdayStart)
    //     .add(i - 8, "hours")
    //     .startOf(0, "hour")
    //     .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    //   const intervalEnd = moment(yesterdayEnd)
    //     .add(i - 8 + 1, "hours")
    //     .startOf("hour")
    //     .add(59, "minutes")
    //     .add(59, "seconds")
    //     .add(999, "milliseconds")
    //     .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    //   console.log("intervalStart : " + intervalStart);
    //   console.log("intervalEnd   : " + intervalEnd);

    //   // 定義篩選器條件，查詢該時間段的數據
    //   const filterInterval = {
    //     selector: {
    //       time: {
    //         $gte: intervalStart, // 開始時間
    //         $lte: intervalEnd // 結束時間
    //       }
    //     },
    //     limit: 3600 // 每個時間段讀取3600
    //   };

    //   // 每個小時的資料分24次每次一小時存進tempData陣列裡面
    //   const intervalData = await gcDb.find(filterInterval);
    //   tempData.push(...intervalData.docs.map((doc) => doc.System["400037"]));

    //   console.log(
    //     "Data fetched for interval:",
    //     intervalStart + "+08:00",
    //     "-",
    //     intervalEnd + "+08:00-",
    //     "Pushed",
    //     tempData.length,
    //     "items."
    //   );

    //   // 檢查每秒是否都有數值，不足的補0
    //   for (let j = 0; j < 3600; j++) {
    //     if (!tempData[i * 3600 + j]) {
    //       data.push(0);
    //     } else {
    //       data.push(tempData[i * 3600 + j]);
    //     }
    //   }
    // //輸出每個小時的數值
    
    // }


    // console.log("初始Data陣列的86403筆資料", data.length);
    // console.log("原本獲得的Data :", data); 
// 新增一個陣列暫存每個小時的資料
// 新增一個陣列暫存每個小時的資料
const tempData = [];

// 依序讀取後續的資料，每次增加一小時
for (let i = 0; i < 24; i++) {
  // 計算時間段的起始時間和結束時間
  const intervalStart = moment(yesterdayStart)
    .add(i - 8, "hours")
    .startOf("hour"); // 將起始時間設定為每小時的開始
  const intervalEnd = intervalStart.clone().add(1, "hour").subtract(1, "second"); // 將結束時間設定為每小時的結束前一秒

  console.log("intervalStart : " + intervalStart.format());
  console.log("intervalEnd   : " + intervalEnd.format());

  // 定義篩選器條件，查詢該時間段的數據
  const filterInterval = {
    selector: {
      time: {
        $gte: intervalStart.toISOString(), // 開始時間
        $lte: intervalEnd.toISOString() // 結束時間
      }
    },
    limit: 3600 // 每個時間段讀取3600
  };

  // 每個小時的資料分24次每次一小時存進tempData陣列裡面
  const intervalData = await gcDb.find(filterInterval);
  const hourData = [];

  for (let j = 0; j < 3600; j++) {
    // 檢查每秒是否都有數值，不足的補0
    if (intervalData.docs[j]) {
      const secondData = intervalData.docs[j].System["400037"];
      hourData.push(secondData);
    } else {
      hourData.push(0);
    }
  }

  tempData.push(...hourData);

  console.log(
    "Data fetched for interval:",
    intervalStart.format() + "+08:00",
    "-",
    intervalEnd.format() + "+08:00-",
    "Pushed",
    hourData.length,
    "items."
  );
}

// 將每小時的資料合併到 data 陣列中
data.push(...tempData);

console.log("初始Data陣列的86403筆資料", data.length);
console.log("原本獲得的Data :", data);


    //取得大前天+昨天的實際得標容量******************************************************************** */
    //大前天的最後一筆
    var Daybeforyesterday = yesterdayEnd; //yesterdayEnd:昨天 Daybeforyesterday
    const endOfDaybeforyesterday = moment(Daybeforyesterday) //endOfDaybeforyesterday:大前天 23:59:59
      .subtract(1, "days") //改時間 原本是1
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

    const filter_acrossthenightyesterday = {
      selector: {
        time: {
          $gte: endOfDaybeforyesterday, //大前天 23:59:59~昨天00:00:00
          $lte: Daybeforyesterday
        }
      },
      limit: 1 // 搜尋一筆資料
    };
    console.log("------------------------------------");
    console.log("endOfDaybeforyesterday:" + endOfDaybeforyesterday);
    const ScheduleDataDaybeforyesterday = await gcDb.find(
      filter_acrossthenightyesterday
    );
    const scheduleDaybeforyesterdayValues = [];

    ScheduleDataDaybeforyesterday.docs.forEach((doc) => {
      const todaySchedule = doc.Schedule.Today;
      Object.values(todaySchedule).forEach((value) => {
        scheduleDaybeforyesterdayValues.push(value);
      });
    });

    console.log(
      "Total data fetched scheduleDaybeforyesterdayValues:",
      scheduleDaybeforyesterdayValues.length
    );
    console.log(
      "scheduleDaybeforyesterdayValues :",
      scheduleDaybeforyesterdayValues
    );
    console.log(
      "scheduleDaybeforyesterdayValues[95]:",
      scheduleDaybeforyesterdayValues[95] //最後一個小時的資料
    );

    //如果大前天最後一個時段沒得標則要將spm改為100%
    if (scheduleDaybeforyesterdayValues[95] === 0) {
      data[0] = 10000;
      data[1] = 10000;
      data[2] = 10000;
    }
    console.log("經過第一次處理的Data(處理大前天最後一小時有沒有得標) :", data);

    console.log("------------------------------------");
    //昨天的96筆(每筆15分鐘))
    const endOfDay = moment(yesterdayEnd)
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

    const filter_acrossthenight = {
      selector: {
        time: {
          $gte: endOfDay // 等於當天的結束時間
        }
      },
      limit: 1 // 搜尋一筆資料
    };
    console.log("endOfDay:" + endOfDay);

    const ScheduleData = await gcDb.find(filter_acrossthenight);
    const scheduleTodayValues = [];

    ScheduleData.docs.forEach((doc) => {
      const todaySchedule = doc.Schedule.Today;
      Object.values(todaySchedule).forEach((value) => {
        scheduleTodayValues.push(value);
      });
    });

    console.log("昨天實際得標容量長度(檢查有沒有正確的數量):", scheduleTodayValues.length);
    console.log("昨天實際得標容量 :", scheduleTodayValues);

    const maxData = [];

    // 計算
    for (let j = 0; j < 86400; j++) {
      if (j + 3 < data.length) {
        const sliceOfData = data.slice(j, j + 4);
        const max = Math.max(...sliceOfData);
        maxData.push(max);
      }
    }

    console.log("取出四秒滾動最大值的長度(86400):", maxData.length);
    console.log("取出四秒滾動最大值的陣列:", maxData);

    let minIndex; // 在此定義 minIndex 變數
    let maxIndex; // 在此定義 minIndex 變數
    let globalMax = Number.NEGATIVE_INFINITY; // 初始化全局最大值為負無窮大
    let globalMin = Number.POSITIVE_INFINITY; // 初始化全局最小值為正無窮大


    for (let q = 0; q < 86400; q++) {
      //判斷最大值
      if (maxData[q] > globalMax) {
        globalMax = maxData[q];
        maxIndex = q;
      }
      //判斷最小值
      if (maxData[q] < globalMin) {
        globalMin = maxData[q];
        minIndex = q; // 設定 minIndex 變數
      }
    }

    console.log("86400秒裡面最大的sbspm(沒有判斷有沒得標的情況下):", globalMax);
    console.log("86400秒最小的sbspm(沒有判斷有沒得標的情況下):", globalMin);
    console.log("最小值存入 globalMin 的位置:", minIndex);
    console.log("取出最小位置的數值:", maxData[minIndex]);
    console.log("最大值存入 globalMin 的位置:", maxIndex);
    console.log("取出最大位置的數值:", maxData[maxIndex]);


    var no_Execution_period_calculation = 0; //計算沒有在執行的時段(最大96 一個時段15分鐘)
    var Execution_period_calculation = 0; //計算實際上有在執行的時段(最大96 一個時段15分鐘)
    for (var p = 0; p < 96; p++) {
      if (scheduleTodayValues[p] !== 0) {
        Execution_period_calculation++;
      } else if (scheduleTodayValues[p] === 0) {
        no_Execution_period_calculation++;
      }
    }

    var period_calculation =
      no_Execution_period_calculation + Execution_period_calculation;

    console.log("沒有執行的時段總數:" + no_Execution_period_calculation);
    console.log("有執行的時段總數:" + Execution_period_calculation);
    console.log("加總的時段總數(應為96筆)):" + period_calculation);

    let sum = 0;
    let total_count = 0;
    maxData_processed = [];
    for (let k = 0; k < 86400; k++) {
      const intervalIndex = Math.floor(k / 900); //intervalIndex用來取出區間的並判斷是否要計算平均?
      if (scheduleTodayValues[intervalIndex] === 0) {
        maxData_processed[k] = "#"; //如果該小時沒有調度 則直接給一個超大的值去排除
      } else {
        maxData_processed[k] = maxData[k];
      }
    }
    //console.log("處理過的陣列內容(判斷有沒有停止執行)" + maxData_processed);
    //用來計算平均值
    for (let r = 0; r < maxData.length; r++) {
      if (maxData_processed[r] !=="#") {
        // 可以計算的必須是調度的範圍(0-10000)
        sum += maxData[r]; // 將 maxData 陣列中的數值加總
        total_count++;
        average45 = Math.round(sum / total_count); // 計算平均值並四捨五入到整數
      }
    }
    
    // 在計算平均值之前，先檢查 total_count 是否為 0
    if (total_count === 0) {
      average45 = 0;
    }

    console.log("全部時段SPM進行加總的結果: " + sum);
    console.log("總共有幾個可以進行計算的時段總數:" + total_count);
    //******************************************************************* */
    //開始針對每個小時取出最大最小值，並給與該小時的執行率
    //取得每小時的最小SBSPM
    const minValues = []; // 存儲每個小時中的最小值
    const maxValues = []; // 存儲每個小時中的最大值
    const averageValues = []; // 存儲小時中的平均值
    var flag = 0;
    
    for (let l = 0; l < maxData_processed.length; l += 3600) {

      const group = maxData_processed.slice(l, l + 3600); // 取出每個分組的數據
    
      // 檢查分組中是否全部都是 "#"
      const allHashes = group.every(val => val === "#");
    
      if (allHashes) {
        // 如果分組中全部都是 "#"
        minValues.push(0);
        maxValues.push(0);
        averageValues.push(0);
      } 

      else {
        // 找出每個分組中的最小值
        const min = Math.min(...group);
    
        // 找出每個分組中的最大值
        const max = Math.max(...group);
    
        // 計算每個分組中的平均值
        const sum = group.reduce((acc, val) => acc + val, 0);
        //const average = sum / group.length;
        // 將計算結果存入相應的陣列中
        
      // 計算非 '#' 的數量和加總
        const grouptotal = group.filter(val => val !== "#").length;
        const groupsum = group.filter(val => val !== "#").reduce((acc, val) => acc + val, 0);
        const average = groupsum / grouptotal;

        minValues.push(min);
        maxValues.push(max);
        averageValues.push(average);
      }

    }
    
    console.log("minValues :", minValues);
    console.log("maxValues :", minValues);
    console.log("averageValues :", minValues);

    //換算獲得服務品質指標
    const quality = [];
    let counthourstop = 0;
    // 創建二維陣列並初始化所有元素為0
    const numRows = 25; // 定義行數
    const numCols = 9; // 定義列數
    const hour_final = Array(numRows)
      .fill(0)
      .map(() => Array(numCols).fill(0));
    //const hour_final = Array(7).fill(0);
    let quality_val = 0;
    for (let m = 0; m <= minValues.length; m++) {
      const hour_min = minValues[m];
      // const hour_min = minValues[m] / 100;
      if (hour_min ==="#") {
        quality_val = 0;
        hour_final[m][5] = 1;
        hour_final[m][7] = Conversionpercentage(maxValues[m]);
        hour_final[m][8] = Conversionpercentage(minValues[m]);
        hour_final[m][9] = Conversionpercentage(averageValues[m]);
        quality.push(quality_val);
        counthourstop++;
      }
      if (hour_min >= 9500 && hour_min <= 10000) {
        quality_val = 1;
        hour_final[m][0] = 1;
        hour_final[m][7] = Conversionpercentage(maxValues[m]);
        hour_final[m][8] = Conversionpercentage(minValues[m]);
        hour_final[m][9] = Conversionpercentage(averageValues[m]);
        quality.push(quality_val);
      } else if (hour_min < 9500 && hour_min >= 9400) {
        quality_val = 0.8;
        hour_final[m][1] = 1;
        hour_final[m][7] = Conversionpercentage(maxValues[m]);
        hour_final[m][8] = Conversionpercentage(minValues[m]);
        hour_final[m][9] = Conversionpercentage(averageValues[m]);
        quality.push(quality_val);
      } else if (hour_min < 9400 && hour_min >= 9300) {
        quality_val = 0.6;
        hour_final[m][2] = 1;
        hour_final[m][7] = Conversionpercentage(maxValues[m]);
        hour_final[m][8] = Conversionpercentage(minValues[m]);
        hour_final[m][9] = Conversionpercentage(averageValues[m]);
        quality.push(quality_val);
      } else if (hour_min < 9300 && hour_min >= 9200) {
        quality_val = 0.4;
        hour_final[m][3] = 1;
        hour_final[m][7] = Conversionpercentage(maxValues[m]);
        hour_final[m][8] = Conversionpercentage(minValues[m]);
        hour_final[m][9] = Conversionpercentage(averageValues[m]);
        quality.push(quality_val);
      } else if (hour_min < 9200 && hour_min >= 9100) {
        quality_val = 0.2;
        hour_final[m][4] = 1;
        hour_final[m][7] = Conversionpercentage(maxValues[m]);
        hour_final[m][8] = Conversionpercentage(minValues[m]);
        hour_final[m][9] = Conversionpercentage(averageValues[m]);
        quality.push(quality_val);
      } else if (hour_min < 9100 && hour_min >= 7000) {
        quality_val = 0;
        hour_final[m][5] = 1;
        hour_final[m][7] = Conversionpercentage(maxValues[m]);
        hour_final[m][8] = Conversionpercentage(minValues[m]);
        hour_final[m][9] = Conversionpercentage(averageValues[m]);
        quality.push(quality_val);
      } else if (hour_min < 7000) {
        quality_val = 999;
        hour_final[m][6] = 1;
        hour_final[m][7] = Conversionpercentage(maxValues[m]);
        hour_final[m][8] = Conversionpercentage(minValues[m]);
        hour_final[m][9] = Conversionpercentage(averageValues[m]);
        quality.push(quality_val);
      }
      //console.log("Time:" + m + " / quality_val :", quality_val);
    }

    for (let n = 0; n <= 23; n++) {
      hour_final[24][0] += hour_final[n][0];
      hour_final[24][1] += hour_final[n][1];
      hour_final[24][2] += hour_final[n][2];
      hour_final[24][3] += hour_final[n][3];
      hour_final[24][4] += hour_final[n][4];
      hour_final[24][5] += hour_final[n][5];
      hour_final[24][6] += hour_final[n][6];
    }

    hour_final[24][7] = Conversionpercentage(globalMax);
    hour_final[24][8] = Conversionpercentage(average45);
    hour_final[24][9] = Conversionpercentage(globalMin);
    console.log("the qualityis :", quality);
    console.log("counthourstop:" + counthourstop);
    console.log("the hour_final :", hour_final);

    const yesterdaystart = specified_date_clone5
      .subtract(1, "days")
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) // 設置結束時間為 23:59:59.999 //00
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const yesterdayend1 = specified_date_clone6
      .subtract(1, "days")
      .set({ hour: 23, minute: 59, second: 59, millisecond: 0 }) // 設置結束時間需大於 23:59:58.999
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    // console.log("yesterdaystart:" + yesterdaystart);
    console.log("yesterdayend1:" + yesterdayend1);
    const filteryesterdaystart = {
      selector: {
        time: {
          $gte: yesterdaystart
        }
      },
      limit: 1
    };

    const filteryesterdayend = {
      selector: {
        time: {
          $gte: yesterdayend1
        }
      },
      limit: 1
    };

    //使用篩選器查詢前天的電表數據 昨天00:00:00
    const meterYesterdayDataStart = await other01Db.find(filteryesterdaystart);

    const YesterdayStart_kWh_Import = meterYesterdayDataStart.docs.map(
      (doc) => doc.Freq["408028"]
    );
    const YesterdayStart_kWh_Export = meterYesterdayDataStart.docs.map(
      (doc) => doc.Freq["408030"]
    );
    // 使用篩選器查詢前天的電表數據 今天00:00:00
    const meterYesterdayDataEnd = await other01Db.find(filteryesterdayend);

    const YesterdayEnd_kWh_Import = meterYesterdayDataEnd.docs.map(
      (doc) => doc.Freq["408028"]
    );
    const YesterdayEnd_kWh_Export = meterYesterdayDataEnd.docs.map(
      (doc) => doc.Freq["408030"]
    );

    // console.log("********************************************************");
    console.log("YesterdayStart_kWh_Import: " + YesterdayStart_kWh_Import); //起始時間的充電
    console.log("YesterdayStart_kWh_Export: " + YesterdayStart_kWh_Export); //起始時間的放電量
    console.log("YesterdayEnd_kWh_Import: " + YesterdayEnd_kWh_Import); //結束時間的充電
    console.log("YesterdayEnd_kWh_Export: " + YesterdayEnd_kWh_Export); //結束時間的放電

    let elsedata1 = [];
    let elsedata2 = [];
    let elsedata = [];

    let kWh_Import = YesterdayEnd_kWh_Import - YesterdayStart_kWh_Import; //充電量
    let kWh_Export = YesterdayEnd_kWh_Export - YesterdayStart_kWh_Export; //放電量
    let net = kWh_Import - kWh_Export;

    let stopminutes = 0;
    let capacity = 0;
    let RTE = 0;
    if (kWh_Export === kWh_Import || kWh_Export >= kWh_Import) {
      RTE = 0.0;
    } else {
      RTE = Math.abs(((kWh_Export / kWh_Import) * 100).toFixed(1));
    }

    elsedata1[0] = kWh_Import / 10;
    elsedata1[1] = kWh_Export / 10;
    elsedata1[2] = net / 10;
    elsedata2[0] = counthourstop;
    elsedata2[1] = capacity;
    elsedata2[2] = parseFloat(RTE);

    elsedata = elsedata.concat(elsedata1, elsedata2);

    console.log("kWh_Import: ", kWh_Import);
    console.log("kWh_Export: ", kWh_Export);
    console.log("net: ", net);
    console.log("stop_Minutes: ", stopminutes);
    console.log("capacity: ", capacity);
    console.log("RTE: ", RTE);
    console.log("elsedata1: ", elsedata1);
    console.log("elsedata2: ", elsedata2);

    // 昨天的日期
    const yesterdayDate = specified_date_clone8
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    // 定義要存資料庫的時間
    const everydayData = {
      time: yesterdayDate,
      exacutive_rate: hour_final[24],
      other_info: elsedata
    };

    // 每天的資料存到 CouchDB 中
    reportDb.insert(everydayData, (err, body) => {
      if (err) {
        console.error("Error inserting document:", err);
      } else {
        console.log("Document inserted successfully:", body);
      }
    });
    //獲取系統當前時間的前一天日期;
    const Date = specified_date_clone9.subtract(1, "days").format("YYYY-MM-DD");
    return {
      Date: Date,
      hour_final: hour_final,
      elsedata1: elsedata1,
      elsedata2: elsedata2
    };
  }catch (error) {
    console.error("Error fetching data from CouchDB:", error);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
async function getMonthData() {
  // 獲取系統當前時間的前一個月的第一天
  const MonthsStartStr = specified_date_clone10
    .subtract(1, "month")
    .startOf("month")
    .format("YYYY-MM-DD");

  // 獲取系統當前時間的前一個月的最後一天
  const MonthsEndStr = specified_date_clone11
    .subtract(1, "month")
    .endOf("month")
    .format("YYYY-MM-DD");

  // 將格式化的日期字符串轉換為 Moment.js 物件
  const MonthsStart = moment(MonthsStartStr);
  const MonthsEnd = moment(MonthsEndStr);

  // 使用 Moment.js 的 diff 函式計算天數差異
  const numberOfDays = MonthsEnd.diff(MonthsStart, "days") + 1; // 因為 endOf('month') 已經是當月最後一天了，所以需要加 1

  // console.log("上個月的搜尋條件(MonthsStart): ", MonthsStartStr);
  // console.log("上個月的搜尋條件(MonthsEnd): ", MonthsEndStr);
  // console.log("本月共有:", numberOfDays, "天");

  // 初始化存儲數值的陣列
  let data_exacutive_rate = [];
  let data_other_info = [];

  // 定義篩選器條件，查詢大前天的數據
  const filterIntervalforMonth = {
    selector: {
      time: {
        $gte: MonthsStartStr, // 開始時間當月起始
        $lte: MonthsEndStr // 結束時間為當月最後一天
      }
    },
    limit: numberOfDays //限制當月天數
  };

  // 使用篩選器查詢大前天的數據
  const monthBefordata = await reportDb.find(filterIntervalforMonth);
  data_exacutive_rate.push(
    ...monthBefordata.docs.map((doc) => doc.exacutive_rate)
  );
  data_other_info.push(...monthBefordata.docs.map((doc) => doc.other_info));

  // console.log("data_exacutive_rate:", data_exacutive_rate);
  // console.log("data_other_info:", data_other_info);

  //Power consumption analysis

  // 取出 data_exacutive_rate 中的數值
  const executiveRates = [];
  for (let i = 0; i < data_exacutive_rate.length; i++) {
    const innerArray = data_exacutive_rate[i];
    for (let j = 0; j < innerArray.length; j++) {
      const value = innerArray[j];
      executiveRates.push(value);
    }
  }

  // 取出 data_other_info 中的數值
  const otherInfo = [];
  for (let i = 0; i < data_other_info.length; i++) {
    const innerArray = data_other_info[i];
    for (let j = 0; j < innerArray.length; j++) {
      const value = innerArray[j];
      otherInfo.push(value);
    }
  }

  // 儲存加總結果的陣列
  const sumArray = Array.from({ length: 7 }, () => 0); // 初始化為全零陣列
  // 儲存平均值的陣列
  const averageArray = Array.from({ length: 3 }, () => 0); // 初始化為全零陣列

  //當月的一號的00:00:00:000
  const monthstart = specified_date_clone22
    .subtract(1, "months") // 減去一個月
    .startOf("month") // 設置為該月份的第一天
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) // 設置時間為 00:00:00.000  //000
    .utcOffset("+0800") // 設置時區
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"); // 格式化日期

  //當月的最後一天的23:59:59:000
  // 設置為指定日期的上個月的最後一天
  const monthend = specified_date_clone23
    .subtract(1, "months") // 減去一個月
    .endOf("month") // 設置為該月份的最後一天
    .set({ hour: 23, minute: 59, second: 59, millisecond: 0 }) // 設置時間為 23:59:59.000 //000
    .utcOffset("+0800") // 設置時區
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"); // 格式化日期

  // console.log("monthstart:" + monthstart);
  // console.log("monthend:" + monthend);

  //當月的一號的00:00:00:000
  const filterMonthstart = {
    selector: {
      time: {
        $gte: monthstart
      }
    },
    limit: 1
  };
  //當月的最後一天的23:59:59:000
  const filterMonthend = {
    selector: {
      time: {
        $gte: monthend
      }
    },
    limit: 1
  };

  //修改整月的RTE數值
  //使用篩選器查詢上個月月初一號的電表數據 當月的一號的00:00:00:000
  const meterMonthDataStart = await other01Db.find(filterMonthstart);

  const MonthStart_kWh_Import = meterMonthDataStart.docs.map(
    (doc) => doc.Freq["408032"]
  );
  const MonthStart_kWh_Export = meterMonthDataStart.docs.map(
    (doc) => doc.Freq["408034"]
  );
  // 使用篩選器查詢上個月月底的電表數據 當月的最後一天的23:59:59:000
  const meterMonthDataEnd = await other01Db.find(filterMonthend);

  const MonthEnd_kWh_Import = meterMonthDataEnd.docs.map(
    (doc) => doc.Freq["408032"]
  );
  const MonthEnd_kWh_Export = meterMonthDataEnd.docs.map(
    (doc) => doc.Freq["408034"]
  );

  let kWh_Import = MonthEnd_kWh_Import - MonthStart_kWh_Import;
  let kWh_Export = MonthEnd_kWh_Export - MonthStart_kWh_Export;
  let RTE = 0;
  if (kWh_Export === kWh_Import) {
    RTE = 0.0;
  } else {
    RTE = ((kWh_Export / kWh_Import) * 100).toFixed(1);
  }
  // console.log("MonthStart_kWh_Import: " + MonthStart_kWh_Import); //起始時間的充電
  // console.log("MonthStart_kWh_Export: " + MonthStart_kWh_Export); //起始時間的放電量
  // console.log("MonthEnd_kWh_Import: " + MonthEnd_kWh_Import); //結束時間的充電
  // console.log("MonthEnd_kWh_Export: " + MonthEnd_kWh_Export); //結束時間的放電
  // console.log("kWh_Import: " + kWh_Import); //結束時間的放電
  // console.log("kWh_Export: " + kWh_Export); //結束時間的放電

  // console.log("RTE: " + RTE); //當月往返效率的結果 (單獨算 不可以取當月平均)

  // console.log("********************************************************");

  // 對 data_exacutive_rate(存放執行率的) 進行遍歷
  for (let j = 0; j < 7; j++) {
    let sum = 0; // 初始化加總值為 0
    // 對每個子陣列進行遍歷，將相同 j 範圍的數值進行加總
    for (let i = 0; i < data_exacutive_rate.length; i++) {
      sum += data_exacutive_rate[i][j]; // 將數值加到加總值中
    }
    sumArray[j] = sum; // 將加總結果存入 sumArray 中
  }

  // 對 data_exacutive_rate (存放執行率的) 中相同 j 範圍的數值進行平均計算 計算SBSPM的數值 總共三個 最大、平均和最小
  for (let j = 7; j < 10; j++) {
    let sum = 0; // 初始化加總值為 0
    // 對每個子陣列進行遍歷，將相同 j 範圍的數值加總
    for (let i = 0; i < data_exacutive_rate.length; i++) {
      sum += data_exacutive_rate[i][j]; // 將數值加到加總值中
    }
    averageArray[j - 7] = (sum / data_exacutive_rate.length).toFixed(1);
  }

  // console.log("執行率加總結果陣列(1 0.8...):", sumArray);
  // console.log("執行率最大最小全部的平均值陣列:", averageArray);

  other_sum = [];
  for (let j = 0; j < 5; j++) {
    let sum = 0; // 初始化加總值為 0
    // 對每個子陣列進行遍歷，將相同 j 範圍的數值進行加總
    for (let i = 0; i < data_other_info.length; i++) {
      sum += data_other_info[i][j]; // 將數值加到加總值中
    }
    other_sum[j] = sum.toFixed(1); // 將加總結果存入 sumArray 中
  }

  other_sum[5] = RTE;

  //console.log("data_exacutive_rate[0]:", data_exacutive_rate[0]); //輸出一排
  // console.log("data_exacutive_rate[0][0]:", data_exacutive_rate[0][0]); //輸出一格
  const exacutive_rate_sum = [];
  // console.log("executiveRates:", executiveRates); //整個內容輸出
  // console.log("otherInfo:", otherInfo);

  const lastMonthstart = specified_date_clone12
    .subtract(1, "month")
    .startOf("month")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) // 設置結束時間為 23:59:59.999 //00
    .utcOffset("+0800")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  const thisMonthstart = specified_date_clone13
    .subtract(0, "month")
    .startOf("month")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) //00
    .utcOffset("+0800")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  const filterforMonthStart = {
    selector: {
      time: {
        $gte: lastMonthstart // 開始時間當月起始
      }
    },
    limit: 1 //限制當月天數
  };

  const filterforMonthEnd = {
    selector: {
      time: {
        $gte: thisMonthstart // 開始時間當月起始
      }
    },
    limit: 1 //限制當月天數
  };

  // console.log("電表搜尋時間起始/lastMonthstart:" + lastMonthstart);
  // console.log("電表搜尋時間結束/thisMonth:" + thisMonthstart);

  const Month_DataStart = await other10Db.find(filterforMonthStart);

  const Month_start_kWh_Import = Month_DataStart.docs.map(
    (doc) => doc.AuxMtot1["408075"]
  );

  const Month_start_kWh_Total_H_1_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM1["408080"]
  );
  const Month_start_kWh_Total_M_1_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM1["408081"]
  );
  const Month_start_kWh_Total_L_1_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM1["408082"]
  );

  const Month_start_kWh_Total_H_1_2 = Month_DataStart.docs.map(
    (doc) => doc.AuxM2["408080"]
  );
  const Month_start_kWh_Total_M_1_2 = Month_DataStart.docs.map(
    (doc) => doc.AuxM2["408081"]
  );
  const Month_start_kWh_Total_L_1_2 = Month_DataStart.docs.map(
    (doc) => doc.AuxM2["408082"]
  );
  const Month_start_kWh_Total_H_2_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM3["408080"]
  );
  const Month_start_kWh_Total_M_2_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM3["408081"]
  );
  const Month_start_kWh_Total_L_2_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM3["408082"]
  );

  const Month_start_kWh_Total_H_2_2 = Month_DataStart.docs.map(
    (doc) => doc.AuxM4["408080"]
  );
  const Month_start_kWh_Total_M_2_2 = Month_DataStart.docs.map(
    (doc) => doc.AuxM4["408081"]
  );
  const Month_start_kWh_Total_L_2_2 = Month_DataStart.docs.map(
    (doc) => doc.AuxM4["408082"]
  );
  const Month_start_kWh_Total_H_3_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM5["408080"]
  );
  const Month_start_kWh_Total_M_3_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM5["408081"]
  );
  const Month_start_kWh_Total_L_3_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM5["408082"]
  );

  const Month_start_kWh_Total_H_3_2 = Month_DataStart.docs.map(
    (doc) => doc.AuxM6["408080"]
  );
  const Month_start_kWh_Total_M_3_2 = Month_DataStart.docs.map(
    (doc) => doc.AuxM6["408081"]
  );
  const Month_start_kWh_Total_L_3_2 = Month_DataStart.docs.map(
    (doc) => doc.AuxM6["408082"]
  );
  const Month_start_kWh_Total_H_4_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM7["408080"]
  );
  const Month_start_kWh_Total_M_4_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM7["408081"]
  );
  const Month_start_kWh_Total_L_4_1 = Month_DataStart.docs.map(
    (doc) => doc.AuxM7["408082"]
  );

  const Month_start_kWh_Total_H_EMS = Month_DataStart.docs.map(
    (doc) => doc.AuxM8["408080"]
  );
  const Month_start_kWh_Total_M_EMS = Month_DataStart.docs.map(
    (doc) => doc.AuxM8["408081"]
  );
  const Month_start_kWh_Total_L_EMS = Month_DataStart.docs.map(
    (doc) => doc.AuxM8["408082"]
  );
  //////////////////////////////////////////////////////////////////
  const Month_DataEnd = await other10Db.find(filterforMonthEnd);

  const Month_end_kWh_Import = Month_DataStart.docs.map(
    (doc) => doc.AuxMtot1["408075"]
  );

  const Month_end_kWh_Total_H_1_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM1["408080"]
  );
  const Month_end_kWh_Total_M_1_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM1["408081"]
  );
  const Month_end_kWh_Total_L_1_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM1["408082"]
  );

  const Month_end_kWh_Total_H_1_2 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM2["408080"]
  );
  const Month_end_kWh_Total_M_1_2 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM2["408081"]
  );
  const Month_end_kWh_Total_L_1_2 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM2["408082"]
  );
  const Month_end_kWh_Total_H_2_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM3["408080"]
  );
  const Month_end_kWh_Total_M_2_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM3["408081"]
  );
  const Month_end_kWh_Total_L_2_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM3["408082"]
  );

  const Month_end_kWh_Total_H_2_2 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM4["408080"]
  );
  const Month_end_kWh_Total_M_2_2 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM4["408081"]
  );
  const Month_end_kWh_Total_L_2_2 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM4["408082"]
  );
  const Month_end_kWh_Total_H_3_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM5["408080"]
  );
  const Month_end_kWh_Total_M_3_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM5["408081"]
  );
  const Month_end_kWh_Total_L_3_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM5["408082"]
  );

  const Month_end_kWh_Total_H_3_2 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM6["408080"]
  );
  const Month_end_kWh_Total_M_3_2 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM6["408081"]
  );
  const Month_end_kWh_Total_L_3_2 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM6["408082"]
  );
  const Month_end_kWh_Total_H_4_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM7["408080"]
  );
  const Month_end_kWh_Total_M_4_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM7["408081"]
  );
  const Month_end_kWh_Total_L_4_1 = Month_DataEnd.docs.map(
    (doc) => doc.AuxM7["408082"]
  );

  const Month_end_kWh_Total_H_EMS = Month_DataEnd.docs.map(
    (doc) => doc.AuxM8["408080"]
  );
  const Month_end_kWh_Total_M_EMS = Month_DataEnd.docs.map(
    (doc) => doc.AuxM8["408081"]
  );
  const Month_end_kWh_Total_L_EMS = Month_DataEnd.docs.map(
    (doc) => doc.AuxM8["408082"]
  );

  //console.log("Month_start_kWh_Import:", Month_start_kWh_Import);
  //計算用電量
  const powerFor_aux = (Month_end_kWh_Import - Month_start_kWh_Import) * 0.1;
  const powerFor_EMS = count_power(
    Month_start_kWh_Total_H_EMS,
    Month_start_kWh_Total_M_EMS,
    Month_start_kWh_Total_L_EMS,
    Month_end_kWh_Total_H_EMS,
    Month_end_kWh_Total_M_EMS,
    Month_end_kWh_Total_L_EMS
  );
  const powerFor_ESS1_1 = count_power(
    Month_start_kWh_Total_H_1_1,
    Month_start_kWh_Total_M_1_1,
    Month_start_kWh_Total_L_1_1,
    Month_end_kWh_Total_H_1_1,
    Month_end_kWh_Total_M_1_1,
    Month_end_kWh_Total_L_1_1
  );

  const powerFor_ESS1_2 = count_power(
    Month_start_kWh_Total_H_1_2,
    Month_start_kWh_Total_M_1_2,
    Month_start_kWh_Total_L_1_2,
    Month_end_kWh_Total_H_1_2,
    Month_end_kWh_Total_M_1_2,
    Month_end_kWh_Total_L_1_2
  );

  const powerFor_ESS2_1 = count_power(
    Month_start_kWh_Total_H_2_1,
    Month_start_kWh_Total_M_2_1,
    Month_start_kWh_Total_L_2_1,
    Month_end_kWh_Total_H_2_1,
    Month_end_kWh_Total_M_2_1,
    Month_end_kWh_Total_L_2_1
  );

  const powerFor_ESS2_2 = count_power(
    Month_start_kWh_Total_H_2_2,
    Month_start_kWh_Total_M_2_2,
    Month_start_kWh_Total_L_2_2,
    Month_end_kWh_Total_H_2_2,
    Month_end_kWh_Total_M_2_2,
    Month_end_kWh_Total_L_2_2
  );

  const powerFor_ESS3_1 = count_power(
    Month_start_kWh_Total_H_3_1,
    Month_start_kWh_Total_M_3_1,
    Month_start_kWh_Total_L_3_1,
    Month_end_kWh_Total_H_3_1,
    Month_end_kWh_Total_M_3_1,
    Month_end_kWh_Total_L_3_1
  );

  const powerFor_ESS3_2 = count_power(
    Month_start_kWh_Total_H_3_2,
    Month_start_kWh_Total_M_3_2,
    Month_start_kWh_Total_L_3_2,
    Month_end_kWh_Total_H_3_2,
    Month_end_kWh_Total_M_3_2,
    Month_end_kWh_Total_L_3_2
  );
  const powerFor_ESS4_1 = count_power(
    Month_start_kWh_Total_H_4_1,
    Month_start_kWh_Total_M_4_1,
    Month_start_kWh_Total_L_4_1,
    Month_end_kWh_Total_H_4_1,
    Month_end_kWh_Total_M_4_1,
    Month_end_kWh_Total_L_4_1
  );

  // console.log("powerFor_aux: " + powerFor_aux);
  // console.log("powerFor_ESS1_1: " + powerFor_ESS1_1);
  // console.log("powerFor_ESS1_2: " + powerFor_ESS1_2);
  // console.log("powerFor_ESS2_1: " + powerFor_ESS2_1);
  // console.log("powerFor_ESS2_2: " + powerFor_ESS2_2);
  // console.log("powerFor_ESS3_1: " + powerFor_ESS3_1);
  // console.log("powerFor_ESS3_2: " + powerFor_ESS3_2);
  // console.log("powerFor_ESS4_1: " + powerFor_ESS4_1);
  // console.log("powerFor_EMS: " + powerFor_EMS);

  const power = [];
  power[0] = powerFor_aux;
  power[1] = powerFor_EMS;
  power[2] = powerFor_ESS1_1;
  power[3] = powerFor_ESS1_2;
  power[4] = powerFor_ESS2_1;
  power[5] = powerFor_ESS2_2;
  power[6] = powerFor_ESS3_1;
  power[7] = powerFor_ESS3_2;
  power[8] = powerFor_ESS4_1;

  // 取得上個月的日期物件
  const lastMonth = specified_date_clone14.subtract(1, "months");

  // 取得上個月的年份及月份
  const lastMonthYearMonth = lastMonth.format("YYYY-MM");
  // console.log("lastMonthYearMonth:", lastMonthYearMonth);
  // console.log("data_exacutive_rate:", data_exacutive_rate);
  // console.log("data_other_info:", data_other_info);
  // console.log("sumArray:", sumArray);
  // console.log("other_sum:", other_sum);
  // console.log("averageArray:", averageArray);
  // console.log("power:", power);

  // 定義要存資料庫的時間
  const MonthData = {
    time: lastMonthYearMonth, //時間
    sumArray: sumArray, //加總的服務品質
    averageArray: averageArray, //表格SPM的TOTAL
    other_sum: other_sum, //用電總量(IM/EXP/NET/終止服務/充放電效率)
    power: power,
    totMWH: powerFor_aux //輔助用電總量
  };

  // 每天的資料存到 CouchDB 中
  monthly_reportDb.insert(MonthData, (err, body) => {
    if (err) {
      console.error("Error inserting document:", err);
    } else {
      console.log("Document inserted successfully:", body);
    }
  });

  //撈出上期及去年同期資料
  const last_month = specified_date_clone15
    .subtract(2, "months") // 減去兩個月
    .format("YYYY-MM");

  const last_year = specified_date_clone16
    .subtract(1, "year") // 減去一年
    .subtract(1, "months") // 再減去一個月
    .format("YYYY-MM");

  // console.log("last_month:", last_month);
  // console.log("last_year:", last_year);

  const filterlast_month = {
    selector: {
      time: {
        $eq: last_month // 時間等於 last_month
      }
    },
    limit: 1 // 只讀取一個文檔
  };
  const filterlast_year = {
    selector: {
      time: {
        $eq: last_year // 時間等於 去年
      }
    },
    limit: 1 // 只讀取一個文檔
  };
  const lastMonthDoc = await monthly_reportDb.find(filterlast_month);
  const lastYearDoc = await monthly_reportDb.find(filterlast_year);

  // 將符合條件的資料存入陣列
  const data1 = [];
  const data2 = [];
  const data3 = [];
  const data4 = [];

  // 提取所需屬性並存入陣列
  if (lastMonthDoc.docs.length > 0) {
    const { sumArray, other_sum, averageArray } = lastMonthDoc.docs[0];

    // 直接將數值合併到一個新的陣列中
    const extractedData1 = [
      ...sumArray,
      ...other_sum.map((value) => parseFloat(value)),
      ...averageArray
    ];
    data1.push(extractedData1);
  }
  //console.log("符合上個月條件的資料:", data1[0]);

  if (lastMonthDoc.docs.length > 0) {
    const { power } = lastMonthDoc.docs[0];
    // 直接將數值合併到一個新的陣列中
    const extractedData = [...power];
    data3.push(extractedData);
  }
  //console.log("我是power 1:", data3[0]);

  if (lastYearDoc.docs.length > 0) {
    const { sumArray, other_sum, averageArray } = lastYearDoc.docs[0];

    // 直接將數值合併到一個新的陣列中
    const extractedData2 = [
      ...sumArray,
      ...other_sum.map((value) => parseFloat(value)),
      ...averageArray
    ];
    data2.push(extractedData2);
  }
  //console.log("符合去年同期條件的資料:", data2[0]);

  if (lastYearDoc.docs.length > 0) {
    const { power } = lastYearDoc.docs[0];

    // 直接將數值合併到一個新的陣列中
    const extractedData = [...power];
    data4.push(extractedData);
  }
  //console.log("我是power 2:", data4[0]);

  return {
    lastMonthYearMonth: lastMonthYearMonth, //年-月
    data_exacutive_rate: data_exacutive_rate, //每月的服務品質指標加總結果 SPM最大最小 31筆
    data_other_info: data_other_info, //每月的總用電量統計 終止服務 充放電效率
    other_sum: other_sum, //表格中統計總用電量以及終止服務時數
    sumArray: sumArray, // 表格服務品質指標的TOTAL欄位
    averageArray: averageArray, //表格SPM的TOTAL
    power: power, //輔助用電分析
    last_month: data1[0], //前期
    last_month_power: data3[0], //前期power
    last_year: data2[0], //去年同期
    last_year_power: data4[0] //去年同期power
  };
}

function count_power(start_H, start_M, start_L, end_H, end_M, end_L) {
  // 計算時間1的總共差值
  const totalDiff1 = start_H * 1000000 + start_M * 1000 + start_L * 0.1;

  // 計算時間2的總共差值
  const totalDiff2 = end_H * 1000000 + end_M * 1000 + end_L * 0.1;

  // 計算兩個時間的差值
  const totalDifference = totalDiff2 - totalDiff1;

  return totalDifference;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
async function getYearData() {
  const last_year = specified_date_clone17
    .subtract(1, "year") // 減去一年
    .startOf("year") // 獲取一年中的開始時間
    .format("YYYY");

  const last_year_start = specified_date_clone18
    .subtract(1, "year") // 減去一年
    .startOf("year") // 獲取一年中的開始時間
    .format("YYYY-MM");

  console.log("last_year_start:", last_year_start);

  const last_year_end = specified_date_clone19
    .subtract(1, "year") // 減去一年
    .endOf("year") // 獲取去年的最後一天的結束時間
    .format("YYYY-MM");

  console.log("last_year_end:", last_year_end);

  const filter_year = {
    selector: {
      time: {
        $gte: last_year_start, // 時間大於或等於 last_year_start
        $lte: last_year_end // 時間小於或等於 last_year_end
      }
    },
    limit: 12 // 12個月
  };

  const lastYearDocs = await monthly_reportDb.find(filter_year);

  // 將符合條件的資料存入陣列
  const dataforyear = [];
  // 提取指定屬性的資料存入陣列
  lastYearDocs.docs.forEach((doc) => {
    dataforyear.push(
      doc.time, //時間
      doc.sumArray, //服務品質指標加總
      doc.other_sum[3], //min [ '65609.6', '4932.9', '60676.7', '0.0', '0.0', '784.1' ], imp exp net min mw 充放電效率
      doc.other_sum[0], //imp [ '65609.6', '4932.9', '60676.7', '0.0', '0.0', '784.1' ],  exp net min mw 充放電效率
      doc.other_sum[1], //exp [ '65609.6', '4932.9', '60676.7', '0.0', '0.0', '784.1' ], imp  net min mw 充放電效率
      doc.other_sum[2], //net [ '65609.6', '4932.9', '60676.7', '0.0', '0.0', '784.1' ], imp exp  min mw 充放電效率
      doc.other_sum[5], //充放電效率 [ '65609.6', '4932.9', '60676.7', '0.0', '0.0', '784.1' ], imp exp net min mw 充放電效率
      //doc.averageArray, //spm平均
      doc.totMWH //輔助用電
    );
  });

  console.log("dataforyear:", dataforyear);

  // 初始化陣列用於存儲處理後的數據
  let sumArrayTotal = [];
  let otherSumTotal = [];
  //let averageArrayTotal = [];
  let totMWHTotal = 0;

  // 遍歷每個文檔
  lastYearDocs.docs.forEach((doc) => {
    // 對 sumArray 進行加總，並將值轉換為小數點第一位
    if (doc.sumArray && Array.isArray(doc.sumArray)) {
      if (!sumArrayTotal.length) {
        sumArrayTotal = doc.sumArray.map((value) =>
          parseFloat(value).toFixed(1)
        );
      } else {
        doc.sumArray.forEach((value, index) => {
          sumArrayTotal[index] = (
            parseFloat(sumArrayTotal[index]) + parseFloat(value)
          ).toFixed(1);
        });
      }
    }

    // 對 other_sum 進行加總，並將值轉換為小數點第一位
    if (doc.other_sum && Array.isArray(doc.other_sum)) {
      if (!otherSumTotal.length) {
        otherSumTotal = doc.other_sum.map((value) =>
          parseFloat(value).toFixed(1)
        );
      } else {
        doc.other_sum.forEach((value, index) => {
          otherSumTotal[index] = (
            parseFloat(otherSumTotal[index]) + parseFloat(value)
          ).toFixed(1);
        });
      }
    }

    let totMWHTotal = 0;
    let docCount = 0;
    let totMWHAverage = 0;

    // 對 totMWH 進行加總
    if (doc.totMWH) {
      totMWHTotal += parseFloat(doc.totMWH);
    }

    // lastYearDocs.docs.forEach((doc) => {
    //   const totMWH = doc.totMWH; // 取得 totMWH 的值

    //   // 檢查 totMWH 是否存在並且不為空
    //   if (totMWH) {
    //     // 將 totMWH 的值轉換為浮點數並加到加總值中
    //     totMWHTotal += parseFloat(totMWH);
    //     // 增加文檔數量計數
    //     docCount++;
    //   }
    // });

    // // 計算平均值
    // totMWHAverage = docCount > 0 ? totMWHTotal / docCount : 0;
    // 輸出處理後的數據
    //console.log("sumArrayTotal:", sumArrayTotal);
    //console.log("otherSumTotal:", otherSumTotal);
    //console.log("totMWHTotal:", totMWHTotal);
  });

  // 定義要存資料庫的時間
  const YearData = {
    time: last_year, //時間
    sumArrayTotal: sumArrayTotal,
    otherSumTotal_3: otherSumTotal[3],
    otherSumTotal_0: otherSumTotal[0],
    otherSumTotal_1: otherSumTotal[1],
    otherSumTotal_2: otherSumTotal[2],
    otherSumTotal_5: otherSumTotal[5],
    totMWHTotal: totMWHTotal
  };
  console.log("我是要存起來的 YearData:", YearData);

  // 每年的資料存到 CouchDB 中
  Year_reportDb.insert(YearData, (err, body) => {
    if (err) {
      console.error("Error inserting document:", err);
    } else {
      console.log("Document inserted successfully:", body);
    }
  });

  //撈出前年
  const the_year_before_last = specified_date_clone20
    .subtract(2, "Month") // 減去兩年
    .format("YYYY-MM");

  const filter_year_before_last = {
    selector: {
      time: {
        $eq: the_year_before_last // 時間等於 the_year_before_last
      }
    },
    limit: 1 // 只讀取一個文檔
  };

  const lastYearDoc = await monthly_reportDb.find(filter_year_before_last);

  // 將符合條件的資料存入陣列
  const datayear_before_last = [];
  // 提取所需屬性並存入陣列
  if (lastYearDoc.docs.length > 0) {
    const {
      sumArray,
      otherSumTotal_3,
      otherSumTotal_0,
      otherSumTotal_1,
      otherSumTotal_2,
      otherSumTotal_5,
      totMWH
    } = lastYearDoc.docs[0];
    datayear_before_last.push(
      sumArray,
      otherSumTotal[3],
      otherSumTotal[0],
      otherSumTotal[1],
      otherSumTotal[2],
      otherSumTotal[5],
      totMWH
    );
  }

  console.log("我是上一期的資料datayear_before_last:", datayear_before_last);
  // return {
  //   lastMonthYearMonth: lastMonthYearMonth, //年-月
  //   data_exacutive_rate: data_exacutive_rate, //每月的服務品質指標加總結果 SPM最大最小 31筆
  //   data_other_info: data_other_info, //每月的總用電量統計 終止服務 充放電效率
  //   other_sum: other_sum, //表格中統計總用電量以及終止服務時數
  //   sumArray: sumArray, // 表格服務品質指標的TOTAL欄位
  //   averageArray: averageArray, //表格SPM的TOTAL
  //   power: power, //輔助用電分析
  //   last_month: data1[0], //前期
  //   last_month_power: data3[0], //前期power
  //   last_year: data2[0], //去年同期
  //   last_year_power: data4[0], //去年同期power
  // };

  return {
    dataforyear: dataforyear,
    sumArrayTotal: sumArrayTotal,
    otherSumTotal: otherSumTotal,
    totMWHTotal: totMWHTotal,
    datayear_before_last: datayear_before_last
  };

}

function convertFileNameToDate(inputFileName) {//將畫面上的名稱轉成搜尋日期(會搜尋昨天/上個月/去年，所以要+1天)
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

  // if (day) { //如果是日報，日期+1
  //   parsedDate.setDate(parsedDate.getDate() + 1);
  // } else if (month){ //如果是月報，月份+1
  //   parsedDate.setMonth(parsedDate.getMonth() + 1);
  // } else { //如果是年報，年份+1
  //   parsedDate.setMonth(parsedDate.getYear() + 1);
  // }

  if (match[3]) {
    //如果有日期就是日報，日期+1
    console.log("日+1");
    parsedDate.setDate(parsedDate.getDate() + 1);
  } else if (match[2]) {
    //如果無日期有月份。就是月報，月份+1
    console.log("月+1");
    parsedDate.setMonth(parsedDate.getMonth() + 1);
    parsedDate.setDate(1);
  } else {
    //如果是年報，年份+1
    console.log("年+1");
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

function divideFileName(inputFileName) {//將畫面上的名稱轉成分開的y,m,d, 用於設定手動下載的存檔路徑
  // Extract the date parts from the filename using a regular expression
  const regex = /(\d{4})y(?:(\d{1,2})m?(?:(\d{1,2})d)?)?\.xlsx/;
  const match = inputFileName.match(regex);
  if (!match) {
    throw new Error("Invalid filename format");
  }
  // Extracted date parts
  click_year = match[1];
  click_month = match[2] 
  click_day = match[3] 
  return click_year, click_month, click_day
}

// Update Excel file with MongoDB data
function updateExcel2DHorizon(workbook, queryData, sheetNum, excelStart) {
  //(範本位置，插入資料，第幾個分頁，插入位址)
  const sheet = workbook.sheet(sheetNum); //第幾個分頁(第一頁是0)
  console.log("insert:", queryData);
  if (queryData == undefined) {
    mongoData = [];
  } else {
    mongoData = queryData;
  }
  console.log("mongoData length:", mongoData.length);
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
      console.log("data length:", data.length);
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
        console.log("targetCell:" + targetCell);
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
  console.log("insert:", queryData);
  if (queryData == undefined) {
    mongoData = [];
  } else {
    mongoData = queryData;
  }
  console.log("mongoData length:", mongoData.length);
  const startCell = excelStart; //塞在excel哪裡

  mongoData.forEach((data, rowIndex) => {
    // Convert the column index to the corresponding letter (D, E, F, ...)
    const colLetter = String.fromCharCode(charToAscii(startCell.charAt(0)));
    // Calculate the target cell based on the starting cell and indices
    const targetCell = colLetter + (parseInt(startCell.slice(1)) + rowIndex);
    console.log("targetCell:" + targetCell);
    // Write the value to the target cell
    sheet.cell(targetCell).value(data);
  });
}

// 一維矩陣更新excel，橫放
function updateExcel1DHorizon(workbook, queryData, sheetNum, excelStart) {
  //(範本位置，插入資料，插入位址)
  const sheet = workbook.sheet(sheetNum); //第幾個分頁(第一個為0)
  console.log("insert:", queryData);
  if (queryData == undefined) {
    mongoData = [];
  } else {
    mongoData = queryData;
  }
  console.log("mongoData length:", mongoData.length);
  console.log("一維矩陣橫向新增");
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
      console.log("targetCell:" + targetCell);
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
  console.log("目標位置:" + filePath);
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    console.log("後端開始尋找檔案");
    if (err) {
      res.status(404).json({
        status: "error",
        message: `${fileName} does not exist in ${folderPath}`
      });
    } else {
      // If the file exists, read and send its content
      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.status(500).json({
            status: "error",
            message: `Error reading ${fileName}: ${readErr}`
          });
        } else {
          res.send(data);
        }
      });
    }
  });
});

function yesterday() { //用來控制自動下載的檔名，應為昨天的日期or上個月or去年
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

function formatedDate(date) { //Date格式轉換成2023年1月1日.xlsx
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is zero-based
  const day = date.getDate();
  return `${year}年${month}月${day}日.xlsx`;
}
function removeDatePart(template, formattedDate) { //後續會使用是否有"月""日"來判斷要如何搜尋資料，沒有"日"就是月報，沒有"日月"就是年報
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
        return year + "年" + month + "月" + day + "日.xlsx"
      }
  }
  
  // Default filename if the format doesn't match
  console.error("輸入格式異常, 應為ex:2023年1月1日.xlsx")
  return "output.xlsx";
}

var yesterdayY, yesterdayM, yesterdayD;
// async function autoDownload(template) {
//   //自動儲存年報
//   try {
//     let directoryPath, filePath, reportType;

//     if (template === "YearReport"){
//       reportType = "年報";
//     } else if (template === "MonthReport"){
//       reportType = "月報"
//     } else if (template === "DayReport"){
//       reportType = "日報"
//     } else {
//       console.error("報表模板檔名異常,應為YearReport, MonthReport, DayReport")
//     }
//     let today =  formatedDate(new Date());//今天幾號
//     let fileName = removeDatePart(template, today);
//     console.log("today", today);
//     console.log("fileName", fileName);

//     yesterday(); //昨天幾年幾月幾日
//     console.log("開始自動下載");
//     console.log("url", "http://localhost:3000/report/download-excel?templatePath=../public/report/" + template + ".xlsx&reportType=" + reportType + "&fileName=" + fileName);
//     // const response = await axios.get(
//     //   "http://localhost:3000/report/download-excel?templatePath=../public/report/" +
//     //     template +
//     //     ".xlsx&reportType=" +
//     //     reportType +
//     //     "&fileName=" +
//     //     fileName, 
//     //   { responseType: "arraybuffer" }
//     // ); //選擇template撈資料更新excel
//     const req = {
//       query: {
//           templatePath: "../public/report/" + template + ".xlsx",
//           reportType: reportType,
//           fileName: fileName
//       }
//     };
    
//     // Mimic the response object (you can mock it using tools like Sinon.js if needed)
//     const res = {
//         status: function(code) {
//             // Implement status function if required
//             return this;
//         },
//         send: function(message) {
//             // Implement send function if required
//             console.log(message);
//         },
//         setHeader: function(name, value) {
//           // Simulate setting response headers
//         }
//     };

//     const response = await queryReport(req, res);
//     console.log("result:",response.data);
//     // Specify the full absolute path for saving the file
//     if (template === "YearReport") {
//       directoryPath = path.join(
//         "/",
//         "home",
//         "hl10_4-1",
//         "report",
//         `${yesterdayY}`
//       ); //下載後存在哪，要跟getReport api同步
//       filePath = path.join(directoryPath, yesterdayY + "y.xlsx"); //檔名叫什麼
//     } else if (template === "MonthReport") {
//       directoryPath = path.join(
//         "/",
//         "home",
//         "hl10_4-1",
//         "report",
//         `${yesterdayY}`
//       ); //下載後存在哪，要跟getReport api同步
//       filePath = path.join(
//         directoryPath,
//         `${yesterdayY}` + "y" + `${yesterdayM}` + "m.xlsx"
//       ); //檔名叫什麼
//     } else if (template === "DayReport") {
//       // directoryPath = path.join(
//       //   //在linux中測試
//       //   "/",
//       //   "home",
//       //   "hl10_4-1",
//       //   "report",
//       //   `${yesterdayY}`,
//       //   `${yesterdayM}`
//       // ); //下載後存在哪，要跟getReport api同步
//       directoryPath = path.join(
//         //在linux中測試
//         "/",
//         "home",
//         "seems",
//         "Documents",
//         "report",
//         `${yesterdayY}`,
//         `${yesterdayM}`
//       ); //下載後存在哪，要跟getReport api同步
//       filePath = path.join(
//         directoryPath,
//         `${yesterdayY}` +
//           "y" +
//           `${yesterdayM}` +
//           "m" +
//           `${yesterdayD}` +
//           "d.xlsx"
//       ); //檔名叫什麼
//     } else {
//       console.log("參數設置錯誤");
//     }

//     // Check if the directory exists, create it if not
//     console.log("Resolved absolute path:", path.resolve(directoryPath));
//     if (!fs.existsSync(directoryPath)) {
//       try {
//         console.log("doesn't exist");
//         fs.mkdirSync(directoryPath, { recursive: true });
//         console.log("Directory created successfully:", directoryPath);
//       } catch (error) {
//         console.error("Error creating directory:", error.message);
//       }
//     }

//     // Save the file to the specified path
//     fs.writeFileSync(filePath, Buffer.from(response.data));

//     console.log("Download complete. File saved at:", filePath);
//   } catch (error) {
//     console.error("Error downloading Excel file:", error.message);
//   }
// }

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

cron.schedule("56 15 27 * *", async () => {
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

// app.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });
