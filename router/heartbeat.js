const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const app = express();
const config = require("./config");
const couchdbConfig = config.database;

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
const gc_rf10 = "gc_rf10";
const gc_rf10Db = nano.use(gc_rf10);
const alarm = "test_alarm";
const alarm_nanoDb = nano.use(alarm);
const dwctrl = "dwctrl";
const dwctrlDb = nano.use(dwctrl);
const hisalarm = "test_hisalarm";
const hisalarm_nanoDb = nano.use(hisalarm);

//console.log("心跳監測執行中");
// - 獲取最新文檔
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

// - 根據 _id 從 alarm 資料庫中查詢記錄
async function getAlarmById(alarmId) {
  try {
    const alarmRecord = await alarm_nanoDb.get(alarmId).catch(() => null);
    if (alarmRecord) {
      return alarmRecord;
    } else {
      //console.log(`未找到 _id 為 ${alarmId} 的 alarm 記錄`);
      return null;
    }
  } catch (error) {
    console.error(`查詢 alarm 記錄時發生錯誤 (ID: ${alarmId}):`, error);
    return null;
  }
}

//-獲得目前時間標準格式
function getCurrentTimeInUTC8() {
  const now = new Date();

  // 獲取當前時間，並加上 8 小時的偏移量
  const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  // 格式化為 YYYY-MM-DDTHH:mm:ss.SSS+08:00 格式
  const year = utc8Time.getUTCFullYear();
  const month = String(utc8Time.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc8Time.getUTCDate()).padStart(2, "0");
  const hours = String(utc8Time.getUTCHours()).padStart(2, "0");
  const minutes = String(utc8Time.getUTCMinutes()).padStart(2, "0");
  const seconds = String(utc8Time.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(utc8Time.getUTCMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+08:00`;
}

// - 生成隨機id
function generateFixedId() {
  return [...Array(32)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}

// - 儲存異常資料到(Alarm & hisAlarm)資料庫
async function saveToDB(alarmData) {
  try {
    // 檢查是否已存在該 _id 的資料
    const existingDoc = await alarm_nanoDb.get(alarmData._id).catch(() => null);
    if (existingDoc) {
      // 如果文檔已存在，檢查 recover 狀態
      if (existingDoc.recover === false) {
        //console.log("文檔已存在且 recover 為 false，無需更新:", alarmData._id);
        return; // 如果 recover 為 false，直接結束函數
      } else if (existingDoc.recover === true) {
        // console.log(
        //   "文檔已存在且 recover 為 true，視作不同資料，進行更新:",
        //   alarmData._id
        // );
        //如果 recover 為 true，更新文檔的內容
        alarmData._rev = existingDoc._rev; // 必須提供最新的 _rev
        alarmData.read = false; // 重置 read 狀態
        alarmData.recover = false; // 重置 recover 狀態
        alarmData.line_notify = false; // 重置 line_notify 狀態
      }
    }
    // 插入或更新 alarm 資料庫
    const response = await alarm_nanoDb.insert(alarmData);
    //console.log("成功記錄或更新異常資料:", response);

    // 在 hisalarm 中記錄完整告警資料
    const hisalarmData = {
      _id: alarmData.hisalarm_id, // 使用 hisalarm_id 作為唯一 ID
      db_name: alarmData.db_name,
      time: alarmData.time,
      device: alarmData.device,
      location: alarmData.location,
      tag: alarmData.tag,
      level: alarmData.level,
      content: alarmData.content,
      value: alarmData.value,
      read: alarmData.read,
      recover: alarmData.recover,
      recover_time: alarmData.recover_time,
      occurrence_time: alarmData.occurrence_time,
      category: alarmData.category,
    };
    const hisalarmResponse = await hisalarm_nanoDb.insert(hisalarmData);
    //console.log("成功記錄至 hisalarm 資料庫:", hisalarmResponse);
  } catch (error) {
    console.error("記錄異常資料時發生錯誤:", error);
  }
}

// - 更新告警資料庫(Alarm & hisAlarm)的復歸狀態
async function updateAlarmRecoveryStatus(alarmId, currentValue, currentTime) {
  try {
    // - 更新 Alarm 資料庫的異常記錄
    let retryCount = 0;
    const maxRetries = 3;
    let updated = false;
    const existingAlarm = await alarm_nanoDb.get(alarmId).catch(() => null);
    while (!updated && retryCount < maxRetries) {
      if (existingAlarm) {
        if (!existingAlarm.recover) {
          console.log("檢測到異常已恢復，更新為恢復狀態...");
          existingAlarm.recover = true; // 設置為恢復狀態
          existingAlarm.recover_time = currentTime; // 設定恢復時間
          existingAlarm.value = currentValue; // 更新恢復時的數值
          existingAlarm.line_notify = false; // 可選：重置 LINE 通知狀態

          try {
            // 嘗試更新 alarm_nanoDb
            const response = await alarm_nanoDb.insert(existingAlarm);
            console.log("成功更新異常記錄為恢復狀態:", response);
            updated = true;
          } catch (error) {
            if (error.statusCode === 409) {
              // 更新衝突，重新嘗試
              console.log("發現更新衝突，嘗試重新更新...");
              retryCount++;
            } else {
              throw error;
            }
          }
        } else {
          //console.log("無需重複更新");
          return;
        }
      } else {
        //console.log("未找到異常記錄，無需更新");
        return;
      }
    }

    if (!updated) {
      console.error("更新重試次數達到上限，更新失敗");
      return;
    }

    // - 更新 HisAlarm 資料庫的對應記錄

    const hisalarmRecords = await hisalarm_nanoDb
      .find({
        selector: {
          recover: false, // 搜尋未恢復的記錄
          tag: existingAlarm.tag, // 匹配相同的 tag,
          device: existingAlarm.device,
        },
        limit: 1, // 只處理最新的一筆
      })
      .catch(() => null);

    if (
      hisalarmRecords &&
      hisalarmRecords.docs &&
      hisalarmRecords.docs.length > 0
    ) {
      const hisalarmRecord = hisalarmRecords.docs[0];
      hisalarmRecord.recover = true; // 更新為恢復狀態
      hisalarmRecord.recover_time = currentTime; // 設定恢復時間
      hisalarmRecord.value = currentValue; // 更新恢復時的數值
      const hisalarmResponse = await hisalarm_nanoDb.insert(hisalarmRecord);
      //console.log("成功更新 hisalarm 資料庫的記錄:", hisalarmResponse);
    } else {
      console.log("未找到對應的未恢復 hisalarm 記錄");
    }
  } catch (error) {
    console.error("更新異常記錄時發生錯誤:", error);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////
//- 監視400086
async function monitorSystem400086() {
  try {
    //console.log("監測啟動 monitorSystem400086");
    // 取得最新的資料
    const documents = await getLatestDocuments();
    if (!documents || documents.length === 0) {
      //console.log("沒有資料可用");
      return;
    }
    // 打印所有查詢到的資料，只顯示 400086 和 400087 的數值
    //console.log("查詢到的所有資料 (僅顯示 400086 和 400087):");
    documents.forEach((doc) => {
      const point400086 = doc.System && doc.System["400086"];
      const point400087 = doc.System && doc.System["400087"];
      // console.log(
      //   `時間: ${doc.time}, 400086: ${point400086}, 400087: ${point400087}`
      // );
    });
    // 最新資料
    const latest = documents[0];
    const latestTime = new Date(latest.time);
    const latestValue400086 = latest.System["400086"];

    // 過濾過去 10 秒內的資料
    const tenSecondsAgo = new Date(latestTime.getTime() - 10 * 1000);
    const recentData = documents.filter(
      (doc) => new Date(doc.time) >= tenSecondsAgo
    );

    //console.log("過去 10 秒內的資料 (僅顯示 400086 和 400087):");
    recentData.forEach((doc) => {
      const point400086 = doc.System && doc.System["400086"];
      const point400087 = doc.System && doc.System["400087"];

      // console.log(
      //   `時間: ${doc.time}, 400086: ${point400086}, 400087: ${point400087}`
      // );
    });

    //-比較過去 10 秒內的數值是否有變化
    const hasChanged = recentData.some(
      (doc) => doc.System["400086"] !== latestValue400086
    );
    //const hasChanged = false;

    if (hasChanged) {
      //console.log("數值有變化，狀態正常");
      const alarmId = "gc_rf10.System.400086";
      // 當數值改變時，更新異常記錄為恢復狀態
      currentValue = latestValue400086;
      currentTime = getCurrentTimeInUTC8();
      updateAlarmRecoveryStatus(alarmId, currentValue, currentTime);
      return;
    }
    //若數值超過 10 秒未變化
    const allSame = recentData.every(
      (doc) => doc.System["400086"] === latestValue400086
    );
    //const allSame = true;
    if (allSame) {
      // 檢查是否已存在未恢復的異常記錄
      const existingAlarm = await getAlarmById("gc_rf10.System.400086");
      if (existingAlarm && !existingAlarm.recover) {
        console.log("已有未恢復的異常記錄，無需新增");
        return;
      }
      console.log("數值超過 10 秒未變化，記錄異常");
      const hisalarmId = generateFixedId();
      const alarmData = {
        _id: "gc_rf10.System.400086",
        db_name: "gc_rf10",
        time: getCurrentTimeInUTC8(),
        location: "Control Room",
        device: "DC/GC",
        tag: "400086",
        level: "Alarm",
        content: "HeartBeat b/w GC/DC Fault",
        value: latestValue400086,
        read: false,
        recover: false,
        recover_time: "",
        occurrence_time: getCurrentTimeInUTC8(),
        category: "system",
        line_notify: false,
        hisalarm_id: hisalarmId,
      };
      await saveToDB(alarmData);
      //console.log("測試異常輸出，不發警報", alarmData);
    } // else {
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
      previousAlarm.line_notify = FALSE;

      await updateAlarmDB(previousAlarm);
    }
  } catch (error) {
    console.error("監控時發生錯誤:", error);
  }
}

// function startMonitoring400086() {
//   // 每 10 秒執行一次 monitorSystem400086
//   setInterval(async () => {
//     console.log("監測啟動 400086...");
//     await monitorSystem400086();
//   }, 5 * 1000); // 10,000 毫秒等於 10 秒
// }

// 啟動監控
//startMonitoring400086();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let previousValue = null; // 儲存前一次的數值
let sameValueCount = 0; // 用於計算數值未變化的次數
async function monitorAndUpdate400087() {
  try {
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

      // 如果數值超過 3 次未變化，記錄異常
      if (sameValueCount >= 4) {
        console.log("數值超過 3 次未變化，記錄異常");
        const alarmData = {
          _id: "gc_rf10.System.400087",
          db_name: "gc_rf10",
          time: getCurrentTimeInUTC8(),
          location: "Control Room",
          device: "EMS/DC/GC",
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
        await saveToDB(alarmData);
        sameValueCount = 0; // 重置計數器
      }
    } else {
      sameValueCount = 0; // 如果數值改變，重置計數器
      const alarmId = "gc_rf10.System.400087";
      currentTime = getCurrentTimeInUTC8();
      updateAlarmRecoveryStatus(alarmId, currentValue, currentTime);
    }

    // 對數值 +1
    const newValue = (currentValue + 1) % 10000;

    //console.log(`最新 400087 數值: ${currentValue}，更新後數值: ${newValue}`);

    // 取得 dwctrl 資料庫中最新的文檔 (確保獲取最新 _rev)
    let dwctrlDocuments = await dwctrlDb.find({
      selector: {},
      fields: [
        "_id",
        "_rev",
        "System",
        "time",
        "API",
        "Schedule",
        "lc1",
        "lc2",
        "lc3",
        "lc4",
        "HVAC1",
        "HVAC2",
        "ACB1",
        "ACB2",
        "ACB3",
        "ACB4",
      ],
      sort: [{ time: "desc" }],
      limit: 1,
    });

    if (!dwctrlDocuments.docs || dwctrlDocuments.docs.length === 0) {
      console.log("無法取得 dwctrl 資料庫的最新資料");
      return;
    }

    const dwctrlLatest = dwctrlDocuments.docs[0];
    dwctrlLatest.System["W400087"] = newValue;

    // 自動重試更新
    await updateDocumentWithRetry(dwctrlLatest);

    // 更新前一次的值
    previousValue = currentValue;
  } catch (error) {
    console.error("監控或更新 400087 時發生錯誤:", error);
  }
}

/**
 * 嘗試更新 CouchDB 文檔，處理 409 衝突並自動重試
 */
async function updateDocumentWithRetry(doc, retryCount = 3) {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      // 取得最新的文檔版本
      const latestDoc = await dwctrlDb.get(doc._id);
      doc._rev = latestDoc._rev; // 更新 _rev，確保 CouchDB 不會衝突

      // 更新文檔
      const response = await dwctrlDb.insert(doc);
      //console.log(`更新成功 (嘗試次數: ${attempt})`, response);
      return; // 成功後退出函數
    } catch (error) {
      if (error.statusCode === 409) {
        //console.warn(`更新衝突，嘗試重新獲取最新版本 (第 ${attempt} 次重試)`);
        if (attempt === retryCount) {
          console.error("多次重試仍發生衝突，放棄更新");
        }
      } else {
        //console.error("更新失敗，非 409 錯誤:", error);
        break; // 如果是其他錯誤，直接中止
      }
    }
  }
}

// 啟動每 5 秒執行一次的監控
// function startMonitoring400087() {
//   setInterval(async () => {
//     await monitorAndUpdate400087();
//   }, 5000); // 每 5 秒執行一次
// }

// 啟動監控
//startMonitoring400087();

function startMonitoring() {
  console.log("心跳監控啟用");
  setInterval(async () => {
    await monitorAndUpdate400087();
  }, 5000); // 每 5 秒執行一次
  setInterval(async () => {
    await monitorSystem400086();
  }, 5000); // 每 5 秒執行一次
}

startMonitoring();

module.exports = {
  startMonitoring,
};
