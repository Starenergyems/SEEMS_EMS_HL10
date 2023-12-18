// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

const ssNavBar_sNB_01 = document.querySelector(".subNavBar #sNB_01 .ssNavBar");
const ssNavBar_sNB_02 = document.querySelector(".subNavBar #sNB_02 .ssNavBar");
const ssNavBar_sNB_03 = document.querySelector(".subNavBar #sNB_03 .ssNavBar");

const dropDown_Logo_sNB_01 = document.querySelector(".subNavBar #dDL_sNB_01");
dropDown_Logo_sNB_01.addEventListener("click", showHide_ssNavBar1);
function showHide_ssNavBar1() {
  ssNavBar_sNB_01.classList.toggle("appear");
  ssNavBar_sNB_02.classList.remove("appear");
  ssNavBar_sNB_03.classList.remove("appear");
}

const dropDown_Logo_sNB_02 = document.querySelector(".subNavBar #dDL_sNB_02");
dropDown_Logo_sNB_02.addEventListener("click", showHide_ssNavBar2);
function showHide_ssNavBar2() {
  ssNavBar_sNB_02.classList.toggle("appear");
  ssNavBar_sNB_01.classList.remove("appear");
  ssNavBar_sNB_03.classList.remove("appear");
}

const dropDown_Logo_sNB_03 = document.querySelector(".subNavBar #dDL_sNB_03");
dropDown_Logo_sNB_03.addEventListener("click", showHide_ssNavBar3);
function showHide_ssNavBar3() {
  ssNavBar_sNB_03.classList.toggle("appear");
  ssNavBar_sNB_01.classList.remove("appear");
  ssNavBar_sNB_02.classList.remove("appear");
}

