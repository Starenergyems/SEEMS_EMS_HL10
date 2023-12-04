const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Schema = require("./models/lc_schema");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結mongoDB....");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// 創建一個Mongoose模型
const LC = require("/Test/SEEMS_EMS/models/lc_schema");
//const DataModel = mongoose.model("Data", Schema, "account");

//設定路由
app.get("/operateinfo/mainmerter", async (req, res) => {
  try {
    // 從資料庫中獲取 LC 資料
    const lcData = await LC.find(); // 假設你要獲取所有 LC 資料

    // 將資料傳遞到 EJS 模板或進行其他操作
    res.render("Op_Meter_MainMeter", { lcData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/operateinfo/mainmerter", (req, res) => {
  // num與fun
  res.render("Op_Meter_MainMeter");
});
//其他電表
app.get("/operateinfo/auxmerters", (req, res) => {
  // num與fun
  res.render("Op_Meter_AuxMeter");
});
