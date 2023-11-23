// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";


const filtOpTypeOpts = document.querySelector(".filtOpType .filtOptions");
const filtDeviceOpts = document.querySelector(".filtDevice .filtOptions");

const dDL_filtOpT = document.querySelector(".title #dDL_filtOpType");
dDL_filtOpT.addEventListener("click", showHide_filtOpTOpts);
function showHide_filtOpTOpts() {
    filtOpTypeOpts.classList.toggle("appear");
    filtDeviceOpts.classList.remove("appear");
}

const dDL_filtDev = document.querySelector(".title #dDL_filtDevice");
dDL_filtDev.addEventListener("click", showHide_filtDevOpts);
function showHide_filtDevOpts() {
    filtDeviceOpts.classList.toggle("appear");
    filtOpTypeOpts.classList.remove("appear");
}

const filterOpType = document.querySelector(".title .filtOpType p");
const filterDevice = document.querySelector(".title .filtDevice p");

document.addEventListener("click", hideFiltOptions);
function hideFiltOptions(clickItem) {
    if ((clickItem.target.id !== "dDL_filtOpType") && (clickItem.target.id !== "dDL_filtDevice")) {
        if (clickItem.target.id === "filtNone") {
            filterOpType.textContent = "操作類別";
            filterDevice.textContent = "設備";
        } else if ((clickItem.target.id === "opTypeFO_01") || (clickItem.target.id === "opTypeFO_02") || (clickItem.target.id === "opTypeFO_03")
            || (clickItem.target.id === "opTypeFO_04") || (clickItem.target.id === "opTypeFO_05")) {
            filterOpType.textContent = clickItem.target.textContent;
        } else if ((clickItem.target.id === "deviceFO_01") || (clickItem.target.id === "deviceFO_02") || (clickItem.target.id === "deviceFO_03")
            || (clickItem.target.id === "deviceFO_04") || (clickItem.target.id === "deviceFO_05") || (clickItem.target.id === "deviceFO_06")
            || (clickItem.target.id === "deviceFO_07") || (clickItem.target.id === "deviceFO_08")) {
            filterDevice.textContent = clickItem.target.textContent;
        }

        filtOpTypeOpts.classList.remove("appear");
        filtDeviceOpts.classList.remove("appear");
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

let raw_DT_now = new Date();

let yy_now = raw_DT_now.getFullYear();
let mm_now = String(raw_DT_now.getMonth() + 1).padStart(2, '0');
let dd_now = String(raw_DT_now.getDate()).padStart(2, '0');
let hh_now = String(raw_DT_now.getHours()).padStart(2, '0');
let m_now = String(raw_DT_now.getMinutes()).padStart(2, '0');
let ss_now = String(raw_DT_now.getSeconds()).padStart(2, '0');

const dateStart = document.querySelector(".timeRangeQuery #dateStart");
const timeStart = document.querySelector(".timeRangeQuery #timeStart");
const dateEnd = document.querySelector(".timeRangeQuery #dateEnd");
const timeEnd = document.querySelector(".timeRangeQuery #timeEnd");

dateStart.value = yy_now + "-" + mm_now + "-" + dd_now;
timeStart.value = "00:00:00";
dateEnd.value = yy_now + "-" + mm_now + "-" + dd_now;
timeEnd.value = hh_now + ":" + m_now + ":" + ss_now;

let min_dateStart = "2015-03-21";
dateStart.setAttribute("min", min_dateStart);
dateStart.setAttribute("max", yy_now + "-" + mm_now + "-" + dd_now);
dateEnd.setAttribute("min", yy_now + "-" + mm_now + "-" + dd_now);
dateEnd.setAttribute("max", yy_now + "-" + mm_now + "-" + dd_now);

function Convert_date_To_rawDT(date) {
    if (date !== "") {
        let yy_date = Number(date[0] + date[1] + date[2] + date[3]);
        let mm_date = Number(date[5] + date[6]) - 1;
        let dd_date = Number(date[8] + date[9]);

        let raw_date = new Date(yy_date, mm_date, dd_date);
        return raw_date;
    } else {
        // date === "" 時，怎麼辦??   ~~~~~~~!!!!!!!!!@@@@@@@#######$$$$$$$$$$$%%%%%%%%%^^^^^^^^^&&&&&&&&&*********
    }
}


let m = document.querySelector(".block_temp #printVal_01");
let n = document.querySelector(".block_temp #printVal_02");
let o = document.querySelector(".block_temp #printVal_03");
let p = document.querySelector(".block_temp #printVal_04");
let q = document.querySelector(".block_temp #printVal_05");
let r = document.querySelector(".block_temp #printVal_06");
let s = document.querySelector(".block_temp #printVal_07");


// sd = document.querySelector(".block_temp #Startdate");
document.addEventListener("click", Limit_dateStart);
function Limit_dateStart(clickItem) {
    if (clickItem.target.id !== "Startdate") {
        raw_DT_now = new Date();

        let raw_dS;
        let raw_dS_temp = Convert_date_To_rawDT(dateStart.value);
        if (raw_dS_temp > raw_DT_now) {
            raw_dS = raw_DT_now;
        } else if (raw_dS_temp < Convert_date_To_rawDT(min_dateStart)) {
            raw_dS = Convert_date_To_rawDT(min_dateStart);
        } else {
            raw_dS = raw_dS_temp;
        }

        let yy_dS = String(raw_dS.getFullYear()).padStart(4, '0');
        let mm_dS = String(raw_dS.getMonth() + 1).padStart(2, '0');
        let dd_dS = String(raw_dS.getDate()).padStart(2, '0');

        dateStart.value = yy_dS + "-" + mm_dS + "-" + dd_dS;

        dateStart_change();
    }
}

dateStart.addEventListener("change", dateStart_change);
function dateStart_change() {
    m.textContent = dateStart.value;

    // let yy_dS = Number(dateStart.value[0] + dateStart.value[1] + dateStart.value[2] + dateStart.value[3]);
    // let mm_dS = Number(dateStart.value[5] + dateStart.value[6]) - 1;
    // let dd_dS = Number(dateStart.value[8] + dateStart.value[9]);

    // let raw_dS = new Date(yy_dS, mm_dS, dd_dS);

    let raw_dS = Convert_date_To_rawDT(dateStart.value);
    n.textContent = raw_dS;
    let raw_dS_plus_90d = new Date(raw_dS.getTime() + 1000 * 60 * 60 * 24 * 90);
    o.textContent = raw_dS_plus_90d;

    raw_DT_now = new Date();
    let raw_dE_max;
    if (raw_dS_plus_90d > raw_DT_now) {
        raw_dE_max = raw_DT_now;
    } else {
        raw_dE_max = raw_dS_plus_90d;
    }
    p.textContent = raw_dE_max;

    // let yy_dE_max = raw_dE_max.getFullYear();
    let yy_dE_max = String(raw_dE_max.getFullYear()).padStart(4, '0');
    let mm_dE_max = String(raw_dE_max.getMonth() + 1).padStart(2, '0');
    let dd_dE_max = String(raw_dE_max.getDate()).padStart(2, '0');

    let dE_max = yy_dE_max + "-" + mm_dE_max + "-" + dd_dE_max;
    q.textContent = dE_max;

    dateEnd.setAttribute("min", dateStart.value);
    dateEnd.setAttribute("max", dE_max);

    // let yy_dE_old = Number(dateEnd.value[0] + dateEnd.value[1] + dateEnd.value[2] + dateEnd.value[3]);
    // let mm_dE_old = Number(dateEnd.value[5] + dateEnd.value[6]) - 1;
    // let dd_dE_old = Number(dateEnd.value[8] + dateEnd.value[9]);

    // let raw_dE_old = new Date(yy_dE_old, mm_dE_old, dd_dE_old);
    let raw_dE_old = Convert_date_To_rawDT(dateEnd.value);
    if (raw_dE_old < raw_dS) {
        dateEnd.value = dateStart.value;
    } else if (raw_dE_old > raw_dE_max) {
        dateEnd.value = dE_max;
    }
}

dateEnd.addEventListener("change", dateEnd_change);
function dateEnd_change() {
    let min_dateEnd = dateEnd.getAttribute("min");
    let max_dateEnd = dateEnd.getAttribute("max");
    let raw_dE_min = Convert_date_To_rawDT(min_dateEnd);
    let raw_dE_max = Convert_date_To_rawDT(max_dateEnd);

    let raw_dE_set = Convert_date_To_rawDT(dateEnd.value);
    if (raw_dE_set > raw_dE_max) {
        dateEnd.value = max_dateEnd;
    } else if (raw_dE_set < raw_dE_min) {
        dateEnd.value = min_dateEnd;
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
        "operationType": "登入登出",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "王小明",
        "description": "登入EMS系統",
    }, {
        "index": "2",
        "operationType": "設備控制",
        "deviceName": "LC1",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "王小明",
        "description": "設定LC1輸出實功為1000 kW",
    }, {
        "index": "3",
        "operationType": "系統模式",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "王小明",
        "description": "啟動排程模式",
    }, {
        "index": "4",
        "operationType": "保護邏輯",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "王小明",
        "description": "關閉保護邏輯",
    }, {
        "index": "5",
        "operationType": "其它",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "王小明",
        "description": "更改使用者密碼",
    }, {
        "index": "6",
        "operationType": "登入登出",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "王小明",
        "description": "登出EMS系統",
    }, {
        "index": "7",
        "operationType": "登入登出",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "陳小美",
        "description": "登入EMS系統",
    }, {
        "index": "8",
        "operationType": "設備控制",
        "deviceName": "LC3",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "陳小美",
        "description": "切離BMS3-1、BMS3-2電池櫃",
    }, {
        "index": "9",
        "operationType": "系統模式",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "陳小美",
        "description": "設定今日16:00得標量為8000 kW",
    }, {
        "index": "10",
        "operationType": "系統模式",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "陳小美",
        "description": "設定今日17:00得標量為6000 kW",
    }, {
        "index": "11",
        "operationType": "系統模式",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "陳小美",
        "description": "設定今日18:00得標量為5000 kW",
    }, {
        "index": "12",
        "operationType": "保護邏輯",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "陳小美",
        "description": "開啟保護邏輯",
    }, {
        "index": "13",
        "operationType": "設備控制",
        "deviceName": "LC2",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "陳小美",
        "description": "設定LC2輸出虛功為-500 kVar",
    }, {
        "index": "14",
        "operationType": "其它",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "陳小美",
        "description": "更改使用者密碼",
    }, {
        "index": "15",
        "operationType": "登入登出",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "陳小美",
        "description": "登出EMS系統",
    }, {
        "index": "16",
        "operationType": "登入登出",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "林小華",
        "description": "登入EMS系統",
    }, {
        "index": "17",
        "operationType": "保護邏輯",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "林小華",
        "description": "關閉保護邏輯",
    }, {
        "index": "18",
        "operationType": "設備控制",
        "deviceName": "ACB1-3",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "林小華",
        "description": "切離ACB1-3",
    }, {
        "index": "19",
        "operationType": "系統模式",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "林小華",
        "description": "設定P_v功率規格為8 %",
    }, {
        "index": "20",
        "operationType": "系統模式",
        "deviceName": "EMS",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "林小華",
        "description": "設定Freq_C頻率規格為59.96 Hz",
    }, {
        "index": "21",
        "operationType": "設備控制",
        "deviceName": "LC4",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "林小華",
        "description": "設定空調停止",
    }, {
        "index": "22",
        "operationType": "設備控制",
        "deviceName": "LC2",
        "operationTime": "2023/09/01 15:23:10.123",
        "operator": "林小華",
        "description": "設定空調制冷溫度為22 °C",
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
            { data: "operationType" },
            { data: "deviceName" },
            { data: "operationTime" },
            { data: "operator" },
            { data: "description" },
        ],
        "columnDefs": [
            { targets: [5], width: "50%", className: 'text-align-left' }
        ]

    })

});

