const port = 3005;

const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const router = express.Router();
const app = express();
const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const couchDBUrl = "http://admin:ems45877096@couchdb:5984";
//const nanoDb = nano(couchDBUrl);

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);

// 創建 Nano 實例的函式
const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);

// 設定index
const indexDef = {
  index: { fields: ["time"] },
  name: "time_index",
};

// 事件紀錄
router.get("/event", async (req, res) => {
  //以下app要改回router
  res.redirect("/event/operation");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/event/operation", (req, res) => {
  res.render("Evt_Operation");
});

router.post("/event/operation/edit", async (req, res) => {
  try {
    const { input1, input2, input3, input4 } = req.body;
    console.log("原始Received start:", input1 + " " + input2);
    console.log("原始Received end:", input3 + " " + input4);

    // 將日期時間字符串轉換為 ISO 8601 格式
    const startTime = new Date(input1 + "T" + input2 + ".000Z");
    const endTime = new Date(input3 + "T" + input4 + ".000Z");

    console.log("轉換後的 start:", startTime.toISOString());
    console.log("轉換後的 end:", endTime.toISOString());

    const mangoQuery = {
      selector: {
        time: {
          $gte: startTime.toISOString(),
          $lte: endTime.toISOString(),
        },
      },
      sort: [{ time: "desc" }],
    };
    const logDb = createNanoInstance("log");
    await logDb.createIndex(indexDef);

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
      console.log(db_array);
      // 將處理過的文檔陣列回應給前端
      res.send(db_array);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("伺服器錯誤");
  }
});

// 處理GET /event/operation/edit的請求
router.get("/event/operation/edit", async (req, res) => {
  // 定義Mango查詢，找到包含'time'屬性的文檔，並按照'time'降序排序
  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
  };
  const logDb = createNanoInstance("log");
  const dcDb = createNanoInstance("dc_rf10");
  await logDb.createIndex(indexDef);
  await dcDb.createIndex(indexDef);

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

router.get("/event/door", (req, res) => {
  // num與fun
  res.render("Evt_Door");
});

router.post("/event/door/edit", async (req, res) => {
  try {
    const { input1, input2, input3, input4 } = req.body;
    console.log("原始Received start:", input1 + " " + input2);
    console.log("原始Received end:", input3 + " " + input4);

    // 將日期時間字符串轉換為 ISO 8601 格式
    const startTime = new Date(input1 + "T" + input2 + ".000Z");
    const endTime = new Date(input3 + "T" + input4 + ".000Z");

    console.log("轉換後的 start:", startTime.toISOString());
    console.log("轉換後的 end:", endTime.toISOString());

    const mangoQuery = {
      selector: {
        time: {
          $gte: startTime.toISOString(),
          $lte: endTime.toISOString(),
        },
      },
      sort: [{ time: "desc" }],
    };

    const logdoorDb = createNanoInstance("log_door");
    await logdoorDb.createIndex(indexDef);

    // 使用logDb對CouchDB執行Mango查詢
    logdoorDb.find(mangoQuery, (err, body) => {
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
  } catch (error) {
    console.error(error);
    res.status(500).send("伺服器錯誤");
  }
});

// 處理GET /event/operation/edit的請求
router.get("/event/door/edit", (req, res) => {
  // 定義Mango查詢，找到包含'time'屬性的文檔，並按照'time'降序排序
  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
  };

  const logdoorDb = createNanoInstance("log_door");
  // 使用logDb對CouchDB執行Mango查詢
  logdoorDb.find(mangoQuery, (err, body) => {
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

module.exports = router;

// app.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });
