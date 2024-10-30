// const mqtt = require("mqtt");
// const moment = require("moment");
// const cron = require("node-cron"); // 用於定時任務
// require("dotenv").config();
// const config = require("./config");
// const systemInfoConfig = config.systemInfo;
// const couchdbConfig = config.database;

// const nano = require("nano")(
//   `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
// );

// const powerusage = "powerusage";
// const powerusageDb = nano.use(powerusage);
// const other_rf01 = "other_rf01";
// const rf01Db = nano.use(other_rf01);

// const brokerUrl = "mqtt://211.75.8.118:31883";
// const mqttOptions = {
//   clientId: `thing:XAkypU1zk`,
//   username: "XAkypU1zk",
//   password: "ogQetykSLrGesW-y",
//   clean: false,
//   connectTimeout: 10000,
//   reconnectPeriod: 5000,
//   protocolVersion: 4, // MQTT 3.1.1
//   keepalive: 10, // 心跳間隔 60 秒
//   qos: 1, // 使用 QoS 1，確保訊息到達
//   protocol: "mqtt",
// };

// console.log("MQTT.js 開始執行");

// // 定義 client
// console.log("MQTT Options:", mqttOptions);
// const client = mqtt.connect(brokerUrl, mqttOptions);

// console.log("Attempting to connect to MQTT broker...");
// console.log("Current time:", moment().format());

// // 定義 get_storage_aggregated_daily_period 函數
// async function get_storage_aggregated_daily_period() {
//   const now = moment();
//   const specifiedTime = moment().toISOString(true);
//   console.log(`每十五分鐘回傳資料指定時間: ${specifiedTime}`);

//   const filter = {
//     selector: {
//       time: { $exists: true },
//     },
//     sort: [{ time: "desc" }],
//     limit: 1,
//   };

//   const existingData = await rf01Db.find(filter);
//   if (existingData.docs.length > 0) {
//     const data = existingData.docs[0];
//     console.log("從資料庫獲得到的data", data);

//     const payload1 = {
//       upload_timestamp: specifiedTime,
//       device_timestamp: data.time || 0,
//       accumulated_charge_benefit: 0,
//       accumulated_discharge_benefit: 0,
//       date_charge_benefit: 0,
//       date_discharge_benefit: 0,
//       instantaneous_frequency: data.Freq["408026"] || 0,
//       instantaneous_power: data.Freq["408019"] || 0,
//       total_real_power_input: data.Freq["408028"] || 0,
//       total_real_power_output: data.Freq["408030"] || 0,
//       total_reactive_power_output: data.Freq["408032"] || 0,
//       total_reactive_power_input: data.Freq["408034"] || 0,
//       operating_status: 2,
//       grid_connection_status: 2,
//       voltage: data.Freq["408007"] || 0,
//       current: data.Freq["408017"] || 0,
//     };
//     return { result: true, payload1: payload1 };
//   } else {
//     const payload1 = {
//       upload_timestamp: specifiedTime,
//       device_timestamp: 0,
//       accumulated_charge_benefit: 0,
//       accumulated_discharge_benefit: 0,
//       date_charge_benefit: 0,
//       date_discharge_benefit: 0,
//       instantaneous_frequency: 0,
//       instantaneous_power: 0,
//       total_real_power_input: 0,
//       total_real_power_output: 0,
//       total_reactive_power_output: 0,
//       total_reactive_power_input: 0,
//       operating_status: 0,
//       grid_connection_status: 0,
//       voltage: 0,
//       current: 0,
//     };
//     return { result: false, payload1: payload1 };
//   }
// }

// // 定義 get_storage_daily_summary 函數
// async function get_storage_daily_summary() {
//   const specifiedTime = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
//   const targetDay = moment().subtract(1, "days").format("YYYY-MM-DD");
//   console.log(`Fetching power usage data for date: ${targetDay}`);
//   const filter = {
//     selector: {
//       type: "D",
//       date: targetDay,
//     },
//     limit: 1,
//   };

//   const existingData = await powerusageDb.find(filter);
//   if (existingData.docs.length > 0) {
//     const data = existingData.docs[0];
//     console.log("Fetched data:", data);

