const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984"); // 替換成你的CouchDB連線URL
const other_rf10 = "other_rf10"; // 替換成你的CouchDB數據庫名稱
const nanoDb = nano.use(other_rf10);

const other10DocModel = {
  _id: String, // 使用字串而不是 mongoose.Types.ObjectId
  time: Date,
  AuxMtot: {
    408069: Number,
    408071: Number,
    408073: Number,
    408075: Number,
    time_log: Date,
  },
  AuxM1: {
    408077: Number,
    408078: Number,
    408079: Number,
    408080: Number,
    408081: Number,
    408082: Number,
    408083: Number,
    408084: Number,
    408085: Number,
    408086: Number,
    408087: Number,
    408088: Number,
    time_log: Date,
  },
  AuxM2: {
    408077: Number,
    408078: Number,
    408079: Number,
    408080: Number,
    408081: Number,
    408082: Number,
    time_log: Date,
  },
  AuxM3: {
    408077: Number,
    408078: Number,
    408079: Number,
    408080: Number,
    408081: Number,
    408082: Number,
    time_log: Date,
  },
  AuxM4: {
    408077: Number,
    408078: Number,
    408079: Number,
    408080: Number,
    408081: Number,
    408082: Number,
    time_log: Date,
  },
  AuxM5: {
    408077: Number,
    408078: Number,
    408079: Number,
    408080: Number,
    408081: Number,
    408082: Number,
    time_log: Date,
  },
  AuxM6: {
    408077: Number,
    408078: Number,
    408079: Number,
    408080: Number,
    408081: Number,
    408082: Number,
    time_log: Date,
  },
  AuxM7: {
    408077: Number,
    408078: Number,
    408079: Number,
    408080: Number,
    408081: Number,
    408082: Number,
    time_log: Date,
  },
  AuxM8: {
    408077: Number,
    408078: Number,
    408079: Number,
    408080: Number,
    408081: Number,
    408082: Number,
    time_log: Date,
  },
  AuxMMVCB: {
    408077: Number,
    408078: Number,
    408079: Number,
    408080: Number,
    408081: Number,
    408082: Number,
    time_log: Date,
  },
  UPSEMS: {
    408151: Number,
    408152: Number,
    408153: Number,
    408154: Number,
    time_log: Date,
  },
  UPSCCTV: {
    408155: Number,
    408156: Number,
    408157: Number,
    408158: Number,
    time_log: Date,
  },
  UPSMVCB: {
    408159: Number,
    408160: Number,
    408161: Number,
    408162: Number,
    time_log: Date,
  },
  UPSACP: {
    408163: Number,
    408164: Number,
    408165: Number,
    408166: Number,
    time_log: Date,
  },
  TR1: {
    408181: Number,
    time_log: Date,
  },
  TR2: {
    408181: Number,
    time_log: Date,
  },
  TR3: {
    408181: Number,
    time_log: Date,
  },
  TR4: {
    408181: Number,
    time_log: Date,
  },
  TRAux: {
    408181: Number,
    time_log: Date,
  },
  THMVCB: {
    408186: Number,
    408187: Number,
    time_log: Date,
  },
  RelayMVCB: {
    408201: Number,
    408202: Number,
    time_log: Date,
  },
  RelayVCB1: {
    408203: Number,
    time_log: Date,
  },
  RelayVCB2: {
    408203: Number,
    time_log: Date,
  },
  RelayVCB3: {
    408203: Number,
    time_log: Date,
  },
  RelayVCB4: {
    408203: Number,
    time_log: Date,
  },
  RelayVCBAUX: {
    408203: Number,
    time_log: Date,
  },
  FFS: {
    408204: Number,
    time_log: Date,
  },
  VCB_StatusMVCB: {
    408205: Number,
    time_log: Date,
  },
  VCB_StatusVCB1: {
    408205: Number,
    time_log: Date,
  },
  VCB_StatusVCB2: {
    408205: Number,
    time_log: Date,
  },
  VCB_StatusVCB3: {
    408205: Number,
    time_log: Date,
  },
  VCB_StatusVCB4: {
    408205: Number,
    time_log: Date,
  },
  VCB_StatusVCBAUX: {
    408205: Number,
    time_log: Date,
  },
  ACB_Status: {
    408206: Number,
    408207: Number,
    time_log: Date,
  },
};

// 插入數據
const Other10 = (data) => {
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

// 確認資料庫是否存在
nano.db.list((err, body) => {
  if (err) {
    console.error("Error listing databases:", err);
  } else {
    if (Array.isArray(body) && body.includes(other_rf10)) {
      console.log("Other10: Connection to CouchDB successful!");
    } else {
      // 如果數據庫不存在，可以在這裡創建
      nano.db.create(other_rf10, (createErr) => {
        if (createErr && createErr.statusCode !== 412) {
          console.error("Error creating database:", createErr);
        } else {
          console.log("Other10: Database created or already exists");
        }
      });
    }
  }
});

module.exports = { Other10, nanoDb, other10DocModel };
