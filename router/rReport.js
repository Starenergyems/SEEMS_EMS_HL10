const port = 3230;
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
app.get("/report", (req, res) => {
  // num與fun
  res.render("Rpt_Report");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

app.get("/report/report", (req, res) => {
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

//路由定義
// app.get("/report/download-excel", async (req, res) => {
//   //定期撈資料供下載存至地端or檔案不存在就自己撈資料
//   try {
//     //查詢參數中取得templatePath
//     const { templatePath } = req.query; //url要帶參數
//     if (!templatePath) {
//       return res.status(400).send("Missing templatePath parameter");
//     }

//     //使用xlsx庫從指定的Excel模板路徑讀取工作簿。
//     const workbook = await xlsx.fromFileAsync(templatePath);

//     // Fetch data from MongoDB (replace with your MongoDB logic)
//     const mongoData = await fetchDataFromMongoDB();

//     // Update the Excel file with MongoDB data，使用取得的MongoDB資料更新Excel工作簿。
//     updateExcelWithMongoData(workbook, mongoData);

//     // Save the modified workbook to a temporary file 存儲修改後的工作簿到臨時文件
//     const tempFilePath = path.join(__dirname, "temp.xlsx");
//     await workbook.toFileAsync(tempFilePath);

//     // Set up response headers for Excel file download
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment;");

//     // Read the temporary file as a stream and pipe it to the response
//     //設置HTTP響應標頭，指定返回的內容類型為Excel文件，並設置Content-Disposition標頭，提示瀏覽器以附件形式處理。
//     const fileStream = fs.createReadStream(tempFilePath);
//     fileStream.pipe(res);

//     // Remove the temporary file after sending the response
//     fileStream.on("end", () => {
//       fs.unlinkSync(tempFilePath);
//     });
//   } catch (error) {
//     console.error("Error generating Excel file:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

//百分比對照
function Conversionpercentage(randomNumber) {
  let result = (randomNumber / 100).toFixed(1);
  return parseFloat(result);
}

//日報讀值
async function getDayData() {
  try {
    // 計算大前天的時間範圍
    const dayBeforeYesterdayStart = moment()
      .subtract(2, "days") //改時間 原本是2
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }) // 設置結束時間為 23:59:59.999
      .subtract(2, "seconds") // 減去2秒到23:59:57
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

    const dayBeforeYesterdayEnd = moment()
      .subtract(2, "days") //改時間 原本是2
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }) // 設置結束時間為 23:59:59.999
      //.endOf("day")
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    console.log("Day Before Yesterday Start Time:", dayBeforeYesterdayStart);
    console.log("Day Before Yesterday End Time:", dayBeforeYesterdayEnd);

    // 初始化存儲數值的陣列
    let data = [];

    // 定義篩選器條件，查詢大前天的數據
    const filterDayBeforeYesterday = {
      selector: {
        time: {
          $gte: dayBeforeYesterdayStart, // 開始時間為大前天的 23:59:57
          $lte: dayBeforeYesterdayEnd, // 結束時間為大前天的 23:59:59
        },
      },
      limit: 3, //只讀取最後三秒
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
    const yesterdayStart = moment()
      .subtract(1, "days") //改時間 原本是1
      .startOf("day")
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    const yesterdayEnd = moment()
      .subtract(1, "days") //改時間 原本是1
      .startOf("day")
      .subtract(1, "seconds") // 減去1秒到昨天的 23:59:59
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    // 依序讀取後續的資料，每次增加一小時
    for (let i = 0; i < 24; i++) {
      // 計算時間段的起始時間和結束時間
      const intervalStart = moment(yesterdayStart)
        .add(i - 8, "hours")
        .startOf(0, "hour")
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      const intervalEnd = moment(yesterdayEnd)
        .add(i - 8 + 1, "hours")
        .startOf(59, "seconds")
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

      // console.log("intervalStart : " + intervalStart);
      // console.log("intervalEnd   : " + intervalEnd);

      // 定義篩選器條件，查詢該時間段的數據
      const filterInterval = {
        selector: {
          time: {
            $gte: intervalStart, // 開始時間
            $lte: intervalEnd, // 結束時間
          },
        },
        limit: 3600, // 每個時間段讀取7200筆資料
      };

      // 使用篩選器查詢數據
      const intervalData = await gcDb.find(filterInterval);
      data.push(...intervalData.docs.map((doc) => doc.System["400037"]));

      console.log(
        "Data fetched for interval:",
        intervalStart + "+08:00",
        "-",
        intervalEnd + "+08:00"
      );
    }
    console.log("Total data fetched:", data.length);
    console.log("Data :", data);
    const maxData = [];
    let globalMax = Number.NEGATIVE_INFINITY; // 初始化全局最大值為負無窮大
    let globalMin = Number.POSITIVE_INFINITY; // 初始化全局最小值為正無窮大

    for (let j = 0; j <= 86400; j++) {
      // 確保 data[j] 到 data[j+3] 有足夠的元素
      if (j + 3 < data.length) {
        const sliceOfData = data.slice(j, j + 4); // 取出 data[j] 到 data[j+3]
        const max = Math.max(...sliceOfData); // 找出最大值
        const min = Math.min(...sliceOfData); // 找出最小值
        maxData.push(max); // 將最大值存入 maxData 陣列中
        globalMax = Math.max(globalMax, max); // 更新全局最大值
        globalMin = Math.min(globalMin, min); // 更新全局最小值
      } else {
        // 如果 data[j] 到 data[j+3] 超出了陣列範圍，可進行適當的處理，例如跳出迴圈或者填入預設值
        break; // 在這裡我們直接跳出迴圈
      }
    }
    console.log("MaxData Total data fetched:", maxData.length);
    console.log("maxData :", maxData);
    console.log("globalMax :", globalMax);
    console.log("globalMin :", globalMin);

    let sum = 0;

    for (let k = 0; k < maxData.length; k++) {
      sum += maxData[k]; // 將 maxData 陣列中的數值加總
    }

    //獲得平均值
    const averageoriginal = sum / maxData.length; // 計算平均值並四捨五入到整數 eg94.99
    const average45 = Math.round(sum / maxData.length); // 計算平均值並四捨五入到整數 eg94.99
    const averagefloor = Math.floor(sum / maxData.length); // 計算平均值且捨去小數部分

    console.log("averageoriginal :", averageoriginal);
    console.log("average45 :", average45);
    console.log("averagefloor :", averagefloor);

    //取得每小時的最小SBSPM
    const minValues = []; // 存儲每個小時中的最小值
    const maxValues = []; // 存儲每個小時中的最大值
    const averageValues = []; // 存儲小時中的平均值

    for (let l = 0; l < maxData.length; l += 3600) {
      const group = maxData.slice(l, l + 3600); // 取出每個分組的數據

      // 找出每個分組中的最小值
      const min = Math.min(...group);

      // 找出每個分組中的最大值
      const max = Math.max(...group);

      // 計算每個分組中的平均值
      const sum = group.reduce((acc, val) => acc + val, 0);
      const average = sum / group.length;

      // 將計算結果存入相應的陣列中
      minValues.push(min);
      maxValues.push(max);
      averageValues.push(average);
    }
    console.log("minValues :", minValues);

    console.log("maxValues :", minValues);
    console.log("averageValues :", minValues);

    //換算獲得服務品質指標
    const quality = [];
    // 創建二維陣列並初始化所有元素為0
    const numRows = 25; // 定義行數
    const numCols = 9; // 定義列數
    const hour_final = Array(numRows)
      .fill(0)
      .map(() => Array(numCols).fill(0));
    //const hour_final = Array(7).fill(0);
    let quality_val = 0;
    for (let m = 0; m < minValues.length; m++) {
      const hour_min = minValues[m];
      // const hour_min = minValues[m] / 100;
      if (hour_min >= 9500) {
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
      console.log("Time:" + m + " / quality_val :", quality_val);
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

    console.log("the hour_final :", hour_final);

    const yesterdaystart = moment()
      .subtract(1, "days")
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) // 設置結束時間為 23:59:59.999 //00
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const yesterdayend1 = moment()
      .subtract(1, "days")
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }) // 設置結束時間需大於 23:59:58.999
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const yesterdayend2 = moment()
      .subtract(0, "days")
      .set({ hour: 0, minute: 0, second: 0, millisecond: 999 }) // 設置結束時間需大於 23:59:58.999 //00
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const filteryesterdaystart = {
      selector: {
        time: {
          $gte: yesterdaystart,
        },
      },
      limit: 1,
    };

    const filteryesterdayend = {
      selector: {
        time: {
          $gte: yesterdayend1,
          $lt: yesterdayend2,
        },
      },
      limit: 1,
    };

    // 使用篩選器查詢前天的電表數據 昨天00:00:00
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

    console.log("********************************************************");
    console.log("YesterdayStart_kWh_Import: " + YesterdayStart_kWh_Import);
    console.log("YesterdayStart_kWh_Export: " + YesterdayStart_kWh_Export);
    console.log("YesterdayEnd_kWh_Import: " + YesterdayEnd_kWh_Import);
    console.log("YesterdayEnd_kWh_Export: " + YesterdayEnd_kWh_Export);
    const elsedata = [];

    const kWh_Import = YesterdayEnd_kWh_Import - YesterdayStart_kWh_Import;
    const kWh_Export = YesterdayEnd_kWh_Export - YesterdayStart_kWh_Export;
    const net = kWh_Import - kWh_Export;
    const stopminutes = 0;
    const capacity = 0;
    const RTE = ((kWh_Export / kWh_Import) * 100).toFixed(1);

    elsedata[0] = kWh_Import / 10;
    elsedata[1] = kWh_Export / 10;
    elsedata[2] = net / 10;
    elsedata[3] = stopminutes;
    elsedata[4] = capacity;
    elsedata[5] = parseFloat(RTE);

    console.log("kWh_Import: ", kWh_Import);
    console.log("kWh_Export: ", kWh_Export);
    console.log("net: ", net);
    console.log("stop_Minutes: ", stopminutes);
    console.log("capacity: ", capacity);
    console.log("RTE: ", RTE);
    console.log("elsedata: ", elsedata);

    // 昨天的日期
    const yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    // 定義要存資料庫的時間
    const everydayData = {
      time: yesterdayDate,
      exacutive_rate: hour_final[24],
      other_info: elsedata,
    };

    // 每天的資料存到 CouchDB 中
    reportDb.insert(everydayData, (err, body) => {
      if (err) {
        console.error("Error inserting document:", err);
      } else {
        console.log("Document inserted successfully:", body);
      }
    });
    // 獲取系統當前時間的前一天日期
    const Date = moment().subtract(1, "days").format("YYYY-MM-DD");

    return Date, hour_final, elsedata; //回傳時間、整天的資料、下面統計完的資料
  } catch (error) {
    console.error("Error fetching data from CouchDB:", error);
  }
}