//     const payload2 = {
//       upload_timestamp: specifiedTime,
//       device_summary_date: data.date || 0,
//       date_charge: data.day_kWh_Import || 0,
//       date_discharge: data.day_kWh_Export || 0,
//       rte_rate: data.kWh_RTE || 0,
//       date_charge_benefit: 0,
//       date_discharge_benefit: 0,
//     };
//     return { result: true, payload2: payload2 };
//   } else {
//     const payload2 = {
//       upload_timestamp: specifiedTime,
//       device_summary_date: 0,
//       date_charge: 0,
//       date_discharge: 0,
//       rte_rate: 0,
//       date_charge_benefit: 0,
//       date_discharge_benefit: 0,
//     };

//     return { result: false, payload2: payload2 };
//   }
// }

// // MQTT Broker 連結
// client.on("connect", async () => {
//   console.log("Connected to MQTT broker at", brokerUrl);

//   // 第一次啟動時發送 get_storage_aggregated_daily_period 資料
//   try {
//     const topic1_info = await get_storage_aggregated_daily_period();
//     const testMessage = topic1_info.payload1;
//     console.log(
//       `Publishing initial message to $thing/5_QMtiYCh/XAkypU1zk/$data/storage_aggregated_daily_period`
//     );

//     client.publish(
//       "$thing/5_QMtiYCh/XAkypU1zk/$data/storage_aggregated_daily_period",
//       JSON.stringify(testMessage),
//       { qos: 1 },
//       (err) => {
//         if (err) {
//           console.error("Failed to publish initial message to topic1:", err);
//         } else {
//           console.log("Initial message published to topic1 successfully");
//         }
//       }
//     );
//   } catch (error) {
//     console.error(
//       "Error while fetching or publishing initial data from get_storage_aggregated_daily_period:",
//       error
//     );
//   }

//   // 第一次啟動時發送 get_storage_daily_summary 資料
//   try {
//     const topic2_info = await get_storage_daily_summary();
//     const testMessage2 = topic2_info.payload2;
//     console.log(
//       `Publishing initial message to $thing/5_QMtiYCh/XAkypU1zk/$data/storage_daily_summary`
//     );

//     client.publish(
//       "$thing/5_QMtiYCh/XAkypU1zk/$data/storage_daily_summary",
//       JSON.stringify(testMessage2),
//       { qos: 1 },
//       (err) => {
//         if (err) {
//           console.error("Failed to publish initial message to topic2:", err);
//         } else {
//           console.log("Initial message published to topic2 successfully");
//         }
//       }
//     );
//   } catch (error) {
//     console.error(
//       "Error while fetching or publishing initial data from get_storage_daily_summary:",
//       error
//     );
//   }

//   // topic1_info 每 15 分鐘發送一次
//   cron.schedule("*/15 * * * *", async () => {
//     console.log("每15分鐘的資料傳送");

//     try {
//       const topic1_info = await get_storage_aggregated_daily_period();
//       const testMessage = topic1_info.payload1;
//       console.log(
//         `Publishing message to $thing/5_QMtiYCh/XAkypU1zk/$data/storage_aggregated_daily_period`
//       );

//       client.publish(
//         "$thing/5_QMtiYCh/XAkypU1zk/$data/storage_aggregated_daily_period",
//         JSON.stringify(testMessage),
//         { qos: 1 },
//         (err) => {
//           if (err) {
//             console.error("Failed to publish message to topic1:", err);
//           } else {
//             console.log("Message published to topic1 successfully");
//           }
//         }
//       );
//     } catch (error) {
//       console.error(
//         "Error while fetching or publishing data from get_storage_aggregated_daily_period:",
//         error
//       );
//     }
//   });

//   // topic2_info 每天凌晨 3 點發送一次
//   cron.schedule("0 3 * * *", async () => {
//     console.log("每天凌晨 3 點的資料傳送");

//     try {
//       const topic2_info = await get_storage_daily_summary();
//       const testMessage2 = topic2_info.payload2;
//       console.log(
//         `Publishing message to $thing/5_QMtiYCh/XAkypU1zk/$data/storage_daily_summary`
//       );

//       client.publish(
//         "$thing/5_QMtiYCh/XAkypU1zk/$data/storage_daily_summary",
//         JSON.stringify(testMessage2),
//         { qos: 1 },
//         (err) => {
//           if (err) {
//             console.error("Failed to publish message to topic2:", err);
//           } else {
//             console.log("Message published to topic2 successfully");
//           }
//         }
//       );
//     } catch (error) {
//       console.error(
//         "Error while fetching or publishing data from get_storage_daily_summary:",
//         error
//       );
//     }
//   });
// });
