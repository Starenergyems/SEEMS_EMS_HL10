// app.js
const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const EventEmitter = require("events");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./authMiddleware");
const User = require("../models/userschema");
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

// MongoDB 連線
// mongoose
//   .connect("mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結 MongoDB....");
//     const currentDBName = mongoose.connection.name;
//     console.log("目前連線資料庫名稱：", currentDBName);
//     // 在這裡進行其他與資料庫相關的初始化操作
//   })
//   .catch((e) => {
//     console.error("連線 MongoDB 時發生錯誤：", e.message);
//   });

// Socket.IO 連線事件
io.on("connection", (socket) => {
  //console.log("app.js : A user connected");

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
// const accountRouter = require("./rAccount");
// const modeRouter = require("./rMode");
const meterRouter = require("./rMeter");
// const pcsRouter = require("./rPCS");
// const batteryRouter = require("./rBattery");
// const commuRouter = require("./rCommu");
// const deviceRouter = require("./rDevice");
// const environmentRouter = require("./rEnvironment");
// const alarmRouter = require("./rAlarm");
// const eventRouter = require("./rEvent");
// const reportRouter = require("./rReport");
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
// app.use(alarmRouter);
// app.use(eventRouter);
// app.use(reportRouter);
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

app.get("/", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {
  // try {
  //   const { mail, password } = req.body;
  //   // 查找使用者
  //   const user = await User.findOne({ "user.mail": mail });
  //   if (!user) {
  //     return res.status(401).json({ message: "帳號不存在" });
  //   }
  //   // 驗證密碼
  //   const isValidPassword = await bcrypt.compare(password, user.user.password);
  //   if (!isValidPassword) {
  //     return res.status(401).json({ message: "密碼錯誤" });
  //   }
  //   // 生成 JWT，使用 .env 中的密鑰
  //   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  //     expiresIn: "1h",
  //   });
  //   // 存儲在 cookie 中
  //   res.cookie("token", token, { httpOnly: true });
  //   res.status(200).json({ message: "登入成功" });
  // } catch (error) {
  //   console.error("登入時發生錯誤:", error);
  //   res.status(500).json({ message: "伺服器錯誤" });
  // }
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

// 新增定期更新函數，你需要根據實際需求實現這個函數
function updateDataPeriodically() {
  // 實現你的定期更新邏輯
  console.log("app.js : Data updated periodically...");
}
