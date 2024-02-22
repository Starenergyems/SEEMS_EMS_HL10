const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
//const port = 3000;
const Gc = require("../models/gcschema");
const router = express.Router();
const app = express();
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
//app.use(myMiddleware);

//導向童話面作法同於METER
router.get("/mode", (req, res) => {
  // 在這裡修改重定向的方式，可以直接將 URL 修改為 "/mode/sysctrl"
  // 如果需要傳遞額外資訊，可以使用查詢字串或 session 等機制
  res.redirect("/mode/sysctrl");
});

//系統模式控制頁面切換
router.get("/mode/sysctrl", (req, res) => {
  res.render("Mode_SysCtrl", { permission: "manager" });
});
//  排程
router.get("/mode/schedule", (req, res) => {
  res.render("Mode_Schedule", { permission: "manager" });
});

//運轉資訊+單線圖
// router.get("/operateinfo", (req, res) => {
//   // num與fun
//   res.render("Op_Meter_SLD");
// });

module.exports = router;
