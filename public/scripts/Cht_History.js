// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

const dateStart = document.querySelector(".timeRangeQuery #dateStart");
const timeStart = document.querySelector(".timeRangeQuery #timeStart");
const duration = document.querySelector(".timeRangeQuery #duration");
const interval = document.querySelector(".timeRangeQuery #interval");
const unitDura_Select = document.querySelector(".timeRangeQuery #unitDura_Select");
const unitInte_Select = document.querySelector(".timeRangeQuery #unitInte_Select");

let raw_DT_now = new Date();
let DT_now_Millisec = raw_DT_now.getTime();

let yy_now = raw_DT_now.getFullYear();
let mm_now = String(raw_DT_now.getMonth() + 1).padStart(2, "0");
let dd_now = String(raw_DT_now.getDate()).padStart(2, "0");
let hh_now = String(raw_DT_now.getHours()).padStart(2, "0");
let m_now = String(raw_DT_now.getMinutes()).padStart(2, "0");
// let ss_now = String(raw_DT_now.getSeconds()).padStart(2, '0');

let min_dateStart = "2020-11-25";
dateStart.setAttribute("min", min_dateStart);
dateStart.setAttribute("max", yy_now + "-" + mm_now + "-" + dd_now);
dateStart.value = yy_now + "-" + mm_now + "-" + dd_now;
timeStart.value = hh_now + ":" + m_now + ":00";

duration.value = 1;
interval.value = 1;
unitDura_Select.value = "60000";
unitInte_Select.value = "1000";
// console.log(unitDura_Select.selectedIndex);
// console.log(unitDura_Select.options[unitDura_Select.selectedIndex].value);
// console.log(unitInte_Select.value);

//////////////////////////////////////////////////////////////////////////////////////////////

Chart.defaults.datasets.line.stepped = true;
Chart.defaults.datasets.line.pointRadius = 1.5;
// Chart.defaults.datasets.line.borderWidth = 1.5;
// Chart.defaults.font.size = 16;

const bgColor = ["#5AA2ED", "#F26085", "#F39F3B", "#F6CD4F", "#66C1C0", "#9D62FF", "#C9CBCF", "#0000FF", "#008000", "#804040",];

const chtHist_Canvus = document.querySelector("#chartHist_Canvas");
const cht_History = new Chart(chtHist_Canvus, {
  type: "line",
  data: {
    labels: ["2023-10-24 13:02:41", "2023-10-24 13:02:45", "2023-10-24 13:02:43",
      "2023-10-24 13:02:47", "2023-10-24 13:02:51", "2023-10-24 13:02:53",],
    // labels: ['2023-10-24 13:02:00', '2023-10-24 13:02:01', '2023-10-24 13:02:02', '2023-10-24 13:02:03', '2023-10-24 13:02:04'
    //   , '2023-10-24 13:02:05', '2023-10-24 13:02:06', '2023-10-24 13:02:07', '2023-10-24 13:02:08', '2023-10-24 13:02:09'
    //   , '2023-10-24 13:02:10', '2023-10-24 13:02:11', '2023-10-24 13:02:12', '2023-10-24 13:02:13', '2023-10-24 13:02:14'],
    datasets: [
      {
        label: "Freq",
        data: [
          { x: "2023-10-24 13:02:47", y: 59.92 }, { x: "2023-10-24 13:02:45", y: 60.35 }, { x: "2023-10-24 13:02:46", y: 60.33 },
          { x: "2023-10-24 13:02:48", y: 59.74 }, { x: "2023-10-24 13:02:50", y: 59.81 }, { x: "2023-10-24 13:02:52", y: 60.08 },
        ],
        yAxisID: "y_Freq",
        borderColor: "#5AA2ED",
        backgroundColor: "#5AA2ED90",
      },
      {
        label: "ActivePower",
        data: [
          { x: "2023-10-24 13:02:42", y: -600 }, { x: "2023-10-24 13:02:43", y: -2500 }, { x: "2023-10-24 13:02:46", y: 3000 },
          { x: "2023-10-24 13:02:47", y: 5200 }, { x: "2023-10-24 13:02:49", y: -1800 }, { x: "2023-10-24 13:02:51", y: 900 },
        ],
        yAxisID: "y_ActivePower",
        borderColor: "#F26085",
        backgroundColor: "#F2608590",
      },
      {
        label: "ExecuteRate",
        data: [
          { x: "2023-10-24 13:02:43", y: 100 }, { x: "2023-10-24 13:02:44", y: 98 }, { x: "2023-10-24 13:02:46", y: 97 },
          { x: "2023-10-24 13:02:47", y: 92 }, { x: "2023-10-24 13:02:50", y: 95 }, { x: "2023-10-24 13:02:52", y: 96 },
        ],
        yAxisID: "y_ExecuteRate",
        borderColor: "#F39F3B",
        backgroundColor: "#F39F3B90",
      },
      {
        label: "SOC",
        data: [
          { x: "2023-10-24 13:02:43", y: 70 }, { x: "2023-10-24 13:02:44", y: 72 }, { x: "2023-10-24 13:02:46", y: 73 },
          { x: "2023-10-24 13:02:47", y: 71 }, { x: "2023-10-24 13:02:50", y: 68 }, { x: "2023-10-24 13:02:52", y: 69 },
        ],
        yAxisID: "y_SOC",
        borderColor: "#F6CD4F",
        backgroundColor: "#F6CD4F90",
      },
    ],
  },
  options: {
    // responsive: false,
    animation: false,
    scales: {
      x: {
        display: true,
        type: "time",
        time: {
          unit: "second",
          displayFormats: {
            second: "yyyy-MM-dd HH:mm:ss.S",
          },
        },
        ticks: {
          // stepSize: 2,
          // source: 'labels',
          autoSkip: true,
          maxTicksLimit: 20,
        },
        min: "2023-10-24 13:02:00.000",
        max: "2023-10-24 13:03:00.000",

        border: {
          // dash: [10, 3],
          // color: "#0000ff",
        },
        grid: {
          // color: "#ff0000",
        },
      },
      y_Freq: {
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Freq (Hz)",
        },
        min: 59.5,
        max: 60.5,
      },
      y_ActivePower: {
        display: true,
        position: "left",
        title: {
          display: true,
          text: "ActivePower (kW)",
        },
        min: -10000,
        max: 10000,
      },
      y_ExecuteRate: {
        display: true,
        position: "left",
        title: {
          display: true,
          text: "ExecuteRate (%)",
        },
        min: 0,
        max: 100,
      },
      y_SOC: {
        display: true,
        position: "left",
        title: {
          display: true,
          text: "SOC (%)",
        },
        min: 0,
        max: 100,
      },
    },
    interaction: {
      mode: "x",
    },
  },
  plugins: [{}, {}],
});

