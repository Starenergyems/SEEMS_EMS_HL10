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
  let ENDTime = new Date(endTime);

  console.log(currentTime);
  console.log(ENDTime);
  while (currentTime <= ENDTime) {
    const document = {
      time: currentTime, // 使用新的日期物件以避免參考問題
      System: {
        400001: 0,
        400002: 0,
        400037: Math.floor(Math.random() * (10000 - 9550 + 1)) + 9550, // 產生隨機數值範圍在 9450 到 10000 之間
      },
    };
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
//3/5 3/4 3/3 3/2 3/1 2/29 2/28
// 指定開始和結束時間
const startTime = "2024-01-01T00:00:00.000Z";
const endTime = "2024-01-01T23:59:59.999Z";

// 呼叫函數生成和插入資料

generateAndInsertData(startTime, endTime);

async function deleteDataInRange(startTime, endTime) {
  try {
    // 構建 selector 對象以查詢指定時間範圍內的文檔
    const selector = {
      time: {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      },
    };

    // 執行查詢並刪除查詢到的文檔
    const result = await gcDb.find({
      selector: selector,
    });

    const deletePromises = result.docs.map((doc) =>
      gcDb.destroy(doc._id, doc._rev)
    );
    await Promise.all(deletePromises);

    console.log(
      `Deleted ${result.docs.length} documents within the specified time range.`
    );
  } catch (error) {
    console.error("Error deleting documents:", error.message);
  }
}

// 指定開始和結束時間
//const startTime = "2024-01-01T00:00:00.000Z";
//const endTime = "2024-01-03T23:59:59.999Z";

// 刪除指定時間範圍內的數據
//deleteDataInRange(startTime, endTime);
