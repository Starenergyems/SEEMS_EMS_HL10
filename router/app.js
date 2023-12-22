// app.js
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const port = 3000;
const app = express();
require("dotenv").config();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

// MongoDB 連線
mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結 MongoDB....");
    const currentDBName = mongoose.connection.name;
    console.log("目前連線資料庫名稱：", currentDBName);
    // 在這裡進行其他與資料庫相關的初始化操作
  })
  .catch((e) => {
    console.error("連線 MongoDB 時發生錯誤：", e.message);
  });

// 引入多個路由檔案
const router3 = require("./rAccount");
const router4 = require("./rMode");
const router5 = require("./rMeter");
const router6 = require("./rPCS");
const router7 = require("./rBattery");
const router8 = require("./rCommu");
const router9 = require("./rDevice");
const router10 = require("./rEnvironment");
const router11 = require("./rAlarm");
const router12 = require("./rEvent");
const router13 = require("./rReport");
const router14 = require("./rChart");
const router = require("./test");
//const linebot = require("./rlinebot");

// 使用這些路由和 middleware
app.use(router3);
app.use(router4);
app.use(router5);
app.use(router6);
app.use(router7);
app.use(router8);
app.use(router9);
app.use(router10);
app.use(router11);
app.use(router12);
app.use(router13);
app.use(router14);
app.use(router);
//app.use(linebot);

// 額外的路由或中間件可以在這裡添加

// 終端機查看現在連線路由
app.use((req, res, next) => {
  console.log(
    `Current API URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
});

app.get("/", (req, res) => {
  res.render("Login");
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});
