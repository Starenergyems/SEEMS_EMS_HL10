// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

$(document).ready(async function () {
  classAdd("#nB_Event", "default_nB"); //側欄按鈕綠色
  generateDropOptions(//生成下拉選單
    '#filtOpType', 
    ['操作類別','系統模式', '設備控制', '環境控制', '保護邏輯', '帳號設定'], 
    'filtOpt', 
    null, 
    ['操作類別','系統模式', '設備控制', '環境控制', '保護邏輯', '帳號設定'], 
    '操作類別'
  ) 
  generateDropOptions(//生成下拉選單
    '#filtDevice', 
    ['設備','GC','ACB', 'LC', 'EMS'], 
    'filtOpt', 
    null, 
    ['設備','GC','ACB', 'LC', 'EMS'], 
    '設備'
  )  
  updateTable(); //讀取預設的時間區段
  updateTable(); //讀取預設的時間區段

});

setInterval(updateNavbar, 1000);
////////////////////////////////////////////////////

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
async function updateTable() {

  var dataset = await getData(window.location.href+"/edit");
  console.log(dataset);

  $("#evtTable").DataTable({
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

    data: dataset,
    columns: [
      { data: "index" },
      { data: "category" },
      { data: "device" },
      { data: "time" },
      { data: "username" },
      { data: "content" },
    ],
    columnDefs: [{ targets: [5], width: "50%", className: "text-align-left" }],
  });
  createIndex("#evtTable");
}

async function updateTable_post(data) {

  // var dataset = await getData(window.location.href+"/edit");
  var dataset = data;
  console.log(dataset);

  $("#evtTable").DataTable({
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

    data: dataset,
    columns: [
      { data: "index" },
      { data: "category" },
      { data: "device" },
      { data: "time" },
      { data: "username" },
      { data: "content" },
    ],
    columnDefs: [{ targets: [5], width: "50%", className: "text-align-left" }],
  });
  createIndex("#evtTable");
}

//////////////////////////////////////////////////////////////////////////////////////////////

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
  if (
    clickItem.target.id !== "dDL_filtOpType" &&
    clickItem.target.id !== "dDL_filtDevice"
  ) {
    if (clickItem.target.id === "filtNone") {
      filterOpType.textContent = "操作類別";
      filterDevice.textContent = "設備";
      _onInputEvent();//更新表格，隱藏不相關欄位
    } else if (
      clickItem.target.id === "opTypeFO_01" ||
      clickItem.target.id === "opTypeFO_02" ||
      clickItem.target.id === "opTypeFO_03" ||
      clickItem.target.id === "opTypeFO_04" ||
      clickItem.target.id === "opTypeFO_05"
    ) {
      filterOpType.textContent = clickItem.target.textContent;
      _onInputEvent();//更新表格，隱藏不相關欄位
    } else if (
      clickItem.target.id === "deviceFO_01" ||
      clickItem.target.id === "deviceFO_02" ||
      clickItem.target.id === "deviceFO_03" ||
      clickItem.target.id === "deviceFO_04" ||
      clickItem.target.id === "deviceFO_05" ||
      clickItem.target.id === "deviceFO_06" ||
      clickItem.target.id === "deviceFO_07" ||
      clickItem.target.id === "deviceFO_08"
    ) {
      filterDevice.textContent = clickItem.target.textContent;
      _onInputEvent();//更新表格，隱藏不相關欄位
    }

    filtOpTypeOpts.classList.remove("appear");
    filtDeviceOpts.classList.remove("appear");
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

let raw_DT_now = new Date();

let yy_now = raw_DT_now.getFullYear();
let mm_now = String(raw_DT_now.getMonth() + 1).padStart(2, "0");
let dd_now = String(raw_DT_now.getDate()).padStart(2, "0");
let hh_now = String(raw_DT_now.getHours()).padStart(2, "0");
let m_now = String(raw_DT_now.getMinutes()).padStart(2, "0");
let ss_now = String(raw_DT_now.getSeconds()).padStart(2, "0");

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
    let yy_dS = String(raw_dS.getFullYear()).padStart(4, "0");
    let mm_dS = String(raw_dS.getMonth() + 1).padStart(2, "0");
    let dd_dS = String(raw_dS.getDate()).padStart(2, "0");
    let hh_dS = String(raw_dS.getHours()).padStart(2, "0");
    let m_dS = String(raw_dS.getMinutes()).padStart(2, "0");
    let ss_dS = String(raw_dS.getSeconds()).padStart(2, "0");

    dateStart.value = yy_dS + "-" + mm_dS + "-" + dd_dS;
    timeStart.value = hh_dS + ":" + m_dS + ":" + ss_dS;
  }

  return raw_dS;
}

