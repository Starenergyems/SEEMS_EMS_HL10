const os = require("os");

// 獲取網絡介面資訊
const networkInterfaces = os.networkInterfaces();

// 使用標誌來控制網絡資訊只輸出一次
let isInfoLogged = false;

Object.entries(networkInterfaces).forEach(([name, interfaces]) => {
  interfaces.forEach((iface) => {
    // 過濾掉內部 (localhost) 和非IPv4的介面
    if (iface.family === "IPv4" && !iface.internal && !isInfoLogged) {
      console.log(`介面名稱: ${name}`);
      console.log(`IP地址: ${iface.address}`);
      console.log(`MAC地址: ${iface.mac}`);
      console.log("作業系統:", os.type());
      console.log("平台:", os.platform());
      console.log("核心版本:", os.release());
      console.log("架構:", os.arch());
      console.log("總記憶體 (MB):", (os.totalmem() / 1024 / 1024).toFixed(2));
      console.log("空閒記憶體 (MB):", (os.freemem() / 1024 / 1024).toFixed(2));
      console.log("CPU 型號:", os.cpus()[0].model);
      console.log("CPU 核心數:", os.cpus().length);
      console.log("系統執行時間 (秒):", os.uptime());
      console.log("使用者資訊:", os.userInfo());
      console.log("網絡介面資訊:", os.networkInterfaces());

      // 設置標誌為 true，停止後續輸出
      isInfoLogged = true;
    }
  });
});

// 定時監控記憶體使用狀態
setInterval(() => {
  const totalMemMB = (os.totalmem() / 1024 / 1024).toFixed(2);
  const freeMemMB = (os.freemem() / 1024 / 1024).toFixed(2);
  const usedMemMB = (totalMemMB - freeMemMB).toFixed(2);
  const memoryUsagePercent = ((usedMemMB / totalMemMB) * 100).toFixed(2);

  console.log("\n=== 記憶體使用狀態 ===");
  console.log(`總記憶體 (MB): ${totalMemMB}`);
  console.log(`已使用記憶體 (MB): ${usedMemMB}`);
  console.log(`空閒記憶體 (MB): ${freeMemMB}`);
  console.log(`記憶體使用率 (%): ${memoryUsagePercent}`);
}, 10000); // 每10秒輸出一次
