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
const dataUpdateEmitter = new EventEmitter();
require("dotenv").config();
const { calculateAverage, calculateAdd } = require("./function");

const nano = require("nano");
const { Console } = require("console");
const { ok } = require("assert");
const couchDBUrl = "http://admin:ems45877096@192.168.8.101:5984";
const nanoDb = nano(couchDBUrl);


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
// const accountRouter = require("./rAccount");
// const modeRouter = require("./rMode");
const meterRouter = require("./rMeter");
const pcsRouter = require("./rPCS");
// const batteryRouter = require("./rBattery");
const commuRouter = require("./rCommu");
const deviceRouter = require("./rDevice");
const environmentRouter = require("./rEnvironment");
//const alarmRouter = require("./rAlarm");
//const eventRouter = require("./rEvent");
//const reportRouter = require("./rReport");
// const chartRouter = require("./rChart");
// const testRouter = require("./test");
// const alarmFunctions = require("./alarmFunctions");
const middleware = require("./middleware");
// const login = require("./rLogin")
//app.use(authMiddleware);

//***************************************************************************************************************** */
// 使用這些路由
// app.use(accountRouter);
// app.use(modeRouter);
app.use(meterRouter);
app.use(pcsRouter);
//app.use(batteryRouter);
app.use(commuRouter);
app.use(deviceRouter);
app.use(environmentRouter);
//app.use(alarmRouter);
//app.use(eventRouter);
//app.use(reportRouter);
// app.use(chartRouter);
// app.use(testRouter);
// app.use(alarmFunctions);
//app.use(middleware);
//***************************************************************************************************************** */
// 定義 CouchDB 資料庫名稱
const databases = [
  "lc1_rf10", //0
  "lc2_rf10", //1
  "lc3_rf10", //2
  "lc4_rf10", //3
  "dwctrl", //4
  "log", //5
  "gc_rf10", //6
];
// 創建 Nano 實例的函式
const createNanoInstance = (dbName) => nano(`${couchDBUrl}/${dbName}`);

// 設定index
const getLatestDocument = async (nanoDb) => {
  const indexDef = {
    index: { fields: ["time"] },
    name: "time_index",
  };

  //建立index
  await nanoDb.createIndex(indexDef);

  //利用mango作為篩選器
  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
  };

  return new Promise((resolve, reject) => {
    nanoDb.find(mangoQuery, (err, body) => {
      if (err) {
        console.error("Error:", err);
        reject(err);
        return;
      }

      const latestData = body.docs[0]; //把資料存到latestData裡面
      //console.log(`Latest data from ${nanoDb.config.db}:`, latestData);
      resolve(latestData);
    });
  });
};

app.get("/", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {});

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
  console.log(`應用程式正在監聽端口 ${port}`);
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
