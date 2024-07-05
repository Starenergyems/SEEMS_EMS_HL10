const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const app = express();
const config = require("./config");
const couchdbConfig = config.database;
const moment = require('moment');
const crypto = require('crypto');
const { sendLineNotify } = require("./line");
const { Console } = require("console");

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

// 連接到 CouchDB
const nano = require("nano")(
    `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const heartbeat = "heartbeat";
const heartbeatDb = nano.use(heartbeat);
const gc_rf10 = "gc_rf10";
const gc_rf10Db = nano.use(gc_rf10);
const test_alarm = "alarm";
const test_alarm_nanoDb = nano.use(test_alarm);

// 時間索引
const indexDef = {
    index: { fields: ["time"] },
    name: "time_index"
};

// 為資料庫創建時間索引
heartbeatDb.createIndex(indexDef);
gc_rf10Db.createIndex(indexDef);
// 初始設定
let flag = 0;

// 函數：取得當前時間，格式化為指定格式
function getCurrentTime() {
    const now = moment().format("YYYY-MM-DDTHH:mm:ss.000[Z]");
    return now;
}


// let countflag = 0;
// async function main(state) {
//     console.log("-------------------------------------------------------------------------");
//     console.log("main 函數執行中...");
//     let previousValue = 0;
//     let shouldRestart = false; // 添加一個變數來追蹤是否需要重新啟動迴圈
//     while (true) {
//         try {
//             if (shouldRestart) { // 檢查是否需要重新啟動迴圈
//                 shouldRestart = false; // 重置標誌
//                 continue; // 繼續下一輪迴圈
//             }

//             const result = await checkDatabaseChanges(previousValue);
//             console.log("main_result: ", result);

//             let move_value = result.value;
//             if (result.success === true &&  countflag === 0) {
//                 console.log("進入判斷，成功且第一次做");
//                 const Additionflag = await emsHeartbeatAddition();
//                 if (emsHeartbeatAddition.success === 1) {
//                     console.log("1");
//                     const add_result = await emsHeartbeatAddition()
//                     console.log("add_result",add_result)
//                     shouldRestart = true; // 設置標誌以指示重新啟動迴圈
//                     countflag = 1 ;
//                     continue; // 繼續下一輪迴圈
//                 }
//                 console.log("2");
//             } else if (result.success === false) {
//                 console.log("進入判斷，失敗");
//                 state.disconnectedTimes++;
//                 console.log("disconnectedTimes: ", state.disconnectedTimes);
//                 countflag = 0 ;
//                 if (state.disconnectedTimes >= 10) {
//                     console.log("斷線超過十次問詢");
//                 }
//             }
//             else{
//                 console.log("進入判斷，?????");
//             }

//             // 等待一段時間再繼續執行
//             await new Promise(resolve => setTimeout(resolve, 10000)); // 等待三秒
//         } catch (error) {
//             console.error('Error in main process:', error);
//         }
//     }
// }

// async function emsHeartbeatAddition() {
//     console.log("-------------------------------------------------------------------------");
//     console.log("emsHeartbeatAddition 執行中...");
    
//     try {
//         const result = await checkDatabaseChanges();
//         console.log("result: ", result);
//         console.log("-------------------------------------------------------------------------");
//         let Move_value = result.value;
//         let EMS_Add = await heartbeatDb.get('EMS_Add');
//         let Add_value = EMS_Add.value;

//         console.log("**輸出目前數值為:");
//         console.log("EMS_Add.value:", EMS_Add.value);
//         console.log("Move_value:", Move_value);
//         console.log("-------------------------------------------------------------------------");

//         if (Add_value < Move_value) {
//             console.log("EMS_Add.value < Move_value: ");
//             console.log(" EMS_Add.value: ", EMS_Add.value, " Move_value: ", Move_value,);
//             Add_value++;
//             const updatedData_EMS_Add = {
//                 _id: 'EMS_Add',
//                 _rev: EMS_Add._rev,
//                 last_updated: getCurrentTime(),
//                 value: Add_value
//             };
//             console.log("updatedData_EMS_Add: ", updatedData_EMS_Add);
//             await heartbeatDb.insert(updatedData_EMS_Add);
//             console.log("");

//             // 確認是否成功寫入資料庫，如果不成功則拋出錯誤
//             const insertionResult = await attemptInsert(updatedData_EMS_Add);

//             if (!insertionResult.success) {
//                 throw new Error("寫入失敗");
//             }

//             // 回到 main 函數的起點
//             return insertionResult; // 結束此函數，將控制權返回給主函數
//         }

//     } catch (error) {
//         console.error('Error in EMS heartbeat addition process:', error);
//         // 在這裡可以處理寫入失敗的情況，例如記錄日誌或者執行其他操作
//     }
// }


// // 嘗試將資料插入資料庫，返回成功或失敗的結果
// async function attemptInsert(data) {
//     try {
//         await heartbeatDb.insert(data);
//         return { success: true };
//     } catch (error) {
//         return { success: false, error: error };
//     }
// }

// let previousValue = 0;
// async function checkDatabaseChanges() {
//   console.log("-------------------------------------------------------------------------");
//   console.log("checkDatabaseChanges 執行中...");


//   try {
    
//       let EMS_Move = await heartbeatDb.get('EMS_Move');
//       let Move_value = 0;
//       console.log("previousValue: ",previousValue);
//       console.log("EMS_Move: ",EMS_Move);
//       console.log("EMS_Move.value: ",EMS_Move.value);
//       console.log("-------------------------------------------------------------------------");

//       if (EMS_Move && EMS_Move.value !== previousValue) {
//         console.log("Changes 1")
//           Move_value = EMS_Move.value;
//           previousValue = EMS_Move.value;
//           return { success: true, value: Move_value };
//       } else if (EMS_Move.value === previousValue) {
//         console.log("Changes 2")
//           previousValue = EMS_Move.value;
//           return { success: false, value: null };
//       }
//       else{
//         console.log("Changes 3")
//           return { success: false, value: null };
//       }
//   } catch (error) {
//       console.error('Error checking database changes:', error);
//       return "#"; // 返回 "#" 以表示發生錯誤
//   }
// }

// function generateRev() {
//   return crypto.randomBytes(16).toString('hex');
// }

// // 初始設定
// const state = { disconnectedTimes: 0 };

// 執行主函數
//main(state);

// 取得最新的兩筆文件
// 取得最新的兩筆文件
async function getLatestDocuments() {
    try {
        // 從資料庫中按時間排序取得最新的兩筆document
        const latestDocuments = await gc_rf10Db.find({
            selector: {},
            fields: ["_id", "System", "time"], // 包含必要的字段
            sort: [{"time": "desc"}], // 按時間排序
            limit: 3, // 取得最新的兩筆文件
            use_index: "time_index" // 使用time_index索引
        });

        // 將文件返回
        return latestDocuments.docs;
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
    }
}

// 比較最新兩筆文件的System屬性中的400086值
async function compareSystem400086() {
    try {
        // 取得最新兩筆文件
        const documents = await getLatestDocuments();
        console.log("documents: ",documents)
        if (documents.length >= 2) {
            // 取得兩筆文件中System屬性中的400086值
            const value1 = documents[0].System['400086'];
            const value1time = documents[0].time;
            const value2 = documents[1].System['400086'];
            const value2time = documents[1].time;
            const value3 = documents[2].System['400086'];
            console.log("value1: ",value1)
            console.log("value1time: ",value1time)
            console.log("value2: ",value2)
            console.log("value2time: ",value2time)
            // 比較大小
            if (value1 !== value2) {
                console.log("有變化");
            } else if (value1 < value2) {
            } else {
                console.log("錯誤 心跳死掉了");
                //壓資料到alarmdb&hisalarmdb
                //alarmdb要檢查有沒有舊有資料 如果有要進行修改 沒有的話要新增
                //his 配合alarm產生的資料進行新增 回復正常則要修改
            }
        } else {
            console.log("文件數量不足以進行比較");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 使用示例
compareSystem400086();



// async function checkDataIncrease(systemKey) {
//     try {
//         // 取得最新的兩筆資料
//         const response = await gc_rf10Db.view('design_doc', 'view_name', { limit: 2, descending: true });
//         const docs = response.rows.map(row => row.value);

//         // 如果資料筆數小於兩筆，則無法判斷，直接返回
//         if (docs.length < 2) {
//             console.log(`Insufficient data to check increase for ${systemKey}`);
//             return;
//         }

//         // 取得最新的數值
//         const latestDoc = docs[0];
//         const latestValue = latestDoc.System[systemKey];
//         const previousDoc = docs[1];
//         const previousValue = previousDoc.System[systemKey];
//         console.log("latestDoc",latestDoc);

//         // 比較最新與前一筆數值，檢查資料是否持續增加
//         if (latestValue <= previousValue) {
//             console.log(`${systemKey} 心跳沒增加`);
//         } else {
//             console.log(`${systemKey} 心跳增加`);
//         }
//     } catch (error) {
//         console.error(`Error checking data for ${systemKey}:`, error);
//     }
// }

// // 使用 setInterval 同時檢查 System.400086 和 System.400087
// function delprocessDocs() {
//     checkDataIncrease(400086);
//     checkDataIncrease(400087);
// }
  
// // 每 1 秒檢查一次
// setInterval(delprocessDocs, 1000);





