// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";


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

//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {
  console.log("start reading js");
  classAdd("#nB_Mode","default_nB");
  updateData();
});

setInterval(updateData, 1000);
//////////////////////////////////////////////////////////////////////////////////////////////////

let minLimit;
let maxLimit;
let scale;
let decPlace;
let dataUnit;
const window_dataValue_Set = document.querySelector(".dataValue_Set");
const title_dataValue_Set = document.querySelector(".dataValue_Set .titlePUW");
let valNow_dataValue_Set;
const val_origin_dataValue_Set = document.querySelector(".dataValue_Set #valueOrigin");
const unit_origin_dataValue_Set = document.querySelector(".dataValue_Set .valOrigin .data_unit");
const unit_new_dataValue_Set = document.querySelector(".dataValue_Set .valNew .data_unit");
const range_info_dataValue_Set = document.querySelector(".dataValue_Set .rangeInfo");
const val_new_dataValue_Set = document.querySelector(".dataValue_Set #valueNew");

const setBut_P_Project = document.querySelector(".sysInfo #P_Project_set");
setBut_P_Project.addEventListener("click", Set_P_Project);
function Set_P_Project() {
    minLimit = "0";
    maxLimit = "10000";
    scale = 1;
    decPlace = 0;
    dataUnit = "kW";
    window_dataValue_Set.classList.add("appear");
    title_dataValue_Set.textContent = "額定功率設定";
    valNow_dataValue_Set = document.querySelector(".sysInfo #P_Project");       // 記得改點位的id
    val_origin_dataValue_Set.textContent = valNow_dataValue_Set.textContent;
    unit_origin_dataValue_Set.textContent = dataUnit;
    unit_new_dataValue_Set.textContent = dataUnit;
    range_info_dataValue_Set.textContent = "數值範圍: " + minLimit + "~" + maxLimit + " " + dataUnit;
    val_new_dataValue_Set.focus();
}

const setBut_P_LoadShift = document.querySelector(".sysInfo #P_LoadShift_set");
setBut_P_LoadShift.addEventListener("click", Set_P_LoadShift);
function Set_P_LoadShift() {
    minLimit = "-10000";
    maxLimit = "10000";
    scale = 1;
    decPlace = 0;
    dataUnit = "kW";
    window_dataValue_Set.classList.add("appear");
    title_dataValue_Set.textContent = "負載轉移功率設定";
    valNow_dataValue_Set = document.querySelector(".sysInfo #P_LoadShift");       // 記得改點位的id
    val_origin_dataValue_Set.textContent = valNow_dataValue_Set.textContent;
    unit_origin_dataValue_Set.textContent = dataUnit;
    unit_new_dataValue_Set.textContent = dataUnit;
    range_info_dataValue_Set.textContent = "數值範圍: " + minLimit + "~" + maxLimit + " " + dataUnit;
    val_new_dataValue_Set.focus();
}

