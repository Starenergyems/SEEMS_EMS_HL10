// testforalarm.js
const express = require("express");
const router = express.Router();
//const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");
const socket = require("socket.io");
const http = require("http");
const { error_result_gen, LC_error_table } = require("./function");
const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");

const lc1_rf01 = "lc1_rf01";
const lc1nanoDb = nano.use(lc1_rf01);
const lc2_rf01 = "lc2_rf01";
const lc2nanoDb = nano.use(lc2_rf01);
const lc3_rf01 = "lc3_rf01";
const lc3nanoDb = nano.use(lc3_rf01);
const lc4_rf01 = "lc4_rf01";
const lc4nanoDb = nano.use(lc4_rf01);
//************************************************************* */
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
router.use(cors());
//************************************************************* */
// 創建 http 伺服器
// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("okay");
// });

// 使用 WebSocket 連接伺服器
//const io = socket(server);

// 在資料庫連線時建立 changeStream
// mongoose.connection.once("open", () => {
//   const lc01ChangeStream = Lc01.watch();
//   const lc02ChangeStream = Lc02.watch();
//   const lc03ChangeStream = Lc03.watch();
//   const lc04ChangeStream = Lc04.watch();
//   const dcChangeStream = Dc.watch();
//   const gcChangeStream = Gc.watch();

//   // 監聽 change event
//   lc01ChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "lc01Table" });
//   });

//   lc02ChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "lc02Table" });
//   });

//   lc03ChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "lc03Table" });
//   });

//   lc04ChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "lc04Table" });
//   });

//   dcChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "dcTable" });
//   });

//   gcChangeStream.on("change", (change) => {
//     io.emit("refreshData", { tableId: "gcTable" });
//   });
// });

// Socket.io 事件監聽
// io.on("connection", (socket) => {
//   console.log("alarmFun : A user connected");

//   // 斷開連接
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });
//************************************************************* */
router.use(async (req, res, next) => {
  try {
    const indexDef = {
      index: { fields: ["time"] },
      name: "time_index",
    };

    await lc1nanoDb.createIndex(indexDef);
    await lc2nanoDb.createIndex(indexDef);
    await lc3nanoDb.createIndex(indexDef);
    await lc4nanoDb.createIndex(indexDef);

    const mangoQuery = {
      selector: {
        time: { $exists: true },
      },
      sort: [{ time: "desc" }],
      limit: 1,
    };

    lc1nanoDb.find(mangoQuery, async (err, body) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const Data = body.docs[0]; // 取得數據的第一個元素
      console.log("AA----------------------------------------------AA");
      console.log(Data);

      const data = {};

      Object.entries(scaleAndPointMapping).forEach(
        ([property, { scale, point }]) => {
          const originalValue = Data.Freq[property];
          const scaledValue = scaleProcess(originalValue, scale, point);
          data[property] = scaledValue;
          console.log("屬性", property);
          console.log("原始數值", originalValue);
          console.log("轉換後數值", scaledValue);
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
  next(); // 繼續執行後續的中間件或路由處理
});

// router.use(async (req, res, next) => {
//   try {
//     // 中間件的內容

//     // 假設你已經處理了數據並將結果存儲在 data 中
//     res.json({ success: true, data }); // 將數據以 JSON 格式發送到客戶端
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// });

//************************************************************* */
// async function getAllData() {
//   try {
//     // 使用 find 方法來取得整個 Lc01 Collection 的數據
//     const allData = await lc01Data.find({});
//     console.log("All Lc01 Collection Data:", allData);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }
// // 呼叫函數以取得整個 Collection 的數據
// getAllData();

//************************************************************* */
// async function getSpecificDocumentById(documentId) {
//   try {
//     // 使用 findById 方法來取得"指定"文檔的數據
//     const specificDocument = await lc01Data.findById(documentId);
//     console.log("Specific Lc01 Document Data:", specificDocument);
//   } catch (error) {
//     console.error("Error fetching specific document:", error);
//   }
// }

// // 呼叫函數以取得指定文檔的數據，替換 'yourDocumentId' 為實際的文檔 ID
// getSpecificDocumentById("yourDocumentId");

//************************************************************* */
//取得最新的一筆數據，並且只擷取 PCS1 中的 403001 欄位
// async function getLatestData() {
//   try {
//     // 使用 findOne 方法來取得"最新的" Lc01 文檔
//     const latestData = await lc01Data.findOne(
//       {},
//       {},
//       { sort: { time_log: -1 } }
//     );

//     // 檢查是否有找到文檔
//     if (latestData) {
//       // 取出指定的欄位，可選的鏈接運算符 ? 在取得值之前檢查 PCS1 是否存在
//       const pcs1Value = latestData.PCS1?.["403001"];

//       // 輸出結果
//       console.log("Latest Data - PCS1 403001:", pcs1Value);
//     } else {
//       console.log("No data found");
//     }
//   } catch (error) {
//     console.error("Error fetching latest data:", error);
//   }
// }

// 呼叫函數以取得最新的文檔中的指定欄位
//getLatestData();

//************************************************************* */
// async function processData(data, latestAlarmData, Alarm, error_table) {
//   // 創建一個 Set 來存儲已經存在於 Alarm 中的文檔的 _id
//   //console.log("A New data in Data:", data);
//   //console.log("B New data in Data:", latestAlarmData);
//   const existingIds = new Set(
//     latestAlarmData.map((item) => item._id.toString())
//   );

//   // 遍歷 data，將不在 Alarm 中的文檔加入 Alarm，或更新已存在的文檔
//   for (const item of data) {
//     //console.log('here')
//     //console.log(item)

//     const idString = item._id.toString();
//     const existingDoc = latestAlarmData.find(
//       (doc) => doc._id.toString() === idString
//     );

//     console.log(error_result_gen(item, error_table));

//     if (!existingDoc) {
//       // 如果 Alarm 中沒有該文檔，則新增
//       if (item.value > 50000) {
//         await Alarm.create({
//           _id: item._id,
//           value: item.value,
//           timestamp: item.timestamp,
//         });

//         // 添加 console.log 语句以输出 lc01Data 中的数值
//         //console.log("New data in Data:", item.value);
//       }
//     } else {
//       // 如果 Alarm 中已經存在該文檔，則更新數值或刪除
//       if (item.value > 50000) {
//         // 更新數值
//         if (existingDoc.value !== item.value) {
//           await Alarm.findByIdAndUpdate(existingDoc._id, {
//             value: item.value,
//             timestamp: item.timestamp,
//           });

//           // 添加 console.log 语句以输出 lc01Data 中的数值
//           //console.log("Updated data in lc01Data:", item.value);
//         }
//       } else {
//         // 小於等於 50000 則刪除
//         await Alarm.findByIdAndDelete(existingDoc._id);

//         // 添加 console.log 语句以输出 lc01Data 中的数值
//         //console.log("Deleted data in lc01Data:", item.value);
//       }
//     }
//     existingIds.add(idString);
//   }
// }

router.get("/testforalarm", (req, res) => {
  // 在這裡定義渲染 middleware 頁面的邏輯
  res.render("testforalarm");
});

// 修改為：
module.exports = router;