//////////////////////////////////////////////////////////////////////////////////////////////

// let raw_DT_now = new Date();

// let yy_now = raw_DT_now.getFullYear();
// let mm_now = String(raw_DT_now.getMonth() + 1).padStart(2, '0');
// let dd_now = String(raw_DT_now.getDate()).padStart(2, '0');
// let hh_now = String(raw_DT_now.getHours()).padStart(2, '0');
// let m_now = String(raw_DT_now.getMinutes()).padStart(2, '0');
// let ss_now = String(raw_DT_now.getSeconds()).padStart(2, '0');

// sd = document.querySelector(".block_temp #Startdate");
// st = document.querySelector(".block_temp #Starttime");
// ed = document.querySelector(".block_temp #Enddate");
// et = document.querySelector(".block_temp #Endtime");

// sd.value = yy_now + "-" + mm_now + "-" + dd_now;
// st.value = "00:00:00";
// ed.value = yy_now + "-" + mm_now + "-" + dd_now;
// et.value = hh_now + ":" + m_now + ":" + ss_now;

// sd.setAttribute("min", "2015-03-21");
// sd.setAttribute("max", yy_now + "-" + mm_now + "-" + dd_now);
// ed.setAttribute("min", yy_now + "-" + mm_now + "-" + dd_now);
// ed.setAttribute("max", yy_now + "-" + mm_now + "-" + dd_now);


