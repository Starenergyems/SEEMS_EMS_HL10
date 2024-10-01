const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const cors = require("cors");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid"); // 用於生成隨機的 _id
const fs = require("fs");
const cron = require("node-cron"); //指定幾點做什麼
const axios = require("axios"); //在server執行get

const config = require("./config");
const {
  formatDateAndTime,
  formatDate,
  formatTime,
  formatHour,
  transToDate,
  formatTimecount,
} = require("./timeFunction");
const { time, Console } = require("console");
const e = require("connect-flash");
const Module = require("module");
const systemInfoConfig = config.systemInfo;
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);

const gcDb = nano.db.use("gc_rf10"); // 替換為你的數據庫名稱
const other_rf01 = "other_rf01";
const other01Db = nano.use(other_rf01);
const other_rf10 = "other_rf10";
const other10Db = nano.use(other_rf10);
const report = "report";
const reportDb = nano.use(report);
const report_monthly = "report_monthly";
const report_monthlyDb = nano.use(report_monthly);
//const year_report = "year_report";
//const Year_reportDb = nano.use(year_report);
const report_hour = "report_hour";
const report_hourDb = nano.use(report_hour);
const report_day = "report_day";
const report_dayDb = nano.use(report_day);
const powerusage = "powerusage";
const powerusageDb = nano.use(powerusage);

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

console.log("報表數值讀取服務啟動!");

// - 副程式:查詢指定小時(日期+小時)是否已有資料
// - date會是前端傳過來的原始數值
async function checkDocumentByDate(date, hour) {
  try {
    // 使用 formatDate 函數格式化輸入的日期
    const formattedDate = formatDate(date, 0);
    console.log(
      "指定查詢日期範圍/處理過後的日期(formattedDate): ",
      formattedDate
    );
    console.log("指定查詢時間範圍: ", hour);

    // 定義篩選條件，查詢 time 字段等於給定日期的文檔
    const filter = {
      selector: {
        Date: formattedDate,
        time: hour,
      },
    };
    // 使用篩選器查詢文檔
    const result = await report_hourDb.find(filter);

    // 檢查查詢結果
    if (result.docs.length > 0) {
      //console.log("找到符合條件的文檔 ");
      return {
        found: true,
        documents: result.docs,
      };
    } else {
      console.log("未找到符合條件的文檔。");
      return {
        found: false,
        documents: [],
      };
    }
  } catch (error) {
    console.error("查詢文檔時出錯: ", error);
    return {
      found: false,
      documents: [],
      error: error.message,
    };
  }
}

//獲得該小時的得標結果時間軸 用以計算該時間所對應的資料庫得標 ID。
async function checkBidID(formattedTime) {
  //formattedTimeStart是字串
  const targetTimeStatus = 410000; // 每十五分鐘得標量的ID基礎值
  // 使用正則表達式提取時間部分

  const timeMatch = formattedTime.match(/T(\d{2}):(\d{2}):/);
  if (!timeMatch) {
    throw new Error("Invalid time format");
  }
  const hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  // 將小時和分鐘轉換為總分鐘數
  const totalMinutes = hours * 60 + minutes;

  // 計算該分鐘數屬於一天中的第幾個 15 分鐘區間
  const intervalIndex = Math.floor(totalMinutes / 15) + 1;
  // 計算出對應的ID
  const bidStatusId = targetTimeStatus + intervalIndex;
  return bidStatusId;
}

// - 副程式:獲取該小時的原始執行率
// - 主程式傳入指定時間區間(起始與結束) 並獲取該時間區間內的原始執行率
// - 檢查是否有缺漏 非3603筆 記得確認這兩個小時有沒有得標!
async function getHourRange(formattedTimeStart, formattedTimeEnd) {
  
  try {
    console.log("---------------正在獲取指定小時的原始執行率---------------");
    console.log(
      "getHourRange 搜尋的起始時間是(formattedTimeStart)",
      formattedTimeStart
    );
    console.log("getHourRange/formattedTimeEnd", formattedTimeEnd);

    // 判斷該時段該利用哪個ID進行判斷 checkBidIDid1前一個小時最後三秒
    const checkBidIDid1 = await checkBidID(formattedTimeStart);
    console.log("checkBidIDid1(時段查詢最後一個ID): ", checkBidIDid1);
    //checkBidIDid 目標小時 但結束區間要提早一個區間(不然整點會被算到下一個區塊中)
    const checkBidIDsecondIntervalTime = formatTimecount(
      formattedTimeEnd,
      0,
      0,
      0,
      -1,
      0
    );
    const checkBidIDid2 = await checkBidID(checkBidIDsecondIntervalTime);
    console.log("checkBidIDid2(時段查詢最後一個ID): ", checkBidIDid2);

    const filter = {
      selector: {
        time: {
          $gte: formattedTimeStart, // 開始時間 前一小時最後三秒
          $lte: formattedTimeEnd, // 結束時間 當小時最後
        },
      },
      limit: 3603, // 每個時間段讀取最多3603筆資料
    };

    // 查詢數據庫
    const result = await gcDb.find(filter);

    // 的 Bid 值
    const checkBidValues = [
      result.docs[0].Schedule.Today[checkBidIDid1], //0
      result.docs[0].Schedule.Today[checkBidIDid2 - 3], //1
      result.docs[0].Schedule.Today[checkBidIDid2 - 2], //2
      result.docs[0].Schedule.Today[checkBidIDid2 - 1], //3
      result.docs[0].Schedule.Today[checkBidIDid2],
    ];

    const hourRange = [];
    let valueMissingNumber = 0;

    // 假設數據庫中的 time 字段是按升序排列的
    for (let i = 0; i < 3603; i++) {
      let intervalIndex;

      if (i >= 0 && i <= 3) {
        intervalIndex = 0;
      } else if (i >= 4 && i <= 903) {
        intervalIndex = 1;
      } else if (i >= 904 && i <= 1803) {
        intervalIndex = 2;
      } else if (i >= 1804 && i <= 2703) {
        intervalIndex = 3;
      } else if (i >= 2704 && i <= 3603) {
        intervalIndex = 4;
      }

      const intervalValue = checkBidValues[intervalIndex];

      if (intervalValue <= 0) {
        hourRange.push(10000);
      } else {
        if (
          result.docs[i] &&
          result.docs[i].System &&
          result.docs[i].System["400037"] !== undefined
        ) {
          const data = result.docs[i].System["400037"];
          hourRange.push(data);
        } else {
          valueMissingNumber++;
          hourRange.push(0);
        }
      }
    }

    console.log("該小時缺少秒數之數量: ", valueMissingNumber);
    console.log("hourRange: ", hourRange);
    console.log("---------------獲取該小時的原始執行率已結束---------------");
    return { hourRange, valueMissingNumber };
  } catch (error) {
    console.error("getHourRange在查詢或處理數據時出錯: ", error);
    return null;
  }
}

