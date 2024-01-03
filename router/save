const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Other1 = require("../models/otherrf1schema");
const router = express.Router();
const app = express();
const { scaleProcess, add, count } = require("./function");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));

router.get("/operateinfo/mainmerter", async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    const collectionNames = Object.keys(collections);
    //console.log("當前連接中的 collection 名稱：", collectionNames);

    const other1Data = await Other1.findOne().sort({ time_log: -1 });

    if (!other1Data) {
      throw new Error("No data found");
    }

    const scaleAndPointMapping = {
      408001: { scale: 0.1, point: 1 },
      408003: { scale: 0.1, point: 1 },
      408005: { scale: 0.1, point: 1 },
      408007: { scale: 0.1, point: 2 },
      408009: { scale: 0.1, point: 2 },
      408011: { scale: 0.1, point: 2 },
      408013: { scale: 0.1, point: 2 },
      408015: { scale: 0.1, point: 2 },
      408017: { scale: 0.1, point: 2 },
      408019: { scale: 0.1, point: 2 },
      408021: { scale: 0.1, point: 2 },
      408023: { scale: 0.1, point: 2 },
      408025: { scale: 0.1, point: 2 },
      408026: { scale: 0.1, point: 2 },
      408028: { scale: 0.1, point: 2 },
      408030: { scale: 0.1, point: 2 },
      408032: { scale: 0.1, point: 2 },
      408034: { scale: 0.1, point: 2 },
    };

    // 定義處理函數映射表
    const processFunctions = {
      408003: add,
      408005: count,
      408007: (value) => count(add(value)), // 兩個函數組合
      408009: (value) => merge(count(add(value))), // 三個函數組合
    };

    const data = {};
    //scaleProcess 是一個通用的轉換函數，可以應用在所有的屬性上，而 processFunctions 主要用於那些需要特殊處理的屬性。
    Object.entries(scaleAndPointMapping).forEach(
      ([property, { scale, point }]) => {
        const originalValue = other1Data.Freq[property];
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
    res.render("../views/Op_Meter_MainMeter", {
      volt_ab: data["408001"],
      volt_bc: data["408003"],
      volt_ca: data["408005"],
      volt_avg: data["408007"],
      // ... (其他變數)
      other1Data, // 確保 other1Data 也被傳遞
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
