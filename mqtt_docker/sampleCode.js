require("dotenv").config();
const mqtt = require("mqtt");

// 讀取環境變數
const MQTT_BROKER_URL = process.env.PaaS_MQTT_BROKER_URL;
const MQTT_PORT = process.env.PaaS_MQTT_PORT || 31883;
const SITE_ID = process.env.PaaS_SITE_ID;

const client = mqtt.connect(`mqtt://${MQTT_BROKER_URL}:${MQTT_PORT}`, {
  username: process.env.PaaS_MQTT_USERNAME,
  password: process.env.PaaS_MQTT_PASSWORD,
  keepalive: 60,
  reconnectPeriod: 1000, // 1秒重新連線
});

// 連線成功時
client.on("connect", () => {
  console.log("MQTT 連線成功");

  // 訂閱來自雲端的指令
  const commandTopic = `$thing/${SITE_ID}/${MQTT_USERNAME}/$cmd/#`;
  client.subscribe(commandTopic, (err) => {
    if (!err) {
      console.log(`已訂閱指令 Topic: ${commandTopic}`);
    }
  });

  // 每 1 分鐘上傳聚合數據
  setInterval(() => {
    publishAggregatedData();
  }, 60000);
});

// 當接收到來自雲端的控制指令時
client.on("message", (topic, message) => {
  console.log(`收到指令 [${topic}]:`, message.toString());
});

// 聚合數據發佈函數
function publishAggregatedData() {
  const topic = `$thing/${SITE_ID}/${MQTT_USERNAME}/$data/aggregated_daily_period`;
  const payload = JSON.stringify({
    upload_timestamp: new Date().toISOString(),
    reports: [
      {
        device_timestamp: new Date().toISOString(),
        instantaneous_frequency: 50.0,
        instantaneous_power: 100.0,
        total_charge: 5000.0,
        total_discharge: 4000.0,
        voltage: 220.0,
        current: 10.0,
        base_freq: 50.0,
        sbspm: 99,
      },
    ],
  });

  client.publish(topic, payload, { qos: 1 }, (err) => {
    if (!err) {
      console.log(`成功發佈數據到 ${topic}`);
    }
  });
}
