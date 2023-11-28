const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Schema = require("./models/lc_schema");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結mongoDB....");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// 創建一個Mongoose模型
const DataModel = mongoose.model("Data", Schema, "account");

//設定路由

app.get("/login", (req, res) => {
  // 不傳遞任何變數
  res.render("Login"); //渲染 Login.ejs
});

app.get("/logout", (req, res) => {
  // 不傳遞任何變數
  res.render("Login");
});

app.get("/account", (req, res) => {
  // 不傳遞任何變數
  res.render("Login");
});

app.get("/account/personal", (req, res) => {
  // 不傳遞任何變數
  res.render("Login");
});

app.get("/account/manage", (req, res) => {
  // 不傳遞任何變數
  res.render("Login");
});

//系統模式控制頁面切換
app.get("/sysctrl", (req, res) => {
  res.render("Mode_SysCtrl");
});

app.get("/schedule", (req, res) => {
  res.render("Mode_SysCtrl");
});

//運轉資訊
app.get("/operateinfo", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
//單線圖
app.get("/operateinfo/linediagram", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
//主電表
app.get("/operateinfo/mainmerter", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
//其他電表
app.get("/operateinfo/merters", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
//pcs主頁
app.get("/operateinfo/pcs", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
//單台pcs狀態
app.get("/operateinfo/pcs/state", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
//單台pcs警告
app.get("/operateinfo/pcs/alarm", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
//電池
app.get("/operateinfo/battery", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
//單台電池狀態
app.get("/operateinfo/battery/state", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
//單台RACK
app.get("/operateinfo/battery/rack", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});

//系統資訊
app.get("/systeminfo", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});

app.get("/systeminfo/communication", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});

app.get("/systeminfo/devicestate", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});

app.get("/systeminfo/environment", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});

//告警紀錄
app.get("/alarm/realtime", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});

app.get("/alarm/history", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});

//事件紀錄
app.get("/event", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});

app.get("/event/operation", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});
Operation;

app.get("/event/door", (req, res) => {
  // 不傳遞任何變數
  res.render("");
});

//報表
app.get("/report", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

//圖表
app.get("/chrat", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

app.get("/chrat/real", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

app.get("/chrat/history", (req, res) => {
  // 不傳遞任何變數
  res.render(""); // 假設有一個名為 example.ejs 的模板文件
});

app.listen(port, () => {
  console.log("伺服器正在聆聽 port " + port + "...");
});
