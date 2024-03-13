const port = 8888;

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
const db = couchdbConfig;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const cookieParser = require('cookie-parser'); // use for cookies, if not req.cookies will undefined.
app.use(cookieParser());

const { getconfig, findaccount, updateaccount, alldoc, deleteuser } = require("./rLogin");
const { brotliDecompress } = require("zlib");

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
app.use(express.json()); // use to get json from ejs
//app.use(myMiddleware);

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))


app.get("/account", (req, res) => {
  res.redirect("/account/personalinfo")
});


app.get("/account/personalinfo", async (req, res) => {
  try {
    // const token = req.headers.cookie.split('=')[1]
    const token = req.cookies.token;
    // console.log(token);
    const resopnse = await findaccount(inmail="", intoken=token );
    // console.log(resopnse)
    const content = {
      num: resopnse.num,
      name: resopnse.name,
      company: resopnse.company,
      department: resopnse.department,
      permission: resopnse.level,
      status: resopnse.state,
      note: resopnse.note,
      lastlogin: resopnse.last_time
    };
    const originalDateString = content.lastlogin;
    const originalDate = new Date(originalDateString);
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0');
    const day = String(originalDate.getDate()).padStart(2, '0');
    const hours = String(originalDate.getHours()).padStart(2, '0');
    const minutes = String(originalDate.getMinutes()).padStart(2, '0');
    const seconds = String(originalDate.getSeconds()).padStart(2, '0');
    content.lastlogin = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    res.render("PersonalInfo", content);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/account/personalinfo", async (req, res) => {
// Change password.
// Judge function should be write.
console.log("Change password function execute.")
try {
  const config = await getconfig()
  const token = req.cookies.token
  const response = req.body
  const old = response.old
  const newa = response.newa
  const newb = response.newb
  const account = await findaccount("", token);
  const id = account.id
  let password = account.password
  if (password !== old || old === newa || newa !== newb || old === "" || newa === "" || newb === "") {
    console.log("Input data error.")
  } else {
    console.log("Change password success.")
    // if ( 
    password = newa
    await updateaccount(id,"",password)
  }
} 
catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
}})


app.get("/account/manage", (req, res) => {
  // num與fun
  res.render("AccountManage");
});

app.get("/account/system", (req, res) => {
  res.render("SysManage");
});

// app.get("/account/system/accounts", (req, res) => {
//   //讀所有帳戶資料
//   // num與fun
//   var account = [
//     {
//       employeeno: "SE0001",
//       name: "YC",
//       company: "星佑",
//       department: "EMS",
//       email: "123@hdrenewables.com",
//       permission: "admin",
//       status: "normal",
//       note: "",
//     },
//     {
//       employeeno: "SE0001",
//       name: "ZG",
//       company: "星佑",
//       department: "EMS",
//       email: "123@hdrenewables.com",
//       permission: "manager",
//       status: "lock",
//       note: "",
//     },
//   ];
//   res.json(account);
// });


app.post("/account/system/accounts", async(req, res) => {
  // Create new user or delete exist user.
  try {
    const body = req.body
    // console.log(body)
    let createdata = [
      {
        num: body.num,
        name: body.name,
        company: body.company,
        department: body.department,
        email: body.email,
        level: body.permission,
        state: body.status,
        note: body.note,
        password: body.password
      }
    ]
    // console.log(createdata)
    const response = await alldoc(db.account);
    console.log(11, response)
    const alldocc = response.json();
    console.log(alldoc)
    let id = []
    for (let i = 0; i < alldocc.rows.length; i++) {
      id.push(alldocc.rows[i].id)
    }
    if (id.includes(body.num)){
      deleteuser(body.num)
      console.log(`${req.method} ${req.url} delete user ${body.num}`)
    } else{
      updateaccount(body.num,"","",createdata)
      console.log(`${req.method} ${req.url} create user ${body.num}`)
    }
    res.status(200)
  }
  catch (error) {console.error("Error:", error.message)}
});

app.get("/account/system/passwordsetting", async(req, res) => {
  try {
    response = await getconfig()
    // console.log(response)
  let passwordSet = [
    {
      minTotal: response.atleast,
      maxTotal: response.atmost,
      minNum: response.number,
      minUpper: response.upper,
      minLower: response.lower,
      minSpe: response.special,
    },
  ];
  res.json(passwordSet);
  }
  catch (error) {
    console.error("config Error:", error.message);
  }
});

app.post("/account/system/passwordsetting", async(req, res) => {
  try {
    let response = await getconfig()
    let updatedata = [
      {
        "_id": response.id,
        "_rev": response.rev,
        "locktimes": response.locktimes,
        "suspendtime": response.suspendtime,
        "logintext": response.logintext,
        "duration": response.duration
      }
    ]
    response = req.body
    updatedata[0].atleast = parseInt(response.minTotal)
    updatedata[0].atmost = parseInt(response.maxTotal)
    updatedata[0].num = parseInt(response.minNum)
    updatedata[0].upper = parseInt(response.minUpper)
    updatedata[0].lower = parseInt(response.minLower)
    updatedata[0].special = parseInt(response.minSpe)
    if (updatedata[0].num + updatedata[0].upper + updatedata[0].lower + updatedata[0].special > updatedata[0].atleast){
      console.log("setting fault")
      res.status(404)
    } else {
    updateaccount(db.config, updatedata)
    // console.log(updatedata)
    res.status(200)
    }
  }
  catch (error) {console.error("config Error:", error.message)}
});

app.get("/account/system/banrule", async(req, res) => {
  try {
    response = await getconfig()
    if (response.suspendtime > 72 || response.suspendtime === "永久"){
      response.suspendtime = 72
    }
    let ban = [
      {
        wrongNum: response.locktimes,
        forbidTime: response.suspendtime,
      },
    ];
    res.json(ban);
  }
  catch (error) {
    console.error("config Error:", error.message);
  }
});

app.post("/account/system/banrule", async(req, res) => {
  try {
    let response = await getconfig()
    let updatedata = [
      {
        "_id": response.id,
        "_rev": response.rev,
        "atleast": response.atleast,
        "atmost": response.atmost,
        "num": response.number,
        "upper": response.upper,
        "lower": response.lower,
        "special": response.special,
        "logintext": response.logintext,
        "duration": response.duration
      }
    ]
    response = req.body
    updatedata[0].locktimes = response.wrongNum
    updatedata[0].suspendtime = response.forbidTime
    // console.log(updatedata)
    updateaccount(db.config, updatedata)
    res.status(200)
  }
  catch (error) {console.error("config Error:", error.message)}
});

app.get("/account/system/logintext", async(req, res) => {
  try {
    response = await getconfig()
    // console.log(response)
    let logintext = [
      {
        logintext: response.logintext,
      },
    ];
    res.json(logintext);
  }
  catch (error) {
    console.error("config Error:", error.message);
  }
  });

app.post("/account/system/logintext", async(req, res) => {
  try {
    let response = await getconfig()
    let updatedata = [
      {
        "_id": response.id,
        "_rev": response.rev,
        "atleast": response.atleast,
        "atmost": response.atmost,
        "num": response.number,
        "upper": response.upper,
        "lower": response.lower,
        "special": response.special,
        "locktimes": response.locktimes,
        "suspendtime": response.suspendtime,
        "duration": response.duration
      }
    ]
    response = req.body
    updatedata[0].logintext = response.loginText
    updateaccount(db.config, updatedata)
    res.status(200)
  }
  catch (error) {console.error("config Error:", error.message)}
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
