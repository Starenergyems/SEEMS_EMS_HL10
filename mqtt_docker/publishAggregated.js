// const mqtt = require("mqtt");
// const moment = require("moment");
// const cron = require("node-cron"); // 定時任務
// require("dotenv").config();
// const config = require("../router/config");
// const brokerUrl = `mqtt://${process.env.MQTT_URL}:${process.env.MQTT_PORT}`;
// //const brokerUrl = "mqtt://13.213.175.24:30545";

// const systemInfoConfig = config.systemInfo;
// const couchdbConfig = config.database;

// const nano = require("nano")(
//   `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
// );

// const token = process.env.TOKEN;
// const mqttOptions = {
//   clientId: process.env.MQTT_CLIENT_ID,
//   username: process.env.MQTT_IDENTITY,
//   password: process.env.MQTT_SECRET,
//   clean: false,
//   connectTimeout: 10000,
//   reconnectPeriod: 5000,
//   protocolVersion: 4,
//   keepalive: 10,
//   qos: 1,
//   protocol: "mqtt",
// };

// console.log("MQTT Options:", mqttOptions);
// console.log("MQTT.js 開始執行");

// // 建立 MQTT 連線
// const client = mqtt.connect(brokerUrl, mqttOptions);

// console.log("嘗試連接到 MQTT broker...");
// console.log("當前時間:", moment().format());

// const gc_rf10 = "gc_rf10";
// const gcDb = nano.use(gc_rf10);
// const other_rf01 = "other_rf01";
// const other_rf01Db = nano.use(other_rf01);

// const mangoQuery = {
//   selector: {
//     time: { $exists: true },
//   },
//   sort: [{ time: "desc" }],
//   limit: 1,
// };

// // 通用函式: 取得指定資料庫的最新一筆數據，並提取特定鍵的值
// async function get_latest_data_from_db(dbName, keys) {
//   try {
//     const db = nano.use(dbName);
//     const result = await db.find(mangoQuery);
//     if (result.docs.length > 0) {
//       const latestData = result.docs[0];
//       let extractedData = {};

//       keys.forEach((key) => {
//         const keyParts = key.split(".");
//         let value = latestData;
//         for (const part of keyParts) {
//           if (value && value[part] !== undefined) {
//             value = value[part];
//           } else {
//             value = null;
//             break;
//           }
//         }
//         extractedData[key] = value;
//       });

//       return extractedData;
//     }
//     return null; // 若無數據則回傳 null
//   } catch (error) {
//     console.error(`Error fetching data from ${dbName}:`, error);
//     throw error;
//   }
// }

// // 測試函式
// // (async () => {
// //   try {
// //     const gcKeys = ["System.400037", "IEC61850.400161"];
// //     const gcData = await get_latest_data_from_db("gc_rf10", gcKeys);
// //     console.log("Extracted GC Data:", gcData);
// //     console.log("Extracted GC Data:", gcData["System.400037"]);
// //     console.log("Extracted GC Data:", gcData["IEC61850.400161"]);

// //     const freqKeys = ["Freq.408025"];
// //     const freqData = await get_latest_data_from_db("other_rf01", freqKeys);
// //     console.log("Extracted Frequency Data:", freqData);
// //   } catch (error) {
// //     console.error("Error in fetching data:", error);
// //   }
// // })();

// //連接成功後，開始發送數據
// client.on("connect", async () => {
//   console.log("成功連接至 MQTT broker:", brokerUrl);

//   const site_id = process.env.PaaS_SITE_ID;
//   console.log("環境變數 PaaS_SITE_ID:", site_id);
//   const username = process.env.PaaS_MQTT_USERNAME;
//   console.log("環境變數 PaaS_MQTT_USERNAME:", username);

//   const topic = `$thing/${site_id}/${username}/$data/aggregated_daily_period`;

//   console.log(`發佈資料到 MQTT 主題: ${topic}`);

//   // 立即發送一次數據
//   try {
//     const payload = {
//       upload_timestamp: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
//       reports: [
//         {
//           device_timestamp: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
//           instantaneous_frequency: 100,
//           instantaneous_power: 100,
//           instantaneous_reactive_power: 100,
//           total_charge: 500000,
//           total_discharge: 500000,
//           voltage: 1100,
//           current: 100,
//           base_freq: 60,
//           sbspm: 99,
//         },
//       ],
//     };

//     client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
//       if (err) {
//         console.error("初始數據發送失敗:", err);
//         console.log(payload);
//       } else {
//         console.log("成功發送初始數據");
//         console.log(payload);
//       }
//     });
//   } catch (error) {
//     console.error("發送初始數據時發生錯誤:", error);
//   }
// });

const mqtt = require("mqtt");
const moment = require("moment");
const cron = require("node-cron"); // 定時任務
require("dotenv").config();
const config = require("../router/config");
const brokerUrl = `mqtt://${process.env.MQTT_URL}:${process.env.MQTT_PORT}`;
//const brokerUrl = "mqtt://13.213.175.24:30545";

