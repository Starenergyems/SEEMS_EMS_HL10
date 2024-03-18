// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";
var permission = "manager";
$(document).ready(function () {
    console.log("start reading js");

    classAdd("#nB_Mode", "default_nB");

    routineWork();
});

setInterval(routineWork, 5000);    // ~~~~~~~~~!!!!!!!@@@@@@@@@@###########$$$$$$$$$$$$%%%%%%%%%%%^^^^^^^^^&&&&&&&&&&&************

/////////////////////////////////////////////////////////////////////////

// const scheduleSW = document.querySelector(".scheduleSwitch #switch_SchdOnOff");
// scheduleSW.addEventListener("click", toggleScheduleSW);
// function toggleScheduleSW() {
//     if (scheduleSW.textContent === "OFF") {
//         scheduleSW.style.animation = "scheduleSW_On 1s"
//         scheduleSW.style.left = "36px";
//         scheduleSW.style.background = "#236E37";
//         scheduleSW.textContent = "ON";
//     }
//     else {
//         scheduleSW.style.animation = "scheduleSW_Off 1s"
//         scheduleSW.style.left = "2px";
//         scheduleSW.style.background = "#FF0000";
//         scheduleSW.textContent = "OFF";
//     }
// }

/////////////////////////////////////////////////////////////////////////

const window_setSchedule = document.querySelector(".setScheduleW");
const title_setSchdedule = document.querySelector(".setScheduleW .titlePUW");
const dateOfSchedule = document.querySelector("#schdDate");
let qSelectAll_P_schd;
let qSelectAll_P_cmd;
let qSelectAll_P_schd_set;
let qSelectAll_P_cmd_set;

const setBut_Schdedule = document.querySelector(".schedule #setBut_Schdedule")
setBut_Schdedule.addEventListener("click", Set_Schdedule);
function Set_Schdedule() {
    window_setSchedule.classList.add("appear");
    title_setSchdedule.textContent = `${dateOfSchedule.textContent[0]}日排程設定`;

    qSelectAll_P_schd = document.querySelectorAll(".schedule .P_schd");
    qSelectAll_P_cmd = document.querySelectorAll(".schedule .P_cmd");
    qSelectAll_P_schd_set = document.querySelectorAll(".setScheduleW .P_schd_set");
    qSelectAll_P_cmd_set = document.querySelectorAll(".setScheduleW .P_cmd_set");

    for (i = 0; i < qSelectAll_P_schd.length; i++) {
        qSelectAll_P_schd_set[i].value = qSelectAll_P_schd[i].textContent;
        qSelectAll_P_cmd_set[i].value = qSelectAll_P_cmd[i].textContent;
    }
}

/////////////////////////////////////////////////////////////////////////

const setBut_winAllBid = document.querySelector(".setScheduleW #winAllBid");
const setBut_winNoBid = document.querySelector(".setScheduleW #winNoBid");

setBut_winAllBid.addEventListener("click", Set_WinAllBid);
function Set_WinAllBid() {
    qSelectAll_P_schd_set = document.querySelectorAll(".setScheduleW .P_schd_set");

    for (i = 0; i < qSelectAll_P_schd_set.length; i++) {
        qSelectAll_P_schd_set[i].value = "10.00";
    }
}

setBut_winNoBid.addEventListener("click", Set_WinNoBid);
function Set_WinNoBid() {
    qSelectAll_P_schd_set = document.querySelectorAll(".setScheduleW .P_schd_set");

    for (i = 0; i < qSelectAll_P_schd_set.length; i++) {
        qSelectAll_P_schd_set[i].value = "0.00";
    }
}

/////////////////////////////////////////////////////////////////////////

const closeWB_Yes_setSchedule = document.querySelector(".setScheduleW #closeWB_Yes");
closeWB_Yes_setSchedule.addEventListener("click", closePopup_setSchedule_Yes);
function closePopup_setSchedule_Yes() {





    window_setSchedule.classList.remove("appear");
}

const closeWB_No_setSchedule = document.querySelector(".setScheduleW #closeWB_No");
closeWB_No_setSchedule.addEventListener("click", closePopup_setSchedule_No);
function closePopup_setSchedule_No() {
    window_setSchedule.classList.remove("appear");
}

/////////////////////////////////////////////////////////////////////////

const window_dataStatus_Set = document.querySelector(".dataStatus_Set");
const title_dataStatus_Set = document.querySelector(".dataStatus_Set .titlePUW");
const option1_dataStatus_Set = document.querySelector(".dataStatus_Set #option_1");
const option2_dataStatus_Set = document.querySelector(".dataStatus_Set #option_2");
// const option3_dataStatus_Set = document.querySelector(".dataStatus_Set #option_3");
const radioOption1 = document.querySelector(".dataStatus_Set #radioOpt_1");
const radioOption2 = document.querySelector(".dataStatus_Set #radioOpt_2");
// const radioOption3 = document.querySelector(".dataStatus_Set #radioOpt_3");
const alertInfo_dataStatus_Set = document.querySelector(".dataStatus_Set .alertInfo");
let valNow_dataStatus_Set;
// let valLightNow_dataStatus_Set;
let option1_Description;
let option2_Description;
let optionChecked_dataStatus_Set;

function clearCheckedRadioOption() {
    radioOption1.checked = false;
    radioOption2.checked = false;
}

const setBut_use_P_schd = document.querySelector("#setBut_use_P_schd");
setBut_use_P_schd.addEventListener("click", Set_use_P_schd);
function Set_use_P_schd() {
    title_dataStatus_Set.textContent = "使用排程得標量";
    // valNow_dataStatus_Set = document.querySelector(".infoLC #modeActPas_LC1");
    // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "是";
    option2_dataStatus_Set.textContent = "否";
}

const setBut_use_P_LS = document.querySelector("#setBut_use_P_LS");
setBut_use_P_LS.addEventListener("click", Set_use_P_LS);
function Set_use_P_LS() {
    title_dataStatus_Set.textContent = "使用排程移轉量";
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "是";
    option2_dataStatus_Set.textContent = "否";
}

const setBut_use_SOC_ref = document.querySelector("#setBut_use_SOC_ref");
setBut_use_SOC_ref.addEventListener("click", Set_use_SOC_ref);
function Set_use_SOC_ref() {
    title_dataStatus_Set.textContent = "使用排程SOC參考值";
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "是";
    option2_dataStatus_Set.textContent = "否";
}

const setBut_autoCal_SOC_ideal = document.querySelector("#setBut_autoCal_SOC_ideal");
setBut_autoCal_SOC_ideal.addEventListener("click", Set_autoCal_SOC_ideal);
function Set_autoCal_SOC_ideal() {
    title_dataStatus_Set.textContent = "依排程計算SOC理想值";
    title_dataStatus_Set.style.margin = "25px 11px 0px";
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "是";
    option2_dataStatus_Set.textContent = "否";
}

const setBut_use_MTE_P_96Q = document.querySelector("#setBut_use_MTE_P_96Q");
setBut_use_MTE_P_96Q.addEventListener("click", Set_use_MTE_P_96Q);
function Set_use_MTE_P_96Q() {
    title_dataStatus_Set.textContent = "使用ETP得標量資料";
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "是";
    option2_dataStatus_Set.textContent = "否";
}

const setBut_use_MTE_API = document.querySelector("#setBut_use_MTE_API");
setBut_use_MTE_API.addEventListener("click", Set_use_MTE_API);
function Set_use_MTE_API() {
    title_dataStatus_Set.textContent = "使用ETP移轉量資料";
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "是";
    option2_dataStatus_Set.textContent = "否";
}

const setBut_use_Freq_Cmd = document.querySelector("#setBut_use_Freq_Cmd");
setBut_use_Freq_Cmd.addEventListener("click", Set_use_Freq_Cmd);
function Set_use_Freq_Cmd() {
    title_dataStatus_Set.textContent = "使用ETP頻率目標值";
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "是";
    option2_dataStatus_Set.textContent = "否";
}

const setBut_freqSource = document.querySelector("#setBut_freqSource");
setBut_freqSource.addEventListener("click", Set_freqSource);
function Set_freqSource() {
    title_dataStatus_Set.textContent = "頻率資料來源設定";
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "頻率表";
    option2_dataStatus_Set.textContent = "測試用頻率";
}

/////////////////////////////////////////////////////////////////////////

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
    if ((radioOption1.checked === true) || (radioOption2.checked === true)) {
        optionChecked_dataStatus_Set = document.querySelector(".dataStatus_Set [name=dataStatus]:checked");

        if (optionChecked_dataStatus_Set.value === "1") {
            console.log("qaz123");
            // valNow_dataStatus_Set.textContent = option1_Description;
            // valLightNow_dataStatus_Set.classList.add("setToClose");
        } else if (optionChecked_dataStatus_Set.value === "2") {
            console.log("wsx987");
            // valNow_dataStatus_Set.textContent = option2_Description;
            // valLightNow_dataStatus_Set.classList.remove("setToClose");
        }

        optionChecked_dataStatus_Set.checked = false;
    }
    window_dataStatus_Set.classList.remove("appear");
}

const closeWB_No_dSS = document.querySelector(".dataStatus_Set #closeWB_No");
closeWB_No_dSS.addEventListener("click", closePopup_dSS_No);
function closePopup_dSS_No() {
    radioOption1.checked = false;
    radioOption2.checked = false;
    window_dataStatus_Set.classList.remove("appear");
}

/////////////////////////////////////////////////////////////////////////

const setBut_goToAnotherDay = document.querySelector("#goToAnotherDay");
setBut_goToAnotherDay.addEventListener("click", Go_to_another_day);
async function Go_to_another_day() {
    let getData = await change_dateNumber();
    console.log(getData);

    // dateOfSchedule.textContent = getData.scheduleDate;
    setBut_goToAnotherDay.textContent = getData.KVPairs.goToAnotherDay;

    updateData_Scedule(getData.KVPairs);
    // console.log("點擊時觸發更新");
}

