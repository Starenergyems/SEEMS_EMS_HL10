const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const app = express();
const config = require("./config");
const couchdbConfig = config.database;
const moment = require("moment");
const { Console } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const heartbeat = "heartbeat";
const heartbeatDb = nano.use(heartbeat);
const gc_rf10 = "gc_rf10";
const gc_rf10Db = nano.use(gc_rf10);
const alarm = "alarm";
const alarm_nanoDb = nano.use(alarm);
const dwctrl = "dwctrl";
const dwctrlDb = nano.use(dwctrl);

const indexDef = {
  index: { fields: ["time"] },
  name: "time_index",
};

let flag = 0;

async function getLatestDocuments() {
  try {
    const latestDocuments = await gc_rf10Db.find({
      selector: {},
      fields: ["_id", "System", "time"],
      sort: [{ time: "desc" }],
      limit: 10,
      use_index: "time_index",
    });
    return latestDocuments.docs;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}
async function monitorSystem400086() {
  try {
    // 取得最新的資料
    const documents = await getLatestDocuments();
    if (!documents || documents.length === 0) {
      console.log("沒有資料可用");
      return;
    }

    // 打印所有查詢到的資料，只顯示 400086 和 400087 的數值
    //console.log("查詢到的所有資料 (僅顯示 400086 和 400087):");
    // documents.forEach((doc) => {
    //   const point400086 = doc.System && doc.System["400086"];
    //   const point400087 = doc.System && doc.System["400087"];

    //   console.log(
    //     `時間: ${doc.time}, 400086: ${point400086}, 400087: ${point400087}`
    //   );
    // });

    // 最新資料
    const latest = documents[0];
    const latestTime = new Date(latest.time);
    const latestValue400086 = latest.System["400086"];

    // 過濾過去 30 秒內的資料
    const thirtySecondsAgo = new Date(latestTime.getTime() - 10 * 1000);
    const recentData = documents.filter(
      (doc) => new Date(doc.time) >= thirtySecondsAgo
    );

    // console.log("過去 30 秒內的資料 (僅顯示 400086 和 400087):");
    // recentData.forEach((doc) => {
    //   const point400086 = doc.System && doc.System["400086"];
    //   const point400087 = doc.System && doc.System["400087"];

    //   console.log(
    //     `時間: ${doc.time}, 400086: ${point400086}, 400087: ${point400087}`
    //   );
    // });

    // 比較過去 1 秒內的數值是否有變化
    const hasChanged = recentData.some(
      (doc) => doc.System["400086"] !== latestValue400086
    );

    if (hasChanged) {
      //console.log("數值有變化，狀態正常");
      return;
    }

    // 若數值超過 10 秒未變化
    const oneMinuteAgo = new Date(latestTime.getTime() - 0 * 1000);
    const minuteData = documents.filter(
      (doc) => new Date(doc.time) >= oneMinuteAgo
    );

    //console.log("過去 10 秒內的資料 (僅顯示 400086 和 400087):");
    // minuteData.forEach((doc) => {
    //   const point400086 = doc.System && doc.System["400086"];
    //   const point400087 = doc.System && doc.System["400087"];

    //   console.log(
    //     `時間: ${doc.time}, 400086: ${point400086}, 400087: ${point400087}`
    //   );
    // });

    const allSame = minuteData.every(
      (doc) => doc.System["400086"] === latestValue400086
    );

    if (allSame) {
      console.log("數值超過 10 秒未變化，記錄異常");
      const alarmData = {
        _id: "gc_rf10.System.400086",
        db_name: "gc_rf10",
        time: new Date().toISOString(),
        location: "Control Room",
        device: "DC/GC",
        tag: "400086",
        level: "Alarm",
        content: "HeartBeat b/w GC/DC Fault",
        value: latestValue400086,
        read: false,
        recover: false,
        recover_time: "",
        occurrence_time: latestTime.toISOString(),
        category: "system",
        line_notify: false,
      };
      await saveToAlarmDB(alarmData);
    }
    // else {
    //   console.log("狀態正常，無需異常處理");
    // }

    // 如果數值恢復正常
    const previousAlarm = await getAlarmById("gc_rf10.System.400086");
    if (
      previousAlarm &&
      !previousAlarm.recover &&
      latestValue400086 !== previousAlarm.value
    ) {
      console.log("數值回復正常，更新異常記錄");
      previousAlarm.recover = true;
      previousAlarm.recover_time = new Date().toISOString();
      await updateAlarmDB(previousAlarm);
    }
  } catch (error) {
    console.error("監控時發生錯誤:", error);
  }
}

// 假設保存異常資料的函式
async function saveToAlarmDB(data) {
  try {
    // 使用 alarm 資料庫將資料存入
    const response = await alarm_nanoDb.insert(data);
    //console.log("成功存入 Alarm DB:", response);
    return response; // 返回資料庫的回應
  } catch (error) {
    console.error("存入 Alarm DB 時發生錯誤:", error);
    throw error; // 拋出錯誤供調用方處理
  }
}

function startMonitoring() {
  // 每分鐘執行一次 monitorSystem400086
  setInterval(async () => {
    //console.log("開始執行系統監控...");
    await monitorSystem400086();
  }, 10 * 1000); // 30,000 毫秒等於 30秒
}

// 啟動監控
// startMonitoring();

// 初始化全域變數
let sameValueCount = 0;
let previousValue = null;

// 定義每 3 秒執行的監控函式
async function monitorAndUpdate400087() {
  try {
    //console.log("開始讀取 400087 的數值...");

    // 獲取 gc_rf10 資料庫中最新的一筆資料
    const latestDocuments = await gc_rf10Db.find({
      selector: {},
      fields: ["_id", "System", "time"],
      sort: [{ time: "desc" }],
      limit: 1,
    });

    if (!latestDocuments.docs || latestDocuments.docs.length === 0) {
      console.log("無法取得 gc_rf10 資料庫的最新資料");
      return;
    }

    const latestDocument = latestDocuments.docs[0];
    const currentValue = latestDocument.System["400087"];

    if (typeof currentValue !== "number") {
      console.log("400087 的數值無效，無法進行操作");
      return;
    }

    // 比較是否與前一次的數值相同
    if (previousValue === currentValue) {
      sameValueCount++;
      //console.log(`數值未變化，連續相同次數: ${sameValueCount}`);

      // 如果數值超過 3 次未變化，記錄異常
      if (sameValueCount >= 4) {
        console.log("數值超過 3 次問詢未變化，記錄異常");
        const alarmData = {
          _id: "gc_rf10.System.400087",
          db_name: "gc_rf10",
          time: new Date().toISOString(),
          location: "Control Room",
          device: "DC/GC",
          tag: "400087",
          level: "Alarm",
          content: "HeartBeat b/w EMS/GC/DC Fault",
          value: currentValue,
          read: false,
          recover: false,
          recover_time: "",
          occurrence_time: latestDocument.time,
          category: "system",
          line_notify: false,
        };
        await saveToAlarmDB(alarmData);
        sameValueCount = 0; // 重置計數器
      }
    } else {
      sameValueCount = 0; // 如果數值改變，重置計數器
      //console.log("數值有變化，重置計數器");
    }

    // 對數值 +1
    const newValue = currentValue + 1;
    //console.log(`最新 400087 數值: ${currentValue}，更新後數值: ${newValue}`);

    // 更新 dwctrl 資料庫中最新一筆資料的 W400087 點位
    const dwctrlDocuments = await dwctrlDb.find({
      selector: {},
      fields: ["_id", "_rev", "System", "time"],
      sort: [{ time: "desc" }],
      limit: 1,
    });

    if (!dwctrlDocuments.docs || dwctrlDocuments.docs.length === 0) {
      console.log("無法取得 dwctrl 資料庫的最新資料");
      return;
    }

    const dwctrlLatest = dwctrlDocuments.docs[0];
    dwctrlLatest.System["W400087"] = newValue;

    // 使用 insert 方法更新資料
    const response = await dwctrlDb.insert(dwctrlLatest);
    //console.log("成功修改 dwctrl 資料庫的最新資料:", response);

    // 更新前一次的值
    previousValue = currentValue;
  } catch (error) {
    console.error("監控或更新 400087 時發生錯誤:", error);
  }
}

// 啟動每 3 秒執行一次的監控
function startMonitoring400087() {
  setInterval(async () => {
    await monitorAndUpdate400087();
  }, 3000); // 每 3 秒執行一次
}

// 啟動監控
// startMonitoring400087();

module.exports = { startMonitoring, startMonitoring400087 };