// let mno = document.querySelector(".block_temp #printVal_01");
// let nop = document.querySelector(".block_temp #printVal_02");

// sd.addEventListener("change", print_abc);
// function print_abc() {
    // mno.textContent = sd.value;
    //     let yy_sd = Number(sd.value[0] + sd.value[1] + sd.value[2] + sd.value[3]);
    //     let mm_sd = Number(sd.value[5] + sd.value[6]) - 1;
    //     let dd_sd = Number(sd.value[8] + sd.value[9]);

    //     let raw_sd = new Date(yy_sd, mm_sd, dd_sd);
    //     let raw_sd_plus_90d = new Date(raw_sd.getTime() + 1000 * 60 * 60 * 24 * 90);

    //     raw_DT_now = new Date();
    //     let raw_ed_max;
    //     if (raw_sd_plus_90d > raw_DT_now) {
    //         raw_ed_max = raw_DT_now;
    //     } else {
    //         raw_ed_max = raw_sd_plus_90d;
    //     }

    //     let yy_ed_max = raw_ed_max.getFullYear();
    //     let mm_ed_max = String(raw_ed_max.getMonth() + 1).padStart(2, '0');
    //     let dd_ed_max = String(raw_ed_max.getDate()).padStart(2, '0');

    //     let ed_max = yy_ed_max + "-" + mm_ed_max + "-" + dd_ed_max;

    //     ed.setAttribute("min", sd.value);
    //     ed.setAttribute("max", ed_max);

    //     yy_ed_old = Number(ed.value[0] + ed.value[1] + ed.value[2] + ed.value[3]);
    //     mm_ed_old = Number(ed.value[5] + ed.value[6]) - 1;
    //     dd_ed_old = Number(ed.value[8] + ed.value[9]);

    //     let raw_ed_old = new Date(yy_ed_old, mm_ed_old, dd_ed_old);
    //     if (raw_ed_old < raw_sd) {
    //         ed.value = sd.value;
    //     } else if (raw_ed_old > raw_ed_max) {
    //         ed.value = ed_max;
    //     }

    //     // alert(raw_ed_old);
