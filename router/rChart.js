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
const nano = require("nano")(`http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`);

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
//app.use(myMiddleware);
const {
  Scale_Data,
  Convert_rawDT_to_queryDT_floorToSec
} = require("./function");

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

/************************************************************************************ */

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

let RTchart_startQueryDT = "2024-01-01T12:34:56+08:00";
let RTchart_endQueryDT = "2024-01-01T12:35:56+08:00";
let RTchart_Duration = 60000;

router.post("/query_RealTimeChart_Data", async (req, res) => {
  try {
    const firstQuery = req.body.firstQuery;

    RTchart_startQueryDT = RTchart_endQueryDT;

    let raw_DT_now = new Date();
    RTchart_endQueryDT = Convert_rawDT_to_queryDT_floorToSec(raw_DT_now);

    if (firstQuery) {
      RTchart_startQueryDT = Convert_rawDT_to_queryDT_floorToSec(new Date(raw_DT_now.getTime() - 1000 * 1));   // ~~~~~~~~!!!!!!!!!!@@@@@@@@#########$$$$$%%%%%%%%%^^^^^^^&&&&&&&&****
      console.log("設定第一次起始時間~");
    }

    const queryCondition = {
      selector: {
        time: {
          $gte: RTchart_startQueryDT,
          $lte: RTchart_endQueryDT
        }
      },
      // sort: [{time: "desc"}],
      // limit: 10000                  // 限制每次查詢的數量
    };
    console.log(`${RTchart_startQueryDT}_~!@_${RTchart_endQueryDT}`);

    let regData_MT = {
      Freq: { dbName: "gc_rf01", dicName: "IEC61850", dataID: 400121, scale: 0.01, decPlace: 2 },
      ActivePower: { dbName: "gc_rf01", dicName: "IEC61850", dataID: 400123, scale: 0.01, decPlace: 2 },
      ExecuteRate: { dbName: "gc_rf01", dicName: "IEC61850", dataID: 400133, scale: 0.01, decPlace: 1 },
      SOC: { dbName: "gc_rf01", dicName: "IEC61850", dataID: 400129, scale: 1 / 4472 / 7, decPlace: 1 }
    }

    let queryDB = [];
    queryDB.push("gc_rf01");
    // queryDB.push("gc_rf10");
    // console.log(queryDB);

    let queryNanoDB = [];
    let queryResult = [];

    for (let i = 0; i < queryDB.length; i++) {
      queryNanoDB.push(nano.use(queryDB[i]));
      queryResult.push(await queryNanoDB[i].find(queryCondition));
    }
    // // console.log(queryResult[0].docs);
    // // for (let i = 0; i < queryResult[1].docs.length; i++) {
    // //   console.log(queryResult[1].docs[i].System);
    // // }

    let RTchart_xMin_queryDT = Convert_rawDT_to_queryDT_floorToSec(new Date(raw_DT_now.getTime() - RTchart_Duration));

    let response = {
      Freq: [], ActivePower: [], ExecuteRate: [], SOC: [],
      xMin: `${RTchart_xMin_queryDT.slice(0, 10)} ${RTchart_xMin_queryDT.slice(11, 23)}`,
      xMax: `${RTchart_endQueryDT.slice(0, 10)} ${RTchart_endQueryDT.slice(11, 23)}`
    };

    console.log(queryResult[0].docs.length);
    for (let i = 0; i < queryResult[0].docs.length; i++) {
      let dataT_queryT = queryResult[0].docs[i].time;
      let dataT_chartT = `${dataT_queryT.slice(0, 10)} ${dataT_queryT.slice(11, 23)}`;

      let v_Freq = Scale_Data(queryResult[0].docs[i][regData_MT["Freq"].dicName][regData_MT["Freq"].dataID], regData_MT["Freq"].scale, regData_MT["Freq"].decPlace);
      let v_ActivePower = Scale_Data(queryResult[0].docs[i][regData_MT["ActivePower"].dicName][regData_MT["ActivePower"].dataID], regData_MT["ActivePower"].scale, regData_MT["ActivePower"].decPlace);
      let v_ExecuteRate = Scale_Data(queryResult[0].docs[i][regData_MT["ExecuteRate"].dicName][regData_MT["ExecuteRate"].dataID], regData_MT["ExecuteRate"].scale, regData_MT["ExecuteRate"].decPlace);
      let v_SOC = Scale_Data(queryResult[0].docs[i][regData_MT["SOC"].dicName][regData_MT["SOC"].dataID], regData_MT["SOC"].scale, regData_MT["SOC"].decPlace);

      response.Freq.push({ x: dataT_chartT, y: v_Freq });
      response.ActivePower.push({ x: dataT_chartT, y: v_ActivePower });
      response.ExecuteRate.push({ x: dataT_chartT, y: v_ExecuteRate });
      response.SOC.push({ x: dataT_chartT, y: v_SOC });
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/update_RealTimeChart_Duration", async (req, res) => {
  try {
    RTchart_Duration = req.body.Duration;

    let yy_end = Number(RTchart_endQueryDT.slice(0, 4));
    let mm_end = Number(RTchart_endQueryDT.slice(5, 7)) - 1;
    let dd_end = Number(RTchart_endQueryDT.slice(8, 10));
    let hh_end = Number(RTchart_endQueryDT.slice(11, 13));
    let m_end = Number(RTchart_endQueryDT.slice(14, 16));
    let ss_end = Number(RTchart_endQueryDT.slice(17, 19));
    let rawDT_end = new Date(yy_end, mm_end, dd_end, hh_end, m_end, ss_end);

    let startQueryDT = Convert_rawDT_to_queryDT_floorToSec(new Date(rawDT_end.getTime() - RTchart_Duration));;

    response = {
      xMin: `${startQueryDT.slice(0, 10)} ${startQueryDT.slice(11, 23)}`,
      xMax: `${RTchart_endQueryDT.slice(0, 10)} ${RTchart_endQueryDT.slice(11, 23)}`
    };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

/************************************************************************************ */

router.get("/chart/history", (req, res) => {
  res.render("Cht_History");
});

router.get("/chart/history/edit", async (req, res) => {
  const Data = {
    freq: [],
    ActivePower: [],
    ExecuteRate: [],
    SOC: []
  };

  const startTime = "2024-04-21 17:27:53";
  const lengthOfTime = 100;
  // const startTime = req.query.startTime; // 從查詢參數中獲取 startTime
  // const lengthOfTime = parseInt(req.query.lengthOfTime); // 從查詢參數中獲取 lengthOfTime
  try {
    // 將 startTime 轉換為所需的格式
    const formattedStartTime = moment(startTime).format(
      "YYYY-MM-DDTHH:mm:ss.SSSZ"
    );

    // 計算 endTime
    const endTime = moment(startTime).add(lengthOfTime, "seconds");

    // 設定每次查詢的時間範圍為1000秒
    const intervalSeconds = 1000;
    let currentStartTime = moment(startTime);

    // 使用迴圈分次尋找每1000秒的數值
    while (moment(currentStartTime).isBefore(endTime)) {
      console.log("撈取資料中...... :");
      let currentEndTime = moment(currentStartTime).add(
        intervalSeconds,
        "seconds"
      );

      // 如果 currentEndTime 超過 endTime，則設置為 endTime
      if (moment(currentEndTime).isAfter(endTime)) {
        currentEndTime = endTime;
      }

      // 將查詢時間格式化為ISO 8601格式
      const formattedCurrentStartTime = currentStartTime.format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      );
      const formattedCurrentEndTime = currentEndTime.format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      );

      filter = {
        selector: {
          time: {
            $gte: formattedCurrentStartTime,
            $lte: formattedCurrentEndTime
          }
        },
        limit: 10000 // 限制每次查詢的數量
      };

      const doc = await gc01Db.find(filter);

      if (!doc || !doc.docs || doc.docs.length === 0) {
        console.error("Error: No document found.");
        return res.status(404).send("Not Found");
      }
      console.log("formattedCurrentStartTime: " + formattedCurrentStartTime);
      console.log("formattedCurrentEndTime: " + formattedCurrentEndTime);
      // 將查詢到的資料加入Data物件
      doc.docs.forEach((doc) => {
        const timestamp = doc.time;
        Data.freq.push({ x: timestamp, y: doc.IEC61850["400121"] });
        Data.ActivePower.push({ x: timestamp, y: doc.IEC61850["400123"] });
        Data.ExecuteRate.push({ x: timestamp, y: doc.IEC61850["400133"] });
        Data.SOC.push({ x: timestamp, y: doc.IEC61850["400129"] });
      });

      // 更新起始時間為當前結束時間以便下一次查詢
      currentStartTime = currentEndTime;
    }

    res.send(Data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/query_HistoryChart_Data", async (req, res) => {
  try {
    const start_DT_chartT = req.body.start_DT;
    const end_DT_chartT = req.body.end_DT;

    console.log(start_DT_chartT);
    console.log(end_DT_chartT);

    let start_DT_queryT = `${start_DT_chartT.slice(0, 10)}T${start_DT_chartT.slice(11, 23)}+08:00`;
    let end_DT_queryT = `${end_DT_chartT.slice(0, 10)}T${end_DT_chartT.slice(11, 23)}+08:00`;

    console.log(start_DT_queryT);
    console.log(end_DT_queryT);

    const queryCondition = {
      selector: {
        time: {
          $gte: start_DT_queryT,
          $lte: end_DT_queryT
        }
      },
      // sort: [{time: "desc"}],
      limit: 10000                  // 限制每次查詢的數量
    };

    let regData_MT = {
      Freq: { dbName: "gc_rf01", dicName: "IEC61850", dataID: 400121, scale: 0.01, decPlace: 2 },
      ActivePower: { dbName: "gc_rf01", dicName: "IEC61850", dataID: 400123, scale: 0.01, decPlace: 2 },
      ExecuteRate: { dbName: "gc_rf01", dicName: "IEC61850", dataID: 400133, scale: 0.01, decPlace: 1 },
      SOC: { dbName: "gc_rf01", dicName: "IEC61850", dataID: 400129, scale: 1 / 4472 / 7, decPlace: 1 }
    }

    let queryDB = [];
    queryDB.push("gc_rf01");
    // queryDB.push("gc_rf10");
    // console.log(queryDB);

    let queryNanoDB = [];
    let queryResult = [];

    for (let i = 0; i < queryDB.length; i++) {
      queryNanoDB.push(nano.use(queryDB[i]));
      queryResult.push(await queryNanoDB[i].find(queryCondition));
    }
    // console.log(queryResult[0].docs);
    // for (let i = 0; i < queryResult[1].docs.length; i++) {
    //   console.log(queryResult[1].docs[i].System);
    // }

    let response = { Freq: [], ActivePower: [], ExecuteRate: [], SOC: [] };

    for (let i = 0; i < queryResult[0].docs.length; i++) {
      let dataT_queryT = queryResult[0].docs[i].time;
      let dataT_chartT = `${dataT_queryT.slice(0, 10)} ${dataT_queryT.slice(11, 23)}`;

      let v_Freq = Scale_Data(queryResult[0].docs[i][regData_MT["Freq"].dicName][regData_MT["Freq"].dataID], regData_MT["Freq"].scale, regData_MT["Freq"].decPlace);
      let v_ActivePower = Scale_Data(queryResult[0].docs[i][regData_MT["ActivePower"].dicName][regData_MT["ActivePower"].dataID], regData_MT["ActivePower"].scale, regData_MT["ActivePower"].decPlace);
      let v_ExecuteRate = Scale_Data(queryResult[0].docs[i][regData_MT["ExecuteRate"].dicName][regData_MT["ExecuteRate"].dataID], regData_MT["ExecuteRate"].scale, regData_MT["ExecuteRate"].decPlace);
      let v_SOC = Scale_Data(queryResult[0].docs[i][regData_MT["SOC"].dicName][regData_MT["SOC"].dataID], regData_MT["SOC"].scale, regData_MT["SOC"].decPlace);

      response.Freq.push({ x: dataT_chartT, y: v_Freq });
      response.ActivePower.push({ x: dataT_chartT, y: v_ActivePower });
      response.ExecuteRate.push({ x: dataT_chartT, y: v_ExecuteRate });
      response.SOC.push({ x: dataT_chartT, y: v_SOC });
    }



    // const gc_rf10 = "gc_rf10";
    // const gc_rf01 = "gc_rf01";
    // const GC10nanoDb = nano.use(gc_rf10);
    // const GC01nanoDb = nano.use(gc_rf01);

    // await GC10nanoDb.createIndex(indexDef);
    // await GC01nanoDb.createIndex(indexDef);

    //   const result10 = await GC10nanoDb.find(mangoQuery);
    //   const result01 = await GC01nanoDb.find(mangoQuery);

    //   const GC10Data = result10.docs[0];
    //   const GC01Data = result01.docs[0];

    // const gc_rf01 = "gc_rf01";
    // const gc01Db = nano.use(gc_rf01); // 請注意這裡使用 nano.use() 來設定數據庫
    // const doc = await gc01Db.find(filter);



    // await dwctrlnanoDb.createIndex(indexDef);
    // const dataGot = await dwctrlnanoDb.find(mangoQuery);
    // const dwctrlData = dataGot.docs[0];
    // const newdwctrlData = JSON.parse(JSON.stringify(dwctrlData));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

/************************************************************************************ */

module.exports = router;

/*app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});*/
