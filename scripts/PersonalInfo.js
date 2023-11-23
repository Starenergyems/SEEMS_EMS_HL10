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
        "Time": "2023/09/01 15:23:10",
        "description": "關閉保護邏輯"
    }, {
        "Time": "2023/09/01 15:22:10",
        "description": "登入EMS系統"
    }, {
        "Time": "2023/09/01 15:13:10",
        "description": "登出EMS系統"
    }, {
        "Time": "2023/09/01 13:23:10",
        "description": "設定今日18:00得標量為5000 kW"
    }, {
        "Time": "2023/09/01 15:22:10",
        "description": "設定今日17:00得標量為6000 kW"
    }, {
        "Time": "2023/09/01 15:13:10",
        "description": "設定今日16:00得標量為8000 kW"
    }, {
        "Time": "2023/09/01 13:23:10",
        "description": "更改使用者密碼"
    }, {
        "Time": "2023/09/01 15:22:10",
        "description": "登入EMS系統"
    }, {
        "Time": "2023/09/01 15:13:10",
        "description": "登出EMS系統"
    }, {
        "Time": "2023/09/01 13:23:10",
        "description": "切離BMS3-1、BMS3-2電池櫃"
    }, {
        "Time": "2023/09/01 15:22:10",
        "description": "關閉保護邏輯"
    }, {
        "Time": "2023/09/01 15:13:10",
        "description": "設定LC1輸出實功為1000 kW"
    }, {
        "Time": "2023/09/01 13:23:10",
        "description": "關閉排程模式"
    }, {
        "Time": "2023/09/01 15:22:10",
        "description": "登入EMS系統"
    }, {
        "Time": "2023/09/01 15:13:10",
        "description": "登出EMS系統"
    }, {
        "Time": "2023/09/01 13:23:10",
        "description": "開啟保護邏輯"
    }, {
        "Time": "2023/09/01 15:22:10",
        "description": "切離ACB1-3"
    }, {
        "Time": "2023/09/01 15:13:10",
        "description": "設定LC2輸出虛功為-500 kVar"
    }, {
        "Time": "2023/09/01 13:23:10",
        "description": "關閉保護邏輯"
    }, {
        "Time": "2023/09/01 15:22:10",
        "description": "登入EMS系統"
    }, {
        "Time": "2023/09/01 15:13:10",
        "description": "登出EMS系統"
    }, {
        "Time": "2023/09/01 13:23:10",
        "description": "更改使用者密碼"
    }, {
        "Time": "2023/09/01 15:22:10",
        "description": "設定LC1輸出實功為1000 kW"
    }];

    $('#opRecordTable').DataTable({

        lengthMenu: [10, 16, 30, 50],
        scrollY: "576px",

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
            { data: "Time" },
            { data: "description" },
        ],
        "columnDefs": [
            { targets: [0], width: "30%", },
            { targets: [1], className: 'text-align-left' }
        ]

    })

});





