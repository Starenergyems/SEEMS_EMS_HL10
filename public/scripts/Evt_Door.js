// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";


const filtDeviceOpts = document.querySelector(".filtDevice .filtOptions");
const filtLocationOpts = document.querySelector(".filtLocation .filtOptions");

const dDL_filtDev = document.querySelector(".title #dDL_filtDevice");
dDL_filtDev.addEventListener("click", showHide_filtDevOpts);
function showHide_filtDevOpts() {
    filtDeviceOpts.classList.toggle("appear");
    filtLocationOpts.classList.remove("appear");
}

const dDL_filtLoc = document.querySelector(".title #dDL_filtLocation");
dDL_filtLoc.addEventListener("click", showHide_filtLocOpts);
function showHide_filtLocOpts() {
    filtLocationOpts.classList.toggle("appear");
    filtDeviceOpts.classList.remove("appear");
}

const filterDevice = document.querySelector(".title .filtDevice p");
const filterLocation = document.querySelector(".title .filtLocation p");

document.addEventListener("click", hideFiltOptions);
function hideFiltOptions(clickItem) {
    if ((clickItem.target.id !== "dDL_filtDevice") && (clickItem.target.id !== "dDL_filtLocation")) {
        if (clickItem.target.id === "filtNone") {
            filterDevice.textContent = "設備";
            filterLocation.textContent = "地點";
        } else if ((clickItem.target.id === "deviceFO_01") || (clickItem.target.id === "deviceFO_02") || (clickItem.target.id === "deviceFO_03")
            || (clickItem.target.id === "deviceFO_04") || (clickItem.target.id === "deviceFO_05") || (clickItem.target.id === "deviceFO_06")
            || (clickItem.target.id === "deviceFO_07") || (clickItem.target.id === "deviceFO_08")) {
            filterDevice.textContent = clickItem.target.textContent;
        } else if ((clickItem.target.id === "locationFO_01") || (clickItem.target.id === "locationFO_02")) {
            filterLocation.textContent = clickItem.target.textContent;
        }

        filtDeviceOpts.classList.remove("appear");
        filtLocationOpts.classList.remove("appear");
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
        "Time": "2023/09/01 15:23:10.123",
        "place": "控制室",
        "deviceName": "控制室 門1",
        "description": "開啟",
        "cardNumber": "123456789",
        "acked": ""
    }, {
        "index": "2",
        "Time": "2023/09/01 15:23:10.123",
        "place": "貨櫃",
        "deviceName": "貨櫃3-1",
        "description": "錯誤",
        "cardNumber": "987654321",
        "acked": ""
    }, {
        "index": "3",
        "Time": "2023/09/01 15:23:10.123",
        "place": "貨櫃",
        "deviceName": "貨櫃2-2",
        "description": "警告",
        "cardNumber": "~!@#$%^&*",
        "acked": ""
    }, {
        "index": "4",
        "Time": "2023/09/01 15:23:10.123",
        "place": "控制室",
        "deviceName": "控制室 門2",
        "description": "開啟",
        "cardNumber": "123459876",
        "acked": ""
    }];

    $('#evtTable').DataTable({

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
            { data: "Time" },
            { data: "place" },
            { data: "deviceName" },
            { data: "description" },
            { data: "cardNumber" },
            { data: "index", render: function (data, type, row) { return '<input type="checkbox" class="chb_Ack" id="chb_Ack_' + data + '">' } },
        ]

    })

});

