const nano = require("nano");
const config = require("/home/hl10_4-1/SEEMS_EMS/router/config"); ///home/hl10_4-1/SEEMS_EMS/router
const couchdbConfig = config.database;
const nanoClient = nano(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const gc_rf10 = "gc_rf10";
const gcDb = nanoClient.use(gc_rf10);

// 函數以指定的時間範圍生成資料並將其插入數據庫
async function generateAndInsertData(startTime, endTime) {
  const documents = [];
  let currentTime = new Date(startTime);

  while (currentTime <= endTime) {
    const document = {
      time: new Date(currentTime), // 使用新的日期物件以避免參考問題
      System: {
        400001: 0,
        400002: 0,
        400037: Math.floor(Math.random() * (10000 - 9000 + 1)) + 9000, // 產生隨機數值範圍在 9000 到 10000 之間
      },
    };
    //documents.push(document);
    gcDb
      .insert(document)
      .then((body) => {
        console.log("User document inserted successfully. ID:", body.id);
      })
      .catch((err) => {
        console.error("Error inserting user document:", err.message);
      });
    // 每秒增加時間
    currentTime.setSeconds(currentTime.getSeconds() + 1);
  }

  // 將生成的文檔插入數據庫
}

// 指定開始和結束時間
const startTime = "2024-02-28T23:59:50.000Z";
const endTime = "2024-02-28T23:59:59.999Z";

// 呼叫函數生成和插入資料
generateAndInsertData(startTime, endTime);
