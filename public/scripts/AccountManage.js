// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";


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
        "name": "Hugo",
        "company": "星佑",
        "department": "EMS",
        "authLevel": "最高權限",
        "accStatus": "正常",
        "note": "最高權限無法移除，可新增人員"
    }, {
        "index": "2",
        "name": "王小明",
        "company": "星佑",
        "department": "EMS",
        "authLevel": "管理者",
        "accStatus": "正常",
        "note": "可監控系統狀態，及新增一般用戶"
    }, {
        "index": "3",
        "name": "陳小美",
        "company": "星佑",
        "department": "專案",
        "authLevel": "一般用戶",
        "accStatus": "停用",
        "note": "無法登入系統，直到被解除停用狀態"
    }, {
        "index": "4",
        "name": "林小花",
        "company": "泓德",
        "department": "資訊",
        "authLevel": "一般用戶",
        "accStatus": "異常",
        "note": "僅可查看系統狀態，無法控制"
    }];

    $('#accountTable').DataTable({

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
            { data: "name" },
            { data: "company" },
            { data: "department" },
            { data: "authLevel" },
            { data: "accStatus" },
            { data: "note" },
            { data: "index", render: function (data, type, row) { return '<button class="btn_Edit" id="btn_Edit_' + data + '">編輯</button>' } },
        ],
        "columnDefs": [
            { targets: [1], className: 'col_01', },
            { targets: [2], className: 'col_02', },
            { targets: [3], className: 'col_03', },
            { targets: [4], className: 'col_04', },
            { targets: [5], className: 'col_05', },
            { targets: [7], className: 'col_07', },
        ]

    })

});

/////////////////////////////////////////////////////////////////////////

const companyNavBar = document.querySelector(".addEditAccount .companyNavBar");
const authLevelNavBar = document.querySelector(".addEditAccount .authLevelNavBar");
const statusNavBar = document.querySelector(".addEditAccount .statusNavBar");

const dDL_accCompany = document.querySelector(".addEditAccount #dDL_accCompany");
dDL_accCompany.addEventListener("click", showHide_companyNB);
function showHide_companyNB() {
    companyNavBar.classList.toggle("appear");
    authLevelNavBar.classList.remove("appear");
    statusNavBar.classList.remove("appear");
}

const dDL_accAuthLevel = document.querySelector(".addEditAccount #dDL_accAuthLevel");
dDL_accAuthLevel.addEventListener("click", showHide_authLevelNB);
function showHide_authLevelNB() {
    authLevelNavBar.classList.toggle("appear");
    companyNavBar.classList.remove("appear");
    statusNavBar.classList.remove("appear");
}

const dDL_accStatus = document.querySelector(".addEditAccount #dDL_accStatus");
dDL_accStatus.addEventListener("click", showHide_statusNB);
function showHide_statusNB() {
    statusNavBar.classList.toggle("appear");
    companyNavBar.classList.remove("appear");
    authLevelNavBar.classList.remove("appear");
}

const accCompany = document.querySelector(".addEditAccount #accCompany");
const accAuthLevel = document.querySelector(".addEditAccount #accAuthLevel");
const accStatus = document.querySelector(".addEditAccount #accStatus");

document.addEventListener("click", hide_accNavBar);
function hide_accNavBar(clickItem) {
    if ((clickItem.target.id !== "dDL_accCompany") && (clickItem.target.id !== "dDL_accAuthLevel") && (clickItem.target.id !== "dDL_accStatus")) {
        if ((clickItem.target.id === "companyNB_01") || (clickItem.target.id === "companyNB_02") || (clickItem.target.id === "companyNB_03")) {
            accCompany.textContent = clickItem.target.textContent;
        } else if ((clickItem.target.id === "authLevelNB_01") || (clickItem.target.id === "authLevelNB_02")) {
            accAuthLevel.textContent = clickItem.target.textContent;
        } else if ((clickItem.target.id === "statusNB_01") || (clickItem.target.id === "statusNB_02") || (clickItem.target.id === "statusNB_03")) {
            accStatus.textContent = clickItem.target.textContent;
        }

        companyNavBar.classList.remove("appear");
        authLevelNavBar.classList.remove("appear");
        statusNavBar.classList.remove("appear");
    }
}

/////////////////////////////////////////////////////////////////////////

const window_addEditAccount = document.querySelector(".addEditAccount");
const title_addEditAccount = document.querySelector(".addEditAccount .titlePUW");
const inputName = document.querySelector(".addEditAccount #inputName");
const inputDepartment = document.querySelector(".addEditAccount #inputDepartment");
const pw_infoName = document.querySelector(".addEditAccount .password .infoName");
const inputPassword = document.querySelector(".addEditAccount #inputPassword");
const id_openBut = document.querySelector(".addEditAccount #id_openBut");

const button_addAccount = document.querySelector("#addAccount");
button_addAccount.addEventListener("click", addNewAccount);
function addNewAccount() {
    window_addEditAccount.classList.add("appear");
    title_addEditAccount.textContent = "新增帳戶";
    inputName.classList.add("appear");
    inputName.value = "";
    accCompany.textContent = "";
    inputDepartment.value = "";
    accAuthLevel.textContent = "一般用戶";
    accStatus.textContent = "正常";
    pw_infoName.textContent = "預設密碼";
    inputPassword.value = "1234";
    id_openBut.textContent = "NewAccount";
}

/////////////////////////////////////////////////////////////////////////

const accName = document.querySelector(".addEditAccount #accName");
let i;
let text_temp;

$(document).ready(function () {
    let qSelectAll_btn_Edit;
    qSelectAll_btn_Edit = document.querySelectorAll(".accountManage .btn_Edit");
    qSelectAll_accName = document.querySelectorAll(".accountManage tbody .col_01");
    qSelectAll_accCompany = document.querySelectorAll(".accountManage tbody .col_02");
    qSelectAll_accDepartment = document.querySelectorAll(".accountManage tbody .col_03");
    qSelectAll_accAuthLevel = document.querySelectorAll(".accountManage tbody .col_04");
    qSelectAll_accStatus = document.querySelectorAll(".accountManage tbody .col_05");

    for (i = 0; i < qSelectAll_btn_Edit.length; i++) {
        qSelectAll_btn_Edit[i].addEventListener("click", editAccount);
    }

    function editAccount(clickBtn) {
        for (i = 0; i < qSelectAll_btn_Edit.length; i++) {
            if (qSelectAll_btn_Edit[i].id === clickBtn.target.id) {
                window_addEditAccount.classList.add("appear");
                title_addEditAccount.textContent = "編輯帳戶";
                inputName.classList.remove("appear");
                accName.textContent = qSelectAll_accName[i].textContent;
                accCompany.textContent = qSelectAll_accCompany[i].textContent;
                inputDepartment.value = qSelectAll_accDepartment[i].textContent;
                accAuthLevel.textContent = qSelectAll_accAuthLevel[i].textContent;
                accStatus.textContent = qSelectAll_accStatus[i].textContent;
                pw_infoName.textContent = "重設密碼";
                inputPassword.value = "";
                id_openBut.textContent = clickBtn.target.id;
            }
        }
    }

    const closeWB_Yes_addEditAccount = document.querySelector(".addEditAccount #closeWB_Yes");
    closeWB_Yes_addEditAccount.addEventListener("click", close_addEditAccount_Yes);
    function close_addEditAccount_Yes() {
        if (id_openBut.textContent === "NewAccount") {
            // alert(5487);
        } else {
            for (i = 0; i < qSelectAll_btn_Edit.length; i++) {
                if (id_openBut.textContent === qSelectAll_btn_Edit[i].id) {
                    // accName.textContent = qSelectAll_accName[i].textContent;
                    qSelectAll_accCompany[i].textContent = accCompany.textContent;
                    qSelectAll_accDepartment[i].textContent = inputDepartment.value;
                    qSelectAll_accAuthLevel[i].textContent = accAuthLevel.textContent;
                    qSelectAll_accStatus[i].textContent = accStatus.textContent;
                }
            }
        }

        id_openBut.textContent = "";
        inputName.classList.remove("appear");
        window_addEditAccount.classList.remove("appear");
    }

    const closeWB_No_addEditAccount = document.querySelector(".addEditAccount #closeWB_No");
    closeWB_No_addEditAccount.addEventListener("click", close_addEditAccount_No);
    function close_addEditAccount_No() {
        id_openBut.textContent = "";
        inputName.classList.remove("appear");
        window_addEditAccount.classList.remove("appear");
    }
});

// let bottom
// // document.getElementById("btn_addRD").addEventListener("click", function() {
// // 	bottom = "add"
// // });
// document.getElementById("btn_updateEditRD").addEventListener("click", function() {
// 	bottom = "addupdate"
//     hideEdit()
	
// });
// document.getElementById("btn_deleteEditRD").addEventListener("click", function() {
// 	bottom = "delete"
//     hideEdit()
// });


