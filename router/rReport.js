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
const gcDb = nano.use(gc_rf10); // 請注意這裡使用 nano.use() 來設定數據庫

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

//日報讀值
async function getDayReportData() {
  try {
    // 計算大前天的時間範圍
    const dayBeforeYesterdayStart = moment()
      .subtract(2, "days")
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }) // 設置結束時間為 23:59:59.999
      .subtract(2, "seconds") // 減去2秒到23:59:57
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

    const dayBeforeYesterdayEnd = moment()
      .subtract(2, "days")
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
      .subtract(1, "days")
      .startOf("day")
      .utcOffset("+0800")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const yesterdayEnd = moment()
      .subtract(1, "days")
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
    const minValues = []; // 存儲每個分組中的最小值
    const maxValues = []; // 存儲每個分組中的最大值
    const averageValues = []; // 存儲每個分組中的平均值

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
    let quality_val = 0;
    for (let m = 0; m < minValues.length; m++) {
      const hour_min = minValues[m];
      // const hour_min = minValues[m] / 100;
      if (hour_min >= 9500) {
        quality_val = 1;
        quality.push(quality_val);
      } else if (hour_min < 9500 && hour_min >= 9400) {
        quality_val = 0.8;
        quality.push(quality_val);
      } else if (hour_min < 9400 && hour_min >= 9300) {
        quality_val = 0.6;
        quality.push(quality_val);
      } else if (hour_min < 9300 && hour_min >= 9200) {
        quality_val = 0.4;
        quality.push(quality_val);
      } else if (hour_min < 9200 && hour_min >= 9100) {
        quality_val = 0.2;
        quality.push(quality_val);
      } else if (hour_min < 9100 && hour_min >= 7000) {
        quality_val = 0;
        quality.push(quality_val);
      } else if (hour_min < 7000) {
        quality_val = 999;
        quality.push(quality_val);
      }
      console.log("Time:" + m + " / quality_val :", quality_val);
    }
    console.log("the qualityis :", quality);
  } catch (error) {
    console.error("Error fetching data from CouchDB:", error);
  }
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
}

getDayReportData();

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
