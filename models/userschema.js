const nano = require("nano")("http://admin:ems45877096@192.168.1.10:5984"); // 替換成你的CouchDB連線URL
const account = "account"; // 替換成你的CouchDB數據庫名稱
const DBaccount = nano.use(account);

// 定義CouchDB文檔模型
const userDocModel = {
  _id: String,
  time: Date,
  user: {
    num: String,
    mail: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["general", "sysadmin", "accadmin"],
      required: true,
      default: "general",
    },
    state: {
      type: String,
      required: true,
      enum: ["normal", "deactivate"],
      default: "normal",
    },
    errcount: {
      type: Number,
      required: true,
      default: 0,
    },
    note: {
      type: String,
      default: "",
    },
    last_time: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
      default: "EMS@1234",
      minLength: [8, "密碼少於八個字元!"],
    },
  },
};

// 將Mongoose模型轉換為CouchDB文檔模型
const createOrUpdateUserDoc = async (user) => {
  try {
    const response = await DBaccount.insert(user, user._id); // 使用用户ID作为文档ID
    console.log(
      `User document created/updated successfully. ID: ${response.id}`
    );
  } catch (error) {
    console.error("Error creating/updating user document:", error.message);
  }
};

module.exports = { createOrUpdateUserDoc, userDocModel };
// 要插入的用戶數據
// const userDocument = {
//   _id: "SE0010", // 替換成唯一的用戶ID
//   time: new Date(),
//   timestamp: new Date().getTime(),
//   user: {
//     num: "SE0010",
//     mail: "user02@example.com",
//     name: "SE0010",
//     department: "EMS2",
//     level: "accadmin",
//     state: "normal",
//     errcount: "0",
//     note: "",
//     last_time: new Date(),
//     password: "EMS@1234567",
//     // ... 其他字段 ...
//   },
// };

// // 插入用戶數據到 CouchDB
// DBaccount.insert(userDocument, userDocument._id, (err, body) => {
//   if (err) {
//     console.error("Error inserting user document:", err.message);
//   } else {
//     console.log("User document inserted successfully. ID:", body.id);
//   }
// });
