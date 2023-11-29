const mongoose = require("mongoose");
const { Schema } = mongoose;

const gcSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  age: {
    type: Number,
    default: 18,
    max: [80, "可能有點太老了喔。。。"],
    min: [0, "年齡不能小於0。。。"],
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, "學生merit scholarship太多了"],
      default: 0,
    },
    other: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
});

const GC = mongoose.model("GC", gcSchema);
module.exports = Student;
