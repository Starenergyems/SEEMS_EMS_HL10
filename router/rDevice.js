const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
//const Dc = require("../models/dc_schema"); ????
const router = express.Router();

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

//set
router.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
router.set("views", path.join(__dirname, "../views"));
//use
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
router.use("/public", express.static(path.join(__dirname, "../public")));
//router.use(myMiddleware);

router.get("/systeminfo/device", (req, res) => {
  // num與fun
  res.render("Sys_Device");
});

module.exports = router;
