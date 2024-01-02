// test.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");
const socket = require("socket.io");
const http = require("http"); // 引入 http 模塊

const C1 = mongoose.model("C1", {
  _id: mongoose.Schema.Types.ObjectId,
  value: Number,
  timestamp: { type: Date, default: Date.now },
});
const C2 = mongoose.model("C2", {
  _id: mongoose.Schema.Types.ObjectId,
  value: Number,
  timestamp: { type: Date, default: Date.now },
});
const C3 = mongoose.model("C3", {
  _id: mongoose.Schema.Types.ObjectId,
  value: Number,
  timestamp: { type: Date, default: Date.now },
});
const C4 = mongoose.model("C4", {
  _id: mongoose.Schema.Types.ObjectId,
  value: Number,
  timestamp: { type: Date, default: Date.now },
});
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
router.use(cors());

// 創建 http 伺服器
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("okay");
});

// 使用 WebSocket 連接伺服器
const io = socket(server);

// 在資料庫連線時建立 changeStream
mongoose.connection.once("open", () => {
  const c1ChangeStream = C1.watch();
  const c2ChangeStream = C2.watch();
  const c3ChangeStream = C3.watch();
  const c4ChangeStream = C4.watch();

  // 監聽 change event
  c1ChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "c1Table" });
  });

  c2ChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "c2Table" });
  });

  c3ChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "c3Table" });
  });

  c4ChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "c4Table" });
  });
});

// Socket.io 事件監聽
io.on("connection", (socket) => {
  console.log("A user connected");

  // 斷開連接
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

router.use(async (req, res, next) => {
  try {
    // 從資料庫中獲取數據0
    const c1Data = await C1.find();
    const c2Data = await C2.find();
    const c3Data = await C3.find();

    // 獲取最新的C4資料
    const latestC4Data = await C4.find().sort({ timestamp: -1 });

    // 遍歷 C4，刪除數值低於 50000 的文檔
    for (const c4Item of latestC4Data) {
      if (c4Item.value < 50000) {
        await C4.findByIdAndDelete(c4Item._id);
      }
    }

    // 遍歷 c1Data，將不在 C4 中的文檔加入 C4，或更新已存在的文檔
    await processData(c1Data, latestC4Data);

    // 遍歷 c2Data，將不在 C4 中的文檔加入 C4，或更新已存在的文檔
    await processData(c2Data, latestC4Data);

    // 遍歷 c3Data，將不在 C4 中的文檔加入 C4，或更新已存在的文檔
    await processData(c3Data, latestC4Data);

    // 重新獲取最新的 C4 資料，以確保排序正確
    const updatedC4Data = await C4.find().sort({ timestamp: -1 });

    // 將數據傳遞到前端
    res.locals = {
      c1Data,
      c2Data,
      c3Data,
      c4Data: updatedC4Data,
    };
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

async function processData(data, latestC4Data) {
  // 創建一個 Set 來存儲已經存在於 C4 中的文檔的 _id
  const existingIds = new Set(latestC4Data.map((item) => item._id.toString()));

  // 遍歷 data，將不在 C4 中的文檔加入 C4，或更新已存在的文檔
  for (const item of data) {
    const idString = item._id.toString();
    const existingDoc = latestC4Data.find(
      (doc) => doc._id.toString() === idString
    );

    if (!existingDoc) {
      // 如果 C4 中沒有該文檔，則新增
      if (item.value > 50000) {
        await C4.create({
          _id: item._id,
          value: item.value,
          timestamp: item.timestamp,
        });
      }
    } else {
      // 如果 C4 中已經存在該文檔，則更新數值或刪除
      if (item.value > 50000) {
        // 更新數值
        if (existingDoc.value !== item.value) {
          await C4.findByIdAndUpdate(existingDoc._id, {
            value: item.value,
            timestamp: item.timestamp,
          });
        }
      } else {
        // 小於等於 50000 則刪除
        await C4.findByIdAndDelete(existingDoc._id);
      }
    }
    existingIds.add(idString);
  }
}

router.get("/test", (req, res) => {
  // 在這裡定義渲染 middleware 頁面的邏輯
  res.render("test");
});

router.get("/test2", (req, res) => {
  // 在這裡定義渲染 middleware 頁面的邏輯
  res.render("test");
});

// 加入其他路由
router.get("/someOtherRoute", (req, res) => {
  // Your logic here
  res.send("Hello from someOtherRoute");
});

// 修改為：
module.exports = router;