//getDayData();

async function getMonthData() {
  // 獲取系統當前時間的前一個月的第一天
  const MonthsStartStr = moment()
    .subtract(1, "month")
    .startOf("month")
    .format("YYYY-MM-DD");

  // 獲取系統當前時間的前一個月的最後一天
  const MonthsEndStr = moment()
    .subtract(1, "month")
    .endOf("month")
    .format("YYYY-MM-DD");

  // 將格式化的日期字符串轉換為 Moment.js 物件
  const MonthsStart = moment(MonthsStartStr);
  const MonthsEnd = moment(MonthsEndStr);

  // 使用 Moment.js 的 diff 函式計算天數差異
  const numberOfDays = MonthsEnd.diff(MonthsStart, "days") + 1; // 因為 endOf('month') 已經是當月最後一天了，所以需要加 1

  console.log("上個月的搜尋條件_MonthsStart: ", MonthsStartStr);
  console.log("上個月的搜尋條件_MonthsEnd: ", MonthsEndStr);
  console.log("本月共有:", numberOfDays, "天");

  // 初始化存儲數值的陣列
  let data_exacutive_rate = [];
  let data_other_info = [];

  // 定義篩選器條件，查詢大前天的數據
  const filterIntervalforMonth = {
    selector: {
      time: {
        $gte: MonthsStartStr, // 開始時間當月起始
        $lte: MonthsEndStr, // 結束時間為當月最後一天
      },
    },
    limit: numberOfDays, //限制當月天數
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

  // 對 data_exacutive_rate 進行遍歷
  for (let j = 0; j < 7; j++) {
    let sum = 0; // 初始化加總值為 0
    // 對每個子陣列進行遍歷，將相同 j 範圍的數值進行加總
    for (let i = 0; i < data_exacutive_rate.length; i++) {
      sum += data_exacutive_rate[i][j]; // 將數值加到加總值中
    }
    sumArray[j] = sum; // 將加總結果存入 sumArray 中
  }

  // 對 data_exacutive_rate 中相同 j 範圍的數值進行平均計算
  for (let j = 7; j < 10; j++) {
    let sum = 0; // 初始化加總值為 0
    // 對每個子陣列進行遍歷，將相同 j 範圍的數值加總
    for (let i = 0; i < data_exacutive_rate.length; i++) {
      sum += data_exacutive_rate[i][j]; // 將數值加到加總值中
    }
    averageArray[j - 7] = (sum / data_exacutive_rate.length).toFixed(1);
  }

  // console.log("加總結果陣列:", sumArray);
  // console.log("平均值陣列:", averageArray);
  other_sum = [];
  for (let j = 0; j < 5; j++) {
    let sum = 0; // 初始化加總值為 0
    // 對每個子陣列進行遍歷，將相同 j 範圍的數值進行加總
    for (let i = 0; i < data_other_info.length; i++) {
      sum += data_other_info[i][j]; // 將數值加到加總值中
    }
    other_sum[j] = sum.toFixed(1); // 將加總結果存入 sumArray 中
  }

  // 對 data_exacutive_rate 中相同 j 範圍的數值進行平均計算
  for (let j = 5; j < 6; j++) {
    let sum = 0; // 初始化加總值為 0
    // 對每個子陣列進行遍歷，將相同 j 範圍的數值加總
    for (let i = 0; i < data_other_info.length; i++) {
      sum += data_other_info[i][j]; // 將數值加到加總值中
    }
    other_sum[5] = (sum / data_exacutive_rate.length).toFixed(1);
  }

  // console.log("data_exacutive_rate[0]:", data_exacutive_rate[0]);
  // console.log("data_exacutive_rate[0][]:", data_exacutive_rate[0][0]);
  const exacutive_rate_sum = [];
  // console.log("executiveRates:", executiveRates);
  // console.log("otherInfo:", otherInfo);

  const lastMonthstart = moment()
    .subtract(1, "month")
    .startOf("month")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) // 設置結束時間為 23:59:59.999 //00
    .utcOffset("+0800")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  const thisMonthstart = moment()
    .subtract(0, "month")
    .startOf("month")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) //00
    .utcOffset("+0800")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  const filterforMonthStart = {
    selector: {
      time: {
        $gte: lastMonthstart, // 開始時間當月起始
      },
    },
    limit: 1, //限制當月天數
  };

  const filterforMonthEnd = {
    selector: {
      time: {
        $gte: thisMonthstart, // 開始時間當月起始
      },
    },
    limit: 1, //限制當月天數
  };

  console.log("電表搜尋時間起始/lastMonthstart:" + lastMonthstart);
  console.log("電表搜尋時間結束/thisMonth:" + thisMonthstart);

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
  const lastMonth = moment().subtract(1, "months");

  // 取得上個月的年份及月份
  const lastMonthYearMonth = lastMonth.format("YYYY-MM");
  console.log("lastMonthYearMonth:", lastMonthYearMonth);
  console.log("data_exacutive_rate:", data_exacutive_rate);
  console.log("data_other_info:", data_other_info);
  console.log("sumArray:", sumArray);
  console.log("other_sum:", other_sum);
  console.log("averageArray:", averageArray);
  console.log("power:", power);

  // 定義要存資料庫的時間
  const MonthData = {
    time: lastMonthYearMonth, //時間
    sumArray: sumArray, //加總的服務品質
    averageArray: averageArray, //表格SPM的TOTAL
    other_sum: other_sum, //用電總量(IM/EXP/NET/終止服務/充放電效率)
    power: power,
    totMWH: powerFor_aux, //輔助用電總量
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
  const last_month = moment()
    .subtract(2, "months") // 減去兩個月
    .format("YYYY-MM");

  const last_year = moment()
    .subtract(1, "year") // 減去一年
    .subtract(1, "months") // 再減去一個月
    .format("YYYY-MM");

  console.log("last_month:", last_month);
  console.log("last_year:", last_year);

  const filterlast_month = {
    selector: {
      time: {
        $eq: last_month, // 時間等於 last_month
      },
    },
    limit: 1, // 只讀取一個文檔
  };
  const filterlast_year = {
    selector: {
      time: {
        $eq: last_year, // 時間等於 last_month
      },
    },
    limit: 1, // 只讀取一個文檔
  };
  const lastMonthDoc = await monthly_reportDb.find(filterlast_month);
  const lastYearDoc = await monthly_reportDb.find(filterlast_year);

  // 將符合條件的資料存入陣列
  const data = [];
  // 提取所需屬性並存入陣列
  if (lastMonthDoc.docs.length > 0) {
    const { time, sumArray, other_sum, averageArray, totMWH } =
      lastMonthDoc.docs[0];
    data.push({ time, sumArray, other_sum, averageArray, totMWH });
  }
  if (lastYearDoc.docs.length > 0) {
    const { time, sumArray, other_sum, averageArray, totMWH } =
      lastYearDoc.docs[0];
    data.push({ time, sumArray, other_sum, averageArray, totMWH });
  }

  // 輸出結果
  console.log("符合上個月條件的資料:", data[0]);
  console.log("符合去年同期條件的資料:", data[1]);
  return (
    lastMonthYearMonth, //年-月
    data_exacutive_rate, //每月的服務品質指標加總結果 SPM最大最小 31筆
    data_other_info, //每月的總用電量統計 終止服務 充放電效率
    other_sum, //表格中統計總用電量以及終止服務時數
    sumArray, // 表格服務品質指標的TOTAL欄位
    averageArray, //表格SPM的TOTAL
    power, //輔助用電分析
    data[0], //前期
    data[1] //去年同期
  );
}

//getMonthData();

function count_power(start_H, start_M, start_L, end_H, end_M, end_L) {
  // 計算時間1的總共差值
  const totalDiff1 = start_H * 1000000 + start_M * 1000 + start_L * 0.1;

  // 計算時間2的總共差值
  const totalDiff2 = end_H * 1000000 + end_M * 1000 + end_L * 0.1;

  // 計算兩個時間的差值
  const totalDifference = totalDiff2 - totalDiff1;

  return totalDifference;
}

async function getYearData() {
  const last_year = moment()
    .subtract(1, "year") // 減去一年
    .startOf("year") // 獲取一年中的開始時間
    .format("YYYY");

  const last_year_start = moment()
    .subtract(1, "year") // 減去一年
    .startOf("year") // 獲取一年中的開始時間
    .format("YYYY-MM");

  console.log("last_year_start:", last_year_start);

  const last_year_end = moment()
    .subtract(1, "year") // 減去一年
    .endOf("year") // 獲取去年的最後一天的結束時間
    .format("YYYY-MM");

  console.log("last_year_end:", last_year_end);

  const filter_year = {
    selector: {
      time: {
        $gte: last_year_start, // 時間大於或等於 last_year_start
        $lte: last_year_end, // 時間小於或等於 last_year_end
      },
    },
    limit: 12, // 12個月
  };

  const lastYearDocs = await monthly_reportDb.find(filter_year);

  // 將符合條件的資料存入陣列
  const dataforyear = [];
  // 提取指定屬性的資料存入陣列
  lastYearDocs.docs.forEach((doc) => {
    dataforyear.push(
      doc.time,
      doc.sumArray,
      doc.other_sum,
      doc.averageArray,
      doc.totMWH
    );
  });

  console.log("dataforyear:", dataforyear);

  // 初始化陣列用於存儲處理後的數據
  let sumArrayTotal = [];
  let otherSumTotal = [];
  let averageArrayTotal = [];
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

    // 對 averageArray 進行平均，並將值轉換為小數點第一位
    if (doc.averageArray && Array.isArray(doc.averageArray)) {
      if (!averageArrayTotal.length) {
        averageArrayTotal = doc.averageArray.map((value) =>
          parseFloat(value).toFixed(1)
        );
      } else {
        doc.averageArray.forEach((value, index) => {
          averageArrayTotal[index] = (
            (parseFloat(averageArrayTotal[index]) + parseFloat(value)) /
            2
          ).toFixed(1);
        });
      }
    }

    // 對 totMWH 進行加總
    if (doc.totMWH) {
      totMWHTotal += parseFloat(doc.totMWH);
    }
  });

  // 輸出處理後的數據
  console.log("sumArrayTotal:", sumArrayTotal);
  console.log("otherSumTotal:", otherSumTotal);
  console.log("averageArrayTotal:", averageArrayTotal);
  console.log("totMWHTotal:", totMWHTotal);

  // 定義要存資料庫的時間
  const YearData = {
    time: last_year,
    sumArrayTotal: sumArrayTotal, //時間
    otherSumTotal: otherSumTotal, //加總的服務品質
    averageArrayTotal: averageArrayTotal, //表格SPM的TOTAL
    totMWHTotal: totMWHTotal, //用電總量(IM/EXP/NET/終止服務/充放電效率)
  };

  // 每年的資料存到 CouchDB 中
  Year_reportDb.insert(YearData, (err, body) => {
    if (err) {
      console.error("Error inserting document:", err);
    } else {
      console.log("Document inserted successfully:", body);
    }
  });

  //撈出前年
  const the_year_before_last = moment()
    .subtract(2, "Month") // 減去兩年
    .format("YYYY-MM");

  const filter_year_before_last = {
    selector: {
      time: {
        $eq: the_year_before_last, // 時間等於 the_year_before_last
      },
    },
    limit: 1, // 只讀取一個文檔
  };

  const lastYearDoc = await monthly_reportDb.find(filter_year_before_last);

  // 將符合條件的資料存入陣列
  const datayear_before_last = [];
  // 提取所需屬性並存入陣列
  if (lastYearDoc.docs.length > 0) {
    const { sumArray, other_sum, averageArray, totMWH } = lastYearDoc.docs[0];
    datayear_before_last.push(sumArray, other_sum, averageArray, totMWH);
  }

  console.log("datayear_before_last:", datayear_before_last);
  return (
    sumArrayTotal,
    otherSumTotal,
    averageArrayTotal,
    totMWHTotal,
    datayear_before_last
  );
}

