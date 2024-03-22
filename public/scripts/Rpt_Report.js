$(document).ready(function () {
    classAdd('#nB_Report', 'default_nB');
    generateYearOptions();

    // Attach an event listener to the dropdown change event
    document.getElementById("yearDropdown").addEventListener("change", function () {
        var selectedYear = parseInt(this.value);
        var month = document.getElementById("month");
        month.value = null;
        var currentMonth = new Date().getMonth() + 1; // Months are zero-based, so we add 1
        console.log("點選年份:"+selectedYear+" 現在月份:"+currentMonth);
        monthlyDataset(selectedYear, currentMonth);
        updateTable();
    });

    document.getElementById("month").addEventListener("change", function () {
        var year = document.getElementById("yearDropdown");
        var selectedYear = parseInt(year.value);
        var selectedMonth = parseInt(this.value);
        var currentMonth = new Date().getMonth() + 1; // Months are zero-based, so we add 1
        console.log("點選年份:"+selectedYear+" 點選月份:"+ selectedMonth +" 現在月份:"+currentMonth);
        dailyDataset(selectedYear, selectedMonth, currentMonth);
        updateTable();
    });

    var year = document.getElementById("yearDropdown");
    var month = document.getElementById("month");
    var selectedYear = parseInt(year.value);
    var selectedMonth = parseInt(month.value);
    dailyDataset(selectedYear, selectedMonth, currentMonth);
    updateTable();
});

setInterval(updateNavbar, 1000);
//////////////////////////////////////////////

var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth() + 1;
function generateYearOptions() { //動態生成年份下拉選單
    var selectElement = document.getElementById("yearDropdown");
    var month = document.getElementById("month");
    for (var year = 2020; year <= currentYear; year++) {
        var optionElement = document.createElement("option");
        optionElement.classList.add("filtOpt");
        optionElement.setAttribute("id", "yearRFO_" + year); // You can adjust this ID generation as needed
        optionElement.setAttribute("value", year); // Set the value attribute
        optionElement.textContent = year+"年";
        selectElement.appendChild(optionElement);
    }
    selectElement.value = currentYear;//預設今年
    month.value = currentMonth;//預設這個月

    // Generate the dynamic dataset based on the selected year and current month
    monthlyDataset(currentYear, currentMonth);
}

var dynamicDataset = [];//table所呈現的資料
function monthlyDataset(selectedYear, currentMonth) { //產出年報 月報畫面
    dynamicDataset = []; // Initialize an empty array

    if (selectedYear < currentYear){
        dynamicDataset.push({
            "index": dynamicDataset.length + 1,
            "reportType": "年報",
            "reportName": selectedYear + "年",
        });
        for (var month = 1; month <= 12; month++){
            dynamicDataset.push({
                "index": dynamicDataset.length + 1,
                "reportType":  "月報",
                "reportName": selectedYear + "年" + month + "月",
            });
        }
    } else {
        for (var month = 1; month < currentMonth; month++){
            dynamicDataset.push({
                "index": dynamicDataset.length + 1,
                "reportType":  "月報",
                "reportName": selectedYear + "年" + month + "月",
            });
        }
    }
    console.log(dynamicDataset);
}

function dailyDataset(selectedYear, selectedMonth, currentMonth) { //產出日報畫面
    dynamicDataset = []; // Initialize an empty array
    var days = getDaysInMonth(selectedYear, selectedMonth);
    console.log("選擇的月份有幾天:"+days);

    if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)){ //過去的年或同年過去月份
        dynamicDataset.push({
            "index": dynamicDataset.length + 1,
            "reportType": "月報",
            "reportName": selectedYear + "年" + selectedMonth + "月",
        });
        for (var day = 1; day <= days; day++){
            dynamicDataset.push({
                "index": dynamicDataset.length + 1,
                "reportType":  "日報",
                "reportName": selectedYear + "年" + selectedMonth + "月" + day + "日",
            });
        }
    } else if(selectedYear === currentYear && selectedMonth === currentMonth){
        var today = new Date().getDate();
        console.log("今天幾號:"+today);
        for (var day = 1; day <= today-1; day++){
            dynamicDataset.push({
                "index": dynamicDataset.length + 1,
                "reportType":  "日報",
                "reportName": selectedYear + "年" + selectedMonth + "月" + day + "日",
            });
    }
    console.log(dynamicDataset);
    }
}

