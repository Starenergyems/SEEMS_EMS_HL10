// app.js
const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
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

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
app.use(cookieParser());

//************************************************************* */
// 匯入路由檔案並傳遞資料庫實例
// const route1 = require("./routes/route1")(nano.use("database1"));
// const route2 = require("./routes/route2")(nano.use("database2"));
// // 你可以繼續匯入其他路由

// // 使用路由
// app.use("/route1", route1);
// app.use("/route2", route2);
// 可以繼續使用其他路由
//************************************************************* */

// Socket.IO 連線事件
// io.on("connection", (socket) => {
//   //console.log("app.js : A user connected");

//   // 訂閱 "dataUpdated" 事件
//   dataUpdateEmitter.on("dataUpdated", (items) => {
//     // 向連接的客戶端發送更新事件
//     socket.emit("updateItems", items);
//     console.log("Update items event sent to connected client");
//   });

//   // 發送一次更新以初始化客戶端的資料
//   updateDataPeriodically();

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// 引入多個路由檔案
// const accountRouter = require("./rAccount");
// const modeRouter = require("./rMode");
const meterRouter = require("./rMeter");
// const pcsRouter = require("./rPCS");
// const batteryRouter = require("./rBattery");
// const commuRouter = require("./rCommu");
// const deviceRouter = require("./rDevice");
// const environmentRouter = require("./rEnvironment");
const alarmRouter = require("./rAlarm");
// const eventRouter = require("./rEvent");
const reportRouter = require("./rReport");
// const chartRouter = require("./rChart");
// const testRouter = require("./test");
// const alarmFunctions = require("./alarmFunctions");
// 使用驗證
//app.use(authMiddleware);

// 使用這些路由
// app.use(accountRouter);
// app.use(modeRouter);
app.use(meterRouter);
// app.use(pcsRouter);
// app.use(batteryRouter);
// app.use(commuRouter);
// app.use(deviceRouter);
// app.use(environmentRouter);
app.use(alarmRouter);
// app.use(eventRouter);
app.use(reportRouter);
// app.use(chartRouter);
// app.use(testRouter);
// app.use(alarmFunctions);
// 查看目前連線路徑
app.use((req, res, next) => {
  // console.log(
  //   `Current API URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`
  // );
  next();
});

//************************************************************* */

app.get("/", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.get("/error", (req, res) => {
  res.render("error");
});

server.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});

// 新增定期更新函數，你需要根據實際需求實現這個函數
function updateDataPeriodically() {
  // 實現你的定期更新邏輯
  console.log("app.js : Data updated periodically...");
}

//module.exports = { nano };
