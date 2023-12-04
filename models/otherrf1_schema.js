const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
const { ObjectId } = mongoose.Types;
// 創建一個Mongoose模式
const lcSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
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
});
