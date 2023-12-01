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
const DataModel = mongoose.model("Data", Schema, "account");
//設定路由

app.get("/login", (req, res) => {
  // 不傳遞任何變數
  res.render("Login"); // 假設有一個名為 example.ejs 的模板文件
});

//系統模式控制頁面切換
app.get("/SysCtrl", (req, res) => {
  res.render("Mode_SysCtrl"); // 這裡的 'Mode_SysCtrl' 是你的 EJS 文件名稱
});

//運轉資訊
app.get("/Operateinfo", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

//系統資訊
app.get("/Systeminfo", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

//告警紀錄
app.get("/Alarm", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

//事件紀錄
app.get("/Event", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

//報表
app.get("/Report", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

//圖表
app.get("/Chrat", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

app.listen(port, () => {
  console.log("伺服器正在聆聽 port " + port + "...");
});