//////////////////////////////////////////////////////////////////////////////////////////////

const searchStartT = document.querySelector(".block_temp #searchStartT");
const searchEndT = document.querySelector(".block_temp #searchEndT");
const searchDuration = document.querySelector(".block_temp #searchDuration");
const searchInterval = document.querySelector(".block_temp #searchInterval");
searchStartT.textContent = "" + (DT_now_Millisec - (DT_now_Millisec % 60000));
searchEndT.textContent = "" + (Number(searchStartT.textContent) + 60000);
// console.log(new Date(Number(searchStartT.textContent)));
let EndOfToday_Millisec = DT_now_Millisec - (DT_now_Millisec % 86400000) + 86400000 - 28800000;

let update_DT_search = false;
update_xMin_xMax(searchStartT.textContent, searchEndT.textContent, update_DT_search);

let yy_temp = Number(min_dateStart[0] + min_dateStart[1] + min_dateStart[2] + min_dateStart[3]);
let mm_temp = Number(min_dateStart[5] + min_dateStart[6]) - 1;
let dd_temp = Number(min_dateStart[8] + min_dateStart[9]);

let xAxisMin_Millisec = new Date(yy_temp, mm_temp, dd_temp).getTime();
let xAxisMax_Millisec = EndOfToday_Millisec;

// 跨日更新
let schedule_02 = setInterval(update_DateStartMax, 1000);
function update_DateStartMax() {
  raw_DT_now = new Date();
  DT_now_Millisec = raw_DT_now.getTime();

  if (DT_now_Millisec >= EndOfToday_Millisec) {
    yy_now = raw_DT_now.getFullYear();
    mm_now = String(raw_DT_now.getMonth() + 1).padStart(2, "0");
    dd_now = String(raw_DT_now.getDate()).padStart(2, "0");
    dateStart.setAttribute("max", yy_now + "-" + mm_now + "-" + dd_now);
    EndOfToday_Millisec = DT_now_Millisec - (DT_now_Millisec % 86400000) + 86400000 - 28800000;
    xAxisMax_Millisec = EndOfToday_Millisec;
  }
}

// 左, 右箭頭
let duration_ms;

const goToPrevious = document.querySelector(".timeRangeQuery #goToPrevious");
goToPrevious.addEventListener("click", searchTime_GoBackward);
function searchTime_GoBackward() {
  duration_ms = Number(searchDuration.textContent);
  update_DT_search = true;

  if (Number(searchStartT.textContent) <= xAxisMin_Millisec) {
    return 0;
  } else if ((Number(searchStartT.textContent) - duration_ms * 0.25) <= xAxisMin_Millisec) {
    searchStartT.textContent = "" + xAxisMin_Millisec;
    searchEndT.textContent = xAxisMin_Millisec + duration_ms;
  } else {
    searchStartT.textContent = Number(searchStartT.textContent) - duration_ms * 0.25;
    searchEndT.textContent = Number(searchStartT.textContent) + duration_ms;
  }

  update_xMin_xMax(searchStartT.textContent, searchEndT.textContent, update_DT_search);
}

const goToNext = document.querySelector(".timeRangeQuery #goToNext");
goToNext.addEventListener("click", searchTime_GoForward);
function searchTime_GoForward() {
  duration_ms = Number(searchDuration.textContent);
  update_DT_search = true;

  if (Number(searchStartT.textContent) >= xAxisMax_Millisec) {
    return 0;
  } else if ((Number(searchStartT.textContent) + duration_ms * 0.25) >= xAxisMax_Millisec) {
    searchStartT.textContent = "" + xAxisMax_Millisec;
    searchEndT.textContent = xAxisMax_Millisec + duration_ms;
  } else {
    searchStartT.textContent = Number(searchStartT.textContent) + duration_ms * 0.25;
    searchEndT.textContent = Number(searchStartT.textContent) + duration_ms;
  }

  update_xMin_xMax(searchStartT.textContent, searchEndT.textContent, update_DT_search);
}

