// config.js

module.exports = {
  // 資料庫路徑設定
  // 辦公室用
  database: {
    host: "192.168.8.101",
    port: 5984,
    username: "admin",
    password: "ems45877096",
  },
  // 如果您要在不同的環境中使用不同的資料庫路徑，您可以在此進行配置，例如：
  //案場
  databaseForLoc: {
    host: "192.168.1.12",
    port: 5984,
    username: "admin",
    password: "ems45877096",
  },
};