// }

// ed.addEventListener("change", print_def);
// function print_def() {
//     nop.textContent = ed.value;
//     let yy_sd = Number(sd.value[0] + sd.value[1] + sd.value[2] + sd.value[3]);
//     let mm_sd = Number(sd.value[5] + sd.value[6]) - 1;
//     let dd_sd = Number(sd.value[8] + sd.value[9]);

//     let raw_sd = new Date(yy_sd, mm_sd, dd_sd);
//     let raw_sd_plus_90d = new Date(raw_sd.getTime() + 1000 * 60 * 60 * 24 * 90);

//     raw_DT_now = new Date();
//     let raw_ed_max;
//     if (raw_sd_plus_90d > raw_DT_now) {
//         raw_ed_max = raw_DT_now;
//     } else {
//         raw_ed_max = raw_sd_plus_90d;
//     }

//     let yy_ed_max = raw_ed_max.getFullYear();
//     let mm_ed_max = String(raw_ed_max.getMonth() + 1).padStart(2, '0');
//     let dd_ed_max = String(raw_ed_max.getDate()).padStart(2, '0');

//     let ed_max = yy_ed_max + "-" + mm_ed_max + "-" + dd_ed_max;

//     yy_ed_set = Number(ed.value[0] + ed.value[1] + ed.value[2] + ed.value[3]);
//     mm_ed_set = Number(ed.value[5] + ed.value[6]) - 1;
//     dd_ed_set = Number(ed.value[8] + ed.value[9]);

//     let raw_ed_set = new Date(yy_ed_set, mm_ed_set, dd_ed_set);
//     if (raw_ed_set < raw_sd) {
//         ed.value = sd.value;
//     } else if (raw_ed_set > raw_ed_max) {
//         ed.value = ed_max;
//     }
// }




