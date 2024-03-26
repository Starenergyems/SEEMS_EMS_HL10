// 'use strict'

module.exports = {
  // 資料庫路徑設定
  // 辦公室用
  database: {
    host: "192.168.8.101",
    port: 5984,
    username: "admin",
    password: "ems45877096",
    account: "account",
    config: "CONFIG",
    log: "log",
    door: "log_door",
  },
  //改為案場電腦用
  // app: {
  //   port: 3000,
  // },
  // database: {
  //   host: "192.168.1.10",
  //   port: 5984,
  //   username: "admin",
  //   password: "ems45877096",
  //   account: "account",
  //   config: "CONFIG",
  //   log: "log",
  //   door: "log_door",
  //   lc: 4,
  //   initailizedb: [
  //     "account",
  //     "alarm",
  //     "dc_rf10",
  //     "dwctrl",
  //     "gc_rf01",
  //     "gc_rf10",
  //     "hisalarm",
  //     "lc1_rf10",
  //     "lc2_rf10",
  //     "lc3_rf10",
  //     "lc4_rf10",
  //     "log",
  //     "log_door",
  //     "monthly_report",
  //     "other_rf01",
  //     "other_rf10",
  //     "report",
  //     "year_report",
  //   ],
  // },
  // mustdatabase: {},

  // const express = require("express");
  // const app = express();
  // const router = express.Router();

  // app.use(express.json());
  // app.set("view engine", "ejs");
  // app.use(express.urlencoded({ extended: true }));

  // const path = require("path");
  // app.set("views", path.join(__dirname, "../views"));
  // app.use("/public", express.static(path.join(__dirname, "../public")));

  // const methodOverride = require("method-override");
  // app.use(methodOverride("_method"));

  // const cors = require("cors");
  // app.use(cors());

  // const cookieParser = require('cookie-parser');
  // app.use(cookieParser());

  // module.exports = ;

  // config.js
  // config: {
  // const express = require("express");
  // const app = express();
  // const router = express.Router();
  // app.use(express.json()); // use to get json from ejs
  // app.set("view engine", "ejs");
  // app.use(express.urlencoded({ extended: true }));
  // const path = require("path");
  // app.set("views", path.join(__dirname, "../views"));
  // app.use("/public", express.static(path.join(__dirname, "../public")));
  // const methodOverride = require("method-override");
  // app.use(methodOverride("_method"));
  // const cors = require("cors");
  // app.use(cors());
  // const cookieParser = require('cookie-parser'); // use for cookies, if not req.cookies will undefined.
  // app.use(cookieParser());
  // }
  // 如果您要在不同的環境中使用不同的資料庫路徑，您可以在此進行配置，例如：
  //案場
  // databaseForLoc: {
  //   host: "192.168.1.12",
  //   port: 5984,
  //   username: "admin",
  //   password: "ems45877096",
  // },
};