// - 副程式: 用於判斷該小時的服務品質指標並且輸出陣列
// - 根據最小執行率決定服務品質等級，並將結果儲存在陣列中。
function determineQuality(min) {
  let qualityVal;
  const qualityArray = Array(7).fill(0); // 初始化陣列長度為 7

  if (min >= 9500 && min <= 10000) {
    qualityVal = 1;
    qualityArray[0] = 1;
  } else if (min >= 9400 && min < 9500) {
    qualityVal = 0.8;
    qualityArray[1] = 1;
  } else if (min >= 9300 && min < 9400) {
    qualityVal = 0.6;
    qualityArray[2] = 1;
  } else if (min >= 9200 && min < 9300) {
    qualityVal = 0.4;
    qualityArray[3] = 1;
  } else if (min >= 9100 && min < 9200) {
    qualityVal = 0.2;
    qualityArray[4] = 1;
  } else if (min >= 7000 && min < 9100) {
    qualityVal = 0;
    qualityArray[5] = 1;
  } else if (min < 7000) {
    qualityVal = -1;
    qualityArray[6] = 1;
  } else {
    qualityVal = null; // 如果不在任何範圍內，返回 null
  }

  return { qualityVal, qualityArray };
}
// - 副程式 判斷四秒最大與小時最小 計算最大、最小、平均(進來的已經是判斷過得標情形的)
// - 根據 4 秒區間內的最大值來計算該小時的最大、最小和平均執行率。
async function decideSBSPM(hourRange) {
  if (!Array.isArray(hourRange)) {
    throw new Error("The provided value is not an array.");
  }

  console.log("getHourRangeValue.length", hourRange.length);
  if (hourRange.length !== 3603) {
    throw new Error("The array must contain exactly 3603 elements.");
  }

  const decideSBSPMValue = [];
  for (let i = 0; i <= hourRange.length - 4; i++) {
    const unit = hourRange.slice(i, i + 4);
    decideSBSPMValue.push(Math.max(...unit));
  }

  const max = Math.max(...decideSBSPMValue);
  const min = Math.min(...decideSBSPMValue); // 該小時採用的執行率
  const avg =
    decideSBSPMValue.reduce((sum, value) => sum + value, 0) /
    decideSBSPMValue.length;
  const quality = determineQuality(min);
  const qualityValue = quality.qualityVal;
  const qualityArray = quality.qualityArray;
  return { decideSBSPMValue, max, min, avg, qualityValue, qualityArray };
}
// - 副程式 判斷是否需要變更日期
// - 每小時往前推一小時 遇到0時的時候需要往前推一天 如果非0時日期就不需要修改
function getFormattedDate(formattedHour, date) {
  let formattedDate;
  if (formattedHour === 0) {
    formattedDate = formatDate(date, -1);
  } else {
    formattedDate = formatDate(date, 0);
  }
  return formattedDate;
}
// - date = currentDate
// - (核心) 獲取每小時的執行率 會先判斷是否已存在該小時數值才進行撈取
// 依據時間範圍查詢資料庫內是否有該小時的數據，若無則透過 getHourRange 進行數據提取，並計算最大、最小和平均執行率，最終將資料存入資料庫。
async function getSnigleHourValue(date) {
  console.log("########################################################################");
  console.log("date: ", date);
  try {
    const formattedHour = formatHour(date); // 獲取目前小時
    const oneHourAgo = formattedHour - 1 < 0 ? 23 : formattedHour - 1; // 目標時間往前推一小時
    const formattedDate = getFormattedDate(formattedHour, date); // 若為 0 點，日期要往前推一天
    console.log("formattedDate(現在日期): ", formattedDate);
    console.log("formattedHour(現在小時): ", formattedHour);
    console.log("oneHourAgo(目標範圍): ", oneHourAgo);
    let formattedTimeStart, formattedTimeEnd;
    // 計算時間範圍
    if (formattedHour === 0) {
      formattedTimeStart = transToDate(date, -1, 22, 56, 59, 999);
      formattedTimeEnd = transToDate(date, 0, 0, 0, 0, 0);
    } else if (formattedHour === 1) {
      formattedTimeStart = transToDate(date, -1, 23, 56, 59, 999);
      formattedTimeEnd = transToDate(date, 0, 1, 0, 0, 0);
    } else if (formattedHour >= 2 && formattedHour <= 23) {
      formattedTimeStart = transToDate(date, 0, formattedHour - 2, 56, 59, 999);
      formattedTimeEnd = transToDate(date, 0, formattedHour, 0, 0, 0);
    } else {
      console.error("無效的 formattedHour 值:", formattedHour);
      return;
    }
    //console.log("傳入fun / formattedTimeStart:", formattedTimeStart);
    //console.log("傳入fun / formattedTimeEnd:", formattedTimeEnd);
    // 查詢資料是否存在
    const isDocumentExists = await checkDocumentByDate(
      formattedDate,
      oneHourAgo
    );

    if (isDocumentExists.found) {
      console.log("當日該小時資料已存在。");
      return isDocumentExists.documents; // 若資料存在則直接返回
    }

    // 查詢該時段資料
    const getHourRangeValue = await getHourRange(
      formattedTimeStart,
      formattedTimeEnd
    );
    const hourRange = getHourRangeValue.hourRange;

    console.log("hourRange: ", hourRange);

    // 檢查是否有有效的數據
    if (hourRange.every((value) => value === 10000)) {
      console.log("數據全為10000，這是系統正常情況。");
    } else {
      console.log("每小時的執行率數據存在異常，需進行進一步檢查。");
    }

    // 決定最大、最小、平均
    const SbspmValue = await decideSBSPM(hourRange);

    const newDocument = {
      _id: uuidv4(), // 使用 UUID 生成隨機 _id
      Date: formattedDate,
      time: oneHourAgo,
      MissingNumbers: getHourRangeValue.valueMissingNumber,
      hourMax_SBBPM: SbspmValue.max,
      hourAvg_SBSPM: SbspmValue.avg,
      hourMin_SBBPM: SbspmValue.min, // 也是該小時的SBSPM
      serviceQuality: SbspmValue.qualityValue,
      serviceQualityArray: SbspmValue.qualityArray,
      exacutive_rate: hourRange,
      SBBPM: SbspmValue.decideSBSPMValue,
    };

    console.log("newDocument:", newDocument);

    // 插入新文檔到資料庫
    const result = await report_hourDb.insert(newDocument);
    console.log("新文檔已建立完畢，文檔內容如下: ", result);
  } catch (error) {
    console.error("檢查或創建當日資料時發生錯誤:", error);
  }
}

// * 完整日報************************************************************************************************************ *//
// - 檢查全日完整資料是否已存在
async function checkDayExists(specifiedTime) {
  console.log("########################################################################");
  console.log("執行日報檢查");
  const targetDay = formatDate(specifiedTime);
  console.log("日報檢查的目標日期(targetDay): ", targetDay);
  const filter = {
    selector: {
      Date: targetDay, // 日期必須等於目標日期
    },
    limit: 1,
  };
  // 查詢數據庫
  const result = await report_dayDb.find(filter);
  //console.log("report_hourDb: ", result);

  // 判斷是否有符合條件的資料
  if (result.docs && result.docs.length > 0) {
    console.log("當日資料已存在");
    return { state: true, result }; // 找到符合條件的資料，回傳 true
  } else {
    console.log("當日資料不存在，請繼續完成後續作業");
    return { state: false, result }; // 沒有找到符合條件的資料，回傳 false
  }
}

async function check24HourExists(specifiedTime) {
  try {
    console.log("########################################################################");
    console.log("------ 執行檢查全日24小時的執行率是否存在 ------");
    const targetDay = formatDate(specifiedTime);
    console.log("targetDay: ", targetDay);

    // 設定查詢條件，查詢指定日期的 24 小時資料
    const filter = {
      selector: {
        Date: targetDay,
        time: {
          $gte: 0,
          $lte: 23,
        },
      },
      limit: 24,
      sort: [{ time: "asc" }] // 確保資料按時間排序
    };

    // 查詢數據庫以獲取現有資料
    let result = await report_hourDb.find(filter);
    let hourlyDataArray = new Array(24).fill(null); // 初始化一個空的24小時陣列

    // 使用 Set 來檢查已存在的小時資料
    const existingTimeIndexes = new Set(result.docs.map((doc) => doc.time));
    const missingTimeIndexes = [];

    // 檢查每個小時是否存在，如果不存在則加入缺失時段的索引
    for (let i = 0; i < 24; i++) {
      if (!existingTimeIndexes.has(i)) {
        missingTimeIndexes.push(i);
      } else {
        // 如果該小時存在，將其直接插入對應位置
        const doc = result.docs.find((d) => d.time === i);
        hourlyDataArray[i] = doc;
      }
    }
    console.log("缺少的時段 missingTimeIndexes:", missingTimeIndexes);

    // 如果沒有缺少時段，資料完整，直接回傳完整數據
    if (missingTimeIndexes.length === 0) {
      console.log("資料完整，存在 24 筆資料。");
      return { complete: true, result: hourlyDataArray };
    } else {
      console.log(`資料不完整，缺少的時間段: ${missingTimeIndexes.join(", ")}。`);
      // 逐一補值，每次只補一個小時，補完再補下一個小時
      for (const Hour of missingTimeIndexes) {
        let targetHourTime = moment.utc(specifiedTime).set({
          hour: Hour + 1,
          minute: 15,
          second: 5,
          millisecond: 0,
        });
        try {
          // 呼叫 `getSnigleHourValue` 補齊缺失小時的資料
          console.log(`${Hour}, 時間: ${targetHourTime.format()}`);
          // 一次只補一個小時，等待補值完成再進行下一個小時的補值
          const singleHourResult = await getSnigleHourValue(targetHourTime);
          if (singleHourResult) {
            // 將補齊的資料放入 hourlyDataArray 對應的位置
            hourlyDataArray[Hour] = singleHourResult;
          }
        } catch (error) {
          console.error(`補值失敗: 小時 ${Hour}，錯誤: `, error);
        }
      }

      console.log("所有缺失的小時補值已完成，重新查詢完整資料。");
      // 再次查詢資料庫以獲取補齊後的 24 小時資料
      result = await report_hourDb.find(filter);
      // 將新的結果更新到 hourlyDataArray
      result.docs.forEach((doc) => {
        hourlyDataArray[doc.time] = doc;
      });

      // 確認所有 24 小時都有資料，且補值完成
      //console.log("輸出完整每個小時的數值(hourlyDataArray):", hourlyDataArray);
      return { complete: true, result: hourlyDataArray };
    }
  } catch (error) {
    console.error("check24HourExists 出錯: ", error);
    return { complete: false, error };
  }
}



// - 副程式: 獲得全天(日報)電力使用資訊
async function getFullDayPowerUsage(type, specifiedTime) {
  console.log("########################################################################");
  console.log("執行日報中電力資訊獲取，執行日期為: ", specifiedTime.format());
 // console.log("類型(type): ", type);
  // 設定 startTime 和 endTime 為當天的00:00:00.000和23:59:59.000，並加上時區偏移
  const targetDay = specifiedTime.format("YYYY-MM-DD");
  const startTime = moment(targetDay + "T00:00:00.000+08:00").format(
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  );
  const endTime = moment(targetDay + "T23:59:59.000+08:00").format(
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  );
  //console.log("全日的電量之startTime: ", startTime);
  //console.log("全日的電量之endTime: ", endTime);

  // 在powerusagedb中檢查是否已存在相應的數據
  const filter = {
    selector: {
      type: type, // 類型符合傳入的type
      date: targetDay, // 日期符合targetDay
    },
    limit: 1, // 只需要檢查是否至少有一條數據存在
  };

  const existingData = await powerusageDb.find(filter);
  if (existingData.docs.length > 0) {
    //console.log("已存在相應數據，跳過讀取other01Db，並直接回傳數值。");
    const data = existingData.docs[0];
    //console.log("該日充放電資料為: ", existingData.docs);
    return {
      complete: true,
      data: data,
      message: "Data already exists.",
    };
  } else {
    console.log(
      "未找到相應數據，繼續處理讀取other01Db，以獲取全日用電量數據..."
    );

    // 設置一秒後的時間
    const startTimePlusOneSecond = moment(startTime)
      .add(1, "seconds")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[+08:00]");

    // 搜尋startTime到startTime+1秒的資料
    const startFilter = {
      selector: {
        time: { $gte: startTime, $lt: startTimePlusOneSecond },
      },
      limit: 10,
      sort: [{ time: "asc" }],
    };

    const startResults = await other01Db.find(startFilter);
    const start_kWh_Import = startResults.docs.map((doc) => doc.Freq["408028"]);
    const start_kWh_Export = startResults.docs.map((doc) => doc.Freq["408030"]);
    const start_kVARh_Import = startResults.docs.map(
      (doc) => doc.Freq["408032"]
    );
    const start_kVARh_Export = startResults.docs.map(
      (doc) => doc.Freq["408034"]
    );

    // 設置一秒後的時間點，這次是從endTime開始
    const endTimePlusOneSecond = moment(endTime)
      .add(1, "seconds")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[+08:00]");

    // 搜尋endTime到endTime+1秒的資料
    const endFilter = {
      selector: {
        time: { $gte: endTime, $lt: endTimePlusOneSecond },
      },
      limit: 10,
      sort: [{ time: "asc" }],
    };

    const endResults = await other01Db.find(endFilter);
    const end_kWh_Import = endResults.docs.map((doc) => doc.Freq["408028"]);
    const end_kWh_Export = endResults.docs.map((doc) => doc.Freq["408030"]);
    const end_kVARh_Import = endResults.docs.map((doc) => doc.Freq["408032"]);
    const end_kVARh_Export = endResults.docs.map((doc) => doc.Freq["408034"]);

    // 顯示各陣列的數值
    // console.log("start_kWh_Import: ", start_kWh_Import);
    // console.log("start_kWh_Export: ", start_kWh_Export);
    // console.log("start_kVARh_Import: ", start_kVARh_Import);
    // console.log("start_kVARh_Export: ", start_kVARh_Export);

    // console.log("end_kWh_Import: ", end_kWh_Import);
    // console.log("end_kWh_Export: ", end_kWh_Export);
    // console.log("end_kVARh_Import: ", end_kVARh_Import);
    // console.log("end_kVARh_Export: ", end_kVARh_Export);

    // 定義檢查函數
    function getValidValue(arr) {
      for (let i = 0; i < arr.length; i++) {
        //console.log("檢查中的索引 i: ", i, " 值: ", arr[i]);
        if (arr[i] !== 0 && arr[i] !== "") {
          return arr[i];
        }
      }
      console.log("當日電量顯示異常");
      return null;
    }

    // 驗證並取得有效值
    const valid_start_kWh_Import = getValidValue(start_kWh_Import);
    const valid_end_kWh_Import = getValidValue(end_kWh_Import);

    const valid_start_kWh_Export = getValidValue(start_kWh_Export);
    const valid_end_kWh_Export = getValidValue(end_kWh_Export);

    const valid_start_kVARh_Import = getValidValue(start_kVARh_Import);
    const valid_end_kVARh_Import = getValidValue(end_kVARh_Import);

    const valid_start_kVARh_Export = getValidValue(start_kVARh_Export);
    const valid_end_kVARh_Export = getValidValue(end_kVARh_Export);

    // 確保所有值都有效
    if (
      valid_start_kWh_Import !== null &&
      valid_end_kWh_Import !== null &&
      valid_start_kWh_Export !== null &&
      valid_end_kWh_Export !== null &&
      valid_start_kVARh_Import !== null &&
      valid_end_kVARh_Import !== null &&
      valid_start_kVARh_Export !== null &&
      valid_end_kVARh_Export !== null
    ) {
      // 計算差值
      const day_kWh_Import =
        (valid_end_kWh_Import - valid_start_kWh_Import) / 10;
      //console.log("day_kWh_Import (kWh Import 差值): ", day_kWh_Import);

      const day_kWh_Export =
        (valid_end_kWh_Export - valid_start_kWh_Export) / 10;
      //console.log("day_kWh_Export (kWh Export 差值): ", day_kWh_Export);
      const kWh_Net = parseFloat(
        ((day_kWh_Import - day_kWh_Export) / 10).toFixed(2)
      );
      //console.log("kWh_Net(差值): ", kWh_Net);

      const day_kVARh_Import =
        (valid_end_kVARh_Import - valid_start_kVARh_Import) / 10;
      // console.log("day_kVARh_Import (kVARh Import 差值): ", day_kVARh_Import);

      const day_kVARh_Export =
        (valid_end_kVARh_Export - valid_start_kVARh_Export) / 10;
      // console.log("day_kVARh_Export (kVARh Export 差值): ", day_kVARh_Export);
      const kVARh_Net = parseFloat((day_kVARh_Import - day_kVARh_Export) / 10);
      // console.log("kVARh_Net(差值): ", kVARh_Net);
      let kWh_RTE = 0;
      kWh_RTE = parseFloat(
        ((day_kWh_Export / day_kWh_Import) * 100).toFixed(2)
      );

      // 建立新doc並存入powerusageDb
      const newDoc = {
        type: type,
        date: targetDay,
        day_kWh_Import: day_kWh_Import,
        day_kWh_Export: day_kWh_Export,
        kWh_Net: kWh_Net,
        day_kVARh_Import: day_kVARh_Import,
        day_kVARh_Export: day_kVARh_Export,
        kVARh_Net: kVARh_Net,
        kWh_RTE: kWh_RTE,
      };
      const saveResult = await powerusageDb.insert(newDoc);
      //console.log("全日用電量數值已存入資料庫，資料內容如下: ", saveResult);
      return {
        complete: true,
        data: newDoc,
        message: "Data created.",
      };
    } else {
      console.log("當日電量顯示異常");
    }
  }
  return { complete: false, message: "Data processing completed." };
}

// // - 副程式: 中止服務時間與容量(保留功能 尚未有中止數據)
async function statisticsOutOfService(specifiedTime) {
  console.log("########################################################################");
  //console.log("獲取當日中止服務時間與容量(目前尚未有中止數據!)");
  const hours = 0;
  const capacity = 0;
  return { hours, capacity };
}

// - 主程式: 日報執行
// - 當搜索日晚於目前系統時間不執行 檢查是否已有當日資料 有資料直接產表
// - 無當日則檢查全天資料是否完整 檢查當日用電資料 檢查中止資料 都存在才執行 並儲存當日資料到day資料庫 最後回傳數值 報表產生
async function getDailyReportData(specifiedTime) {
  console.log("------------------------------------------------------------");
  console.log("1.開始執行日報");
  const now = moment();
  const oneDayBeforeNow = now.clone().subtract(1, "days");
  console.log("2.執行日報日期檢查，檢查是否晚於正式運作日。");
  const cutoffDate = moment("2024-05-30"); //正式運轉日
  if (
    specifiedTime.isBefore(oneDayBeforeNow) &&
    specifiedTime.isAfter(cutoffDate)
  ) {
    console.log(
      `指定日期 ${specifiedTime.format()} 早於系統日期 ${now.format()} 的前一天，指定日期之日報可產出。 OK!`
    );
    console.log("3.執行檢查日報資料庫，檢查全日日報是否已建立於資料庫。");
    const ischeckDayExists = await checkDayExists(specifiedTime); //檢查全日完整資料是否已存在
    if (ischeckDayExists.state === false) { //全日資料不存在
      console.log(
        "ischeckDayExists: 資料庫內無全日資料!"
      );
      //檢查24小時的數值
      let check24HourExistsValue = await check24HourExists(specifiedTime);
      if (check24HourExistsValue.complete === true) {
        console.log(
          "日報24小時執行率已存在，獲得結果如下(result):",
          check24HourExistsValue.result
        );
        // 初始化所有數值
        const hourlyDataArray = new Array(24).fill(null);
        const serviceQualitySums = new Array(7).fill(0);
        let maxHourMax_SBBPM = -Infinity;
        let minHourMin_SBBPM = Infinity;
        let totalHourAvg_SBSPM = 0;
        let validHourCount = 0;

        console.log("進行日報數值計算。");
        // 修正：遍歷雙重陣列
        check24HourExistsValue.result.forEach((hourlyDocs) => {
          if (hourlyDocs && hourlyDocs.length > 0) {
            const doc = hourlyDocs[0]; // 取得內部的 doc
            const time = doc.time;

            // 處理每個時段的資料
            const data = {
              time: time,
              serviceQualityArray: doc.serviceQualityArray,
              hourMax_SBBPM: parseFloat((doc.hourMax_SBBPM / 100).toFixed(2)),
              hourAvg_SBSPM: parseFloat((doc.hourAvg_SBSPM / 100).toFixed(2)),
              hourMin_SBBPM: parseFloat((doc.hourMin_SBBPM / 100).toFixed(2)),
            };

            hourlyDataArray[time] = data;

            // 遍歷單層陣列 serviceQualityArray
            doc.serviceQualityArray.forEach((value, index) => {
              serviceQualitySums[index] += value;
            });

            // 處理 exacutive_rate 也類似於 serviceQualityArray
            doc.exacutive_rate.forEach((value, index) => {
              // 如果需要對 exacutive_rate 進行累加，可以類似這樣處理
              // exacutiveRateSums[index] += value; // 可根據具體需求新增累加陣列
            });

            if (doc.hourMax_SBBPM > maxHourMax_SBBPM) {
              maxHourMax_SBBPM = doc.hourMax_SBBPM;
            }

            if (doc.hourMin_SBBPM < minHourMin_SBBPM) {
              minHourMin_SBBPM = doc.hourMin_SBBPM;
            }

            totalHourAvg_SBSPM += doc.hourAvg_SBSPM;
            validHourCount++;
          }
        });

        const averageHourAvg_SBSPM =
          validHourCount > 0
            ? parseFloat((totalHourAvg_SBSPM / validHourCount / 100).toFixed(2))
            : 0;

        maxHourMax_SBBPM = parseFloat((maxHourMax_SBBPM / 100).toFixed(2));
        minHourMin_SBBPM = parseFloat((minHourMin_SBBPM / 100).toFixed(2));

        //console.log("hourlyDataArray: ", hourlyDataArray);
        console.log("serviceQualitySums: ", serviceQualitySums);
        console.log("最大 hourMax_SBBPM: ", maxHourMax_SBBPM);
        console.log("最小 hourMin_SBBPM: ", minHourMin_SBBPM);
        console.log("平均 hourAvg_SBSPM: ", averageHourAvg_SBSPM);
        console.log("當日24小時執行率已存在，將進行用電量查詢!");

        // 其他處理邏輯保持不變
        const fullDayPower = await getFullDayPowerUsage("D", specifiedTime);
        const fullDayPowerData = fullDayPower.data;
        const resultOfstatisticsOutOfService =
          await statisticsOutOfService(specifiedTime);

        // 初始化 dayTable1
        const dayTable1 = [];
        hourlyDataArray.forEach((hourData) => {
          if (hourData) {
            const serviceQualityValues = [...hourData.serviceQualityArray];
            const hourValues = [
              hourData.hourMax_SBBPM,
              hourData.hourAvg_SBSPM,
              hourData.hourMin_SBBPM,
            ];
            dayTable1.push([...serviceQualityValues, ...hourValues]);
          } else {
            dayTable1.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          }
        });

        dayTable1.push([
          ...serviceQualitySums,
          maxHourMax_SBBPM,
          averageHourAvg_SBSPM,
          minHourMin_SBBPM,
        ]);

        console.log("dayTable1:", dayTable1);

        const dayTable2 = [
          fullDayPowerData.day_kWh_Import,
          fullDayPowerData.day_kWh_Export,
          fullDayPowerData.kWh_Net,
        ];
        console.log("dayTable2:", dayTable2);

        const dayTable3 = [
          resultOfstatisticsOutOfService.capacity,
          resultOfstatisticsOutOfService.hours,
          fullDayPowerData.kWh_RTE,
        ];
        console.log("dayTable3:", dayTable3);

        const newDoc = {
          Date: formatDate(specifiedTime),
          hour_final: dayTable1,
          elsedata1: dayTable2,
          elsedata2: dayTable3,
        };
        const saveResult = await report_dayDb.insert(newDoc);
        console.log("新文檔已存入資料庫: ", saveResult);
        return {
          Date: formatDate(specifiedTime),
          hour_final: dayTable1,
          elsedata1: dayTable2,
          elsedata2: dayTable3,
        };
      } else {
        console.log("處理check24HourExistsValue時出錯!");
      }
    } else {
      return {
        reject: false,
        Date: ischeckDayExists.result.docs[0].date,
        hour_final: ischeckDayExists.result.docs[0].hour_final,
        elsedata1: ischeckDayExists.result.docs[0].elsedata1,
        elsedata2: ischeckDayExists.result.docs[0].elsedata2,
      };
    }
  } else {
    console.log(
      `指定日期 ${specifiedTime.format()} 此時段不在可產生報表時間內，無法產生日報! Rejected!`
    );
    return { reject: true, reason: "timeError" };
  }
}

// * ******************************************************************************************************* * //
// * 測試或是補值專區
const specifiedTime = moment("2024-09-28T00:05:13.816+08:00");
getDailyReportData(specifiedTime);
// * ************************************************************ * //
// // - 每小時執行主程式: 定期執行 每小時的五分會進行前一個小時的資料撈取主程式
// function startHourlyCheck() {
//   cron.schedule("5 * * * *", async () => {
//     // 每個小時的第5分鐘
//     const now = moment();
//     console.log("正在獲取該小時執行率詳細數據! getSnigleHourValue() 執行中");
//     await getSnigleHourValue(now);
//   });
//   console.log("已啟動定時任務，每小時的5分鐘執行一次。");
// }
// * ************************************************************ * //
// // - 補過去的日報數值(日)
// async function executeForDateRange(startDate, endDate) {
//   let currentDate = moment(startDate);

//   while (currentDate.isBefore(endDate)) {
//     await getDailyReportData(currentDate);
//     currentDate.add(1, "days"); // 將日期加一天
//   }
// }

// // 指定起始時間
// const startDate = moment("2024-08-01T00:00:00.000+08:00");
// const endDate = moment("2024-08-30T00:00:00.000+08:00");

// executeForDateRange(startDate, endDate);
// * ************************************************************************************************************************ * //

// // -  月報
// // - 檢查月報裡的每日資料是否存在
// async function checkMonthExists(specifiedTime) {
//   console.log("正在檢查當月每日的完整資料是否存在");

//   // 獲取指定時間的月份和年份
//   const year = specifiedTime.year();
//   const month = specifiedTime.month() + 1; // month() 是 0-11，需要 +1 轉為 1-12
//   const daysInMonth = specifiedTime.daysInMonth(); // 獲取該月的天數

//   console.log(`檢查年份 ${year} 月份 ${month} 的資料`);

//   // 初始化一個空數組來儲存要檢查的日期
//   const dateArray = [];
//   for (let day = 1; day <= daysInMonth; day++) {
//     const formattedDay = moment(`${year}-${month}-${day}`, "YYYY-M-D").format(
//       "YYYY-MM-DD"
//     );
//     dateArray.push(formattedDay);
//   }

//   // 設置篩選條件，檢查日期是否在當月的範圍內
//   const filter = {
//     selector: {
//       Date: { $in: dateArray }, // 日期必須在當月的所有日期範圍內
//     },
//     limit: daysInMonth, // 限制返回的結果數量應該等於該月的天數
//   };

//   // 查詢數據庫
//   const result = await report_dayDb.find(filter);

//   // 判斷是否有足夠的資料
//   if (result.docs && result.docs.length === daysInMonth) {
//     console.log(`所有 ${daysInMonth} 天的資料都已存在。`);
//     //console.log(`${daysInMonth}的數值是:`, result.docs[0]);

//     return { state: true, result }; // 找到該月所有日期的資料，回傳 true
//   } else {
//     console.log(`部分資料缺失，已找到 ${result.docs.length} 天的資料。`);
//     return { state: false, result }; // 資料不完整，回傳 false
//   }
// }

// -陣列數值提取並進行計算(獲取當月的資料並統整包含當月total)
// function extractAndStoreDailyData(docs, completeData) {
//   let hourFinalSums = Array(7).fill(0); // 初始化加總 hour_final[24] 的陣列
//   let elsedata1Sums = [0, 0, 0]; // elsedata1[0], [1], [2] 的加總
//   let elsedata2Sums = [0, 0, 0]; // elsedata2[0], [1], [2] 的加總

//   let hourFinalMax = -Infinity; // 初始設定為最小值，用於找最大值
//   let hourFinalMin = Infinity; // 初始設定為最大值，用於找最小值
//   let hourFinalAvgSum = 0; // 用於計算平均值

//   docs.forEach((doc, docIndex) => {
//     const date = moment(doc.Date, "YYYY-MM-DD");
//     const dayIndex = date.date() - 1; // 日期減去1作為索引

//     //console.log(`\n處理日期: ${doc.Date} (索引: ${dayIndex})`);

//     // 加總 hour_final[24] 的前7個值
//     doc.hour_final[24].slice(0, 7).forEach((value, index) => {
//       hourFinalSums[index] += value;
//       //console.log(`hour_final[24][${index}] 加總結果: ${hourFinalSums[index]}`);
//     });

//     // 判斷最大值
//     hourFinalMax = Math.max(hourFinalMax, doc.hour_final[24][7]);
//     //console.log(`目前最大值: ${hourFinalMax}`);

//     // 累加用於計算平均值的值
//     hourFinalAvgSum += doc.hour_final[24][8];

//     // 判斷最小值
//     hourFinalMin = Math.min(hourFinalMin, doc.hour_final[24][9]);
//     //console.log(`目前最小值: ${hourFinalMin}`);

//     // 加總 elsedata1 的前兩個值
//     elsedata1Sums[0] += doc.elsedata1[0];
//     elsedata1Sums[1] += doc.elsedata1[1];

//     // 計算 elsedata1 的第三個值
//     elsedata1Sums[2] = parseFloat(
//       ((elsedata1Sums[0] - elsedata1Sums[1]) / 1000).toFixed(2)
//     );

//     // 加總 elsedata2 的前兩個值
//     elsedata2Sums[0] += doc.elsedata2[0];
//     elsedata2Sums[1] += doc.elsedata2[1];

//     // 計算 elsedata2 的第三個值
//     elsedata2Sums[2] =
//       elsedata1Sums[0] !== 0
//          ? parseFloat(((elsedata1Sums[1] / elsedata1Sums[0]) * 100).toFixed(2))
//         : 0;

//     // 只取需要的值並且轉換為單層結構
//     const filteredData = [
//       ...doc.hour_final[24].slice(0, 7), // 取出 hour_final 的第24行前7個數值
//       doc.hour_final[24][7], // 第8個數值（最大值候選）
//       doc.hour_final[24][8], // 第9個數值（平均值候選）
//       doc.hour_final[24][9], // 第10個數值（最小值候選）
//       parseFloat((elsedata1Sums[0] / 1000).toFixed(2)), // elsedata1 第1個加總並除以1000
//       parseFloat((elsedata1Sums[1] / 1000).toFixed(2)), // elsedata1 第2個加總並除以1000
//       elsedata1Sums[2], // elsedata1 第三個值，前兩個相減
//       ...elsedata2Sums.slice(0, 3), // elsedata2 的數值
//     ];
//     //console.log(`完整數據存入 completeData[${dayIndex}]:`, filteredData);
//     completeData[dayIndex] = filteredData; // 將數據存入對應的索引位置
//   });

//   // 計算 hour_final[24][8] 的平均值
//   const hourFinalAvg = parseFloat((hourFinalAvgSum / docs.length).toFixed(2));

//   // 最終結果存進 completeData[31]
//   completeData[31] = [
//     ...hourFinalSums, // 取出 hour_final[24] 的加總結果前7個
//     hourFinalMax, // hour_final[24][7] 最大值
//     hourFinalAvg, // hour_final[24][8] 平均值
//     hourFinalMin, // hour_final[24][9] 最小值
//     parseFloat((elsedata1Sums[0] / 1000).toFixed(2)), // elsedata1 第1個加總並除以1000
//     parseFloat((elsedata1Sums[1] / 1000).toFixed(2)), // elsedata1 第2個加總並除以1000
//     elsedata1Sums[2], // elsedata1 第三個值，前兩個相減
//     ...elsedata2Sums, // elsedata2 的加總值
//   ];
//   //console.log("\n最終的 completeData:", completeData);
//   return completeData;
// }

// // - 獲得上期與去年同期資料(所以需要回傳兩個時間點的數值)
// async function getBeforeMonthlyData(specifiedTime) {
//   // return {
//   //   LastMonth,
//   //   samePeriodLastYear
//   // };
// }
// // - 獲得當月輔助用電資料
// async function getAUXpowerData(type, specifiedTime) {
//   console.log("電力資訊-傳入的時間: ", specifiedTime.format());
//   console.log("type: ", type);

//   // 設定 startTime 為當月的1號00:00:00.000
//   const startTime = specifiedTime
//     .startOf("month")
//     .format("YYYY-MM-DDT00:00:00.000+08:00");

//   // 設定 endTime 為當月最後一天的23:59:59.000+08:00
//   const endTime = specifiedTime
//     .endOf("month")
//     .format("YYYY-MM-DDT23:59:59.000+08:00");

//   // 設定 targetDay 為當月的年份與月份
//   const targetDay = specifiedTime.format("YYYY-MM");

//   console.log("全月的電量之startTime: ", startTime);
//   console.log("全月的電量之endTime: ", endTime);

//   // 在powerusagedb中檢查是否已存在相應的數據
//   const filter = {
//     selector: {
//       type: type, // 類型符合傳入的type
//       date: targetDay, // 日期符合targetDay
//     },
//     limit: 1, // 只需要檢查是否至少有一條數據存在
//   };

//   const existingData = await powerusageDb.find(filter);
//   if (existingData.docs.length > 0) {
//     console.log("已存在相應數據，跳過讀取other01Db");
//     const data = existingData.docs[0];
//     return {
//       complete: true,
//       data: data,
//       message: "Data already exists.",
//     };
//   } else {
//     console.log("未找到相應數據，繼續讀取other01Db電表數值...");

//     // 搜尋startTime到startTime+1秒的資料
//     const startTimePlusOneSecond = moment(startTime)
//       .add(1, "seconds")
//       .format("YYYY-MM-DDTHH:mm:ss.SSS[+08:00]");

//     const startFilter = {
//       selector: {
//         time: { $gte: startTime, $lt: startTimePlusOneSecond },
//       },
//       limit: 10,
//       sort: [{ time: "asc" }],
//     };
//     const startResults = await other10Db.find(startFilter);
//     console.log("startResults: ", startResults.docs);
//     // 從AuxM1到AuxM9提取數據
//     const dataCollectionStart = {};
//     for (let i = 1; i <= 9; i++) {
//       const prefix = `AuxM${i}`;
//       dataCollectionStart[prefix] = {
//         kWh_Total_H: startResults.docs.map((doc) => doc[prefix]["408080"] || 0),
//         kWh_Total_M: startResults.docs.map((doc) => doc[prefix]["408081"] || 0),
//         kWh_Total_L: startResults.docs.map((doc) => doc[prefix]["408082"] || 0),
//       };
//     }
//     // 檢查並提取 AuxMtot1[408075]
//     if (startResults.docs.length > 0 && startResults.docs[0].AuxMtot1) {
//       dataCollectionStart[`AuxMtot1`] =
//         startResults.docs[0].AuxMtot1["408075"] || 0;
//     }

//     // 搜尋endTime到endTime+1秒的資料
//     const endTimePlusOneSecond = moment(endTime)
//       .add(1, "seconds")
//       .format("YYYY-MM-DDTHH:mm:ss.SSS[+08:00]");

//     const endFilter = {
//       selector: {
//         time: { $gte: endTime, $lt: endTimePlusOneSecond },
//       },
//       limit: 10,
//       sort: [{ time: "asc" }],
//     };

//     const endResults = await other10Db.find(endFilter);

//     // 從AuxM1到AuxM9提取數據
//     const dataCollectionEnd = {};
//     for (let i = 1; i <= 9; i++) {
//       const prefix = `AuxM${i}`;
//       dataCollectionEnd[prefix] = {
//         kWh_Total_H: endResults.docs.map((doc) => doc[prefix]["408080"] || 0),
//         kWh_Total_M: endResults.docs.map((doc) => doc[prefix]["408081"] || 0),
//         kWh_Total_L: endResults.docs.map((doc) => doc[prefix]["408082"] || 0),
//       };
//     }
//     // 檢查並提取 AuxMtot1[408075]
//     if (endResults.docs.length > 0 && endResults.docs[0].AuxMtot1) {
//       dataCollectionEnd[`AuxMtot1`] =
//         endResults.docs[0].AuxMtot1["408075"] || 0;
//     }
//     const auxPower = {};

//     // 計算並保存數據
//     const newDoc = {
//       type: type,
//       date: targetDay,
//       dataCollectionEnd: dataCollectionEnd,
//       auxPower: auxPower,
//     };
//     const saveResult = await powerusageDb.insert(newDoc);
//     console.log("新文檔已存入資料庫: ", saveResult);
//     return {
//       complete: true,
//       data: newDoc,
//       message: "Data created.",
//     };
//   }
// }

// // - 月報主程式
// async function getMonthlyReportData(specifiedTime) {
//   const now = moment(); // 獲取當前系統時間
//   const cutoffDate = moment("2024-05-30T00:00:00.000+08:00"); // 設定2024年6月1日作為截止日期

//   // 檢查指定時間是否晚於系統時間且早於2024年6月
//   if (specifiedTime.isAfter(now)) {
//     console.log("指定時間晚於系統時間，無法執行!");
//     return { reject: true, reason: "timeError" };
//   } else if (specifiedTime.isBefore(cutoffDate)) {
//     console.log("指定時間早於2024年6月，無法執行!");
//     return { reject: true, reason: "timeError" };
//   }

//   // 呼叫 checkMonthExists 檢查該月份的資料是否完整
//   const monthCheckResult = await checkMonthExists(specifiedTime);

//   const daysInMonth = specifiedTime.daysInMonth(); // 獲取該月的天數
//   const completeData = Array(daysInMonth + 1).fill(null); // 初始化大小为該月份天數+1的陣列

//   if (monthCheckResult.state === true) {
//     console.log("該月份的所有數值資料已存在。");

//     // 使用提取和存儲數據的通用函數
//     extractAndStoreDailyData(monthCheckResult.result.docs, completeData);

//     console.log("完整的月份資料已存放到陣列中:", completeData);
//     return { state: true, data: completeData };
//   } else {
//     console.log("該月份的部分數值資料缺失。");

//     const foundDates = new Set(
//       monthCheckResult.result.docs.map((doc) => doc.Date)
//     );
//     const missingDates = [];

//     for (let day = 1; day <= daysInMonth; day++) {
//       const dayStr = moment(`${year}-${month}-${day}`, "YYYY-M-D").format(
//         "YYYY-MM-DD"
//       );
//       if (!foundDates.has(dayStr)) {
//         const missingDateFormatted = moment(dayStr, "YYYY-MM-DD").format(
//           "YYYY-MM-DDTHH:mm:ss.SSSZ"
//         );
//         missingDates.push(missingDateFormatted);
//       }
//     }

//     console.log("缺少的日期:", missingDates);

//     // 將每個缺失的日期傳入 getDailyReportData 並檢查結果
//     for (const missingDate of missingDates) {
//       console.log(`正在處理缺失的日期: ${missingDate}`);
//       const missingDateMoment = moment(missingDate);

//       const dailyReportResult = await getDailyReportData(missingDateMoment);

//       if (
//         dailyReportResult.reject === true &&
//         dailyReportResult.reason === "timeError"
//       ) {
//         console.log("時間不符，跳過該日期:", missingDate);
//         continue; // 跳過該日期，進入下一個日期的檢查
//       }

//       console.log("該日期的日報數據已處理:", dailyReportResult);

//       // 如果處理完成，更新completeData
//       extractAndStoreDailyData([dailyReportResult], completeData);
//       console.log("完整的月份資料已存放到陣列中:", completeData);
//     }

//     // 再次檢查該月份的資料是否完整
//     const recheckMonthResult = await checkMonthExists(specifiedTime);
//     if (recheckMonthResult.state === true) {
//       console.log("經過修補後，該月份的所有數值資料已完整。");

//       // 更新completeData陣列
//       extractAndStoreDailyData(recheckMonthResult.result.docs, completeData);

//       console.log("完整的月份資料已存放到陣列中:", completeData);

//       return { state: true, data: completeData };
//     }

//     return {
//       state: false,
//       reason: "dataIncomplete",
//       missingData: missingDates,
//     };
//   }
// }

// // - 月報主程式
// // - 檢查指定時間、檢查月報資料是否存在、檢查每日資料是否完整
// // 提取並處理每日資料的通用函數
// async function getMonthlyReportData(specifiedTime) {
//   const now = moment(); // 獲取當前系統時間
//   const cutoffDate = moment("2024-06-01T00:00:00.000+08:00"); // 設定2024年6月1日作為截止日期

//   // 檢查指定時間是否晚於系統時間且早於2024年6月
//   if (specifiedTime.isAfter(now)) {
//     console.log("指定時間晚於系統時間，無法執行!");
//     return { reject: true, reason: "timeError" };
//   } else if (specifiedTime.isBefore(cutoffDate)) {
//     console.log("指定時間早於2024年6月，無法執行!");
//     return { reject: true, reason: "timeError" };
//   }

//   // 呼叫 checkMonthExists 檢查該月份的資料是否完整
//   const monthCheckResult = await checkMonthExists(specifiedTime);

//   const daysInMonth = specifiedTime.daysInMonth(); // 獲取該月的天數
//   const completeData = Array(daysInMonth + 1).fill(null); // 初始化大小为該月份天數+1的陣列

//   if (monthCheckResult.state === true) {
//     console.log("該月份的所有數值資料已存在。");

//     // 使用提取和存儲數據的通用函數
//     extractAndStoreDailyData(monthCheckResult.result.docs, completeData);

//     console.log("完整的月份資料已存放到陣列中:", completeData);
//     // 獲取AUXpowerData數據

//     const auxPowerData = await getAUXpowerData("M", specifiedTime);

//     // 獲取上一個月的數據
//     const previousMonth = moment(specifiedTime).subtract(1, "months");
//     const beforeMonthlyData = await getBeforeMonthlyData(previousMonth);

//     console.log("AUXpowerData:", auxPowerData);
//     console.log("BeforeMonthlyData:", beforeMonthlyData);

//     return { state: true, data: completeData, auxPowerData, beforeMonthlyData };
//   } else {
//     console.log("該月份的部分數值資料缺失。");

//     const foundDates = new Set(
//       monthCheckResult.result.docs.map((doc) => doc.Date)
//     );
//     const missingDates = [];

//     for (let day = 1; day <= daysInMonth; day++) {
//       const dayStr = moment(`${year}-${month}-${day}`, "YYYY-M-D").format(
//         "YYYY-MM-DD"
//       );
//       if (!foundDates.has(dayStr)) {
//         const missingDateFormatted = moment(dayStr, "YYYY-MM-DD").format(
//           "YYYY-MM-DDTHH:mm:ss.SSSZ"
//         );
//         missingDates.push(missingDateFormatted);
//       }
//     }

//     console.log("缺少的日期:", missingDates);

//     // 將每個缺失的日期傳入 getDailyReportData 並檢查結果
//     for (const missingDate of missingDates) {
//       console.log(`正在處理缺失的日期: ${missingDate}`);
//       const missingDateMoment = moment(missingDate);

//       const dailyReportResult = await getDailyReportData(missingDateMoment);

//       if (
//         dailyReportResult.reject === true &&
//         dailyReportResult.reason === "timeError"
//       ) {
//         console.log("時間不符，跳過該日期:", missingDate);
//         continue; // 跳過該日期，進入下一個日期的檢查
//       }

//       console.log("該日期的日報數據已處理:", dailyReportResult);

//       // 如果處理完成，更新completeData
//       extractAndStoreDailyData([dailyReportResult], completeData);
//       console.log("完整的月份資料已存放到陣列中:", completeData);
//     }

//     // 再次檢查該月份的資料是否完整
//     const recheckMonthResult = await checkMonthExists(specifiedTime);
//     if (recheckMonthResult.state === true) {
//       console.log("經過修補後，該月份的所有數值資料已完整。");

//       // 更新completeData陣列
//       extractAndStoreDailyData(recheckMonthResult.result.docs, completeData);

//       console.log("完整的月份資料已存放到陣列中:", completeData);

//       // 獲取AUXpowerData數據
//       const auxPowerData = await getAUXpowerData("M", specifiedTime);

//       // 獲取上一個月的數據
//       const previousMonth = moment(specifiedTime).subtract(1, "months");
//       const beforeMonthlyData = await getBeforeMonthlyData(previousMonth);

//       console.log("AUXpowerData:", auxPowerData);
//       console.log("BeforeMonthlyData:", beforeMonthlyData);

//       return {
//         state: true,
//         data: completeData,
//         auxPowerData,
//         beforeMonthlyData,
//       };
//     }

//     return {
//       state: false,
//       reason: "dataIncomplete",
//       missingData: missingDates,
//     };
//   }
// }


// /////////////////////////////////////////////////////////////////////////////////////////////
// // -日報執行主程式: 定期執行 隔天1點執行
function startdayCheck() {
  cron.schedule("5 * * * *", async () => {
    // 每個小時的第5分鐘
    const now = moment();
    console.log("正在獲取該小時執行率詳細數據! getSnigleHourValue() 執行中");
    await getMonthlyReportData(now);
  });
  console.log("已啟動定時任務，每小時的5分鐘執行一次。");
}
startdayCheck();

 module.exports = { getDailyReportData };
