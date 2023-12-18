const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const Gc = require("../models/gcschema");
const router = express.Router();
const app = express();
const cors = require("cors");
// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是模式控制，當前數據庫名稱：", currentDBName);
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
app.use(cors());
//app.use(myMiddleware);

//導向童話面作法同於METER
router.get("/mode", (req, res) => {
  res.render("Mode_SysCtrl");
});
//系統模式控制頁面切換
router.get("/mode/sysctrl", (req, res) => {
  res.render("Mode_SysCtrl");
});
//  排程
router.get("/mode/schedule", (req, res) => {
  res.render("Mode_Schedule");
});

//運轉資訊+單線圖
// router.get("/operateinfo", (req, res) => {
//   // num與fun
//   res.render("Op_Meter_SLD");
// });

module.exports = router;
