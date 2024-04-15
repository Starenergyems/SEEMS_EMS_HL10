const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const app = express();
const config = require("./config");
const couchdbConfig = config.database;
const moment = require('moment');

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
// 時間索引
const indexDef = {
  index: { fields: ["time"] },
  name: "time_index"
};

// 為資料庫創建時間索引
heartbeatDb.createIndex(indexDef);
// 初始設定
let satart = 0;
// 設備斷線計數器
let deviceBDisconnectedCount = 0;
// 判斷變化
let flag_Add = 0;

// 函數：初始化資料庫，設定初始值為0
async function initializeDB() {
  try {
    // 創建資料庫（如果不存在）
    await nano.db.create(heartbeat);
    console.log(`Database '${heartbeat}' created successfully.`);
  } catch (error) {
    if (error.statusCode === 412) {
      console.log(`Database '${heartbeat}' already exists.`);
    } else {
      console.error('Error creating database:', error);
    }
  }
}

// 函數：取得當前時間，格式化為指定格式
function getCurrentTime() {
  const now =  moment().format("YYYY-MM-DDTHH:mm:ss.000[Z]");
  return now ;
}

//初始化
function checkinitialize(){
  
}


async function checkDatabaseChanges() {
  let previousValue = null;

  // 不斷檢查資料庫數值是否有變化
  while (true) {
      // 讀取資料庫數值
      let EMS_Move = await heartbeatDb.get('EMS_Move');
      let Move_value = null;
      // 如果數值有變化，則回傳 1
      if (EMS_Move.value !== previousValue) {
          Move_value = EMS_Move.value;
          return Move_value;
          //return { moveValue: Move_value, previousValue: previousValue };
      }

      // 將目前數值設為前一次的數值，為下一輪比較做準備
      previousValue = EMS_Move.value;

      // 等待 100 毫秒再重新檢查
      await new Promise(resolve => setTimeout(resolve, 100));
  }
}


// 函數：程式1 - EMS 心跳加法
let cachedMoveValue = null; // 儲存最新的 Move_value

async function emsHeartbeatAddition() {
  let Move_value = cachedMoveValue; // 使用儲存的值

  try {
    if (!Move_value) {
      // 如果沒有儲存的值，則從數據庫中獲取
      Move_value = await checkDatabaseChanges();
      cachedMoveValue = Move_value; // 更新儲存的值
    }

    let EMS_Add = await heartbeatDb.get('EMS_Add');
    let Add_value = EMS_Add.value;    let EMS_Heartbeat = await heartbeatDb.get('EMS_Heartbeat');
    let Heartbeat_value = EMS_Heartbeat.value;

    if (EMS_Add.value < Move_value ) { // 修正比較的語法
      Add_value = Add_value + 1;
      const updatedData_EMS_Add = {
        _id: 'EMS_Add',
        last_updated: getCurrentTime(),
        value: Add_value
      };
      const updatedData_EMS_Heartbeat = {
        _id: 'EMS_Heartbeat',
        last_updated: getCurrentTime(),
        value: Move_value
      };

      await heartbeatDb.insert(updatedData_EMS_Add);
      await heartbeatDb.insert(updatedData_EMS_Heartbeat);
    }
    
    console.log('************************************');

  } catch (error) {
    console.error('Error in EMS heartbeat addition process:', error);
  }
}

// 初始執行一次以獲取最新的 Move_value
checkDatabaseChanges().then(value => {
  cachedMoveValue = value;
});

setInterval(emsHeartbeatAddition, 1000);

// // 函數：程式2 - DC 監控 EMS
// async function dcMonitorEMS() {
//     try {
//       // 讀取 EMS_add 和 EMS_move
//       const  EMS  = await heartbeatDb.get('EMS');
//       const { EMS_Add, EMS_Move } = await heartbeatDb.fetch({ keys: ['EMS_Add', 'EMS_Move'] });
      
//       // 檢查最後一次更新時間
//       const lastUpdate = new Date(EMS.last_updated);
//       const currentTime = new Date();
//       const timeDifference = (currentTime - lastUpdate) / 1000; // 計算時間差，單位為秒
      
//       // 比較 EMS_move 和 EMS_add 的值
//       if (EMS_move.value < EMS_Add.value) {
//         // 如果 EMS_move 大於 EMS_add，則將 EMS_add 的值賦予 EMS_move
//         await heartbeatDb.insert({ _id: 'EMS_move', EMS_move: EMS_Add.value });
//         console.log('DC monitoring EMS process completed.');
//       } else if (timeDifference > 5) {
//         // 如果超過5秒數值都不會增加，則報錯
//         console.error('EMS value is not increasing for more than 5 seconds.');
//       } else {
//         console.log('No update required in DC monitoring process.');
//       }
//     } catch (error) {
//       console.error('Error in DC monitoring EMS process:', error);
//     }
//   }
  

// // 主函數：執行兩個程式
// async function main() {
//   await initializeDB(); // 初始化資料庫
  
//   // 呼叫 EMS 心跳加法
//   setInterval(emsHeartbeatAddition, 5000); // 每隔 5 秒執行一次
  
