const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Schema = require("./models/user_schema");
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
const UserModel = mongoose.model("User", Schema, "account");

//設定路由

app.get("/login", (req, res) => {
  // num與fun
  res.render("Login"); //渲染 Login.ejs
});

app.get("/account", (req, res) => {
  // num與fun
  res.render("PersonalInfo");
});

app.get("/account/personalinfo", (req, res) => {
  // num與fun
  res.render("PersonalInfo");
});

app.get("/account/manage", (req, res) => {
  // num與fun
  res.render("AccountManage");
});

//系統模式控制頁面切換
app.get("/sysctrl", (req, res) => {
  res.render("Mode_SysCtrl");
});
//  排程
app.get("/schedule", (req, res) => {
  res.render("Mode_Schedule");
});

//運轉資訊
app.get("/operateinfo", (req, res) => {
  // num與fun
  res.render("Op_Meter_SLD");
});
//單線圖
app.get("/operateinfo/linediagram", (req, res) => {
  // num與fun
  res.render("Op_Meter_SLD");
});
//主電表
app.get("/operateinfo/mainmerter", (req, res) => {
  // num與fun
  res.render("Op_Meter_MainMeter");
});
//其他電表
app.get("/operateinfo/auxmerters", (req, res) => {
  // num與fun
  res.render("Op_Meter_AuxMeter");
});
//pcs主頁
app.get("/operateinfo/pcs", (req, res) => {
  // num與fun
  res.render("Op_PCS_InfoSummary");
});

//單台pcs狀態
app.get("/operateinfo/pcs/state", (req, res) => {
  // num與fun
  res.render("Op_PCS_InfoDetail");
});
//單台pcs警告
app.get("/operateinfo/pcs/alarm", (req, res) => {
  // num與fun
  res.render("Op_PCS_Alarm");
});
//多台切換(1-7)
app.get("/operateinfo/pcs1/state", (req, res) => {
  // num與fun
  res.render("Op_PCS_InfoDetail");
});
//單台pcs警告
app.get("/operateinfo/pcs1/alarm", (req, res) => {
  // num與fun
  res.render("Op_PCS_Alarm");
});

//電池
app.get("/operateinfo/battery", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoSummary");
});
//單台電池狀態
app.get("/operateinfo/battery/state", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});
//單台RACK
app.get("/operateinfo/battery/rack", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

//多台電池狀態
app.get("/operateinfo/battery1/state", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});
//單台RACK
app.get("/operateinfo/battery1/rack", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});
//系統資訊
app.get("/systeminfo", (req, res) => {
  // num與fun
  res.render("Sys_Comm");
});

app.get("/systeminfo/communication", (req, res) => {
  // num與fun
  res.render("Sys_Comm");
});

app.get("/systeminfo/devicestate", (req, res) => {
  // num與fun
  res.render("Sys_Device");
});

app.get("/systeminfo/environment", (req, res) => {
  // num與fun
  res.render("Sys_Environment");
});

//告警紀錄
app.get("/alarm/realtime", (req, res) => {
  // num與fun
  res.render("Alm_RealTime");
});

app.get("/alarm/history", (req, res) => {
  // num與fun
  res.render("Alm_History");
});

//事件紀錄
app.get("/event", (req, res) => {
  // num與fun
  res.render("Evt_Operation");
});

app.get("/event/operation", (req, res) => {
  // num與fun
  res.render("Evt_Operation");
});
Operation;

app.get("/event/door", (req, res) => {
  // num與fun
  res.render("Evt_Door");
});

//報表
app.get("/report", (req, res) => {
  // num與fun
  res.render("Rpt_Report");
});

//圖表
app.get("/chrat", (req, res) => {
  // num與fun
  res.render("Fig_Real_Time");
});

app.get("/chrat/real", (req, res) => {
  // num與fun
  res.render("Fig_Real_Time");
});

app.get("/chrat/history", (req, res) => {
  // num與fun
  res.render("Fig_Historic");
});

//錯誤頁面
app.get("error", (req, res) => {
  // num與fun
  res.render("error");
});

app.listen(port, () => {
  console.log("伺服器正在聆聽 port " + port + "...");
});
