const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Lc01 = require("../models/lcschema");
const app = express(); // Create an Express application instance
const router = express.Router();
const {
  scaleProcess,
  mapchargeStatus,
  mapPCSWorkingStatus,
} = require("./function");

//set
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);

// 創建一個Mongoose模型
//const DataModel = mongoose.model("Data", Schema, "account");

//pcs主頁
router.get("/operateinfo/pcs", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

//多台pcs狀態 更改數字即可
router.get("/operateinfo/pcs/InfoDetail/1", async (req, res) => {
  try {
    // 獲取當前連接的所有 collection 名稱
    const collections = mongoose.connection.collections;

    // 轉換為 collection 名稱的數組
    const collectionNames = Object.keys(collections);

    console.log("當前連接中的 collection 名稱：", collectionNames);

    // 從數據庫中查詢 Other1 資料
    const lcData = await Lc01.findOne().sort({ time_log: -1 });

    // 檢查是否有找到數據
    if (!lcData) {
      throw new Error("No data found");
    }

    // 定義屬性和相應的比例和小數點位數
    const scaleAndPointMapping = {
      403001: { scale: 0.1, point: 1 },
      403002: { scale: 0.1, point: 1 },
      403004: { scale: 0.1, point: 2 },
      403006: { scale: 0.1, point: 2 },
      403007: { scale: 0, point: 0 },
      403009: { scale: 0, point: 0 },
    };

    // 定義處理函數映射表
    const processFunctions = {
      403007: mapchargeStatus,
      403009: mapPCSWorkingStatus,
    };
    const data = {};
    //scaleProcess 是一個通用的轉換函數，可以應用在所有的屬性上，而 processFunctions 主要用於那些需要特殊處理的屬性。

    Object.entries(scaleAndPointMapping).forEach(
      ([property, { scale, point }]) => {
        const originalValue = lcData.PCS1[property];
        const scaledValue = scaleProcess(originalValue, scale, point);

        // 如果有定義對應的處理函數，則應用
        const processFunction = processFunctions[property];
        const processedValue = processFunction
          ? processFunction(scaledValue)
          : scaledValue;

        data[property] = processedValue;
      }
    );

    // 將數據傳遞給 EJS 模板，包括所有變數
    res.render("../views/test_meter", {
      overallFault: data["403001"],
      overallAlarm: data["403002"],
      Transformernodestatus: data["403004"], //暫無出現 先用描述暫代
      Transformeroiltemperature: data["403006"], //暫無出現 先用描述暫代
      HB_Counts: data["403007"],
      leakage: data["403009"],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//多台pcs警告
// router.get("/operateinfo/pcs/alarm/1", async (req, res) => {
// });

module.exports = router;
