const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const alarmSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
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
  recover_time: {
    type: Date,
  },
});

const Alarm = mongoose.model("Alarm", alarmSchema, "hisalarm");
module.exports = Alarm;
