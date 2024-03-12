// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";
var permission = "manager";
$(document).ready(function () {
  console.log("start reading js");
  classAdd("#nB_Mode","default_nB");
});


const scheduleSW = document.querySelector(".scheduleSwitch #switch_SchdOnOff");
scheduleSW.addEventListener("click", toggleScheduleSW);
function toggleScheduleSW() {
    if (scheduleSW.textContent === "OFF") {
        scheduleSW.style.animation = "scheduleSW_On 1s"
        scheduleSW.style.left = "36px";
        scheduleSW.style.background = "#236E37";
        scheduleSW.textContent = "ON";
    }
    else {
        scheduleSW.style.animation = "scheduleSW_Off 1s"
        scheduleSW.style.left = "2px";
        scheduleSW.style.background = "#FF0000";
        scheduleSW.textContent = "OFF";
    }
}

/////////////////////////////////////////////////////////////////////////

const window_setSchdToday = document.querySelector(".setSchedule.today");
// const title_setSchdToday = document.querySelector(".setSchedule.today .titlePUW");
// const option1_setSchdToday = document.querySelector(".setSchedule.today #option_1");
// const option2_setSchdToday = document.querySelector(".setSchedule.today #option_2");
const radioOption1_Today = document.querySelector(".setSchedule.today #radioOpt_1_today");
const radioOption2_Today = document.querySelector(".setSchedule.today #radioOpt_2_today");
const radioOption3_Today = document.querySelector(".setSchedule.today #radioOpt_3_today");
const alertInfo_setSchdToday = document.querySelector(".setSchedule.today .alertInfo");
let qSelectAll_temp_0_1;
let qSelectAll_temp_0_2;
let i;
const schdStatusToday_1 = document.querySelector(".block_temp #schdStatusToday_1");
const schdStatusToday_2 = document.querySelector(".block_temp #schdStatusToday_2");
let schdStatus_1_temp;
let schdStatus_2_temp;

function clearCheckedRO_Today() {
    // radioOption1_Today.checked = false;
    // radioOption2_Today.checked = false;
    radioOption3_Today.checked = true;
}

const setBut_SchdToday = document.querySelector(".schedule #setBut_SchdToday")
setBut_SchdToday.addEventListener("click", Set_SchdToday);
function Set_SchdToday() {
    window_setSchdToday.classList.add("appear");
    clearCheckedRO_Today();
    // title_setSchdToday.textContent = "今日得標設定";
}

radioOption1_Today.addEventListener("change", winBidAllDay_Today);
function winBidAllDay_Today() {
    qSelectAll_temp_0_1 = document.querySelectorAll(".setSchedule.today .timePeriod");
    for (i = 0; i < qSelectAll_temp_0_1.length; i++) {
        qSelectAll_temp_0_1[i].classList.remove("setTo0");
    }

    qSelectAll_temp_0_2 = document.querySelectorAll(".block_temp .chkBox_TP_0");
    for (i = 0; i < qSelectAll_temp_0_2.length; i++) {
        qSelectAll_temp_0_2[i].checked = true;
    }
}

radioOption2_Today.addEventListener("change", winNoBidAllDay_Today);
function winNoBidAllDay_Today() {
    qSelectAll_temp_0_1 = document.querySelectorAll(".setSchedule.today .timePeriod");
    for (i = 0; i < qSelectAll_temp_0_1.length; i++) {
        qSelectAll_temp_0_1[i].classList.add("setTo0");
    }

    qSelectAll_temp_0_2 = document.querySelectorAll(".block_temp .chkBox_TP_0");
    for (i = 0; i < qSelectAll_temp_0_2.length; i++) {
        qSelectAll_temp_0_2[i].checked = false;
    }
}

const TP_0_00 = document.querySelector(".setSchedule.today #TP_0_00")
TP_0_00.addEventListener("click", Toggle_TP_0_00);
function Toggle_TP_0_00() {
    TP_0_00.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_01 = document.querySelector(".setSchedule.today #TP_0_01")
TP_0_01.addEventListener("click", Toggle_TP_0_01);
function Toggle_TP_0_01() {
    TP_0_01.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_02 = document.querySelector(".setSchedule.today #TP_0_02")
TP_0_02.addEventListener("click", Toggle_TP_0_02);
function Toggle_TP_0_02() {
    TP_0_02.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_03 = document.querySelector(".setSchedule.today #TP_0_03")
TP_0_03.addEventListener("click", Toggle_TP_0_03);
function Toggle_TP_0_03() {
    TP_0_03.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_04 = document.querySelector(".setSchedule.today #TP_0_04")
TP_0_04.addEventListener("click", Toggle_TP_0_04);
function Toggle_TP_0_04() {
    TP_0_04.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_05 = document.querySelector(".setSchedule.today #TP_0_05")
TP_0_05.addEventListener("click", Toggle_TP_0_05);
function Toggle_TP_0_05() {
    TP_0_05.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_06 = document.querySelector(".setSchedule.today #TP_0_06")
TP_0_06.addEventListener("click", Toggle_TP_0_06);
function Toggle_TP_0_06() {
    TP_0_06.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_07 = document.querySelector(".setSchedule.today #TP_0_07")
TP_0_07.addEventListener("click", Toggle_TP_0_07);
function Toggle_TP_0_07() {
    TP_0_07.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_08 = document.querySelector(".setSchedule.today #TP_0_08")
TP_0_08.addEventListener("click", Toggle_TP_0_08);
function Toggle_TP_0_08() {
    TP_0_08.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_09 = document.querySelector(".setSchedule.today #TP_0_09")
TP_0_09.addEventListener("click", Toggle_TP_0_09);
function Toggle_TP_0_09() {
    TP_0_09.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_10 = document.querySelector(".setSchedule.today #TP_0_10")
TP_0_10.addEventListener("click", Toggle_TP_0_10);
function Toggle_TP_0_10() {
    TP_0_10.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_11 = document.querySelector(".setSchedule.today #TP_0_11")
TP_0_11.addEventListener("click", Toggle_TP_0_11);
function Toggle_TP_0_11() {
    TP_0_11.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_12 = document.querySelector(".setSchedule.today #TP_0_12")
TP_0_12.addEventListener("click", Toggle_TP_0_12);
function Toggle_TP_0_12() {
    TP_0_12.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_13 = document.querySelector(".setSchedule.today #TP_0_13")
TP_0_13.addEventListener("click", Toggle_TP_0_13);
function Toggle_TP_0_13() {
    TP_0_13.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_14 = document.querySelector(".setSchedule.today #TP_0_14")
TP_0_14.addEventListener("click", Toggle_TP_0_14);
function Toggle_TP_0_14() {
    TP_0_14.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_15 = document.querySelector(".setSchedule.today #TP_0_15")
TP_0_15.addEventListener("click", Toggle_TP_0_15);
function Toggle_TP_0_15() {
    TP_0_15.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_16 = document.querySelector(".setSchedule.today #TP_0_16")
TP_0_16.addEventListener("click", Toggle_TP_0_16);
function Toggle_TP_0_16() {
    TP_0_16.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_17 = document.querySelector(".setSchedule.today #TP_0_17")
TP_0_17.addEventListener("click", Toggle_TP_0_17);
function Toggle_TP_0_17() {
    TP_0_17.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_18 = document.querySelector(".setSchedule.today #TP_0_18")
TP_0_18.addEventListener("click", Toggle_TP_0_18);
function Toggle_TP_0_18() {
    TP_0_18.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_19 = document.querySelector(".setSchedule.today #TP_0_19")
TP_0_19.addEventListener("click", Toggle_TP_0_19);
function Toggle_TP_0_19() {
    TP_0_19.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_20 = document.querySelector(".setSchedule.today #TP_0_20")
TP_0_20.addEventListener("click", Toggle_TP_0_20);
function Toggle_TP_0_20() {
    TP_0_20.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_21 = document.querySelector(".setSchedule.today #TP_0_21")
TP_0_21.addEventListener("click", Toggle_TP_0_21);
function Toggle_TP_0_21() {
    TP_0_21.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_22 = document.querySelector(".setSchedule.today #TP_0_22")
TP_0_22.addEventListener("click", Toggle_TP_0_22);
function Toggle_TP_0_22() {
    TP_0_22.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

const TP_0_23 = document.querySelector(".setSchedule.today #TP_0_23")
TP_0_23.addEventListener("click", Toggle_TP_0_23);
function Toggle_TP_0_23() {
    TP_0_23.classList.toggle("setTo0");
    radioOption3_Today.checked = true;
}

function calc_SchdStatusToday() {
    qSelectAll_temp_0_1 = document.querySelectorAll(".block_temp .chkBox_TP_0");

    schdStatus_1_temp = 0;
    for (i = 0; i < 16; i++) {
        if (qSelectAll_temp_0_1[i].checked === true) {
            schdStatus_1_temp += Number(qSelectAll_temp_0_1[i].value);
        }
    }
    schdStatusToday_1.textContent = schdStatus_1_temp;

    schdStatus_2_temp = 0;
    for (i = 16; i < 24; i++) {
        if (qSelectAll_temp_0_1[i].checked === true) {
            schdStatus_2_temp += Number(qSelectAll_temp_0_1[i].value);
        }
    }
    schdStatusToday_2.textContent = schdStatus_2_temp;
}

const closeWB_Yes_setSchdToday = document.querySelector(".setSchedule.today #closeWB_Yes");
closeWB_Yes_setSchdToday.addEventListener("click", closePopup_setSchdToday_Yes);
function closePopup_setSchdToday_Yes() {
    calc_SchdStatusToday();
    window_setSchdToday.classList.remove("appear");
}

const closeWB_No_setSchdToday = document.querySelector(".setSchedule.today #closeWB_No");
closeWB_No_setSchdToday.addEventListener("click", closePopup_setSchdToday_No);
function closePopup_setSchdToday_No() {
    window_setSchdToday.classList.remove("appear");
}

/////////////////////////////////////////////////////////////////////////

const window_setSchdTomorrow = document.querySelector(".setSchedule.tomorrow");
// const title_setSchdTomorrow = document.querySelector(".setSchedule.tomorrow .titlePUW");
// const option1_setSchdTomorrow = document.querySelector(".setSchedule.tomorrow #option_1");
// const option2_setSchdTomorrow = document.querySelector(".setSchedule.tomorrow #option_2");
const radioOption1_Tomorrow = document.querySelector(".setSchedule.tomorrow #radioOpt_1_tomorrow");
const radioOption2_Tomorrow = document.querySelector(".setSchedule.tomorrow #radioOpt_2_tomorrow");
const radioOption3_Tomorrow = document.querySelector(".setSchedule.tomorrow #radioOpt_3_tomorrow");
const alertInfo_setSchdTomorrow = document.querySelector(".setSchedule.tomorrow .alertInfo");
let qSelectAll_temp_1_1;
let qSelectAll_temp_1_2;
const schdStatusTomorrow_1 = document.querySelector(".block_temp #schdStatusTomorrow_1");
const schdStatusTomorrow_2 = document.querySelector(".block_temp #schdStatusTomorrow_2");

function clearCheckedRO_Tomorrow() {
    // radioOption1_Tomorrow.checked = false;
    // radioOption2_Tomorrow.checked = false;
    radioOption3_Tomorrow.checked = true;
}

const setBut_SchdTomorrow = document.querySelector(".schedule #setBut_SchdTomorrow")
setBut_SchdTomorrow.addEventListener("click", Set_SchdTomorrow);
function Set_SchdTomorrow() {
    window_setSchdTomorrow.classList.add("appear");
    clearCheckedRO_Tomorrow();
    // title_setSchdTomorrow.textContent = "明日得標設定";
}

radioOption1_Tomorrow.addEventListener("change", winBidAllDay_Tomorrow);
function winBidAllDay_Tomorrow() {
    qSelectAll_temp_1_1 = document.querySelectorAll(".setSchedule.tomorrow .timePeriod");
    for (i = 0; i < qSelectAll_temp_1_1.length; i++) {
        qSelectAll_temp_1_1[i].classList.remove("setTo0");
    }

    qSelectAll_temp_1_2 = document.querySelectorAll(".block_temp .chkBox_TP_1");
    for (i = 0; i < qSelectAll_temp_1_2.length; i++) {
        qSelectAll_temp_1_2[i].checked = true;
    }
}

radioOption2_Tomorrow.addEventListener("change", winNoBidAllDay_Tomorrow);
function winNoBidAllDay_Tomorrow() {
    qSelectAll_temp_1_1 = document.querySelectorAll(".setSchedule.tomorrow .timePeriod");
    for (i = 0; i < qSelectAll_temp_1_1.length; i++) {
        qSelectAll_temp_1_1[i].classList.add("setTo0");
    }

    qSelectAll_temp_1_2 = document.querySelectorAll(".block_temp .chkBox_TP_1");
    for (i = 0; i < qSelectAll_temp_1_2.length; i++) {
        qSelectAll_temp_1_2[i].checked = false;
    }
}

const TP_1_00 = document.querySelector(".setSchedule.tomorrow #TP_1_00")
TP_1_00.addEventListener("click", Toggle_TP_1_00);
function Toggle_TP_1_00() {
    TP_1_00.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_01 = document.querySelector(".setSchedule.tomorrow #TP_1_01")
TP_1_01.addEventListener("click", Toggle_TP_1_01);
function Toggle_TP_1_01() {
    TP_1_01.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_02 = document.querySelector(".setSchedule.tomorrow #TP_1_02")
TP_1_02.addEventListener("click", Toggle_TP_1_02);
function Toggle_TP_1_02() {
    TP_1_02.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_03 = document.querySelector(".setSchedule.tomorrow #TP_1_03")
TP_1_03.addEventListener("click", Toggle_TP_1_03);
function Toggle_TP_1_03() {
    TP_1_03.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_04 = document.querySelector(".setSchedule.tomorrow #TP_1_04")
TP_1_04.addEventListener("click", Toggle_TP_1_04);
function Toggle_TP_1_04() {
    TP_1_04.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_05 = document.querySelector(".setSchedule.tomorrow #TP_1_05")
TP_1_05.addEventListener("click", Toggle_TP_1_05);
function Toggle_TP_1_05() {
    TP_1_05.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_06 = document.querySelector(".setSchedule.tomorrow #TP_1_06")
TP_1_06.addEventListener("click", Toggle_TP_1_06);
function Toggle_TP_1_06() {
    TP_1_06.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_07 = document.querySelector(".setSchedule.tomorrow #TP_1_07")
TP_1_07.addEventListener("click", Toggle_TP_1_07);
function Toggle_TP_1_07() {
    TP_1_07.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_08 = document.querySelector(".setSchedule.tomorrow #TP_1_08")
TP_1_08.addEventListener("click", Toggle_TP_1_08);
function Toggle_TP_1_08() {
    TP_1_08.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_09 = document.querySelector(".setSchedule.tomorrow #TP_1_09")
TP_1_09.addEventListener("click", Toggle_TP_1_09);
function Toggle_TP_1_09() {
    TP_1_09.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_10 = document.querySelector(".setSchedule.tomorrow #TP_1_10")
TP_1_10.addEventListener("click", Toggle_TP_1_10);
function Toggle_TP_1_10() {
    TP_1_10.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_11 = document.querySelector(".setSchedule.tomorrow #TP_1_11")
TP_1_11.addEventListener("click", Toggle_TP_1_11);
function Toggle_TP_1_11() {
    TP_1_11.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_12 = document.querySelector(".setSchedule.tomorrow #TP_1_12")
TP_1_12.addEventListener("click", Toggle_TP_1_12);
function Toggle_TP_1_12() {
    TP_1_12.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_13 = document.querySelector(".setSchedule.tomorrow #TP_1_13")
TP_1_13.addEventListener("click", Toggle_TP_1_13);
function Toggle_TP_1_13() {
    TP_1_13.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_14 = document.querySelector(".setSchedule.tomorrow #TP_1_14")
TP_1_14.addEventListener("click", Toggle_TP_1_14);
function Toggle_TP_1_14() {
    TP_1_14.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_15 = document.querySelector(".setSchedule.tomorrow #TP_1_15")
TP_1_15.addEventListener("click", Toggle_TP_1_15);
function Toggle_TP_1_15() {
    TP_1_15.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_16 = document.querySelector(".setSchedule.tomorrow #TP_1_16")
TP_1_16.addEventListener("click", Toggle_TP_1_16);
function Toggle_TP_1_16() {
    TP_1_16.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_17 = document.querySelector(".setSchedule.tomorrow #TP_1_17")
TP_1_17.addEventListener("click", Toggle_TP_1_17);
function Toggle_TP_1_17() {
    TP_1_17.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_18 = document.querySelector(".setSchedule.tomorrow #TP_1_18")
TP_1_18.addEventListener("click", Toggle_TP_1_18);
function Toggle_TP_1_18() {
    TP_1_18.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_19 = document.querySelector(".setSchedule.tomorrow #TP_1_19")
TP_1_19.addEventListener("click", Toggle_TP_1_19);
function Toggle_TP_1_19() {
    TP_1_19.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_20 = document.querySelector(".setSchedule.tomorrow #TP_1_20")
TP_1_20.addEventListener("click", Toggle_TP_1_20);
function Toggle_TP_1_20() {
    TP_1_20.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_21 = document.querySelector(".setSchedule.tomorrow #TP_1_21")
TP_1_21.addEventListener("click", Toggle_TP_1_21);
function Toggle_TP_1_21() {
    TP_1_21.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_22 = document.querySelector(".setSchedule.tomorrow #TP_1_22")
TP_1_22.addEventListener("click", Toggle_TP_1_22);
function Toggle_TP_1_22() {
    TP_1_22.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

const TP_1_23 = document.querySelector(".setSchedule.tomorrow #TP_1_23")
TP_1_23.addEventListener("click", Toggle_TP_1_23);
function Toggle_TP_1_23() {
    TP_1_23.classList.toggle("setTo0");
    radioOption3_Tomorrow.checked = true;
}

function calc_SchdStatusTomorrow() {
    qSelectAll_temp_1_1 = document.querySelectorAll(".block_temp .chkBox_TP_1");

    schdStatus_1_temp = 0;
    for (i = 0; i < 16; i++) {
        if (qSelectAll_temp_1_1[i].checked === true) {
            schdStatus_1_temp += Number(qSelectAll_temp_1_1[i].value);
        }
    }
    schdStatusTomorrow_1.textContent = schdStatus_1_temp;

    schdStatus_2_temp = 0;
    for (i = 16; i < 24; i++) {
        if (qSelectAll_temp_1_1[i].checked === true) {
            schdStatus_2_temp += Number(qSelectAll_temp_1_1[i].value);
        }
    }
    schdStatusTomorrow_2.textContent = schdStatus_2_temp;
}

const closeWB_Yes_setSchdTomorrow = document.querySelector(".setSchedule.tomorrow #closeWB_Yes");
closeWB_Yes_setSchdTomorrow.addEventListener("click", closePopup_setSchdTomorrow_Yes);
function closePopup_setSchdTomorrow_Yes() {
    calc_SchdStatusTomorrow();
    window_setSchdTomorrow.classList.remove("appear");
}

const closeWB_No_setSchdTomorrow = document.querySelector(".setSchedule.tomorrow #closeWB_No");
closeWB_No_setSchdTomorrow.addEventListener("click", closePopup_setSchdTomorrow_No);
function closePopup_setSchdTomorrow_No() {
    window_setSchdTomorrow.classList.remove("appear");
}

/////////////////////////////////////////////////////////////////////////

const window_socRef = document.querySelector(".socRef");
const title_socRef = document.querySelector(".socRef .titlePUW");

const getBut_refSOCToday = document.querySelector(".schedule #setBut_refSOCToday")
getBut_refSOCToday.addEventListener("click", Get_refSOCToday);
function Get_refSOCToday() {
    window_socRef.classList.add("appear");
    window_socRef.classList.remove("tomorrow");
    title_socRef.textContent = "今日SOC參考值 (%)";
}

const getBut_refSOCTomorrow = document.querySelector(".schedule #setBut_refSOCTomorrow")
getBut_refSOCTomorrow.addEventListener("click", Get_refSOCTomorrow);
function Get_refSOCTomorrow() {
    window_socRef.classList.add("appear", "tomorrow");
    title_socRef.textContent = "明日SOC參考值 (%)";
}

const closeWB_socRef = document.querySelector(".socRef #closeWB_No");
closeWB_socRef.addEventListener("click", closePopup_socRef);
function closePopup_socRef() {
    window_socRef.classList.remove("appear", "tomorrow");
}