const port = 3001;

// testforalarm.js
const express = require("express");
const path = require("path");
const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
//const { nano } = require("./app");
// const other_rf01 = "other_rf01";
// const nanoDb = nano.use(other_rf01); // 請注意這裡使用 nano.use() 來設定數據庫
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");
const {
  LC_error_result_gen,
  LC_error_table,
  DC_error_result_gen,
  DC_error_table,
  Other_error_result_gen,
  Other_error_table,
} = require("./alarmFunctions");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

app.use(cors());

//************************************************************* */
const lc1nanoDb = nano.use("lc1_rf10");
const lc2nanoDb = nano.use("lc2_rf10");
const lc3nanoDb = nano.use("lc3_rf10");
const lc4nanoDb = nano.use("lc4_rf10");
const dcnanoDb = nano.use("dc_rf10");
const gcnanoDb = nano.use("gc_rf10"); //新增
const otherrf01nanoDb = nano.use("other_rf01");
const otherrf10nanoDb = nano.use("other_rf10");

const indexDef = {
  index: { fields: ["time"] },
  name: "time_index",
};

lc1nanoDb.createIndex(indexDef);
lc2nanoDb.createIndex(indexDef);
lc3nanoDb.createIndex(indexDef);
lc4nanoDb.createIndex(indexDef);
dcnanoDb.createIndex(indexDef);
gcnanoDb.createIndex(indexDef); //新增
//otherrf01nanoDb.createIndex(indexDef);
otherrf10nanoDb.createIndex(indexDef);

const mangoQuery = {
  selector: {
    time: { $exists: true },
  },
  sort: [{ time: "desc" }],
  limit: 1,
};
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
app.get("/alarm", (req, res) => {
  // num與fun
  try {
    //目前查詢且輸出的是lc1nanoD內的資料
    // lc1nanoDb.find(mangoQuery, async (err, body) => {
    //   if (err) {
    //     console.error("Error:", err);
    //     res.status(500).send("Internal Server Error");
    //     return;
    //   }
    //   // console.dir(body)
    //   // const doc = body.docs[0]; // 取得數據的第一個元素
    //   for (const item of body.docs) {
    //     // console.log(item);
    //     console.log(LC_error_result_gen(item, LC_error_table, "lc1_rf10"));
    //   }
    // });

    dcnanoDb.find(mangoQuery, async (err, body) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      // console.dir(body)
      // const doc = body.docs[0]; // 取得數據的第一個元素
      for (const item of body.docs) {
        // console.log(item);
        console.log(DC_error_result_gen(item, DC_error_table, "dc_rf10"));
      }
    });

    // otherrf10nanoDb.find(mangoQuery, async (err, body) => {
    //   if (err) {
    //     console.error("Error:", err);
    //     res.status(500).send("Internal Server Error");
    //     return;
    //   }
    //   // console.dir(body)
    //   // const doc = body.docs[0]; // 取得數據的第一個元素
    //   for (const item of body.docs) {
    //     // console.log(item);
    //     console.log(
    //       Other_error_result_gen(item, Other_error_table, "other_rf10")
    //     );
    //   }
    // });
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

app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});