getYearData();

// 計算服務品質指標
// async function fetchDataFromMongoDB() {
//   //讀取DB資料+計算執行率+換算服務品質指標
//   return [
//     //回傳執行率 年報1個月1筆 共12筆
//     [611, 222, 33, 44, 55, 366, 177],
//     [711, 22, 33, 44, 55, 266, 277],
//     [911, 22, 33, 44, 55, 166, 177],
//     [600, 20, 30, 40, 50, 20, 100],
//     [511, 222, 33, 44, 55, 266, 277],
//     [811, 222, 33, 44, 55, 166, 177],
//     [911, 22, 33, 44, 55, 66, 177],
//     [800, 200, 30, 40, 50, 60, 300],
//     [711, 222, 33, 44, 55, 66, 177],
//     [711, 22, 33, 44, 55, 66, 177],
//     [711, 222, 33, 44, 55, 26, 177],
//     [800, 20, 30, 40, 50, 20, 100],
//   ];
// }

// Update Excel file with MongoDB data
// function updateExcelWithMongoData(workbook, mongoData) {
//   // Get the first sheet (modify as needed)
//   const sheet = workbook.sheet(0); //第一個分頁

//   // Example: Write MongoDB data starting from cell A2
//   mongoData.forEach((data, index) => {
//     for (let i = 0; i < 7; i++) {
//       // Loop through columns D to J (7 columns)
//       sheet.cell(String.fromCharCode(68 + i) + (index + 6)).value(data[i]);
//     }
//   });
// }

