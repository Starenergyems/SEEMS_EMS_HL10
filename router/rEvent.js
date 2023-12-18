const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const cors = require("cors");
//const Dc = require("../models/dc_schema");  再建立一個所有使用者的/且定義門禁的
const router = express.Router();
const app = express();

// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是事件，當前數據庫名稱：", currentDBName);
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

//事件紀錄
router.get("/event", (req, res) => {
  // num與fun
  res.render("Evt_Operation");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/event/operation", (req, res) => {
  // num與fun
  res.render("Evt_Operation");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

router.get("/event/door", (req, res) => {
  // num與fun
  res.render("Evt_Door");
});

module.exports = router;
