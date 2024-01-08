const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
const hisalarmDBName = "hisalarm"; // 替換成你的 CouchDB 數據庫名稱
const DBhisalarm = nano.use(hisalarmDBName);

const alarmDocModel = {
  _id: String,
  time: Date,
  location: {
    type: String,
    required: true,
  },
  device: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ["警告", "錯誤"],
  },
  content: {
    type: String,
    required: true,
    minlength: 2,
  },
  value: {
    type: String,
    required: true,
  },
  ack: {
    type: String,
  },
  recovertime: {
    type: Date,
  },
  recover: {
    type: String,
  },
};

const Alarm = (data) => {
  return new Promise((resolve, reject) => {
    DBhisalarm.insert(data, (err, body) => {
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
    if (Array.isArray(body) && body.includes(hisalarmDBName)) {
      console.log("Alarmdb: Connection to CouchDB successful!");
    } else {
      // 如果數據庫不存在，可以在這裡創建
      nano.db.create(hisalarmDBName, (createErr) => {
        if (createErr && createErr.statusCode !== 412) {
          console.error("Error creating database:", createErr);
        } else {
          console.log("Alarmdb: Database created or already exists");
        }
      });
    }
  }
});

module.exports = { Alarm, alarmDocModel };
