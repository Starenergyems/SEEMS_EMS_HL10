const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Schema = require("./models/lc_schema");
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

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// 創建一個Mongoose模型
const DataModel = mongoose.model("Data", Schema, "account");

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

//錯誤頁面
app.get("/error", (req, res) => {
  // num與fun
  res.render("error");
});

app.listen(port, () => {
  console.log("伺服器正在聆聽 port " + port + "...");
});

module.exports = router;
