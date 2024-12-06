module.exports = {
  app: {
    port: 3000,
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
      //帳號相關
      "account",
      //資料原始上傳
      "dc_rf10",
      "gc_rf01",
      "gc_rf10",
      "lc1_rf10",
      "lc2_rf10",
      "lc3_rf10",
      "lc4_rf10",
      "other_rf01",
      "other_rf10",
      //控制
      "dwctrl",
      //告警
      "test_alarm",
      "test_hisalarm",
      //紀錄
      "log",
      "log_door",
      //報表
      "powerusage",
      "report_hour",
      "report_day",
      "report_monthly",
      "report_year",
      //心跳與備援
      "heartbeat",
    ],
  },
  systemInfo: {
    serviceActivationTime: "2024-06-22",
    location: "Hualien Heping",
    DeviceCapacity: 10,
    PlaceNumber: "4-1",
  },
};
