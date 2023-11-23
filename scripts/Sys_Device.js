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
        } else if ((clickItem.target.id === "locationFO_01") || (clickItem.target.id === "locationFO_02") || (clickItem.target.id === "locationFO_03")
            || (clickItem.target.id === "locationFO_04") || (clickItem.target.id === "locationFO_05") || (clickItem.target.id === "locationFO_06")
            || (clickItem.target.id === "locationFO_07") || (clickItem.target.id === "locationFO_08") || (clickItem.target.id === "locationFO_09")
            || (clickItem.target.id === "locationFO_10")) {
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
        "equip": "EMS-1",
        "place": "控制室",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:00:08",
    }, {
        "index": "2",
        "equip": "EMS-2",
        "place": "控制室",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:00:07",
    }, {
        "index": "3",
        "equip": "DC",
        "place": "控制室",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:00:06",
    }, {
        "index": "4",
        "equip": "HMI",
        "place": "控制室",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:00:05",
    }, {
        "index": "5",
        "equip": "Remote I/O",
        "place": "控制室",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:00:04",
    }, {
        "index": "6",
        "equip": "GC-1",
        "place": "控制室",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:00:03",
    }, {
        "index": "7",
        "equip": "GC-2",
        "place": "控制室",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:00:02",
    }, {
        "index": "8",
        "equip": "HVAC-1",
        "place": "控制室",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:00:01",
    }, {
        "index": "9",
        "equip": "HVAC-2",
        "place": "控制室",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:00:00",
    }, {
        "index": "10",
        "equip": "UPS-EMS",
        "place": "控制室",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:01:08",
    }, {
        "index": "11",
        "equip": "UPS-CCTV",
        "place": "控制室",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:01:07",
    }, {
        "index": "12",
        "equip": "頻率表",
        "place": "MVCB",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:01:06",
    }, {
        "index": "13",
        "equip": "Remote I/O",
        "place": "MVCB",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:01:05",
    }, {
        "index": "14",
        "equip": "Remote I/O",
        "place": "MVCB",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:01:04",
    }, {
        "index": "15",
        "equip": "UPS-MVCB",
        "place": "MVCB",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:01:03",
    }, {
        "index": "16",
        "equip": "保護電驛",
        "place": "MVCB",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:01:02",
    }, {
        "index": "17",
        "equip": "自動復閉器",
        "place": "MVCB",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:01:01",
    }, {
        "index": "18",
        "equip": "MVCB負載表",
        "place": "MVCB",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:01:00",
    }, {
        "index": "19",
        "equip": "保護電驛",
        "place": "VCB-1",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:00:38",
    }, {
        "index": "20",
        "equip": "保護電驛",
        "place": "VCB-2",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:00:37",
    }, {
        "index": "21",
        "equip": "保護電驛",
        "place": "VCB-3",
        "status": "異常",
        "threshold": "10 sec",
        "time": "00:00:36",
    }, {
        "index": "22",
        "equip": "保護電驛",
        "place": "VCB-4",
        "status": "正常",
        "threshold": "10 sec",
        "time": "00:00:35",
    }];

    $('#deviceTable').DataTable({

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
            { data: "equip" },
            { data: "place" },
            { data: "status" },
            { data: "threshold" },
            { data: "time" },
        ]

    })

});

