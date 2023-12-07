const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
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
});

const User = mongoose.model("User", userSchema);
module.exports = User;
