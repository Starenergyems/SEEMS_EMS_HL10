const port = 3005;
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
//const port = 3000;
const cors = require("cors");
const router = express.Router();
const app = express();
const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const couchDBUrl = "http://admin:ems45877096@192.168.8.101:5984";
const nanoDb = nano(couchDBUrl);

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);

const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);

// 事件紀錄
app.get("/event", async (req, res) => {
  res.redirect("/event/operation");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

app.get("/event/operation", (req, res) => {
  res.render("Evt_Operation");
});

app.post("/event/operation/edit", (req, res) => {
  try {
    const { input1, input2, input3, input4 } = req.body;
    console.log("Received start:", input1 + " " + input2);
    console.log("Received end:", input3 + " " + input4);

    res.status(200).send("新區間段的資料已搜索完畢"); //撈資料
  } catch (error) {
    console.error(error);
    res.status(500).send("伺服器錯誤");
  }
  //res.render("Alm_RealTime");
});
// 處理GET /event/operation/edit的請求
app.get("/event/operation/edit", (req, res) => {
  // 定義Mango查詢，找到包含'time'屬性的文檔，並按照'time'降序排序
  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
  };
  const logDb = createNanoInstance("log");
  // 使用logDb對CouchDB執行Mango查詢
  logDb.find(mangoQuery, (err, body) => {
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
    //console.log(db_array);
    // 將處理過的文檔陣列回應給前端
    res.send(db_array);
  });
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

app.get("/event/door", (req, res) => {
  // num與fun
  res.render("Evt_Door");
});

module.exports = router;

app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});
