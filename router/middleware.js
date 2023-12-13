// middleware.js

// 定義一個全區可用的中間件函數
const myMiddleware = (req, res, next) => {
  console.log("這是全區可用的中間件！");
  // 可以在這裡執行任何您需要的邏輯
  next(); // 繼續執行下一個中間件或路由處理程序
};

module.exports = {
  myMiddleware,
};
