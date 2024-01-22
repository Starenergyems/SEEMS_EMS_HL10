// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

//const { check } = require("prettier");

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
  if (
    clickItem.target.id !== "dDL_filtDevice" &&
    clickItem.target.id !== "dDL_filtLocation" &&
    clickItem.target.id !== "dDL_filtLevel"
  ) {
    if (clickItem.target.id === "filtNone") {
      filterDevice.textContent = "設備";
      filterLocation.textContent = "地點";
      filterLevel.textContent = "等級";
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
    } else if (
      clickItem.target.id === "locationFO_01" ||
      clickItem.target.id === "locationFO_02" ||
      clickItem.target.id === "locationFO_03" ||
      clickItem.target.id === "locationFO_04" ||
      clickItem.target.id === "locationFO_05" ||
      clickItem.target.id === "locationFO_06" ||
      clickItem.target.id === "locationFO_07" ||
      clickItem.target.id === "locationFO_08" ||
      clickItem.target.id === "locationFO_09" ||
      clickItem.target.id === "locationFO_10"
    ) {
      filterLocation.textContent = clickItem.target.textContent;
    } else if (
      clickItem.target.id === "levelFO_01" ||
      clickItem.target.id === "levelFO_02"
    ) {
      filterLevel.textContent = clickItem.target.textContent;
    }

    filtDeviceOpts.classList.remove("appear");
    filtLocationOpts.classList.remove("appear");
    filtLevelOpts.classList.remove("appear");
  }
}

//////////////////與後端互動/////////////////////////////////////////////

async function dataGet(url) { //跟後端拿資料
  const response = await fetch(url);
  const values = await response.json();
  return values;}

async function dataPost(url, ID, Checked) {//提交資料給後端

      console.log('開始嘗試POST')

      $.ajax({
        type: 'POST',
        url: url,
        data: {ID, Checked},
        success: function(){
          console.log("POST完成")
          updateTable()//更新表格
        },
        error: function (error) {
          reject(error);
        },
      });


}

///////////////////////////////////////////////////////////////////////////////
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

var dataset=[];

async function updateTable(){

  
  /*var dataset = [
    {
      index: "1",
      startTime: "2023/09/01 15:23:10.123",
      place: "控制室",
      deviceName: "HVAC-1",
      almLevel: "警告",
      description: "HVAC-1通訊異常",
      value: "Comm error",
      acked: "",
      ended: "0",
      endTime: "",
      checked: "1",
    },
    {
      index: "2",
      startTime: "2023/09/01 15:22:10.123",
      place: "ESS3-2",
      deviceName: "BMS3-2",
      almLevel: "錯誤",
      description: "電芯過溫保護",
      value: "Normal",
      acked: "",
      ended: "1",
      endTime: "2023/09/01 15:22:50.123",
      checked: "0",
    },
    {
      index: "3",
      startTime: "2023/09/01 15:13:10.123",
      place: "戶外",
      deviceName: "變壓器2",
      almLevel: "警告",
      description: "變壓器2油溫過高",
      value: "67",
      acked: "",
      ended: "0",
      endTime: "",
      checked: "1",
    },
    {
      index: "4",
      startTime: "2023/09/01 13:23:10.123",
      place: "MVCB",
      deviceName: "保護電驛",
      almLevel: "錯誤",
      description: "MVCB保護電驛_51-1",
      value: "Normal",
      acked: "",
      ended: "1",
      endTime: "2023/09/01 14:43:10.123",
      checked: "0",
    },
  ];*/

  dataset = await dataGet('http://localhost:3200/alarm/realtime/edit');
  console.log(dataset);	


  $("#almTable").DataTable({
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

    /*"ajax": {
      "url": "http://localhost:3200/alarm/realtime/edit", // Replace with your server-side script
      "dataSrc": "data",
    "success": function(data) {
      console.log(data[0]); // Print the data to the console
  }
     },*/

    data: dataset,
    columns: [//要再加一欄index
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

          if (permission === "manager") {
            if (data === true) {
              return (
                '<input type="checkbox" checked class="chb_Ack">'
              );
            } else {
              return (
                '<input type="checkbox" class="chb_Ack">'
              );
            }
          } else {
            if (data === true) {
              return '<img src="../public/images/Recover_Logo_v1.png" alt="復歸圖示">';
            } else {
              return "";
            }
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
    
  });
  readCheck();//監測所有已讀是否打勾
}

//////////////////////////////////////////////////////////////////////////////////////////////

//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {

 
  waitTable();
  // 彈出視窗確定全選
  $("#chb_AckAll").on("change", function () {
    appear();
  });


});
async function waitTable(){
    await updateTable();//更新表格
    //checkAllStatus(dataset);//判斷已讀全選是否該勾
}


/*function checkAllStatus(data){//判斷全選欄是否該勾選
  
    // Check if all values are true
    const allChecked = data.every(item => item.read === true);
    console.log(allChecked);
    return allChecked; //還須測試如果全部是true會不會打勾

}*/
function appear() {
  $("#message").addClass("appear");
}
function remove() {
  $("#message").removeClass("appear");
}
function allCheck() {//確定全選後執行
  remove();
  const isChecked = $("#chb_AckAll").prop("checked");
  dataPost('http://localhost:3200/alarm/realtime/edit', 'all', isChecked);

  //$(".chb_Ack").prop("checked", isChecked); //所有告警皆已讀
  $("#chb_AckAll").prop("checked", !isChecked); // 全選欄復歸
}


var rowId, rowChecked;
function readCheck() {  //監測是否勾選已讀，勾選後刪除
  let table = new DataTable('#almTable'); 

  $(".chb_Ack")
    .off("change")
    .on("change",  function () {
      var rowData = table.row($(this).closest("tr")).data();
      var rowId = rowData._id;//這筆資料在資料庫裡的id
      var rowChecked = $(this).closest("td").find("input[type='checkbox']").prop("checked");
      console.log(rowId);
      console.log("已讀框偵測: "+rowChecked);
      // Send an AJAX request to remove the row from the database
      dataPost('http://localhost:3200/alarm/realtime/edit', rowId, rowChecked);
    });
}
