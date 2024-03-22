// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";
$(document).ready(function () {
  extractTable();
  updateTable();
  classAdd("#nB_System", "default_nB");
});

setInterval(updateNavbar, 1000);
setInterval(updateTable, 5000);

//設備地點篩選
/*(function(document) {
	'use strict';
  
	// 建立 LightTableFilter
	var LightTableFilter = (function(Arr) {
  
	  var _input;
  
	  // 資料輸入事件處理函數
	  function _onInputEvent(e) {
		_input = e.target;
		var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
		Arr.forEach.call(tables, function(table) {
		  Arr.forEach.call(table.tBodies, function(tbody) {
			Arr.forEach.call(tbody.rows, _filter);
		  });
		});
	  }
  
	  // 資料篩選函數，顯示包含關鍵字的列，其餘隱藏
	  function _filter(row) {
		var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
		row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
	  }
  
	  return {
		// 初始化函數
		init: function() {
		  var inputs = document.getElementsByClassName('light-table-filter');
		  Arr.forEach.call(inputs, function(input) {
			input.oninput = _onInputEvent;
		  });
		}
	  };
	})(Array.prototype);
  
	// 網頁載入完成後，啟動 LightTableFilter
	document.addEventListener('readystatechange', function() {
	  if (document.readyState === 'complete') {
		LightTableFilter.init();
	  }
	});
  
  })(document);*/

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



var dataset;

/*async function updateTable(){

    dataset = await getData('http://localhost:3005/systeminfo/device/edit');//port要隨後端更改
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
}*/
var fixedValues = [];
function extractTable() { //將畫面上的欄位及標題讀出來
  $("#deviceTable tbody tr").each(function () {
    const rowValues = [];
    $(this)
      .find("td")
      .each(function () {
        rowValues.push($(this).text());
      });
    fixedValues.push(rowValues);
    // console.log(fixedValues);
  });
}
const bitList = [
  ["409101", "409102"], //點位對照
  ["409103", "409104"],
  ["409107", "409108"],
  ["409109", "409110"],
  ["409111", "409112"],
  ["409113", "409114"],
  ["409115", "409116"],
  ["409117", "409118"],
  ["409119", "409120"],
  ["409121", "409122"],
  ["409123", "409124"],
  ["409125", "409126"],
];

function assignBit(index) {
  var indexShift = index + 2;
  if (indexShift >= 2 && indexShift <= 5) {
    return bitList[0];
  } else if (indexShift === 6) {
    return bitList[1];
  } else if (indexShift === 7) {
    return bitList[2];
  } else if (indexShift >= 8 && indexShift <= 16) {
    return bitList[3];
  } else if (indexShift >= 17 && indexShift <= 20) {
    return bitList[4];
  } else if (indexShift >= 21 && indexShift <= 25) {
    return bitList[5];
  } else if (indexShift === 26) {
    return bitList[6];
  } else if (indexShift === 27) {
    return bitList[7];
  } else if (indexShift >= 28 && indexShift <= 32) {
    return bitList[8];
  } else if (indexShift === 33) {
    return bitList[9];
  } else if (indexShift >= 34 && indexShift <= 35) {
    return bitList[10];
  } else if (indexShift >= 36 && indexShift <= 39) {
    return bitList[11];
  } else {
    // Handle the case when indexShift is not in the specified range
    return null;
  }
}

