// app.js
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const EventEmitter = require("events");
const cookieParser = require("cookie-parser");
const port = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require("dotenv").config();
const { submit } = require("./rLogin");

const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
const gc_rf10 = "gc_rf10";
const gcDb = nano.use(gc_rf10);

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
app.use(cookieParser());

//***************************************************************************************************************** */

// 引入多個路由檔案
// const {authentication} = require("./authMiddleware")

app.get("/", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body["username"];
    const password = req.body["password"];
    console.log(`Input Data：\nUSERMAIL = ${email}\nPASSWORD = ${password}`);

    const response = await submit(email, password);
    if (response["result"] === true) {
      console.log(response["text"]);
      res.cookie("token", response["token"]);
      //, { maxAge: 10, httpOnly: true });
      // if cookies add this the cookies will live 10s, and will not abandon after close browser.
      res.json({ redirect: "http://localhost:3000/operateinfo" });
    } else {
      res.status(401).send(response["text"]);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// const accountRouter = require("./rAccount");
// const modeRouter = require("./rMode");
// const meterRouter = require("./rMeter");
// const pcsRouter = require("./rPCS");
const batteryRouter = require("./rBattery");
//  const commuRouter = require("./rCommu");
//  const deviceRouter = require("./rDevice");
//  const environmentRouter = require("./rEnvironment");
// const eventRouter = require("./rEvent");
// const reportRouter = require("./rReport");
// const chartRouter = require("./rChart");
// const testRouter = require("./test");
//  const alarmRouter = require("./rAlarm");
// const { nextTick } = require("process");
// const middleware = require("./middleware");
// const login = require("./rLogin")
// app.use(authMiddleware);

const { authentication } = require("./authMiddleware");

app.use("*", async (req, res, next) => {
  try {
    const authenticated = await authentication(req);
    if (authenticated === false) {return res.status(401).send("Unauthorized")}
    else {req.body = {"level" :authenticated }}
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//***************************************************************************************************************** */
// 使用這些路由
// app.use(authentication)
// app.use(accountRouter);
// app.use(modeRouter);
// app.use(meterRouter);
// app.use(pcsRouter);
app.use(batteryRouter);
// app.use(commuRouter);
// app.use(deviceRouter);
// app.use(environmentRouter);
// app.use(eventRouter);
// app.use(reportRouter);
// app.use(chartRouter);
// app.use(testRouter);
// app.use(alarmRouter);
// app.use(middleware);

//***************************************************************************************************************** */

// app.get("/login", (req, res) => {
//   res.render("Login", { navbarData: res.locals.navbarData });
// });

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/health", (req, res) => {
  const isHealthy = true;
  if (isHealthy) {
    res.status(200).json({ status: "OK" });
  } else {
    res.status(500).json({ status: "Error" });
  }
});

server.listen(port, () => {
  console.log(`app.js 應用程式正在監聽端口 ${port}`);
});

// 在應用程式結束時，關閉伺服器
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// 新增定期更新函數，你需要根據實際需求實現這個函數
function updateDataPeriodically() {
  // 實現你的定期更新邏輯
  console.log("app.js : Data updated periodically...");
}

//module.exports = { nano };