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

router.post("/chart/realtime/edit", async (req, res) => {
  const Freq_array = [];
  const ActivePower_array = [];
  const Execute_array = [];
  const SOC_array = [];
  const All_data = [];

  const last_second = moment() //改時間 原本是1
    .subtract(2, "seconds")
    .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

  const this_second = moment() //改時間 原本是1
    .subtract(1, "seconds")
    .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

  console.log("last_second " + last_second);
  console.log("this_second " + this_second);
  const filter_now = {
    selector: {
      time: {
        $gte: last_second, // 時間大於或等於 last_year_start
        $lte: this_second // 時間小於或等於 last_year_end
      }
    },
    limit: 10,
  };

  const Data = await gc01Db.find(filter_now);

  Freq_array.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400121"]));
  ActivePower_array.push(
    ...Data.docs.map((doc) => doc.IEC61850.rf01["400123"])
  );

  SOC_array.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400129"]));

  Execute_array.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400133"]));

  //存到同一個陣列
  All_data.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400121"]));
  All_data.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400123"]));
  All_data.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400129"]));
  All_data.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400133"]));

  console.log("A " + Freq_array);
  console.log("B " + ActivePower_array);
  console.log("C " + SOC_array);
  console.log("D " + Execute_array);
  console.log("E " + All_data);
  res.send(All_data);
});

router.get("/chart/history", (req, res) => {
  res.render("Cht_History");
});

router.get("/chart/history/edit", async (req, res) => {
  //async function test(){
  const startTime = moment(); //需要改成獲取前端的資料
  const lengthOfTime = 3600; //需要改成獲取前端的資料且處理 轉為秒 或是進來的就必須是秒
  const timeInterval = 1; //目前預設是一秒
  const Freq_array = [];
  const ActivePower_array = [];
  const Execute_array = [];
  const SOC_array = [];
  const All_data = [];

  const Start_Time = startTime.format("YYYY-MM-DDTHH:mm:ss.000[Z]");

  const End_Time = moment()
    .subtract(lengthOfTime, "seconds")
    .format("YYYY-MM-DDTHH:mm:ss.000[Z]");

  console.log("Start_Time " + Start_Time);
  console.log("End_Time " + End_Time);
  const filter_now = {
    selector: {
      time: {
        $gte: End_Time, // 時間大於或等於 last_year_start
        $lte: Start_Time // 時間小於或等於 last_year_end
      }
    }
    //limit: 10,
  };

  const Data = await gc01Db.find(filter_now);

  Freq_array.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400121"]));
  ActivePower_array.push(
    ...Data.docs.map((doc) => doc.IEC61850.rf01["400123"])
  );

  SOC_array.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400129"]));

  Execute_array.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400133"]));

  //存到同一個陣列
  All_data.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400121"]));
  All_data.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400123"]));
  All_data.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400129"]));
  All_data.push(...Data.docs.map((doc) => doc.IEC61850.rf01["400133"]));

  console.log("A " + Freq_array);
  console.log("B " + ActivePower_array);
  console.log("C " + SOC_array);
  console.log("D " + Execute_array);
  console.log("E " + All_data);
  //}
});

module.exports = router;

/*app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});*/
