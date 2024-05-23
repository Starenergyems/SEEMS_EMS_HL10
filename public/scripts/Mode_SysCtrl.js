// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

document.addEventListener("DOMContentLoaded", afterLoadDCM);
function afterLoadDCM() {
    asdfg = "DOM加载了! 哈哈\n阿哈哈~";
    console.log(asdfg);

    const defaultBut_navBar = document.querySelector("#nB_Mode");
    defaultBut_navBar.classList.add("default_nB");

    routineWork();
}

setInterval(routineWork, 1000);

//////////////////////////////////////////////////////////////////////////////////////////////////

const window_dataValue_Set = document.querySelector(".dataValue_Set");
const title_dataValue_Set = document.querySelector(".dataValue_Set .titlePUW");
const val_origin_dataValue_Set = document.querySelector(".dataValue_Set #valueOrigin");
const unit_origin_dataValue_Set = document.querySelector(".dataValue_Set .valOrigin .data_unit");
const unit_new_dataValue_Set = document.querySelector(".dataValue_Set .valNew .data_unit");
const range_info_dataValue_Set = document.querySelector(".dataValue_Set .rangeInfo");
const val_new_dataValue_Set = document.querySelector(".dataValue_Set #valueNew");
let dVS_Data_dataName;

const setBut_P_Project = document.querySelector(".sysInfo #P_Project_set");
setBut_P_Project.addEventListener("click", function () { Set_P_Project(99); });
async function Set_P_Project(numInDataGroup) {
    dVS_Data_dataName = "setBut_P_Project";

    title_dataValue_Set.textContent = `額定功率設定`;
    window_dataValue_Set.classList.add("appear");

    let getData = await get_dVS_Data_WhenClicking(dVS_Data_dataName, numInDataGroup);
    console.log(getData);

    val_origin_dataValue_Set.textContent = getData.originData;
    unit_origin_dataValue_Set.textContent = getData.unit;
    unit_new_dataValue_Set.textContent = getData.unit;
    range_info_dataValue_Set.textContent = getData.dataRange;

    val_new_dataValue_Set.focus();
}

const setBut_P_LoadShift = document.querySelector(".sysInfo #P_LoadShift_set");
setBut_P_LoadShift.addEventListener("click", function () { Set_P_LoadShift(99); });
async function Set_P_LoadShift(numInDataGroup) {
    dVS_Data_dataName = "setBut_P_LoadShift";

    title_dataValue_Set.textContent = `負載轉移功率設定`;
    window_dataValue_Set.classList.add("appear");

    let getData = await get_dVS_Data_WhenClicking(dVS_Data_dataName, numInDataGroup);
    console.log(getData);

    val_origin_dataValue_Set.textContent = getData.originData;
    unit_origin_dataValue_Set.textContent = getData.unit;
    unit_new_dataValue_Set.textContent = getData.unit;
    range_info_dataValue_Set.textContent = getData.dataRange;

    val_new_dataValue_Set.focus();
}

const closeWB_Yes_dVS = document.querySelector(".dataValue_Set #closeWB_Yes");
closeWB_Yes_dVS.addEventListener("click", closePopup_dVS_Yes);
function closePopup_dVS_Yes() {
    let value_set_raw = val_new_dataValue_Set.value;

    set_dVS_Data(value_set_raw);

    val_new_dataValue_Set.value = "";
    window_dataValue_Set.classList.remove("appear");
}