// app.get("/report/getFile", (req, res) => {
//   //點擊尋找已存好的檔案
//   //const folderPath = path.join('C:', 'EMS', 'Report'); //要去哪找檔案
//   const fileName = req.query.fileName; //要找哪個檔案
//   const folderPath = req.query.folderPath; //要去哪找檔案

//   if (!fileName || !folderPath) {
//     return res.status(400).send("Missing parameter");
//   }

//   const filePath = path.join(folderPath, fileName);
//   console.log("後端收到get");
//   console.log("目標位置:" + filePath);
//   // Check if the file exists
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     console.log("後端開始尋找檔案");
//     if (err) {
//       res.status(404).json({
//         status: "error",
//         message: `${fileName} does not exist in ${folderPath}`,
//       });
//     } else {
//       // If the file exists, read and send its content
//       fs.readFile(filePath, (readErr, data) => {
//         if (readErr) {
//           res.status(500).json({
//             status: "error",
//             message: `Error reading ${fileName}: ${readErr}`,
//           });
//         } else {
//           res.send(data);
//         }
//       });
//     }
//   });
// });

// function yesterday() {
//   // Get the current date and time
//   let currentDate = new Date();

//   // Calculate yesterday's date
//   let yesterdayDate = new Date(currentDate);
//   yesterdayDate.setDate(currentDate.getDate() - 1);

