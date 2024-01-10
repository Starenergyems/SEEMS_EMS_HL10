// testforalarm.js
const express = require("express");
const path = require("path");
const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
//const { nano } = require("./app");
// const other_rf01 = "other_rf01";
// const nanoDb = nano.use(other_rf01); // 請注意這裡使用 nano.use() 來設定數據庫
const { scaleProcess } = require("./function");
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

app.use(cors());

//************************************************************* */
const lc1_rf10 = "lc1_rf10";
const lc1nanoDb = nano.use(lc1_rf10);
const lc2_rf10 = "lc2_rf10";
const lc2nanoDb = nano.use(lc2_rf10);
const lc3_rf10 = "lc3_rf10";
const lc3nanoDb = nano.use(lc3_rf10);
const lc4_rf10 = "lc4_rf10";
const lc4nanoDb = nano.use(lc4_rf10);
const dc_rf10 = "dc_rf10";
const dcnanoDb = nano.use(dc_rf10);
const other_rf01 = "other_rf01";
const otherrf01nanoDb = nano.use(other_rf01);
const other_rf10 = "other_rf10";
const otherrf10nanoDb = nano.use(other_rf10);
//************************************************************* */

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));

//告警紀錄
router.get("/alarm", (req, res) => {
  // num與fun
  try {
    const indexDef = {
      index: { fields: ["time"] },
      name: "time_index",
    };
    lc1nanoDb.createIndex(indexDef);
    lc2nanoDb.createIndex(indexDef);
    lc3nanoDb.createIndex(indexDef);
    lc4nanoDb.createIndex(indexDef);
    dcnanoDb.createIndex(indexDef);
    otherrf01nanoDb.createIndex(indexDef);
    otherrf10nanoDb.createIndex(indexDef);

    const mangoQuery = {
      selector: {
        time: { $exists: true },
      },
      sort: [{ time: "desc" }],
      limit: 1,
    };

    //目前查詢且輸出的是lc1nanoD內的資料
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

      // Object.entries(scaleAndPointMapping).forEach(
      //   ([property, { scale, point }]) => {
      //     const originalValue = Data.Freq[property];
      //     const scaledValue = scaleProcess(originalValue, scale, point);
      //     data[property] = scaledValue;
      //     console.log("屬性", property);
      //     console.log("原始數值", originalValue);
      //     console.log("轉換後數值", scaledValue);
      //   }
      // );
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }

  res.render("Alm_RealTime");
});

// router.get("/alarm/re", async (req, res) => {
//   try {
//     // 從資料庫中獲取資料
//     const sourceData = await SourceData.find();
//     // 處理資料，這裡假設有一個處理函式 processData
//     const processedData = processData(sourceData);
//     // 將處理完的資料儲存到新的collection中
//     await ProcessedData.create(processedData);
//     // 回傳處理完的資料給前端
//     res.json(processedData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

router.get("/alarm/realtime", (req, res) => {
  // num與fun
  res.render("Alm_RealTime");
});

router.get("/alarm/history", (req, res) => {
  // num與fun
  res.render("Alm_History");
});

module.exports = router;