const closeWB_No_dVS = document.querySelector(".dataValue_Set #closeWB_No");
closeWB_No_dVS.addEventListener("click", closePopup_dVS_No);
function closePopup_dVS_No() {
    val_new_dataValue_Set.value = "";
    window_dataValue_Set.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////////

const window_dataStatus_Set = document.querySelector(".dataStatus_Set.general");
const title_dataStatus_Set = document.querySelector(".dataStatus_Set.general .titlePUW");
const option1_dataStatus_Set = document.querySelector(".dataStatus_Set.general #option_1");
const option2_dataStatus_Set = document.querySelector(".dataStatus_Set.general #option_2");
const radioOption1 = document.querySelector(".dataStatus_Set.general #radioOpt_1");
const radioOption2 = document.querySelector(".dataStatus_Set.general #radioOpt_2");
const alertInfo_dataStatus_Set = document.querySelector(".dataStatus_Set.general .alertInfo");
let optionChecked_dataStatus_Set;
let dSS_Data_dataName;

function clearCheckedRadioOption() {
    radioOption1.checked = false;
    radioOption2.checked = false;
}

let qSelectAll_option = document.querySelectorAll(".dataStatus_Set.general .option");
let qSelectAll_radioOpt = document.querySelectorAll(".dataStatus_Set.general .radioOpt");
let i;

async function Set_AutoMan_SS(numInDataGroup) {
    dSS_Data_dataName = "setBut_AutoMan_SS";

    title_dataStatus_Set.textContent = `子系統${numInDataGroup}運作模式`;
    window_dataStatus_Set.classList.add("appear");
    window_dSS_specific_Set.classList.remove("appear");
    clearCheckedRadioOption();

    let getData = await get_dSS_Data_WhenClicking(dSS_Data_dataName, numInDataGroup);
    console.log(getData);
    // console.log(getData.status_MT);
    // console.log(Object.keys(getData.status_MT));

    for (i = 0; i < Object.keys(getData.status_MT).length; i++) {
        qSelectAll_option[i].textContent = getData.status_MT[Object.keys(getData.status_MT)[i]];
        qSelectAll_radioOpt[i].setAttribute("value", Object.keys(getData.status_MT)[i]);

        if (Object.keys(getData.status_MT)[i].slice(1) === getData.originData) {
            qSelectAll_radioOpt[i].checked = true;
        }
    }

    alertInfo_dataStatus_Set.textContent = "";
}

const setBut_AutoMan_SS1 = document.querySelector(".subSysInfo #AutoMan_SS1_set");
setBut_AutoMan_SS1.addEventListener("click", function () { Set_AutoMan_SS(1); });
// setBut_AutoMan_SS1.addEventListener("click", Set_AutoMan_SS1);
// function Set_AutoMan_SS1() {
//     Set_AutoMan_SS();
//     title_dataStatus_Set.textContent = "子系統1運作模式";
//     valNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS1");
//     valLightNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS1_Light");
// }

const setBut_AutoMan_SS2 = document.querySelector(".subSysInfo #AutoMan_SS2_set");
setBut_AutoMan_SS2.addEventListener("click", function () { Set_AutoMan_SS(2); });

const setBut_AutoMan_SS3 = document.querySelector(".subSysInfo #AutoMan_SS3_set");
setBut_AutoMan_SS3.addEventListener("click", function () { Set_AutoMan_SS(3); });

const setBut_AutoMan_SS4 = document.querySelector(".subSysInfo #AutoMan_SS4_set");
setBut_AutoMan_SS4.addEventListener("click", function () { Set_AutoMan_SS(4); });

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set.general #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
    if (radioOption1.checked === true || radioOption2.checked === true) {
        optionChecked_dataStatus_Set = document.querySelector(".dataStatus_Set.general [name=dataStatus]:checked");

        set_dSS_Data(optionChecked_dataStatus_Set.value);

        optionChecked_dataStatus_Set.checked = false;
    }

    window_dataStatus_Set.classList.remove("appear");
}

const closeWB_No_dSS = document.querySelector(".dataStatus_Set.general #closeWB_No");
closeWB_No_dSS.addEventListener("click", closePopup_dSS_No);
function closePopup_dSS_No() {
    radioOption1.checked = false;
    radioOption2.checked = false;
    window_dataStatus_Set.classList.remove("appear");
}

////////////////////////////////////////////////////////////////////////////////

const window_dSS_specific_Set = document.querySelector(".dataStatus_Set.specific");
const title_dSS_specific_Set = document.querySelector(".dataStatus_Set.specific .titlePUW");
const option_specific1 = document.querySelector(".dataStatus_Set.specific #option_specific1");
const option_specific2 = document.querySelector(".dataStatus_Set.specific #option_specific2");
const radioOption_specific1 = document.querySelector(".dataStatus_Set.specific #radioOpt_specific1");
const radioOption_specific2 = document.querySelector(".dataStatus_Set.specific #radioOpt_specific2");
const alertInfo_dSS_specific_Set = document.querySelector(".dataStatus_Set.specific .alertInfo");
let optionChecked_dSS_specific_Set;
let specific_dataName;