//   // Separate year, month, and day
//   yesterdayY = yesterdayDate.getFullYear();
//   yesterdayM = yesterdayDate.getMonth() + 1; // Months are zero-based in JavaScript
//   yesterdayD = yesterdayDate.getDate();

//   // Log the result
//   console.log(
//     `Yesterday's date was: ${yesterdayY}-${yesterdayM}-${yesterdayD}`
//   );
// }

// var yesterdayY, yesterdayM, yesterdayD;

// async function autoDownload(template) {
//   //自動儲存年報
//   try {
//     let directoryPath, filePath;
//     yesterday(); //昨天幾年幾月幾日
//     console.log("開始自動下載");
//     const response = await axios.get(
//       "http://localhost:3200/report/download-excel?templatePath=../public/report/" +
//         template +
//         ".xlsx",
//       { responseType: "arraybuffer" }
//     ); //選擇template撈資料更新excel

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
//       directoryPath = path.join(
//         //在linux中測試
//         "/",
//         "home",
//         "hl10_4-1",
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

// cron.schedule("24 11 24 1 *", async () => {
//   // 秒 分 時 日 月 星期幾 由右到左對照，每年1月1日2:00執行產出前一年年報
//   try {
//     console.log("Cron job: year report download start");
//     autoDownload("YearReport");
//     console.log("Cron job: done");
//   } catch (error) {
//     console.error("Cron job: Error generating Excel file:", error);
//   }
// });

