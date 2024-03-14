// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

$(document).ready(function () {

    classAdd('#nB_Alarm', "default_nB");

    // block_temp
    // btn_test_01
    // inText_test_01

    // const inText_test_01 = document.querySelector(".block_temp #inText_test_01");
    // const inText_test_02 = document.querySelector(".block_temp #inText_test_02");
    // const inText_test_03 = document.querySelector(".block_temp #inText_test_03");
    // const inText_test_04 = document.querySelector(".block_temp #inText_test_04");
    // const inText_test_05 = document.querySelector(".block_temp #inText_test_05");
    // const inText_test_06 = document.querySelector(".block_temp #inText_test_06");
    // const inText_test_07 = document.querySelector(".block_temp #inText_test_07");
    // const inText_test_08 = document.querySelector(".block_temp #inText_test_08");

    // const btn_test_01 = document.querySelector(".block_temp #btn_test_01");
    // btn_test_01.addEventListener("click", function () { addOneLog(dataset); });
    // function addOneLog(tableDataset) {
    //     // inText_test_03.value = inText_test_01.value + inText_test_02.value;

    //     let newLog = {
    //         "index": "12",
    //         "startTime": "2023/11/21 01:23:45.123",
    //         "place": "控制室qaz",
    //         "deviceName": "HVAC-1_wsx",
    //         "almLevel": "警告_rfv",
    //         "description": "HVAC-1通訊異常_tgb",
    //         "value": "Comm error_ujm",
    //         "endTime": "2023/11/21 21:32:54.321",
    //     };

    //     let i = 2;
    //     console.log(tableDataset[i]["index"] + "_~_" + tableDataset[i]["place"] + "_~_" + tableDataset[i]["deviceName"] + "_~_" + tableDataset[i]["value"]);

    // }

    // const btn_test_02 = document.querySelector(".block_temp #btn_test_02");
    // btn_test_02.addEventListener("click", b_test_02);
    // function b_test_02() {
    //     console.log("qaz123w");
    // }

    // const btn_test_03 = document.querySelector(".block_temp #btn_test_03");
    // btn_test_03.addEventListener("click", b_test_03);
    // function b_test_03() {
    //     console.log("qaz456");
    // }

    // const btn_test_04 = document.querySelector(".block_temp #btn_test_04");
    // btn_test_04.addEventListener("click", b_test_04);
    // function b_test_04() {
    //     console.log("qaz789");
    // }

});

setInterval(updateNavbar, 1000);
/****************************************************************************************** */

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

//////////////////////////////////////////////////////////////////////////////////////////////

function Convert_date_To_rawDT(date) {
    let yy_date = Number(date[0] + date[1] + date[2] + date[3]);
    let mm_date = Number(date[5] + date[6]) - 1;
    let dd_date = Number(date[8] + date[9]);

    let raw_date = new Date(yy_date, mm_date, dd_date);
    return raw_date;
}

//////////////////////////////////////////////////////////////////////////////////////////////

function Limit_dateStart(raw_dS_set) {
    raw_DT_now = new Date();
    let raw_dS = raw_dS_set;
    let set_timeStart = false;

    if (raw_dS_set > raw_DT_now) {
        raw_dS = raw_DT_now;
        set_timeStart = true;
    } else if (raw_dS_set < Convert_date_To_rawDT(min_dateStart)) {
        raw_dS = Convert_date_To_rawDT(min_dateStart);
        set_timeStart = true;
    }

    if (set_timeStart) {
        let yy_dS = String(raw_dS.getFullYear()).padStart(4, '0');
        let mm_dS = String(raw_dS.getMonth() + 1).padStart(2, '0');
        let dd_dS = String(raw_dS.getDate()).padStart(2, '0');
        let hh_dS = String(raw_dS.getHours()).padStart(2, '0');
        let m_dS = String(raw_dS.getMinutes()).padStart(2, '0');
        let ss_dS = String(raw_dS.getSeconds()).padStart(2, '0');

        dateStart.value = yy_dS + "-" + mm_dS + "-" + dd_dS;
        timeStart.value = hh_dS + ":" + m_dS + ":" + ss_dS;
    }

    return raw_dS;
}

