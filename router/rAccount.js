const port = 3005;

const express = require("express");
//const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
//const port = 3000;
//const User = require("../models/userschema");
const router = express.Router();
const app = express();
const cors = require("cors");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結mongoDB....");

//     // 檢查當前數據庫名稱
//     const currentDBName = mongoose.connection.name;
//     console.log("我是account，當前數據庫名稱：", currentDBName);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//const collections = mongoose.connection.collections;

// 轉換為 collection 名稱的數組
//const collectionNames = Object.keys(collections);

//console.log("當前連接中的 collection 名稱：", collectionNames);

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
//app.use(myMiddleware);

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

app.get("/account", (req, res) => {
  //最後都要改回router.get
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

app.get("/account/system", (req, res) => {
  // num與fun
  res.render("SysManage");
});

app.get("/account/system/accounts", (req, res) => {
  //讀所有帳戶資料
  // num與fun
  var account = [
    {
      employeeno: "SE0001",
      name: "YC",
      company: "星佑",
      department: "EMS",
      email: "123@hdrenewables.com",
      permission: "admin",
      status: "normal",
      note: "",
    },
    {
      employeeno: "SE0001",
      name: "ZG",
      company: "星佑",
      department: "EMS",
      email: "123@hdrenewables.com",
      permission: "manager",
      status: "lock",
      note: "",
    },
  ];
  res.json(account);
});

app.post("/account/system/accounts", (req, res) => {
  //增刪修帳戶
  res.status(200);
});

app.get("/account/system/passwordsetting", (req, res) => {
  //讀密碼設定
  // num與fun
  var passwordSet = [
    {
      minTotal: "5",
      maxTotal: "12",
      minNum: "1",
      minUpper: "1",
      minLower: "1",
      minSpe: "1",
    },
  ];
  res.json(passwordSet);
});

app.post("/account/system/passwordsetting", (req, res) => {
  //設定密碼限制
  res.status(200);
});

app.get("/account/system/banrule", (req, res) => {
  //讀停用設定
  // num與fun
  var ban = [
    {
      wrongNum: "1",
      forbidTime: "1",
    },
  ];
  res.json(ban);
});

app.post("/account/system/banrule", (req, res) => {
  //設定停用準則
  res.status(200);
});

app.get("/account/system/logintext", (req, res) => {
  //讀登入畫面警告標語
  // num與fun
  var logintext = [
    {
      logintext: "禁止非授權操作",
    },
  ];
  res.json(logintext);
});

app.post("/account/system/logintext", (req, res) => {
  //設定登入畫面標語
  res.status(200);
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

// router.get("/personalinfo", (req, res) => {
//   // num與fun
//   res.render("PersonalInfo");
// });

// router.get("/accountmanage", (req, res) => {
//   // num與fun
//   res.render("AccountManage");
// });

module.exports = router;

app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});
