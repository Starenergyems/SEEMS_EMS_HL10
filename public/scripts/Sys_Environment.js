// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";


const window_dataStatus_Set = document.querySelector(".dataStatus_Set");
const title_dataStatus_Set = document.querySelector(".dataStatus_Set .titlePUW");
const option1_dataStatus_Set = document.querySelector(".dataStatus_Set #option_1");
const option2_dataStatus_Set = document.querySelector(".dataStatus_Set #option_2");
const radioOption1 = document.querySelector(".dataStatus_Set #radioOpt_1");
const radioOption2 = document.querySelector(".dataStatus_Set #radioOpt_2");
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

function Set_acuOnOff() {
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    option1_dataStatus_Set.textContent = "啟動";
    option2_dataStatus_Set.textContent = "停止";
    alertInfo_dataStatus_Set.textContent = "";
    option1_Description = "啟動";
    option2_Description = "停止";
}

const setBut_acuOnOff_1 = document.querySelector(".environSC #setBut_acuOnOff_1");
setBut_acuOnOff_1.addEventListener("click", Set_acuOnOff_1);
function Set_acuOnOff_1() {
    Set_acuOnOff();
    title_dataStatus_Set.textContent = "LC1_空調啟停設定";
    valNow_dataStatus_Set = document.querySelector(".environSC #acuOnOff_1");
    // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
}

const setBut_acuOnOff_2 = document.querySelector(".environSC #setBut_acuOnOff_2");
setBut_acuOnOff_2.addEventListener("click", Set_acuOnOff_2);
function Set_acuOnOff_2() {
    Set_acuOnOff();
    title_dataStatus_Set.textContent = "LC2_空調啟停設定";
    valNow_dataStatus_Set = document.querySelector(".environSC #acuOnOff_2");
}

const setBut_acuOnOff_3 = document.querySelector(".environSC #setBut_acuOnOff_3");
setBut_acuOnOff_3.addEventListener("click", Set_acuOnOff_3);
function Set_acuOnOff_3() {
    Set_acuOnOff();
    title_dataStatus_Set.textContent = "LC3_空調啟停設定";
    valNow_dataStatus_Set = document.querySelector(".environSC #acuOnOff_3");
}

const setBut_acuOnOff_4 = document.querySelector(".environSC #setBut_acuOnOff_4");
setBut_acuOnOff_4.addEventListener("click", Set_acuOnOff_4);
function Set_acuOnOff_4() {
    Set_acuOnOff();
    title_dataStatus_Set.textContent = "LC4_空調啟停設定";
    valNow_dataStatus_Set = document.querySelector(".environSC #acuOnOff_4");
}

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
    if ((radioOption1.checked === true) || (radioOption2.checked === true)) {
        optionChecked_dataStatus_Set = document.querySelector(".dataStatus_Set [name=dataStatus]:checked");

        if (optionChecked_dataStatus_Set.value === "1") {
            valNow_dataStatus_Set.textContent = option1_Description;
            // valLightNow_dataStatus_Set.classList.add("setToClose");
        } else if (optionChecked_dataStatus_Set.value === "2") {
            valNow_dataStatus_Set.textContent = option2_Description;
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

function Set_acuTemp() {
    minLimit = "-100.0";
    maxLimit = "200.0";
    scale = 10;
    decPlace = 1;
    dataUnit = "°C";
    window_dataValue_Set.classList.add("appear");
    val_origin_dataValue_Set.textContent = valNow_dataValue_Set.textContent;
    unit_origin_dataValue_Set.textContent = dataUnit;
    unit_new_dataValue_Set.textContent = dataUnit;
    range_info_dataValue_Set.textContent = "數值範圍: " + minLimit + "~" + maxLimit + " " + dataUnit;
    val_new_dataValue_Set.focus();
}

const setBut_acuHeatT_1 = document.querySelector(".environSC #setBut_acuHeatT_1");
setBut_acuHeatT_1.addEventListener("click", Set_acuHeatT_1);
function Set_acuHeatT_1() {
    title_dataValue_Set.textContent = "LC1_空調制熱溫度";
    valNow_dataValue_Set = document.querySelector(".environSC #acuHeatT_1");       // 記得改點位的id
    Set_acuTemp();
}

const setBut_acuHeatT_2 = document.querySelector(".environSC #setBut_acuHeatT_2");
setBut_acuHeatT_2.addEventListener("click", Set_acuHeatT_2);
function Set_acuHeatT_2() {
    title_dataValue_Set.textContent = "LC2_空調制熱溫度";
    valNow_dataValue_Set = document.querySelector(".environSC #acuHeatT_2");       // 記得改點位的id
    Set_acuTemp();
}

const setBut_acuHeatT_3 = document.querySelector(".environSC #setBut_acuHeatT_3");
setBut_acuHeatT_3.addEventListener("click", Set_acuHeatT_3);
function Set_acuHeatT_3() {
    title_dataValue_Set.textContent = "LC3_空調制熱溫度";
    valNow_dataValue_Set = document.querySelector(".environSC #acuHeatT_3");       // 記得改點位的id
    Set_acuTemp();
}

const setBut_acuHeatT_4 = document.querySelector(".environSC #setBut_acuHeatT_4");
setBut_acuHeatT_4.addEventListener("click", Set_acuHeatT_4);
function Set_acuHeatT_4() {
    title_dataValue_Set.textContent = "LC4_空調制熱溫度";
    valNow_dataValue_Set = document.querySelector(".environSC #acuHeatT_4");       // 記得改點位的id
    Set_acuTemp();
}

const setBut_acuCoolT_1 = document.querySelector(".environSC #setBut_acuCoolT_1");
setBut_acuCoolT_1.addEventListener("click", Set_acuCoolT_1);
function Set_acuCoolT_1() {
    title_dataValue_Set.textContent = "LC1_空調制冷溫度";
    valNow_dataValue_Set = document.querySelector(".environSC #acuCoolT_1");       // 記得改點位的id
    Set_acuTemp();
}

const setBut_acuCoolT_2 = document.querySelector(".environSC #setBut_acuCoolT_2");
setBut_acuCoolT_2.addEventListener("click", Set_acuCoolT_2);
function Set_acuCoolT_2() {
    title_dataValue_Set.textContent = "LC2_空調制冷溫度";
    valNow_dataValue_Set = document.querySelector(".environSC #acuCoolT_2");       // 記得改點位的id
    Set_acuTemp();
}

const setBut_acuCoolT_3 = document.querySelector(".environSC #setBut_acuCoolT_3");
setBut_acuCoolT_3.addEventListener("click", Set_acuCoolT_3);
function Set_acuCoolT_3() {
    title_dataValue_Set.textContent = "LC3_空調制冷溫度";
    valNow_dataValue_Set = document.querySelector(".environSC #acuCoolT_3");       // 記得改點位的id
    Set_acuTemp();
}

const setBut_acuCoolT_4 = document.querySelector(".environSC #setBut_acuCoolT_4");
setBut_acuCoolT_4.addEventListener("click", Set_acuCoolT_4);
function Set_acuCoolT_4() {
    title_dataValue_Set.textContent = "LC4_空調制冷溫度";
    valNow_dataValue_Set = document.querySelector(".environSC #acuCoolT_4");       // 記得改點位的id
    Set_acuTemp();
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