async function record_specific_dataName_to_be_set(dataName) {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/record_specific_dataName_to_be_set", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataName }),
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const setBut_sysMode = document.querySelector(".sysInfo #sysMode_set");
setBut_sysMode.addEventListener("click", Set_sysMode);
function Set_sysMode() {
    window_dSS_specific_Set.classList.add("appear");
    window_dataStatus_Set.classList.remove("appear");
    radioOption_specific1.checked = false;
    radioOption_specific2.checked = false;
    title_dSS_specific_Set.textContent = "子系統運作模式設定";
    option_specific1.textContent = "全部自動";
    option_specific2.textContent = "全部手動";
    alertInfo_dSS_specific_Set.textContent = "";

    specific_dataName = "sysMode";
    record_specific_dataName_to_be_set(specific_dataName);
}

const setBut_statusAllPCS = document.querySelector(".sysInfo #statusAllPCS_set");
setBut_statusAllPCS.addEventListener("click", Set_statusAllPCS);
function Set_statusAllPCS() {
    window_dSS_specific_Set.classList.add("appear");
    window_dataStatus_Set.classList.remove("appear");
    radioOption_specific1.checked = false;
    radioOption_specific2.checked = false;
    title_dSS_specific_Set.textContent = "PCS狀態設定";
    option_specific1.textContent = "全部投入";
    option_specific2.textContent = "全部切離";
    alertInfo_dSS_specific_Set.textContent = "";

    specific_dataName = "statusAllPCS";
    record_specific_dataName_to_be_set(specific_dataName);
}

const setBut_statusAllBMS = document.querySelector(".sysInfo #statusAllBMS_set");
setBut_statusAllBMS.addEventListener("click", Set_statusAllBMS);
function Set_statusAllBMS() {
    window_dSS_specific_Set.classList.add("appear");
    window_dataStatus_Set.classList.remove("appear");
    radioOption_specific1.checked = false;
    radioOption_specific2.checked = false;
    title_dSS_specific_Set.textContent = "電池狀態設定";
    option_specific1.textContent = "全部投入";
    option_specific2.textContent = "全部切離";
    alertInfo_dSS_specific_Set.textContent = "";

    specific_dataName = "statusAllBMS";
    record_specific_dataName_to_be_set(specific_dataName);
}

async function set_specific_dataStatus(setValue) {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/set_specific_dataStatus", {
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

const closeWB_Yes_specific = document.querySelector(".dataStatus_Set #closeWB_specific_Yes");
closeWB_Yes_specific.addEventListener("click", closePopup_specific_dS_Yes);
function closePopup_specific_dS_Yes() {
    if ((radioOption_specific1.checked === true) || (radioOption_specific2.checked === true)) {
        optionChecked_dSS_specific_Set = document.querySelector(".dataStatus_Set [name=dSS_specific]:checked");
        console.log(optionChecked_dSS_specific_Set.value);

        set_specific_dataStatus(optionChecked_dSS_specific_Set.value);

        optionChecked_dSS_specific_Set.checked = false;
    }

    window_dSS_specific_Set.classList.remove("appear");
}

const closeWB_No_specific = document.querySelector(".dataStatus_Set #closeWB_specific_No");
closeWB_No_specific.addEventListener("click", closePopup_specific_dS_No);
function closePopup_specific_dS_No() {
    radioOption_specific1.checked = false;
    radioOption_specific2.checked = false;
    window_dSS_specific_Set.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////////

const window_freqVsP_Set = document.querySelector(".freqVsP_Set");
const freq_A = document.querySelector(".EdReg #Freq_A");
const freq_B = document.querySelector(".EdReg #Freq_B");
const freq_C = document.querySelector(".EdReg #Freq_C");
const freq_D = document.querySelector(".EdReg #Freq_D");
const freq_E = document.querySelector(".EdReg #Freq_E");
const freq_F = document.querySelector(".EdReg #Freq_F");
const p_t = document.querySelector(".EdReg #P_t");
const p_u = document.querySelector(".EdReg #P_u");
const p_v = document.querySelector(".EdReg #P_v");
const p_w = document.querySelector(".EdReg #P_w");
const p_x = document.querySelector(".EdReg #P_x");
const p_y = document.querySelector(".EdReg #P_y");
const freq_A_Set = document.querySelector(".freqVsP_Set #Freq_A_Set");
const freq_B_Set = document.querySelector(".freqVsP_Set #Freq_B_Set");
const freq_C_Set = document.querySelector(".freqVsP_Set #Freq_C_Set");
const freq_D_Set = document.querySelector(".freqVsP_Set #Freq_D_Set");
const freq_E_Set = document.querySelector(".freqVsP_Set #Freq_E_Set");
const freq_F_Set = document.querySelector(".freqVsP_Set #Freq_F_Set");
const p_t_Set = document.querySelector(".freqVsP_Set #P_t_Set");
const p_u_Set = document.querySelector(".freqVsP_Set #P_u_Set");
const p_v_Set = document.querySelector(".freqVsP_Set #P_v_Set");
const p_w_Set = document.querySelector(".freqVsP_Set #P_w_Set");
const p_x_Set = document.querySelector(".freqVsP_Set #P_x_Set");
const p_y_Set = document.querySelector(".freqVsP_Set #P_y_Set");
const window_WrongDataSet = document.querySelector(".alert_WrongDataSet");
const alertMessage = document.querySelector("#alertMessage");

const setBut_freqVsP = document.querySelector(".EdReg #FvsP_set");
setBut_freqVsP.addEventListener("click", Set_freqVsP);
function Set_freqVsP() {
    if (setBut_freqVsP.classList.contains("ctrlable")) {
        window_freqVsP_Set.classList.add("appear");
        freq_A_Set.value = freq_A.textContent;
        freq_B_Set.value = freq_B.textContent;
        freq_C_Set.value = freq_C.textContent;
        freq_D_Set.value = freq_D.textContent;
        freq_E_Set.value = freq_E.textContent;
        freq_F_Set.value = freq_F.textContent;
        p_t_Set.value = p_t.textContent;
        p_u_Set.value = p_u.textContent;
        p_v_Set.value = p_v.textContent;
        p_w_Set.value = p_w.textContent;
        p_x_Set.value = p_x.textContent;
        p_y_Set.value = p_y.textContent;
        freq_A_Set.focus();
    } else {
        window_WrongDataSet.classList.add("appear");
        alertMessage.innerHTML = "權限不符！<br>僅系統管理者可進行此設定。";
        button_WrongDataSet.style.marginTop = "15px";
    }
}

async function set_freqVsP_Data(setValue_Freq, setValue_P) {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/set_freqVsP_Data", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ setValue_Freq, setValue_P }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const closeWB_Yes_freqVsP = document.querySelector(".freqVsP_Set #closeWB_Yes");
closeWB_Yes_freqVsP.addEventListener("click", close_freqVsP_Yes);
async function close_freqVsP_Yes() {
    let getData = await set_freqVsP_Data([freq_A_Set.value, freq_B_Set.value, freq_C_Set.value, freq_D_Set.value, freq_E_Set.value, freq_F_Set.value],
        [p_t_Set.value, p_u_Set.value, p_v_Set.value, p_w_Set.value, p_x_Set.value, p_y_Set.value]);
    console.log(getData);

    if (getData.status === "ok") {
        window_freqVsP_Set.classList.remove("appear");
    } else {
        alertMessage.innerHTML = `${getData.alertMessage}<br>請再次確認設定值。`;
        window_WrongDataSet.classList.add("appear");
    }
}

const closeWB_No_freqVsP = document.querySelector(".freqVsP_Set #closeWB_No");
closeWB_No_freqVsP.addEventListener("click", close_freqVsP_No);
function close_freqVsP_No() {
    window_freqVsP_Set.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////////

const window_socRef_Set = document.querySelector(".socRef_Set");
const socMaxLimit = document.querySelector(".socRef_Set #socMax");
const socUpperB = document.querySelector(".socRef_Set #socUpperB");
const socLowerB = document.querySelector(".socRef_Set #socLowerB");
const socMinLimit = document.querySelector(".socRef_Set #socMin");
const voltMaxLimit = document.querySelector(".socRef_Set #voltMax");
const voltUpperB = document.querySelector(".socRef_Set #voltUpperB");
const voltLowerB = document.querySelector(".socRef_Set #voltLowerB");
const voltMinLimit = document.querySelector(".socRef_Set #voltMin");

const setBut_socRef = document.querySelector(".EdReg #SOC_Ref_set");
setBut_socRef.addEventListener("click", Set_socRef);
async function Set_socRef() {
    window_socRef_Set.classList.add("appear");

    let getData = await get_socRef_Data();
    console.log(getData);

    socMaxLimit.value = getData.socMax;
    socUpperB.value = getData.socUpperB;
    socLowerB.value = getData.socLowerB;
    socMinLimit.value = getData.socMin;
    voltMaxLimit.value = getData.voltMax;
    voltUpperB.value = getData.voltUpperB;
    voltLowerB.value = getData.voltLowerB;
    voltMinLimit.value = getData.voltMin;

    if (!setBut_socRef.classList.contains("ctrlable")) {
        console.log("socRef 不可控!!!");
        socMaxLimit.disabled = true;
        socUpperB.disabled = true;
        socLowerB.disabled = true;
        socMinLimit.disabled = true;
        voltMaxLimit.disabled = true;
        voltUpperB.disabled = true;
        voltLowerB.disabled = true;
        voltMinLimit.disabled = true;
        closeWB_Yes_socRef.style.display = "none";
        closeWB_No_socRef.style.marginLeft = "190px";
    }
}

async function get_socRef_Data() {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/get_socRef_Data", {
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

async function set_socRef_Data(setValue_SOC, setValue_Volt) {
    try {
        console.log("嘗試向後端發出請求");
        const response = await fetch("/set_socRef_Data", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ setValue_SOC, setValue_Volt }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const closeWB_Yes_socRef = document.querySelector(".socRef_Set #closeWB_Yes");
closeWB_Yes_socRef.addEventListener("click", close_socRef_Yes);
async function close_socRef_Yes() {
    let getData = await set_socRef_Data([socMaxLimit.value, socMinLimit.value, socUpperB.value, socLowerB.value],
        [voltMaxLimit.value, voltMinLimit.value, voltUpperB.value, voltLowerB.value]);
    console.log(getData);

    if (getData.status === "ok") {
        window_socRef_Set.classList.remove("appear");
    } else {
        alertMessage.innerHTML = `${getData.alertMessage}<br>請再次確認設定值。`;
        window_WrongDataSet.classList.add("appear");
    }
}

const closeWB_No_socRef = document.querySelector(".socRef_Set #closeWB_No");
closeWB_No_socRef.addEventListener("click", close_socRef_No);
function close_socRef_No() {
    window_socRef_Set.classList.remove("appear");
}

const button_WrongDataSet = document.querySelector(".alert_WrongDataSet button");
button_WrongDataSet.addEventListener("click", close_WrongDataSet);
function close_WrongDataSet() {
    window_WrongDataSet.classList.remove("appear");
}

////////////////////////////////////////////////////////////////////////////////

// const setBut_P_Project = document.querySelector(".sysInfo #P_Project_set");
// const P_Project = document.querySelector(".sysInfo #P_Project");
// setBut_P_Project.addEventListener("click", Set_P_Project);
// function Set_P_Project() {
//     let value_set_raw = prompt("請輸入設定值(0~10000)：");
//     if ((value_set_raw) && (value_set_raw !== null)) {
//         let value_set = Math.round(Number(value_set_raw));
//         if (value_set >= 0 && value_set <= 10000) {
//             P_Project.textContent = value_set;
//         }
//     }
// }

// const Freq_A_set = document.querySelector(".EdReg #Freq_A");
// Freq_A_set.onclick = function () {
//     let value_set_raw = prompt("請輸入設定值(58.00~61.00)：");
//     if ((value_set_raw) && (value_set_raw !== null)) {
//         let value_set = Math.round(Number(value_set_raw) * 100);
//         if (value_set >= 5800 && value_set <= 6100) {
//             let val = value_set / 100;
//             Freq_A_set.textContent = val.toFixed(2);
//         }
//     }
// }

// const Freq_A_set = document.querySelector(".EdReg #Freq_A");
// Freq_A_set.addEventListener("click", Set_Freq_A);
// function Set_Freq_A() {
//     let value_set_raw = prompt("請輸入設定值(58.00~61.00)：");
//     if ((value_set_raw) && (value_set_raw !== null)) {               // value_set_raw !== (null || "") 有時會有問題
//         let value_set = Math.round(Number(value_set_raw) * 100);
//         if (value_set >= 5800 && value_set <= 6100) {
//             let val = value_set / 100;
//             Freq_A_set.textContent = val.toFixed(2);
//         }
//     }
// }

// const Freq_B_set = document.querySelector(".EdReg #Freq_B");
// Freq_B_set.addEventListener("click", Set_Freq_B);
// function Set_Freq_B() {
//     let value_set_raw = prompt("請輸入設定值(58.00~61.00)：");
//     if ((value_set_raw) && (value_set_raw !== null)) {
//         let value_set = Math.round(Number(value_set_raw) * 100);
//         if (value_set >= 5800 && value_set <= 6100) {
//             let val = value_set / 100;
//             Freq_B_set.textContent = val.toFixed(2);
//         }
//     }
// }

// const P_t_set = document.querySelector(".EdReg #P_t");
// P_t_set.addEventListener("click", Set_P_t);
// function Set_P_t() {
//     let value_set_raw = prompt("請輸入設定值(-100.0~100.0)：");
//     if ((value_set_raw) && (value_set_raw !== null)) {
//         let value_set = Math.round(Number(value_set_raw) * 10);
//         if (value_set >= -1000 && value_set <= 1000) {
//             let val = value_set / 10;
//             P_t_set.textContent = val.toFixed(1);
//         }
//     }
// }

////////////////////////////////////////////////////////////////////////////////

Chart.defaults.datasets.line.pointStyle = false;
Chart.defaults.datasets.line.borderWidth = 1.5;
Chart.defaults.font.size = 16;

const cht_fVsP_Canvus = document.querySelector("#chart_fVsP_Canvas");
const cht_freqVsP = new Chart(cht_fVsP_Canvus, {
    type: 'line',
    data: {
        labels: [59.57, 59.73, 59.75, 59.98, 60.02, 60.25, 60.50],
        datasets: [{
            label: '當前操作點',
            data: [{ x: 60.000, y: 0.0 }],
            pointStyle: true,
            pointRadius: 5,
            backgroundColor: '#FCC94A',
            borderColor: '#DC8E09',
        }, {
            label: '操作範圍',
            data: [{ x: 59.40, y: 100.00 }, { x: 59.50, y: 100.00 }, { x: 59.75, y: 48.00 }, { x: 59.98, y: 9.00 }, { x: 60.02, y: 9.00 }, { x: 60.25, y: -48.00 }, { x: 60.50, y: -100.00 }, { x: 60.60, y: -100.00 }, { x: 60.50, y: -100.00 }, { x: 60.25, y: -48.00 }, { x: 60.02, y: -9.00 }, { x: 59.98, y: -9.00 }, { x: 59.75, y: 48.00 }],
            backgroundColor: '#ACD0F6',
            borderColor: '#5AA2ED',
        },]
    },
    options: {
        // responsive: false,
        animation: false,
        plugins: {
            // title: {
            //   display: true,
            //   padding: { top: 10, bottom: 2 },
            //   text: '71頻率 (Hz)46',
            //   position: 'top',
            //   font: { size: 26, family: 'Arial', style: 'normal' },
            //   color: '#88aaff',
            // },
        },
        scales: {
            x: {
                type: 'linear',
                title: {
                    display: true,
                    text: '頻率 (Hz)'
                },
                min: 59.40,
                max: 60.60,
                ticks: {
                    stepSize: 0.1,
                    // source: 'labels',
                    // autoSkip: true,
                    // maxTicksLimit: 5,
                },
            },
            y: {
                title: {
                    display: true,
                    text: '輸出 (%)'
                },
                min: -100.00,
                max: 100.00,
                ticks: {
                    stepSize: 10,
                },
            },
        },
        interaction: {
            mode: 'x'
        },
    },
    plugins: [{
        id: 'RefPointsLine',
        beforeDatasetsDraw(chart, args, plugins) {
            const { ctx, scales: { x, y }, chartArea: { right, bottom } } = chart;
            ctx.save();

            ctx.beginPath();
            ctx.setLineDash([10, 3]);
            ctx.strokeStyle = '#ACD0F6';
            ctx.lineWidth = 1.5;
            ctx.moveTo(chart.getDatasetMeta(1).data[1].x, chart.getDatasetMeta(1).data[1].y);
            ctx.lineTo(chart.getDatasetMeta(1).data[1].x, bottom);
            ctx.moveTo(chart.getDatasetMeta(1).data[2].x, chart.getDatasetMeta(1).data[2].y);
            ctx.lineTo(chart.getDatasetMeta(1).data[2].x, bottom);
            ctx.moveTo(chart.getDatasetMeta(1).data[3].x, chart.getDatasetMeta(1).data[3].y);
            ctx.lineTo(chart.getDatasetMeta(1).data[3].x, bottom);
            ctx.moveTo(chart.getDatasetMeta(1).data[4].x, chart.getDatasetMeta(1).data[4].y);
            ctx.lineTo(chart.getDatasetMeta(1).data[4].x, bottom);
            ctx.moveTo(chart.getDatasetMeta(1).data[5].x, chart.getDatasetMeta(1).data[5].y);
            ctx.lineTo(chart.getDatasetMeta(1).data[5].x, bottom);
            ctx.moveTo(chart.getDatasetMeta(1).data[6].x, chart.getDatasetMeta(1).data[6].y);
            ctx.lineTo(chart.getDatasetMeta(1).data[6].x, bottom);

            ctx.moveTo(chart.getDatasetMeta(1).data[1].x, chart.getDatasetMeta(1).data[1].y);
            ctx.lineTo(right, chart.getDatasetMeta(1).data[1].y);
            ctx.moveTo(chart.getDatasetMeta(1).data[2].x, chart.getDatasetMeta(1).data[2].y);
            ctx.lineTo(right, chart.getDatasetMeta(1).data[2].y);
            ctx.moveTo(chart.getDatasetMeta(1).data[3].x, chart.getDatasetMeta(1).data[3].y);
            ctx.lineTo(right, chart.getDatasetMeta(1).data[3].y);
            ctx.moveTo(chart.getDatasetMeta(1).data[10].x, chart.getDatasetMeta(1).data[10].y);
            ctx.lineTo(right, chart.getDatasetMeta(1).data[10].y);
            ctx.moveTo(chart.getDatasetMeta(1).data[5].x, chart.getDatasetMeta(1).data[5].y);
            ctx.lineTo(right, chart.getDatasetMeta(1).data[5].y);
            // ctx.moveTo(chart.getDatasetMeta(1).data[6].x, chart.getDatasetMeta(1).data[6].y);
            // ctx.lineTo(right, chart.getDatasetMeta(1).data[6].y);
            ctx.stroke();
            ctx.setLineDash([10, 0]);
        }
    },
    {
        id: 'RefPointsName',
        beforeDatasetsDraw(chart, args, plugins) {
            const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
            ctx.save();

            ctx.beginPath();
            ctx.font = 'bold 16px sans-serif';
            ctx.fillStyle = '#5AA2ED';
            ctx.textAlign = 'center';

            ctx.fillText('A', chart.getDatasetMeta(1).data[1].x - left * 0.2, bottom - top * 0.25);
            ctx.fillText('B', chart.getDatasetMeta(1).data[2].x - left * 0.2, bottom - top * 0.25);
            ctx.fillText('C', chart.getDatasetMeta(1).data[3].x - left * 0.2, bottom - top * 0.25);
            ctx.fillText('D', chart.getDatasetMeta(1).data[4].x + left * 0.2, bottom - top * 0.25);
            ctx.fillText('E', chart.getDatasetMeta(1).data[5].x - left * 0.2, bottom - top * 0.25);
            ctx.fillText('F', chart.getDatasetMeta(1).data[6].x + left * 0.2, bottom - top * 0.25);

            ctx.fillText('t', right + left * 0.15, chart.getDatasetMeta(1).data[1].y);
            ctx.fillText('u', right + left * 0.15, chart.getDatasetMeta(1).data[2].y);
            ctx.fillText('v', right + left * 0.15, chart.getDatasetMeta(1).data[3].y);
            ctx.fillText('w', right + left * 0.15, chart.getDatasetMeta(1).data[10].y);
            ctx.fillText('x', right + left * 0.15, chart.getDatasetMeta(1).data[5].y);
            ctx.fillText('y', right + left * 0.15, chart.getDatasetMeta(1).data[6].y);
        }
    }
    ],
});

////////////////////////////////////////////////////////////////////////////////

// let schedule_02 = setInterval(update_freqVsP_Location, 500);
/* function update_freqVsP_Location() {
    let left_min = 49;
    let left_max = 614;
    let top_min = 325;
    let top_max = 42;
    let x_min = 59500;
    let x_max = 60500;
    let y_min = -1000;
    let y_max = 1000;
    const freq_t_1 = document.querySelector(".block_temp #spareVal_Freq");
    const power_t = document.querySelector(".block_temp #spareVal_P");
    let valFreq_t_1 = Number(freq_t_1.textContent);
    let valPower_t = Number(power_t.textContent);
    let Val_Freq;
    let Val_Power;
    const deltaFreq = 10;
    const deltaP = -40;
    let left_raw;
    let top_raw;

    if (valFreq_t_1 <= (x_max - deltaFreq)) {
        Val_Freq = valFreq_t_1 + deltaFreq;
    } else {
        Val_Freq = x_min;
    }
    if (valPower_t >= (y_min - deltaP)) {
        Val_Power = valPower_t + deltaP;
    } else {
        Val_Power = y_max;
    }
    freq_t_1.textContent = "" + Val_Freq;
    power_t.textContent = "" + Val_Power;

    if (Val_Freq < x_min) {
        Val_Freq = x_min;
    } else if (Val_Freq > x_max) {
        Val_Freq = x_max;
    }
    if (Val_Power < y_min) {
        Val_Power = y_min;
    } else if (Val_Power > y_max) {
        Val_Power = y_max;
    }

    left_raw = left_min + (Val_Freq - x_min) / (x_max - x_min) * (left_max - left_min);
    top_raw = top_min + (Val_Power - y_min) / (y_max - y_min) * (top_max - top_min);

    const realTime_freqVsP = document.querySelector(".EdReg .realTime_Location");
    realTime_freqVsP.style.left = left_raw + "px";
    realTime_freqVsP.style.top = top_raw + "px";
} */

////////////////////////////////////////////////////////////////////////////////

const button_8 = document.querySelector(".block_temp #button_8");
const button_9 = document.querySelector(".block_temp #button_9");
const GL_00 = document.querySelector(".block_temp #GL_00");
let val_GL_00 = false;

button_8.addEventListener("click", Set_button_8);
function Set_button_8() {
    val_GL_00 = true;
    Set_GL_00_Color();
    // GL_00.style.backgroundColor = "#00FF00";
}
button_9.addEventListener("click", Set_button_9);
function Set_button_9() {
    val_GL_00 = false;
    Set_GL_00_Color();
    // GL_00.style.backgroundColor = "#000000";
}

function Set_GL_00_Color() {
    if (val_GL_00 === true) {
        GL_00.style.backgroundColor = "#00FF00";
    }
    else {
        GL_00.style.backgroundColor = "#000000";
    }
}

const button_10 = document.querySelector(".block_temp #button_10");
const RL_00 = document.querySelector(".block_temp #RL_00");
let val_RL_00 = false;

button_10.addEventListener("click", Set_button_10);
function Set_button_10() {
    let val = confirm("確定操作？");
    if (val) {
        if (val_RL_00 === true) {
            val_RL_00 = false;
        }
        else {
            val_RL_00 = true;
        }
        Set_RL_00_color();
    }
}

function Set_RL_00_color() {
    if (val_RL_00 === true) {
        RL_00.style.backgroundColor = "#FF0000";
    }
    else {
        RL_00.style.backgroundColor = "#000000";
    }

}

const button_11 = document.querySelector(".block_temp #button_11");
button_11.addEventListener("click", Set_SOC_Ref);
function Set_SOC_Ref() {
    window.open('../Set_SOC_ref/Set_SOC_ref.html', 'SOC參考值設定', 'width=500, height=300, left=600, top=650, location=no, menubar=no, resizable=no, scrollbars=yes, status=no, toolbar=no, directories=no');
}

////////////////////////////////////////////////////////////////////////////////

async function updateData() {   //更新資料
    var router = window.location.href + "/data";
    var data = await getData(router);
    //console.log(data);

    assign_TextContent_To_SpID("#sysAvailability", data.sysAvailability);
    assign_TextContent_To_SpID("#SOC", data.SOC);
    assign_TextContent_To_SpID("#SBSPM", data.SBSPM);
    Determine_bgColor_of_sysAvail("#BG_sysAvailability", data.sysAvailability);
    Determine_bgColor_of_SOC("#BG_SOC", data.SOC);
    Determine_bgColor_of_SBSPM("#BG_SBSPM", data.SBSPM);

    assign_TextContent_To_SpID("#sysMode", data.sysMode);
    assign_TextContent_To_SpID("#P_Project", data.P_Project);
    assign_TextContent_To_SpID("#P_LoadShift", data.P_LoadShift);
    assign_TextContent_To_SpID("#statusAllPCS", data.statusAllPCS);
    assign_TextContent_To_SpID("#statusAllBMS", data.statusAllBMS);
    assign_TextContent_To_SpID("#stopCHGsched", data.stopCHGsched);
    Determine_DL_of_stopSched("#stopCHGsched_Light", data.stopCHGsched);

    assign_TextContent_To_SpID("#Freq_A", data.Freq_A);
    assign_TextContent_To_SpID("#Freq_B", data.Freq_B);
    assign_TextContent_To_SpID("#Freq_C", data.Freq_C);
    assign_TextContent_To_SpID("#Freq_D", data.Freq_D);
    assign_TextContent_To_SpID("#Freq_E", data.Freq_E);
    assign_TextContent_To_SpID("#Freq_F", data.Freq_F);
    assign_TextContent_To_SpID("#P_t", data.P_t);
    assign_TextContent_To_SpID("#P_u", data.P_u);
    assign_TextContent_To_SpID("#P_v", data.P_v);
    assign_TextContent_To_SpID("#P_w", data.P_w);
    assign_TextContent_To_SpID("#P_x", data.P_x);
    assign_TextContent_To_SpID("#P_y", data.P_y);

    update_freqVsP_Location(data.Freq_now, data.P_out_pct);

    assign_TextContent_To_SpID("#P_base_SS1", data.P_base_SS1);
    assign_TextContent_To_SpID("#P_base_SS2", data.P_base_SS2);
    assign_TextContent_To_SpID("#P_base_SS3", data.P_base_SS3);
    assign_TextContent_To_SpID("#P_base_SS4", data.P_base_SS4);
    assign_TextContent_To_SpID("#Q_base_SS1", data.Q_base_SS1);
    assign_TextContent_To_SpID("#Q_base_SS2", data.Q_base_SS2);
    assign_TextContent_To_SpID("#Q_base_SS3", data.Q_base_SS3);
    assign_TextContent_To_SpID("#Q_base_SS4", data.Q_base_SS4);

    assign_TextContent_To_SpID("#AutoMan_SS1", data.AutoMan_SS1);
    assign_TextContent_To_SpID("#AutoMan_SS2", data.AutoMan_SS2);
    assign_TextContent_To_SpID("#AutoMan_SS3", data.AutoMan_SS3);
    assign_TextContent_To_SpID("#AutoMan_SS4", data.AutoMan_SS4);
    Determine_DL_of_ManAuto("#AutoMan_SS1_Light", data.AutoMan_SS1);
    Determine_DL_of_ManAuto("#AutoMan_SS2_Light", data.AutoMan_SS2);
    Determine_DL_of_ManAuto("#AutoMan_SS3_Light", data.AutoMan_SS3);
    Determine_DL_of_ManAuto("#AutoMan_SS4_Light", data.AutoMan_SS4);

    assign_TextContent_To_SpID("#BMSPCSstatus_SS1", data.BMSPCSstatus_SS1);
    assign_TextContent_To_SpID("#BMSPCSstatus_SS2", data.BMSPCSstatus_SS2);
    assign_TextContent_To_SpID("#BMSPCSstatus_SS3", data.BMSPCSstatus_SS3);
    assign_TextContent_To_SpID("#BMSPCSstatus_SS4", data.BMSPCSstatus_SS4);
    Determine_DL_of_Avail("#BMSPCSstatus_SS1_Light", data.BMSPCSstatus_SS1);
    Determine_DL_of_Avail("#BMSPCSstatus_SS2_Light", data.BMSPCSstatus_SS2);
    Determine_DL_of_Avail("#BMSPCSstatus_SS3_Light", data.BMSPCSstatus_SS3);
    Determine_DL_of_Avail("#BMSPCSstatus_SS4_Light", data.BMSPCSstatus_SS4);

    assign_TextContent_To_SpID("#Avail_SS1", data.Avail_SS1);
    assign_TextContent_To_SpID("#Avail_SS2", data.Avail_SS2);
    assign_TextContent_To_SpID("#Avail_SS3", data.Avail_SS3);
    assign_TextContent_To_SpID("#Avail_SS4", data.Avail_SS4);
    Determine_DL_of_Avail("#Avail_SS1_Light", data.Avail_SS1);
    Determine_DL_of_Avail("#Avail_SS2_Light", data.Avail_SS2);
    Determine_DL_of_Avail("#Avail_SS3_Light", data.Avail_SS3);
    Determine_DL_of_Avail("#Avail_SS4_Light", data.Avail_SS4);

    assign_TextContent_To_SpID("#EdReg_SS1", data.EdReg_SS1);
    assign_TextContent_To_SpID("#EdReg_SS2", data.EdReg_SS2);
    assign_TextContent_To_SpID("#EdReg_SS3", data.EdReg_SS3);
    assign_TextContent_To_SpID("#EdReg_SS4", data.EdReg_SS4);
    Determine_DL_of_LogicStatus("#EdReg_SS1_Light", data.EdReg_SS1);
    Determine_DL_of_LogicStatus("#EdReg_SS2_Light", data.EdReg_SS2);
    Determine_DL_of_LogicStatus("#EdReg_SS3_Light", data.EdReg_SS3);
    Determine_DL_of_LogicStatus("#EdReg_SS4_Light", data.EdReg_SS4);
}

function update_freqVsP_Location(Val_Freq, Val_Power) {
    if (Val_Freq !== "#*#" && Val_Power !== "#*#") {
        cht_freqVsP.data.datasets[0].data[0].x = Number(Val_Freq);
        cht_freqVsP.data.datasets[0].data[0].y = Number(Val_Power);

        cht_freqVsP.update();
    }
}

function Determine_bgColor_of_sysAvail(elementID, dataStatus) {
    const element = document.querySelector(elementID);

    if (dataStatus === "不可用") {
        element.style.background = "#FF0000";//紅
    } else if (dataStatus === "可用") {
        element.style.background = "#CBE198"; //綠
    } else {
        element.style.background = "#000000";
    }
}

function Determine_bgColor_of_SOC(elementID, SOC) {
    const element = document.querySelector(elementID);

    if (SOC === "#*#") {
        element.style.background = "#000000";
        return;
    }

    if (SOC >= 95) {
        element.style.background = "#FF0000";
    } else if (SOC >= 90) {
        element.style.background = "#EF860F"; //橘色
    } else if (SOC > 10) {
        element.style.background = "#CBE198";
    } else if (SOC > 5) {
        element.style.background = "#EF860F";
    } else {
        element.style.background = "#FF0000";
    }
}

function Determine_bgColor_of_SBSPM(elementID, SBSPM) {
    const element = document.querySelector(elementID);

    if (SBSPM === "#*#") {
        element.style.background = "#000000";
        return;
    }

    if (SBSPM >= 97) {
        element.style.background = "#CBE198";
    } else if (SBSPM >= 95) {
        element.style.background = "#EF860F";
    } else {
        element.style.background = "#FF0000";
    }
}

function Determine_DL_of_stopSched(elementID, dataStatus) {
    const element = document.querySelector(elementID);

    if (dataStatus === "停止排程") {
        element.style.background = "#FF0000";
    } else if (dataStatus === "依原定排程") {
        element.style.background = "#236E37";
    } else {
        element.style.background = "#000000";
    }
}

function Determine_DL_of_ManAuto(elementID, dataStatus) {
    const element = document.querySelector(elementID);

    if (dataStatus === "手動") {
        element.style.background = "#FF0000";
    } else if (dataStatus === "自動") {
        element.style.background = "#236E37";
    } else {
        element.style.background = "#000000";
    }
}

function Determine_DL_of_Avail(elementID, dataStatus) {
    const element = document.querySelector(elementID);

    if (dataStatus === "不可用") {
        element.style.background = "#FF0000";
    } else if (dataStatus === "可用") {
        element.style.background = "#236E37";
    } else {
        element.style.background = "#000000";
    }
}

function Determine_DL_of_LogicStatus(elementID, dataStatus) {
    const element = document.querySelector(elementID);

    if (dataStatus === "停止") {
        element.style.background = "#FF0000";
    } else if (dataStatus === "運行中") {
        element.style.background = "#236E37";
    } else {
        element.style.background = "#000000";
    }
}