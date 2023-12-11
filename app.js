const express = require("express");
//const app = express();
const mongoose = require("mongoose");
const Schema = require("./models/user_schema");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const router = express.Router();
mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結mongoDB....");
  })
  .catch((e) => {
    console.log(e);
  });

router.set("view engine", "ejs");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
router.use(express.static(path.join(__dirname, "public")));

// 創建一個Mongoose模型
const UserModel = mongoose.model("User", Schema, "account");

//設定路由
//C:\Test\SEEMS_EMS\router\rAccount.js
router.get("/login", (req, res) => {
  // num與fun
  res.render("Login"); //渲染 Login.ejs
});

router.get("/personalinfo", (req, res) => {
  // num與fun
  res.render("PersonalInfo");
});

router.get("/accountmanage", (req, res) => {
  // num與fun
  res.render("AccountManage");
});

//系統模式控制頁面切換，少一層會導致後續葉面無法讀取
//路由的匹配是按照它們在代碼中出現的順序進行的。
//如果缺少 "/Mode" 路由，Express 將無法找到精確匹配的
//"/Mode/sysctrl" 和 "/Mode/schedule"，因為缺少 "/Mode" 的處理程序。
//C:\Test\SEEMS_EMS\router\rMode.js
router.get("/Mode", (req, res) => {
  res.render("Mode_Schedule");
});
//系統模式控制頁面切換
router.get("/Mode/sysctrl", (req, res) => {
  res.render("Mode_SysCtrl");
});
//  排程
router.get("/Mode/schedule", (req, res) => {
  res.render("Mode_Schedule");
});

//C:\Test\SEEMS_EMS\router\rMeter.js
//運轉資訊+單線圖
router.get("/operateinfo", (req, res) => {
  // num與fun
  res.render("Op_Meter_SLD");
});

//主電表
router.get("/operateinfo/mainmerter", (req, res) => {
  // num與fun
  res.render("Op_Meter_MainMeter");
});
//其他電表
router.get("/operateinfo/auxmerters", (req, res) => {
  // num與fun
  res.render("Op_Meter_AuxMeter");
});

//C:\Test\SEEMS_EMS\router\rPCS.js
//pcs主頁
router.get("/operateinfo/pcs", (req, res) => {
  // num與fun
  res.render("Op_PCS_InfoSummary");
});

//單台pcs狀態
router.get("/operateinfo/pcs/InfoDetail", (req, res) => {
  // num與fun
  res.render("Op_PCS_InfoDetail");
});
//單台pcs警告
router.get("/operateinfo/pcs/alarm", (req, res) => {
  // num與fun
  res.render("Op_PCS_Alarm");
});

//多台pcs狀態 更改數字即可
router.get("/operateinfo/pcs/InfoDetail/1", (req, res) => {
  // num與fun
  res.render("Op_PCS_InfoDetail");
});
//多台pcs警告
router.get("/operateinfo/pcs/alarm/1", (req, res) => {
  // num與fun
  res.render("Op_PCS_Alarm");
});

//C:\Test\SEEMS_EMS\router\rBattery.js
//電池
router.get("/operateinfo/battery", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoSummary");
});
//單台電池狀態
router.get("/operateinfo/battery/infodetail", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});

//多台電池狀態
router.get("/operateinfo/battery/infodetail/1", (req, res) => {
  // num與fun
  res.render("Op_Bat_InfoDetail");
});
//單台RACK
router.get("/operateinfo/battery/rack", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

//多台RACK
router.get("/operateinfo/battery/rack/1", (req, res) => {
  // num與fun
  res.render("Op_Bat_Rack");
});

//
//系統資訊
router.get("/systeminfo", (req, res) => {
  // num與fun
  res.render("Sys_Comm");
});

router.get("/systeminfo/device", (req, res) => {
  // num與fun
  res.render("Sys_Device");
});

router.get("/systeminfo/environment", (req, res) => {
  // num與fun
  res.render("Sys_Environment");
});

//告警紀錄
router.get("/alarm", (req, res) => {
  // num與fun
  res.render("Alm_RealTime");
});

router.get("/alarm/realtime", (req, res) => {
  // num與fun
  res.render("Alm_RealTime");
});

router.get("/alarm/history", (req, res) => {
  // num與fun
  res.render("Alm_History");
});

//事件紀錄
router.get("/event", (req, res) => {
  // num與fun
  res.render("Evt_Operation");
});

router.get("/event/door", (req, res) => {
  // num與fun
  res.render("Evt_Door");
});

//報表
router.get("/report", (req, res) => {
  // num與fun
  res.render("Rpt_Report");
});

//圖表
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

//錯誤頁面
router.get("error", (req, res) => {
  // num與fun
  res.render("error");
});

router.listen(port, () => {
  console.log("伺服器正在聆聽 port " + port + "...");
});