function Limit_dateEnd(raw_dE_set, dateEnd_min, dateEnd_max) {
  let raw_dateEnd_min = Convert_date_To_rawDT(dateEnd_min);
  let raw_dateEnd_max = Convert_date_To_rawDT(dateEnd_max);
  let dateEnd_max_Millisec =
    raw_dateEnd_max.getTime() + 1000 * 60 * 60 * 24 - 1;

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
    let yy_dE = String(raw_dE.getFullYear()).padStart(4, "0");
    let mm_dE = String(raw_dE.getMonth() + 1).padStart(2, "0");
    let dd_dE = String(raw_dE.getDate()).padStart(2, "0");

    dateEnd.value = yy_dE + "-" + mm_dE + "-" + dd_dE;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

function update_dateEnd_MinMax(raw_dS_set) {
  let raw_dS_plus_90d = new Date(
    raw_dS_set.getTime() + 1000 * 60 * 60 * 24 * 90
  );

  raw_DT_now = new Date();
  let raw_dE_max;
  if (raw_dS_plus_90d > raw_DT_now) {
    raw_dE_max = raw_DT_now;
  } else {
    raw_dE_max = raw_dS_plus_90d;
  }

  let yy_dE_max = raw_dE_max.getFullYear();
  // let yy_dE_max = String(raw_dE_max.getFullYear()).padStart(4, '0');
  let mm_dE_max = String(raw_dE_max.getMonth() + 1).padStart(2, "0");
  let dd_dE_max = String(raw_dE_max.getDate()).padStart(2, "0");

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

  console.log("qwe123rty");
  let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
  Limit_dateEnd(
    raw_dE_temp,
    dateEnd.getAttribute("min"),
    dateEnd.getAttribute("max")
  );
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
  Limit_dateEnd(
    raw_dE_temp,
    dateEnd.getAttribute("min"),
    dateEnd.getAttribute("max")
  );
}

const goToLast_dS = document.querySelector(".timeRangeQuery #goToLast_dS");
goToLast_dS.addEventListener("click", goTo_dateStart_max);
function goTo_dateStart_max() {
  raw_DT_now = new Date();

  yy_now = raw_DT_now.getFullYear();
  mm_now = String(raw_DT_now.getMonth() + 1).padStart(2, "0");
  dd_now = String(raw_DT_now.getDate()).padStart(2, "0");
  hh_now = String(raw_DT_now.getHours()).padStart(2, "0");
  m_now = String(raw_DT_now.getMinutes()).padStart(2, "0");
  ss_now = String(raw_DT_now.getSeconds()).padStart(2, "0");

  dateStart.value = yy_now + "-" + mm_now + "-" + dd_now;
  timeStart.value = hh_now + ":" + m_now + ":" + ss_now;

  dateEnd.setAttribute("min", dateStart.value);
  dateEnd.setAttribute("max", dateStart.value);

  if (dateEnd.value === "") {
    console.log('dateEnd.value === ""');
    return 0;
  }

  let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
  Limit_dateEnd(
    raw_dE_temp,
    dateEnd.getAttribute("min"),
    dateEnd.getAttribute("max")
  );
}

const goToPrevious_dS = document.querySelector(
  ".timeRangeQuery #goToPrevious_dS"
);
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

  let yy_dS_new = String(raw_dS_temp.getFullYear()).padStart(4, "0");
  let mm_dS_new = String(raw_dS_temp.getMonth() + 1).padStart(2, "0");
  let dd_dS_new = String(raw_dS_temp.getDate()).padStart(2, "0");

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

  console.log("qwe456rty");
  let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
  Limit_dateEnd(
    raw_dE_temp,
    dateEnd.getAttribute("min"),
    dateEnd.getAttribute("max")
  );
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

  let yy_dS_new = String(raw_dS_temp.getFullYear()).padStart(4, "0");
  let mm_dS_new = String(raw_dS_temp.getMonth() + 1).padStart(2, "0");
  let dd_dS_new = String(raw_dS_temp.getDate()).padStart(2, "0");

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

  console.log("qwe789rty");
  let raw_dE_temp = Convert_date_To_rawDT(dateEnd.value);
  Limit_dateEnd(
    raw_dE_temp,
    dateEnd.getAttribute("min"),
    dateEnd.getAttribute("max")
  );
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
  Limit_dateEnd(
    raw_dE_temp,
    dateEnd.getAttribute("min"),
    dateEnd.getAttribute("max")
  );
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

const goToPrevious_dE = document.querySelector(
  ".timeRangeQuery #goToPrevious_dE"
);
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

  let yy_dE_new = String(raw_dE_temp.getFullYear()).padStart(4, "0");
  let mm_dE_new = String(raw_dE_temp.getMonth() + 1).padStart(2, "0");
  let dd_dE_new = String(raw_dE_temp.getDate()).padStart(2, "0");

  dateEnd.value = yy_dE_new + "-" + mm_dE_new + "-" + dd_dE_new;

  Limit_dateEnd(
    raw_dE_temp,
    dateEnd.getAttribute("min"),
    dateEnd.getAttribute("max")
  );
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

  let yy_dE_new = String(raw_dE_temp.getFullYear()).padStart(4, "0");
  let mm_dE_new = String(raw_dE_temp.getMonth() + 1).padStart(2, "0");
  let dd_dE_new = String(raw_dE_temp.getDate()).padStart(2, "0");

  dateEnd.value = yy_dE_new + "-" + mm_dE_new + "-" + dd_dE_new;

  Limit_dateEnd(
    raw_dE_temp,
    dateEnd.getAttribute("min"),
    dateEnd.getAttribute("max")
  );
}

