const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const Lc = require("../models/lcschema");
const router = express.Router();
const app = express();
const cors = require("cors");
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
router.use("/public", express.static(path.join(__dirname, "../public")));
router.use(
  "/operateinfo",
  express.static(path.join(__dirname, "../public/operateinfo"))
);
router.use(
  "/operateinfo/battery",
  express.static(path.join(__dirname, "../public/operateinfo/pcs"))
);
router.use(
  "/operateinfo/battery/infodetail/:id",
  express.static(path.join(__dirname, "../public"))
);
// 共同的中間件，處理 /operateinfo/pcs/infodetail/1、2、3、4、5 及其子路徑下的靜態文件
router.use(
  "/operateinfo/battery/infodetail/:id",
  express.static(path.join(__dirname, "../public"))
);

router.use(cors());

router.get("/operateinfo/battery", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoSummary");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/operateinfo/battery/infodetail", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

//多台電池狀態
router.get("/operateinfo/battery/infodetail/1", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/operateinfo/battery/infodetail/2", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

router.get("/operateinfo/battery/infodetail/3", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

router.get("/operateinfo/battery/infodetail/4", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

router.get("/operateinfo/battery/infodetail/5", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

router.get("/operateinfo/battery/infodetail/6", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

router.get("/operateinfo/battery/infodetail/7", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

router.get("/operateinfo/battery/rack", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

//多台RACK
router.get("/operateinfo/battery/rack/1", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/operateinfo/battery/rack/2", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

router.get("/operateinfo/battery/rack/3", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

router.get("/operateinfo/battery/rack/4", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

router.get("/operateinfo/battery/rack/5", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

router.get("/operateinfo/battery/rack/6", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

router.get("/operateinfo/battery/rack/7", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

module.exports = router;
