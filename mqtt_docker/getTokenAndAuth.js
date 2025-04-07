require("dotenv").config();
const mqtt = require("mqtt");
const axios = require("axios");
const fs = require("fs"); // - 儲存到環境變數
// 讀取環境變數
const API_URL = process.env.API_URL;
const LOGIN_ID = process.env.PaaS_LOGIN_ID;
const SITE_ID = process.env.PaaS_SITE_ID;
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_PORT = process.env.MQTT_PORT || 1883;
const MQTT_Password = process.env.PaaS_MQTT_PASSWORD || 1883;

// * token的取得與儲存轉送方式
// - 先取得 Token
// async function getTokenAndConnect() {
//   try {
//     console.log("使用的 API_URL:", API_URL);

//     const response = await axios.post(`${API_URL}/api/se_data/login`, {
//       account: LOGIN_ID,
//       password: MQTT_Password,
//     });

//     if (response.data && response.data.token) {
//       console.log("成功獲取 Token:", response.data.token);
//     } else {
//       console.error("獲取 Token 失敗:", response.data);
//     }
//   } catch (error) {
//     console.error("API 請求錯誤:", error.message);
//   }
// }

// // 啟動流程
//getTokenAndConnect();

// - 方法1 直接取出並印出
// async function getToken() {
//   try {
//     const response = await axios.post(
//       `${API_URL}/api/se_data/login
// `,
//       {
//         account: LOGIN_ID,
//         password: MQTT_Password,
//       }
//     );

//     if (response.data && response.data.data && response.data.data.token_data) {
//       const token = response.data.data.token_data.token;
//       console.log("取得的 Token:", token);
//       return token;
//     } else {
//       console.error("獲取 Token 失敗:", response.data);
//       return null;
//     }
//   } catch (error) {
//     console.error("API 請求錯誤:", error.message);
//     return null;
//   }
// }

// // 測試取 Token
// getToken();

// - 方法2 只儲存到環境變數
// async function saveTokenToEnv() {
//   try {
//     const response = await axios.post(`${API_URL}/api/se_data/login`, {
//       account: LOGIN_ID,
//       password: MQTT_Password,
//     });

//     if (response.data && response.data.data && response.data.data.token_data) {
//       const token = response.data.data.token_data.token;
//       console.log("取得的 Token:", token);

//       // 寫入到 .env
//       fs.appendFileSync(".env", `\nTOKEN=${token}\n`);
//       console.log("Token 已儲存到 .env");
//     } else {
//       console.error("獲取 Token 失敗:", response.data);
//     }
//   } catch (error) {
//     console.error("API 請求錯誤:", error.message);
//   }
// }

// 執行儲存
//saveTokenToEnv();

// - 方法3 返回 Token，讓其他函數使用

// **檢查 Token 是否過期（提前 30 秒刷新）**
function isTokenExpired() {
  const expiresAt = process.env.EXPIRES_AT;
  if (!expiresAt) return true; // 無過期時間，視為過期

  const now = Math.floor(Date.now() / 1000); // 當前時間（秒）
  return now >= parseInt(expiresAt, 10) - 30; // 提前 30 秒刷新 Token
}

// **更新或追加 .env 變數**
function updateEnvVariable(key, value) {
  const envFilePath = ".env";
  let envContent = fs.existsSync(envFilePath)
    ? fs.readFileSync(envFilePath, "utf8")
    : "";

  const regex = new RegExp(`^${key}=.*`, "m"); // 檢查 key 是否已存在於 `.env`
  if (regex.test(envContent)) {
    // **若變數已存在，則替換舊值**
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    // **若變數不存在，則新增**
    envContent += `\n${key}=${value}`;
  }
  fs.writeFileSync(envFilePath, envContent.trim() + "\n"); // **確保最後有換行符**
  console.log(`✅ .env 變數已更新：${key}=${value}`);
}

// **取得並存儲 Token**
async function fetchNewToken() {
  try {
    console.log("🔄 正在獲取新 Token...");
    const response = await axios.post(`${API_URL}/api/se_data/login`, {
      account: LOGIN_ID,
      password: MQTT_Password,
    });

    if (response.data && response.data.data && response.data.data.token_data) {
      const token = response.data.data.token_data.token;
      const expiresAt = response.data.data.token_data.expires_at; // Unix Timestamp（秒）

      // **更新 .env 變數**
      updateEnvVariable("TOKEN", token);
      updateEnvVariable("EXPIRES_AT", expiresAt);

      return token;
    } else {
      console.error("❌ 獲取 Token 失敗:", response.data);
      return null;
    }
  } catch (error) {
    console.error("❌ API 請求錯誤:", error.message);
    return null;
  }
}

