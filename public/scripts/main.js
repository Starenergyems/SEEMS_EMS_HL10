//main.js
$(document).ready(function () {
  const socket = io(); // 初始化 socket.io

  // 使用Ajax向後端發送請求取得最新數據
  $.ajax({
    url: "/testforajax",
    method: "GET",
    success: function (data) {
      // 更新畫面
      updateUI(data);
    },
    error: function (error) {
      console.error(error);
    },
  });

  // 更新畫面的函式
  function updateUI(data) {
    // 更新C1、C2、C3數據
    // ...

    // 監聽來自後端的刷新事件，一旦收到就重新載入數據
    socket.on("refreshData", function () {
      $.ajax({
        url: "/testforajax",
        method: "GET",
        success: function (data) {
          // 更新畫面
          updateUI(data);
        },
        error: function (error) {
          console.error(error);
        },
      });
    });
  }
});