const closeWB_Yes_dVS = document.querySelector(".dataValue_Set #closeWB_Yes");
closeWB_Yes_dVS.addEventListener("click", closePopup_dVS_Yes);
function closePopup_dVS_Yes() {
    let value_set_raw = val_new_dataValue_Set.value;
    if ((value_set_raw) && (value_set_raw !== null)) {
        let value_set = Math.round(Number(value_set_raw) * scale);
        if (value_set >= Number(minLimit) * scale && value_set <= Number(maxLimit) * scale) {
            let val = value_set / scale;
            valNow_dataValue_Set.textContent = val.toFixed(decPlace);
        }
    }

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

const window_dataStatus_Set = document.querySelector(".dataStatus_Set");
const title_dataStatus_Set = document.querySelector(".dataStatus_Set .titlePUW");
const option1_dataStatus_Set = document.querySelector(".dataStatus_Set #option_1");
const option2_dataStatus_Set = document.querySelector(".dataStatus_Set #option_2");
const radioOption1 = document.querySelector(".dataStatus_Set #radioOpt_1");
const radioOption2 = document.querySelector(".dataStatus_Set #radioOpt_2");
const alertInfo_dataStatus_Set = document.querySelector(".dataStatus_Set .alertInfo");
let valNow_dataStatus_Set;
let valLightNow_dataStatus_Set;
let option1_Description;
let option2_Description;
let optionChecked_dataStatus_Set;

function clearCheckedRadioOption() {
    radioOption1.checked = false;
    radioOption2.checked = false;
}

const setBut_sysMode = document.querySelector(".sysInfo #sysMode_set");
setBut_sysMode.addEventListener("click", Set_sysMode);
function Set_sysMode() {
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    title_dataStatus_Set.textContent = "運作模式設定";
    option1_dataStatus_Set.textContent = "E-dReg";
    option2_dataStatus_Set.textContent = "停機";
    alertInfo_dataStatus_Set.textContent = "";
    valNow_dataStatus_Set = document.querySelector(".sysInfo #sysMode");
    valLightNow_dataStatus_Set = document.querySelector(".block_temp #spare_Light");
    option1_Description = "E-dReg";
    option2_Description = "停機";
}

const setBut_statusAllPCS = document.querySelector(".sysInfo #statusAllPCS_set");
setBut_statusAllPCS.addEventListener("click", Set_statusAllPCS);
function Set_statusAllPCS() {
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    title_dataStatus_Set.textContent = "PCS狀態設定";
    option1_dataStatus_Set.textContent = "全部投入";
    option2_dataStatus_Set.textContent = "全部切離";
    alertInfo_dataStatus_Set.textContent = "";
    valNow_dataStatus_Set = document.querySelector(".sysInfo #statusAllPCS");
    valLightNow_dataStatus_Set = document.querySelector(".block_temp #spare_Light");
    option1_Description = "全部投入";
    option2_Description = "全部切離";
}

const setBut_statusAllBMS = document.querySelector(".sysInfo #statusAllBMS_set");
setBut_statusAllBMS.addEventListener("click", Set_statusAllBMS);
function Set_statusAllBMS() {
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    title_dataStatus_Set.textContent = "電池狀態設定";
    option1_dataStatus_Set.textContent = "全部投入";
    option2_dataStatus_Set.textContent = "全部切離";
    alertInfo_dataStatus_Set.textContent = "";
    valNow_dataStatus_Set = document.querySelector(".sysInfo #statusAllBMS");
    valLightNow_dataStatus_Set = document.querySelector(".block_temp #spare_Light");
    option1_Description = "全部投入";
    option2_Description = "全部切離";
}

function Set_AutoMan_SS() {
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "投入";
    option2_dataStatus_Set.textContent = "切離";
    alertInfo_dataStatus_Set.textContent = "";
    option1_Description = "投入";
    option2_Description = "切離";
}

const setBut_AutoMan_SS1 = document.querySelector(".subSysInfo #AutoMan_SS1_set");
setBut_AutoMan_SS1.addEventListener("click", Set_AutoMan_SS1);
function Set_AutoMan_SS1() {
    Set_AutoMan_SS();
    title_dataStatus_Set.textContent = "子系統1運作模式";
    valNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS1");
    valLightNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS1_Light");
}

const setBut_AutoMan_SS2 = document.querySelector(".subSysInfo #AutoMan_SS2_set");
setBut_AutoMan_SS2.addEventListener("click", Set_AutoMan_SS2);
function Set_AutoMan_SS2() {
    Set_AutoMan_SS();
    title_dataStatus_Set.textContent = "子系統2運作模式";
    valNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS2");
    valLightNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS2_Light");
}

const setBut_AutoMan_SS3 = document.querySelector(".subSysInfo #AutoMan_SS3_set");
setBut_AutoMan_SS3.addEventListener("click", Set_AutoMan_SS3);
function Set_AutoMan_SS3() {
    Set_AutoMan_SS();
    title_dataStatus_Set.textContent = "子系統3運作模式";
    valNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS3");
    valLightNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS3_Light");
}

const setBut_AutoMan_SS4 = document.querySelector(".subSysInfo #AutoMan_SS4_set");
setBut_AutoMan_SS4.addEventListener("click", Set_AutoMan_SS4);
function Set_AutoMan_SS4() {
    Set_AutoMan_SS();
    title_dataStatus_Set.textContent = "子系統4運作模式";
    valNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS4");
    valLightNow_dataStatus_Set = document.querySelector(".subSysInfo #AutoMan_SS4_Light");
}

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
    if ((radioOption1.checked === true) || (radioOption2.checked === true)) {
        optionChecked_dataStatus_Set = document.querySelector(".dataStatus_Set [name=dataStatus]:checked");

        if (optionChecked_dataStatus_Set.value === "1") {
            valNow_dataStatus_Set.textContent = option1_Description;
            valLightNow_dataStatus_Set.classList.add("setToClose");
        } else if (optionChecked_dataStatus_Set.value === "2") {
            valNow_dataStatus_Set.textContent = option2_Description;
            valLightNow_dataStatus_Set.classList.remove("setToClose");
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

//////////////////////////////////////////////////////////////////////////////////////////////////

let freqMin = 5800;
let freqMax = 6100;
let powerMin = -1000;
let powerMax = 1000;
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

const setBut_freqVsP = document.querySelector(".EdReg #FvsP_set");
setBut_freqVsP.addEventListener("click", Set_freqVsP);
function Set_freqVsP() {
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
}

const closeWB_Yes_freqVsP = document.querySelector(".freqVsP_Set #closeWB_Yes");
closeWB_Yes_freqVsP.addEventListener("click", close_freqVsP_Yes);
function close_freqVsP_Yes() {
    let freq_A_raw = Math.round(Number(freq_A_Set.value) * 100);
    let freq_B_raw = Math.round(Number(freq_B_Set.value) * 100);
    let freq_C_raw = Math.round(Number(freq_C_Set.value) * 100);
    let freq_D_raw = Math.round(Number(freq_D_Set.value) * 100);
    let freq_E_raw = Math.round(Number(freq_E_Set.value) * 100);
    let freq_F_raw = Math.round(Number(freq_F_Set.value) * 100);
    let p_t_raw = Math.round(Number(p_t_Set.value) * 10);
    let p_u_raw = Math.round(Number(p_u_Set.value) * 10);
    let p_v_raw = Math.round(Number(p_v_Set.value) * 10);
    let p_w_raw = Math.round(Number(p_w_Set.value) * 10);
    let p_x_raw = Math.round(Number(p_x_Set.value) * 10);
    let p_y_raw = Math.round(Number(p_y_Set.value) * 10);

    if ((freq_A_raw >= freqMin) && (freq_A_raw <= freqMax) && (freq_B_raw >= freqMin) && (freq_B_raw <= freqMax) &&
        (freq_C_raw >= freqMin) && (freq_C_raw <= freqMax) && (freq_D_raw >= freqMin) && (freq_D_raw <= freqMax) &&
        (freq_E_raw >= freqMin) && (freq_E_raw <= freqMax) && (freq_F_raw >= freqMin) && (freq_F_raw <= freqMax) &&
        (p_t_raw >= powerMin) && (p_t_raw <= powerMax) && (p_u_raw >= powerMin) && (p_u_raw <= powerMax) && (p_v_raw >= powerMin) && (p_v_raw <= powerMax) &&
        (p_w_raw >= powerMin) && (p_w_raw <= powerMax) && (p_x_raw >= powerMin) && (p_x_raw <= powerMax) && (p_y_raw >= powerMin) && (p_y_raw <= powerMax)) {
        let val = freq_A_raw / 100;
        freq_A.textContent = val.toFixed(2);
        val = freq_B_raw / 100;
        freq_B.textContent = val.toFixed(2);
        val = freq_C_raw / 100;
        freq_C.textContent = val.toFixed(2);
        val = freq_D_raw / 100;
        freq_D.textContent = val.toFixed(2);
        val = freq_E_raw / 100;
        freq_E.textContent = val.toFixed(2);
        val = freq_F_raw / 100;
        freq_F.textContent = val.toFixed(2);
        val = p_t_raw / 10;
        p_t.textContent = val.toFixed(1);
        val = p_u_raw / 10;
        p_u.textContent = val.toFixed(1);
        val = p_v_raw / 10;
        p_v.textContent = val.toFixed(1);
        val = p_w_raw / 10;
        p_w.textContent = val.toFixed(1);
        val = p_x_raw / 10;
        p_x.textContent = val.toFixed(1);
        val = p_y_raw / 10;
        p_y.textContent = val.toFixed(1);

        window_freqVsP_Set.classList.remove("appear");
    } else {
        window_WrongDataSet.classList.add("appear");
    }
}

const closeWB_No_freqVsP = document.querySelector(".freqVsP_Set #closeWB_No");
closeWB_No_freqVsP.addEventListener("click", close_freqVsP_No);
function close_freqVsP_No() {
    window_freqVsP_Set.classList.remove("appear");
}

//////////////////////////////////////////////////////////////////////////////////////////////////

let socMin = 0;
let socMax = 1000;
let voltMin = 7000;
let voltMax = 15000;
const window_socRef_Set = document.querySelector(".socRef_Set");
const socMaxLimit = document.querySelector(".socRef_Set #socMax");
const socUpperB = document.querySelector(".socRef_Set #socUpperB");
const socLowerB = document.querySelector(".socRef_Set #socLowerB");
const socMinLimit = document.querySelector(".socRef_Set #socMin");
const voltMaxLimit = document.querySelector(".socRef_Set #voltMax");
const voltUpperB = document.querySelector(".socRef_Set #voltUpperB");
const voltLowerB = document.querySelector(".socRef_Set #voltLowerB");
const voltMinLimit = document.querySelector(".socRef_Set #voltMin");
const socMaxL = document.querySelector(".block_temp #spareVal_01");
const socUB = document.querySelector(".block_temp #spareVal_03");
const socLB = document.querySelector(".block_temp #spareVal_05");
const socMinL = document.querySelector(".block_temp #spareVal_07");
const voltMaxL = document.querySelector(".block_temp #spareVal_02");
const voltUB = document.querySelector(".block_temp #spareVal_04");
const voltLB = document.querySelector(".block_temp #spareVal_06");
const voltMinL = document.querySelector(".block_temp #spareVal_08");

const setBut_socRef = document.querySelector(".EdReg #SOC_Ref_set");
setBut_socRef.addEventListener("click", Set_socRef);
function Set_socRef() {
    window_socRef_Set.classList.add("appear");
    socMaxLimit.value = socMaxL.textContent;
    socUpperB.value = socUB.textContent;
    socLowerB.value = socLB.textContent;
    socMinLimit.value = socMinL.textContent;
    voltMaxLimit.value = voltMaxL.textContent;
    voltUpperB.value = voltUB.textContent;
    voltLowerB.value = voltLB.textContent;
    voltMinLimit.value = voltMinL.textContent;
}

const closeWB_Yes_socRef = document.querySelector(".socRef_Set #closeWB_Yes");
closeWB_Yes_socRef.addEventListener("click", close_socRef_Yes);
function close_socRef_Yes() {
    let SOC_max = Math.round(Number(socMaxLimit.value) * 10);
    let SOC_upperb = Math.round(Number(socUpperB.value) * 10);
    let SOC_lowerb = Math.round(Number(socLowerB.value) * 10);
    let SOC_min = Math.round(Number(socMinLimit.value) * 10);
    let Volt_max = Math.round(Number(voltMaxLimit.value) * 10);
    let Volt_upperb = Math.round(Number(voltUpperB.value) * 10);
    let Volt_lowerb = Math.round(Number(voltLowerB.value) * 10);
    let Volt_min = Math.round(Number(voltMinLimit.value) * 10);

    if ((SOC_max >= socMin) && (SOC_max <= socMax) && (SOC_upperb >= socMin) && (SOC_upperb <= socMax) &&
        (SOC_lowerb >= socMin) && (SOC_lowerb <= socMax) && (SOC_min >= socMin) && (SOC_min <= socMax) &&
        (Volt_max >= voltMin) && (Volt_max <= voltMax) && (Volt_upperb >= voltMin) && (Volt_upperb <= voltMax) &&
        (Volt_lowerb >= voltMin) && (Volt_lowerb <= voltMax) && (Volt_min >= voltMin) && (Volt_min <= voltMax)) {
        let val = SOC_max / 10;
        socMaxL.textContent = val.toFixed(1);
        val = SOC_upperb / 10;
        socUB.textContent = val.toFixed(1);
        val = SOC_lowerb / 10;
        socLB.textContent = val.toFixed(1);
        val = SOC_min / 10;
        socMinL.textContent = val.toFixed(1);
        val = Volt_max / 10;
        voltMaxL.textContent = val.toFixed(1);
        val = Volt_upperb / 10;
        voltUB.textContent = val.toFixed(1);
        val = Volt_lowerb / 10;
        voltLB.textContent = val.toFixed(1);
        val = Volt_min / 10;
        voltMinL.textContent = val.toFixed(1);

        window_socRef_Set.classList.remove("appear");
    } else {
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

// 
// 
// 
// 
// 
// 

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

const Freq_A_set = document.querySelector(".EdReg #Freq_A");
Freq_A_set.addEventListener("click", Set_Freq_A);
function Set_Freq_A() {
    let value_set_raw = prompt("請輸入設定值(58.00~61.00)：");
    if ((value_set_raw) && (value_set_raw !== null)) {               // value_set_raw !== (null || "") 有時會有問題
        let value_set = Math.round(Number(value_set_raw) * 100);
        if (value_set >= 5800 && value_set <= 6100) {
            let val = value_set / 100;
            Freq_A_set.textContent = val.toFixed(2);
        }
    }
}

const Freq_B_set = document.querySelector(".EdReg #Freq_B");
Freq_B_set.addEventListener("click", Set_Freq_B);
function Set_Freq_B() {
    let value_set_raw = prompt("請輸入設定值(58.00~61.00)：");
    if ((value_set_raw) && (value_set_raw !== null)) {
        let value_set = Math.round(Number(value_set_raw) * 100);
        if (value_set >= 5800 && value_set <= 6100) {
            let val = value_set / 100;
            Freq_B_set.textContent = val.toFixed(2);
        }
    }
}

const P_t_set = document.querySelector(".EdReg #P_t");
P_t_set.addEventListener("click", Set_P_t);
function Set_P_t() {
    let value_set_raw = prompt("請輸入設定值(-100.0~100.0)：");
    if ((value_set_raw) && (value_set_raw !== null)) {
        let value_set = Math.round(Number(value_set_raw) * 10);
        if (value_set >= -1000 && value_set <= 1000) {
            let val = value_set / 10;
            P_t_set.textContent = val.toFixed(1);
        }
    }
}

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
                min: -110.00,
                max: 110.00,
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
            ctx.fillText('F', chart.getDatasetMeta(1).data[6].x - left * 0.2, bottom - top * 0.25);

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


let refreshRate = 0.5;

document.addEventListener("DOMContentLoaded", afterLoadDCM);
function afterLoadDCM() {
    let schedule_02 = setInterval(update_freqVsP_Location, refreshRate * 1000);
    function update_freqVsP_Location() {
        const freq_t_1 = document.querySelector(".block_temp #spareVal_Freq");
        const power_t = document.querySelector(".block_temp #spareVal_P");

        let x_min = 59500;
        let x_max = 60500;
        let y_min = -1000;
        let y_max = 1000;
        const deltaFreq = 10;
        const deltaP = -40;

        let valFreq_t_1 = Number(freq_t_1.textContent);
        let valPower_t = Number(power_t.textContent);
        let Val_Freq;
        let Val_Power;

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

        freq_t_1.textContent = "" + Val_Freq;
        power_t.textContent = "" + Val_Power;

        cht_freqVsP.data.datasets[0].data[0].x = Val_Freq / 1000;
        cht_freqVsP.data.datasets[0].data[0].y = Val_Power / 10;

        cht_freqVsP.update();
    }
}

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

async function updateData(){   //更新資料
  var router = window.location.href + "/data";
  console.log(router);
  var data = await getData(router);
  console.log(data);
  $("#sysAvailability").text(data.sysAvailability);
  $("#SOC").text(data.SOC);
  $("#SBSPM").text(data.SBSPM);

  $("#sysMode").text(data.sysMode);
  $("#P_Project").text(data.P_Project);
  $("#P_LoadShift").text(data.P_LoadShift);
  $("#statusAllPCS").text(data.statusAllPCS);
  $("#statusAllBMS").text(data.statusAllBMS);
  $("#stopCHGsched").text(data.stopCHGsched);

  //E-dReg/////////////////////////////////////////////////////
  $("#Freq_A").text(data.Freq_A);
  $("#P_t").text(data.P_t);
  $("#Freq_B").text(data.Freq_B);
  $("#P_u").text(data.P_u);
  $("#Freq_C").text(data.Freq_C);
  $("#P_v").text(data.P_v);
  $("#Freq_D").text(data.Freq_D);
  $("#P_w").text(data.P_w);
  $("#Freq_E").text(data.Freq_E);
  $("#P_x").text(data.P_x);
  $("#Freq_F").text(data.Freq_F);
  $("#P_y").text(data.P_y);

  //子系統資訊/////////////////////////////////////////
  $("#P_base_SS1").text(data.P_base_SS1);
  $("#P_base_SS2").text(data.P_base_SS2);
  $("#P_base_SS3").text(data.P_base_SS3);
  $("#P_base_SS4").text(data.P_base_SS4);

  $("#Q_base_SS1").text(data.Q_base_SS1);
  $("#Q_base_SS2").text(data.Q_base_SS2);
  $("#Q_base_SS3").text(data.Q_base_SS3);
  $("#Q_base_SS4").text(data.Q_base_SS4);

  $("#AutoMan_SS1").text(data.AutoMan_SS1);
  $("#AutoMan_SS2").text(data.AutoMan_SS2);
  $("#AutoMan_SS3").text(data.AutoMan_SS3);
  $("#AutoMan_SS4").text(data.AutoMan_SS4);

  $("#BMSPCSstatus_SS1").text(data.BMSPCSstatus_SS1);
  $("#BMSPCSstatus_SS2").text(data.BMSPCSstatus_SS2);
  $("#BMSPCSstatus_SS3").text(data.BMSPCSstatus_SS3);
  $("#BMSPCSstatus_SS4").text(data.BMSPCSstatus_SS4);

  $("#Avail_SS1").text(data.Avail_SS1);
  $("#Avail_SS2").text(data.Avail_SS2);
  $("#Avail_SS3").text(data.Avail_SS3);
  $("#Avail_SS4").text(data.Avail_SS4);
  
  $("#EdReg_SS1").text(data.EdReg_SS1);
  $("#EdReg_SS2").text(data.EdReg_SS2);
  $("#EdReg_SS3").text(data.EdReg_SS3);
  $("#EdReg_SS4").text(data.EdReg_SS4);
}