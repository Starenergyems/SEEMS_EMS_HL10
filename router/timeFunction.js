const moment = require("moment");

/*
 * 轉換為 JavaScript "Date" 對象。
 * 用途：這個函數接受一個基礎日期計算(僅日期可以計算)，並指定時、分、秒、毫秒的時間。
 * 回傳格式：返回一個 JavaScript `Date` 對象，表示當前系統時區的時間，並且以 `YYYY-MM-DDTHH:mm:ss.SSS[Z]` 格式返回。
 */
function transToDate(
  baseDate,
  targetDayOffset,
  hour,
  minute,
  second,
  millisecond
) {
  // 使用 Moment.js 的 clone 方法來避免修改原始日期，并設置為本地時間
  const targetDate = moment(baseDate)
    .clone()
    .local()
    .add(targetDayOffset, "days")
    .set({
      hour: hour,
      minute: minute,
      second: second,
      millisecond: millisecond
    })
    .utcOffset("+0800")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  return targetDate;
}

// 範例輸入
// const baseDate = "2024-08-16T10:30:00.000Z"; // UTC 時間 2024-08-16T10:30:00.000Z
// const targetDayOffset = 2; // 加2天
// const hour = 15;
// const minute = 45;
// const second = 30;
// const millisecond = 123;

// const result = transToDate(
//   baseDate,
//   targetDayOffset,
//   hour,
//   minute,
//   second,
//   millisecond
// );

// console.log(result); //2024-08-18T15:45:30.123Z

/*
 * 格式化日期與時間成為"字串"。
 * 用途：這個函數接受一個基礎日期，日期偏移量，以及特定的時、分、秒、毫秒。返回的是格式化後的日期時間字串。
 * 回傳格式：返回格式化的日期時間字串，格式為 `YYYY-MM-DD HH:mm:ss`。
 */
function formatDateAndTime(
  baseDate,
  targetDayOffset,
  hour,
  minute,
  second,
  millisecond
) {
  // 使用 Moment.js 的 clone 方法來避免修改原始日期
  const targetDate = moment(baseDate).clone().add(targetDayOffset, "days").set({
    hour: hour,
    minute: minute,
    second: second,
    millisecond: millisecond
  });
  return targetDate.format("YYYY-MM-DD HH:mm:ss");
}

// 範例輸入
// const baseDate = "2024-08-16T10:30:00.000Z"; // UTC 時間 2024-08-16T10:30:00.000Z
// const targetDayOffset = 3; // 加3天
// const hour = 14;
// const minute = 20;
// const second = 45;
// const millisecond = 500;

// const result = formatDateAndTime(
//   baseDate,
//   targetDayOffset,
//   hour,
//   minute,
//   second,
//   millisecond
// );
// console.log(result); //2024-08-19 14:20:45

/*
 * 格式化日期變為"字串"。
 * 用途：這個函數接受一個基礎日期和日期偏移量，返回格式化後的日期字串。
 * 回傳格式：返回格式化的日期字串，格式為 `YYYY-MM-DD`。
 */
function formatDate(baseDate, targetDayOffset) {
  const targetDate = moment(baseDate).clone().add(targetDayOffset, "days");
  return targetDate.format("YYYY-MM-DD");
}

/*
 * 指定時間數值並格式化時間"字串"。
 * 用途：這個函數接受一個基礎日期和特定的時、分、秒、毫秒，返回格式化後的時間字串。
 * 回傳格式：返回格式化的時間字串，格式為 `HH:mm:ss`，只包含時間部分。
 */
function formatTime(baseDate, hour, minute, second, millisecond) {
  // 使用 Moment.js 的 clone 方法來避免修改原始日期
  const targetDate = moment(baseDate).clone().set({
    hour: hour,
    minute: minute,
    second: second,
    millisecond: millisecond
  });

  // 格式化為 "HH:mm:ss"，只包含時間部分
  return targetDate.format("HH:mm:ss.mmm");
}

/*
 * 只取得傳入時間的時刻（小時部分、數值）。
 * 用途：這個函數接受一個基礎日期，並返回該日期的時刻（小時部分）。
 * 回傳格式：返回整數，表示24小時制的時刻。
 */
function formatHour(baseDate) {
  const clonedDate = moment(baseDate).clone();
  return clonedDate.hour(); // 獲取小時部分
}

/*
 * 時間加減運算回傳時間"字串"。
 * 用途：這個函數接受一個時間字串，並根據提供的天數、時、分、秒、毫秒的偏移量來調整時間，最後返回一個 ISO 8601 格式的字串。
 * 回傳格式：返回格式化的 ISO 8601 時間字串，格式為 `YYYY-MM-DDTHH:mm:ss.SSSZ`。
 */
function formatTimecount(
  formattedTimeStart,
  day,
  hour,
  minute,
  second,
  millisecond
) {
  // 直接使用 Date 物件解析 ISO 8601 格式的時間
  let date = new Date(formattedTimeStart);

  // 計算
  date.setDate(date.getDate() + day);
  date.setHours(date.getHours() + hour);
  date.setMinutes(date.getMinutes() + minute);
  date.setSeconds(date.getSeconds() + second);
  date.setMilliseconds(date.getMilliseconds() + millisecond);

  // 返回 ISO 格式的字符串 'YYYY-MM-DDTHH:mm:ss.SSSZ'
  return date.toISOString();
}

// 使用範例
// const formattedTimeStart = "2024-08-11T00:00:00.000Z";
// const result = formatTimecount(formattedTimeStart, 0, 0, 0, -1, 0);

// console.log(result);

module.exports = {
  formatDateAndTime,
  formatDate,
  formatTime,
  formatHour,
  transToDate,
  formatTimecount
};
