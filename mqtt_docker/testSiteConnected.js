// - 測試本機連線
const axios = require("axios");
const mqtt = require("mqtt");

const API_SITE_INFO = "http://60.250.39.131:50051/api/se_data/site_info";

// **步驟 1：請求 Site Info API，獲取 MQTT 資料**
async function getMQTTConfig(site_id) {
  try {
    const response = await axios.get(`${API_SITE_INFO}/${site_id}`);
    const mqttInfo = response.data.mqtt_info_list[0];
    return {
      brokerUrl: `mqtt://${mqttInfo.mqtt_url}:${mqttInfo.port}`,
      username: mqttInfo.mqtt_identity,
      password: mqttInfo.mqtt_secret,
      clientId: mqttInfo.mqtt_client_id,
      topics: mqttInfo.mqtt_topic_list,
    };
  } catch (error) {
    console.error(
      "獲取 MQTT 配置失敗：",
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

// **步驟 2：使用 MQTT 連接**
async function connectToMQTT(site_id) {
  const mqttConfig = await getMQTTConfig(site_id);
  if (!mqttConfig) {
    console.log("無法獲取 MQTT 配置，連線失敗");
    return;
  }

  // 使用配置連線 MQTT Broker
  const client = mqtt.connect(mqttConfig.brokerUrl, {
    username: mqttConfig.username,
    password: mqttConfig.password,
    clientId: mqttConfig.clientId,
  });

  // 連線成功
  client.on("connect", () => {
    console.log("MQTT 連線成功！");

    // 訂閱所有主題
    mqttConfig.topics.forEach((topic) => {
      if (topic.action_type === "subscribe") {
        client.subscribe(topic.topic_path, (err) => {
          if (!err) {
            console.log(`成功訂閱主題：${topic.topic_path}`);
          }
        });
      }
    });
  });

  // 收到訊息
  client.on("message", (topic, message) => {
    console.log(`收到主題 ${topic} 的訊息：${message.toString()}`);
  });

  // 錯誤處理
  client.on("error", (err) => {
    console.error("MQTT 連線失敗：", err.message);
  });
}

// **測試用例**
connectToMQTT("ry83LpsPyl");
