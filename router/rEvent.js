const express = require("express");
const router = express.Router();

// 路由定義
router.get("/", (req, res) => {
  res.send("這是路由1的回應");
});

// 其他路由定義...

module.exports = router;
