const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const userrecordSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  time: Date,
  record: {
    mail: String,
    event: String,
  },
});

const USERHIS = mongoose.model("USERHIS", userhisSchema);
module.exports = Student;
