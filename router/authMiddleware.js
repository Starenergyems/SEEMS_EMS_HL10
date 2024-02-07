var token = document.cookie

// To check if token is exist.
if (typeof(token) === 'undefined' || token === null) {
  location.href=".";
}
else if (token != account.user.token) {
  
}

async function findbytoken() {
  const URL = `${db_URL}/${db_account}/_find;
  const mangoQuery = {selector: {"user.token": { "$eq": token}}}; // use login page submit email to search account db.
  await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': AUTHORIZATION,},
    credentials: 'include',
    body: JSON.stringify(mangoQuery),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    if (data.docs.length === 1){ }}}// If select doc only one to implement var.
      // id = data.docs[0]._id;
      // rev = data.docs[0]._rev
      // time = datetime();
      // data = data.docs[0].user; // data from doc become doc.user.
      // employeenum  = data.num;
      // mail = EMAIL;
      // namee = data.name;
      // company === undefined ? company = "" : company = data.comapny;
      // department = data.department;
      // level = data.level;
      // state = data.state
      // errcount === undefined ? errcount = 0 : errcount = parseInt(data.errcount);
      // note === undefined ? note = "" : note = data.note;
      // last_time === undefined ? last_time = "" : last_time = data.last_time;
      // password = data.password;
      // bantill === undefined ? bantill = "" : bantill = data.bantill;
      // token === undefined ? token = "" : token = data.token;
      // validtime === undefined ? validtime = "" : validtime = data.validtime;


// const crypto = require("crypto");
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userschema");
// const dotenv = require("dotenv");

// dotenv.config(); // 載入環境變數

// // 使用環境變數中的密鑰或生成新的密鑰
// const jwtSecretKey = process.env.JWT_SECRET || generateRandomKey();

// function generateRandomKey() {
//   return crypto.randomBytes(32).toString("hex");
// }

// const authMiddleware = async (req, res, next) => {
//   try {
//     // 從 cookie 中取得 token
//     const token = req.cookies.token;

//     if (!token) {
//       return res.redirect("/login"); // 若沒有 token，導向登入頁面
//     }

//     // 驗證 token
//     const decoded = jwt.verify(token, jwtSecretKey);

//     // 查找使用者
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.redirect("/login"); // 若找不到使用者，導向登入頁面
//     }

//     // 將使用者資訊附加到 req 物件，以便其他路由使用
//     req.user = user;

//     next(); // 繼續執行下一個 middleware 或路由處理
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return res.redirect("/login");
//   }
// };

// module.exports = authMiddleware;
