const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984"); // 替換成你的CouchDB連線URL
const other_rf01 = "other_rf01"; // 替換成你的CouchDB數據庫名稱
const nanoDb = nano.use(other_rf01);

//建立index
const indexDef = {
  index: { fields: ["time"] }, //基於time作為查詢條件
  name: "time_index",
};
const response = nanoDb.createIndex(indexDef);
console.log(response);

// 定義 Mango 查詢對象
const mangoQuery = {
  selector: {
    time: { $exists: true },
  },
  sort: [{ time: "desc" }],
  limit: 1,
};

//檢查並創建DB，服務是否成功連接，然後檢查指定的數據庫是否存在，如果不存在就創建一個新的
nano.db.list((err, body) => {
  if (err) {
    console.error("Error listing databases:", err);
  } else {
    if (Array.isArray(body) && body.includes(other_rf01)) {
      console.log("Other1: Connection to CouchDB successful!");
    } else {
      nano.db.create(other_rf01, (createErr) => {
        if (createErr && createErr.statusCode !== 412) {
          console.error("Error creating database:", createErr);
        } else {
          console.log("Other1: Database created or already exists");
        }
      });
    }
  }
});

nanoDb.find(mangoQuery, async (err, body) => {
  if (err) {
    console.error("Error:", err);
    //res.status(500).send("Internal Server Error");
    return;
  }
  // Handle the result
  const other1Data = body.docs; // 根據實際返回的數據結構進行調整
  console.log("AA----------------------------------------------AA");
  console.log(other1Data);
});

//插入數值到資料庫;
//const randomCouchDbId = generateRandomCouchDbId();
//console.log("Random CouchDB ID:", randomCouchDbId);
// const userDocument = {
//   //_id: "5afd5003ff9f7cb7d33da53f1502d7af", // 替換成唯一ID 不填寫就是由COUCH自己新增
//   time: new Date(),
//   timestamp: new Date().getTime(),
//   Freq: {
//     408001: 541,
//     408003: 543,
//     408005: 515,
//     408007: 512,
//     408009: 515,
//     408011: 5122,
//     408013: 534,
//     408015: 5145,
//     408017: 5157,
//     408019: 5114,
//     408021: 5141,
//     408023: 511,
//     408025: 518,
//     408026: 570,
//     408028: 521,
//     408030: 5111,
//     408032: 512,
//     408034: 98765421,
//   },
// };

// 插入用戶數據到 CouchDB
// nanoDb
//   .insert(userDocument) // 將 nanoDb 改為 nanoDb.insert
//   .then((body) => {
//     console.log("User document inserted successfully. ID:", body.id);
//   })
//   .catch((err) => {
//     console.error("Error inserting user document:", err.message);
//   });

// const response = await nanoDb.insert({
//   _id: "myid",
//   _rev: "1-23202479633c2b380f79507a776743d5",
//   happy: false,
// });
// function generateRandomCouchDbId() {
//   const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
//   const idLength = 32;
//   let id = "";

//   for (let i = 0; i < idLength; i++) {
//     const randomIndex = Math.floor(Math.random() * chars.length);
//     id += chars.charAt(randomIndex);
//   }

//   return id;
// }

// 查詢文檔
nanoDb.find(mangoQuery, async (err, body) => {
  if (err) {
    console.error("Error querying database:", err);
    // 處理錯誤，例如返回錯誤訊息
    return;
  }

  if (body.docs.length === 0) {
    console.log("Document not found.");
    // 處理文檔不存在的情況
    return;
  }

  // 獲取原始文檔數據
  const originalDocument = body.docs[0];

  // 取出 Freq 中所有的屬性名稱
  const freqKeys = Object.keys(originalDocument.Freq);

  // 輸出所有的屬性名稱
  console.log("BB----------------------------------------------BB");
  console.log("Freq 屬性名稱:", freqKeys);
  console.log("CC----------------------------------------------CC");

  for (const key of freqKeys) {
    // 取得每個屬性的值
    const value = originalDocument.Freq[key];

    // 在這裡可以對每個屬性的值進行操作，例如輸出或其他處理
    console.log(`屬性 ${key} 的值: ${value}`);
  }

  // 修改 Freq 中的 408034 數值，這裡假設你知道 408034 是存在於 Freq 中的屬性
  //originalDocument.Freq["408034"] = 98765421;

  // 更新文檔回資料庫
  // nanoDb.insert(originalDocument, (updateErr, updateBody) => {
  //   if (updateErr) {
  //     console.error("Error updating document:", updateErr);
  //     // 處理更新錯誤，例如返回錯誤訊息
  //     return;
  //   }

  //   console.log("Document updated successfully. ID:", updateBody.id);
  //   // 處理更新成功，例如返回成功訊息
  // });
});

module.exports = { nanoDb };

// const other01DocModel = {
//   _id: String,
//   time: Date,
//   Freq: {
//     408001: Number,
//     408003: Number,
//     408005: Number,
//     408007: Number,
//     408009: Number,
//     408011: Number,
//     408013: Number,
//     408015: Number,
//     408017: Number,
//     408019: Number,
//     408021: Number,
//     408023: Number,
//     408025: Number,
//     408026: Number,
//     408028: Number,
//     408030: Number,
//     408032: Number,
//     408034: Number,
//     time_log: Date,
//   },
// };
