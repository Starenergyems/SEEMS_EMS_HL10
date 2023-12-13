const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const Lc = require("../models/lcschema");
//const Other1 = require("../models/lc_schema"); 還會引用?
const router = express.Router();
const app = express();

// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是圖表，當前數據庫名稱：", currentDBName);
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

// 創建一個Mongoose模型
//const DataModel = mongoose.model("Data", Schema, "account");
router.get("/chrat", (req, res) => {
  // num與fun
  res.render("Fig_Real_Time");
});

router.get("/chrat/real", (req, res) => {
  // num與fun
  res.render("Fig_Real_Time");
});

router.get("/chrat/history", (req, res) => {
  // num與fun
  res.render("Fig_Historic");
});

module.exports = router;