function Limit_dateEnd(raw_dE_set, dateEnd_min, dateEnd_max) {
    let raw_dateEnd_min = Convert_date_To_rawDT(dateEnd_min);
    let raw_dateEnd_max = Convert_date_To_rawDT(dateEnd_max);
    let dateEnd_max_Millisec = raw_dateEnd_max.getTime() + 1000 * 60 * 60 * 24 - 1;

    console.log(raw_dateEnd_min);
    console.log(dateEnd_max_Millisec);

    let raw_dE;
    let set_dateEnd = false;

    if (raw_dE_set.getTime() > dateEnd_max_Millisec) {
        raw_dE = raw_dateEnd_max;
        timeEnd.value = "23:59:59";
        set_dateEnd = true;
    } else if (raw_dE_set < raw_dateEnd_min) {
        raw_dE = raw_dateEnd_min;
        set_dateEnd = true;
    }

    if (set_dateEnd) {
        let yy_dE = String(raw_dE.getFullYear()).padStart(4, '0');
        let mm_dE = String(raw_dE.getMonth() + 1).padStart(2, '0');
        let dd_dE = String(raw_dE.getDate()).padStart(2, '0');

        dateEnd.value = yy_dE + "-" + mm_dE + "-" + dd_dE;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

function update_dateEnd_MinMax(raw_dS_set) {
    let raw_dS_plus_90d = new Date(raw_dS_set.getTime() + 1000 * 60 * 60 * 24 * 90);

    raw_DT_now = new Date();
    let raw_dE_max;
    if (raw_dS_plus_90d > raw_DT_now) {
        raw_dE_max = raw_DT_now;
    } else {
        raw_dE_max = raw_dS_plus_90d;
    }

    let yy_dE_max = raw_dE_max.getFullYear();
    // let yy_dE_max = String(raw_dE_max.getFullYear()).padStart(4, '0');
    let mm_dE_max = String(raw_dE_max.getMonth() + 1).padStart(2, '0');
    let dd_dE_max = String(raw_dE_max.getDate()).padStart(2, '0');

    let dE_max = yy_dE_max + "-" + mm_dE_max + "-" + dd_dE_max;

    dateEnd.setAttribute("min", dateStart.value);
    dateEnd.setAttribute("max", dE_max);
}

//////////////////////////////////////////////////////////////////////////////////////////////

let yy_dS;
let yy_dE;

dateStart.addEventListener("change", dateStart_change);
function dateStart_change() {
    if (dateStart.value === "") {
        console.log('dateStart.value === ""');
        return 0;
    }

    yy_dS = dateStart.value.split("-")[0];
    let yy_min_dateStart = min_dateStart.split("-")[0];
    if (Number(yy_dS) < Number(yy_min_dateStart)) {
        return 0;
    }

    console.log("abc_123");

    let raw_dS_temp = Convert_date_To_rawDT(dateStart.value);
    let raw_dS = Limit_dateStart(raw_dS_temp);
    console.log(raw_dS);

    update_dateEnd_MinMax(raw_dS);

    console.log(dateEnd.getAttribute("min"));
    console.log(dateEnd.getAttribute("max"));

    if (dateEnd.value === "") {
        console.log('dateEnd.value === ""');
        return 0;
    }

    console.log("qwe123rty")
    let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
    Limit_dateEnd(raw_dE_temp, dateEnd.getAttribute("min"), dateEnd.getAttribute("max"));
}

const goToFirst_dS = document.querySelector(".timeRangeQuery #goToFirst_dS");
goToFirst_dS.addEventListener("click", goTo_dateStart_min);
function goTo_dateStart_min() {
    dateStart.value = min_dateStart;
    timeStart.value = "00:00:00";

    let raw_dateStart_min = Convert_date_To_rawDT(min_dateStart);

    update_dateEnd_MinMax(raw_dateStart_min);

    console.log(dateEnd.getAttribute("min"));
    console.log(dateEnd.getAttribute("max"));

    if (dateEnd.value === "") {
        console.log('dateEnd.value === ""');
        return 0;
    }

    let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
    Limit_dateEnd(raw_dE_temp, dateEnd.getAttribute("min"), dateEnd.getAttribute("max"));
}

const goToLast_dS = document.querySelector(".timeRangeQuery #goToLast_dS");
goToLast_dS.addEventListener("click", goTo_dateStart_max);
function goTo_dateStart_max() {
    raw_DT_now = new Date();

    yy_now = raw_DT_now.getFullYear();
    mm_now = String(raw_DT_now.getMonth() + 1).padStart(2, '0');
    dd_now = String(raw_DT_now.getDate()).padStart(2, '0');
    hh_now = String(raw_DT_now.getHours()).padStart(2, '0');
    m_now = String(raw_DT_now.getMinutes()).padStart(2, '0');
    ss_now = String(raw_DT_now.getSeconds()).padStart(2, '0');

    dateStart.value = yy_now + "-" + mm_now + "-" + dd_now;
    timeStart.value = hh_now + ":" + m_now + ":" + ss_now;

    dateEnd.setAttribute("min", dateStart.value);
    dateEnd.setAttribute("max", dateStart.value);

    if (dateEnd.value === "") {
        console.log('dateEnd.value === ""');
        return 0;
    }

    let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
    Limit_dateEnd(raw_dE_temp, dateEnd.getAttribute("min"), dateEnd.getAttribute("max"));
}

const goToPrevious_dS = document.querySelector(".timeRangeQuery #goToPrevious_dS");
goToPrevious_dS.addEventListener("click", move_dateStart_forward1Day);
function move_dateStart_forward1Day() {
    if (dateStart.value === "") {
        console.log('dateStart.value === ""');
        return 0;
    }

    yy_dS = dateStart.value.split("-")[0];
    let yy_min_dateStart = min_dateStart.split("-")[0];
    if (Number(yy_dS) < Number(yy_min_dateStart)) {
        return 0;
    }

    let raw_dS_old = Convert_date_To_rawDT(dateStart.value);
    let raw_dS_temp = new Date(raw_dS_old.getTime() - 1000 * 60 * 60 * 24);

    let yy_dS_new = String(raw_dS_temp.getFullYear()).padStart(4, '0');
    let mm_dS_new = String(raw_dS_temp.getMonth() + 1).padStart(2, '0');
    let dd_dS_new = String(raw_dS_temp.getDate()).padStart(2, '0');

    dateStart.value = yy_dS_new + "-" + mm_dS_new + "-" + dd_dS_new;

    let raw_dS = Limit_dateStart(raw_dS_temp);
    console.log(raw_dS);

    update_dateEnd_MinMax(raw_dS);

    console.log(dateEnd.getAttribute("min"));
    console.log(dateEnd.getAttribute("max"));

    if (dateEnd.value === "") {
        console.log('dateEnd.value === ""');
        return 0;
    }

    console.log("qwe456rty")
    let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
    Limit_dateEnd(raw_dE_temp, dateEnd.getAttribute("min"), dateEnd.getAttribute("max"));
}

const goToNext_dS = document.querySelector(".timeRangeQuery #goToNext_dS");
goToNext_dS.addEventListener("click", move_dateStart_back1Day);
function move_dateStart_back1Day() {
    if (dateStart.value === "") {
        console.log('dateStart.value === ""');
        return 0;
    }

    yy_dS = dateStart.value.split("-")[0];
    let yy_min_dateStart = min_dateStart.split("-")[0];
    if (Number(yy_dS) < Number(yy_min_dateStart)) {
        return 0;
    }

    let raw_dS_old = Convert_date_To_rawDT(dateStart.value);
    let raw_dS_temp = new Date(raw_dS_old.getTime() + 1000 * 60 * 60 * 24);

    let yy_dS_new = String(raw_dS_temp.getFullYear()).padStart(4, '0');
    let mm_dS_new = String(raw_dS_temp.getMonth() + 1).padStart(2, '0');
    let dd_dS_new = String(raw_dS_temp.getDate()).padStart(2, '0');

    dateStart.value = yy_dS_new + "-" + mm_dS_new + "-" + dd_dS_new;

    let raw_dS = Limit_dateStart(raw_dS_temp);
    console.log(raw_dS);

    update_dateEnd_MinMax(raw_dS);

    console.log(dateEnd.getAttribute("min"));
    console.log(dateEnd.getAttribute("max"));

    if (dateEnd.value === "") {
        console.log('dateEnd.value === ""');
        return 0;
    }

    console.log("qwe789rty")
    let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
    Limit_dateEnd(raw_dE_temp, dateEnd.getAttribute("min"), dateEnd.getAttribute("max"));
}

//////////////////////////////////////////////////////////////////////////////////////////////

dateEnd.addEventListener("change", dateEnd_change);
function dateEnd_change() {
    if (dateEnd.value === "") {
        console.log('dateEnd.value === ""');
        return 0;
    }

    yy_dE = dateEnd.value.split("-")[0];
    if (Number(yy_dE) < 1000) {
        return 0;
    }

    let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
    Limit_dateEnd(raw_dE_temp, dateEnd.getAttribute("min"), dateEnd.getAttribute("max"));
}

const goToFirst_dE = document.querySelector(".timeRangeQuery #goToFirst_dE");
goToFirst_dE.addEventListener("click", goTo_dateEnd_min);
function goTo_dateEnd_min() {
    dateEnd.value = dateEnd.getAttribute("min");
}

const goToLast_dE = document.querySelector(".timeRangeQuery #goToLast_dE");
goToLast_dE.addEventListener("click", goTo_dateEnd_max);
function goTo_dateEnd_max() {
    dateEnd.value = dateEnd.getAttribute("max");
    timeEnd.value = "23:59:59";
}

const goToPrevious_dE = document.querySelector(".timeRangeQuery #goToPrevious_dE");
goToPrevious_dE.addEventListener("click", move_dateEnd_forward1Day);
function move_dateEnd_forward1Day() {
    if (dateEnd.value === "") {
        console.log('dateEnd.value === ""');
        return 0;
    }

    yy_dE = dateEnd.value.split("-")[0];
    if (Number(yy_dE) < 1000) {
        return 0;
    }

    let raw_dE_old = Convert_date_To_rawDT(dateEnd.value);
    let raw_dE_temp = new Date(raw_dE_old.getTime() - 1000 * 60 * 60 * 24);

    let yy_dE_new = String(raw_dE_temp.getFullYear()).padStart(4, '0');
    let mm_dE_new = String(raw_dE_temp.getMonth() + 1).padStart(2, '0');
    let dd_dE_new = String(raw_dE_temp.getDate()).padStart(2, '0');

    dateEnd.value = yy_dE_new + "-" + mm_dE_new + "-" + dd_dE_new;

    Limit_dateEnd(raw_dE_temp, dateEnd.getAttribute("min"), dateEnd.getAttribute("max"));
}

const goToNext_dE = document.querySelector(".timeRangeQuery #goToNext_dE");
goToNext_dE.addEventListener("click", move_dateEnd_back1Day);
function move_dateEnd_back1Day() {
    if (dateEnd.value === "") {
        console.log('dateEnd.value === ""');
        return 0;
    }

    yy_dE = dateEnd.value.split("-")[0];
    if (Number(yy_dE) < 1000) {
        return 0;
    }

    let raw_dE_old = Convert_date_To_rawDT(dateEnd.value);
    let raw_dE_temp = new Date(raw_dE_old.getTime() + 1000 * 60 * 60 * 24);

    let yy_dE_new = String(raw_dE_temp.getFullYear()).padStart(4, '0');
    let mm_dE_new = String(raw_dE_temp.getMonth() + 1).padStart(2, '0');
    let dd_dE_new = String(raw_dE_temp.getDate()).padStart(2, '0');

    dateEnd.value = yy_dE_new + "-" + mm_dE_new + "-" + dd_dE_new;

    Limit_dateEnd(raw_dE_temp, dateEnd.getAttribute("min"), dateEnd.getAttribute("max"));
}

//////////////////////////////////////////////////////////////////////////////////////////////

const window_WrongDataSet = document.querySelector(".alert_WrongDataSet");
const alertMessage = document.querySelector(".alert_WrongDataSet p");

const btn_Query = document.querySelector(".timeRangeQuery #btn_Query");
btn_Query.addEventListener("click", QueryLog);
async function QueryLog() {
    if (dateStart.value === "") {
        alertMessage.textContent = "開始日期設定有誤！";
        window_WrongDataSet.classList.add("appear");
    } else if (timeStart.value.length !== 8) {
        alertMessage.textContent = "開始時間設定有誤！";
        window_WrongDataSet.classList.add("appear");
    } else if (dateEnd.value === "") {
        alertMessage.textContent = "結束日期設定有誤！";
        window_WrongDataSet.classList.add("appear");
    } else if (timeEnd.value.length !== 8) {
        alertMessage.textContent = "結束時間設定有誤！";
        window_WrongDataSet.classList.add("appear");
    } else {
        console.log("Query from '" + dateStart.value + " " + timeStart.value + "' to '" + dateEnd.value + " " + timeEnd.value + "'.")
        await dataPost(window.location.href+"/edit", dateStart.value, timeStart.value, dateEnd.value, timeEnd.value)//時間區間查詢

    }
}

const closeWB_No_WrongDataSet = document.querySelector(".alert_WrongDataSet #closeWB_No");
closeWB_No_WrongDataSet.addEventListener("click", close_WrongDataSet_No);
function close_WrongDataSet_No() {
    window_WrongDataSet.classList.remove("appear");
}

//get / post功能 ////////////////////////////////////////////////////////////////////////////////////////////


var dataset=[];

async function updateTable(){
    dataset = await getData(window.location.href+"/edit");
    console.log(dataset);
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
        pageLength: 15, // 預設為'10'，若需更改初始每頁顯示筆數，才需設定
        responsive: true,

        "data": dataset,
        "columns": [
            { data: "index" },
            { data: "occurrence_time" },
            { data: "location" },
            { data: "device" },
            { data: "level" },
            { data: "content" },
            {
              data: "read",
              render: function (data, type, row) {
                var rowIndex = row.index; // Get the index from the row object
                //var checkboxId = "chb_Ack_" + rowIndex;
                  if (data === true) {
                    return '<img src="../public/images/Recover_Logo_v1.png" alt="復歸圖示">';
                  } else {
                    return "";
                  }
              },
            },
            {
              data: "recover",
              render: function (data, type, row) {
                if (data === true) {
                  return '<img src="../public/images/Recover_Logo_v1.png" alt="復歸圖示">';
                } else {
                  return "";
                }
              },
            },
            { data: "recover_time" },
          ],

    })
    createIndex('#almTable');
}




