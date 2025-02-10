// 載入必要的模組
require("dotenv").config(); // 載入 .env 配置檔案
const mqtt = require("mqtt");

// ResourceManagerClient 類別
class ResourceManagerClient {
  constructor(brokerUrl, port) {
    // 確保 URL 包含協議
    this.brokerUrl = `${brokerUrl.startsWith("mqtt://") ? brokerUrl : "mqtt://" + brokerUrl}:${port}`;
    this.options = {};
    this.client = null;
  }

  // 配置客戶端
  configure({
    region,
    resource_type,
    site_id,
    username,
    password,
    install_in,
  }) {
    this.options = {
      region,
      resource_type,
      site_id,
      username,
      password,
      install_in,
    };

    // 配置 MQTT 客戶端選項
    this.mqttOptions = {
      clientId: site_id, // 用 site_id 作為客戶端 ID
      username, // MQTT 帳號
      password, // MQTT 密碼
      clean: true, // 保證乾淨的連線（無持久化會話）
    };
  }

  // 建立連接
  connect() {
    this.client = mqtt.connect(this.brokerUrl, this.mqttOptions);

    this.client.on("connect", () => {
      console.log(`成功連接到 MQTT Broker: ${this.brokerUrl}`);
      console.log(`配置資料:`, this.options);
    });

    this.client.on("error", (err) => {
      console.error(`MQTT 連接失敗: ${err.message}`);
    });

    this.client.on("message", (topic, message) => {
      console.log(`收到訊息：主題: ${topic}, 訊息: ${message.toString()}`);
    });
  }

  // 訂閱主題
  subscribe(topic) {
    if (this.client) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`訂閱失敗: ${topic}`);
        } else {
          console.log(`成功訂閱主題: ${topic}`);
        }
      });
    } else {
      console.error("尚未連接到 MQTT Broker，請先呼叫 connect()");
    }
  }

  // 發佈訊息
  publish(topic, message) {
    if (this.client) {
      this.client.publish(topic, message, (err) => {
        if (err) {
          console.error(`訊息發佈失敗: ${topic}`);
        } else {
          console.log(`成功發佈訊息到主題 ${topic}: ${message}`);
        }
      });
    } else {
      console.error("尚未連接到 MQTT Broker，請先呼叫 connect()");
    }
  }
}

// 從 .env 讀取配置
const brokerUrl = process.env.PaaS_MQTT_BROKER_URL;
const port = process.env.PaaS_MQTT_PORT;
const username = process.env.PaaS_MQTT_USERNAME;
const password = process.env.PaaS_MQTT_PASSWORD;
const siteId = process.env.PaaS_SITE_ID;

// 初始化 ResourceManagerClient
const client = new ResourceManagerClient(brokerUrl, port);

client.configure({
  region: "asia",
  resource_type: "solar",
  site_id: siteId,
  username: username,
  password: password,
  install_in: "/opt/mqtt",
});

// 建立連線
client.connect();

// 訂閱主題
client.subscribe("aggregated_daily_period");

// 發佈訊息
client.publish(
  "aggregated_daily_period",
  JSON.stringify({ power: 500, status: "ok" })
);
