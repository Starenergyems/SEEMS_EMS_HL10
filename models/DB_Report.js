const nano = require("nano");
const config = require("/home/hl10_4-1/SEEMS_EMS/router/config"); ///home/hl10_4-1/SEEMS_EMS/router
const couchdbConfig = config.database;
const nanoClient = nano(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const report = "report";
const reportDb = nanoClient.use(report);

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// 函數以指定的時間範圍生成資料並將其插入數據庫
async function generateAndInsertData(startTime, endTime) {
  const documents = [];
  let currentTime = new Date(startTime);
  let ENDTime = new Date(endTime);

  console.log(currentTime);
  console.log(ENDTime);
  while (currentTime <= ENDTime) {
    const document = {
      time: currentTime.toISOString().slice(0, 10), // 使用日期的 ISO 字符串形式，僅取年月日部分
      exacutive_rate: [
        23,
        1,
        0,
        0,
        0,
        0,
        0,
        getRandomNumber(95.0, 100.0),
        getRandomNumber(95.0, 100.0),
        getRandomNumber(98.0, 100.0),
      ],
      other_info: [
        getRandomNumber(50000.0, 70000.0),
        getRandomNumber(50000.0, 60000.0),
        12401.2,
        0,
        0,
        80.2,
      ],
    };
    reportDb
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

const startTime = "2024-01-01T00:00:00.000Z";
const endTime = "2024-01-31T23:59:59.999Z";
generateAndInsertData(startTime, endTime);

// 呼叫函數生成和插入資料

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
      reportDb.destroy(doc._id, doc._rev)
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