//   // 呼叫 DC 監控 EMS
//   setInterval(dcMonitorEMS, 10000); // 每隔 10 秒執行一次
// }

// // 執行主函數
// main();



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// /// 設備的初始心跳值
// let deviceBHeartbeat = 0;
// let deviceB_move_Heartbeat = 0;
// let deviceCHeartbeat = 0;
// let deviceC_move_Heartbeat = 0;

// // 設備斷線計數器
// let deviceBDisconnectedCount = 0;
// let deviceCDisconnectedCount = 0;

// // 設備心跳檢測函数
// async function checkHeartbeat() {
//     try {
//         // 獲取設備B和C的初始心跳值
//         let deviceB = await heartbeatDb.get('deviceB');
//         let deviceB_move = await heartbeatDb.get('deviceB_move');
//         let deviceC = await heartbeatDb.get('deviceC');
//         let deviceC_move = await heartbeatDb.get('deviceC_move');

//         let deviceBHeartbeat = deviceB.heartbeat;
//         let deviceB_move_Heartbeat = deviceB_move.heartbeat;
//         let deviceCHeartbeat = deviceC.heartbeat;
//         let deviceC_move_Heartbeat = deviceC_move.heartbeat;

//         // 每秒讀取一次心跳值
//         setInterval(async () => {
//             // 模擬從設備B和C讀取心跳值的操作，這裡使用隨機數模擬
//             const newDeviceBHeartbeat = deviceB_move_Heartbeat;
//             const newDeviceCHeartbeat = deviceC_move_Heartbeat;
//             console.log("1  deviceB_move_Heartbeat: " + deviceB_move_Heartbeat);
//             console.log("2  deviceC_move_Heartbeat: " + deviceC_move_Heartbeat);

//             // 更新設備B的心跳值，並確保不超過5000
//             deviceBHeartbeat = newDeviceBHeartbeat <= 5000 ? newDeviceBHeartbeat : 0;
//             // 更新設備C的心跳值，並確保不超過5000
//             deviceCHeartbeat = newDeviceCHeartbeat <= 5000 ? newDeviceCHeartbeat : 0;

//             // 判斷設備B的心跳值是否增加了
//             if (deviceBHeartbeat === deviceB.heartbeat + 1) {
//                 deviceB.heartbeat = deviceBHeartbeat;
//                 deviceBDisconnectedCount = 0; // 重置斷線計數器
//             } else {
//                 deviceBDisconnectedCount++;
//             }

//             // 判斷設備C的心跳值是否增加了
//             if (deviceCHeartbeat === deviceC.heartbeat + 1) {
//                 deviceC.heartbeat = deviceCHeartbeat;
//                 deviceCDisconnectedCount = 0; // 重置斷線計數器
//             } else {
//                 deviceCDisconnectedCount++;
//             }

//             // 如果斷線計數器超過12，則輸出設備斷線信息
//             if (deviceBDisconnectedCount > 12) {
//                 console.log('Device B 斷線');
//                 deviceBDisconnectedCount = 0; // 重置斷線計數器
//             }

//             if (deviceCDisconnectedCount > 12) {
//                 console.log('Device C 斷線');
//                 deviceCDisconnectedCount = 0; // 重置斷線計數器
//             }

//             // 如果设备C的心跳值发生变化，则更新到数据库中
//             if (deviceC.heartbeat !== deviceCHeartbeat) {
//                 deviceC.heartbeat = deviceCHeartbeat;
//                 await heartbeatDb.insert(deviceC); // 更新设备C的心跳值到数据库中
//             }

//         }, 3000);
//     } catch (err) {
//         console.error(err);
//     }
// }

// checkHeartbeat();



// async function updateHeartbeat(deviceName) {
//     try {
//         // 從 deviceB_move 取出數值
//         const doc = await heartbeatDb.get(`${deviceName}_move`);
//         console.log("3  doc:",doc);
//         // 確保找到對應文檔並且有 heartbeat 字段
//         if (doc && doc.heartbeat !== undefined) {
//             // 將數值加1並限制在5000以內
//             const newHeartbeat = (doc.heartbeat + 1) % 5001;
//             // 更新到 deviceB 的 heartbeat 字段中
//             const updatedDoc = { ...doc, heartbeat: newHeartbeat };
//             console.log("4  updatedDoc"+updatedDoc)
//             await heartbeatDb.insert(updatedDoc, { _id: `${deviceName}` });

//         } else {
//             console.error(`No valid heartbeat found for ${deviceName}_move`);
//         }
//     } catch (err) {
//         // 檢查是否出現文檔更新衝突
//         if (err.error === 'conflict') {
//             console.log(`Document update conflict for ${deviceName}`);
//         } else {
//             console.error(`Error updating heartbeat for ${deviceName}:`, err);
//         }
//     }
// }

// // 每秒更新一次設備B和設備C的心跳值
// setInterval(async () => {
//     await updateHeartbeat('deviceB');
//     await updateHeartbeat('deviceC');
// }, 3000);
