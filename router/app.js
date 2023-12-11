// app.js

const express = require("express");
const app = express();

// 引入多個路由檔案
const router1 = require("./function"); //fun
const router2 = require("./middleware"); //處理驗證

//畫面路由
const router3 = require("./rAccount"); //帳號
const router4 = require("./rMode"); //模式
const router5 = require("./rMeter"); //運轉-電表 V
const router6 = require("./rPCS"); //運轉-PCS V
const router7 = require("./rBMS"); //運轉-BMS V
const router8 = require("./rComm"); //系統-通訊架構
const router9 = require("./rDevice"); //系統-設備狀態
const router10 = require("./rEnvironment"); //系統-環境監控
const router11 = require("./rAlarm"); //告警
const router12 = require("./rEvent"); //事件
const router13 = require("./rReport"); //報表
const router14 = require("./rChart"); //圖表

// 使用這些路由
app.use(router1);
app.use(router2);
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

app.get("error", (req, res) => {
  // num與fun
  res.render("error");
});

// 監聽指定的端口
const port = 3000;
app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});
