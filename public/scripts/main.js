// public/main.js
//用於處理Ajax請求和更新畫面：
$(document).ready(function () {
  // 使用Ajax向後端發送請求取得資料
  $.ajax({
    url: "/api/getData",
    method: "GET",
    success: function (data) {
      // 處理從後端收到的資料
      // 更新畫面
      // ...
    },
  });

  // 其他相關處理邏輯
  // ...
});
