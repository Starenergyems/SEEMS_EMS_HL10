// app.js
//畫面更新測試 v2 包含同一頁需要更新數值的功能

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結 MongoDB....");
  })
  .catch((e) => {
    console.error("連線 MongoDB 時發生錯誤：", e.message);
  });

const Item = mongoose.model("Item", {
  name: String,
  value: Number,
});

// 設置模板引擎
app.set("view engine", "ejs");

// 設置靜態文件夾
app.use(express.static("public"));

// 定義路由
app.get("/web", async (req, res) => {
  try {
    // 從資料庫讀取所有數值
    const data = await Item.find();
    res.render("testForWeb", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// 啟動定時任務，每三秒重新從資料庫讀取數值
setInterval(async () => {
  try {
    const data = await Item.find();
    io.emit(
      "updateValue",
      data.map((item) => item.value)
    );
  } catch (error) {
    console.error(error);
  }
}, 1000);

// 啟動伺服器
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// 啟動Socket.io
const io = require("socket.io")(server);

// Socket.io事件處理
io.on("connection", (socket) => {
  console.log("A user connected");

  // 傳送初始數值
  Item.find().then((data) => {
    socket.emit(
      "updateValue",
      data.map((item) => item.value)
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