//////////////////////////////////////////////////////////////////////////////////////////////

const window_WrongDataSet = document.querySelector(".alert_WrongDataSet");
const alertMessage = document.querySelector(".alert_WrongDataSet p");

const btn_Query = document.querySelector(".timeRangeQuery #btn_Query");
btn_Query.addEventListener("click", QueryLog);
function QueryLog() {
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
    console.log(
      "Query from '" +
        dateStart.value +
        " " +
        timeStart.value +
        "' to '" +
        dateEnd.value +
        " " +
        timeEnd.value +
        "'."
    );
    dataPost(
      window.location.href+"/edit",
      dateStart.value,
      timeStart.value,
      dateEnd.value,
      timeEnd.value
    );
  }
}

const closeWB_No_WrongDataSet = document.querySelector(
  ".alert_WrongDataSet #closeWB_No"
);
closeWB_No_WrongDataSet.addEventListener("click", close_WrongDataSet_No);
function close_WrongDataSet_No() {
  window_WrongDataSet.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////

sd = document.querySelector(".block_temp #Startdate");
st = document.querySelector(".block_temp #Starttime");
ed = document.querySelector(".block_temp #Enddate");
et = document.querySelector(".block_temp #Endtime");

// let schedule_02 = setInterval(qaz12, 1000);
// function qaz12() {
//     console.log(st.value);
// }

const btn_test_01 = document.querySelector(".block_temp #btn_test_01");
btn_test_01.addEventListener("click", b_test_01);
function b_test_01() {}

const btn_test_02 = document.querySelector(".block_temp #btn_test_02");
btn_test_02.addEventListener("click", b_test_02);
function b_test_02() {
  console.log(st.value);
  console.log(st.value.length);
  console.log(typeof st.value.length);
}

// 下拉選單篩選 //////////////////////////////////////////////////////////////////////////////////////////
    var val_1, val_2
    var Arr = Array.prototype;

	  // 資料輸入事件處理函數
	  function _onInputEvent() {

    val_1 = filterOpType.textContent;
    val_2 = filterDevice.textContent;
    console.log(val_1, val_2);

		var tables = $('#evtTable');
		Arr.forEach.call(tables, function(table) {
		  Arr.forEach.call(table.tBodies, function(tbody) {
			Arr.forEach.call(tbody.rows, _filter);
		  });
		});
	  }
  
	  // 資料篩選函數，顯示包含關鍵字的列，其餘隱藏
	  function _filter(row) {
 
		var text_1 = row.querySelectorAll('td')[1].textContent; //篩選操作類別
    var text_2 = row.querySelectorAll('td')[2].textContent; //篩選設備名稱
    // var text_2 = row.querySelectorAll('td')[2].textContent.toLowerCase(), val_2 = filterDevice.value.toLowerCase();
    if (val_1 === "操作類別" && val_2 === "設備"){
      console.log(0)
      row.style.display =  'table-row'; //如果沒有1就設成None
    } else {
      if (val_1 != "操作類別" && val_2 != "設備"){ //2個都有目標值
        console.log(1);
        console.log(text_1.indexOf(val_1),  text_2.indexOf(val_2));
        row.style.display = text_1.indexOf(val_1) === 0 && text_2.indexOf(val_2) === 0 ? 'table-row':'none' ; //2個都有就設成可看
      } else if (val_1 === "操作類別"){ //1沒有值, 只判斷2
        console.log(2);
        row.style.display =  text_2.indexOf(val_2) === -1 ? 'none' : 'table-row'; //如果沒有2就設成None
      } else if (val_2 === "設備"){ //2沒有值, 只判斷1
        console.log(3);
        row.style.display =  text_1.indexOf(val_1) === -1 ? 'none' : 'table-row'; //如果沒有1就設成None
      } 
    }
		
	  }


	 