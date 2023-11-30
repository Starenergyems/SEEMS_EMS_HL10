const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  time: Date,
  user_id: String,
  account: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    default: "EMS@1234",
    minLength: [8, "密碼少於八個字元!"],
  },
  name: {
    type: String,
    required: true,
  },
  company: {
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
  note: {
    type: Number,
    default: 0,
  },
  last_time: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = Student;