document.addEventListener("click", hide_ssNavBar);
function hide_ssNavBar(clickItem) {
  if (
    clickItem.target.id !== "dDL_sNB_01" &&
    clickItem.target.id !== "dDL_sNB_02" &&
    clickItem.target.id !== "dDL_sNB_03"
  ) {
    ssNavBar_sNB_01.classList.remove("appear");
    ssNavBar_sNB_02.classList.remove("appear");
    ssNavBar_sNB_03.classList.remove("appear");
  }
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
const val_origin_dataValue_Set = document.querySelector(
  ".dataValue_Set #valueOrigin"
);
const unit_origin_dataValue_Set = document.querySelector(
  ".dataValue_Set .valOrigin .data_unit"
);
const unit_new_dataValue_Set = document.querySelector(
  ".dataValue_Set .valNew .data_unit"
);
const range_info_dataValue_Set = document.querySelector(
  ".dataValue_Set .rangeInfo"
);
const val_new_dataValue_Set = document.querySelector(
  ".dataValue_Set #valueNew"
);

function Set_P_LC() {
  minLimit = "-5000";
  maxLimit = "5000";
  scale = 1;
  decPlace = 0;
  dataUnit = "kW";
  window_dataValue_Set.classList.add("appear");
  val_origin_dataValue_Set.textContent = valNow_dataValue_Set.textContent;
  unit_origin_dataValue_Set.textContent = dataUnit;
  unit_new_dataValue_Set.textContent = dataUnit;
  range_info_dataValue_Set.textContent =
    "數值範圍: " + minLimit + "~" + maxLimit + " " + dataUnit;
  val_new_dataValue_Set.focus();
}

const setBut_P_LC1 = document.querySelector(".infoLC #setBut_P_LC1");
setBut_P_LC1.addEventListener("click", Set_P_LC1);
function Set_P_LC1() {
  title_dataValue_Set.textContent = "LC1_實功輸出設定";
  valNow_dataValue_Set = document.querySelector(".block_temp #spareVal_01"); // 記得改點位的id
  Set_P_LC();
}

const setBut_P_LC2 = document.querySelector(".infoLC #setBut_P_LC2");
setBut_P_LC2.addEventListener("click", Set_P_LC2);
function Set_P_LC2() {
  title_dataValue_Set.textContent = "LC2_實功輸出設定";
  valNow_dataValue_Set = document.querySelector(".block_temp #spareVal_02"); // 記得改點位的id
  Set_P_LC();
}

const setBut_P_LC3 = document.querySelector(".infoLC #setBut_P_LC3");
setBut_P_LC3.addEventListener("click", Set_P_LC3);
function Set_P_LC3() {
  title_dataValue_Set.textContent = "LC3_實功輸出設定";
  valNow_dataValue_Set = document.querySelector(".block_temp #spareVal_03"); // 記得改點位的id
  Set_P_LC();
}

const setBut_P_LC4 = document.querySelector(".infoLC #setBut_P_LC4");
setBut_P_LC4.addEventListener("click", Set_P_LC4);
function Set_P_LC4() {
  title_dataValue_Set.textContent = "LC4_實功輸出設定";
  valNow_dataValue_Set = document.querySelector(".block_temp #spareVal_04"); // 記得改點位的id
  Set_P_LC();
}

const closeWB_Yes_dVS = document.querySelector(".dataValue_Set #closeWB_Yes");
closeWB_Yes_dVS.addEventListener("click", closePopup_dVS_Yes);
function closePopup_dVS_Yes() {
  let value_set_raw = val_new_dataValue_Set.value;
  if (value_set_raw && value_set_raw !== null) {
    let value_set = Math.round(Number(value_set_raw) * scale);
    if (
      value_set >= Number(minLimit) * scale &&
      value_set <= Number(maxLimit) * scale
    ) {
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

/////////////////////////////////////////////////////////////////////////

const window_dataStatus_Set = document.querySelector(".dataStatus_Set");
const title_dataStatus_Set = document.querySelector(
  ".dataStatus_Set .titlePUW"
);
const option1_dataStatus_Set = document.querySelector(
  ".dataStatus_Set #option_1"
);
const option2_dataStatus_Set = document.querySelector(
  ".dataStatus_Set #option_2"
);
const option3_dataStatus_Set = document.querySelector(
  ".dataStatus_Set #option_3"
);
const radioOption1 = document.querySelector(".dataStatus_Set #radioOpt_1");
const radioOption2 = document.querySelector(".dataStatus_Set #radioOpt_2");
const radioOption3 = document.querySelector(".dataStatus_Set #radioOpt_3");
const alertInfo_dataStatus_Set = document.querySelector(
  ".dataStatus_Set .alertInfo"
);
let valNow_dataStatus_Set;
// let valLightNow_dataStatus_Set;
let option1_Description;
let option2_Description;
let option3_Description;
let optionChecked_dataStatus_Set;

function clearCheckedRadioOption() {
  radioOption1.checked = false;
  radioOption2.checked = false;
  radioOption3.checked = false;
}

function Set_modeActPas_LC() {
  window_dataStatus_Set.classList.add("appear");
  clearCheckedRadioOption();
  option1_dataStatus_Set.textContent = "主動";
  option2_dataStatus_Set.textContent = "被動";
  alertInfo_dataStatus_Set.textContent = "";
  option1_Description = "主動";
  option2_Description = "被動";

  window_dataStatus_Set.classList.remove("threeOptions");
}

const setBut_modeActPas_LC1 = document.querySelector(
  ".infoLC #setBut_modeAP_LC1"
);
setBut_modeActPas_LC1.addEventListener("click", Set_modeActPas_LC1);
function Set_modeActPas_LC1() {
  Set_modeActPas_LC();
  title_dataStatus_Set.textContent = "LC1_主/被動模式";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeActPas_LC1");
  // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
}

const setBut_modeActPas_LC2 = document.querySelector(
  ".infoLC #setBut_modeAP_LC2"
);
setBut_modeActPas_LC2.addEventListener("click", Set_modeActPas_LC2);
function Set_modeActPas_LC2() {
  Set_modeActPas_LC();
  title_dataStatus_Set.textContent = "LC2_主/被動模式";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeActPas_LC2");
}

const setBut_modeActPas_LC3 = document.querySelector(
  ".infoLC #setBut_modeAP_LC3"
);
setBut_modeActPas_LC3.addEventListener("click", Set_modeActPas_LC3);
function Set_modeActPas_LC3() {
  Set_modeActPas_LC();
  title_dataStatus_Set.textContent = "LC3_主/被動模式";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeActPas_LC3");
}

const setBut_modeActPas_LC4 = document.querySelector(
  ".infoLC #setBut_modeAP_LC4"
);
setBut_modeActPas_LC4.addEventListener("click", Set_modeActPas_LC4);
function Set_modeActPas_LC4() {
  Set_modeActPas_LC();
  title_dataStatus_Set.textContent = "LC4_主/被動模式";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeActPas_LC4");
}

/////////////////////////////////////////////////////////////////////////

function Set_standbyCmd_LC() {
  window_dataStatus_Set.classList.add("appear");
  clearCheckedRadioOption();
  option1_dataStatus_Set.textContent = "待機";
  option2_dataStatus_Set.textContent = "停止待機";
  alertInfo_dataStatus_Set.textContent = "";
  // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
  option1_Description = "待機";
  option2_Description = "停止待機";

  window_dataStatus_Set.classList.remove("threeOptions");
}

const setBut_standbyCmd_LC1 = document.querySelector(
  ".infoLC #setBut_standbyCmd_LC1"
);
setBut_standbyCmd_LC1.addEventListener("click", Set_standbyCmd_LC1);
function Set_standbyCmd_LC1() {
  Set_standbyCmd_LC();
  title_dataStatus_Set.textContent = "LC1_PCS待機指令";
  valNow_dataStatus_Set = document.querySelector(".infoLC #standbyCmd_LC1");
}

const setBut_standbyCmd_LC2 = document.querySelector(
  ".infoLC #setBut_standbyCmd_LC2"
);
setBut_standbyCmd_LC2.addEventListener("click", Set_standbyCmd_LC2);
function Set_standbyCmd_LC2() {
  Set_standbyCmd_LC();
  title_dataStatus_Set.textContent = "LC2_PCS待機指令";
  valNow_dataStatus_Set = document.querySelector(".infoLC #standbyCmd_LC2");
}

const setBut_standbyCmd_LC3 = document.querySelector(
  ".infoLC #setBut_standbyCmd_LC3"
);
setBut_standbyCmd_LC3.addEventListener("click", Set_standbyCmd_LC3);
function Set_standbyCmd_LC3() {
  Set_standbyCmd_LC();
  title_dataStatus_Set.textContent = "LC3_PCS待機指令";
  valNow_dataStatus_Set = document.querySelector(".infoLC #standbyCmd_LC3");
}

const setBut_standbyCmd_LC4 = document.querySelector(
  ".infoLC #setBut_standbyCmd_LC4"
);
setBut_standbyCmd_LC4.addEventListener("click", Set_standbyCmd_LC4);
function Set_standbyCmd_LC4() {
  Set_standbyCmd_LC();
  title_dataStatus_Set.textContent = "LC4_PCS待機指令";
  valNow_dataStatus_Set = document.querySelector(".infoLC #standbyCmd_LC4");
}

/////////////////////////////////////////////////////////////////////////

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
  if (
    radioOption1.checked === true ||
    radioOption2.checked === true ||
    radioOption3.checked === true
  ) {
    optionChecked_dataStatus_Set = document.querySelector(
      ".dataStatus_Set [name=dataStatus]:checked"
    );

    if (optionChecked_dataStatus_Set.value === "1") {
      valNow_dataStatus_Set.textContent = option1_Description;
      // valLightNow_dataStatus_Set.classList.add("setToClose");
    } else if (optionChecked_dataStatus_Set.value === "2") {
      valNow_dataStatus_Set.textContent = option2_Description;
      // valLightNow_dataStatus_Set.classList.remove("setToClose");
    } else if (optionChecked_dataStatus_Set.value === "3") {
      valNow_dataStatus_Set.textContent = option3_Description;
      // valLightNow_dataStatus_Set.classList.remove("setToClose");
    }

    optionChecked_dataStatus_Set.checked = false;
  }
  window_dataStatus_Set.classList.remove("appear", "threeOptions");
}

const closeWB_No_dSS = document.querySelector(".dataStatus_Set #closeWB_No");
closeWB_No_dSS.addEventListener("click", closePopup_dSS_No);
function closePopup_dSS_No() {
  radioOption1.checked = false;
  radioOption2.checked = false;
  radioOption3.checked = false;
  window_dataStatus_Set.classList.remove("appear", "threeOptions");
}

/////////////////////////////////////////////////////////////////////////

function Set_modeQctrl_LC() {
  window_dataStatus_Set.classList.add("appear", "threeOptions");
  clearCheckedRadioOption();
  option1_dataStatus_Set.textContent = "功率(kVar)模式";
  option2_dataStatus_Set.textContent = "功因模式";
  option3_dataStatus_Set.textContent = "關閉";
  alertInfo_dataStatus_Set.textContent = "";
  // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
  option1_Description = "功率(kVar)模式";
  option2_Description = "功因模式";
  option3_Description = "關閉";
}

const setBut_modeQctrl_LC1 = document.querySelector(
  ".infoLC #setBut_modeQctrl_LC1"
);
setBut_modeQctrl_LC1.addEventListener("click", Set_modeQctrl_LC1);
function Set_modeQctrl_LC1() {
  Set_modeQctrl_LC();
  title_dataStatus_Set.textContent = "LC1_虛功模式設定";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeQctrl_LC1");
}

const setBut_modeQctrl_LC2 = document.querySelector(
  ".infoLC #setBut_modeQctrl_LC2"
);
setBut_modeQctrl_LC2.addEventListener("click", Set_modeQctrl_LC2);
function Set_modeQctrl_LC2() {
  Set_modeQctrl_LC();
  title_dataStatus_Set.textContent = "LC2_虛功模式設定";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeQctrl_LC2");
}

const setBut_modeQctrl_LC3 = document.querySelector(
  ".infoLC #setBut_modeQctrl_LC3"
);
setBut_modeQctrl_LC3.addEventListener("click", Set_modeQctrl_LC3);
function Set_modeQctrl_LC3() {
  Set_modeQctrl_LC();
  title_dataStatus_Set.textContent = "LC3_虛功模式設定";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeQctrl_LC3");
}

const setBut_modeQctrl_LC4 = document.querySelector(
  ".infoLC #setBut_modeQctrl_LC4"
);
setBut_modeQctrl_LC4.addEventListener("click", Set_modeQctrl_LC4);
function Set_modeQctrl_LC4() {
  Set_modeQctrl_LC();
  title_dataStatus_Set.textContent = "LC4_虛功模式設定";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeQctrl_LC4");
}

/////////////////////////////////////////////////////////////////////////

function Set_modeLR_LC() {
  window_dataStatus_Set.classList.add("appear", "threeOptions");
  clearCheckedRadioOption();
  option1_dataStatus_Set.textContent = "本地 & 遠端";
  option2_dataStatus_Set.textContent = "遠端";
  option3_dataStatus_Set.textContent = "本地";
  alertInfo_dataStatus_Set.textContent = "";
  // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
  option1_Description = "本地 & 遠端";
  option2_Description = "遠端";
  option3_Description = "本地";
}

const setBut_modeLR_LC1 = document.querySelector(".infoLC #setBut_modeLR_LC1");
setBut_modeLR_LC1.addEventListener("click", Set_modeLR_LC1);
function Set_modeLR_LC1() {
  Set_modeLR_LC();
  title_dataStatus_Set.textContent = "LC1_本地/遠端模式";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeLR_LC1");
}

const setBut_modeLR_LC2 = document.querySelector(".infoLC #setBut_modeLR_LC2");
setBut_modeLR_LC2.addEventListener("click", Set_modeLR_LC2);
function Set_modeLR_LC2() {
  Set_modeLR_LC();
  title_dataStatus_Set.textContent = "LC2_本地/遠端模式";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeLR_LC2");
}

const setBut_modeLR_LC3 = document.querySelector(".infoLC #setBut_modeLR_LC3");
setBut_modeLR_LC3.addEventListener("click", Set_modeLR_LC3);
function Set_modeLR_LC3() {
  Set_modeLR_LC();
  title_dataStatus_Set.textContent = "LC3_本地/遠端模式";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeLR_LC3");
}

const setBut_modeLR_LC4 = document.querySelector(".infoLC #setBut_modeLR_LC4");
setBut_modeLR_LC4.addEventListener("click", Set_modeLR_LC4);
function Set_modeLR_LC4() {
  Set_modeLR_LC();
  title_dataStatus_Set.textContent = "LC4_本地/遠端模式";
  valNow_dataStatus_Set = document.querySelector(".infoLC #modeLR_LC4");
}
