const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Lc01 = require("../models/lcschema");
const app = express(); // Create an Express application instance
const cors = require("cors");
const router = express.Router();
const {
  scaleProcess,
  mapchargeStatus,
  mapPCSWorkingStatus,
} = require("./function");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

router.use("/public", express.static(path.join(__dirname, "../public")));
router.use(
  "/operateinfo",
  express.static(path.join(__dirname, "../public/operateinfo"))
);
router.use(
  "/operateinfo/pcs",
  express.static(path.join(__dirname, "../public/operateinfo/pcs"))
);
router.use(
  "/operateinfo/pcs/alarm/:id",
  express.static(path.join(__dirname, "../public"))
);
// 共同的中間件，處理 /operateinfo/pcs/infodetail/1、2、3、4、5 及其子路徑下的靜態文件
router.use(
  "/operateinfo/pcs/infodetail/:id",
  express.static(path.join(__dirname, "../public"))
);

router.use(cors());

//pcs主頁
router.get("/operateinfo/pcs", async (req, res) => {
  res.render("Op_PCS_InfoSummary");
});

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/operateinfo/pcs/infodetail", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

//多台pcs狀態 更改數字即可
router.get("/operateinfo/pcs/InfoDetail/1", async (req, res) => {
  try {
    // 獲取當前連接的所有 collection 名稱
    const collections = mongoose.connection.collections;

    // 轉換為 collection 名稱的數組
    const collectionNames = Object.keys(collections);

    console.log("當前連接中的 collection 名稱：", collectionNames);

    // 從數據庫中查詢 Other1 資料
    const lcData = await Lc01.findOne().sort({ time_log: -1 });

    // 檢查是否有找到數據
    if (!lcData) {
      throw new Error("No data found");
    }

    // 定義屬性和相應的比例和小數點位數
    const scaleAndPointMapping = {
      403001: { scale: 0.1, point: 1 },
      403002: { scale: 0.1, point: 1 },
      403004: { scale: 0.1, point: 2 },
      403006: { scale: 0.1, point: 2 },
      403007: { scale: 1, point: 0 },
      403009: { scale: 1, point: 0 },
    };

    // 定義處理函數映射表
    const processFunctions = {
      403007: mapchargeStatus,
      403009: mapPCSWorkingStatus,
    };
    const data = {};
    //scaleProcess 是一個通用的轉換函數，可以應用在所有的屬性上，而 processFunctions 主要用於那些需要特殊處理的屬性。

    Object.entries(scaleAndPointMapping).forEach(
      ([property, { scale, point }]) => {
        const originalValue = lcData.PCS1[property];
        const scaledValue = scaleProcess(originalValue, scale, point);

        // 如果有定義對應的處理函數，則應用
        const processFunction = processFunctions[property];
        const processedValue = processFunction
          ? processFunction(scaledValue)
          : scaledValue;

        data[property] = processedValue;
      }
    );

    // 將數據傳遞給 EJS 模板，包括所有變數
    res.render("../views/test_meter", {
      overallFault: data["403001"],
      overallAlarm: data["403002"],
      Transformernodestatus: data["403004"], //暫無出現 先用描述暫代
      Transformeroiltemperature: data["403006"], //暫無出現 先用描述暫代
      HB_Counts: data["403007"],
      leakage: data["403009"],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//多台pcs警告
// router.get("/operateinfo/pcs/alarm/1", async (req, res) => {
// });

//* ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((())))))))

router.get("/operateinfo/pcs/infodetail/2", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/3", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/4", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/5", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/6", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/infodetail/7", async (req, res) => {
  res.render("Op_PCS_InfoDetail");
});

router.get("/operateinfo/pcs/alarm", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/1", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/2", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/3", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/4", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/5", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/6", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

router.get("/operateinfo/pcs/alarm/7", async (req, res) => {
  res.render("Op_PCS_Alarm");
});

// ~~~~~~~!!!!!!!!@@@@@@@@@@##########$$$$$$$$$$$$%%%%%%%%%^^^^^^^^^^^^^^&&&&&&&&&&&*********(((((((()))))))) */

module.exports = router;
