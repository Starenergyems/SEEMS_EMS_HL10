//const port = 3005;
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const router = express.Router();
const app = express();
const cors = require("cors");

//const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
//const nanoDb = nano(couchDBUrl);

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

// const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);
const createNanoInstance = (dbName) => nano.db.use(dbName);
router.get("/systeminfo/device", (req, res) => {
  //以下app要改回router
  res.render("Sys_Device", NavbarData);
});

router.get("/systeminfo/device/edit", (req, res) => {
  // 定義Mango查詢，找到包含'time'屬性的文檔，並按照'time'降序排序
  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
  };

  const dcDb = createNanoInstance("dc_rf10");
  // 使用logDb對CouchDB執行Mango查詢
  dcDb.find(mangoQuery, (err, body) => {
    if (err) {
      // 如果發生錯誤，印出錯誤信息並回應500 Internal Server Error
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const db_array = [];
    // 遍歷查詢結果的每一個文檔
    for (const item of body.docs) {
      // 刪除文檔中的'_rev'
      ["_rev"].forEach((key) => {
        delete item[key];
      });

      item["index"] = "";
      db_array.push(item);
    }
    console.log(db_array);
    // 將處理過的文檔陣列回應給前端
    res.send(db_array);
  });
});

module.exports = router;
// app.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });
