// This middleware is use for check authorization.
// input toekn
// output reslut permission id

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const { findaccount } = require("./rLogin")

// need authmiddleware in this function input is all get & post function except login get and login post,
// so before every 

function authentication(req) {
    const browser_token = req.cookies.token
    console.log(`The token in browser's cookies is ${browser_token}`)
    token = findaccount("",browser_token)
    if (token === browser_token) {
        console.log("auth OK")
    } else {console.log("auth not OK")}
}

app.get('*', (req, res, next) => {
    authentication(req)
    next()
})


app.get('/', (req, res) => {
    // Access cookies from the request object
    const cookies = req.cookies;
    console.log(cookies);
    res.send('Cookies logged to console');
})

// 每個request 過來都有一個req   const cookies = req.cookies;
// 透過middleware把這些季近來

function a() {
    console.log(4545455)
}


// app.use(require("./rLogin"))

const {db_USERNAME} = require("./rLogin")


// let token_from_browser 

const aa = db_USERNAME

module.exports = {
    aa,
    a,
    authentication
  }

// isModuleNamespaceObject.

// const token = document.cookie
// const login = require("./rLogin");
// app.use(login)

// console.log(db_USERNAME)
// module.exports = {db_USERNAME}

//authMiddleware;


// var id; // _id.
// var rev; // _rev.
// var time; // At first is establish time, else verify time.
// var employeenum; // User's employeenumber.
// var mail; // User's email need use @hdrenewables.com, and use for filter for account doc.
// var namee; // User's name.
// var company; // User's company.
// var department; // User's department.
// var level; // User's permission in system, accadmin for manage acount; sysadmin for operate system; general only view.
// var state; // User's status, normal for normal use; deactivate for lock.
// var errcount; // User's for calculate login failure times.
// var note; // For accadmin to record things.
// var last_time; // User's last login success time.
// var password; // User's system password.
// var bantill; // New var, use for record if user is locked when to unlock.
// var token; // New var, when user login success, system will random generate for validation.
// var validtime; // New var, the token will be validate to validtime.

// async function findaccount(token) {
//   const URL = `${db_URL}/${db_account}/_find`;
//   const mangoQuery = { selector: { "user.token": { $eq: token } } }; // use login page submit email to search account db.
//   await fetch(URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: AUTHORIZATION,
//     },
//     credentials: "include",
//     body: JSON.stringify(mangoQuery),
//     // json: JSON.stringify(mangoQuery),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // console.log(data);
//       console.log(`findaccount data length:${data.docs.length}`)
//       if (data.docs.length === 1) {
//         // If select doc only one to implement var.
//         id = data.docs[0]._id; // Impossible  undefined.
//         rev = data.docs[0]._rev; // Impossible  undefined.
//         time = datetime(); // function findaccount execute time.
//         data = data.docs[0].user; // data from doc become doc.user.
//         data.num === undefined ? (employeenum = "") : (employeenum = data.num);
//         mail = data.mail; // Impossible  undefined.
//         data.name === undefined ? (namee = "") : (namee = data.name);
//         data.comapny === undefined ? (company = "") : (company = data.comapny);
//         data.department === undefined ? (department = "") : (department = data.department);
//         data.level === undefined ? (level = "general") : (level = data.level);
//         data.state === undefined ? (state = "deactivate") : (state = data.state);
//         data.errcount === undefined ? (errcount = 0) : (errcount = parseInt(data.errcount));
//         data.note === undefined ? (note = "") : (note = data.note);
//         data.last_time === undefined ? (last_time = "") : (last_time = data.last_time);
//         password = data.password;
//         data.bantill === undefined ? (bantill = "") : (bantill = data.bantill);
//         data.token === undefined ? (token = "") : (token = data.token);
//         data.validtime === undefined ? (validtime = "") : (validtime = data.validtime);
//         // console.log(`_id: ${id}`);
//         // console.log(`_rev: ${rev}`);
//         // console.log(`time: ${time}`);
//         // console.log(`employeenum: ${employeenum}`);
//         // console.log(`mail: ${mail}`);
//         // console.log(`namee: ${namee}`);
//         // console.log(`company: ${company}`);
//         // console.log(`department: ${department}`);
//         // console.log(`level: ${level}`);
//         // console.log(`state: ${state}`);
//         // console.log(`errcount: ${errcount}`);
//         // console.log(`note: ${note}`);
//         // console.log(`last_time: ${last_time}`);
//         // console.log(`password: ${password}`);
//         // console.log(`bantill: ${bantill}`);
//         // console.log(`token: ${token}`);
//         // console.log(`validtime: ${validtime}`);
//       } else {
//         const response = `帳號或密碼錯誤`;
//         console.log(response);
//         return { Error: response };
//       }
//     })
//     .catch((error) => {
//       console.error("Error executing Mango query:", error);
//     });
// }



// // find whether the browser token is exist in db, and belong which user.
// findaccount
// // // To check if token is exist.
// // if (typeof(token) === 'undefined' || token === null) {
// //   location.href=".";
// // }
// // else if (token != account.user.token) {

// // }

// // async function findbytoken() {
// //   const URL = `${db_URL}/${db_account}/_find;
// //   const mangoQuery = {selector: {"user.token": { "$eq": token}}}; // use login page submit email to search account db.
// //   await fetch(URL, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       'Authorization': AUTHORIZATION,},
// //     credentials: 'include',
// //     body: JSON.stringify(mangoQuery),
// //   })
// //   .then(response => response.json())
// //   .then(data => {
// //     console.log(data)
// //     if (data.docs.length === 1){ }}}// If select doc only one to implement var.
// //       // id = data.docs[0]._id;
// //       // rev = data.docs[0]._rev
// //       // time = datetime();
// //       // data = data.docs[0].user; // data from doc become doc.user.
// //       // employeenum  = data.num;
// //       // mail = EMAIL;
// //       // namee = data.name;
// //       // company === undefined ? company = "" : company = data.comapny;
// //       // department = data.department;
// //       // level = data.level;
// //       // state = data.state
// //       // errcount === undefined ? errcount = 0 : errcount = parseInt(data.errcount);
// //       // note === undefined ? note = "" : note = data.note;
// //       // last_time === undefined ? last_time = "" : last_time = data.last_time;
// //       // password = data.password;
// //       // bantill === undefined ? bantill = "" : bantill = data.bantill;
// //       // token === undefined ? token = "" : token = data.token;
// //       // validtime === undefined ? validtime = "" : validtime = data.validtime;

// // // const crypto = require("crypto");
// // // const express = require("express");
// // // const jwt = require("jsonwebtoken");
// // // const User = require("../models/userschema");
// // // const dotenv = require("dotenv");

// // // dotenv.config(); // 載入環境變數

// // // // 使用環境變數中的密鑰或生成新的密鑰
// // // const jwtSecretKey = process.env.JWT_SECRET || generateRandomKey();

// // // function generateRandomKey() {
// // //   return crypto.randomBytes(32).toString("hex");
// // // }

// // // const authMiddleware = async (req, res, next) => {
// // //   try {
// // //     // 從 cookie 中取得 token
// // //     const token = req.cookies.token;

// // //     if (!token) {
// // //       return res.redirect("/login"); // 若沒有 token，導向登入頁面
// // //     }

// // //     // 驗證 token
// // //     const decoded = jwt.verify(token, jwtSecretKey);

// // //     // 查找使用者
// // //     const user = await User.findById(decoded.userId);

// // //     if (!user) {
// // //       return res.redirect("/login"); // 若找不到使用者，導向登入頁面
// // //     }

// // //     // 將使用者資訊附加到 req 物件，以便其他路由使用
// // //     req.user = user;

// // //     next(); // 繼續執行下一個 middleware 或路由處理
// // //   } catch (error) {
// // //     console.error("Authentication error:", error);
// // //     return res.redirect("/login");
// // //   }
// // // };

// // // module.exports = authMiddleware;
