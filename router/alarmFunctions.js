// testforalarm.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");
const socket = require("socket.io");
const http = require("http");

// 引入資料庫模型
const Lc = require("../models/lcschema");
const Dc = require("../models/dcschema");
const Gc = require("../models/gcschema");
const Alarm = require("../models/alarmschema");

//************************************************************* */
// 修改資料庫模型名稱
const Lc01 = Lc["Lc01"];
const Lc02 = Lc["Lc02"];
const Lc03 = Lc["Lc03"];
const Lc04 = Lc["Lc04"];

router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
router.use(cors());
//************************************************************* */
// 創建 http 伺服器
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("okay");
});

// 使用 WebSocket 連接伺服器
const io = socket(server);

// 在資料庫連線時建立 changeStream
mongoose.connection.once("open", () => {
  const lc01ChangeStream = Lc01.watch();
  const lc02ChangeStream = Lc02.watch();
  const lc03ChangeStream = Lc03.watch();
  const lc04ChangeStream = Lc04.watch();
  const dcChangeStream = Dc.watch();
  const gcChangeStream = Gc.watch();

  // 監聽 change event
  lc01ChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "lc01Table" });
  });

  lc02ChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "lc02Table" });
  });

  lc03ChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "lc03Table" });
  });

  lc04ChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "lc04Table" });
  });

  dcChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "dcTable" });
  });

  gcChangeStream.on("change", (change) => {
    io.emit("refreshData", { tableId: "gcTable" });
  });
});

// Socket.io 事件監聽
io.on("connection", (socket) => {
  console.log("alarmFun : A user connected");

  // 斷開連接
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
//************************************************************* */
router.use(async (req, res, next) => {
  try {
    // 從資料庫中獲取數據
    const lc01Data = await Lc01.find();
    const lc02Data = await Lc02.find();
    const lc03Data = await Lc03.find();
    const lc04Data = await Lc04.find();
    const dcData = await Dc.find();
    const gcData = await Gc.find();

    // 獲取最新的Alarm資料
    const latestAlarmData = await Alarm.find().sort({ timestamp: -1 });

    // 遍歷 Alarm，刪除數值低於 50000 的文檔
    for (const alarmItem of latestAlarmData) {
      if (alarmItem.value < 50000) {
        await Alarm.findByIdAndDelete(alarmItem._id);
      }
    }

    // 遍歷 lc01Data，將不在 Alarm 中的文檔加入 Alarm，或更新已存在的文檔
    await processData(lc01Data, latestAlarmData, Alarm);

    // 遍歷 lc02Data，將不在 Alarm 中的文檔加入 Alarm，或更新已存在的文檔
    await processData(lc02Data, latestAlarmData, Alarm);

    // 遍歷 lc03Data，將不在 Alarm 中的文檔加入 Alarm，或更新已存在的文檔
    await processData(lc03Data, latestAlarmData, Alarm);

    // 遍歷 lc03Data，將不在 Alarm 中的文檔加入 Alarm，或更新已存在的文檔
    await processData(lc04Data, latestAlarmData, Alarm);

    // 遍歷 dcData，將不在 Alarm 中的文檔加入 Alarm，或更新已存在的文檔
    await processData(dcData, latestAlarmData, Alarm);

    // 遍歷 gcData，將不在 Alarm 中的文檔加入 Alarm，或更新已存在的文檔
    await processData(gcData, latestAlarmData, Alarm);

    // 重新獲取最新的 Alarm 資料，以確保排序正確
    const updatedAlarmData = await Alarm.find().sort({ timestamp: -1 });

    // 將數據傳遞到前端
    res.locals = {
      lc01Data,
      lc02Data,
      lc03Data,
      lc04Data,
      dcData,
      gcData,
      alarmData: updatedAlarmData,
    };
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//************************************************************* */
async function processData(data, latestAlarmData, Alarm) {
  // 創建一個 Set 來存儲已經存在於 Alarm 中的文檔的 _id
  const existingIds = new Set(
    latestAlarmData.map((item) => item._id.toString())
  );

  // 遍歷 data，將不在 Alarm 中的文檔加入 Alarm，或更新已存在的文檔
  for (const item of data) {
    const idString = item._id.toString();
    const existingDoc = latestAlarmData.find(
      (doc) => doc._id.toString() === idString
    );

    if (!existingDoc) {
      // 如果 Alarm 中沒有該文檔，則新增
      if (item.value > 50000) {
        await Alarm.create({
          _id: item._id,
          value: item.value,
          timestamp: item.timestamp,
        });
      }
    } else {
      // 如果 Alarm 中已經存在該文檔，則更新數值或刪除
      if (item.value > 50000) {
        // 更新數值
        if (existingDoc.value !== item.value) {
          await Alarm.findByIdAndUpdate(existingDoc._id, {
            value: item.value,
            timestamp: item.timestamp,
          });
        }
      } else {
        // 小於等於 50000 則刪除
        await Alarm.findByIdAndDelete(existingDoc._id);
      }
    }
    existingIds.add(idString);
  }
}

router.get("/testforalarm", (req, res) => {
  // 在這裡定義渲染 middleware 頁面的邏輯
  res.render("testforalarm");
});

// 修改為：
module.exports = router;
