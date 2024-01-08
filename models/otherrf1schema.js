const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984"); // 替換成你的CouchDB連線URL
const other_rf1 = "other_rf1"; // 替換成你的CouchDB數據庫名稱
//const DBother_rf10 = nano.use(other_rf10);
const nanoDb = nano.use(other_rf1);

const other1DocModel = {
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

const Other1 = (data) => {
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
    if (Array.isArray(body) && body.includes(other_rf1)) {
      console.log("Other1: Connection to CouchDB successful!");
    } else {
      // 如果數據庫不存在，可以在這裡創建
      nano.db.create(other_rf1, (createErr) => {
        if (createErr && createErr.statusCode !== 412) {
          console.error("Error creating database:", createErr);
        } else {
          console.log("Other1: Database created or already exists");
        }
      });
    }
  }
});

module.exports = { Other1 };
