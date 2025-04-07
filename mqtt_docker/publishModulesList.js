const mqtt = require("mqtt");
const moment = require("moment");
require("dotenv").config();
const config = require("../router/config");
const brokerUrl = `mqtt://${process.env.MQTT_URL}:${process.env.MQTT_PORT}`;

const couchdbConfig = config.database;

const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

const mqttOptions = {
  clientId: process.env.MQTT_CLIENT_ID,
  username: process.env.MQTT_IDENTITY,
  password: process.env.MQTT_SECRET,
  clean: false,
  connectTimeout: 10000,
  reconnectPeriod: 5000,
  protocolVersion: 4,
  keepalive: 10,
  qos: 1,
  protocol: "mqtt",
};

console.log("MQTT.js 開始執行");

// 建立 MQTT 連線
const client = mqtt.connect(brokerUrl, mqttOptions);

console.log("嘗試連接到 MQTT broker...");
console.log("當前時間:", moment().format());

client.on("connect", async () => {
  console.log("成功連接至 MQTT broker:", brokerUrl);

  const site_id = process.env.PaaS_SITE_ID;
  console.log("環境變數 PaaS_SITE_ID:", site_id);
  const username = process.env.PaaS_MQTT_USERNAME;
  console.log("環境變數 PaaS_MQTT_USERNAME:", username);

  const topic = `$thing/${site_id}/${username}/$data/modules_list_report`;
  console.log(`發佈資料到 MQTT 主題: ${topic}`);

  // 生成設備列表
  let reports = [];

  // **PCS 7 台**
  const pcsList = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1"];
  pcsList.forEach((seq) => {
    reports.push({
      device_type: "PCS",
      site_device_seq: seq,
      site_device_name: `pcs-${seq}`,
      rate_power: 1725,
    });
  });

  // **BMS 7 台**
  const bmsList = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1"];
  bmsList.forEach((seq) => {
    reports.push({
      device_type: "BMS",
      site_device_seq: seq,
      site_device_name: `bms${seq}`,
    });
  });

  // **AuxM 9 台**
  const auxMList = [
    "AuxM_1-1",
    "AuxM_1-2",
    "AuxM_2-1",
    "AuxM_2-2",
    "AuxM_3-1",
    "AuxM_3-2",
    "AuxM_4-1",
    "AuxM_EMS",
    "AuxM_MVCB",
  ];
  auxMList.forEach((name, index) => {
    reports.push({
      device_type: "AuxM",
      site_device_seq: `${index + 1}`,
      site_device_name: name,
    });
  });

  // **TR 5 台**
  const trList = ["TR_1", "TR_2", "TR_3", "TR_4", "TR_Aux"];
  trList.forEach((name, index) => {
    reports.push({
      device_type: "TR",
      site_device_seq: `${index + 1}`,
      site_device_name: name,
    });
  });

  // 建立 payload
  const payload = {
    upload_timestamp: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    reports: reports,
  };

  // 發送至 MQTT
  client.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
    if (err) {
      console.error("數據發送失敗:", err);
      console.log(payload);
    } else {
      console.log("數據發送成功");
      console.log(payload);
    }
  });
});
