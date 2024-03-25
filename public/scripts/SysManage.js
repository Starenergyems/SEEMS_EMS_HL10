$(document).ready(function(){	
    dataTable();
	readPass();
	readForbid();
	readText();

})

setInterval(updateNavbar, 1000);


//讓上方padding與navbar同高，這樣縮放時若navbar寬度有變不會擋住body
function TopPadding(navbar=".navbar",body="#page"){
	var navHeight=document.querySelector(navbar).clientHeight; 
	var page=document.querySelector(body);
	let nav=navHeight.toString()+"px";	
	page.style.paddingTop = nav;
}
/*時間*/
function updateClock(){
	var now = new Date();
	var months = ["01", "02", "03","04","05","06","07","08","09","10","11","12"];
	var mo = now.getMonth(),
		dnum = now.getDate(),
		yr = now.getFullYear(),
		hou = now.getHours(),
		min = now.getMinutes(),
		sec = now.getSeconds(),
		pe = "&nbspAM";

	if(hou==0){
		hou=12;
	}
	if(hou>12){
		hou=hou-12;
		pe="&nbspPM";
	}

	/*補0*/
	Number.prototype.pad = function(digits){
		for(var n=this.toString(); n.length < digits; n = 0+n);
		return n;
	}


	document.getElementById("month").innerHTML = months[mo];
	document.getElementById("daynum").innerHTML = dnum.pad(2);
	document.getElementById("year").innerHTML = yr;
	document.getElementById("hour").innerHTML = hou.pad(2);
	document.getElementById("minutes").innerHTML = ":"+min.pad(2);
	document.getElementById("seconds").innerHTML = ":"+sec.pad(2);
	document.getElementById("period").innerHTML = pe;

}

function initClock(){
updateClock();

setInterval(updateClock, 1000);
}

var dataLength;
var now; //今天
var fromDate;//開始日期
var toDate;//結束日期

async function dataGet(url) { 
	const response = await fetch(url);
	const values = await response.json();
	return values;}


// // document.getElementById("btn_addRD").addEventListener("click", function() {
// // 	bottom = "add"
// // });

let bottom
document.getElementById("btn_updateEditRD").addEventListener("click", function() {
	bottom = "addupdate"
	// hideEdit()
});
document.getElementById("btn_deleteEditRD").addEventListener("click", function() {
	bottom = "delete"
	// hideEdit()
});


async function dataPost(form, url) {//提交表單
	// document.getElementById("btn_updateEditRD").addEventListener("click", function() {
	// 	bottom = "addupdate"
	// 	// hideEdit()
	// });
	// document.getElementById("btn_deleteEditRD").addEventListener("click", function() {
	// 	bottom = "delete"
	// 	// hideEdit()
	// });
	return new Promise((resolve, reject) => {
		$(form).off('submit').submit(function (e) {
			e.preventDefault();
			// console.log('POST')
			// console.log(23232)
			// console.log(777, typeof($(form).serialize()),$(form).serialize())
			// console.log(5454)
			// console.log(111,$(this))
			let data = $(this).serialize()
			// console.log(555,data)
			// console.log(222,typeof(data),data)
			// data["bottom"] = bottom
			data = `${data}&bottom=${bottom}`
			// console.log(333,typeof(data),data)
			// console.log(777, bottom)
			$.ajax({
				type: 'POST',
				url: url,
				// data: $(this).serialize()
				// data["bottom"] = bottom
				data: data,
				success: function (data) {
					console.log("post success")
					resolve(data);
					hideEdit();//隱藏編輯框
					dataTable();//重新讀取更新表單
				},
				error: function (error) {
					reject(error);
				},
			});
		});
	});
}

/*async function dataDelete(url) {
	return new Promise((resolve, reject) => {
	var ID= $('#eRDNum').val();
	  $.ajax({
		type: 'DELETE', // Specify the HTTP method as DELETE
		url: url+ID,
		//type:'POST',
		//data:{_method:"DELETE"},
		//dataType:"json",
		success: function(result) {
		//   table.ajax.reload();
		},
		error: function(error) {
		  reject(error);
		},
	  });
	});
  }*/

async function readPass(){ //讀密碼限制
	var setting = await dataGet('/account/system/passwordsetting/');
    // console.log(setting);
	$('#minTotal').val(setting[0].minTotal);
	$('#maxTotal').val(setting[0].maxTotal);
	$('#minNum').val(setting[0].minNum);
	$('#minUpper').val(setting[0].minUpper);
	$('#minLower').val(setting[0].minLower);
	$('#minSpe').val(setting[0].minSpe);
}
async function readForbid(){ //讀停權設置
	var setting = await dataGet('/account/system/banrule/');
	// console.log(setting)
	$('#wrongNum').val(setting[0].wrongNum);
	$('#forbidTime').val(setting[0].forbidTime);
}
async function readText(){ //讀密碼限制
	var setting = await dataGet('/account/system/logintext/');
	$('#logintext').val(setting[0].logintext);
}


