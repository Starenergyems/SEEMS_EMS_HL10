// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";


const filtDeviceOpts = document.querySelector(".filtDevice .filtOptions");
const filtLocationOpts = document.querySelector(".filtLocation .filtOptions");
const filtLevelOpts = document.querySelector(".filtLevel .filtOptions");

const dDL_filtDev = document.querySelector(".title #dDL_filtDevice");
dDL_filtDev.addEventListener("click", showHide_filtDevOpts);
function showHide_filtDevOpts() {
    filtDeviceOpts.classList.toggle("appear");
    filtLocationOpts.classList.remove("appear");
    filtLevelOpts.classList.remove("appear");
}

const dDL_filtLoc = document.querySelector(".title #dDL_filtLocation");
dDL_filtLoc.addEventListener("click", showHide_filtLocOpts);
function showHide_filtLocOpts() {
    filtLocationOpts.classList.toggle("appear");
    filtDeviceOpts.classList.remove("appear");
    filtLevelOpts.classList.remove("appear");
}

const dDL_filtLev = document.querySelector(".title #dDL_filtLevel");
dDL_filtLev.addEventListener("click", showHide_filtLevOpts);
function showHide_filtLevOpts() {
    filtLevelOpts.classList.toggle("appear");
    filtDeviceOpts.classList.remove("appear");
    filtLocationOpts.classList.remove("appear");
}

const filterDevice = document.querySelector(".title .filtDevice p");
const filterLocation = document.querySelector(".title .filtLocation p");
const filterLevel = document.querySelector(".title .filtLevel p");

document.addEventListener("click", hideFiltOptions);
function hideFiltOptions(clickItem) {
    if ((clickItem.target.id !== "dDL_filtDevice") && (clickItem.target.id !== "dDL_filtLocation") && (clickItem.target.id !== "dDL_filtLevel")) {
        if (clickItem.target.id === "filtNone") {
            filterDevice.textContent = "設備";
            filterLocation.textContent = "地點";
            filterLevel.textContent = "等級";
        } else if ((clickItem.target.id === "deviceFO_01") || (clickItem.target.id === "deviceFO_02") || (clickItem.target.id === "deviceFO_03")
            || (clickItem.target.id === "deviceFO_04") || (clickItem.target.id === "deviceFO_05") || (clickItem.target.id === "deviceFO_06")
            || (clickItem.target.id === "deviceFO_07") || (clickItem.target.id === "deviceFO_08")) {
            filterDevice.textContent = clickItem.target.textContent;
        } else if ((clickItem.target.id === "locationFO_01") || (clickItem.target.id === "locationFO_02") || (clickItem.target.id === "locationFO_03")
            || (clickItem.target.id === "locationFO_04") || (clickItem.target.id === "locationFO_05") || (clickItem.target.id === "locationFO_06")
            || (clickItem.target.id === "locationFO_07") || (clickItem.target.id === "locationFO_08") || (clickItem.target.id === "locationFO_09")
            || (clickItem.target.id === "locationFO_10")) {
            filterLocation.textContent = clickItem.target.textContent;
        } else if ((clickItem.target.id === "levelFO_01") || (clickItem.target.id === "levelFO_02")) {
            filterLevel.textContent = clickItem.target.textContent;
        }

        filtDeviceOpts.classList.remove("appear");
        filtLocationOpts.classList.remove("appear");
        filtLevelOpts.classList.remove("appear");
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {

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
        "startTime": "2023/09/01 15:23:10.123",
        "place": "控制室",
        "deviceName": "HVAC-1",
        "almLevel": "警告",
        "description": "HVAC-1通訊異常",
        "value": "Comm error",
        "endTime": ""
    }, {
        "index": "2",
        "startTime": "2023/09/01 15:22:10.123",
        "place": "ESS3-2",
        "deviceName": "BMS3-2",
        "almLevel": "錯誤",
        "description": "電芯過溫保護",
        "value": "Normal",
        "endTime": "2023/09/01 15:22:50.123"
    }, {
        "index": "3",
        "startTime": "2023/09/01 15:13:10.123",
        "place": "戶外",
        "deviceName": "變壓器2",
        "almLevel": "警告",
        "description": "變壓器2油溫過高",
        "value": "67",
        "endTime": ""
    }, {
        "index": "4",
        "startTime": "2023/09/01 13:23:10.123",
        "place": "MVCB",
        "deviceName": "保護電驛",
        "almLevel": "錯誤",
        "description": "MVCB保護電驛_51-1",
        "value": "Normal",
        "endTime": "2023/09/01 14:43:10.123"
    }];

    $('#almTable').DataTable({

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
            { data: "startTime" },
            { data: "place" },
            { data: "deviceName" },
            { data: "almLevel" },
            { data: "description" },
            { data: "value" },
            { data: "endTime" },
        ]

    })

});

