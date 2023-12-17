// app.js
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const router = express.Router();
const app = express();
const cors = require("cors");

app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結mongoDB....");

    // 檢查當前數據庫名稱
    const currentDBName = mongoose.connection.name;
    console.log("目前連線資料庫名稱：", currentDBName);
  })
  .catch((e) => {
    console.log(e);
  });

// 引入多個路由檔案
//const router1 = require("./function"); //fun
//const router2 = require("./middleware"); //處理驗證

//畫面路由
const router3 = require("./rAccount"); //帳號
const router4 = require("./rMode"); //模式
const router5 = require("./rMeter"); //運轉-電表 V
const router6 = require("./rPCS"); //運轉-PCS V
const router7 = require("./rBattery"); //運轉-BMS V
const router8 = require("./rComm"); //系統-通訊架構
const router9 = require("./rDevice"); //系統-設備狀態
const router10 = require("./rEnvironment"); //系統-環境監控
const router11 = require("./rAlarm"); //告警
const router12 = require("./rEvent"); //事件
const router13 = require("./rReport"); //報表
const router14 = require("./rChart"); //圖表

// 使用這些路由
//app.use(router1);
//app.use(router2);
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

//
app.get("/", (req, res) => {
  // num與fun
  res.render("Login"); //渲染 Login.ejs
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

app.get("/login", (req, res) => {
  // num與fun
  res.render("Login"); //渲染 Login.ejs
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

app.get("/error", (req, res) => {
  // num與fun
  res.render("error");
});

// 監聽指定的端口
app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});