const systemInfoConfig = config.systemInfo;
const couchdbConfig = config.database;

const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

const token = process.env.TOKEN;
const mqttOptions = {
  clientId: process.env.MQTT_CLIENT_ID,
  username: process.env.MQTT_IDENTITY,
  password: process.env.MQTT_SECRET,
  clean: true,
  connectTimeout: 10000,
  reconnectPeriod: 5000,
  protocolVersion: 4,
  keepalive: 10,
  qos: 1,
  protocol: "mqtt",
};

console.log("MQTT Options:", mqttOptions);
console.log("MQTT.js 開始執行");

// 建立 MQTT 連線
const client = mqtt.connect(brokerUrl, mqttOptions);

console.log("嘗試連接到 MQTT broker...");
console.log("當前時間:", moment().format());

const gc_rf10 = "gc_rf10";
const gcDb = nano.use(gc_rf10);
const other_rf01 = "other_rf01";
const other_rf01Db = nano.use(other_rf01);

const mangoQuery = {
  selector: {
    time: { $exists: true },
  },
  sort: [{ time: "desc" }],
  limit: 1,
};

// 通用函式: 取得指定資料庫的最新一筆數據，並提取特定鍵的值
// async function get_latest_data_from_db(dbName, keys) {
//   try {
//     const db = nano.use(dbName);
//     const result = await db.find(mangoQuery);
//     if (result.docs.length > 0) {
//       const latestData = result.docs[0];
//       let extractedData = {};

//       keys.forEach((key) => {
//         const keyParts = key.split(".");
//         let value = latestData;
//         for (const part of keyParts) {
//           if (value && value[part] !== undefined) {
//             value = value[part];
//           } else {
//             value = null;
//             break;
//           }
//         }
//         extractedData[key] = value;
//       });

//       return extractedData;
//     }
//     return null; // 若無數據則回傳 null
//   } catch (error) {
//     console.error("Error fetching data from ${dbName}:", error);
//     throw error;
//   }
// }

// // 測試函式
// (async () => {
//   try {
//     const gcKeys = ["System.400037", "IEC61850.400161"];
//     const gcData = await get_latest_data_from_db("gc_rf10", gcKeys);
//     console.log("Extracted GC Data:", gcData);

//     const freqKeys = ["Freq.408025"];
//     const freqData = await get_latest_data_from_db("other_rf01", freqKeys);
//     console.log("Extracted Frequency Data:", freqData);
//   } catch (error) {
//     console.error("Error in fetching data:", error);
//   }
// })();

//連接成功後，開始發送數據
client.on("connect", async () => {
  console.log("成功連接至 MQTT broker:", brokerUrl);
  console.log("MQTT 連線狀態:", client.connected);

  const site_id = process.env.PaaS_SITE_ID;
  console.log("環境變數 PaaS_SITE_ID:", site_id);
  const username = process.env.PaaS_MQTT_USERNAME;
  console.log("環境變數 PaaS_MQTT_USERNAME:", username);

  const topic = `$thing/${site_id}/${username}/$data/aggregated_daily_period`;
  console.log("實際 MQTT topic:", topic);
  console.log(`發佈資料到 MQTT 主題: ${topic}`);

  // 立即發送一次數據
  try {
    const payload = {
      upload_timestamp: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      reports: [
        {
          device_timestamp: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
          instantaneous_frequency: 100,
          instantaneous_power: 100,
          instantaneous_reactive_power: 100,
          total_charge: 500000,
          total_discharge: 500000,
          voltage: 1100,
          current: 100,
          base_freq: 60,
          sbspm: 99,
        },
      ],
    };

    client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
      if (err) {
        console.error("MQTT 發送失敗:", err.message);
        console.log("Payload:", payload);
        console.log("Topic:", topic);
      } else {
        console.log("MQTT 發送成功，Topic:", topic);
        console.log(payload);
      }
    });
  } catch (error) {
    console.error("發送初始數據時發生錯誤:", error);
  }

  // 每分鐘發送一次聚合數據
  cron.schedule("* * * * *", async () => {
    console.log("每分鐘發送聚合數據");

    try {
      const payload = {
        upload_timestamp: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        reports: [
          {
            device_timestamp: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
            instantaneous_frequency: 1000,
            instantaneous_power: 100,
            instantaneous_reactive_power: 100,
            total_charge: 550000,
            total_discharge: 100,
            voltage: 100,
            current: 100,
            base_freq: 60,
            sbspm: 100,
          },
        ],
      };

      client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
        if (err) {
          console.error("數據發送失敗:", err);
          console.log(payload);
        } else {
          console.log("數據發送成功");
          console.log(payload);
        }
      });
    } catch (error) {
      console.error("發送數據時發生錯誤:", error);
    }
  });
});
