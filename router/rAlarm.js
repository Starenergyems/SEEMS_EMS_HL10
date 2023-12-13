const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const Alarm = require("../models/alarmschema");
const router = express.Router();
const app = express();

// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是alarm，當前數據庫名稱：", currentDBName);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);

//告警紀錄
router.get("/alarm", (req, res) => {
  // num與fun
  res.render("Alm_RealTime");
});

router.get("/alarm/realtime", (req, res) => {
  // num與fun
  res.render("Alm_RealTime");
});

router.get("/alarm/history", (req, res) => {
  // num與fun
  res.render("Alm_History");
});

module.exports = router;
