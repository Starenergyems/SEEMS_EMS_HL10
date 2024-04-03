const express = require("express");
// const router = require("./config"); // Importing configuration from config.js
const router = express.Router();
// Your routes and other configurations can continue from here
const moment = require('moment');
// For example:
// const userRoutes = require("./routes/userRoutes");
// app.use("/users", userRoutes);

// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

//  預設密碼 ˋ整理CODE　account 功能

// const express = require("express");
// const app = express();
// const router = express.Router();
// app.use(express.json()); // use to get json from ejs
// app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));
// const path = require("path");
// app.set("views", path.join(__dirname, "../views"));
// app.use("/public", express.static(path.join(__dirname, "../public")));
// const methodOverride = require("method-override");
// app.use(methodOverride("_method"));
// const cors = require("cors");
// app.use(cors());
// const cookieParser = require('cookie-parser'); // use for cookies, if not req.cookies will undefined.
// app.use(cookieParser());

const db = require("./config").database;
// // const db = config
const {
  getconfig,
  findaccount,
  updateaccount,
  alldoc,
  getbyid,
  deleteuser,
  datetime,
  userlog
} = require("./rLogin");

//////////////////////////////////////////////////////////////////////////////

router.get("/account", (req, res) => {
  res.redirect("/account/personalinfo")
});


router.get("/account/personalinfo", async (req, res) => {
  try {
    const token = req.cookies.token;
    const resopnse = await findaccount(inmail="", intoken=token );
    let transstate ="";
    if(resopnse.state==="activate"){
      transstate = "正常";
    }
    else{
      transstate = "停用";
    }
    if(resopnse.level==="admin"){
      translevel = "最高權限"
    } else if(resopnse.level==="manager"){
      translevel = "系統管理者"
    } else if(resopnse.level==="viewer"){
      translevel = "一般用戶"
    }
    const content = {
      num: resopnse.num,
      name: resopnse.name,
      company: resopnse.company,
      department: resopnse.department,
      permission: translevel, //admin manager viewer
      status: transstate, // activate,lock
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


router.post("/account/personalinfo", async (req, res) => {
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


router.get("/account/personalinfo/log", async (req, res) => {
  try {
    const token = req.cookies.token
    const user = await findaccount("", token)
    const id = user.id
    let response = await userlog(id)
    let log = []
    for (let i = 0; i < response.docs.length; i++) {
      let temp = response.docs[i]
      inputtime = temp.time;
      const formattedTime = moment(inputtime).format(
        "YYYY/MM/DD HH:mm:ss:SSS"
      );
      log.push({Time:formattedTime, description: temp.content})
    }
    res.json(log)
  }
  catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
}})


router.get("/account/system", (req, res) => {
  res.render("SysManage");
});


router.get("/account/system/accounts", async(req, res) => {
  
  let response = await alldoc(db.account)
  response = await response.json()
  let userset = []
  for (let i = 0; i < response.total_rows; i++) {
    if (response.rows[i].doc._id !== db.config) {
      let temp = response.rows[i].doc.user
      userset.push({
        employeeno: temp.num === (undefined || "")? response.rows[i].doc._id : temp.num,
        name: temp.name === undefined? "" : temp.name, 
        company: temp.company === undefined? "" : temp.company,
        department: temp.department === undefined? "" : temp.department,
        email: temp.mail === undefined? "" : temp.mail,
        permission: temp.level === undefined? "" : temp.level,
        status: temp.state === undefined? "" : temp.state,
        note: temp.note === undefined? "" : temp.note,
      })
    }}
  res.json(userset);
  })


router.post("/account/system/accounts", async(req, res) => {
  // Create new user.  Change or delete exist user.
  console.log("modify accounts")
  // console.log(req.body)
  try {
  let response = await alldoc(db.account);
  response = await response.json();
  let allid = []
  for (let i = 0; i < response.total_rows; i++) {
    if (response.rows[i].doc._id !== db.config) {
      allid.push(response.rows[i].doc._id)
    }
  }
  const body = req.body
  const bottom = body.bottom

  if (body["status"] === "normal"){
    body["status"] = "activate"
  } else if(body["status"] === "lock"){
    body["status"] = "deactivate"
  }

  if (allid.includes(body.num) === true && bottom === "addupdate"){
    console.log(`id exist, id:${body.num} will be update`)
    let iddata = await getbyid(body.num)
    // console.log("body",body)
    // console.log("before",iddata)
    iddata["time"] = datetime()
    iddata["user"]["num"] = body.num
    iddata["user"]["mail"] = body.email
    iddata["user"]["name"] = body.name
    iddata["user"]["company"] = body.company
    iddata["user"]["department"] = body.department
    iddata["user"]["level"] = body.permission
    iddata["user"]["state"] = body.status === undefined ||body.status === ""?iddata["user"]["state"]:body.status
    iddata["user"]["note"] = body.note === undefined ||body.note === ""? "" : body.note
    // console.log(777,body.password === undefined ||body.password === "", iddata.user.password)
    // body.password === undefined || body.password === "" ? iddata.user.password : body.password
    iddata["user"]["password"] = body.password === undefined ||body.password ==="" ? iddata.user.password : body.password
    // console.log("after",iddata)
    await updateaccount(iddata._id, "", "", [iddata])
  } else if (allid.includes(body.num) === false && bottom === "addupdate"){
        console.log("id nottttt exist, create")
        let data = [{
          _id: `${body.num}`,
          time: `${datetime()}`, // The doc verify time.
          user: {
            num: `${body.num}`,
            mail: `${body.email}`,
            name: `${body.name}`,
            company: `${body.company}`,
            department: `${body.department}`,
            level: `${body.permission}`,
            state: `${body.status}`,
            errcount: "0",
            note: `${body.note === undefined? "" : body.note}`,
            last_time: "",
            password: `${body.password === "" ? body.num : body.password}`,
            bantill: "",
            token: "",
            validtime: "",
          }}]
          console.log(data)
          await updateaccount(data[0]._id, "", "", data)
          }
  
if (allid.includes(body.num) === true && bottom === "delete") {
    // Delete the user.
    console.log(`delete ${body.num}`)
    await deleteuser(body.num)
    res.status(200)
  }

  }catch (error) {console.error("Error:", error.message)}
});
  

router.get("/account/system/passwordsetting", async(req, res) => {
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

router.post("/account/system/passwordsetting", async(req, res) => {
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

router.get("/account/system/banrule", async(req, res) => {
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


router.post("/account/system/banrule", async(req, res) => {
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

router.get("/account/system/logintext", async(req, res) => {
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

router.post("/account/system/logintext", async(req, res) => {
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

module.exports = router;

//////////////////////////////////////////////////////////////////////////////

// const db = couchdbConfig;
// const nano = require("nano")(
//   `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
// );
// const { brotliDecompress } = require("zlib");

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

// router.get("/personalinfo", (req, res) => {
//   // num與fun
//   res.render("PersonalInfo");
// });

// router.get("/accountmanage", (req, res) => {
//   // num與fun
//   res.render("AccountManage");
// });



// router.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });



// const port = 8888;
//const User = require("../models/userschema");
//const mongoose = require("mongoose");

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

// The page do not need 
// app.get("/account/manage", (req, res) => {
//   // num與fun
//   res.render("AccountManage");
// });