function update_xMin_xMax(StartTime, EndTime, update_DT_start) {
  let StartT = new Date(Number(StartTime));
  let EndT = new Date(Number(EndTime));
  // console.log(StartT + "_!_" + EndT);

  let yy_xMin = String(StartT.getFullYear()).padStart(4, "0");
  let mm_xMin = String(StartT.getMonth() + 1).padStart(2, "0");
  let dd_xMin = String(StartT.getDate()).padStart(2, "0");
  let hh_xMin = String(StartT.getHours()).padStart(2, "0");
  let m_xMin = String(StartT.getMinutes()).padStart(2, "0");
  let ss_xMin = String(StartT.getSeconds()).padStart(2, '0');
  let ms_xMin = String(StartT.getMilliseconds()).padStart(3, '0');
  let yy_xMax = String(EndT.getFullYear()).padStart(4, "0");
  let mm_xMax = String(EndT.getMonth() + 1).padStart(2, "0");
  let dd_xMax = String(EndT.getDate()).padStart(2, "0");
  let hh_xMax = String(EndT.getHours()).padStart(2, "0");
  let m_xMax = String(EndT.getMinutes()).padStart(2, "0");
  let ss_xMax = String(EndT.getSeconds()).padStart(2, '0');
  let ms_xMax = String(EndT.getMilliseconds()).padStart(3, '0');

  cht_History.options.scales.x.min = yy_xMin + "-" + mm_xMin + "-" + dd_xMin + " " + hh_xMin + ":" + m_xMin + ":" + ss_xMin + "." + ms_xMin;
  cht_History.options.scales.x.max = yy_xMax + "-" + mm_xMax + "-" + dd_xMax + " " + hh_xMax + ":" + m_xMax + ":" + ss_xMax + "." + ms_xMax;
  console.log(cht_History.options.scales.x.min + "_!_" + cht_History.options.scales.x.max);

  if (update_DT_start) {
    // console.log("abc");
    dateStart.value = yy_xMin + "-" + mm_xMin + "-" + dd_xMin;
    timeStart.value = hh_xMin + ":" + m_xMin + ":" + ss_xMin;
    // } else {
    // console.log("def");
  }

  cht_History.update();
}

//////////////////////////////////////////////////////////////////////////////////////////////

// "查詢"  1. dateStart.value & timeStart.value !== NaN   2. dateStart.value 在 x.min & x.max 之間
//         3. Duration, Interval 點數上限   4. 更新 x.min & x.max
const window_WrongDataSet = document.querySelector(".alert_WrongDataSet");
const alertMessage = document.querySelector(".alert_WrongDataSet p");

