const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
//const port = 3005;
const router = express.Router();
const app = express();
const cors = require("cors");

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);

//以下app要改回router
router.get("/chart", (req, res) => {
  // num與fun
  res.render("Cht_RealTime");
});

router.get("/chart/realtime", (req, res) => {
  // num與fun
  res.render("Cht_RealTime");
});

router.post("/chart/realtime", (req, res) => {
  // num與fun
  const { input1, input2} = req.body;
  console.log("num: "+input1);
  console.log("unit:" +input2);
});

router.get("/chart/history", (req, res) => {
  // num與fun
  res.render("Cht_History");
});

router.post("/chart/history", (req, res) => {
  // num與fun
  const { input1, input2, input3} = req.body;
  console.log("start: "+input1);
  console.log("end:" +input2);
  console.log("unit(ms):" +input3);
});

module.exports = router;

/*app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});*/