var currentPageIndex; //頁碼初始為0
async function updateTable() {

  if ($.fn.DataTable.isDataTable("#deviceTable")) { // If DataTable is already initialized, read the page number
    currentPageIndex = $("#deviceTable").DataTable().page.info().page; // Get the current page index
  } else { 
    currentPageIndex = 0; 
  }
  

  const dataset = await getData(window.location.href+"/edit");

  // Combine fixed values with dynamic data
  var combinedData = fixedValues.map((fixedRowValues, index) => {
    const dynamicValues = Object.values(dataset[0]) || []; // Assuming the data structure matches the table structure
    // console.log(1, dynamicValues);
    // console.log("index" + index);
    var bit = assignBit(index);
    // console.log(bit);
    if (bit) {
      fixedRowValues[3] = dynamicValues[index + 2][bit[0]]; // Insert the value for "狀態" into position [3]
      fixedRowValues[5] = dynamicValues[index + 2][bit[1]]; // Insert the value for "重新連線次數" into position [5]
    } else {
      // Handle the case when bit is null (indexShift not in the specified range)
      console.error("IndexShift out of range for index " + index);
    }
    return fixedRowValues;
  });
  console.log(combinedData);

  // console.log(2, combinedData);

  // Check if DataTable is already initialized
  if ($.fn.DataTable.isDataTable("#deviceTable")) {
    // If DataTable is already initialized, just clear the existing data and redraw
    $("#deviceTable").DataTable().clear().rows.add(combinedData).draw();
  } else {
    // If DataTable is not initialized, initialize it with the combined data
    $("#deviceTable").DataTable({
      lengthMenu: [10, 20, 25, 50, 100],
      scrollY: "660px",
      language: lang,
      autoWidth: false,
      processing: false,
      orderMulti: false,
      ordering: false,
      pagingType: "simple_numbers",
      responsive: true,
      data: combinedData,
      pageLength: 20, // 預設為'10'，若需更改初始每頁顯示筆數，才需設定
      // Specify column headers for both fixed and dynamic columns
      /*columns: [
                { title: "Fixed Column 1" },
                { title: "Fixed Column 2" },
                { title: "Fixed Column 3" },
                { title: "Dynamic Column 1" },
                { title: "Dynamic Column 2" },
                // Add more dynamic columns as needed
            ],*/
    });
  }
  $("#deviceTable").DataTable().page(currentPageIndex).draw("page");//設定頁數為原本停留的頁面
}
//////////////////////////////////////////////////////////////////////////////////////////////////

// const filtDeviceOpts = document.querySelector(".filtDevice .filtOptions");
// const filtLocationOpts = document.querySelector(".filtLocation .filtOptions");

// const dDL_filtDev = document.querySelector(".title #dDL_filtDevice");
// dDL_filtDev.addEventListener("click", showHide_filtDevOpts);
// function showHide_filtDevOpts() {
//   filtDeviceOpts.classList.toggle("appear");
//   filtLocationOpts.classList.remove("appear");
// }

// const dDL_filtLoc = document.querySelector(".title #dDL_filtLocation");
// dDL_filtLoc.addEventListener("click", showHide_filtLocOpts);
// function showHide_filtLocOpts() {
//   filtLocationOpts.classList.toggle("appear");
//   filtDeviceOpts.classList.remove("appear");
// }

// const filterDevice = document.querySelector(".title .filtDevice p");
// const filterLocation = document.querySelector(".title .filtLocation p");

// document.addEventListener("click", hideFiltOptions);
// function hideFiltOptions(clickItem) {
//   if (
//     clickItem.target.id !== "dDL_filtDevice" &&
//     clickItem.target.id !== "dDL_filtLocation"
//   ) {
//     if (clickItem.target.id === "filtNone") {
//       filterDevice.textContent = "設備";
//       filterLocation.textContent = "地點";
//     } else if (
//       clickItem.target.id === "deviceFO_01" ||
//       clickItem.target.id === "deviceFO_02" ||
//       clickItem.target.id === "deviceFO_03" ||
//       clickItem.target.id === "deviceFO_04" ||
//       clickItem.target.id === "deviceFO_05" ||
//       clickItem.target.id === "deviceFO_06" ||
//       clickItem.target.id === "deviceFO_07" ||
//       clickItem.target.id === "deviceFO_08"
//     ) {
//       filterDevice.textContent = clickItem.target.textContent;
//     } else if (
//       clickItem.target.id === "locationFO_01" ||
//       clickItem.target.id === "locationFO_02" ||
//       clickItem.target.id === "locationFO_03" ||
//       clickItem.target.id === "locationFO_04" ||
//       clickItem.target.id === "locationFO_05" ||
//       clickItem.target.id === "locationFO_06" ||
//       clickItem.target.id === "locationFO_07" ||
//       clickItem.target.id === "locationFO_08" ||
//       clickItem.target.id === "locationFO_09" ||
//       clickItem.target.id === "locationFO_10"
//     ) {
//       filterLocation.textContent = clickItem.target.textContent;
//     }

//     filtDeviceOpts.classList.remove("appear");
//     filtLocationOpts.classList.remove("appear");
//   }
// }

//////////////////////////////////////////////////////////////////////////////////////////////
