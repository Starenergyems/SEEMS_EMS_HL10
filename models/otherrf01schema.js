const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984"); // 替換成你的CouchDB連線URL
const other_rf01 = "other_rf01"; // 替換成你的CouchDB數據庫名稱
//const DBother_rf10 = nano.use(other_rf10);
const nanoDb = nano.use(other_rf01);

const other01DocModel = {
  _id: String,
  time: Date,
  Freq: {
    408001: Number,
    408003: Number,
    408005: Number,
    408007: Number,
    408009: Number,
    408011: Number,
    408013: Number,
    408015: Number,
    408017: Number,
    408019: Number,
    408021: Number,
    408023: Number,
    408025: Number,
    408026: Number,
    408028: Number,
    408030: Number,
    408032: Number,
    408034: Number,
    time_log: Date,
  },
};

const Other01 = (data) => {
  return new Promise((resolve, reject) => {
    nanoDb.insert(data, (err, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
};

nano.db.list((err, body) => {
  if (err) {
    console.error("Error listing databases:", err);
  } else {
    if (Array.isArray(body) && body.includes(other_rf01)) {
      console.log("Other1: Connection to CouchDB successful!");
    } else {
      // 如果數據庫不存在，可以在這裡創建
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

//要插入的用戶數據

const userDocument = {
  _id: "hudfewu", // 替換成唯一的用戶ID
  time: new Date(),
  timestamp: new Date().getTime(),
  Freq: {
    408001: 1,
    408003: 2,
    408005: 3,
    408007: 7,
    408009: 9,
    408011: 11,
    408013: 13,
    408015: 15,
    408017: 17,
    408019: 19,
    408021: 21,
    408023: 23,
    408025: 25,
    408026: 27,
    408028: 28,
    408030: 30,
    408032: 32,
    408034: 34,
  },
};

// 插入用戶數據到 CouchDB
// 插入用戶數據到 CouchDB
Other01(userDocument)
  .then((body) => {
    console.log("User document inserted successfully. ID:", body.id);
  })
  .catch((err) => {
    console.error("Error inserting user document:", err.message);
  });

module.exports = { Other01, other01DocModel };