// cron.schedule("30 1 1 * *", async () => {
//   // 秒 分 時 日 月 星期幾 由右到左對照，每月1日1:30執行產出前一月月報
//   try {
//     console.log("Cron job: month report download start");
//     autoDownload("MonthReport");
//     console.log("Cron job: done");
//   } catch (error) {
//     console.error("Cron job: Error generating Excel file:", error);
//   }
// });

// cron.schedule("0 1 * * *", async () => {
//   // 秒 分 時 日 月 星期幾 由右到左對照，每日1:00執行產出前一天日報
//   try {
//     console.log("Cron job: day report download start");
//     autoDownload("DayReport");
//     console.log("Cron job: done");
//   } catch (error) {
//     console.error("Cron job: Error generating Excel file:", error);
//   }
// });

// async function getDayData() {
//   //讀取DB資料+計算執行率+換算服務品質指標
//   const mangoQuery = {
//     selector: {
//       time: { $exists: true },
//     },
//     sort: [{ time: "desc" }],
//     limit: 1,
//   };

//   const dcDb = createNanoInstance("dc_rf10");
//   await dcDb.createIndex(indexDef);
//   // const response = dcDb.createIndex(indexDef);
//   // console.log(response);

//   dcDb.find(mangoQuery, (err, body) => {
//     if (err) {
//       // 如果發生錯誤，印出錯誤信息並回應500 Internal Server Error
//       console.error("Error:", err);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     const db_array = [];
//     // 遍歷查詢結果的每一個文檔
//     for (const item of body.docs) {
//       // 刪除文檔中的'_rev'
//       ["_rev"].forEach((key) => {
//         delete item[key];
//       });

