require("dotenv").config();
const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_BROKER_URL, {
  port: process.env.MQTT_PORT,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  siteid: process.env.SITE_ID,
});

console.log("MQTT_BROKER_URL:", process.env.MQTT_BROKER_URL);
console.log("MQTT_PORT:", process.env.MQTT_PORT);
console.log("MQTT_USERNAME:", process.env.MQTT_USERNAME);
console.log("MQTT_PASSWORD:", process.env.MQTT_PASSWORD);
console.log("siteid:", process.env.SITE_ID);

// client.on("connect", () => {
//   console.log("Connected to PaaS MQTT Broker");
//   client.publish(
//     "$thing/local_site/username/$data/modules_daily_period_report",
//     "Data from Node.js to Mosquitto"
//   );
// });

// client.on("error", (err) => {
//   console.error("MQTT Error:", err);
// });

client.on("connect", () => {
  console.log("Connected to MQTT Broker");

  // 訂閱自己發送的 Topic
  client.subscribe(
    "thing/site_id/username/data/modules_daily_period_report",
    (err) => {
      if (!err) {
        console.log("Subscribed to topic!");
      }
    }
  );

  // 發送訊息
  client.publish(
    "thing/site_id/username/data/modules_daily_period_report",
    "Hello from Node.js! 02"
  );
  client.publish("thing/site_id/username/data/test", "Hello from Node.js! A");
  console.log("client publish done.");
});

client.on("message", (topic, message) => {
  console.log(`Received message from ${topic}: ${message.toString()}`);
});
