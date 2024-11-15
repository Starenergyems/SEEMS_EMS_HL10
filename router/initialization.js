// 引入設定檔和 nano 套件
const config = require("./config.js");
const nano = require("nano")(
  `http://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}`
);

const DB_URL = `http://${config.database.host}:${config.database.port}/`;
const AUTHORIZATION =
  "Basic " +
  Buffer.from(
    `${config.database.username}:${config.database.password}`
  ).toString("base64");

// 初始化資料庫清單
const dbList = config.database.initialization;

// 時間索引定義
const indexDef = {
  index: { fields: ["time"] },
  name: "time_index",
};

// 資料庫檢查與建立函式
async function dbcheck() {
  for (const dbName of dbList) {
    const db = nano.db.use(dbName);

    try {
      await nano.db.get(dbName);
      console.log(`Database '${dbName}' already exists.`);
    } catch (error) {
      // 若資料庫不存在則建立
      if (error.statusCode === 404) {
        console.log(`Creating database '${dbName}'...`);
        await nano.db.create(dbName);
        console.log(`Database '${dbName}' created successfully.`);
      } else {
        console.error(`Failed to check database '${dbName}':`, error);
      }
    }

    // 建立時間索引
    try {
      await db.createIndex(indexDef);
      console.log(`Index 'time_index' created for database '${dbName}'.`);
    } catch (indexError) {
      console.error(`Failed to create index on '${dbName}':`, indexError);
    }
  }
}

// 執行資料庫檢查與建立
dbcheck()
  .then(() => {
    console.log("Database initialization completed.");
  })
  .catch((error) => {
    console.error("An error occurred during database initialization:", error);
  });
