const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const User = require("../models/userschema");
const router = express.Router();
const app = express();

// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是account，當前數據庫名稱：", currentDBName);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const collections = mongoose.connection.collections;

// 轉換為 collection 名稱的數組
const collectionNames = Object.keys(collections);

console.log("當前連接中的 collection 名稱：", collectionNames);

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);

router.get("/personalinfo", (req, res) => {
  // num與fun
  res.render("PersonalInfo");
});

router.get("/accountmanage", (req, res) => {
  // num與fun
  res.render("AccountManage");
});

module.exports = router;
