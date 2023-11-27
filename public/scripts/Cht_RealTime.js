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
const unitDura_Select = document.querySelector(".timeRangeSet #unitDura_Select");

let raw_DT_now = new Date();
let DT_now_Millisec = raw_DT_now.getTime();

let yy_now = raw_DT_now.getFullYear();
let mm_now = String(raw_DT_now.getMonth() + 1).padStart(2, "0");
let dd_now = String(raw_DT_now.getDate()).padStart(2, "0");
let hh_now = String(raw_DT_now.getHours()).padStart(2, "0");
let m_now = String(raw_DT_now.getMinutes()).padStart(2, "0");
let ss_now = String(raw_DT_now.getSeconds()).padStart(2, '0');

duration.value = 1;
unitDura_Select.value = "60000";

//////////////////////////////////////////////////////////////////////////////////////////////

let No_of_xValues = 61;
let refreshRate = 1;
let xValues = Array(No_of_xValues);

Chart.defaults.datasets.line.stepped = true;
Chart.defaults.datasets.line.pointRadius = 1.5;
// Chart.defaults.datasets.line.borderWidth = 1.5;
// Chart.defaults.font.size = 16;

const bgColor = ["#5AA2ED", "#F26085", "#F39F3B", "#F6CD4F", "#66C1C0", "#9D62FF", "#C9CBCF", "#0000FF", "#008000", "#804040",];

const chtRT_Canvus = document.querySelector("#chartRT_Canvas");
const cht_RealTime = new Chart(chtRT_Canvus, {
  type: 'line',
  data: {
    // labels: xValues,
    // labels: ['2023-10-24 13:02:00', '2023-10-24 13:07:00', '2023-10-24 13:12:00', '2023-10-24 13:17:00', '2023-10-24 13:22:00'
    // , '2023-10-24 13:27:00', '2023-10-24 13:32:00', '2023-10-24 13:37:00', '2023-10-24 13:42:00', '2023-10-24 13:47:00'],
    datasets: [{
      label: 'Freq',
      data: Array(No_of_xValues),
      yAxisID: 'y_Freq',
      borderColor: "#5AA2ED",
      backgroundColor: "#5AA2ED90",
    },
    {
      label: 'ActivePower',
      data: Array(No_of_xValues),
      // data: [-600, -2500, -3000],
      // data: [-600, -2500, -3000, -5200, -1800, 2100, 4900, 8300, 6700, 1400],
      // data: [, , , , , , , , , 1400],
      // data: [{ x: '2023-10-24 13:02:00', y: -600 }, { x: '2023-10-24 13:03:00', y: -2500 }, { x: '2023-10-24 13:12:00', y: -3000 },
      // { x: '2023-10-24 13:17:00', y: -5200 }, { x: '2023-10-24 13:22:00', y: -1800 }, { x: '2023-10-24 13:27:00', y: 2100 },
      // { x: '2023-10-24 13:32:00', y: 4900 }, { x: '2023-10-24 13:37:00', y: 8300 }, { x: '2023-10-24 13:42:00', y: 6700 },
      // { x: '2023-10-24 13:47:00', y: 1400 }],
      yAxisID: 'y_ActivePower',
      borderColor: "#F26085",
      backgroundColor: "#F2608590",
    },
    {
      label: 'ExecuteRate',
      data: Array(No_of_xValues),
      yAxisID: 'y_ExecuteRate',
      borderColor: "#F39F3B",
      backgroundColor: "#F39F3B90",
    },
    {
      label: "SOC",
      data: Array(No_of_xValues),
      yAxisID: "y_SOC",
      borderColor: "#F6CD4F",
      backgroundColor: "#F6CD4F90",
    }]
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

      y1: {
        position: 'left',
        title: {
          display: true,
          text: '頻率 (Hz)'
        },
        min: 59.50,
        max: 60.50,
      },
      y2: {
        position: 'right',
        title: {
          display: true,
          text: '實功 (kW)'
        },
        // suggestedMin: -10000,
        // suggestedMax: 10000,
        min: -10000,
        max: 10000
      },
      y3: {
        // display: false,
        position: 'left',
        title: {
          display: true,
          text: '執行率 (%)'
        },
        // type: 'logarithmic',
        min: 0,
        max: 100,
        grid: {
          // display: false
        }

      }
    },
    // legend: {
    //   display: false
    // },
    interaction: {
      mode: 'x'
    },



  },





});

//////////////////////////////////////////////////////////////////////////////////////////////











//////////////////////////////////////////////////////////////////////////////////////////////

let i;

document.addEventListener("DOMContentLoaded", doSomething);
function doSomething() {
  console.info("DOM 加载了");
  asdfg = '哈哈阿';
  console.log(asdfg);

  let rawDateTime = new Date();
  let yy = rawDateTime.getFullYear();
  let mm = String(rawDateTime.getMonth() + 1).padStart(2, '0');
  let dd = String(rawDateTime.getDate()).padStart(2, '0');
  let hh = String(rawDateTime.getHours()).padStart(2, '0');
  let m = String(rawDateTime.getMinutes()).padStart(2, '0');
  let ss = String(rawDateTime.getSeconds()).padStart(2, '0');

  let Data_t = [yy + "/" + mm + "/" + dd + " " + hh + ":" + m + ":" + ss, 59.63, 0, 75]

  for (i = 1; i < No_of_xValues; i++) {
    let rawDT_temp = new Date(rawDateTime.getTime() - refreshRate * i * 1000);
    let yy_temp = rawDT_temp.getFullYear();
    let mm_temp = String(rawDT_temp.getMonth() + 1).padStart(2, '0');
    let dd_temp = String(rawDT_temp.getDate()).padStart(2, '0');
    let hh_temp = String(rawDT_temp.getHours()).padStart(2, '0');
    let m_temp = String(rawDT_temp.getMinutes()).padStart(2, '0');
    let ss_temp = String(rawDT_temp.getSeconds()).padStart(2, '0');

    cht_RealTime.data.datasets[0].data[No_of_xValues - i - 1] = { x: yy_temp + "/" + mm_temp + "/" + dd_temp + " " + hh_temp + ":" + m_temp + ":" + ss_temp, y: null };
  }

  cht_RealTime.data.datasets[0].data[No_of_xValues - 1] = { x: Data_t[0], y: Data_t[1] };
  cht_RealTime.data.datasets[1].data[No_of_xValues - 1] = Data_t[2];
  cht_RealTime.data.datasets[2].data[No_of_xValues - 1] = Data_t[3];

  cht_RealTime.update();

  let schedule_02 = setInterval(function () { updateChartData(cht_RealTime, Data_t); }, refreshRate * 1000);
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
    newRawData[0] = yy + "/" + mm + "/" + dd + " " + hh + ":" + m + ":" + ss;
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

}

