$(document).ready(function () {
    generateYearOptions();

    let lang = {
        sProcessing: "處理中...",
        sLengthMenu: "每頁 _MENU_ 項",
        sZeroRecords: "沒有匹配結果",
        sInfo: "當前顯示第 _START_ 至 _END_ 項，共 _TOTAL_ 項。",
        sInfoEmpty: "當前顯示第 0 至 0 項，共 0 項",
        sInfoFiltered: "(由 _MAX_ 項結果過濾)",
        sInfoPostFix: "",
        sSearch: "搜尋:",
        sUrl: "",
        sEmptyTable: "查無資料",
        sLoadingRecords: "載入中...",
        sInfoThousands: ",",
        oPaginate: {
            sFirst: "首頁",
            sPrevious: "上頁",
            sNext: "下頁",
            sLast: "末頁",
            sJump: "跳轉",
        },
        oAria: {
            sSortAscending: ": 以升序排列此列",
            sSortDescending: ": 以降序排列此列",
        },
    };
    var dataset = [{
        "index": "1",
        "reportType": "年報",
        "reportName": "2023年年報",
    }, {
        "index": "2",
        "reportType": "月報",
        "reportName": "2023年01月月報",
    }, {
        "index": "3",
        "reportType": "月報",
        "reportName": "2023年02月月報",
    }, {
        "index": "4",
        "reportType": "月報",
        "reportName": "2023年03月月報",
    }, {
        "index": "5",
        "reportType": "月報",
        "reportName": "2023年04月月報",
    }, {
        "index": "6",
        "reportType": "月報",
        "reportName": "2023年05月月報",
    }, {
        "index": "7",
        "reportType": "月報",
        "reportName": "2023年06月月報",
    }, {
        "index": "8",
        "reportType": "月報",
        "reportName": "2023年07月月報",
    }, {
        "index": "9",
        "reportType": "月報",
        "reportName": "2023年08月月報",
    }, {
        "index": "10",
        "reportType": "月報",
        "reportName": "2023年09月月報",
    }, {
        "index": "11",
        "reportType": "月報",
        "reportName": "2023年10月月報",
    }, {
        "index": "12",
        "reportType": "月報",
        "reportName": "2023年11月月報",
    }, {
        "index": "13",
        "reportType": "月報",
        "reportName": "2023年12月月報",
    }];

    $('#reportTable').DataTable({

        lengthMenu: [10, 20, 25, 50, 100],
        scrollY: "660px",

        destroy: true,
        language: lang, //提示資訊
        autoWidth: false, //禁用自動調整列寬
        // stripeClasses: [], //為奇偶行加上樣式，相容不支援CSS偽類的場合
        processing: false, //隱藏載入提示,自行處理
        //serverSide: true, //啟用伺服器端分頁
        //searching: false, //禁用原生搜尋
        orderMulti: false, //啟用多列排序
        ordering: false, //取消預設排序查詢,否則核取方塊一列會出現小箭頭
        //renderer: "bootstrap", //渲染樣式：Bootstrap和jquery-ui
        pagingType: "simple_numbers", //分頁樣式：simple,simple_numbers,full,full_numbers
        responsive: true,

        "data": dataset,
        "columns": [
            { data: "index" },
            { data: "reportType" },
            { data: "reportName" },
            { data: "index", render: function (data, type, row) { return '<button class="btn_Download" id="btn_DL_' + data + '" onclick="downloadExcel()">下載</button>' } },
        ]

    })

});

function generateYearOptions() { //動態生成年份下拉選單
    var currentYear = new Date().getFullYear();
    var selectElement = document.getElementById("yearDropdown");
    for (var year = 2020; year <= currentYear; year++) {
        var optionElement = document.createElement("option");
        optionElement.classList.add("filtOpt");
        optionElement.setAttribute("id", "yearRFO_" + year); // You can adjust this ID generation as needed
        optionElement.setAttribute("value", year); // Set the value attribute
        optionElement.textContent = year+"年";
        selectElement.appendChild(optionElement);
    }
    selectElement.value = currentYear;//預設今年
}

// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";


const filtMonthROpts = document.querySelector(".filtMonthR .filtOptions");
const filtSeasonROpts = document.querySelector(".filtSeasonR .filtOptions");
const filtYearROpts = document.querySelector(".filtYearR .filtOptions");

