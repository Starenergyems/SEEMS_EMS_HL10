const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Other1 = require("../models/otherrf1schema");
const router = express.Router();
const app = express();
const { scaleProcess } = require("./function");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);

router.get("/operateinfo", (req, res) => {
  // num與fun
  res.render("Op_Meter_SLD");
});

router.get("/operateinfo/singlelinediagram", (req, res) => {
  // num與fun
  res.render("Op_Meter_SLD");
});

router.get("/operateinfo/mainmeter", async (req, res) => {
  try {
    // 獲取當前連接的所有 collection 名稱
    const collections = mongoose.connection.collections;

    // 轉換為 collection 名稱的數組
    const collectionNames = Object.keys(collections);

    console.log("當前連接中的 collection 名稱：", collectionNames);

    // 從數據庫中查詢 Other1 資料
    const other1Data = await Other1.findOne().sort({ time_log: -1 });

    // 檢查是否有找到數據
    if (!other1Data) {
      throw new Error("No data found");
    }

    // 定義屬性和相應的比例和小數點位數
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
      // 可以根據需要繼續添加其他屬性
    };

    const data = {};

    Object.entries(scaleAndPointMapping).forEach(
      ([property, { scale, point }]) => {
        const originalValue = other1Data.Freq[property];
        const scaledValue = scaleProcess(originalValue, scale, point);
        data[property] = scaledValue;
      }
    );

    // 將數據傳遞給 EJS 模板，包括所有變數
    res.render("../views/Op_Meter_MainMeter", {
      volt_ab: data["408001"],
      volt_bc: data["408003"],
      volt_ca: data["408005"],
      volt_avg: data["408007"],
      curr_a: data["408009"],
      curr_b: data["408011"],
      curr_c: data["408013"],
      curr_n: data["408015"],
      curr_avg: data["408017"],
      activePower: data["408019"],
      reactivePower: data["408021"],
      apparentPower: data["408023"],
      powerFactor: data["408025"],
      Freq: data["408026"],
      kwh_imp: data["408028"],
      kwh_exp: data["408030"],
      kvarh_imp: data["408032"],
      kvarh_exp: data["408034"],
      other1Data, // 確保 other1Data 也被傳遞
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// 將數據傳遞給 EJS 模板，使用展開運算符
// 注意：這段程式碼不能放在這裡，因為它不在任何區塊中
// res.render("Op_Meter_MainMeter", { ...data, other1Data });
// 將這段程式碼放在 try-catch 區塊中

//其他電表
router.get("/operateinfo/auxmeter", (req, res) => {
  // num與fun
  res.render("Op_Meter_AuxMeter");
});

module.exports = router;