async function dataTable(){
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
		sEmptyTable: "輸入篩選條件查詢資料",
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

		var dataset = await dataGet('/account/system/accounts');//端口要改
        console.log(dataset);
			
			dataLength = dataset.length; 
			

			$('#myTable').DataTable({
		
		
				destroy: true,
				language: lang, //提示資訊
				autoWidth: false, //禁用自動調整列寬
				// stripeClasses: [], //為奇偶行加上樣式，相容不支援CSS偽類的場合
				processing: false, //隱藏載入提示,自行處理
				//serverSide: true, //啟用伺服器端分頁
				searching: false, //禁用原生搜尋
				orderMulti: false, //啟用多列排序
				ordering: false, //取消預設排序查詢,否則核取方塊一列會出現小箭頭
				//renderer: "bootstrap", //渲染樣式：Bootstrap和jquery-ui
				paging: false,
				//pagingType: "simple_numbers", //分頁樣式：simple,simple_numbers,full,full_numbers
				responsive: true,
				//lengthMenu: [[20, 50, -1], [20, 50, "All"]], //顯示筆數設定 預設為[10, 25, 50, 100]
    			pageLength:'20',// 預設為'10'，若需更改初始每頁顯示筆數，才需設定
		
		
				"data": dataset,
				"columns": [
					{data:"employeeno"},
					{data:"name"},
					{data:"company"},
					{data:"department"},
					{data:"email"},
					{data:"permission",
                    render:  function (data, type, row) {
						if(data==="admin"){
                            return '最高權限'
                        } else if (data==="manager"){
                            return '管理者'
                        } else if (data==="viewer"){
                            return '一般用戶'
                        } else {
                            return ''
                        }
                    }},
					{data:"status",
                    render:  function (data, type, row) {
						if(data==="activate"){ // normal
                            return '正常'
                        } else if (data==="deactivate"){ //lock
                            return '停用'
                        } else {
                            return ''
                        }
                    }
                },
					{data:"note"},
					{
					render:  function (data, type, row) {
						var encodedRow = encodeURIComponent(JSON.stringify(row));
						return '<button onclick="showEdit(decodeURIComponent(\'' + encodedRow + '\'))"><img src="../public/images/edit.svg" style="width: 20px"></button>';},
					}
				]
		
			})

			}
		
/*告警總數*/
/*跟後端拿告警資料*/ 
// var realtime;
// var realLength;


// function totalWarning(n){
// 	$("#warningNumber").remove();
// 	if(realLength>99){
// 		$("#warningButton").append('<p class="warningNumber">99+</p>');
// 	}
// 	else if(realLength === undefined){
// 		return;
// 	}
// 	else{
// 		$("#warningButton").append('<p class="warningNumber">'+n+'</p>')
// 	};	
// } 

/*編輯框*/
function hideEdit(){
	$('#accountForm').off('submit');
	$('#edit').removeClass('appear');
}

function showEdit(encodedRow) {
	var rowData = JSON.parse(decodeURIComponent(encodedRow));

    // Now rowData should have the correct structure, and you can access rowData.id
    // Populate input fields with data from the selected row
    $('#eRDNum').val(rowData.employeeno);
    $('#eRDName').val(rowData.name);
    $('#eRDCom').val(rowData.company);
    $('#eRDDep').val(rowData.department);
    $('#eRDMail').val(rowData.email);
	$('#eRDMail').prop("readonly",true);//信箱不可更改，資料庫以信箱為登入指標
    $('#eRDAuth').val(rowData.permission);
    $('#eRDStatus').val(rowData.status);
	$('#eRDNote').val(rowData.note);
	$('#editTitle').text('編輯帳戶');
	$('#btn_deleteEditRD').css('display','inline-block'); 
	$('#btn_updateEditRD').text('確認修改');
	$('#eRDPass').val('');



    // Show the edit block
    $('#edit').addClass('appear');

}

function addUser(){
	$('#eRDNum').val('');
    $('#eRDName').val('');
    $('#eRDCom').val('');
    $('#eRDDep').val('');
    $('#eRDMail').val('');
	$('#eRDMail').prop("readonly",false);
    $('#eRDAuth').val('');
    $('#eRDStatus').val('');
	$('#eRDNote').val('');
	$('#editTitle').text('新增帳戶');
	$('#btn_deleteEditRD').css('display','none'); //隱藏刪除按鈕
	$('#btn_updateEditRD').text('確認新增');
	$('#eRDPass').val('');
    // Show the edit block
    $('#edit').addClass('appear');
}


