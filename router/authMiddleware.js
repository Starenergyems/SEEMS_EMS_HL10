const crypto = require("crypto");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userschema");
const dotenv = require("dotenv");

dotenv.config(); // 載入環境變數

// 使用環境變數中的密鑰或生成新的密鑰
const jwtSecretKey = process.env.JWT_SECRET || generateRandomKey();

function generateRandomKey() {
  return crypto.randomBytes(32).toString("hex");
}

const authMiddleware = async (req, res, next) => {
  try {
    // 從 cookie 中取得 token
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/login"); // 若沒有 token，導向登入頁面
    }

    // 驗證 token
    const decoded = jwt.verify(token, jwtSecretKey);

    // 查找使用者
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.redirect("/login"); // 若找不到使用者，導向登入頁面
    }

    // 將使用者資訊附加到 req 物件，以便其他路由使用
    req.user = user;

    next(); // 繼續執行下一個 middleware 或路由處理
  } catch (error) {
    console.error("Authentication error:", error);
    return res.redirect("/login");
  }
};

module.exports = authMiddleware;