function getDaysInMonth(year, month) { //計算當月有幾天
    // The month parameter is 0-based, so we subtract 1 from the input month
    return new Date(year, month, 0).getDate();
}

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
 

function updateTable(){
    var dataset = dynamicDataset;
    var year = document.getElementById("yearDropdown");//所選年份
    var month = document.getElementById("month");//所選月份
    var selectedYear = parseInt(year.value);
    var selectedMonth = parseInt(month.value);

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
        pageLength:35,
        pagingType: "simple_numbers", //分頁樣式：simple,simple_numbers,full,full_numbers
        responsive: true,
    
        "data": dataset,
        "columns": [
            { data: "index" },
            { data: "reportType" },
            { data: "reportName" },
            { 
                render: function (data, type, row) { 
                    if (row.reportType === "年報" || row.reportType === "月報"){
                        //return '<button class="btn_Download" id="btn_DL_' + row.index + '" onclick="downloadExcel(\'alreadyPrepared.xlsx\', \'C:/EMS/Report\')">下載</button>';  
                        return '<button class="btn_Download" id="btn_DL_' + row.index + '" onclick="downloadExcel(\''+row.reportName+'.xlsx\', \'/home/hl10_4-1/report/'+ selectedYear +'\', \''+row.reportType+'\')">下載</button>';  
                    } else if (row.reportType === "日報"){
                        return '<button class="btn_Download" id="btn_DL_' + row.index + '" onclick="downloadExcel(\''+row.reportName+'.xlsx\', \'/home/hl10_4-1/report/'+ selectedYear +'/'+ selectedMonth + '\', \''+row.reportType+'\')">下載</button>';  
                    }
                    return ''; // Ensure a default value is returned for other cases
                } 
            }]
    
    })
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

function convertDate(inputDate) { //檔名轉換
    // Replace 年 with y, 月 with m, and 日 with d
    var convertedDate = inputDate.replace(/年/g, 'y').replace(/月/g, 'm').replace(/日/g, 'd');
    console.log(convertedDate);
    return convertedDate;
  }


function downloadExcel(fileName, folderPath, reportType) { //尋找對應的檔案
    //看報表是否已存在
    //const fileName = 'alreadyPrepared.xlsx';//要找的檔案
    //const folderPath = 'C:\\EMS\\Report' ; //要去哪找檔案 (要兩個斜線\\)
    console.log("目標檔案:"+fileName);
    console.log("目標位置:"+folderPath);
  
  fetch(`/report/getFile?fileName=${encodeURIComponent(fileName)}&folderPath=${encodeURIComponent(folderPath)}`)
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

        //判斷是日報 月報 還是年報
        var templateUrl
        if (reportType === "年報"){
            templateUrl =  '/report/download-excel?templatePath=../public/report/YearReport.xlsx&reportType=年報&fileName='+fileName;
        } else if (reportType === "月報"){
            templateUrl = '/report/download-excel?templatePath=../public/report/MonthReport.xlsx&reportType=月報&fileName='+fileName;
        } else if (reportType === "日報"){
            templateUrl = '/report/download-excel?templatePath=../public/report/DayReport.xlsx&reportType=日報&fileName='+fileName;
        } else {
            console.error("報表類型錯誤: 應為年報/月報/日報");
            return
        };

        fetch(templateUrl)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = convertDate(fileName);//'test2.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          })
          .catch(error => console.error('Error downloading Excel file:', error));
      } else {//有找到的話下載 換到linux ok
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

