// 'use strict'

module.exports = {
  app: {
    port: 3000
  },
  database: {
    //host: "192.168.1.10", // EMS1
    host: "192.168.1.12", // EMS2
    port: 5984,
    username: "admin",
    password: "ems45877096",
    account: "account",
    config: "CONFIG",
    log: "log",
    door: "log_door",
    lc: 4,
    initialization: [
      "account",
      "alarm",
      "dc_rf10",
      "dwctrl",
      "gc_rf01",
      "gc_rf10",
      "hisalarm",
      "lc1_rf10",
      "lc2_rf10",
      "lc3_rf10",
      "lc4_rf10",
      "log",
      "log_door",
      "monthly_report",
      "other_rf01",
      "other_rf10",
      "report",
      "year_report"
    ]
  },
  mustdatabase: {}
};
