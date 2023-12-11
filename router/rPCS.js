const express = require("express");
//const app = express();
const mongoose = require("mongoose");
const Schema = require("./models/lc_schema");
const methodOverride = require("method-override");
const path = require("path");
const port = 3000;
const router = express.Router();

mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結mongoDB....");
  })
  .catch((e) => {
    console.log(e);
  });

router.set("view engine", "ejs");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
router.use(express.static(path.join(__dirname, "public")));

// 創建一個Mongoose模型
const lcSchema = require("../models/lc_schema"); // 修改路徑
const LC = mongoose.model("LC", lcSchema);
//const DataModel = mongoose.model("Data", Schema, "account");

//設定路由
router.get("/operateinfo/pcs", async (req, res) => {
  try {
    // 從資料庫中獲取 LC 資料
    //const lcData = await LC.find(); // 假設你要獲取所有 LC 資料
    //const transValue = lcSchema.PCS1[403006].toString().split("");

    // 將資料傳遞到 EJS 模板或進行其他操作
    res.render("Op_PCS_InfoSummary", {
      // workStatus: lcSchema.System[403001],
      // onlineNum: lcSchema.System[403001],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/operateinfo/pcs", async (req, res) => {
  try {
    // 從資料庫中獲取 LC 資料
    const lcData = await LC.find(); // 假設你要獲取所有 LC 資料

    // 將資料傳遞到 EJS 模板或進行其他操作
    res.render("Op_PCS_InfoSummary", { lcData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//單台pcs狀態
router.get("/operateinfo/pcs/state", (req, res) => {
  // num與fun
  res.render("Op_PCS_InfoDetail");
});

//單台pcs警告
router.get("/operateinfo/pcs1/alarm", (req, res) => {
  // num與fun
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs1/state", (req, res) => {
  // num與fun
  res.render("Op_PCS_InfoDetail");
});

// //單台pcs警告
// router.get("/operateinfo/pcs1/alarm", (req, res) => {
//   // num與fun
//   res.render("Op_PCS_Alarm");
// });

// router.get("/operateinfo/pcs2/state", (req, res) => {
//   // num與fun
//   res.render("Op_PCS_InfoDetail");
// });

// //單台pcs警告
// router.get("/operateinfo/pcs2/alarm", (req, res) => {
//   // num與fun
//   res.render("Op_PCS_Alarm");
// });
