const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
const ObjectId = mongoose.Types;

// 創建一個Mongoose模式
const dcSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  time: Date,
  LC1: {
    409101: Number,
    409102: Number,
    time_log: Date,
  },
  LC2: {
    409101: Number,
    409102: Number,
    time_log: Date,
  },
  LC3: {
    409101: Number,
    409102: Number,
    time_log: Date,
  },
  LC4: {
    409101: Number,
    409102: Number,
    time_log: Date,
  },
  Freq: {
    409103: Number,
    409104: Number,
    time_log: Date,
  },
  ACPM1: {
    409105: Number,
    409106: Number,
    time_log: Date,
  },
  ACPM2: {
    409105: Number,
    409106: Number,
    time_log: Date,
  },
  ACPM3: {
    409105: Number,
    409106: Number,
    time_log: Date,
  },
  ACPM4: {
    409105: Number,
    409106: Number,
    time_log: Date,
  },
  AuxMtot1: {
    409107: Number,
    409108: Number,
    time_log: Date,
  },
  AuxM1: {
    409109: Number,
    409110: Number,
    time_log: Date,
  },
  AuxM2: {
    409109: Number,
    409110: Number,
    time_log: Date,
  },
  AuxM3: {
    409109: Number,
    409110: Number,
    time_log: Date,
  },
  AuxM4: {
    409109: Number,
    409110: Number,
    time_log: Date,
  },
  AuxM5: {
    409109: Number,
    409110: Number,
    time_log: Date,
  },
  AuxM6: {
    409109: Number,
    409110: Number,
    time_log: Date,
  },
  AuxM7: {
    409109: Number,
    409110: Number,
    time_log: Date,
  },
  AuxM8: {
    409109: Number,
    409110: Number,
    time_log: Date,
  },
  AuxM9: {
    409109: Number,
    409110: Number,
    time_log: Date,
  },
  UPS1: {
    409111: Number,
    409112: Number,
    time_log: Date,
  },
  UPS2: {
    409111: Number,
    409112: Number,
    time_log: Date,
  },
  UPS3: {
    409111: Number,
    409112: Number,
    time_log: Date,
  },
  UPS4: {
    409111: Number,
    409112: Number,
    time_log: Date,
  },
  TR1: {
    409113: Number,
    409114: Number,
    time_log: Date,
  },
  TR2: {
    409113: Number,
    409114: Number,
    time_log: Date,
  },
  TR3: {
    409113: Number,
    409114: Number,
    time_log: Date,
  },
  TR4: {
    409113: Number,
    409114: Number,
    time_log: Date,
  },
  TR5: {
    409113: Number,
    409114: Number,
    time_log: Date,
  },
  TH1: {
    409115: Number,
    409116: Number,
    time_log: Date,
  },
  RelayMVCB: {
    409117: Number,
    409118: Number,
    time_log: Date,
  },
  RelayVCB1: {
    409119: Number,
    409120: Number,
    time_log: Date,
  },
  RelayVCB2: {
    409119: Number,
    409120: Number,
    time_log: Date,
  },
  RelayVCB3: {
    409119: Number,
    409120: Number,
    time_log: Date,
  },
  RelayVCB4: {
    409119: Number,
    409120: Number,
    time_log: Date,
  },
  RelayVCB5: {
    409119: Number,
    409120: Number,
    time_log: Date,
  },
  RIO_CtrlRoom: {
    409121: Number,
    409122: Number,
    time_log: Date,
  },
  RIO_MVCB_1: {
    409123: Number,
    409124: Number,
    time_log: Date,
  },
  RIO_MVCB_2: {
    409123: Number,
    409124: Number,
    time_log: Date,
  },
  RIO_ACP1: {
    409125: Number,
    409126: Number,
    time_log: Date,
  },
  RIO_ACP2: {
    409125: Number,
    409126: Number,
    time_log: Date,
  },
  RIO_ACP3: {
    409125: Number,
    409126: Number,
    time_log: Date,
  },
  RIO_ACP4: {
    409125: Number,
    409126: Number,
    time_log: Date,
  },
  GC1: {
    409127: Number,
    409128: Number,
    time_log: Date,
  },
  GC2: {
    409127: Number,
    409128: Number,
    time_log: Date,
  },
  HVAC1: {
    409129: Number,
    409130: Number,
    time_log: Date,
  },
  HVAC2: {
    409129: Number,
    409130: Number,
    time_log: Date,
  },
  Recloser: {
    409131: Number,
    409132: Number,
    time_log: Date,
  },
});
const DC = mongoose.model("DC", dcSchema, "dc");
module.exports = DC;
