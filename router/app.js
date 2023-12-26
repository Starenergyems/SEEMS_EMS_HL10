// app.js

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const EventEmitter = require("events");
const port = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const dataUpdateEmitter = new EventEmitter(); // 創建事件發布/訂閱實例

require("dotenv").config();

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

// MongoDB 連線
mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結 MongoDB....");
    const currentDBName = mongoose.connection.name;
    console.log("目前連線資料庫名稱：", currentDBName);
    // 在這裡進行其他與資料庫相關的初始化操作
  })
  .catch((e) => {
    console.error("連線 MongoDB 時發生錯誤：", e.message);
  });

// Socket.IO 連線事件
io.on("connection", (socket) => {
  console.log("A user connected");

  // 訂閱 "dataUpdated" 事件
  dataUpdateEmitter.on("dataUpdated", (items) => {
    // 向連接的客戶端發送更新事件
    socket.emit("updateItems", items);
    console.log("Update items event sent to connected client");
  });

  // 發送一次更新以初始化客戶端的資料
  updateDataPeriodically();

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 引入多個路由檔案
const accountRouter = require("./rAccount");
const modeRouter = require("./rMode");
const meterRouter = require("./rMeter");
const pcsRouter = require("./rPCS");
const batteryRouter = require("./rBattery");
const commuRouter = require("./rCommu");
const deviceRouter = require("./rDevice");
const environmentRouter = require("./rEnvironment");
const alarmRouter = require("./rAlarm");
const eventRouter = require("./rEvent");
const reportRouter = require("./rReport");
const chartRouter = require("./rChart");
const testRouter = require("./test");
const postRouter = require("./post");
// const linebotRouter = require("./rlinebot");

// ... 其他程式碼

// 使用這些路由和 middleware
app.use(accountRouter);
app.use(modeRouter);
app.use(meterRouter);
app.use(pcsRouter);
app.use(batteryRouter);
app.use(commuRouter);
app.use(deviceRouter);
app.use(environmentRouter);
app.use(alarmRouter);
app.use(eventRouter);
app.use(reportRouter);
app.use(chartRouter);
app.use(testRouter);
app.use(postRouter);
// 額外的路由或中間件可以在這裡添加
// app.use(linebotRouter);

// 定期讀取資料庫數值並推送更新到客戶端
// const updateDataPeriodically = async () => {
//   try {
//     // 在這裡獲取資料庫的數值
//     // const items = await YourModel.find();
//     // 將 items 推送給所有客戶端
//     dataUpdateEmitter.emit("dataUpdated", items);
//     console.log("Updated items sent to clients");

//     // 設定下一次讀取的時間，例如每五秒
//     setTimeout(updateDataPeriodically, 5000);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // 啟動第一次的讀取
// updateDataPeriodically();

// let items = []; // 新增全域的 items 變數

// // 定期讀取資料庫數值並推送更新到客戶端
// const updateDataPeriodically = async () => {
//   try {
//     // 在這裡獲取資料庫的數值
//     // const items = await YourModel.find();
//     // 將 items 推送給所有客戶端
//     dataUpdateEmitter.emit("dataUpdated", items);
//     console.log("Updated items sent to clients");
//   } catch (error) {
//     console.error(error);
//   }
// };

// // 設定定期執行的時間間隔，例如每五秒
// const updateInterval = 5000;
// setInterval(updateDataPeriodically, updateInterval);

//查看目前連線路徑
app.use((req, res, next) => {
  console.log(
    `Current API URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
});

app.get("/", (req, res) => {
  res.render("Login");
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.get("/error", (req, res) => {
  res.render("error");
});

server.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});