const btn_Query = document.querySelector(".timeRangeQuery #btn_Query");
btn_Query.addEventListener("click", triggerQuery);
function triggerQuery() {
  if (dateStart.value === "") {
    alertMessage.textContent = "查詢啟始日期有誤！";
    window_WrongDataSet.classList.add("appear");
  } else {
    let yy_DS = Number(dateStart.value[0] + dateStart.value[1] + dateStart.value[2] + dateStart.value[3]);
    let mm_DS = Number(dateStart.value[5] + dateStart.value[6]) - 1;
    let dd_DS = Number(dateStart.value[8] + dateStart.value[9]);
    let hh_DS = Number(timeStart.value[0] + timeStart.value[1]);
    let m_DS = Number(timeStart.value[3] + timeStart.value[4]);
    let ss_DS = Number(timeStart.value[6] + timeStart.value[7]);

    dateStart_Millisec = new Date(yy_DS, mm_DS, dd_DS, hh_DS, m_DS, ss_DS).getTime();

    if ((dateStart_Millisec < xAxisMin_Millisec) || (dateStart_Millisec > EndOfToday_Millisec)) {
      alertMessage.textContent = "查詢啟始日期超出合理設定範圍！";
      window_WrongDataSet.classList.add("appear");
      return 0;
    }

    if (Number.isNaN(Number(duration.value)) || Number(duration.value) <= 0) {
      alertMessage.textContent = "時間長度設定有誤！";
      window_WrongDataSet.classList.add("appear");
      return 0;
    }

    if (Number.isNaN(Number(interval.value)) || Number(interval.value) <= 0) {
      alertMessage.textContent = "時間間隔設定有誤！";
      window_WrongDataSet.classList.add("appear");
      return 0;
    }

    let v_Duration = Number(duration.value) * Number(unitDura_Select.value);
    let v_Interval = Number(interval.value) * Number(unitInte_Select.value);
    console.log(v_Duration + "_~_" + v_Interval);

    if ((v_Duration / v_Interval) > 50000) {
      alertMessage.textContent = "點數超過50000點！";  // ~~~~!!!!!!!!@@@@@@@@#######$$$$$$%%%%%%%%%%^^^^&&&&&&********((((((()))))))
      window_WrongDataSet.classList.add("appear");
      return 0;
    }

    searchStartT.textContent = "" + dateStart_Millisec;
    searchEndT.textContent = dateStart_Millisec + v_Duration;
    searchDuration.textContent = "" + v_Duration;
    searchInterval.textContent = "" + v_Interval;
    update_DT_search = false;

    update_xMin_xMax(searchStartT.textContent, searchEndT.textContent, update_DT_search);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

let i;
let j;
let k;

let qSelectAll_rDName;
let qSelectAll_rDAddress;
let qSelectAll_rDMax;
let qSelectAll_rDMin;
let qSelectAll_rDUnit;
let qSelectAll_rDColor;
let qSelectAll_yDisplay;
let qSelectAll_yPosition;
let qSelectAll_yAxisID;

let qSelectAll_editRegData;
let qSelectAll_regData;

document.addEventListener("DOMContentLoaded", afterLoadDCM);
function afterLoadDCM() {
  asdfg = "DOM加载了! 哈哈\n阿哈哈~";
  console.log(asdfg);

  console.log(cht_History.options.scales.y_ActivePower.min);
  // console.log(cht_History);

  // cht_History.options.scales.y_ActivePower.min = -80.631;
  let x109 = "y_ActivePower";
  console.log(cht_History.options.scales[x109].min);
  // cht_History.update();

  // console.log(cht_History.data.datasets);
  // console.log(cht_History.options.scales);
}

//////////////////////////////////////////////////////////////////////////////////////////////

function updateRegDateSetting() {
  qSelectAll_rDName = document.querySelectorAll(".table_regData .selected .rDName");
  qSelectAll_rDAddress = document.querySelectorAll(".table_regData .selected .rDAddress");
  qSelectAll_rDMax = document.querySelectorAll(".table_regData .selected .rDMax");
  qSelectAll_rDMin = document.querySelectorAll(".table_regData .selected .rDMin");
  qSelectAll_rDUnit = document.querySelectorAll(".table_regData .selected .rDUnit");
  qSelectAll_rDColor = document.querySelectorAll(".table_regData .selected .rDColor");
  qSelectAll_yDisplay = document.querySelectorAll(".table_regData .selected .yDisplay");
  qSelectAll_yPosition = document.querySelectorAll(".table_regData .selected .yPosition");
  qSelectAll_yAxisID = document.querySelectorAll(".table_regData .selected .yAxisID");

  let m = qSelectAll_rDName.length;
  let n = cht_History.data.datasets.length;

  for (j = 0; j < m; j++) {
    for (i = 0; i < n; i++) {
      if (cht_History.data.datasets[i].label === qSelectAll_rDName[j].textContent) {
        cht_History.data.datasets[i].borderColor = qSelectAll_rDColor[j].value;
        cht_History.data.datasets[i].backgroundColor = qSelectAll_rDColor[j].value + "90";

        cht_History.options.scales[qSelectAll_yAxisID[j].textContent].display = Math.round(Number(qSelectAll_yDisplay[j].value));
        cht_History.options.scales[qSelectAll_yAxisID[j].textContent].position = qSelectAll_yPosition[j].value;
        cht_History.options.scales[qSelectAll_yAxisID[j].textContent].title.text = qSelectAll_rDName[j].textContent + " (" + qSelectAll_rDUnit[j].value + ")";
        cht_History.options.scales[qSelectAll_yAxisID[j].textContent].min = Math.round(Number(qSelectAll_rDMin[j].value) * 1000) / 1000;
        cht_History.options.scales[qSelectAll_yAxisID[j].textContent].max = Math.round(Number(qSelectAll_rDMax[j].value) * 1000) / 1000;

        // console.log(cht_History.data.datasets[i]);
        // console.log(cht_History.options.scales[qSelectAll_yAxisID[j].textContent]);
        // console.log(cht_History.options.scales[qSelectAll_yAxisID[j].textContent].display);
      }
    }
  }

  cht_History.update();
}

//////////////////////////////////////////////////////////////////////////////////////////////

const eRDName = document.querySelector(".editRegData #eRDName");
const eRDAddress = document.querySelector(".editRegData #eRDAddress");
const eRDMax = document.querySelector(".editRegData #eRDMax");
const eRDMin = document.querySelector(".editRegData #eRDMin");
const eRDUnit = document.querySelector(".editRegData #eRDUnit");
const eRDColor = document.querySelector(".editRegData #eRDColor");
const eRDyDisplay = document.querySelector(".editRegData #eRDyDisplay");
const eRDyPosition = document.querySelector(".editRegData #eRDyPosition");
const window_editRegData = document.querySelector(".editRegData");
const window_addRegData = document.querySelector(".addRegData");

const config_rD = document.querySelector(".chartSettings #config_rD");
config_rD.addEventListener("click", configRegisterData);
function configRegisterData() {
  eRDName.textContent = "";
  eRDAddress.value = "";
  eRDMax.value = "";
  eRDMin.value = "";
  eRDUnit.value = "";
  eRDColor.value = "#0000FF";
  eRDyDisplay.value = "1";
  eRDyPosition.value = "left";
  qSelectAll_editRegData = document.querySelectorAll(".editRegData .regData");
  for (k = 0; k < qSelectAll_editRegData.length; k++) {
    qSelectAll_editRegData[k].classList.remove("chosen");
  }
  window_editRegData.classList.add("appear");
}

const closeWB_Yes_editRegData = document.querySelector(".editRegData #closeWB_Yes");
closeWB_Yes_editRegData.addEventListener("click", close_editRegData_Yes);
function close_editRegData_Yes() {
  updateRegDateSetting();
  window_editRegData.classList.remove("appear");
  window_addRegData.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////

// update_eRDclickEvent();

// function update_eRDclickEvent() {
qSelectAll_editRegData = document.querySelectorAll(".editRegData .regData");
for (j = 0; j < qSelectAll_editRegData.length; j++) {
  // qSelectAll_editRegData[j].addEventListener("click", selectEditRegData);
  addEventOn_editRegData(qSelectAll_editRegData[j]);
}
// }

function addEventOn_editRegData(element) {
  element.addEventListener("click", selectEditRegData);
}

function selectEditRegData(clickItem) {
  qSelectAll_rDName = document.querySelectorAll(".table_regData .rDName");
  for (i = 0; i < qSelectAll_rDName.length; i++) {
    if (qSelectAll_rDName[i].textContent === clickItem.target.textContent) {
      qSelectAll_rDAddress = document.querySelectorAll(".table_regData .rDAddress");
      qSelectAll_rDMax = document.querySelectorAll(".table_regData .rDMax");
      qSelectAll_rDMin = document.querySelectorAll(".table_regData .rDMin");
      qSelectAll_rDUnit = document.querySelectorAll(".table_regData .rDUnit");
      qSelectAll_rDColor = document.querySelectorAll(".table_regData .rDColor");
      qSelectAll_yDisplay = document.querySelectorAll(".table_regData .yDisplay");
      qSelectAll_yPosition = document.querySelectorAll(".table_regData .yPosition");

      eRDName.textContent = qSelectAll_rDName[i].textContent;
      eRDAddress.value = qSelectAll_rDAddress[i].value;
      eRDMax.value = qSelectAll_rDMax[i].value;
      eRDMin.value = qSelectAll_rDMin[i].value;
      eRDUnit.value = qSelectAll_rDUnit[i].value;
      eRDColor.value = qSelectAll_rDColor[i].value;
      eRDyDisplay.value = qSelectAll_yDisplay[i].value;
      eRDyPosition.value = qSelectAll_yPosition[i].value;

      qSelectAll_editRegData = document.querySelectorAll(".editRegData .regData");
      for (k = 0; k < qSelectAll_editRegData.length; k++) {
        qSelectAll_editRegData[k].classList.remove("chosen");
      }
      clickItem.target.classList.add("chosen");
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

const btn_updateEditRD = document.querySelector(".editRegData #btn_updateEditRD");
btn_updateEditRD.addEventListener("click", updateEditRegData);
function updateEditRegData() {
  if (eRDName.textContent !== "") {
    qSelectAll_rDName = document.querySelectorAll(".table_regData .rDName");
    qSelectAll_rDAddress = document.querySelectorAll(".table_regData .rDAddress");
    qSelectAll_rDMax = document.querySelectorAll(".table_regData .rDMax");
    qSelectAll_rDMin = document.querySelectorAll(".table_regData .rDMin");
    qSelectAll_rDUnit = document.querySelectorAll(".table_regData .rDUnit");
    qSelectAll_rDColor = document.querySelectorAll(".table_regData .rDColor");
    qSelectAll_yDisplay = document.querySelectorAll(".table_regData .yDisplay");
    qSelectAll_yPosition = document.querySelectorAll(".table_regData .yPosition");
    qSelectAll_yAxisID = document.querySelectorAll(".table_regData .yAxisID");

    for (i = 0; i < qSelectAll_rDName.length; i++) {
      if (qSelectAll_rDName[i].textContent === eRDName.textContent) {
        qSelectAll_rDAddress[i].value = eRDAddress.value;
        qSelectAll_rDMax[i].value = eRDMax.value;
        qSelectAll_rDMin[i].value = eRDMin.value;
        qSelectAll_rDUnit[i].value = eRDUnit.value;
        qSelectAll_rDColor[i].value = eRDColor.value;
        qSelectAll_yDisplay[i].value = eRDyDisplay.value;
        qSelectAll_yPosition[i].value = eRDyPosition.value;
        qSelectAll_yAxisID[i].textContent = "y_" + eRDName.textContent;
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

const window_confirm_dRD = document.querySelector(".confirm_deleteEditRD");
const deleteRDName = document.querySelector(".confirm_deleteEditRD #deleteRDName");

const btn_deleteEditRD = document.querySelector(".editRegData #btn_deleteEditRD");
btn_deleteEditRD.addEventListener("click", deleteEditRegData);
function deleteEditRegData() {
  if (eRDName.textContent !== "") {
    deleteRDName.textContent = "「" + eRDName.textContent + "」";
    window_confirm_dRD.classList.add("appear");
  }
}

const closeWB_No_confirm_dRD = document.querySelector(".confirm_deleteEditRD #closeWB_No");
closeWB_No_confirm_dRD.addEventListener("click", close_confirm_dRD_No);
function close_confirm_dRD_No() {
  window_confirm_dRD.classList.remove("appear");
}

const closeWB_Yes_confirm_dRD = document.querySelector(".confirm_deleteEditRD #closeWB_Yes");
closeWB_Yes_confirm_dRD.addEventListener("click", close_confirm_dRD_Yes);
function close_confirm_dRD_Yes() {
  let deleteName = deleteRDName.textContent.slice(1, -1);
  // console.log(deleteName);

  qSelectAll_editRegData = document.querySelectorAll(".editRegData .regData");
  qSelectAll_regData = document.querySelectorAll(".registerData .regData");
  for (i = 0; i < qSelectAll_editRegData.length; i++) {
    if (qSelectAll_editRegData[i].textContent === deleteName) {
      qSelectAll_editRegData[i].parentNode.removeChild(qSelectAll_editRegData[i]);
    }
  }
  for (i = 0; i < qSelectAll_regData.length; i++) {
    if (qSelectAll_regData[i].textContent === deleteName) {
      qSelectAll_regData[i].parentNode.removeChild(qSelectAll_regData[i]);
    }
  }
  eRDName.textContent = "";
  eRDAddress.value = "";
  eRDMax.value = "";
  eRDMin.value = "";
  eRDUnit.value = "";

  let regData_rowDeleted;
  qSelectAll_rDName = document.querySelectorAll(".table_regData .rDName");
  for (i = 0; i < qSelectAll_rDName.length; i++) {
    if (qSelectAll_rDName[i].textContent === deleteName) {
      regData_rowDeleted = qSelectAll_rDName[i].parentNode.parentNode;
      if (regData_rowDeleted.classList.contains("selected")) {
        let n = cht_History.data.datasets.length;
        for (j = 0; j < n; j++) {
          if (cht_History.data.datasets[j].label === deleteName) {
            cht_History.data.datasets.splice(j, 1);
            j = n;
          }
        }

        delete cht_History.options.scales["y_" + deleteName];
      }
      regData_rowDeleted.parentNode.removeChild(regData_rowDeleted);
    }
  }

  window_confirm_dRD.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////

const aRDName = document.querySelector(".addRegData #aRDName");
const aRDAddress = document.querySelector(".addRegData #aRDAddress");
const aRDMax = document.querySelector(".addRegData #aRDMax");
const aRDMin = document.querySelector(".addRegData #aRDMin");
const aRDUnit = document.querySelector(".addRegData #aRDUnit");
const aRDColor = document.querySelector(".addRegData #aRDColor");
const aRDyDisplay = document.querySelector(".addRegData #aRDyDisplay");
const aRDyPosition = document.querySelector(".addRegData #aRDyPosition");

const btn_addRegData = document.querySelector(".editRegData #btn_addRegData");
btn_addRegData.addEventListener("click", addRegisterData);
function addRegisterData() {
  aRDName.value = "";
  aRDAddress.value = "hl_4-1_10MW.";
  aRDMax.value = "100.0";
  aRDMin.value = "0.0";
  aRDUnit.value = "";
  aRDColor.value = "#008000";
  aRDyDisplay.value = "1";
  aRDyPosition.value = "left";

  window_addRegData.classList.add("appear");
}

const closeWB_No_addRegData = document.querySelector(".addRegData #closeWB_No");
closeWB_No_addRegData.addEventListener("click", close_addRegData_No);
function close_addRegData_No() {
  window_addRegData.classList.remove("appear");
}

const addRDName = document.querySelector(".confirm_addEditRD #addRDName");
const window_confirm_aRD = document.querySelector(".confirm_addEditRD");
const window_rDNameIsUsed = document.querySelector(".alert_rDNameIsUsed");

const closeWB_Yes_addRegData = document.querySelector(".addRegData #closeWB_Yes");
closeWB_Yes_addRegData.addEventListener("click", close_addRegData_Yes);
function close_addRegData_Yes() {
  if (aRDName.value !== "") {
    qSelectAll_rDName = document.querySelectorAll(".table_regData .rDName");

    let rDNameIsUsed = false;

    for (i = 0; i < qSelectAll_rDName.length; i++) {
      if (aRDName.value === qSelectAll_rDName[i].textContent) {
        rDNameIsUsed = true;
      }
    }

    if (rDNameIsUsed) {
      window_rDNameIsUsed.classList.add("appear");
    } else {
      let max_temp = Number(aRDMax.value);
      let min_temp = Number(aRDMin.value);

      // 點位最大值、點位最小值 必須為數字，且 點位最大值 > 點位最小值
      if (Number.isNaN(max_temp) || Number.isNaN(min_temp) || max_temp <= min_temp) {
        window_WrongDataSet.classList.add("appear");
      } else {
        addRDName.textContent = "「" + aRDName.value + "」";
        window_confirm_aRD.classList.add("appear");
      }
    }
  }
}

const closeWB_No_rDNameIsUsed = document.querySelector(".alert_rDNameIsUsed #closeWB_No");
closeWB_No_rDNameIsUsed.addEventListener("click", close_rDNameIsUsed_No);
function close_rDNameIsUsed_No() {
  window_rDNameIsUsed.classList.remove("appear");
}

const closeWB_No_WrongDataSet = document.querySelector(".alert_WrongDataSet #closeWB_No");
closeWB_No_WrongDataSet.addEventListener("click", close_WrongDataSet_No);
function close_WrongDataSet_No() {
  window_WrongDataSet.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////

const closeWB_No_confirm_aRD = document.querySelector(".confirm_addEditRD #closeWB_No");
closeWB_No_confirm_aRD.addEventListener("click", close_confirm_aRD_No);
function close_confirm_aRD_No() {
  window_confirm_aRD.classList.remove("appear");
}

const closeWB_Yes_confirm_aRD = document.querySelector(".confirm_addEditRD #closeWB_Yes");
closeWB_Yes_confirm_aRD.addEventListener("click", close_confirm_aRD_Yes);
function close_confirm_aRD_Yes() {
  // 新增regData，加上"dblclick" Function
  let regData_added = document.createElement("label");
  regData_added.innerHTML = aRDName.value;
  regData_added.setAttribute("class", "regData");
  regData_added.id = "rD_" + aRDName.value;
  document.querySelector(".registerData .regData_List").appendChild(regData_added);
  addEventOn_regData(regData_added);

  // 新增EditRegData，加上"click" Function
  let editRegData_added = document.createElement("label");
  editRegData_added.innerHTML = aRDName.value;
  editRegData_added.setAttribute("class", "regData");
  editRegData_added.id = "editRD_" + aRDName.value;
  document.querySelector(".editRegData .regData_List").appendChild(editRegData_added);
  addEventOn_editRegData(editRegData_added);

  // 新增regData到暫存table
  let regData_rowTemp = document.querySelector(".table_temp tr");
  let regData_rowAdded = regData_rowTemp.cloneNode(true);
  let regData_appended = document.querySelector(".block_temp .table_regData tbody").appendChild(regData_rowAdded);

  regData_appended.querySelector(".rDName").textContent = aRDName.value;
  regData_appended.querySelector(".rDName").id = "rDName_" + aRDName.value;
  regData_appended.querySelector(".rDAddress").value = aRDAddress.value;
  regData_appended.querySelector(".rDAddress").id = "rDAddress_" + aRDName.value;
  regData_appended.querySelector(".rDMax").value = aRDMax.value;
  regData_appended.querySelector(".rDMax").id = "rDMax_" + aRDName.value;
  regData_appended.querySelector(".rDMin").value = aRDMin.value;
  regData_appended.querySelector(".rDMin").id = "rDMin_" + aRDName.value;
  regData_appended.querySelector(".rDUnit").value = aRDUnit.value;
  regData_appended.querySelector(".rDUnit").id = "rDUnit_" + aRDName.value;
  regData_appended.querySelector(".rDColor").value = aRDColor.value;
  regData_appended.querySelector(".rDColor").id = "rDColor_" + aRDName.value;
  regData_appended.querySelector(".yDisplay").value = aRDyDisplay.value;
  regData_appended.querySelector(".yDisplay").id = "yDisplay_" + aRDName.value;
  regData_appended.querySelector(".yPosition").value = aRDyPosition.value;
  regData_appended.querySelector(".yPosition").id = "yPosition_" + aRDName.value;
  regData_appended.querySelector(".yAxisID").textContent = "y_" + aRDName.value;
  regData_appended.querySelector(".yAxisID").id = "yAxisID_" + aRDName.value;

  window_confirm_aRD.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////

// update_rDdblclickEvent();

// function update_rDdblclickEvent() {
qSelectAll_regData = document.querySelectorAll(".registerData .regData");
for (i = 0; i < qSelectAll_regData.length; i++) {
  // qSelectAll_regData[i].addEventListener("dblclick", regDataSelectDeselect);
  addEventOn_regData(qSelectAll_regData[i]);
}
// }

function addEventOn_regData(element) {
  element.addEventListener("dblclick", regDataSelectDeselect);
}

function regDataSelectDeselect(clickItem) {
  let itemName = clickItem.target.textContent;
  qSelectAll_rDName = document.querySelectorAll(".table_regData .rDName");

  if (clickItem.target.classList.contains("selected")) {
    for (i = 0; i < qSelectAll_rDName.length; i++) {
      if (qSelectAll_rDName[i].textContent === itemName) {
        qSelectAll_rDName[i].parentNode.parentNode.classList.remove("selected");
      }
    }

    // cht_History.data.datasets.forEach(arrItem => console.log(arrItem.label));
    // console.log(Object.keys(cht_History.options.scales));
    let n = cht_History.data.datasets.length;
    for (j = 0; j < n; j++) {
      if (cht_History.data.datasets[j].label === itemName) {
        cht_History.data.datasets.splice(j, 1);
        j = n;
      }
    }

    delete cht_History.options.scales["y_" + itemName];
    // cht_History.data.datasets.forEach(arrItem => console.log(arrItem.label));
    // console.log(Object.keys(cht_History.options.scales));

    clickItem.target.classList.remove("selected");
    cht_History.update();
  } else {
    for (i = 0; i < qSelectAll_rDName.length; i++) {
      if (qSelectAll_rDName[i].textContent === itemName) {
        qSelectAll_rDName[i].parentNode.parentNode.classList.add("selected");
      }
    }

    // 產生假資料值

    // 把資料值放到chart的data.datasets, options.scales

    // datasets: [{
    //   label: 'Freq',
    //   data: [{ x: '2023-10-24 13:02:47', y: 59.92 }, { x: '2023-10-24 13:02:45', y: 60.35 }, { x: '2023-10-24 13:02:46', y: 60.33 },
    //   { x: '2023-10-24 13:02:48', y: 59.74 }, { x: '2023-10-24 13:02:50', y: 59.81 }, { x: '2023-10-24 13:02:52', y: 60.08 }],
    //   yAxisID: 'y_Freq',
    //   borderColor: '#5AA2ED',
    //   backgroundColor: '#5AA2ED90',
    // }, {
    //   label: 'ActivePower',
    //   data: [{ x: '2023-10-24 13:02:42', y: -600 }, { x: '2023-10-24 13:02:43', y: -2500 }, { x: '2023-10-24 13:02:46', y: 3000 },
    //   { x: '2023-10-24 13:02:47', y: 5200 }, { x: '2023-10-24 13:02:49', y: -1800 }, { x: '2023-10-24 13:02:51', y: 900 }],
    //   yAxisID: 'y_ActivePower',
    //   borderColor: '#F26085',
    //   backgroundColor: '#F2608590',
    // }, {
    //   label: 'ExecuteRate',
    //   data: [{ x: '2023-10-24 13:02:43', y: 100 }, { x: '2023-10-24 13:02:44', y: 98 }, { x: '2023-10-24 13:02:46', y: 97 },
    //   { x: '2023-10-24 13:02:47', y: 92 }, { x: '2023-10-24 13:02:50', y: 95 }, { x: '2023-10-24 13:02:52', y: 96 }],
    //   yAxisID: 'y_ExecuteRate',
    //   borderColor: '#F39F3B',
    //   backgroundColor: '#F39F3B90',
    // }, {
    //   label: 'SOC',
    //   data: [{ x: '2023-10-24 13:02:43', y: 70 }, { x: '2023-10-24 13:02:44', y: 72 }, { x: '2023-10-24 13:02:46', y: 73 },
    //   { x: '2023-10-24 13:02:47', y: 71 }, { x: '2023-10-24 13:02:50', y: 68 }, { x: '2023-10-24 13:02:52', y: 69 }],
    //   yAxisID: 'y_SOC',
    //   borderColor: '#F6CD4F',
    //   backgroundColor: '#F6CD4F90',
    // },]

    clickItem.target.classList.add("selected");
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

const inText_test_01 = document.querySelector(".block_temp #inText_test_01");
inText_test_01.addEventListener("change", iText_test_01);
function iText_test_01() {
  // let y_P_max = Number(inText_test_01.value);
  // console.log(y_P_max + '  abc');
  // cht_History.options.scales.y_actPower.max = y_P_max;
  // console.log(cht_History.options.scales.y_actPower.max);
  // cht_History.update();
}

const inText_test_02 = document.querySelector(".block_temp #inText_test_02");
inText_test_02.addEventListener("change", iText_test_02);
function iText_test_02() {
  console.log(inText_test_02.value);
  if (inText_test_02.value !== "") {
    let y_temp_02 = Number(inText_test_02.value);
    console.log(y_temp_02);
    console.log(typeof y_temp_02);
    if (!isNaN(y_temp_02)) {
      inText_test_01.value = inText_test_02.value;
    } else {
      console.log("出現NaN了!");
    }
  } else {
    console.log("test_02是空的!");
  }
}

const btn_test_02 = document.querySelector(".block_temp #btn_test_02");
btn_test_02.addEventListener("click", updateRegDateSetting);

const btn_test_01 = document.querySelector(".block_temp #btn_test_01");
btn_test_01.addEventListener("click", b_test_01);
function b_test_01() {
  // if (cht_History.options.scales.y_actPower.min < -90) {
  //   cht_History.options.scales.y_actPower.min = -50;
  //   console.log(cht_History.options.scales.y_actPower.min);
  //   cht_History.update();
  // } else {
  //   cht_History.options.scales.y_actPower.min = -100;
  //   console.log(cht_History.options.scales.y_actPower.min);
  //   cht_History.update();
  // }

  console.log(Number(inText_test_01.value));
  // console.log(Math.round(Number(inText_test_01.value) * 1000) / 1000);
}

const btn_test_03 = document.querySelector(".block_temp #btn_test_03");
btn_test_03.addEventListener("click", b_test_03);
function b_test_03() {
  console.log(dateStart.value);
  console.log(dateStart.valueAsNumber);
}

const btn_test_04 = document.querySelector(".block_temp #btn_test_04");
btn_test_04.addEventListener("click", b_test_04);
function b_test_04() {
  console.log(timeStart.value);
  console.log(timeStart.valueAsNumber);
  console.log(Number(duration.value));
  console.log(Number(interval.value));
}
