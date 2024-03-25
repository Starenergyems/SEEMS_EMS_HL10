const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
//const port = 3005;
const router = express.Router();
const app = express();
const cors = require("cors");
const moment = require("moment");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

//確認回傳的內容有那些
// freq hl_4-1_10MW.Other_RF01.Freq.408026
// active prower hl_4-1_10MW.Other_RF01.Freq.408019
// execute rate SBSPM hl_4-1_10MW.GC_RF10.System.400037
// soc hl_4-1_10MW.GC_RF01.IEC61850.400129

// 時間長度(即時圖)
// 搜尋時間:起始/結束/時間長度/時間間隔(歷史圖)

//****額外最後再加新增搜尋點位

const gc_rf01 = "gc_rf01";
const gc01Db = nano.use(gc_rf01); // 請注意這裡使用 nano.use() 來設定數據庫
const gc_rf10 = "gc_rf10";
const gc10Db = nano.use(gc_rf10); // 請注意這裡使用 nano.use() 來設定數據庫

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);

//以下app要改回router
router.get("/chart", (req, res) => {
  // num與fun
  res.redirect("/chart/realtime");
});

router.get("/chart/realtime", (req, res) => {
  res.render("Cht_RealTime");
});

let flag = 0; // 初始設定 flag 為 0

let lasttime_record; // 宣告一個變數用來儲存時間

router.get("/chart/realtime/edit", async (req, res) => {
  const Data = {
    freq: [],
    ActivePower: [],
    ExecuteRate: [],
    SOC: []
  };

  try {
    let last_second;
    let this_second;

    if (!lasttime_record) {
      // 如果還沒有記錄過時間，則設定第一次進入路由的時間範圍
      this_second = moment().toISOString(); // 當前時間
      last_second = moment(this_second).subtract(1, "seconds").toISOString(); // 前一秒的時間
      lasttime_record = last_second; // 記錄前一秒的時間
    } else {
      // 已經有記錄過時間，則使用上次記錄的時間範圍
      last_second = lasttime_record;
      this_second = moment().toISOString(); // 當前時間
      lasttime_record = this_second; // 更新時間範圍為這次進入的時間
    }

    const filter_now = {
      selector: {
        time: {
          $gte: last_second,
          $lte: this_second
        }
      }
    };

    console.log("lasttime_record " + lasttime_record);
    console.log("this_second " + this_second);

    const doc = await gc01Db.find(filter_now);
    //console.log("gc01Db.find() result:", doc);

    if (!doc || !doc.docs || doc.docs.length === 0) {
      console.error("Error: No document found.");
      return res.status(404).send("Not Found");
    }

    doc.docs.forEach((doc) => {
      const timestamp = doc.time;
      Data.freq.push({ x: timestamp, y: doc.IEC61850["400121"] });
      Data.ActivePower.push({ x: timestamp, y: doc.IEC61850["400123"] });
      Data.ExecuteRate.push({ x: timestamp, y: doc.IEC61850["400133"] });
      Data.SOC.push({ x: timestamp, y: doc.IEC61850["400129"] });
    });

    //console.log("Data " + JSON.stringify(Data));
    res.send(Data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/chart/history", (req, res) => {
  res.render("Cht_History");
});

router.post("/chart/history/edit", async (req, res) => {
  const Data = {
    freq: [],
    ActivePower: [],
    ExecuteRate: [],
    SOC: []
  };

  try {
    const { startTime, lengthOfTime, timeUnit } = req.body;

    if (timeUnit === "sec") {
      // 確認時間單位為秒時，限制 lengthOfTime 最大值為 3600
      const maxTimeInSeconds = 3600;
      const maxTimeInMilliseconds = maxTimeInSeconds * 1000; // 將秒轉換為毫秒
      const adjustedLengthOfTime =
        timeUnit === "sec"
          ? Math.min(lengthOfTime, maxTimeInSeconds)
          : lengthOfTime;

      // 計算結束時間
      const endTime = moment(startTime).add(adjustedLengthOfTime, timeUnit);

      const filter = {
        selector: {
          time: {
            $gte: startTime,
            $lte: endTime.format("YYYY-MM-DD HH:mm:ss") // 格式化結束時間
          }
        }
      };

      const doc = await gc10Db.find(filter);

      if (!doc || !doc.docs || doc.docs.length === 0) {
        console.error("Error: No document found.");
        return res.status(404).send("Not Found");
      }

      doc.docs.forEach((doc) => {
        const timestamp = doc.time;
        Data.freq.push({ x: timestamp, y: doc.IEC61850["400121"] });
        Data.ActivePower.push({ x: timestamp, y: doc.IEC61850["400123"] });
        Data.ExecuteRate.push({ x: timestamp, y: doc.IEC61850["400133"] });
        Data.SOC.push({ x: timestamp, y: doc.IEC61850["400129"] });
      });
    } else {
      let endTime;
      if (timeUnit === "minutes") {
        endTime = moment(startTime).add(lengthOfTime, "minutes");
      } else if (timeUnit === "hours") {
        endTime = moment(startTime).add(lengthOfTime, "hours");
      } else if (timeUnit === "days") {
        endTime = moment(startTime).add(lengthOfTime, "days");
      } else {
        // 如果時間單位不是秒、分、時、日，可能需要額外的處理
        console.error("Unsupported time unit:", timeUnit);
        return res.status(400).send("Bad Request: Unsupported time unit");
      }

      // 接下來的程式碼保持不變，使用 endTime 來篩選資料
      const filter = {
        selector: {
          time: {
            $gte: startTime,
            $lte: endTime.format("YYYY-MM-DD HH:mm:ss") // 格式化結束時間
          }
        }
      };
      const doc = await gc01Db.find(filter);

      if (!doc || !doc.docs || doc.docs.length === 0) {
        console.error("Error: No document found.");
        return res.status(404).send("Not Found");
      }

      doc.docs.forEach((doc) => {
        const timestamp = doc.time;
        Data.freq.push({ x: timestamp, y: doc.IEC61850["400121"] });
        Data.ActivePower.push({ x: timestamp, y: doc.IEC61850["400123"] });
        Data.ExecuteRate.push({ x: timestamp, y: doc.IEC61850["400133"] });
        Data.SOC.push({ x: timestamp, y: doc.IEC61850["400129"] });
      });
    }

    res.send(Data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

/*app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});*/