async function change_dateNumber() {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/change_dateNumber", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

/////////////////////////////////////////////////////////////////////////

async function updateData() {                                   // 更新資料 ajax
    var router = window.location.href + "/data";
    var data = await getData(router);
    console.log(data);

    assign_TextContent_To_SpID("#use_P_schd", data.use_P_schd);
    assign_TextContent_To_SpID("#use_P_LS", data.use_P_LS);
    assign_TextContent_To_SpID("#use_SOC_ref", data.use_SOC_ref);
    assign_TextContent_To_SpID("#autoCal_SOC_ideal", data.autoCal_SOC_ideal);
    assign_TextContent_To_SpID("#use_MTE_P_96Q", data.use_MTE_P_96Q);
    assign_TextContent_To_SpID("#use_MTE_API", data.use_MTE_API);
    assign_TextContent_To_SpID("#use_Freq_Cmd", data.use_Freq_Cmd);
    assign_TextContent_To_SpID("#freqSource", data.freqSource);
    assign_TextContent_To_SpID("#Freq_test", data.Freq_test);

    assign_TextContent_To_SpID("#exeCmdInd", data.exeCmdInd);
    assign_TextContent_To_SpID("#exeCmdStatus", data.exeCmdStatus);
    assign_TextContent_To_SpID("#sbyCmdInd", data.sbyCmdInd);
    assign_TextContent_To_SpID("#sbyCmdStatus", data.sbyCmdStatus);
    assign_TextContent_To_SpID("#exeCmd_StartDT", data.exeCmd_StartDT);
    assign_TextContent_To_SpID("#sbyCmd_StartDT", data.sbyCmd_StartDT);
    assign_TextContent_To_SpID("#exeCmd_StopDT", data.exeCmd_StopDT);
    assign_TextContent_To_SpID("#sbyCmd_StopDT", data.sbyCmd_StopDT);
    assign_TextContent_To_SpID("#exeCmd_P", data.exeCmd_P);
    assign_TextContent_To_SpID("#sbyCmd_P", data.sbyCmd_P);

    updateData_Scedule(data);
    // console.log("定時更新");
}

function updateData_Scedule(Data) {
    assign_TextContent_To_SpID("#schdDate", Data.schdDate);

    assign_TextContent_To_SpID("#P_schd_00_0", Data.P_schd_00_0);
    assign_TextContent_To_SpID("#P_schd_00_1", Data.P_schd_00_1);
    assign_TextContent_To_SpID("#P_schd_00_2", Data.P_schd_00_2);
    assign_TextContent_To_SpID("#P_schd_00_3", Data.P_schd_00_3);
    assign_TextContent_To_SpID("#P_schd_01_0", Data.P_schd_01_0);
    assign_TextContent_To_SpID("#P_schd_01_1", Data.P_schd_01_1);
    assign_TextContent_To_SpID("#P_schd_01_2", Data.P_schd_01_2);
    assign_TextContent_To_SpID("#P_schd_01_3", Data.P_schd_01_3);
    assign_TextContent_To_SpID("#P_schd_02_0", Data.P_schd_02_0);
    assign_TextContent_To_SpID("#P_schd_02_1", Data.P_schd_02_1);
    assign_TextContent_To_SpID("#P_schd_02_2", Data.P_schd_02_2);
    assign_TextContent_To_SpID("#P_schd_02_3", Data.P_schd_02_3);
    assign_TextContent_To_SpID("#P_schd_03_0", Data.P_schd_03_0);
    assign_TextContent_To_SpID("#P_schd_03_1", Data.P_schd_03_1);
    assign_TextContent_To_SpID("#P_schd_03_2", Data.P_schd_03_2);
    assign_TextContent_To_SpID("#P_schd_03_3", Data.P_schd_03_3);
    assign_TextContent_To_SpID("#P_schd_04_0", Data.P_schd_04_0);
    assign_TextContent_To_SpID("#P_schd_04_1", Data.P_schd_04_1);
    assign_TextContent_To_SpID("#P_schd_04_2", Data.P_schd_04_2);
    assign_TextContent_To_SpID("#P_schd_04_3", Data.P_schd_04_3);
    assign_TextContent_To_SpID("#P_schd_05_0", Data.P_schd_05_0);
    assign_TextContent_To_SpID("#P_schd_05_1", Data.P_schd_05_1);
    assign_TextContent_To_SpID("#P_schd_05_2", Data.P_schd_05_2);
    assign_TextContent_To_SpID("#P_schd_05_3", Data.P_schd_05_3);
    assign_TextContent_To_SpID("#P_schd_06_0", Data.P_schd_06_0);
    assign_TextContent_To_SpID("#P_schd_06_1", Data.P_schd_06_1);
    assign_TextContent_To_SpID("#P_schd_06_2", Data.P_schd_06_2);
    assign_TextContent_To_SpID("#P_schd_06_3", Data.P_schd_06_3);
    assign_TextContent_To_SpID("#P_schd_07_0", Data.P_schd_07_0);
    assign_TextContent_To_SpID("#P_schd_07_1", Data.P_schd_07_1);
    assign_TextContent_To_SpID("#P_schd_07_2", Data.P_schd_07_2);
    assign_TextContent_To_SpID("#P_schd_07_3", Data.P_schd_07_3);
    assign_TextContent_To_SpID("#P_schd_08_0", Data.P_schd_08_0);
    assign_TextContent_To_SpID("#P_schd_08_1", Data.P_schd_08_1);
    assign_TextContent_To_SpID("#P_schd_08_2", Data.P_schd_08_2);
    assign_TextContent_To_SpID("#P_schd_08_3", Data.P_schd_08_3);
    assign_TextContent_To_SpID("#P_schd_09_0", Data.P_schd_09_0);
    assign_TextContent_To_SpID("#P_schd_09_1", Data.P_schd_09_1);
    assign_TextContent_To_SpID("#P_schd_09_2", Data.P_schd_09_2);
    assign_TextContent_To_SpID("#P_schd_09_3", Data.P_schd_09_3);
    assign_TextContent_To_SpID("#P_schd_10_0", Data.P_schd_10_0);
    assign_TextContent_To_SpID("#P_schd_10_1", Data.P_schd_10_1);
    assign_TextContent_To_SpID("#P_schd_10_2", Data.P_schd_10_2);
    assign_TextContent_To_SpID("#P_schd_10_3", Data.P_schd_10_3);
    assign_TextContent_To_SpID("#P_schd_11_0", Data.P_schd_11_0);
    assign_TextContent_To_SpID("#P_schd_11_1", Data.P_schd_11_1);
    assign_TextContent_To_SpID("#P_schd_11_2", Data.P_schd_11_2);
    assign_TextContent_To_SpID("#P_schd_11_3", Data.P_schd_11_3);
    assign_TextContent_To_SpID("#P_schd_12_0", Data.P_schd_12_0);
    assign_TextContent_To_SpID("#P_schd_12_1", Data.P_schd_12_1);
    assign_TextContent_To_SpID("#P_schd_12_2", Data.P_schd_12_2);
    assign_TextContent_To_SpID("#P_schd_12_3", Data.P_schd_12_3);
    assign_TextContent_To_SpID("#P_schd_13_0", Data.P_schd_13_0);
    assign_TextContent_To_SpID("#P_schd_13_1", Data.P_schd_13_1);
    assign_TextContent_To_SpID("#P_schd_13_2", Data.P_schd_13_2);
    assign_TextContent_To_SpID("#P_schd_13_3", Data.P_schd_13_3);
    assign_TextContent_To_SpID("#P_schd_14_0", Data.P_schd_14_0);
    assign_TextContent_To_SpID("#P_schd_14_1", Data.P_schd_14_1);
    assign_TextContent_To_SpID("#P_schd_14_2", Data.P_schd_14_2);
    assign_TextContent_To_SpID("#P_schd_14_3", Data.P_schd_14_3);
    assign_TextContent_To_SpID("#P_schd_15_0", Data.P_schd_15_0);
    assign_TextContent_To_SpID("#P_schd_15_1", Data.P_schd_15_1);
    assign_TextContent_To_SpID("#P_schd_15_2", Data.P_schd_15_2);
    assign_TextContent_To_SpID("#P_schd_15_3", Data.P_schd_15_3);
    assign_TextContent_To_SpID("#P_schd_16_0", Data.P_schd_16_0);
    assign_TextContent_To_SpID("#P_schd_16_1", Data.P_schd_16_1);
    assign_TextContent_To_SpID("#P_schd_16_2", Data.P_schd_16_2);
    assign_TextContent_To_SpID("#P_schd_16_3", Data.P_schd_16_3);
    assign_TextContent_To_SpID("#P_schd_17_0", Data.P_schd_17_0);
    assign_TextContent_To_SpID("#P_schd_17_1", Data.P_schd_17_1);
    assign_TextContent_To_SpID("#P_schd_17_2", Data.P_schd_17_2);
    assign_TextContent_To_SpID("#P_schd_17_3", Data.P_schd_17_3);
    assign_TextContent_To_SpID("#P_schd_18_0", Data.P_schd_18_0);
    assign_TextContent_To_SpID("#P_schd_18_1", Data.P_schd_18_1);
    assign_TextContent_To_SpID("#P_schd_18_2", Data.P_schd_18_2);
    assign_TextContent_To_SpID("#P_schd_18_3", Data.P_schd_18_3);
    assign_TextContent_To_SpID("#P_schd_19_0", Data.P_schd_19_0);
    assign_TextContent_To_SpID("#P_schd_19_1", Data.P_schd_19_1);
    assign_TextContent_To_SpID("#P_schd_19_2", Data.P_schd_19_2);
    assign_TextContent_To_SpID("#P_schd_19_3", Data.P_schd_19_3);
    assign_TextContent_To_SpID("#P_schd_20_0", Data.P_schd_20_0);
    assign_TextContent_To_SpID("#P_schd_20_1", Data.P_schd_20_1);
    assign_TextContent_To_SpID("#P_schd_20_2", Data.P_schd_20_2);
    assign_TextContent_To_SpID("#P_schd_20_3", Data.P_schd_20_3);
    assign_TextContent_To_SpID("#P_schd_21_0", Data.P_schd_21_0);
    assign_TextContent_To_SpID("#P_schd_21_1", Data.P_schd_21_1);
    assign_TextContent_To_SpID("#P_schd_21_2", Data.P_schd_21_2);
    assign_TextContent_To_SpID("#P_schd_21_3", Data.P_schd_21_3);
    assign_TextContent_To_SpID("#P_schd_22_0", Data.P_schd_22_0);
    assign_TextContent_To_SpID("#P_schd_22_1", Data.P_schd_22_1);
    assign_TextContent_To_SpID("#P_schd_22_2", Data.P_schd_22_2);
    assign_TextContent_To_SpID("#P_schd_22_3", Data.P_schd_22_3);
    assign_TextContent_To_SpID("#P_schd_23_0", Data.P_schd_23_0);
    assign_TextContent_To_SpID("#P_schd_23_1", Data.P_schd_23_1);
    assign_TextContent_To_SpID("#P_schd_23_2", Data.P_schd_23_2);
    assign_TextContent_To_SpID("#P_schd_23_3", Data.P_schd_23_3);

    assign_TextContent_To_SpID("#P_cmd_00_0", Data.P_cmd_00_0);
    assign_TextContent_To_SpID("#P_cmd_00_1", Data.P_cmd_00_1);
    assign_TextContent_To_SpID("#P_cmd_00_2", Data.P_cmd_00_2);
    assign_TextContent_To_SpID("#P_cmd_00_3", Data.P_cmd_00_3);
    assign_TextContent_To_SpID("#P_cmd_01_0", Data.P_cmd_01_0);
    assign_TextContent_To_SpID("#P_cmd_01_1", Data.P_cmd_01_1);
    assign_TextContent_To_SpID("#P_cmd_01_2", Data.P_cmd_01_2);
    assign_TextContent_To_SpID("#P_cmd_01_3", Data.P_cmd_01_3);
    assign_TextContent_To_SpID("#P_cmd_02_0", Data.P_cmd_02_0);
    assign_TextContent_To_SpID("#P_cmd_02_1", Data.P_cmd_02_1);
    assign_TextContent_To_SpID("#P_cmd_02_2", Data.P_cmd_02_2);
    assign_TextContent_To_SpID("#P_cmd_02_3", Data.P_cmd_02_3);
    assign_TextContent_To_SpID("#P_cmd_03_0", Data.P_cmd_03_0);
    assign_TextContent_To_SpID("#P_cmd_03_1", Data.P_cmd_03_1);
    assign_TextContent_To_SpID("#P_cmd_03_2", Data.P_cmd_03_2);
    assign_TextContent_To_SpID("#P_cmd_03_3", Data.P_cmd_03_3);
    assign_TextContent_To_SpID("#P_cmd_04_0", Data.P_cmd_04_0);
    assign_TextContent_To_SpID("#P_cmd_04_1", Data.P_cmd_04_1);
    assign_TextContent_To_SpID("#P_cmd_04_2", Data.P_cmd_04_2);
    assign_TextContent_To_SpID("#P_cmd_04_3", Data.P_cmd_04_3);
    assign_TextContent_To_SpID("#P_cmd_05_0", Data.P_cmd_05_0);
    assign_TextContent_To_SpID("#P_cmd_05_1", Data.P_cmd_05_1);
    assign_TextContent_To_SpID("#P_cmd_05_2", Data.P_cmd_05_2);
    assign_TextContent_To_SpID("#P_cmd_05_3", Data.P_cmd_05_3);
    assign_TextContent_To_SpID("#P_cmd_06_0", Data.P_cmd_06_0);
    assign_TextContent_To_SpID("#P_cmd_06_1", Data.P_cmd_06_1);
    assign_TextContent_To_SpID("#P_cmd_06_2", Data.P_cmd_06_2);
    assign_TextContent_To_SpID("#P_cmd_06_3", Data.P_cmd_06_3);
    assign_TextContent_To_SpID("#P_cmd_07_0", Data.P_cmd_07_0);
    assign_TextContent_To_SpID("#P_cmd_07_1", Data.P_cmd_07_1);
    assign_TextContent_To_SpID("#P_cmd_07_2", Data.P_cmd_07_2);
    assign_TextContent_To_SpID("#P_cmd_07_3", Data.P_cmd_07_3);
    assign_TextContent_To_SpID("#P_cmd_08_0", Data.P_cmd_08_0);
    assign_TextContent_To_SpID("#P_cmd_08_1", Data.P_cmd_08_1);
    assign_TextContent_To_SpID("#P_cmd_08_2", Data.P_cmd_08_2);
    assign_TextContent_To_SpID("#P_cmd_08_3", Data.P_cmd_08_3);
    assign_TextContent_To_SpID("#P_cmd_09_0", Data.P_cmd_09_0);
    assign_TextContent_To_SpID("#P_cmd_09_1", Data.P_cmd_09_1);
    assign_TextContent_To_SpID("#P_cmd_09_2", Data.P_cmd_09_2);
    assign_TextContent_To_SpID("#P_cmd_09_3", Data.P_cmd_09_3);
    assign_TextContent_To_SpID("#P_cmd_10_0", Data.P_cmd_10_0);
    assign_TextContent_To_SpID("#P_cmd_10_1", Data.P_cmd_10_1);
    assign_TextContent_To_SpID("#P_cmd_10_2", Data.P_cmd_10_2);
    assign_TextContent_To_SpID("#P_cmd_10_3", Data.P_cmd_10_3);
    assign_TextContent_To_SpID("#P_cmd_11_0", Data.P_cmd_11_0);
    assign_TextContent_To_SpID("#P_cmd_11_1", Data.P_cmd_11_1);
    assign_TextContent_To_SpID("#P_cmd_11_2", Data.P_cmd_11_2);
    assign_TextContent_To_SpID("#P_cmd_11_3", Data.P_cmd_11_3);
    assign_TextContent_To_SpID("#P_cmd_12_0", Data.P_cmd_12_0);
    assign_TextContent_To_SpID("#P_cmd_12_1", Data.P_cmd_12_1);
    assign_TextContent_To_SpID("#P_cmd_12_2", Data.P_cmd_12_2);
    assign_TextContent_To_SpID("#P_cmd_12_3", Data.P_cmd_12_3);
    assign_TextContent_To_SpID("#P_cmd_13_0", Data.P_cmd_13_0);
    assign_TextContent_To_SpID("#P_cmd_13_1", Data.P_cmd_13_1);
    assign_TextContent_To_SpID("#P_cmd_13_2", Data.P_cmd_13_2);
    assign_TextContent_To_SpID("#P_cmd_13_3", Data.P_cmd_13_3);
    assign_TextContent_To_SpID("#P_cmd_14_0", Data.P_cmd_14_0);
    assign_TextContent_To_SpID("#P_cmd_14_1", Data.P_cmd_14_1);
    assign_TextContent_To_SpID("#P_cmd_14_2", Data.P_cmd_14_2);
    assign_TextContent_To_SpID("#P_cmd_14_3", Data.P_cmd_14_3);
    assign_TextContent_To_SpID("#P_cmd_15_0", Data.P_cmd_15_0);
    assign_TextContent_To_SpID("#P_cmd_15_1", Data.P_cmd_15_1);
    assign_TextContent_To_SpID("#P_cmd_15_2", Data.P_cmd_15_2);
    assign_TextContent_To_SpID("#P_cmd_15_3", Data.P_cmd_15_3);
    assign_TextContent_To_SpID("#P_cmd_16_0", Data.P_cmd_16_0);
    assign_TextContent_To_SpID("#P_cmd_16_1", Data.P_cmd_16_1);
    assign_TextContent_To_SpID("#P_cmd_16_2", Data.P_cmd_16_2);
    assign_TextContent_To_SpID("#P_cmd_16_3", Data.P_cmd_16_3);
    assign_TextContent_To_SpID("#P_cmd_17_0", Data.P_cmd_17_0);
    assign_TextContent_To_SpID("#P_cmd_17_1", Data.P_cmd_17_1);
    assign_TextContent_To_SpID("#P_cmd_17_2", Data.P_cmd_17_2);
    assign_TextContent_To_SpID("#P_cmd_17_3", Data.P_cmd_17_3);
    assign_TextContent_To_SpID("#P_cmd_18_0", Data.P_cmd_18_0);
    assign_TextContent_To_SpID("#P_cmd_18_1", Data.P_cmd_18_1);
    assign_TextContent_To_SpID("#P_cmd_18_2", Data.P_cmd_18_2);
    assign_TextContent_To_SpID("#P_cmd_18_3", Data.P_cmd_18_3);
    assign_TextContent_To_SpID("#P_cmd_19_0", Data.P_cmd_19_0);
    assign_TextContent_To_SpID("#P_cmd_19_1", Data.P_cmd_19_1);
    assign_TextContent_To_SpID("#P_cmd_19_2", Data.P_cmd_19_2);
    assign_TextContent_To_SpID("#P_cmd_19_3", Data.P_cmd_19_3);
    assign_TextContent_To_SpID("#P_cmd_20_0", Data.P_cmd_20_0);
    assign_TextContent_To_SpID("#P_cmd_20_1", Data.P_cmd_20_1);
    assign_TextContent_To_SpID("#P_cmd_20_2", Data.P_cmd_20_2);
    assign_TextContent_To_SpID("#P_cmd_20_3", Data.P_cmd_20_3);
    assign_TextContent_To_SpID("#P_cmd_21_0", Data.P_cmd_21_0);
    assign_TextContent_To_SpID("#P_cmd_21_1", Data.P_cmd_21_1);
    assign_TextContent_To_SpID("#P_cmd_21_2", Data.P_cmd_21_2);
    assign_TextContent_To_SpID("#P_cmd_21_3", Data.P_cmd_21_3);
    assign_TextContent_To_SpID("#P_cmd_22_0", Data.P_cmd_22_0);
    assign_TextContent_To_SpID("#P_cmd_22_1", Data.P_cmd_22_1);
    assign_TextContent_To_SpID("#P_cmd_22_2", Data.P_cmd_22_2);
    assign_TextContent_To_SpID("#P_cmd_22_3", Data.P_cmd_22_3);
    assign_TextContent_To_SpID("#P_cmd_23_0", Data.P_cmd_23_0);
    assign_TextContent_To_SpID("#P_cmd_23_1", Data.P_cmd_23_1);
    assign_TextContent_To_SpID("#P_cmd_23_2", Data.P_cmd_23_2);
    assign_TextContent_To_SpID("#P_cmd_23_3", Data.P_cmd_23_3);

    assign_TextContent_To_SpID("#socRef_00_0", Data.socRef_00_0);
    assign_TextContent_To_SpID("#socRef_00_1", Data.socRef_00_1);
    assign_TextContent_To_SpID("#socRef_00_2", Data.socRef_00_2);
    assign_TextContent_To_SpID("#socRef_00_3", Data.socRef_00_3);
    assign_TextContent_To_SpID("#socRef_01_0", Data.socRef_01_0);
    assign_TextContent_To_SpID("#socRef_01_1", Data.socRef_01_1);
    assign_TextContent_To_SpID("#socRef_01_2", Data.socRef_01_2);
    assign_TextContent_To_SpID("#socRef_01_3", Data.socRef_01_3);
    assign_TextContent_To_SpID("#socRef_02_0", Data.socRef_02_0);
    assign_TextContent_To_SpID("#socRef_02_1", Data.socRef_02_1);
    assign_TextContent_To_SpID("#socRef_02_2", Data.socRef_02_2);
    assign_TextContent_To_SpID("#socRef_02_3", Data.socRef_02_3);
    assign_TextContent_To_SpID("#socRef_03_0", Data.socRef_03_0);
    assign_TextContent_To_SpID("#socRef_03_1", Data.socRef_03_1);
    assign_TextContent_To_SpID("#socRef_03_2", Data.socRef_03_2);
    assign_TextContent_To_SpID("#socRef_03_3", Data.socRef_03_3);
    assign_TextContent_To_SpID("#socRef_04_0", Data.socRef_04_0);
    assign_TextContent_To_SpID("#socRef_04_1", Data.socRef_04_1);
    assign_TextContent_To_SpID("#socRef_04_2", Data.socRef_04_2);
    assign_TextContent_To_SpID("#socRef_04_3", Data.socRef_04_3);
    assign_TextContent_To_SpID("#socRef_05_0", Data.socRef_05_0);
    assign_TextContent_To_SpID("#socRef_05_1", Data.socRef_05_1);
    assign_TextContent_To_SpID("#socRef_05_2", Data.socRef_05_2);
    assign_TextContent_To_SpID("#socRef_05_3", Data.socRef_05_3);
    assign_TextContent_To_SpID("#socRef_06_0", Data.socRef_06_0);
    assign_TextContent_To_SpID("#socRef_06_1", Data.socRef_06_1);
    assign_TextContent_To_SpID("#socRef_06_2", Data.socRef_06_2);
    assign_TextContent_To_SpID("#socRef_06_3", Data.socRef_06_3);
    assign_TextContent_To_SpID("#socRef_07_0", Data.socRef_07_0);
    assign_TextContent_To_SpID("#socRef_07_1", Data.socRef_07_1);
    assign_TextContent_To_SpID("#socRef_07_2", Data.socRef_07_2);
    assign_TextContent_To_SpID("#socRef_07_3", Data.socRef_07_3);
    assign_TextContent_To_SpID("#socRef_08_0", Data.socRef_08_0);
    assign_TextContent_To_SpID("#socRef_08_1", Data.socRef_08_1);
    assign_TextContent_To_SpID("#socRef_08_2", Data.socRef_08_2);
    assign_TextContent_To_SpID("#socRef_08_3", Data.socRef_08_3);
    assign_TextContent_To_SpID("#socRef_09_0", Data.socRef_09_0);
    assign_TextContent_To_SpID("#socRef_09_1", Data.socRef_09_1);
    assign_TextContent_To_SpID("#socRef_09_2", Data.socRef_09_2);
    assign_TextContent_To_SpID("#socRef_09_3", Data.socRef_09_3);
    assign_TextContent_To_SpID("#socRef_10_0", Data.socRef_10_0);
    assign_TextContent_To_SpID("#socRef_10_1", Data.socRef_10_1);
    assign_TextContent_To_SpID("#socRef_10_2", Data.socRef_10_2);
    assign_TextContent_To_SpID("#socRef_10_3", Data.socRef_10_3);
    assign_TextContent_To_SpID("#socRef_11_0", Data.socRef_11_0);
    assign_TextContent_To_SpID("#socRef_11_1", Data.socRef_11_1);
    assign_TextContent_To_SpID("#socRef_11_2", Data.socRef_11_2);
    assign_TextContent_To_SpID("#socRef_11_3", Data.socRef_11_3);
    assign_TextContent_To_SpID("#socRef_12_0", Data.socRef_12_0);
    assign_TextContent_To_SpID("#socRef_12_1", Data.socRef_12_1);
    assign_TextContent_To_SpID("#socRef_12_2", Data.socRef_12_2);
    assign_TextContent_To_SpID("#socRef_12_3", Data.socRef_12_3);
    assign_TextContent_To_SpID("#socRef_13_0", Data.socRef_13_0);
    assign_TextContent_To_SpID("#socRef_13_1", Data.socRef_13_1);
    assign_TextContent_To_SpID("#socRef_13_2", Data.socRef_13_2);
    assign_TextContent_To_SpID("#socRef_13_3", Data.socRef_13_3);
    assign_TextContent_To_SpID("#socRef_14_0", Data.socRef_14_0);
    assign_TextContent_To_SpID("#socRef_14_1", Data.socRef_14_1);
    assign_TextContent_To_SpID("#socRef_14_2", Data.socRef_14_2);
    assign_TextContent_To_SpID("#socRef_14_3", Data.socRef_14_3);
    assign_TextContent_To_SpID("#socRef_15_0", Data.socRef_15_0);
    assign_TextContent_To_SpID("#socRef_15_1", Data.socRef_15_1);
    assign_TextContent_To_SpID("#socRef_15_2", Data.socRef_15_2);
    assign_TextContent_To_SpID("#socRef_15_3", Data.socRef_15_3);
    assign_TextContent_To_SpID("#socRef_16_0", Data.socRef_16_0);
    assign_TextContent_To_SpID("#socRef_16_1", Data.socRef_16_1);
    assign_TextContent_To_SpID("#socRef_16_2", Data.socRef_16_2);
    assign_TextContent_To_SpID("#socRef_16_3", Data.socRef_16_3);
    assign_TextContent_To_SpID("#socRef_17_0", Data.socRef_17_0);
    assign_TextContent_To_SpID("#socRef_17_1", Data.socRef_17_1);
    assign_TextContent_To_SpID("#socRef_17_2", Data.socRef_17_2);
    assign_TextContent_To_SpID("#socRef_17_3", Data.socRef_17_3);
    assign_TextContent_To_SpID("#socRef_18_0", Data.socRef_18_0);
    assign_TextContent_To_SpID("#socRef_18_1", Data.socRef_18_1);
    assign_TextContent_To_SpID("#socRef_18_2", Data.socRef_18_2);
    assign_TextContent_To_SpID("#socRef_18_3", Data.socRef_18_3);
    assign_TextContent_To_SpID("#socRef_19_0", Data.socRef_19_0);
    assign_TextContent_To_SpID("#socRef_19_1", Data.socRef_19_1);
    assign_TextContent_To_SpID("#socRef_19_2", Data.socRef_19_2);
    assign_TextContent_To_SpID("#socRef_19_3", Data.socRef_19_3);
    assign_TextContent_To_SpID("#socRef_20_0", Data.socRef_20_0);
    assign_TextContent_To_SpID("#socRef_20_1", Data.socRef_20_1);
    assign_TextContent_To_SpID("#socRef_20_2", Data.socRef_20_2);
    assign_TextContent_To_SpID("#socRef_20_3", Data.socRef_20_3);
    assign_TextContent_To_SpID("#socRef_21_0", Data.socRef_21_0);
    assign_TextContent_To_SpID("#socRef_21_1", Data.socRef_21_1);
    assign_TextContent_To_SpID("#socRef_21_2", Data.socRef_21_2);
    assign_TextContent_To_SpID("#socRef_21_3", Data.socRef_21_3);
    assign_TextContent_To_SpID("#socRef_22_0", Data.socRef_22_0);
    assign_TextContent_To_SpID("#socRef_22_1", Data.socRef_22_1);
    assign_TextContent_To_SpID("#socRef_22_2", Data.socRef_22_2);
    assign_TextContent_To_SpID("#socRef_22_3", Data.socRef_22_3);
    assign_TextContent_To_SpID("#socRef_23_0", Data.socRef_23_0);
    assign_TextContent_To_SpID("#socRef_23_1", Data.socRef_23_1);
    assign_TextContent_To_SpID("#socRef_23_2", Data.socRef_23_2);
    assign_TextContent_To_SpID("#socRef_23_3", Data.socRef_23_3);
}

