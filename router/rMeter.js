const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const Other1 = require("../models/otherrf1_schema");

mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結mongoDB....");

    // 檢查當前數據庫名稱
    const currentDBName = mongoose.connection.name;
    console.log("當前數據庫名稱：", currentDBName);
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));

app.get("/operateinfo/mainmerter", async (req, res) => {
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

    const properties = [
      "408001",
      "408003",
      "408005",
      "408007",
      "408009",
      "408011",
      "408013",
      "408015",
      "408017",
      "408019",
      "408021",
      "408023",
      "408026",
      "408028",
      "408030",
      "408032",
      "408034",
    ];

    const data = {};

    properties.forEach((property) => {
      data[property] = other1Data.Freq[property];
    });

    const {
      408001: volt_ab,
      408003: volt_bc,
      408005: volt_ca,
      408007: volt_avg,
      408009: curr_a,
      408011: curr_b,
      408013: curr_c,
      408015: curr_n,
      408017: curr_avg,
      408019: activePower,
      408021: reactivePower,
      408023: powerFactor,
      408026: Freq,
      408028: kwh_imp,
      408030: kwh_exp,
      408032: kvarh_imp,
      408034: kvarh_exp,
    } = data;

    // 將數據傳遞給 EJS 模板，包括所有變數
    res.render("Op_Meter_MainMeter", {
      volt_ab,
      volt_bc,
      volt_ca,
      volt_avg,
      curr_a,
      curr_b,
      curr_c,
      curr_n,
      curr_avg,
      activePower,
      reactivePower,
      powerFactor,
      Freq,
      kwh_imp,
      kwh_exp,
      kvarh_imp,
      kvarh_exp,
      other1Data, // 確保 other1Data 也被傳遞
    });
    // 將數據傳遞給 EJS 模板，包括所有變數
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
app.get("/operateinfo/auxmerters", (req, res) => {
  // num與fun
  res.render("Op_Meter_AuxMeter");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
