// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

//import Chart from 'chart.js/auto'

/* (async function() {
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];
  
    new Chart(
      document.getElementById('acquisitions'),
      {
        type: 'bar',
        data: {
          labels: data.map(row => row.year),
          datasets: [
            {
              label: 'Acquisitions by year',
              data: data.map(row => row.count)
            }
          ]
        }
      }
    );
})(); */

const duration = document.querySelector(".timeRangeSet #duration");
const unitDura_Select = document.querySelector(
  ".timeRangeSet #unitDura_Select"
);

//duration.value = 1;
//unitDura_Select.value = "60000";

//////////////////////////////////////////////////////////////////////////////////////////////

let No_of_xValues = 61;
let refreshRate = 1;
let xValues = Array(No_of_xValues);

Chart.defaults.datasets.line.stepped = true;
Chart.defaults.datasets.line.pointRadius = 1.5;
// Chart.defaults.datasets.line.borderWidth = 1.5;
// Chart.defaults.font.size = 16;

const bgColor = [
  "#5AA2ED",
  "#F26085",
  "#F39F3B",
  "#F6CD4F",
  "#66C1C0",
  "#9D62FF",
  "#C9CBCF",
  "#0000FF",
  "#008000",
  "#804040",
];

const chtRT_Canvus = document.querySelector("#chartRT_Canvas");
const cht_RealTime = new Chart(chtRT_Canvus, {
  type: "line",
  data: {
    // labels: xValues,
    // labels: ['2023-10-24 13:02:00', '2023-10-24 13:07:00', '2023-10-24 13:12:00', '2023-10-24 13:17:00', '2023-10-24 13:22:00'
    // , '2023-10-24 13:27:00', '2023-10-24 13:32:00', '2023-10-24 13:37:00', '2023-10-24 13:42:00', '2023-10-24 13:47:00'],
    datasets: [
      {
        label: "Freq",
        // data: Array(No_of_xValues),
        data: [],
        yAxisID: "y_Freq",
        borderColor: "#5AA2ED",
        backgroundColor: "#5AA2ED90",
      },
      {
        label: "ActivePower",
        data: [],
        // data: [-600, -2500, -3000],
        // data: [-600, -2500, -3000, -5200, -1800, 2100, 4900, 8300, 6700, 1400],
        // data: [, , , , , , , , , 1400],
        // data: [{ x: '2023-10-24 13:02:00', y: -600 }, { x: '2023-10-24 13:03:00', y: -2500 }, { x: '2023-10-24 13:12:00', y: -3000 },
        // { x: '2023-10-24 13:17:00', y: -5200 }, { x: '2023-10-24 13:22:00', y: -1800 }, { x: '2023-10-24 13:27:00', y: 2100 },
        // { x: '2023-10-24 13:32:00', y: 4900 }, { x: '2023-10-24 13:37:00', y: 8300 }, { x: '2023-10-24 13:42:00', y: 6700 },
        // { x: '2023-10-24 13:47:00', y: 1400 }],
        yAxisID: "y_ActivePower",
        borderColor: "#F26085",
        backgroundColor: "#F2608590",
      },
      {
        label: "ExecuteRate",
        data: [],
        yAxisID: "y_ExecuteRate",
        borderColor: "#F39F3B",
        backgroundColor: "#F39F3B90",
      },
      {
        label: "SOC",
        data: [],
        yAxisID: "y_SOC",
        borderColor: "#F6CD4F",
        backgroundColor: "#F6CD4F90",
      },
    ],
  },
  options: {
    // responsive: false,
    animation: false,
    // title: {
    //   display: true,
    //   padding: 15,
    //   text: '頻率 (Hz)4t54vy6y6hch6',
    //   position: 'bottom',
    //   fontSize: 16,
    //   fontColor: '#ffaa00',
    //   fontFamily: 'Arial',
    //   fontStyle: 'normal'
    // },
    tooltips: {
      // mode: 'x',
      // intersect: false,
    },
    scales: {
      // xAxis: [{
      //   type: 'time',
      //   time: {
      //     unit: 'minute',
      //     displayFormats: {
      //       minute: 'HH:mm:SS'
      //     }
      //   },
      //   ticks: {
      //     source: 'labels'
      //   }
      // }],

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
        min: "2023-11-24 13:02:00.000",
        max: "2023-11-24 13:03:00.000",

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
    // legend: {
    //   display: false
    // },
    interaction: {
      mode: "x",
    },
  },
  plugins: [{}, {}],
});

//////////////////////////////////////////////////////////////////////////////////////////////

let raw_DT_now = new Date();
let DT_now_Millisec = raw_DT_now.getTime();

const searchStartT = document.querySelector(".block_temp #searchStartT");
const searchEndT = document.querySelector(".block_temp #searchEndT");
const searchDuration = document.querySelector(".block_temp #searchDuration");

searchEndT.textContent = "" + (DT_now_Millisec - (DT_now_Millisec % 1000));
searchStartT.textContent = "" + (Number(searchEndT.textContent) - 60000);

update_xMin_xMax(searchStartT.textContent, searchEndT.textContent);

function update_xMin_xMax(StartTime, EndTime) {
  let StartT = new Date(Number(StartTime));
  let EndT = new Date(Number(EndTime));

  let yy_xMin = String(StartT.getFullYear()).padStart(4, "0");
  let mm_xMin = String(StartT.getMonth() + 1).padStart(2, "0");
  let dd_xMin = String(StartT.getDate()).padStart(2, "0");
  let hh_xMin = String(StartT.getHours()).padStart(2, "0");
  let m_xMin = String(StartT.getMinutes()).padStart(2, "0");
  let ss_xMin = String(StartT.getSeconds()).padStart(2, "0");
  let ms_xMin = String(StartT.getMilliseconds()).padStart(3, "0");
  let yy_xMax = String(EndT.getFullYear()).padStart(4, "0");
  let mm_xMax = String(EndT.getMonth() + 1).padStart(2, "0");
  let dd_xMax = String(EndT.getDate()).padStart(2, "0");
  let hh_xMax = String(EndT.getHours()).padStart(2, "0");
  let m_xMax = String(EndT.getMinutes()).padStart(2, "0");
  let ss_xMax = String(EndT.getSeconds()).padStart(2, "0");
  let ms_xMax = String(EndT.getMilliseconds()).padStart(3, "0");

  cht_RealTime.options.scales.x.min =
    yy_xMin +
    "-" +
    mm_xMin +
    "-" +
    dd_xMin +
    " " +
    hh_xMin +
    ":" +
    m_xMin +
    ":" +
    ss_xMin +
    "." +
    ms_xMin;
  cht_RealTime.options.scales.x.max =
    yy_xMax +
    "-" +
    mm_xMax +
    "-" +
    dd_xMax +
    " " +
    hh_xMax +
    ":" +
    m_xMax +
    ":" +
    ss_xMax +
    "." +
    ms_xMax;
  // console.log(cht_RealTime.options.scales.x.min + "_!_" + cht_RealTime.options.scales.x.max);

  cht_RealTime.update();
  return cht_RealTime.options.scales.x.max;
}

//////////////////////////////////////////////////////////////////////////////////////////////

// "設定"
const window_WrongDataSet = document.querySelector(".alert_WrongDataSet");
const alertMessage = document.querySelector(".alert_WrongDataSet p");

const btn_Set = document.querySelector(".timeRangeSet #btn_Set");
btn_Set.addEventListener("click", triggerSet);
function triggerSet() {
  if (Number.isNaN(Number(duration.value)) || Number(duration.value) <= 0) {
    alertMessage.textContent = "時間長度設定有誤！";
    window_WrongDataSet.classList.add("appear");
  } else {
    /* let v_Duration = Number(duration.value) * Number(unitDura_Select.value);

    raw_DT_now = new Date();
    DT_now_Millisec = raw_DT_now.getTime();

    searchEndT.textContent = "" + (DT_now_Millisec - (DT_now_Millisec % 1000));
    searchStartT.textContent = "" + (Number(searchEndT.textContent) - v_Duration);
    searchDuration.textContent = "" + v_Duration;

    update_xMin_xMax(searchStartT.textContent, searchEndT.textContent);*/
    console.log(duration.value);
    console.log(unitDura_Select.value);
    dataPost(
      "http://localhost:3000/chart/realtime",
      duration.value,
      unitDura_Select.value
    ); //port要改
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
  asdfg = "哈哈阿哈哈";
  console.log("DOM 加载了~ " + asdfg);

  let schedule_02 = setInterval(updateChartData, refreshRate * 1000);
  function updateChartData() {
    searchStartT.textContent =
      "" + (Number(searchStartT.textContent) + refreshRate * 1000);
    searchEndT.textContent =
      "" + (Number(searchEndT.textContent) + refreshRate * 1000);

    let x_newData = update_xMin_xMax(
      searchStartT.textContent,
      searchEndT.textContent
    );

    let n = cht_RealTime.data.datasets.length;
    for (i = 0; i < n; i++) {
      let newElement_data = { x: "", y: null };
      // { x: '2023-11-29 21:24:57.456', y: 60.35 }
      newElement_data.x = x_newData;

      let y_newData_min =
        cht_RealTime.options.scales["y_" + cht_RealTime.data.datasets[i].label]
          .min;
      let y_newData_max =
        cht_RealTime.options.scales["y_" + cht_RealTime.data.datasets[i].label]
          .max;

      newElement_data.y =
        Math.floor(
          (y_newData_min + Math.random() * (y_newData_max - y_newData_min)) *
            1000
        ) / 1000;

      cht_RealTime.data.datasets[i].data.push(newElement_data);
    }

    cht_RealTime.update();
  }
}

/*function doSomething() {
  asdfg = '哈哈阿哈哈';
  console.log("DOM 加载了~ " + asdfg);

  let rawDateTime = new Date();
  let yy = rawDateTime.getFullYear();
  let mm = String(rawDateTime.getMonth() + 1).padStart(2, '0');
  let dd = String(rawDateTime.getDate()).padStart(2, '0');
  let hh = String(rawDateTime.getHours()).padStart(2, '0');
  let m = String(rawDateTime.getMinutes()).padStart(2, '0');
  let ss = String(rawDateTime.getSeconds()).padStart(2, '0');

  let Data_t = [yy + "-" + mm + "-" + dd + " " + hh + ":" + m + ":" + ss, 59.63, 0, 75]

  for (i = 1; i < No_of_xValues; i++) {
    let rawDT_temp = new Date(rawDateTime.getTime() - refreshRate * i * 1000);
    let yy_temp = rawDT_temp.getFullYear();
    let mm_temp = String(rawDT_temp.getMonth() + 1).padStart(2, '0');
    let dd_temp = String(rawDT_temp.getDate()).padStart(2, '0');
    let hh_temp = String(rawDT_temp.getHours()).padStart(2, '0');
    let m_temp = String(rawDT_temp.getMinutes()).padStart(2, '0');
    let ss_temp = String(rawDT_temp.getSeconds()).padStart(2, '0');

    cht_RealTime.data.datasets[0].data[No_of_xValues - i - 1] = { x: yy_temp + "-" + mm_temp + "-" + dd_temp + " " + hh_temp + ":" + m_temp + ":" + ss_temp, y: null };
  }

  cht_RealTime.data.datasets[0].data[No_of_xValues - 1] = { x: Data_t[0], y: Data_t[1] };
  cht_RealTime.data.datasets[1].data[No_of_xValues - 1] = Data_t[2];
  cht_RealTime.data.datasets[2].data[No_of_xValues - 1] = Data_t[3];

  cht_RealTime.update();

  let schedule_03 = setInterval(function () { updateChartData(cht_RealTime, Data_t); }, refreshRate * 1000);
  function updateChartData(chart, newRawData) {
    // console.log(122);
    // console.log(newRawData);

    let rawDateTime = new Date();
    let yy = rawDateTime.getFullYear();
    let mm = String(rawDateTime.getMonth() + 1).padStart(2, '0');
    let dd = String(rawDateTime.getDate()).padStart(2, '0');
    let hh = String(rawDateTime.getHours()).padStart(2, '0');
    let m = String(rawDateTime.getMinutes()).padStart(2, '0');
    let ss = String(rawDateTime.getSeconds()).padStart(2, '0');

    // newData[0] = Math.floor(Math.random() * max);
    newRawData[0] = yy + "-" + mm + "-" + dd + " " + hh + ":" + m + ":" + ss;
    // newRawData[1] = 59.5 + Math.random();
    // newRawData[2] = -10000 + Math.random() * 20000;
    // newRawData[3] = 80 + Math.random() * 20;
    // newRawData[1] = chart.data.datasets[0].data[2].y + 0.01;
    // newRawData[2] = chart.data.datasets[1].data[2] + 10;
    // newRawData[3] = chart.data.datasets[2].data[2] - 1;
    newRawData[1] = chart.data.datasets[0].data[No_of_xValues - 1].y <= 60.47 ? chart.data.datasets[0].data[No_of_xValues - 1].y + 0.03 : 59.5;
    newRawData[2] = chart.data.datasets[1].data[No_of_xValues - 1] <= 9000 ? chart.data.datasets[1].data[No_of_xValues - 1] + 1000 : -10000;
    newRawData[3] = chart.data.datasets[2].data[No_of_xValues - 1] >= 10 ? chart.data.datasets[2].data[No_of_xValues - 1] - 10 : 100;

    // let newData = [{ x: newRawData[0], y: newRawData[1] }, newRawData[2], newRawData[3]];
    let newData = [{ x: newRawData[0], y: newRawData[1] }];
    for (i = 0; i < newRawData.length - 2; i++) {
      newData.push(newRawData[i + 2]);
    }

    // console.log(newRawData);
    // console.log(chart.data.datasets[0].data[1]);
    // console.log(newData);

    // console.log(chart.data.datasets[0].data);

    // chart.data.datasets[0].data.push(newData);
    // chart.data.datasets[0].data.shift();
    // console.log(chart.data.datasets[0].data);

    for (i = 0; i < newData.length; i++) {
      chart.data.datasets[i].data.push(newData[i]);
      chart.data.datasets[i].data.shift();
    }

    chart.update();

    // console.log(chart.data.datasets[0].data);
    // console.log(chart.data.datasets[1].data);
    // console.log(chart.data.datasets[2].data);
  }

} */

//////////////////////////////////////////////////////////////////////////////////////////////

function updateRegDateSetting() {
  qSelectAll_rDName = document.querySelectorAll(
    ".table_regData .selected .rDName"
  );
  qSelectAll_rDAddress = document.querySelectorAll(
    ".table_regData .selected .rDAddress"
  );
  qSelectAll_rDMax = document.querySelectorAll(
    ".table_regData .selected .rDMax"
  );
  qSelectAll_rDMin = document.querySelectorAll(
    ".table_regData .selected .rDMin"
  );
  qSelectAll_rDUnit = document.querySelectorAll(
    ".table_regData .selected .rDUnit"
  );
  qSelectAll_rDColor = document.querySelectorAll(
    ".table_regData .selected .rDColor"
  );
  qSelectAll_yDisplay = document.querySelectorAll(
    ".table_regData .selected .yDisplay"
  );
  qSelectAll_yPosition = document.querySelectorAll(
    ".table_regData .selected .yPosition"
  );
  qSelectAll_yAxisID = document.querySelectorAll(
    ".table_regData .selected .yAxisID"
  );

  let m = qSelectAll_rDName.length;
  let n = cht_RealTime.data.datasets.length;

  for (j = 0; j < m; j++) {
    for (i = 0; i < n; i++) {
      if (
        cht_RealTime.data.datasets[i].label === qSelectAll_rDName[j].textContent
      ) {
        cht_RealTime.data.datasets[i].borderColor = qSelectAll_rDColor[j].value;
        cht_RealTime.data.datasets[i].backgroundColor =
          qSelectAll_rDColor[j].value + "90";

        cht_RealTime.options.scales[qSelectAll_yAxisID[j].textContent].display =
          Math.round(Number(qSelectAll_yDisplay[j].value));
        cht_RealTime.options.scales[
          qSelectAll_yAxisID[j].textContent
        ].position = qSelectAll_yPosition[j].value;
        cht_RealTime.options.scales[
          qSelectAll_yAxisID[j].textContent
        ].title.text =
          qSelectAll_rDName[j].textContent +
          " (" +
          qSelectAll_rDUnit[j].value +
          ")";
        cht_RealTime.options.scales[qSelectAll_yAxisID[j].textContent].min =
          Math.round(Number(qSelectAll_rDMin[j].value) * 1000) / 1000;
        cht_RealTime.options.scales[qSelectAll_yAxisID[j].textContent].max =
          Math.round(Number(qSelectAll_rDMax[j].value) * 1000) / 1000;

        // console.log(cht_RealTime.data.datasets[i]);
        // console.log(cht_RealTime.options.scales[qSelectAll_yAxisID[j].textContent]);
        // console.log(cht_RealTime.options.scales[qSelectAll_yAxisID[j].textContent].display);
      }
    }
  }

  cht_RealTime.update();
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

const closeWB_Yes_editRegData = document.querySelector(
  ".editRegData #closeWB_Yes"
);
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
      qSelectAll_rDAddress = document.querySelectorAll(
        ".table_regData .rDAddress"
      );
      qSelectAll_rDMax = document.querySelectorAll(".table_regData .rDMax");
      qSelectAll_rDMin = document.querySelectorAll(".table_regData .rDMin");
      qSelectAll_rDUnit = document.querySelectorAll(".table_regData .rDUnit");
      qSelectAll_rDColor = document.querySelectorAll(".table_regData .rDColor");
      qSelectAll_yDisplay = document.querySelectorAll(
        ".table_regData .yDisplay"
      );
      qSelectAll_yPosition = document.querySelectorAll(
        ".table_regData .yPosition"
      );

      eRDName.textContent = qSelectAll_rDName[i].textContent;
      eRDAddress.value = qSelectAll_rDAddress[i].value;
      eRDMax.value = qSelectAll_rDMax[i].value;
      eRDMin.value = qSelectAll_rDMin[i].value;
      eRDUnit.value = qSelectAll_rDUnit[i].value;
      eRDColor.value = qSelectAll_rDColor[i].value;
      eRDyDisplay.value = qSelectAll_yDisplay[i].value;
      eRDyPosition.value = qSelectAll_yPosition[i].value;

      qSelectAll_editRegData = document.querySelectorAll(
        ".editRegData .regData"
      );
      for (k = 0; k < qSelectAll_editRegData.length; k++) {
        qSelectAll_editRegData[k].classList.remove("chosen");
      }
      clickItem.target.classList.add("chosen");
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

const btn_updateEditRD = document.querySelector(
  ".editRegData #btn_updateEditRD"
);
btn_updateEditRD.addEventListener("click", updateEditRegData);
function updateEditRegData() {
  if (eRDName.textContent !== "") {
    qSelectAll_rDName = document.querySelectorAll(".table_regData .rDName");
    qSelectAll_rDAddress = document.querySelectorAll(
      ".table_regData .rDAddress"
    );
    qSelectAll_rDMax = document.querySelectorAll(".table_regData .rDMax");
    qSelectAll_rDMin = document.querySelectorAll(".table_regData .rDMin");
    qSelectAll_rDUnit = document.querySelectorAll(".table_regData .rDUnit");
    qSelectAll_rDColor = document.querySelectorAll(".table_regData .rDColor");
    qSelectAll_yDisplay = document.querySelectorAll(".table_regData .yDisplay");
    qSelectAll_yPosition = document.querySelectorAll(
      ".table_regData .yPosition"
    );
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
const deleteRDName = document.querySelector(
  ".confirm_deleteEditRD #deleteRDName"
);

const btn_deleteEditRD = document.querySelector(
  ".editRegData #btn_deleteEditRD"
);
btn_deleteEditRD.addEventListener("click", deleteEditRegData);
function deleteEditRegData() {
  if (eRDName.textContent !== "") {
    deleteRDName.textContent = "「" + eRDName.textContent + "」";
    window_confirm_dRD.classList.add("appear");
  }
}

const closeWB_No_confirm_dRD = document.querySelector(
  ".confirm_deleteEditRD #closeWB_No"
);
closeWB_No_confirm_dRD.addEventListener("click", close_confirm_dRD_No);
function close_confirm_dRD_No() {
  window_confirm_dRD.classList.remove("appear");
}

const closeWB_Yes_confirm_dRD = document.querySelector(
  ".confirm_deleteEditRD #closeWB_Yes"
);
closeWB_Yes_confirm_dRD.addEventListener("click", close_confirm_dRD_Yes);
function close_confirm_dRD_Yes() {
  let deleteName = deleteRDName.textContent.slice(1, -1);

  qSelectAll_editRegData = document.querySelectorAll(".editRegData .regData");
  qSelectAll_regData = document.querySelectorAll(".registerData .regData");
  for (i = 0; i < qSelectAll_editRegData.length; i++) {
    if (qSelectAll_editRegData[i].textContent === deleteName) {
      qSelectAll_editRegData[i].parentNode.removeChild(
        qSelectAll_editRegData[i]
      );
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

      // cht_RealTime.data.datasets.forEach(arrItem => console.log(arrItem.label));
      // console.log(Object.keys(cht_RealTime.options.scales));
      if (regData_rowDeleted.classList.contains("selected")) {
        let n = cht_RealTime.data.datasets.length;
        for (j = 0; j < n; j++) {
          if (cht_RealTime.data.datasets[j].label === deleteName) {
            cht_RealTime.data.datasets.splice(j, 1);
            j = n;
          }
        }

        delete cht_RealTime.options.scales["y_" + deleteName];
      }
      // cht_RealTime.data.datasets.forEach(arrItem => console.log(arrItem.label));
      // console.log(Object.keys(cht_RealTime.options.scales));

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

const closeWB_Yes_addRegData = document.querySelector(
  ".addRegData #closeWB_Yes"
);
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
      if (
        Number.isNaN(max_temp) ||
        Number.isNaN(min_temp) ||
        max_temp <= min_temp
      ) {
        window_WrongDataSet.classList.add("appear");
      } else {
        addRDName.textContent = "「" + aRDName.value + "」";
        window_confirm_aRD.classList.add("appear");
      }
    }
  }
}

const closeWB_No_rDNameIsUsed = document.querySelector(
  ".alert_rDNameIsUsed #closeWB_No"
);
closeWB_No_rDNameIsUsed.addEventListener("click", close_rDNameIsUsed_No);
function close_rDNameIsUsed_No() {
  window_rDNameIsUsed.classList.remove("appear");
}

const closeWB_No_WrongDataSet = document.querySelector(
  ".alert_WrongDataSet #closeWB_No"
);
closeWB_No_WrongDataSet.addEventListener("click", close_WrongDataSet_No);
function close_WrongDataSet_No() {
  window_WrongDataSet.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////

const closeWB_No_confirm_aRD = document.querySelector(
  ".confirm_addEditRD #closeWB_No"
);
closeWB_No_confirm_aRD.addEventListener("click", close_confirm_aRD_No);
function close_confirm_aRD_No() {
  window_confirm_aRD.classList.remove("appear");
}

const closeWB_Yes_confirm_aRD = document.querySelector(
  ".confirm_addEditRD #closeWB_Yes"
);
closeWB_Yes_confirm_aRD.addEventListener("click", close_confirm_aRD_Yes);
function close_confirm_aRD_Yes() {
  // 新增regData，加上"dblclick" Function
  let regData_added = document.createElement("label");
  regData_added.innerHTML = aRDName.value;
  regData_added.setAttribute("class", "regData");
  regData_added.id = "rD_" + aRDName.value;
  document
    .querySelector(".registerData .regData_List")
    .appendChild(regData_added);
  addEventOn_regData(regData_added);

  // 新增EditRegData，加上"click" Function
  let editRegData_added = document.createElement("label");
  editRegData_added.innerHTML = aRDName.value;
  editRegData_added.setAttribute("class", "regData");
  editRegData_added.id = "editRD_" + aRDName.value;
  document
    .querySelector(".editRegData .regData_List")
    .appendChild(editRegData_added);
  addEventOn_editRegData(editRegData_added);

  // 新增regData到暫存table
  let regData_rowTemp = document.querySelector(".table_temp tr");
  let regData_rowAdded = regData_rowTemp.cloneNode(true);
  let regData_appended = document
    .querySelector(".block_temp .table_regData tbody")
    .appendChild(regData_rowAdded);

  regData_appended.querySelector(".rDName").textContent = aRDName.value;
  regData_appended.querySelector(".rDName").id = "rDName_" + aRDName.value;
  regData_appended.querySelector(".rDAddress").value = aRDAddress.value;
  regData_appended.querySelector(".rDAddress").id =
    "rDAddress_" + aRDName.value;
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
  regData_appended.querySelector(".yPosition").id =
    "yPosition_" + aRDName.value;
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

    cht_RealTime.data.datasets.forEach((arrItem) => console.log(arrItem.label));
    console.log(Object.keys(cht_RealTime.options.scales));
    let n = cht_RealTime.data.datasets.length;
    for (j = 0; j < n; j++) {
      if (cht_RealTime.data.datasets[j].label === itemName) {
        cht_RealTime.data.datasets.splice(j, 1);
        j = n;
      }
    }

    delete cht_RealTime.options.scales["y_" + itemName];
    cht_RealTime.data.datasets.forEach((arrItem) => console.log(arrItem.label));
    console.log(Object.keys(cht_RealTime.options.scales));

    clickItem.target.classList.remove("selected");
    cht_RealTime.update();
  } else {
    for (i = 0; i < qSelectAll_rDName.length; i++) {
      if (qSelectAll_rDName[i].textContent === itemName) {
        qSelectAll_rDName[i].parentNode.parentNode.classList.add("selected");

        // 產生點位的data.datasets, options.scales
        qSelectAll_rDMax = document.querySelectorAll(".table_regData .rDMax");
        qSelectAll_rDMin = document.querySelectorAll(".table_regData .rDMin");
        qSelectAll_rDUnit = document.querySelectorAll(".table_regData .rDUnit");
        qSelectAll_rDColor = document.querySelectorAll(
          ".table_regData .rDColor"
        );
        qSelectAll_yDisplay = document.querySelectorAll(
          ".table_regData .yDisplay"
        );
        qSelectAll_yPosition = document.querySelectorAll(
          ".table_regData .yPosition"
        );
        qSelectAll_yAxisID = document.querySelectorAll(
          ".table_regData .yAxisID"
        );
        let newElement_datasets = {
          label: "",
          data: [],
          yAxisID: "",
          borderColor: "",
          backgroundColor: "",
        };

        // console.log(newElement_datasets);
        newElement_datasets.label = qSelectAll_rDName[i].textContent;
        newElement_datasets.yAxisID = "y_" + qSelectAll_rDName[i].textContent;
        newElement_datasets.borderColor = qSelectAll_rDColor[i].value;
        newElement_datasets.backgroundColor =
          qSelectAll_rDColor[i].value + "90";
        // console.log(newElement_datasets);

        cht_RealTime.data.datasets.push(newElement_datasets);
        console.log(cht_RealTime.data.datasets[0]);
        console.log(
          cht_RealTime.data.datasets[cht_RealTime.data.datasets.length - 1]
        );

        // console.log(cht_RealTime.options.scales[qSelectAll_yAxisID[i].textContent]);

        cht_RealTime.options.scales["y_" + qSelectAll_rDName[i].textContent] =
          {};
        // console.log(cht_RealTime.options.scales[qSelectAll_yAxisID[i].textContent]);

        cht_RealTime.options.scales[
          "y_" + qSelectAll_rDName[i].textContent
        ].display = Boolean(Number(qSelectAll_yDisplay[i].value));
        // console.log(cht_RealTime.options.scales[qSelectAll_yAxisID[i].textContent]);

        cht_RealTime.options.scales[
          "y_" + qSelectAll_rDName[i].textContent
        ].position = qSelectAll_yPosition[i].value;
        cht_RealTime.options.scales[
          "y_" + qSelectAll_rDName[i].textContent
        ].title = {};
        cht_RealTime.options.scales[
          "y_" + qSelectAll_rDName[i].textContent
        ].title.display = true;
        cht_RealTime.options.scales[
          "y_" + qSelectAll_rDName[i].textContent
        ].title.text =
          qSelectAll_rDName[i].textContent +
          " (" +
          qSelectAll_rDUnit[i].value +
          ")";
        cht_RealTime.options.scales[
          "y_" + qSelectAll_rDName[i].textContent
        ].min = Number(qSelectAll_rDMin[i].value);
        cht_RealTime.options.scales[
          "y_" + qSelectAll_rDName[i].textContent
        ].max = Number(qSelectAll_rDMax[i].value);
        console.log(
          cht_RealTime.options.scales[qSelectAll_yAxisID[i].textContent]
        );

        cht_RealTime.update();
        console.log(
          cht_RealTime.options.scales[qSelectAll_yAxisID[i].textContent]
        );

        console.log(cht_RealTime.options.scales["y_Freq"]);

        // // 產生假資料值

        // // 把資料值放到點位的data.datasets.data
      }
    }

    clickItem.target.classList.add("selected");
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

const abc = document.querySelector(".block_temp #yDisplay_SOC");

const btn_test_03 = document.querySelector(".block_temp #btn_test_03");
btn_test_03.addEventListener("click", b_test_03);
function b_test_03() {
  console.log(abc.value);
  console.log(Boolean(abc.value));
  console.log(Boolean(Number(abc.value)));
}

const btn_test_04 = document.querySelector(".block_temp #btn_test_04");
btn_test_04.addEventListener("click", b_test_04);
function b_test_04() {
  console.log(Number(duration.value));
}

//////////////////////////////////////////////////////////////////////////////////////////////

const chtTest_Canvus = document.querySelector("#chartTest_Canvas");
const cht_Test = new Chart(chtTest_Canvus, {
  type: "line",
  data: {
    // labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    // labels: [3, 14],
    // labels: [3, 4, 5, 11, 12, 14],
    // labels: ['3', '4', '5', '11', '12', '13'],
    // labels: ['2023-10-24 13:02:00', '2023-10-24 13:02:01', '2023-10-24 13:02:02', '2023-10-24 13:02:03', '2023-10-24 13:02:04'
    //   , '2023-10-24 13:02:05', '2023-10-24 13:02:06', '2023-10-24 13:02:07', '2023-10-24 13:02:08', '2023-10-24 13:02:09'
    //   , '2023-10-24 13:02:10', '2023-10-24 13:02:11', '2023-10-24 13:02:12', '2023-10-24 13:02:13', '2023-10-24 13:02:14'],
    // labels: ['2023-10-24 13:02:00', '2023-10-24 13:02:14'],

    datasets: [
      {
        label: "頻率",
        // data: [12, 35, 23, 14, 1, 8],
        // data: [{ x: 7, y: 12 }, { x: 5, y: 35 }, { x: 6, y: 23 }, { x: 9, y: 14 }, { x: 10, y: 1 }, { x: 13, y: 8 }],
        data: [
          { x: "2023-10-24 13:02:07", y: 12 },
          { x: "2023-10-24 13:02:05", y: 35 },
          { x: "2023-10-24 13:02:06", y: 23 },
          { x: "2023-10-24 13:02:09", y: 14 },
          { x: "2023-10-24 13:02:10", y: 1 },
          { x: "2023-10-24 13:02:12", y: 8 },
        ],
        yAxisID: "leftyaxis",
      },
      {
        label: "實功",
        // data: [-6, -25, 30, 52, -18, 9],
        // data: [{ x: 2, y: -6 }, { x: 3, y: -25 }, { x: 5, y: 30 }, { x: 7, y: 52 }, { x: 9, y: -18 }, { x: 14, y: 9 }],
        data: [
          { x: "2023-10-24 13:02:02", y: -6 },
          { x: "2023-10-24 13:02:03", y: -25 },
          { x: "2023-10-24 13:02:05", y: 30 },
          { x: "2023-10-24 13:02:07", y: 52 },
          { x: "2023-10-24 13:02:09", y: -18 },
          { x: "2023-10-24 13:02:11", y: 9 },
        ],
        // xAxisID: 'firstxAxes123',
        yAxisID: "rightyaxis",
      },
      {
        label: "執行率",
        // data: [100, 98, 97, 92, 95, 96],
        // data: [{ x: 3, y: 100 }, { x: 4, y: 98 }, { x: 6, y: 97 }, { x: 7, y: 92 }, { x: 10, y: 95 }, { x: 12, y: 96 }],
        data: [
          { x: "2023-10-24 13:02:03", y: 100 },
          { x: "2023-10-24 13:02:04", y: 98 },
          { x: "2023-10-24 13:02:06", y: 97 },
          { x: "2023-10-24 13:02:07", y: 92 },
          { x: "2023-10-24 13:02:10", y: 95 },
          { x: "2023-10-24 13:02:12", y: 96 },
        ],
        yAxisID: "thirdyaxis",
      },
    ],
  },
  options: {
    animation: false,
    plugins: {
      title: {
        display: true,
        padding: { top: 10, bottom: 2 },
        text: "71頻率 (Hz)46",
        position: "top",
        font: { size: 26, family: "Arial", style: "normal" },
        color: "#88aaff",
      },
    },
    tooltips: {
      // mode: 'x',
      // intersect: false,
    },
    scales: {
      x: {
        display: true,
        type: "time",
        // distribution: 'linear',
        time: {
          unit: "second",
          displayFormats: {
            second: "yyyy-MM-dd HH:mm:ss.S",
          },
        },
        min: "2023-10-24 13:02:00",
        max: "2023-10-24 13:02:17",
        border: {
          dash: [10, 3],
          color: "#00ff",
        },
        ticks: {
          stepSize: 2,
          // source: 'labels',
          // autoSkip: true,
          // maxTicksLimit: 100,
        },
        grid: {
          color: "#ff0000",
        },
      },

      leftyaxis: {
        // display: false,
        position: "left",
        title: {
          display: true,
          text: "頻率 (Hz)",
        },
        min: 0,
        max: 100,
      },
      rightyaxis: {
        // display: false,
        position: "right",
        title: {
          display: true,
          text: "功因 ()",
        },
        min: -100,
        max: 100,
      },
      thirdyaxis: {
        // display: false,
        position: "left",
        title: {
          display: true,
          text: "執行率 (%)",
        },
        min: 0,
        max: 100,
        grid: {
          // display: false
        },
        // beginAtZero: true,
      },
    },
    interaction: {
      mode: "x",
    },
  },
});
