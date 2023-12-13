const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const Lc = require("../models/lcschema");
const router = express.Router();
const app = express();

// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是電池，當前數據庫名稱：", currentDBName);
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

router.get("/operateinfo/battery", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoSummary");
});

//多台電池狀態
router.get("/operateinfo/battery/infodetail/1", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

//多台RACK
router.get("/operateinfo/battery/rack/1", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

module.exports = router;
