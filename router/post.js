// post.js
// 修改數值並維持更新
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const EventEmitter = require("events"); // 引入事件發布/訂閱模塊
const dataUpdateEmitter = new EventEmitter(); // 創建事件發布/訂閱實例
//const port = 3000;
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
app.use(methodOverride("_method"));

// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ems")
//   .then(() => {
//     console.log("成功連結 MongoDB....");
//     const currentDBName = mongoose.connection.name;
//     console.log("目前連線資料庫名稱：", currentDBName);
//   })
//   .catch((e) => {
//     console.error("連線 MongoDB 時發生錯誤：", e.message);
//   });

const Item = mongoose.model("Item", {
  name: String,
  value: Number,
});

let shouldUpdatePeriodically = true;

// 定期讀取資料庫數值並推送更新到客戶端
const updateDataPeriodically = async () => {
  try {
    if (shouldUpdatePeriodically) {
      // 在這裡獲取資料庫的數值
      const items = await Item.find();

      // 將 items 推送給所有客戶端
      dataUpdateEmitter.emit("dataUpdated", items);
      console.log("Updated items sent to clients");
    }
  } catch (error) {
    console.error(error);
  }
};

// 路由處理程序
app.get("/addd", async (req, res) => {
  try {
    // 在這裡獲取資料庫的數值，這樣每次訪問 "/addd" 時都可以返回最新的資料

    const items = await Item.find();
    res.render("testForPost", { items });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// 設定定期執行的時間間隔，例如每五秒
const updateInterval = 5000;
setInterval(updateDataPeriodically, updateInterval);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("stopPeriodicUpdate", () => {
    shouldUpdatePeriodically = false;
  });

  socket.on("resumePeriodicUpdate", () => {
    shouldUpdatePeriodically = true;
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("stopPeriodicUpdate", () => {
//     shouldUpdatePeriodically = false;
//   });

//   socket.on("resumePeriodicUpdate", () => {
//     shouldUpdatePeriodically = true;
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// 新增一個路由處理 GET 請求，以顯示修改數值的模態
app.get("/edit/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).send("Item not found");
    }

    // 獲取連接到此路由的 Socket 實例
    const socket = io.sockets.connected[req.query.socketId];

    // 發送停止定期更新的信號
    if (socket) {
      socket.emit("stopPeriodicUpdate");
    }

    // 渲染模板，將 item 數據傳遞給模板
    res.render("editModal", { item });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// 新增一個路由處理 POST 請求，以更新數據
// 在數值更新處，使用 io.emit 代替 socket.emit
// 在 post.js 中的更新數據路由處理 POST 請求
app.post("/edit/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const newValue = req.body.newValue;

    // 在資料庫中找到對應的項目
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).send("Item not found");
    }

    // 更新項目的數值
    item.value = newValue;
    await item.save();

    // 使用 io.to 通知指定房間中的客戶端更新數值
    const socketId = req.query.socketId;

    if (!socketId) {
      console.error("SocketId is not provided");
      return res.status(400).send("Bad Request");
    }

    // 將消息發送到指定的 Socket
    io.to(socketId).emit("updateItems", item);

    // 不再需要重新導向，因為不刷新整個畫面
    res.status(200).send("Value updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// http.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = app;