const chtTest_Canvus = document.querySelector("#chartTest_Canvas");
const cht_Test = new Chart(chtTest_Canvus, {
  type: 'line',
  data: {
    // labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    // labels: [3, 14],
    // labels: [3, 4, 5, 11, 12, 14],
    // labels: ['3', '4', '5', '11', '12', '13'],
    // labels: ['2023-10-24 13:02:00', '2023-10-24 13:02:01', '2023-10-24 13:02:02', '2023-10-24 13:02:03', '2023-10-24 13:02:04'
    //   , '2023-10-24 13:02:05', '2023-10-24 13:02:06', '2023-10-24 13:02:07', '2023-10-24 13:02:08', '2023-10-24 13:02:09'
    //   , '2023-10-24 13:02:10', '2023-10-24 13:02:11', '2023-10-24 13:02:12', '2023-10-24 13:02:13', '2023-10-24 13:02:14'],
    // labels: ['2023-10-24 13:02:00', '2023-10-24 13:02:14'],


    datasets: [{
      label: '頻率',
      // data: [12, 35, 23, 14, 1, 8],
      // data: [{ x: 7, y: 12 }, { x: 5, y: 35 }, { x: 6, y: 23 }, { x: 9, y: 14 }, { x: 10, y: 1 }, { x: 13, y: 8 }],
      data: [{ x: '2023-10-24 13:02:07', y: 12 }, { x: '2023-10-24 13:02:05', y: 35 }, { x: '2023-10-24 13:02:06', y: 23 },
      { x: '2023-10-24 13:02:09', y: 14 }, { x: '2023-10-24 13:02:10', y: 1 }, { x: '2023-10-24 13:02:12', y: 8 }],
      yAxisID: 'leftyaxis',
    }, {
      label: '實功',
      // data: [-6, -25, 30, 52, -18, 9],
      // data: [{ x: 2, y: -6 }, { x: 3, y: -25 }, { x: 5, y: 30 }, { x: 7, y: 52 }, { x: 9, y: -18 }, { x: 14, y: 9 }],
      data: [{ x: '2023-10-24 13:02:02', y: -6 }, { x: '2023-10-24 13:02:03', y: -25 }, { x: '2023-10-24 13:02:05', y: 30 },
      { x: '2023-10-24 13:02:07', y: 52 }, { x: '2023-10-24 13:02:09', y: -18 }, { x: '2023-10-24 13:02:11', y: 9 }],
      // xAxisID: 'firstxAxes123',
      yAxisID: 'rightyaxis'
    }, {
      label: '執行率',
      // data: [100, 98, 97, 92, 95, 96],
      // data: [{ x: 3, y: 100 }, { x: 4, y: 98 }, { x: 6, y: 97 }, { x: 7, y: 92 }, { x: 10, y: 95 }, { x: 12, y: 96 }],
      data: [{ x: '2023-10-24 13:02:03', y: 100 }, { x: '2023-10-24 13:02:04', y: 98 }, { x: '2023-10-24 13:02:06', y: 97 },
      { x: '2023-10-24 13:02:07', y: 92 }, { x: '2023-10-24 13:02:10', y: 95 }, { x: '2023-10-24 13:02:12', y: 96 }],
      yAxisID: 'thirdyaxis'
    }]
  },
  options: {
    animation: false,
    plugins: {
      title: {
        display: true,
        padding: { top: 10, bottom: 2 },
        text: '71頻率 (Hz)46',
        position: 'top',
        font: { size: 26, family: 'Arial', style: 'normal' },
        color: '#88aaff',
      },
    },
    tooltips: {
      // mode: 'x',
      // intersect: false,
    },
    scales: {
      x: {
        display: true,
        type: 'time',
        // distribution: 'linear',
        time: {
          unit: 'second',
          displayFormats: {
            second: 'yyyy-MM-dd HH:mm:ss.S',
          }
        },
        min: '2023-10-24 13:02:00',
        max: '2023-10-24 13:02:17',
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
        position: 'left',
        title: {
          display: true,
          text: '頻率 (Hz)'
        },
        min: 0,
        max: 100,
      },
      rightyaxis: {
        // display: false,
        position: 'right',
        title: {
          display: true,
          text: '功因 ()'
        },
        min: -100,
        max: 100
      },
      thirdyaxis: {
        // display: false,
        position: 'left',
        title: {
          display: true,
          text: '執行率 (%)'
        },
        min: 0,
        max: 100,
        grid: {
          // display: false
        },
        // beginAtZero: true,
      }
    },
    interaction: {
      mode: 'x'
    },
  },
});


