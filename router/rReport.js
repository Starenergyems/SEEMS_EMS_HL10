const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
//const Dc = require("../models/dc_schema");  再建立一個所有使用者的/且定義門禁的
const router = express.Router();
const app = express();
const cors = require("cors");

const xlsx = require('xlsx-populate');
const fs = require('fs');
const cron = require('node-cron');//指定幾點做什麼
const axios = require('axios');//在server執行get

// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是報表，當前數據庫名稱：", currentDBName);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
//app.use(myMiddleware);

//報表
router.get("/report", (req, res) => {
  // num與fun
  res.render("Rpt_Report");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/report/report", (req, res) => {
  // num與fun
  res.render("Rpt_Report");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */
//const templatePath = path.join(__dirname, '..', 'public/report', 'Report.xlsx');//模板的位置
const DayTemPath = path.join(__dirname, '..', 'public/report', 'DayReport.xlsx');
const MonthTemPath = path.join(__dirname, '..', 'public/report', 'MonthReport.xlsx');
const YearTemPath = path.join(__dirname, '..', 'public/report', 'YearReport.xlsx');

router.get('/report/download-excel', async (req, res) => { //定期撈資料供下載存至地端or檔案不存在就自己撈資料
  try {
    const { templatePath } = req.query; //url要帶參數

    if (!templatePath) {
      return res.status(400).send('Missing templatePath parameter');
    }

    const workbook = await xlsx.fromFileAsync(templatePath);

    // Fetch data from MongoDB (replace with your MongoDB logic)
    const mongoData = await fetchDataFromMongoDB();

    // Update the Excel file with MongoDB data
    updateExcelWithMongoData(workbook, mongoData);

    // Save the modified workbook to a temporary file
    const tempFilePath = path.join(__dirname, 'temp.xlsx');
    await workbook.toFileAsync(tempFilePath);

    // Set up response headers for Excel file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment;');

    // Read the temporary file as a stream and pipe it to the response
    const fileStream = fs.createReadStream(tempFilePath);
    fileStream.pipe(res);

    // Remove the temporary file after sending the response
    fileStream.on('end', () => {
      fs.unlinkSync(tempFilePath);
    });

  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).send('Internal Server Error');
  }
});


// 計算服務品質指標
async function fetchDataFromMongoDB() {
  //讀取DB資料+計算執行率+換算服務品質指標
  return [ //回傳執行率 年報1個月1筆 共12筆
     [611, 222, 33, 44, 55, 366,177],
     [711, 22, 33, 44, 55, 266,277],
     [911, 22, 33, 44, 55, 166,177],
     [600, 20, 30, 40, 50, 20,100],
     [511, 222, 33, 44, 55, 266,277],
     [811, 222, 33, 44, 55, 166,177],
     [911, 22, 33, 44, 55, 66,177],
     [800, 200, 30, 40, 50, 60,300],
     [711, 222, 33, 44, 55, 66,177],
     [711, 22, 33, 44, 55, 66,177],
     [711, 222, 33, 44, 55, 26,177],
     [800, 20, 30, 40, 50, 20,100]
  ];
}

// Update Excel file with MongoDB data
function updateExcelWithMongoData(workbook, mongoData) {
  // Get the first sheet (modify as needed)
  const sheet = workbook.sheet(0);//第一個分頁

  // Example: Write MongoDB data starting from cell A2
  mongoData.forEach((data, index) => {
    for (let i = 0; i < 7; i++) { // Loop through columns D to J (7 columns)
      sheet.cell(String.fromCharCode(68 + i) + (index + 6)).value(data[i]);   
    }
  });
}

router.get('/report/getFile', (req, res) => { //點擊尋找已存好的檔案
  const folderPath = path.join('C:', 'EMS', 'Report'); //要去哪找檔案
  const fileName = req.query.fileName;//要找哪個檔案

  const filePath = path.join(folderPath, fileName);
  console.log('後端收到get');
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    console.log('後端開始尋找檔案');
    if (err) {
      res.status(404).json({ status: 'error', message: `${fileName} does not exist in ${folderPath}`});
    } else {
      // If the file exists, read and send its content
      fs.readFile(filePath, (readErr, data) => {
        if (readErr) {
          res.status(500).json({ status: 'error', message: `Error reading ${fileName}: ${readErr}`});
        } else {
          res.send(data);
        }
      });
    }
  });
});



async function downloadExcelServer() { //每日每月每年自動儲存報表
  try {
    console.log('開始自動下載');
    const response = await axios.get('http://localhost:3000/report/download-excel?templatePath=../public/report/Report.xlsx', { responseType: 'arraybuffer' });//選擇template撈資料更新excel

    // Specify the full absolute path for saving the file
    const directoryPath = path.join('C:', 'EMS', 'Report');//下載後存在哪，要跟getReport同步
    const filePath = path.join(directoryPath, '2023年08月執行率統計表.xlsx');//檔名叫什麼

    // Check if the directory exists, create it if not
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Save the file to the specified path
    fs.writeFileSync(filePath, Buffer.from(response.data));

    console.log('Download complete. File saved at:', filePath);
  } catch (error) {
    console.error('Error downloading Excel file:', error.message);
  }
}



cron.schedule('45 17 4 * *', async () => { // 秒 分 時 日 月 星期幾 由右到左對照，每個月1號1:00執行
  try {
    console.log("Cron job: download start");
    downloadExcelServer();
    console.log("Cron job: done");
  } catch (error) {
    console.error('Cron job: Error generating Excel file:', error);
  }
});


module.exports = router;