//       item["index"] = "";
//       db_array.push(item);
//     }
//     console.log(db_array);
//     // 將處理過的文檔陣列回應給前端
//     res.send(db_array);
//   });
//   return [
//     //回傳執行率 一天24小時
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//     [1, 0, 0, 0, 0, 0, 0, 100, 99.5, 99],
//   ];
// }

// function getMonthData() {
//   //讀取DB資料+計算執行率+換算服務品質指標
//   return [
//     //回傳執行率 月報 共12筆
//     [611, 222, 33, 44, 55, 366, 177],
//     [711, 22, 33, 44, 55, 266, 277],
//     [911, 22, 33, 44, 55, 166, 177],
//     [600, 20, 30, 40, 50, 20, 100],
//     [511, 222, 33, 44, 55, 266, 277],
//     [811, 222, 33, 44, 55, 166, 177],
//     [911, 22, 33, 44, 55, 66, 177],
//     [800, 200, 30, 40, 50, 60, 300],
//     [711, 222, 33, 44, 55, 66, 177],
//     [711, 22, 33, 44, 55, 66, 177],
//     [711, 222, 33, 44, 55, 26, 177],
//     [800, 20, 30, 40, 50, 20, 100],
//   ];
// }

// function getYearData() {
//   //讀取DB資料+計算執行率+換算服務品質指標
//   return [
//     //回傳執行率 年報1個月1筆 共12筆
//     [611, 222, 33, 44, 55, 366, 177],
//     [711, 22, 33, 44, 55, 266, 277],
//     [911, 22, 33, 44, 55, 166, 177],
//     [600, 20, 30, 40, 50, 20, 100],
//     [511, 222, 33, 44, 55, 266, 277],
//     [811, 222, 33, 44, 55, 166, 177],
//     [911, 22, 33, 44, 55, 66, 177],
//     [800, 200, 30, 40, 50, 60, 300],
//     [711, 222, 33, 44, 55, 66, 177],
//     [711, 22, 33, 44, 55, 66, 177],
//     [711, 222, 33, 44, 55, 26, 177],
//     [800, 20, 30, 40, 50, 20, 100],
//   ];
// }

// module.exports = router;

// app.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });
