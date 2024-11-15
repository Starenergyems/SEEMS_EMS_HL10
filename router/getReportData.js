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
const report_monthly = "report_monthly";
const report_monthlyDb = nano.use(report_monthly);
//const year_report = "year_report";
//const Year_reportDb = nano.use(year_report);
const report_hour = "report_hour";
const report_hourDb = nano.use(report_hour);
const report_day = "report_day";
const report_dayDb = nano.use(report_day);
const report_year = "report_year";
const report_yearDb = nano.use(report_year);
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

// console.log("報表數值讀取服務啟動!");

// - 副程式:查詢指定小時(日期+小時)是否已有資料
// - date會是前端傳過來的原始數值

async function checkDocumentByDate(date, hour) {
  try {
    // 使用 formatDate 函數格式化輸入的日期
    const formattedDate = formatDate(date, 0);
    console.log("檢查指定小時之日期與小時 ", formattedDate, " / ", hour);
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
      console.log("該小時數值不存在，進行撈取資料。");
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

//- 獲得該小時的得標結果時間軸 用以計算該時間所對應的資料庫得標 ID。
async function checkBidID(formattedTime) {
  //formattedTimeStart是字串
  const targetTimeStatus = 401000; // 每十五分鐘得標量的ID基礎值
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

// - 獲取該小時的原始執行率
// - 主程式傳入指定時間區間(起始與結束) 並獲取該時間區間內的原始執行率
// - 檢查是否有缺漏 非3603筆 記得確認這兩個小時有沒有得標!
async function getHourRange(formattedTimeStart, formattedTimeEnd) {
  try {
    console.log(
      "#############################################################"
    );
    console.log("該小時原始執行率搜尋起始時間:", formattedTimeStart);
    console.log("該小時原始執行率搜尋結束時間:", formattedTimeEnd);

    const checkBidIDid1 = await checkBidID(formattedTimeStart);
    const checkBidIDsecondIntervalTime = formatTimecount(
      formattedTimeEnd,
      0,
      0,
      0,
      -1,
      0
    );
    const checkBidIDid2 = await checkBidID(checkBidIDsecondIntervalTime);

    const filter = {
      selector: {
        time: {
          $gte: formattedTimeStart,
          $lte: formattedTimeEnd,
        },
      },
      limit: 3603,
    };

    const result = await gcDb.find(filter);

    if (!result.docs || result.docs.length === 0) {
      console.error("查詢結果無資料，無法進行操作，設為預設值");
      return { hourRange: Array(3603).fill(0), valueMissingNumber: 3603 };
    }

    const schedule = result.docs[0].Schedule || {};
    const todayData = schedule.Today || {};

    const checkBidValues = [
      todayData[checkBidIDid1] || 0,
      todayData[checkBidIDid2 - 3] || 0,
      todayData[checkBidIDid2 - 2] || 0,
      todayData[checkBidIDid2 - 1] || 0,
      todayData[checkBidIDid2] || 0,
    ];

    const hourRange = [];
    let valueMissingNumber = 0;

    for (let i = 0; i < 3603; i++) {
      let intervalIndex;
      if (i >= 0 && i <= 3) intervalIndex = 0;
      else if (i >= 4 && i <= 903) intervalIndex = 1;
      else if (i >= 904 && i <= 1803) intervalIndex = 2;
      else if (i >= 1804 && i <= 2703) intervalIndex = 3;
      else intervalIndex = 4;

      const intervalValue = checkBidValues[intervalIndex];

      //檢查得標情形 如果沒得標就直接假設該日執行率7654(服務品質指標0,無法賺錢)
      if (intervalValue <= 0) {
        hourRange.push(7654);
      } else {
        const data = result.docs[i]?.System?.["400037"];
        if (data === undefined || data === null) {
          valueMissingNumber++; // 計算缺失數據
          hourRange.push(0); // 缺失數據設為 0
        } else {
          hourRange.push(data); // 正常數據存入 hourRange
          //if (data === 0) valueMissingNumber++; // 若數據為 0，也增加缺失計數
        }
      }
    }
    console.log("該小時缺少秒數之數量: ", valueMissingNumber);
    console.log("---------------獲取該小時的原始執行率已結束---------------");
    return { hourRange, valueMissingNumber };
  } catch (error) {
    console.error("getHourRange在查詢或處理數據時出錯: ", error);
    return { hourRange: Array(3603).fill(0), valueMissingNumber: 3603 };
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

  //console.log("getHourRangeValue.length", hourRange.length);
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
    console.log("0點，進行日期變更，向前推一天");
  } else {
    formattedDate = formatDate(date, 0);
  }
  return formattedDate;
}

// - date = currentDate
// - (核心) 獲取每小時的執行率 會先判斷是否已存在該小時數值才進行撈取
// 依據時間範圍查詢資料庫內是否有該小時的數據，若無則透過 getHourRange 進行數據提取，並計算最大、最小和平均執行率，最終將資料存入資料庫。
async function getSnigleHourValue(date) {
  console.log(
    "########################################################################"
  );
  console.log("date: ", date);
  try {
    const formattedHour = formatHour(date); // 獲取目前小時
    const oneHourAgo = formattedHour - 1 < 0 ? 23 : formattedHour - 1; // 目標時間往前推一小時
    const formattedDate = getFormattedDate(formattedHour, date); // 若為 0 點，日期要往前推一天
    //console.log("小時執行率獲得之日期 ", formattedDate);
    //console.log("小時執行率獲得之現在小時: ", formattedHour);
    //console.log("小時執行率之目標範圍: ", oneHourAgo);
    let formattedTimeStart, formattedTimeEnd;
    // 計算時間範圍
    if (formattedHour === 0) {
      formattedTimeStart = transToDate(date, -1, 22, 56, 59, 999);
      formattedTimeEnd = transToDate(date, 0, 0, 0, 0, 0);
    } else if (formattedHour === 1 || formattedHour === 2) {
      formattedTimeStart = transToDate(date, -1, 23, 56, 59, 999);
      formattedTimeEnd = transToDate(date, 0, 1, 0, 0, 0);
    } else if (formattedHour >= 3 && formattedHour <= 15) {
      formattedTimeStart = transToDate(date, 0, formattedHour - 2, 56, 59, 999);
      formattedTimeEnd = transToDate(date, 0, formattedHour, 0, 0, 0);
    } else if (formattedHour >= 16) {
      formattedTimeStart = transToDate(
        date,
        -1,
        formattedHour - 2,
        56,
        59,
        999
      );
      formattedTimeEnd = transToDate(date, -1, formattedHour, 0, 0, 0);
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

    //console.log("hourRange: ", hourRange);

    // // 檢查是否有有效的數據
    // if (hourRange.every((value) => value === 10000)) {
    //   console.log("GOOD!");
    // } else {
    //   console.log("ok!");
    // }

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

    //console.log("newDocument:", newDocument);

    // 插入新文檔到資料庫
    const result = await report_hourDb.insert(newDocument);
    //console.log("新文檔已建立完畢，文檔內容如下: ", result);
  } catch (error) {
    console.error("檢查或創建當日資料時發生錯誤:", error);
  }
}

// const specifiedTime = moment("2024-10-07T05:05:13.816+08:00");
// getSnigleHourValue(specifiedTime);

// * 完整日報************************************************************************************************************ *//
// - 檢查全日完整資料是否已存在
async function checkDayExists(specifiedTime) {
  console.log(
    "########################################################################"
  );
  console.log("執行日報檢查，檢查之傳入時間:", specifiedTime);
  const targetDay = formatDate(specifiedTime);
  const today = specifiedTime;
  //console.log("日報檢查的目標日期(targetDay): ", targetDay);
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
    console.log("當日資料已存在，直接回傳結果。");
    return { state: true, result }; // 找到符合條件的資料，回傳 true
  } else {
    console.log("當日資料不存在，請繼續完成...");
    return { state: false, result }; // 沒有找到符合條件的資料，回傳 false
  }
}

async function check24HourExists(specifiedTime) {
  try {
    console.log(
      "########################################################################"
    );
    console.log("------ 執行檢查全日24小時的執行率是否存在 ------");
    const today = specifiedTime;
    const targetDay = formatDate(today);
    console.log("targetDay: ", targetDay);

    // 設定查詢條件，查詢指定日期的 24 小時資料
    const filter = {
      selector: {
        Date: { $eq: targetDay },
        time: { $gte: 0, $lte: 23 },
      },
      limit: 24,
      sort: [{ time: "asc" }],
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
      console.log(
        `資料不完整，缺少的時間段: ${missingTimeIndexes.join(", ")}。`
      );

      // 逐一補值，每次只補一個小時，補完再補下一個小時
      for (const Hour of missingTimeIndexes) {
        let targetHourTime;
        if (Hour === 0) {
          targetHourTime = moment.utc(specifiedTime).add(1, "days").set({
            hour: 1,
            minute: 15,
            second: 5,
            millisecond: 0,
          });
        } else if (Hour === 23) {
          targetHourTime = moment.utc(specifiedTime).add(2, "days").set({
            hour: 0,
            minute: 15,
            second: 5,
            millisecond: 0,
          });
        } else {
          targetHourTime = moment
            .utc(specifiedTime)
            .add(1, "days")
            .set({
              hour: Hour + 1,
              minute: 15,
              second: 5,
              millisecond: 0,
            });
        }

        try {
          // 再次確認該小時的數據是否存在
          const recheckDoc = await checkDocumentByDate(targetDay, Hour);
          if (recheckDoc.found) {
            hourlyDataArray[Hour] = recheckDoc.documents[0];
            console.log(`小時 ${Hour} 的數據已存在，跳過補值。`);
            continue;
          }

          // 若確實不存在，則進行補值
          console.log(`補值中：小時 ${Hour}, 時間: ${targetHourTime.format()}`);
          const singleHourResult = await getSnigleHourValue(targetHourTime);
          if (singleHourResult) {
            hourlyDataArray[Hour] = singleHourResult;
          }

          // 確保資料庫已更新
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`補值失敗: 小時 ${Hour}，錯誤: `, error);
        }
      }

      // 再次查詢資料庫以確保所有缺失時段的資料已經補齊
      result = await report_hourDb.find(filter);
      result.docs.forEach((doc) => {
        hourlyDataArray[doc.time] = doc;
      });

      // 再次檢查是否所有 24 小時的資料都已存在
      const remainingMissingIndexes = [];
      for (let i = 0; i < 24; i++) {
        if (!hourlyDataArray[i]) {
          remainingMissingIndexes.push(i);
        }
      }

      if (remainingMissingIndexes.length === 0) {
        console.log("所有缺失的時段資料已補齊。");
        return { complete: true, result: hourlyDataArray };
      } else {
        console.log(
          `仍然缺少的時間段: ${remainingMissingIndexes.join(", ")}。`
        );
        return { complete: false, result: hourlyDataArray };
      }
    }
  } catch (error) {
    console.error("check24HourExists 出錯: ", error);
    return { complete: false, error };
  }
}

// - 副程式: 獲得全天(日報)電力使用資訊
async function getFullDayPowerUsage(type, specifiedTime) {
  console.log("執行日報中電力資訊獲取，執行日期為: ", specifiedTime.format());
  console.log("類型(type): ", type);
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
  //console.log("existingData:", existingData);
  if (existingData.docs.length > 0) {
    console.log("已存在相應數據，跳過讀取other01Db，並直接回傳數值。");
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
      const kWh_Net = parseFloat((day_kWh_Import - day_kWh_Export).toFixed(2));
      //console.log("kWh_Net(差值): ", kWh_Net);

      const day_kVARh_Import =
        (valid_end_kVARh_Import - valid_start_kVARh_Import) / 10;
      // console.log("day_kVARh_Import (kVARh Import 差值): ", day_kVARh_Import);

      const day_kVARh_Export =
        (valid_end_kVARh_Export - valid_start_kVARh_Export) / 10;
      // console.log("day_kVARh_Export (kVARh Export 差值): ", day_kVARh_Export);
      const kVARh_Net = parseFloat(day_kVARh_Import - day_kVARh_Export);
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
  // console.log(
  //   "########################################################################"
  // );
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
  //console.log("2.執行日報日期檢查，檢查是否晚於正式運作日。");

  const cutoffDate = moment("2024-05-30"); // 正式運轉日
  if (
    specifiedTime.isBefore(oneDayBeforeNow) &&
    specifiedTime.isAfter(cutoffDate)
  ) {
    // console.log(
    //   `指定日期 ${specifiedTime.format()} 早於系統日期 ${now.format()} 的前一天，指定日期之日報可產出。 OK!`
    // );

    // console.log("3.執行檢查日報資料庫，檢查全日日報是否已建立於資料庫。");
    const ischeckDayExists = await checkDayExists(specifiedTime); // 檢查全日完整資料是否已存在

    if (ischeckDayExists.state === false) {
      console.log("ischeckDayExists: 資料庫內無全日資料!");

      // 檢查24小時的數值
      let check24HourExistsValue = await check24HourExists(specifiedTime);

      if (check24HourExistsValue.complete === true) {
        // console.log("日報24小時執行率已存在~");
        // console.log("日期", check24HourExistsValue.result[23].Date);
        // console.log("時間", check24HourExistsValue.result[23].time);
        // console.log(
        //   "服務品質指標陣列",
        //   check24HourExistsValue.result[23].serviceQualityArray
        // );

        // 初始化所有數值
        const hourlyDataArray = new Array(24).fill(null);
        const serviceQualitySums = new Array(7).fill(0);
        let maxHourMax_SBBPM = -Infinity;
        let minHourMin_SBBPM = Infinity;
        let totalHourAvg_SBSPM = 0;
        let validHourCount = 0;

        //console.log("進行日報數值計算。");
        // 遍歷雙重陣列
        for (let i = 0; i < check24HourExistsValue.result.length; i++) {
          const doc = check24HourExistsValue.result[i]; // 取得內部的 doc
          const time = doc.time;

          // 處理每個時段的資料
          const data = {
            time: time,
            serviceQualityArray: doc.serviceQualityArray || [
              0, 0, 0, 0, 0, 0, 0,
            ], // 若未定義則設置為默認值
            hourMax_SBBPM:
              parseFloat((doc.hourMax_SBBPM / 100).toFixed(2)) || 0,
            hourAvg_SBSPM:
              parseFloat((doc.hourAvg_SBSPM / 100).toFixed(2)) || 0,
            hourMin_SBBPM:
              parseFloat((doc.hourMin_SBBPM / 100).toFixed(2)) || 0,
          };

          hourlyDataArray[time] = data;

          // 遍歷單層陣列 serviceQualityArray
          if (
            doc.serviceQualityArray &&
            Array.isArray(doc.serviceQualityArray)
          ) {
            doc.serviceQualityArray.forEach((value, index) => {
              serviceQualitySums[index] += value;
            });
          } else {
            console.log(
              `Warning: serviceQualityArray is undefined for time ${doc.time}`
            );
          }

          // 計算最大、最小值
          if (doc.hourMax_SBBPM > maxHourMax_SBBPM) {
            maxHourMax_SBBPM = doc.hourMax_SBBPM;
          }

          if (doc.hourMin_SBBPM < minHourMin_SBBPM) {
            minHourMin_SBBPM = doc.hourMin_SBBPM;
          }

          totalHourAvg_SBSPM += doc.hourAvg_SBSPM;
          validHourCount++;
        }

        const averageHourAvg_SBSPM =
          validHourCount > 0
            ? parseFloat((totalHourAvg_SBSPM / validHourCount / 100).toFixed(2))
            : 0;

        maxHourMax_SBBPM = parseFloat((maxHourMax_SBBPM / 100).toFixed(2));
        minHourMin_SBBPM = parseFloat((minHourMin_SBBPM / 100).toFixed(2));

        // console.log("serviceQualitySums: ", serviceQualitySums);
        // console.log("最大 hourMax_SBBPM: ", maxHourMax_SBBPM);
        // console.log("最小 hourMin_SBBPM: ", minHourMin_SBBPM);
        // console.log("平均 hourAvg_SBSPM: ", averageHourAvg_SBSPM);
        // console.log("當日24小時執行率已存在，將進行用電量查詢!");

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

        //console.log("dayTable1:", dayTable1);

        const dayTable2 = [
          fullDayPowerData.day_kWh_Import,
          fullDayPowerData.day_kWh_Export,
          fullDayPowerData.kWh_Net,
        ];
        //console.log("dayTable2:", dayTable2);

        const dayTable3 = [
          resultOfstatisticsOutOfService.capacity,
          resultOfstatisticsOutOfService.hours,
          fullDayPowerData.kWh_RTE,
        ];
        //console.log("dayTable3:", dayTable3);

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
        console.log("處理 check24HourExistsValue 時出錯!");
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

    return {
      reject: true,
      Date: specifiedTime.format("YYYY-MM-DD"),
      hour_final: new Array(24).fill([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      elsedata1: [0, 0, 0],
      elsedata2: [0, 0, 0],
    };
  }
}
// * ******************************************************************************************************* * //
// 修改 getReportsInRange 為 async 函數來處理異步操作
async function getReportsInRange(startDate, endDate) {
  let currentDate = moment(startDate);
  const endDateMoment = moment(endDate);

  while (currentDate.isBefore(endDateMoment)) {
    const isReportComplete = await getDailyReportData(currentDate.clone()); // 使用 await 等待 getDailyReportData 完成
    if (isReportComplete) {
      currentDate.add(1, "day"); // 報告完成後才增加一天
    } else {
      console.log(`未完成的報告日期: ${currentDate.format()}`);
      break; // 若報告未完成，跳出迴圈，或者根據需求重試
    }
  }
}

// // 設定開始和結束日期;
// const startDate = "2024-06-01T00:00:13.816+08:00";
// const endDate = "2024-09-30T00:00:59.999+08:00";

// //執行範圍內的報告生成;
// getReportsInRange(startDate, endDate);

// * ************************************************************ * //
// * 每小時執行主程式: 定期執行 每小時的五分會進行前一個小時的資料撈取主程式
function startHourlyCheck() {
  cron.schedule("5 * * * *", async () => {
    // 每個小時的第5分鐘
    const now = moment();
    //console.log("正在獲取該小時執行率詳細數據! getSnigleHourValue() 執行中");
    await getSnigleHourValue(now);
  });
  console.log("已啟動定時任務，每小時的5分鐘執行一次。");
}
startHourlyCheck();

// * ************************************************************ * //
// * 每天用電量補值
// function getpowerData(start, end) {
//   let currentDate = moment(start);

//   // 迴圈遍歷每一天，直到達到 end
//   while (currentDate.isSameOrBefore(end)) {
//     // 格式化日期為指定的時間格式，使用 moment.js
//     let specifiedTime = currentDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

//     // 執行 getFullDayPowerUsage 函數，傳入每天的時間
//     getFullDayPowerUsage("D", specifiedTime);

//     // 將日期加一天
//     currentDate.add(1, "days");
//   }
// }

// const startDate = moment("2024-09-01T00:00:00.000+08:00");
// const endDate = moment("2024-09-30T00:00:00.000+08:00");

// getpowerData(startDate, endDate);

// * ************************************************************************************************************************ * //
// -  月報
// - 檢查月報裡的每日資料是否存在
async function checkMonthExists(specifiedTime) {
  console.log("正在檢查當月每日的完整資料是否存在");

  // 獲取指定時間的月份和年份
  const year = specifiedTime.year();
  const month = specifiedTime.month() + 1; // month() 是 0-11，需要 +1 轉為 1-12
  const daysInMonth = specifiedTime.daysInMonth(); // 獲取該月的天數

  console.log(`檢查年份 ${year} 月份 ${month} 的資料`);

  // 初始化一個空數組來儲存要檢查的日期
  const dateArray = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = moment(`${year}-${month}-${day}`, "YYYY-M-D").format(
      "YYYY-MM-DD"
    );
    dateArray.push(formattedDay);
  }

  // 設置篩選條件，檢查日期是否在當月的範圍內
  const filter = {
    selector: {
      Date: { $in: dateArray }, // 日期必須在當月的所有日期範圍內
    },
    limit: daysInMonth, // 限制返回的結果數量應該等於該月的天數
  };

  // 查詢數據庫
  const result = await report_dayDb.find(filter);

  // 判斷是否有足夠的資料並按日期排序
  if (result.docs && result.docs.length === daysInMonth) {
    // 對資料依照 Date 屬性進行排序
    result.docs.sort((a, b) => new Date(a.Date) - new Date(b.Date));

    console.log(`所有 ${daysInMonth} 天的資料都已存在，並已按日期排序。`);

    return { state: true, result }; // 找到該月所有日期的資料，回傳 true
  } else {
    console.log(`部分資料缺失，已找到 ${result.docs.length} 天的資料。`);

    // 如果有部分資料缺失，也進行排序以便後續處理
    result.docs.sort((a, b) => new Date(a.Date) - new Date(b.Date));

    return { state: false, result }; // 資料不完整，回傳 false
  }
}

//-陣列數值提取並進行計算(獲取當月的資料並統整包含當月total);
function extractAndStoreDailyData(docs, completeData) {
  let hourFinalSums = Array(7).fill(0); // 用於 completeData[31] 的加總
  let elsedata1Sums = [0, 0, 0]; // 用於 completeData[31] 的 elsedata1 加總
  let elsedata2Sums = [0, 0, 0]; // 用於 completeData[31] 的 elsedata2 加總

  let hourFinalMax = -Infinity; // 月份的最大值
  let hourFinalMin = Infinity; // 月份的最小值
  let hourFinalAvgSum = 0; // 月份平均值的累計和

  docs.forEach((doc, dayIndex) => {
    // 若當天的 doc 或其屬性為 null，則設定預設值
    const hourFinal = doc?.hour_final?.[24] || Array(10).fill(0);
    const elsedata1 = doc?.elsedata1 || [0, 0];
    const elsedata2 = doc?.elsedata2 || [0, 0, 0];

    // 取出需要的數據，並檢查是否為 null 或 undefined，若是則補 0
    const filteredData = [
      ...hourFinal.slice(0, 7).map((val) => (val == null ? 0 : val)),
      hourFinal[7] ?? 0, // 最大值
      hourFinal[8] ?? 0, // 平均值
      hourFinal[9] ?? 0, // 最小值
      parseFloat((elsedata1[0] / 1000).toFixed(2)) || 0, // elsedata1[0] 除以1000
      parseFloat((elsedata1[1] / 1000).toFixed(2)) || 0, // elsedata1[1] 除以1000
      parseFloat(((elsedata1[0] - elsedata1[1]) / 1000).toFixed(2)) || 0, // elsedata1 差值
      ...elsedata2.slice(0, 3).map((val) => (val == null ? 0 : val)), // elsedata2 的數值
    ];

    completeData[dayIndex] = filteredData; // 將每日數據放入對應的索引位置

    // 用於 completeData[31] 的整月加總
    hourFinal.slice(0, 7).forEach((value, index) => {
      hourFinalSums[index] += value || 0;
    });
    hourFinalMax = Math.max(hourFinalMax, hourFinal[7] ?? 0);
    hourFinalAvgSum += hourFinal[8] ?? 0;
    hourFinalMin = Math.min(hourFinalMin, hourFinal[9] ?? 0);
    elsedata1Sums[0] += elsedata1[0] || 0;
    elsedata1Sums[1] += elsedata1[1] || 0;
    elsedata2Sums[0] += elsedata2[0] || 0;
    elsedata2Sums[1] += elsedata2[1] || 0;
  });

  // 計算 completeData[31]（整月的加總數據）
  const hourFinalAvg = parseFloat((hourFinalAvgSum / docs.length).toFixed(2));
  elsedata1Sums[2] = parseFloat(
    ((elsedata1Sums[0] - elsedata1Sums[1]) / 1000).toFixed(2)
  );
  elsedata2Sums[2] =
    elsedata1Sums[0] !== 0
      ? parseFloat(((elsedata1Sums[1] / elsedata1Sums[0]) * 100).toFixed(2))
      : 0;

  completeData[31] = [
    ...hourFinalSums, // hour_final[24] 的前7個加總結果
    hourFinalMax, // 最大值
    hourFinalAvg, // 平均值
    hourFinalMin, // 最小值
    parseFloat((elsedata1Sums[0] / 1000).toFixed(2)), // elsedata1[0] 的加總
    parseFloat((elsedata1Sums[1] / 1000).toFixed(2)), // elsedata1[1] 的加總
    elsedata1Sums[2], // elsedata1 的差值
    ...elsedata2Sums, // elsedata2 的加總
  ];

  return completeData;
}

// - 獲得上期與去年同期的執行率資料(所以需要回傳兩個時間點的數值)
async function getBeforeMonthlyData(specifiedTime) {
  console.log("以前資料查詢的時間條件:", specifiedTime);
  const SysStartDay = moment("2023-06-01T00:00:00.000+08:00");
  const defaultData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // 計算上一期和去年同期的時間
  const lastPeriod = moment(specifiedTime)
    .subtract(1, "month")
    .startOf("month");
  const lastYearSamePeriod = moment(specifiedTime)
    .subtract(1, "year")
    .startOf("month");

  // 查詢上一期資料
  let lastPeriodData;
  if (lastPeriod.isBefore(SysStartDay)) {
    console.log(
      "上一個月的時間早於系統啟用時間，回傳 defaultData:",
      lastPeriod
    );
    lastPeriodData = defaultData;
  } else {
    try {
      const filter1 = {
        selector: {
          date: lastPeriod.format("YYYY-MM"),
        },
        limit: 1,
      };
      console.log("前月:", lastPeriod.format("YYYY-MM"));
      const lastPeriodResult = await report_monthlyDb.find(filter1);
      //console.log("lastPeriodResult", lastPeriodResult);

      // 檢查結果是否包含 docs，並正確讀取第一個元素
      if (
        lastPeriodResult &&
        lastPeriodResult.docs &&
        lastPeriodResult.docs.length > 0
      ) {
        lastPeriodData = lastPeriodResult.docs[0]; // 取出第一個文檔
        //console.log("查詢到的上一期資料:", lastPeriodData);
      } else {
        console.log(`查無上一個月 (${lastPeriod.format("YYYY-MM")}) 的資料`);
        lastPeriodData = defaultData;
      }
    } catch (err) {
      console.log(`查詢上一個月資料時發生錯誤: ${err.message}`);
      lastPeriodData = defaultData;
    }
  }

  // 查詢去年同期資料
  let lastYearData;
  if (lastYearSamePeriod.isBefore(SysStartDay)) {
    console.log(
      "去年同期的時間早於系統啟用時間，回傳 defaultData:",
      lastYearSamePeriod
    );
    lastYearData = defaultData;
  } else {
    try {
      const filter2 = {
        selector: {
          date: lastYearSamePeriod.format("YYYY-MM"),
        },
        limit: 1,
      };
      console.log("去年:", lastYearSamePeriod.format("YYYY-MM"));
      const lastYearResult = await report_monthlyDb.find(filter2);
      //console.log("lastYearResult", lastYearResult);

      // 檢查結果是否包含 docs，並正確讀取第一個元素
      if (
        lastYearResult &&
        lastYearResult.docs &&
        lastYearResult.docs.length > 0
      ) {
        lastYearData = lastYearResult.docs[0]; // 取出第一個文檔
        //console.log("查詢到的去年同期資料:", lastYearData);
      } else {
        console.log(
          `查無去年同期 (${lastYearSamePeriod.format("YYYY-MM")}) 的資料`
        );
        lastYearData = defaultData;
      }
    } catch (err) {
      console.log(`查詢去年同期資料時發生錯誤: ${err.message}`);
      lastYearData = defaultData;
    }
  }

  return {
    lastPeriodData,
    lastYearData,
  };
}

// const startMonth = moment("2024-09-30T00:30:00.000+08:00");
// getBeforeMonthlyData(startMonth);
// 中低高位元計算
function handleBorrowing(kWh_H_diff, kWh_M_diff, kWh_L_diff) {
  let L = kWh_L_diff;
  let M = kWh_M_diff;
  let H = kWh_H_diff;

  // 低位元不足的情況，從中位元借一個單位
  if (L < 0) {
    M -= 1; // 中位元借一個單位
    L += 65536; // 加上 65536，補足低位元
  }

  // 中位元不足的情況，從高位元借一個單位
  if (M < 0) {
    H -= 1; // 高位元借一個單位
    M += 65536; // 加上 65536，補足中位元
  }

  // 最終結果返回
  return {
    kWh_H: H,
    kWh_M: M,
    kWh_L: L,
  };
}
// # = 1, 2, 3, 4, … , 9
// (is mean 1-1, 1-2, … , 4-1, EMS, MVCB )
// - 獲得指定月份輔助用電資料(可用在過去時間)
async function getAUXpowerData(type, specifiedTime) {
  console.log("電力資訊-傳入的時間: ", specifiedTime.format());
  console.log("type: ", type);

  const startTime = specifiedTime
    .startOf("month")
    .format("YYYY-MM-DDT00:00:00.000+08:00");
  const endTime = specifiedTime
    .endOf("month")
    .format("YYYY-MM-DDT23:59:59.000+08:00");
  const targetDay = specifiedTime.format("YYYY-MM");
  console.log("全月的電量之startTime: ", startTime);
  console.log("全月的電量之endTime: ", endTime);

  const filter = {
    selector: {
      type: type,
      date: targetDay,
    },
    limit: 1,
  };
  const existingData = await powerusageDb.find(filter);
  if (existingData.docs.length > 0) {
    const data = existingData.docs[0];
    console.log("已存在相應數據，跳過讀取other01Db:");
    console.log("數值是:", data);
    console.log("--------------------------------------------------------");
    return {
      complete: true,
      data: data,
      message: "Data already exists.",
    };
  } else {
    console.log("未找到相應數據，繼續讀取other01Db電表數值...");

    const startTimePlusOneSecond = moment(startTime)
      .add(1, "seconds")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[+08:00]");
    const startFilter = {
      selector: {
        time: { $gte: startTime, $lt: startTimePlusOneSecond },
      },
      limit: 10,
      sort: [{ time: "asc" }],
    };
    const startResults = await other10Db.find(startFilter);

    const dataCollectionStart = {};
    // # = 1, 2, 3, 4, … , 9
    // (is mean 1-1, 1-2, … , 4-1, EMS, MVCB )
    for (let i = 1; i <= 9; i++) {
      const prefix = `AuxM${i}`;
      dataCollectionStart[prefix] = {
        kWh_Total_H: startResults.docs.map(
          (doc) => doc[prefix]?.["408080"] || null
        ),
        kWh_Total_M: startResults.docs.map(
          (doc) => doc[prefix]?.["408081"] || null
        ),
        kWh_Total_L: startResults.docs.map(
          (doc) => doc[prefix]?.["408082"] || null
        ),
      };
    }
    dataCollectionStart["AuxMtot1"] =
      startResults.docs[0]?.AuxMtot1?.["408075"] || null;

    const endTimePlusOneSecond = moment(endTime)
      .add(1, "seconds")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[+08:00]");
    const endFilter = {
      selector: {
        time: { $gte: endTime, $lt: endTimePlusOneSecond },
      },
      limit: 10,
      sort: [{ time: "asc" }],
    };
    const endResults = await other10Db.find(endFilter);

    const dataCollectionEnd = {};
    for (let i = 1; i <= 9; i++) {
      const prefix = `AuxM${i}`;
      dataCollectionEnd[prefix] = {
        kWh_Total_H: endResults.docs.map(
          (doc) => doc[prefix]?.["408080"] || null
        ),
        kWh_Total_M: endResults.docs.map(
          (doc) => doc[prefix]?.["408081"] || null
        ),
        kWh_Total_L: endResults.docs.map(
          (doc) => doc[prefix]?.["408082"] || null
        ),
      };
    }
    dataCollectionEnd["AuxMtot1"] =
      endResults.docs[0]?.AuxMtot1?.["408075"] || null;

    //輔電全部數值
    const auxPower = [];
    // 計算 AuxMtot1 的差值(總表)
    let AuxMtot1_diff =
      dataCollectionEnd["AuxMtot1"] !== null &&
      dataCollectionStart["AuxMtot1"] !== null
        ? dataCollectionEnd["AuxMtot1"] - dataCollectionStart["AuxMtot1"]
        : null;
    auxPower.push(
      AuxMtot1_diff !== null ? parseFloat(AuxMtot1_diff.toFixed(1)) : null
    );

    //其它輔電的真實使用數據
    for (let i = 1; i <= 9; i++) {
      // 只計算 AuxM1 到 AuxM8
      const prefix = `AuxM${i}`;

      // 計算差值
      let kWh_Total_H_diff =
        dataCollectionEnd[prefix].kWh_Total_H[0] -
        dataCollectionStart[prefix].kWh_Total_H[0];
      let kWh_Total_M_diff =
        dataCollectionEnd[prefix].kWh_Total_M[0] -
        dataCollectionStart[prefix].kWh_Total_M[0];
      let kWh_Total_L_diff =
        dataCollectionEnd[prefix].kWh_Total_L[0] -
        dataCollectionStart[prefix].kWh_Total_L[0];

      // 處理位元借位
      const correctedValues = handleBorrowing(
        kWh_Total_H_diff,
        kWh_Total_M_diff,
        kWh_Total_L_diff
      );

      // 計算公式並將結果固定到小數點第一位
      const calculatedValue =
        correctedValues.kWh_H * 6553.5 * 6553.5 +
        correctedValues.kWh_M * 6553.5 +
        correctedValues.kWh_L * 0.1;

      // 四捨五入並固定到小數點第一位
      const roundedValue = parseFloat(calculatedValue.toFixed(1));

      // 將結果存入陣列
      auxPower.push(roundedValue);
    }

    console.log("AuxMtot1、AuxM1 到 AuxM9 的計算結果：", auxPower);
    // 計算 auxPower 的第1到第9格的總和
    const auxSum_calculate = parseFloat(
      auxPower
        .slice(1, 10)
        .reduce((acc, val) => acc + val, 0)
        .toFixed(1)
    );

    console.log("第1到第9格的總和：", auxSum_calculate);

    const newDoc = {
      type: type,
      date: targetDay,
      auxPower: auxPower,
      powerUseSum_calculate: auxSum_calculate,
    };

    const saveResult = await powerusageDb.insert(newDoc);
    console.log("新文檔已存入資料庫: ", saveResult);

    return {
      complete: true,
      data: newDoc,
      message: "Data created with calculation and borrowing handling.",
    };
  }
}

//-檢查並獲得該月數值
async function getMonthData(specifiedTime) {
  const formattedMonth = specifiedTime.format("YYYY-MM");
  const filter_ThisMonth = {
    selector: {
      date: formattedMonth,
    },
    limit: 1,
  };

  // 檢查當月的資料是否存在
  const monthDBDataExist = await report_monthlyDb.find(filter_ThisMonth);
  if (monthDBDataExist.docs && monthDBDataExist.docs.length > 0) {
    // 如果資料存在，回傳該資料
    return { state: true, data: monthDBDataExist.docs[0] };
  } else {
    // 檢查該月份的資料是否完整
    const monthCheckResult = await checkMonthExists(specifiedTime);
    const daysInMonth = specifiedTime.daysInMonth(); // 獲取該月的天數
    const completeData = Array(31 + 1).fill(null); // 初始化大小為該月份天數+1的陣列

    if (monthCheckResult.state === true) {
      console.log("該月份的所有數值資料已存在。");
      extractAndStoreDailyData(monthCheckResult.result.docs, completeData);

      // 填補空缺的資料
      for (let i = 0; i < completeData.length; i++) {
        if (completeData[i] === null) {
          completeData[i] = Array(16).fill(0); // 用 16 個 0 填補
        }
      }

      const auxPowerData = await getAUXpowerData("M", specifiedTime);
      const beforeMonthlyData = await getBeforeMonthlyData(specifiedTime);

      const newDoc = {
        date: formattedMonth,
        sbspm: completeData,
        auxPower: auxPowerData.data.auxPower,
        powerUseSum_calculate: auxPowerData.data.powerUseSum_calculate,
      };

      const saveResult = await report_monthlyDb.insert(newDoc);
      console.log("新文檔已存入資料庫: ", saveResult);

      return {
        state: true,
        data: completeData,
        auxPowerData,
        beforeMonthlyData,
      };
    } else {
      console.log("該月份的部分數值資料缺失。");

      // 設定起始日為指定時間當月的00:00:00
      const startDate = specifiedTime
        .startOf("month")
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

      // 設定結束日為下個月的01號00:00:00
      const endDate = specifiedTime
        .add(1, "months")
        .startOf("month")
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

      console.log(`補植資料，從 ${startDate} 到 ${endDate}`);

      // 執行範圍內的報告生成
      await getReportsInRange(startDate, endDate);

      // 再次檢查並更新資料
      const recheckMonthResult = await checkMonthExists(specifiedTime);
      if (recheckMonthResult.state === true) {
        extractAndStoreDailyData(recheckMonthResult.result.docs, completeData);

        const auxPowerData = await getAUXpowerData("M", specifiedTime);
        const beforeMonthlyData = await getBeforeMonthlyData(specifiedTime);

        return {
          state: true,
          data: completeData,
          auxPowerData,
          beforeMonthlyData,
        };
      }

      return { state: false, reason: "dataIncomplete" };
    }
  }
}

// const startMonth = moment("2024-07-30T00:30:00.000+08:00");
// getMonthData(startMonth);

// --------------------------------------------------------------------------------------
// const startMonth = moment("2024-07-30T00:30:00.000+08:00");
// getAUXpowerData("M", startMonth);
// - 月報主程式
// - 檢查指定時間、檢查月報資料是否存在、檢查每日資料是否完整
// 提取並處理每日資料的通用函數
async function getMonthlyReportData(specifiedTime) {
  const now = moment(); // 獲取當前系統時間
  const cutoffDate = moment("2024-06-01T00:00:00.000+08:00"); // 設定2024年6月1日作為起始日期

  // - 檢查指定時間的有效性
  if (specifiedTime.isAfter(now)) {
    console.log("指定時間晚於系統時間，無法執行!");
    return { reject: true, reason: "timeError" };
  } else if (specifiedTime.isBefore(cutoffDate)) {
    console.log("指定時間早於2024年6月，無法執行!");
    return { reject: true, reason: "timeError" };
  }

  // 格式化指定時間、上一個月和去年同月
  const formattedMonth = specifiedTime.format("YYYY-MM");
  const previousMonthTime = moment(specifiedTime).subtract(1, "months");
  const previousMonth = previousMonthTime.format("YYYY-MM");
  const sameMonthLastYearTime = moment(specifiedTime).subtract(1, "years");
  const sameMonthLastYear = sameMonthLastYearTime.format("YYYY-MM");

  // 預設的空資料模板
  const defaultData = {
    date: null,
    sbspm: Array(31).fill([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // 預設的數據結構
    auxPower: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 預設的0數值
    powerUseSum_calculate: 0, // 預設的0值
  };

  // 檢查這個月的資料
  let thisMonth;
  const monthDBDataExist = await report_monthlyDb.find({
    selector: { date: formattedMonth },
    limit: 1,
  });
  if (monthDBDataExist.docs && monthDBDataExist.docs.length > 0) {
    thisMonth = monthDBDataExist.docs[0]; // 資料存在
  } else {
    const result = await getMonthData(specifiedTime); // 資料不存在，進行補值操作
    thisMonth =
      result.state === false
        ? { ...defaultData, date: formattedMonth }
        : result.data; // 如果補值失敗，返回預設資料
  }

  // 檢查上個月的資料，僅當上個月晚於cutoffDate時才檢查
  let lastMonth;
  if (previousMonthTime.isBefore(cutoffDate)) {
    lastMonth = { ...defaultData, date: previousMonth }; // 上個月早於cutoffDate，使用預設資料
  } else {
    const previousMonthExist = await report_monthlyDb.find({
      selector: { date: previousMonth },
      limit: 1,
    });
    if (previousMonthExist.docs && previousMonthExist.docs.length > 0) {
      lastMonth = previousMonthExist.docs[0]; // 資料存在
    } else {
      const result = await getMonthData(previousMonthTime); // 資料不存在，進行補值操作
      lastMonth =
        result.state === false
          ? { ...defaultData, date: previousMonth }
          : result.data; // 如果補值失敗，返回預設資料
    }
  }

  // 檢查去年同月的資料，僅當去年同月晚於cutoffDate時才檢查
  let lastYear;
  if (sameMonthLastYearTime.isBefore(cutoffDate)) {
    lastYear = { ...defaultData, date: sameMonthLastYear }; // 去年同月早於cutoffDate，使用預設資料
  } else {
    const sameMonthLastYearExist = await report_monthlyDb.find({
      selector: { date: sameMonthLastYear },
      limit: 1,
    });
    if (sameMonthLastYearExist.docs && sameMonthLastYearExist.docs.length > 0) {
      lastYear = sameMonthLastYearExist.docs[0]; // 資料存在
    } else {
      const result = await getMonthData(sameMonthLastYearTime); // 資料不存在，進行補值操作
      lastYear =
        result.state === false
          ? { ...defaultData, date: sameMonthLastYear }
          : result.data; // 如果補值失敗，返回預設資料
    }
  }
  console.log("-----------------------------------------");
  console.log("月報數值");
  console.log("thisMonth", thisMonth);
  console.log("lastMonth", lastMonth);
  console.log("lastYear", lastYear);
  // 最後整合回傳結果
  return {
    thisMonth,
    lastMonth,
    lastYear,
  };
}
// const startMonth = moment("2024-07-30T00:30:00.000+08:00");
// getMonthlyReportData(startMonth);

// * ************************************************************************************************************************ * //
// -  年報
async function getYearReportData(specifiedTime) {
  const cutoffDate = moment("2024-06-01T00:00:00.000+08:00"); // 設定2024年6月1日作為起始日期
  const systemCurrentTime = moment(); // 系統當前時間
  const year = specifiedTime.year(); // 獲取指定時間的年份
  const previousYear = year - 1; // 去年年份

  const defaultData = (month) => ({
    date: `${year}-${String(month).padStart(2, "0")}`,
    sbspm: Array(32).fill([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // 預設的數據結構
    auxPower: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 預設的0數值
    powerUseSum_calculate: 0, // 預設的0值
  });

  const previousYearDefault = {
    date: `${previousYear}`, // 使用去年的年月份格式
    sbspm: Array(33).fill([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    auxPower: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 預設的0數值
    powerUseSum_calculate: 0,
  };

  if (
    specifiedTime.isBefore(cutoffDate) ||
    specifiedTime.isAfter(systemCurrentTime) ||
    (specifiedTime.year() === systemCurrentTime.year() &&
      specifiedTime.month() >= systemCurrentTime.month())
  ) {
    console.log(
      "指定的時間超出範圍，返回預設資料：",
      defaultData(specifiedTime.month() + 1)
    );
    return Array.from({ length: 12 }, (_, i) => defaultData(i + 1)); // 返回全年每個月的預設資料
  }

  const yearStart = moment(`${year}-01-01T00:00:00.000+08:00`);
  const yearEnd = moment(`${year}-12-31T23:59:59.999+08:00`);

  try {
    // 查詢指定年份的數據
    const yearData = await report_monthlyDb.find({
      selector: {
        date: {
          $gte: yearStart.toISOString(),
          $lte: yearEnd.toISOString(),
        },
      },
    });

    // 準備全年數據
    const fullYearData = Array.from({ length: 12 }, (_, i) =>
      defaultData(i + 1)
    );

    if (yearData.docs && yearData.docs.length > 0) {
      yearData.docs.forEach((doc) => {
        const month = moment(doc.date).month();
        fullYearData[month] = doc;
      });
    }

    const result = {
      year, // 添加年份
      sbspm: fullYearData.map((monthData) => monthData.sbspm[31]),
      powerUseSum: fullYearData.map(
        (monthData) => monthData.powerUseSum_calculate
      ),
    };

    // 計算 sbspm 加總並存入第33格位置
    const sbspmSums = result.sbspm[0].map((_, colIndex) => {
      const values = result.sbspm.map((monthData) => monthData[colIndex]);
      const nonZeroValues = values.filter((value) => value !== 0);
      const sum = nonZeroValues.reduce((acc, val) => acc + val, 0);
      const avg =
        [7, 8, 9, 15].includes(colIndex) && nonZeroValues.length > 0
          ? sum / nonZeroValues.length
          : sum;
      return Math.round(avg * 10) / 10; // 四捨五入到小數點後一位
    });
    result.sbspm.push(sbspmSums);

    // 計算 powerUseSum 加總並存入最後一格
    const powerUseSumTotal = result.powerUseSum.reduce(
      (sum, value) => sum + value,
      0
    );
    result.powerUseSum.push(powerUseSumTotal);

    // 查詢指定時間去年的數據
    const previousYearData = await report_yearDb.find({
      selector: { year: previousYear },
    });
    const previousYearResult =
      previousYearData.docs && previousYearData.docs.length > 0
        ? previousYearData.docs[0]
        : previousYearDefault;

    // 最後返回包括去年的結果

    console.log("result:\n", result);
    console.log("----------");
    console.log("previousYearResult:\n", previousYearResult);

    return {
      ...result,
      previousYearData: previousYearResult,
    };
  } catch (error) {
    console.error("查詢數據庫時發生錯誤：", error);

    const errorResult = {
      year,
      sbspm: Array.from({ length: 12 }, (_, i) => defaultData(i + 1).sbspm[30]),
      powerUseSum: Array.from(
        { length: 12 },
        (_, i) => defaultData(i + 1).powerUseSum_calculate
      ),
    };
    console.log("返回的預設資料內容：", errorResult);
    return errorResult;
  }
}

// const specifiedTime = moment("2024-07-30T00:30:00.000+08:00");
// getYearReportData(specifiedTime);

// 1. 定期在當天 00:30 執行日報生成，傳入前一天的時間
cron.schedule("30 0 * * *", async () => {
  const specifiedTime = moment().subtract(1, "days").startOf("day");
  console.log(`執行日報生成，傳入時間：${specifiedTime.format()}`);
  await getDailyReportData(specifiedTime);
});

// 2. 定期在每月 1 日 01:15 執行月報生成，傳入前一個月的時間並指定為每月1日1:15
cron.schedule("30 1 1 * *", async () => {
  const specifiedTime = moment().subtract(1, "months").startOf("month").set({
    hour: 1,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  console.log(`執行月報生成，傳入時間：${specifiedTime.format()}`);
  await getMonthlyReportData(specifiedTime);
});

// 3. 每年 1 月 1 日 02:00:00 執行年報生成，傳入前一年的時間
cron.schedule("0 0 2 1 *", async () => {
  const specifiedTime = moment().subtract(1, "years").startOf("year");
  console.log(`執行年報生成，傳入時間：${specifiedTime.format()}`);
  await getYearReportData(specifiedTime);
});

// /////////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  getDailyReportData,
  getMonthlyReportData,
  getYearReportData,
};
