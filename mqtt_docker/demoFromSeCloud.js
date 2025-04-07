const mqtt = require("mqtt");
const moment = require("moment");
const cron = require("node-cron"); // 用于定时任务
require("dotenv").config();
const brokerUrl = "mqtt://13.213.175.24:30545";
const mqttOptions = {
  clientId: `thing:H1w3UTsPke`,
  username: "H1w3UTsPke",
  password: "6.hnOmDx5Ei.jape",
  clean: false,
  connectTimeout: 10000,
  reconnectPeriod: 5000,
  protocolVersion: 4, // MQTT 3.1.1
  keepalive: 60, // 心跳間隔 60 秒
  qos: 1, // 使用 QoS 0，降低連線壓力
  protocol: "mqtt",
};
console.log("MQTT Options:", mqttOptions);
const client = mqtt.connect(brokerUrl, mqttOptions);
console.log("Attempting to connect to MQTT broker...");
console.log("Current time:", moment().format());
// MQTT Broker 連結
client.on("connect", () => {
  console.log("Connected to MQTT broker at", brokerUrl);

  // 添加測試消息
  //$thing/#site_id#/#username#/$data/aggregated_daily_period
  // $thing / ry83LpsPyl / H1w3UTsPke / $data / aggregated_daily_period;
  const topic1 = `$thing/ry83LpsPyl/H1w3UTsPke/$data/aggregated_daily_period`;
  const testMessage = "This is a test message";
  console.log(`Publishing test message to ${topic1}`);
  client.publish(topic1, testMessage, { qos: 1 }, (err) => {
    if (err) {
      console.error("Failed to publish message to test/topic:", err);
    } else {
      console.log("Message published to test/topic successfully");
      console.log("Test Payload:", testMessage);
    }
  });
});