// **取得 Token**
async function getToken() {
  if (!isTokenExpired() && process.env.TOKEN) {
    console.log("✅ 使用已存的 Token");
    return process.env.TOKEN; // 若未過期，直接回傳 `.env` 內的 Token
  }

  console.log("🔄 Token 過期或不存在，重新獲取...");
  return await fetchNewToken(); // 重新獲取 Token
}

// - 在其他函數內使用token並將token應用於執行受保護 API 請求(含測試)
// async function startMQTT() {
//   const token = await getToken();
//   if (token) {
//     console.log("取得的 Token:", token);
//     // 這裡可以進一步用 token 連接 MQTT
//   } else {
//     console.log("無法取得 Token");
//   }
// }
//startMQTT();

// - 執行受保護 API 請求
// async function callProtectedAPI() {
//   const token = await getToken();
//   if (!token) {
//     console.log("無法取得 Token");
//     return;
//   }
//   try {
//     const response = await axios.get(
//       `${API_URL}/api/se_data/site_info/${SITE_ID}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       }
//     );
//     console.log("API 回應:", response.data);
//   } catch (error) {
//     console.error(
//       "API 請求失敗:",
//       error.response ? error.response.data : error.message
//     );
//   }
// }

// // 執行 API 請求
// callProtectedAPI();

// 執行受保護 API 請求

// **更新或追加 .env 變數**
function updateEnvVariable(key, value) {
  const envFilePath = ".env";
  let envContent = fs.existsSync(envFilePath)
    ? fs.readFileSync(envFilePath, "utf8")
    : "";

  const regex = new RegExp(`^${key}=.*`, "m"); // 檢查 key 是否已存在於 `.env`
  if (regex.test(envContent)) {
    // **若變數已存在，則替換舊值**
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    // **若變數不存在，則新增**
    envContent += `\n${key}=${value}`;
  }

  fs.writeFileSync(envFilePath, envContent.trim() + "\n"); // **確保最後有換行符**
  console.log(`✅ .env 變數已更新：${key}=${value}`);
}

// **取得站點資訊並存入 .env**
async function getSiteInfo() {
  const token = await getToken();
  if (!token) {
    console.log("❌ 無法取得 Token");
    return;
  }

  try {
    console.log("🔄 正在取得站點資訊...");
    const response = await axios.get(
      `${API_URL}/api/se_data/site_info/${SITE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (
      response.data &&
      response.data.data &&
      response.data.data.site_paas_info
    ) {
      const siteInfo = response.data.data.site_paas_info;

      // 解析站點基本資訊
      const siteName = siteInfo.site_basic_info.site_name;
      const regionId = siteInfo.site_basic_info.region_id;

      // 解析 MQTT 設定
      const mqttInfo = siteInfo.mqtt_info_list[0]; // 取第一組 MQTT 設定
      const mqttIdentity = mqttInfo.mqtt_identity;
      const mqttSecret = mqttInfo.mqtt_secret;
      const mqttClientId = mqttInfo.mqtt_client_id;
      const mqttUrl = mqttInfo.mqtt_url;
      const mqttPort = mqttInfo.port;

      // **更新 .env 變數**
      updateEnvVariable("SITE_NAME", siteName);
      updateEnvVariable("REGION_ID", regionId);
      updateEnvVariable("MQTT_IDENTITY", mqttIdentity);
      updateEnvVariable("MQTT_SECRET", mqttSecret);
      updateEnvVariable("MQTT_CLIENT_ID", mqttClientId);
      updateEnvVariable("MQTT_URL", mqttUrl);
      updateEnvVariable("MQTT_PORT", mqttPort);

      console.log("✅ 站點資訊已更新到 .env");
    } else {
      console.log("❌ API 回應異常:", response.data);
    }
  } catch (error) {
    console.error(
      "❌ API 請求失敗:",
      error.response ? error.response.data : error.message
    );
  }
}

// **執行 API 請求**
getSiteInfo();

module.exports = { getToken };
