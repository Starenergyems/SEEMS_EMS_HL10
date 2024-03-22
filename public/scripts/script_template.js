// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

let schedule_01 = setInterval(updateDateTime, 100);
function updateDateTime() {
    const dateTime = document.querySelector(".dateTime_Username #dateTime_Now");
    let rawDateTime = new Date();
    let yy = rawDateTime.getFullYear();
    let mm = String(rawDateTime.getMonth() + 1).padStart(2, '0');
    let dd = String(rawDateTime.getDate()).padStart(2, '0');
    let hh = String(rawDateTime.getHours()).padStart(2, '0');
    let m = String(rawDateTime.getMinutes()).padStart(2, '0');
    let ss = String(rawDateTime.getSeconds()).padStart(2, '0');
    dateTime.textContent = yy + "/" + mm + "/" + dd + " " + hh + ":" + m + ":" + ss;
}

const account_NavBar = document.querySelector(".T_Main .accountNavBar");

const user_Account = document.querySelector(".T_Main #userAccount");
user_Account.addEventListener("click", showHide_accNavBar);
function showHide_accNavBar() {
    account_NavBar.classList.toggle("appear");
}

document.addEventListener("click", hide_accNavBar);
function hide_accNavBar(clickItem) {
    if ((clickItem.target.id !== "userAccount") && (clickItem.target.id !== "accNB_01") && (clickItem.target.id !== "accNB_02") && (clickItem.target.id !== "accNB_03")) {
        account_NavBar.classList.remove("appear");
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const sumAlarm_EachArea = document.querySelector(".systemStatus .sumAlarm_EachArea");
const sumWarning_EachArea = document.querySelector(".systemStatus .sumWarning_EachArea");

const dDL_sumAlarmNum = document.querySelector(".systemStatus #dD_Logo_sumAlarmNum");
dDL_sumAlarmNum.addEventListener("click", showHide_sumAlarm_EA);
function showHide_sumAlarm_EA() {
    sumAlarm_EachArea.classList.toggle("appear");
    sumWarning_EachArea.classList.remove("appear");
}

const dDL_sumWarningNum = document.querySelector(".systemStatus #dD_Logo_sumWarningNum");
dDL_sumWarningNum.addEventListener("click", showHide_sumWarning_EA);
function showHide_sumWarning_EA() {
    sumWarning_EachArea.classList.toggle("appear");
    sumAlarm_EachArea.classList.remove("appear");
}

document.addEventListener("click", hide_sumAW_EachArea);
function hide_sumAW_EachArea(clickItem) {
    if ((clickItem.target.id !== "dD_Logo_sumAlarmNum") && (clickItem.target.id !== "dD_Logo_sumWarningNum")) {
        sumAlarm_EachArea.classList.remove("appear");
        sumWarning_EachArea.classList.remove("appear");
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const window_epo = document.querySelector(".L_Main .epo");

const epoLogo = document.querySelector(".L_Main #epo_Logo");
epoLogo.addEventListener("click", show_epo);
function show_epo() {
    window_epo.classList.add("appear");
}

const closeWB_Yes_epo = document.querySelector(".L_Main .epo #closeWB_Yes");
closeWB_Yes_epo.addEventListener("click", closePopup_epo_Yes);
function closePopup_epo_Yes() {
    window_epo.classList.remove("appear");
}

const closeWB_No_epo = document.querySelector(".L_Main .epo #closeWB_No");
closeWB_No_epo.addEventListener("click", closePopup_epo_No);
function closePopup_epo_No() {
    window_epo.classList.remove("appear");
}

///////////////////////////////////////////////////////////////////////////////////////////////////

async function get_dSS_Data_WhenClicking(dataName, numInDataGroup) {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/get_dSS_Data_WhenClicking", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataName, numInDataGroup }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function set_dSS_Data(setValue) {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/set_dSS_Data", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ setValue }),
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

async function get_dVS_Data_WhenClicking(dataName, numInDataGroup) {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/get_dVS_Data_WhenClicking", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataName, numInDataGroup }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function set_dVS_Data(setValue) {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/set_dVS_Data", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ setValue }),
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

async function getData(url) { //跟後端拿資料
    const response = await fetch(url);
    const values = await response.json();
    return values;
}

async function dataPost(url, input1, input2, input3, input4) {//提交資料給後端並更新表格

    console.log('開始嘗試POST')

    $.ajax({
        type: 'POST',
        url: url,
        data: { input1, input2, input3, input4 },
        success: function (response) {
            console.log("POST完成")
            updateTable_post(response)//更新表格
        },
        error: function (error) {
            reject(error);
        },
    });


}

function createIndex(tableID) {//幫TABLE產出新的index
    var table = $(tableID).DataTable();
    //var histLength = table.rows().count();

    table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
    });
}
//增加CLASS
function classAdd(element, className) {
    $(element).addClass(className);
}

//刪除CLASS
function classRemove(element, className) {
    $(element).removeClass(className);
}

async function updateNavbar(url='/navbar') { //刷新側欄
    var data = await getData(url);
    console.log('navbar:', data);
    
    $('#userAccount').text(data.latestValues.userAccount);
    $('#totalAlarmNum').text(data.latestValues.totalAlarmNum);
    $('#AlarmNum_Sys').text(data.latestValues.AlarmNum_Sys);
    $('#AlarmNum_Bat').text(data.latestValues.AlarmNum_Bat);
    $('#AlarmNum_PCS').text(data.latestValues.AlarmNum_PCS);
    $('#AlarmNum_FF').text(data.latestValues.AlarmNum_FF);
    $('#AlarmNum_Env').text(data.latestValues.AlarmNum_Env);
    $('#AlarmNum_Meter').text(data.latestValues.AlarmNum_Meter);

    $('#totalWarningNum').text(data.latestValues.totalWarningNum);
    $('#WarningNum_Sys').text(data.latestValues.WarningNum_Sys);
    $('#WarningNum_Bat').text(data.latestValues.WarningNum_Bat);
    $('#WarningNum_PCS').text(data.latestValues.WarningNum_PCS);
    $('#WarningNum_FF').text(data.latestValues.WarningNum_FF);
    $('#WarningNum_Env').text(data.latestValues.WarningNum_Env);
    $('#WarningNum_Meter').text(data.latestValues.WarningNum_Meter);

    /////////////////////////////////////////////////
    $('#L_M_systemMode').text(data.latestValues2.L_M_systemMode);
    $('#L_M_freq').text(data.latestValues2.L_M_freq);
    $('#L_M_activeP').text(data.latestValues2.L_M_activeP);
    $('#L_M_reactiveP').text(data.latestValues2.L_M_reactiveP);
    $('#L_M_voltage').text(data.latestValues2.L_M_voltage);
    $('#L_M_current').text(data.latestValues2.L_M_current);
    $('#L_M_powerFactor').text(data.latestValues2.L_M_powerFactor);

    $('#L_M_avgSOC').text(data.latestValues2.L_M_avgSOC);
    $('#L_M_minSOH').text(data.latestValues2.L_M_minSOH);
    $('#L_M_SBSPM').text(data.latestValues2.L_M_SBSPM);
    $('#L_M_chgEtoday').text(data.latestValues2.L_M_chgEtoday);
    $('#L_M_dcgEtoday').text(data.latestValues2.L_M_dcgEtoday);

}

function routineWork(url='/navbar'){ //持續刷新
    updateData();
    updateNavbar(url);
}

function light_color(data, target, normal_value, green_class, fault_value, red_class){ //燈號變色
    if (data === normal_value){
        $(target).addClass(green_class);
        $(target).removeClass(red_class);
    } else if (data === fault_value){
        $(target).addClass(red_class);
        $(target).removeClass(green_class);
    } else {
        console.log(target, "light status error, should be", normal_value, "or", fault_value);
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
function assign_TextContent_To_SpID(SpID, assignContent) {
    const element = document.querySelector(SpID);
    element.textContent = assignContent;
}

// let i;

function assign_ClassD_to_StatusOfDL_with_SpID(SpID, classData, classCollection) {
    const element = document.querySelector(SpID);

    for (let i = 0; i < classCollection.length; i++) {
        if (classCollection[i] === classData) {
            element.classList.add(classData);
        } else {
            element.classList.remove(classCollection[i]);
        }
    }
}

function assign_BitD_to_StatusOfDL_with_SpID(SpID, bitData) {
    const element = document.querySelector(SpID);

    if (bitData === "1") {
        element.classList.add("setToClose");
        element.classList.remove("ErrData");
    } else if (bitData === "0") {
        element.classList.remove("setToClose");
        element.classList.remove("ErrData");
    } else {
        element.classList.remove("setToClose");
        element.classList.add("ErrData");
    }
}