/*const dDL_filtMonR = document.querySelector(".title #dDL_filtMonthR");
dDL_filtMonR.addEventListener("click", showHide_filtMonROpts);
function showHide_filtMonROpts() {
    filtMonthROpts.classList.toggle("appear");
    filtSeasonROpts.classList.remove("appear");
    filtYearROpts.classList.remove("appear");
}*/

/*const dDL_filtSeaR = document.querySelector(".title #dDL_filtSeasonR");
dDL_filtSeaR.addEventListener("click", showHide_filtSeaROpts);
function showHide_filtSeaROpts() {
    filtSeasonROpts.classList.toggle("appear");
    filtMonthROpts.classList.remove("appear");
    filtYearROpts.classList.remove("appear");
}*/

/*const dDL_filtYeaR = document.querySelector(".title #dDL_filtYearR");
dDL_filtYeaR.addEventListener("click", showHide_filtYeaROpts);
function showHide_filtYeaROpts() {
    filtYearROpts.classList.toggle("appear");
    filtMonthROpts.classList.remove("appear");
    filtSeasonROpts.classList.remove("appear");
}*/

const filterMonthR = document.querySelector(".title .filtMonthR p");
const filterSeasonR = document.querySelector(".title .filtSeasonR p");
const filterYearR = document.querySelector(".title .filtYearR p");

/*document.addEventListener("click", hideFiltOptions);
function hideFiltOptions(clickItem) {
    if ((clickItem.target.id !== "dDL_filtMonthR") && (clickItem.target.id !== "dDL_filtSeasonR") && (clickItem.target.id !== "dDL_filtYearR")) {
        if (clickItem.target.id === "filtNone") {
            filterMonthR.textContent = "月報";
            filterSeasonR.textContent = "季報";
            filterYearR.textContent = "年報";
        } else if ((clickItem.target.id === "monthRFO_01") || (clickItem.target.id === "monthRFO_02") || (clickItem.target.id === "monthRFO_03")) {
            filterMonthR.textContent = clickItem.target.textContent;
            filterSeasonR.textContent = "季報";
            filterYearR.textContent = "年報";
        } else if ((clickItem.target.id === "seasonRFO_01") || (clickItem.target.id === "seasonRFO_02") || (clickItem.target.id === "seasonRFO_03")) {
            filterSeasonR.textContent = clickItem.target.textContent;
            filterMonthR.textContent = "月報";
            filterYearR.textContent = "年報";
        } else if ((clickItem.target.id === "yearRFO_01") || (clickItem.target.id === "yearRFO_02")) {
            filterYearR.textContent = clickItem.target.textContent;
            filterMonthR.textContent = "月報";
            filterSeasonR.textContent = "季報";
        }

        filtMonthROpts.classList.remove("appear");
        filtSeasonROpts.classList.remove("appear");
        filtYearROpts.classList.remove("appear");
    }
}*/

//////////////////////////////////////////////////////////////////////////////////////////////



function downloadExcel() {
    //看報表是否已存在
    const fileName = 'alreadyPrepared.xlsx';//要找的檔案
    console.log("目標檔案:"+fileName);
  
  fetch(`/report/getFile?fileName=${fileName}`)
    .then(response => {
      if (!response.ok) {
        console.log(response);
        return response.json();
      }
      return response.blob();
    })
    .then(data => {
      if (data.status === 'error'){
        console.error(data.message);                   
        console.log('報表不存在地端') // 若不存在就自行撈自料再下載
        fetch('/report/download-excel?templatePath=../public/report/Report.xlsx')
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'test2.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          })
          .catch(error => console.error('Error downloading Excel file:', error));
      } else {//有找到的話下載
            const url = window.URL.createObjectURL(data);         
            const a = document.createElement('a');// Create a temporary link element
            a.href = url;
            a.download = fileName;                
            document.body.appendChild(a); // Append the link to the document 
            a.click(); // Trigger a click on the link to start the download 
            document.body.removeChild(a); // Remove the link from the document 
            window.URL.revokeObjectURL(url);// Release the object URL
        }
    })
    .catch(error => console.error(error));


  }

