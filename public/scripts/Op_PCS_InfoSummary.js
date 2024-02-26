//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {
  console.log("start reading js");
  classAdd("#nB_Operation","default_nB");
  updateData();
});

setInterval(updateData, 5000);
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
  if (clickItem.target.id !== "dDL_sNB_01" && clickItem.target.id !== "dDL_sNB_02" && clickItem.target.id !== "dDL_sNB_03") {
    ssNavBar_sNB_01.classList.remove("appear");
    ssNavBar_sNB_02.classList.remove("appear");
    ssNavBar_sNB_03.classList.remove("appear");
  }
}

/////////////////////////////////////////////////////////////////////////

let dVS_Data_dataName;

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

// function Set_P_LC(dataName, numInDataGroup) {
//   minLimit = "-5000";
//   maxLimit = "5000";
//   scale = 1;
//   decPlace = 0;
//   dataUnit = "kW";
//   window_dataValue_Set.classList.add("appear");

//   get_dVS_Data_WhenClicking(dataName, numInDataGroup);

//   val_origin_dataValue_Set.textContent = valNow_dataValue_Set.textContent;
//   unit_origin_dataValue_Set.textContent = dataUnit;
//   unit_new_dataValue_Set.textContent = dataUnit;
//   range_info_dataValue_Set.textContent =
//     "數值範圍: " + minLimit + "~" + maxLimit + " " + dataUnit;
//   val_new_dataValue_Set.focus();
// }

async function Set_P_LC(numInDataGroup) {
  dVS_Data_dataName = "setBut_P_LC";

  title_dataValue_Set.textContent = `LC${numInDataGroup}_實功輸出設定`;
  window_dataValue_Set.classList.add("appear");

  let getData = await get_dVS_Data_WhenClicking(dVS_Data_dataName, numInDataGroup);
  console.log("qaz123");
  console.log(getData);
  console.log("qwe456");
  val_origin_dataValue_Set.textContent = getData.originData;
  unit_origin_dataValue_Set.textContent = getData.unit;
  unit_new_dataValue_Set.textContent = getData.unit;
  range_info_dataValue_Set.textContent = getData.dataRange;

  val_new_dataValue_Set.focus();
}

// async function get_dVS_Data_WhenClicking(dataName, numInDataGroup) {
//   try {
//     console.log("嘗試向後端發出請求");
//     const response = await fetch("/get_dVS_Data_WhenClicking", {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ dataName, numInDataGroup }),
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// async function set_dVS_Data(setValue) {
//   try {
//     console.log("嘗試向後端發出請求");
//     const response = await fetch("/set_dVS_Data", {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ setValue }),
//     });

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

const setBut_P_LC1 = document.querySelector(".infoLC #setBut_P_LC1");
setBut_P_LC1.addEventListener("click", function () { Set_P_LC(1); });
// setBut_P_LC1.addEventListener("click", Set_P_LC1);
// function Set_P_LC1() {
//   title_dataValue_Set.textContent = "LC1_實功輸出設定";
//   valNow_dataValue_Set = document.querySelector(".block_temp #spareVal_01"); // 記得改點位的id
//   Set_P_LC("setBut_P_LC", 1);
// }

const setBut_P_LC2 = document.querySelector(".infoLC #setBut_P_LC2");
setBut_P_LC2.addEventListener("click", function () { Set_P_LC(2); });

const setBut_P_LC3 = document.querySelector(".infoLC #setBut_P_LC3");
setBut_P_LC3.addEventListener("click", function () { Set_P_LC(3); });

const setBut_P_LC4 = document.querySelector(".infoLC #setBut_P_LC4");
setBut_P_LC4.addEventListener("click", function () { Set_P_LC(4); });

const closeWB_Yes_dVS = document.querySelector(".dataValue_Set #closeWB_Yes");
closeWB_Yes_dVS.addEventListener("click", closePopup_dVS_Yes);
function closePopup_dVS_Yes() {
  let value_set_raw = val_new_dataValue_Set.value;
  // if (value_set_raw && value_set_raw !== null) {
  //   let value_set = Math.round(Number(value_set_raw) * scale);
  //   if (
  //     value_set >= Number(minLimit) * scale &&
  //     value_set <= Number(maxLimit) * scale
  //   ) {
  //     let val = value_set / scale;
  //     valNow_dataValue_Set.textContent = val.toFixed(decPlace);
  //   }
  // }

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

/////////////////////////////////////////////////////////////////////////

const window_dataStatus_Set = document.querySelector(".dataStatus_Set");
const title_dataStatus_Set = document.querySelector(".dataStatus_Set .titlePUW");
const option1_dataStatus_Set = document.querySelector(".dataStatus_Set #option_1");
const option2_dataStatus_Set = document.querySelector(".dataStatus_Set #option_2");
const option3_dataStatus_Set = document.querySelector(".dataStatus_Set #option_3");
const radioOption1 = document.querySelector(".dataStatus_Set #radioOpt_1");
const radioOption2 = document.querySelector(".dataStatus_Set #radioOpt_2");
const radioOption3 = document.querySelector(".dataStatus_Set #radioOpt_3");
const alertInfo_dataStatus_Set = document.querySelector(".dataStatus_Set .alertInfo");
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

// function Set_modeActPas_LC() {
//   window_dataStatus_Set.classList.add("appear");
//   clearCheckedRadioOption();
//   option1_dataStatus_Set.textContent = "主動";
//   option2_dataStatus_Set.textContent = "被動";
//   alertInfo_dataStatus_Set.textContent = "";
//   option1_Description = "主動";
//   option2_Description = "被動";

//   window_dataStatus_Set.classList.remove("threeOptions");
// }

let qSelectAll_option = document.querySelectorAll(".dataStatus_Set .option");
let qSelectAll_radioOpt = document.querySelectorAll(".dataStatus_Set .radioOpt");
let i;

async function Set_modeActPas_LC(numInDataGroup) {
  dataName = "setBut_modeAP";

  title_dataStatus_Set.textContent = `LC${numInDataGroup}_主/被動模式`;
  window_dataStatus_Set.classList.add("appear");
  window_dataStatus_Set.classList.remove("threeOptions");
  clearCheckedRadioOption();

  let getData = await get_dSS_Data_WhenClicking(dataName, numInDataGroup);
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

// async function get_dSS_Data_WhenClicking(dataName, numInDataGroup) {
//   try {
//     console.log("嘗試向後端發出請求");
//     const response = await fetch("/get_dSS_Data_WhenClicking", {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ dataName, numInDataGroup }),
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// async function set_dSS_Data(setValue) {
//   try {
//     console.log("嘗試向後端發出請求");
//     const response = await fetch("/set_dSS_Data", {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ setValue }),
//     });

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

const setBut_modeActPas_LC1 = document.querySelector(".infoLC #setBut_modeAP_LC1");
setBut_modeActPas_LC1.addEventListener("click", function () { Set_modeActPas_LC(1); });
// setBut_modeActPas_LC1.addEventListener("click", Set_modeActPas_LC1);
// function Set_modeActPas_LC1() {
//   Set_modeActPas_LC();
//   title_dataStatus_Set.textContent = "LC1_主/被動模式";
//   valNow_dataStatus_Set = document.querySelector(".infoLC #modeActPas_LC1");
//   // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
// }

const setBut_modeActPas_LC2 = document.querySelector(".infoLC #setBut_modeAP_LC2");
setBut_modeActPas_LC2.addEventListener("click", function () { Set_modeActPas_LC(2); });

const setBut_modeActPas_LC3 = document.querySelector(".infoLC #setBut_modeAP_LC3");
setBut_modeActPas_LC3.addEventListener("click", function () { Set_modeActPas_LC(3); });

const setBut_modeActPas_LC4 = document.querySelector(".infoLC #setBut_modeAP_LC4");
setBut_modeActPas_LC4.addEventListener("click", function () { Set_modeActPas_LC(4); });

/////////////////////////////////////////////////////////////////////////

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
  if (radioOption1.checked === true || radioOption2.checked === true || radioOption3.checked === true) {
    optionChecked_dataStatus_Set = document.querySelector(".dataStatus_Set [name=dataStatus]:checked");

    set_dSS_Data(optionChecked_dataStatus_Set.value);

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

// function Set_modeQctrl_LC() {
//   window_dataStatus_Set.classList.add("appear", "threeOptions");
//   clearCheckedRadioOption();
//   option1_dataStatus_Set.textContent = "功率(kVar)模式";
//   option2_dataStatus_Set.textContent = "功因模式";
//   option3_dataStatus_Set.textContent = "關閉";
//   alertInfo_dataStatus_Set.textContent = "";
//   // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
//   option1_Description = "功率(kVar)模式";
//   option2_Description = "功因模式";
//   option3_Description = "關閉";
// }

async function Set_modeQctrl_LC(numInDataGroup) {
  dataName = "setBut_modeQctrl";

  title_dataStatus_Set.textContent = `LC${numInDataGroup}_虛功模式設定`;
  window_dataStatus_Set.classList.add("appear", "threeOptions");
  clearCheckedRadioOption();

  let getData = await get_dSS_Data_WhenClicking(dataName, numInDataGroup);
  console.log(getData);

  for (i = 0; i < Object.keys(getData.status_MT).length; i++) {
    qSelectAll_option[i].textContent = getData.status_MT[Object.keys(getData.status_MT)[i]];
    qSelectAll_radioOpt[i].setAttribute("value", Object.keys(getData.status_MT)[i]);

    if (Object.keys(getData.status_MT)[i].slice(1) === getData.originData) {
      qSelectAll_radioOpt[i].checked = true;
    }
  }

  alertInfo_dataStatus_Set.textContent = "";
}

const setBut_modeQctrl_LC1 = document.querySelector(".infoLC #setBut_modeQctrl_LC1");
setBut_modeQctrl_LC1.addEventListener("click", function () { Set_modeQctrl_LC(1); });
// setBut_modeQctrl_LC1.addEventListener("click", Set_modeQctrl_LC1);
// function Set_modeQctrl_LC1() {
//   Set_modeQctrl_LC();
//   title_dataStatus_Set.textContent = "LC1_虛功模式設定";
//   valNow_dataStatus_Set = document.querySelector(".infoLC #modeQctrl_LC1");
// }

const setBut_modeQctrl_LC2 = document.querySelector(".infoLC #setBut_modeQctrl_LC2");
setBut_modeQctrl_LC2.addEventListener("click", function () { Set_modeQctrl_LC(2); });

const setBut_modeQctrl_LC3 = document.querySelector(".infoLC #setBut_modeQctrl_LC3");
setBut_modeQctrl_LC3.addEventListener("click", function () { Set_modeQctrl_LC(3); });

const setBut_modeQctrl_LC4 = document.querySelector(".infoLC #setBut_modeQctrl_LC4");
setBut_modeQctrl_LC4.addEventListener("click", function () { Set_modeQctrl_LC(4); });

/////////////////////////////////////////////////////////////////////////

async function Set_standbyCmd_LC(numInDataGroup) {
  dataName = "setBut_standbyCmd";

  title_dataStatus_Set.textContent = `LC${numInDataGroup}_PCS待機指令`;
  window_dataStatus_Set.classList.add("appear");
  window_dataStatus_Set.classList.remove("threeOptions");
  clearCheckedRadioOption();

  let getData = await get_dSS_Data_WhenClicking(dataName, numInDataGroup);
  console.log(getData);

  for (i = 0; i < Object.keys(getData.status_MT).length; i++) {
    qSelectAll_option[i].textContent = getData.status_MT[Object.keys(getData.status_MT)[i]];
    qSelectAll_radioOpt[i].setAttribute("value", Object.keys(getData.status_MT)[i]);

    if (Object.keys(getData.status_MT)[i].slice(1) === getData.originData) {
      qSelectAll_radioOpt[i].checked = true;
    }
  }

  alertInfo_dataStatus_Set.textContent = "";
}

const setBut_standbyCmd_LC1 = document.querySelector(".infoLC #setBut_standbyCmd_LC1");
setBut_standbyCmd_LC1.addEventListener("click", function () { Set_standbyCmd_LC(1); });

const setBut_standbyCmd_LC2 = document.querySelector(".infoLC #setBut_standbyCmd_LC2");
setBut_standbyCmd_LC2.addEventListener("click", function () { Set_standbyCmd_LC(2); });

const setBut_standbyCmd_LC3 = document.querySelector(".infoLC #setBut_standbyCmd_LC3");
setBut_standbyCmd_LC3.addEventListener("click", function () { Set_standbyCmd_LC(3); });

const setBut_standbyCmd_LC4 = document.querySelector(".infoLC #setBut_standbyCmd_LC4");
setBut_standbyCmd_LC4.addEventListener("click", function () { Set_standbyCmd_LC(4); });

/////////////////////////////////////////////////////////////////////////

async function Set_modeLR_LC(numInDataGroup) {
  dataName = "setBut_modeLR";

  title_dataStatus_Set.textContent = `LC${numInDataGroup}_本地/遠端模式`;
  window_dataStatus_Set.classList.add("appear", "threeOptions");
  clearCheckedRadioOption();

  let getData = await get_dSS_Data_WhenClicking(dataName, numInDataGroup);
  console.log(getData);

  for (i = 0; i < Object.keys(getData.status_MT).length; i++) {
    qSelectAll_option[i].textContent = getData.status_MT[Object.keys(getData.status_MT)[i]];
    qSelectAll_radioOpt[i].setAttribute("value", Object.keys(getData.status_MT)[i]);

    if (Object.keys(getData.status_MT)[i].slice(1) === getData.originData) {
      qSelectAll_radioOpt[i].checked = true;
    }
  }

  alertInfo_dataStatus_Set.textContent = "";
}

const setBut_modeLR_LC1 = document.querySelector(".infoLC #setBut_modeLR_LC1");
setBut_modeLR_LC1.addEventListener("click", function () { Set_modeLR_LC(1); });

const setBut_modeLR_LC2 = document.querySelector(".infoLC #setBut_modeLR_LC2");
setBut_modeLR_LC2.addEventListener("click", function () { Set_modeLR_LC(2); });

const setBut_modeLR_LC3 = document.querySelector(".infoLC #setBut_modeLR_LC3");
setBut_modeLR_LC3.addEventListener("click", function () { Set_modeLR_LC(3); });

const setBut_modeLR_LC4 = document.querySelector(".infoLC #setBut_modeLR_LC4");
setBut_modeLR_LC4.addEventListener("click", function () { Set_modeLR_LC(4); });

async function updateData() {
  //更新資料
  var router = window.location.href + "/data";
  console.log(router);
  var data = await getData(router);
  console.log(data);
  $("#workStatus").text(data.workStatus);
  $("#onlineNum").text(data.onlineNum);
  $("#totalP").text(data.totalP);
  $("#totalQ").text(data.totalQ);
  $("#totalRatedP").text(data.totalRatedP);
  $("#today_E_chg").text(data.today_E_chg);
  $("#today_E_dcg").text(data.today_E_dcg);
  $("#tot_E_chg").text(data.tot_E_chg);
  $("#tot_E_dcg").text(data.tot_E_dcg);
  /*LC1******************************************** */
  $("#onlineNum_LC1").text(data.onlineNum_LC1);
  $("#ratedP_LC1").text(data.ratedP_LC1);
  $("#activePower_LC1").text(data.activePower_LC1);
  $("#reactivePower_LC1").text(data.reactivePower_LC1);
  $("#today_E_chg_LC1").text(data.today_E_chg_LC1);
  $("#today_E_dcg_LC1").text(data.today_E_dcg_LC1);
  $("#tot_E_chg_LC1").text(data.tot_E_chg_LC1);
  $("#tot_E_dcg_LC1").text(data.tot_E_dcg_LC1);
  /*告警/故障********************************************** */
  if (data.alarm_PCS1_1 > 0) {
    classAdd("#alarm_PCS1-1", "setToClose");
  } else {
    classRemove("#alarm_PCS1-1", "setToClose");
  }
  if (data.alarm_PCS1_2 > 0) {
    classAdd("#alarm_PCS1-2", "setToClose");
  } else {
    classRemove("#alarm_PCS1-2", "setToClose");
  }
  if (data.fault_PCS1_1 > 0) {
    classAdd("#fault_PCS1-1", "setToClose");
  } else {
    classRemove("#fault_PCS1-1", "setToClose");
  }
  if (data.fault_PCS1_2 > 0) {
    classAdd("#fault_PCS1-2", "setToClose");
  } else {
    classRemove("#fault_PCS1-2", "setToClose");
  }

  $("#modeActPas_LC1").text(data.modeActPas_LC1);
  $("#modeQctrl_LC1").text(data.modeQctrl_LC1);
  $("#standbyCmd_LC1").text(data.standbyCmd_LC1);
  $("#modeLR_LC1").text(data.modeLR_LC1);
  /*LC2************************************************* */
  $("#onlineNum_LC2").text(data.onlineNum_LC2);
  $("#ratedP_LC2").text(data.ratedP_LC2);
  $("#activePower_LC2").text(data.activePower_LC2);
  $("#reactivePower_LC2").text(data.reactivePower_LC2);
  $("#today_E_chg_LC2").text(data.today_E_chg_LC2);
  $("#today_E_dcg_LC2").text(data.today_E_dcg_LC2);
  $("#tot_E_chg_LC2").text(data.tot_E_chg_LC2);
  $("#tot_E_dcg_LC2").text(data.tot_E_dcg_LC2);
  /*告警/故障********************************************** */
  if (data.alarm_PCS2_1 > 0) {
    classAdd("#alarm_PCS2-1", "setToClose");
  } else {
    classRemove("#alarm_PCS2-1", "setToClose");
  }
  if (data.alarm_PCS2_2 > 0) {
    classAdd("#alarm_PCS2-2", "setToClose");
  } else {
    classRemove("#alarm_PCS2-2", "setToClose");
  }
  if (data.fault_PCS2_1 > 0) {
    classAdd("#fault_PCS2-1", "setToClose");
  } else {
    classRemove("#fault_PCS2-1", "setToClose");
  }
  if (data.fault_PCS2_2 > 0) {
    classAdd("#fault_PCS2-2", "setToClose");
  } else {
    classRemove("#fault_PCS2-2", "setToClose");
  }

  $("#modeActPas_LC2").text(data.modeActPas_LC2);
  $("#modeQctrl_LC2").text(data.modeQctrl_LC2);
  $("#standbyCmd_LC2").text(data.standbyCmd_LC2);
  $("#modeLR_LC2").text(data.modeLR_LC2);

   /*LC3************************************************* */
   $("#onlineNum_LC3").text(data.onlineNum_LC3);
   $("#ratedP_LC3").text(data.ratedP_LC3);
   $("#activePower_LC3").text(data.activePower_LC3);
   $("#reactivePower_LC3").text(data.reactivePower_LC3);
   $("#today_E_chg_LC3").text(data.today_E_chg_LC3);
   $("#today_E_dcg_LC3").text(data.today_E_dcg_LC3);
   $("#tot_E_chg_LC3").text(data.tot_E_chg_LC3);
   $("#tot_E_dcg_LC3").text(data.tot_E_dcg_LC3);
   /*告警/故障********************************************** */
   if (data.alarm_PCS3_1 > 0) {
     classAdd("#alarm_PCS3-1", "setToClose");
   } else {
     classRemove("#alarm_PCS3-1", "setToClose");
   }
   if (data.alarm_PCS3_2 > 0) {
     classAdd("#alarm_PCS3-2", "setToClose");
   } else {
     classRemove("#alarm_PCS3-2", "setToClose");
   }
   if (data.fault_PCS3_1 > 0) {
     classAdd("#fault_PCS3-1", "setToClose");
   } else {
     classRemove("#fault_PCS3-1", "setToClose");
   }
   if (data.fault_PCS3_2 > 0) {
     classAdd("#fault_PCS3-2", "setToClose");
   } else {
     classRemove("#fault_PCS3-2", "setToClose");
   }
 
   $("#modeActPas_LC3").text(data.modeActPas_LC3);
   $("#modeQctrl_LC3").text(data.modeQctrl_LC3);
   $("#standbyCmd_LC3").text(data.standbyCmd_LC3);
   $("#modeLR_LC3").text(data.modeLR_LC3);

    /*LC4************************************************* */
  $("#onlineNum_LC4").text(data.onlineNum_LC4);
  $("#ratedP_LC4").text(data.ratedP_LC4);
  $("#activePower_LC4").text(data.activePower_LC4);
  $("#reactivePower_LC4").text(data.reactivePower_LC4);
  $("#today_E_chg_LC4").text(data.today_E_chg_LC4);
  $("#today_E_dcg_LC4").text(data.today_E_dcg_LC4);
  $("#tot_E_chg_LC4").text(data.tot_E_chg_LC4);
  $("#tot_E_dcg_LC4").text(data.tot_E_dcg_LC4);
  /*告警/故障********************************************** */
  if (data.alarm_PCS4_1 > 0) {
    classAdd("#alarm_PCS4-1", "setToClose");
  } else {
    classRemove("#alarm_PCS4-1", "setToClose");
  }

  if (data.fault_PCS4_1 > 0) {
    classAdd("#fault_PCS4-1", "setToClose");
  } else {
    classRemove("#fault_PCS4-1", "setToClose");
  }

  $("#modeActPas_LC4").text(data.modeActPas_LC4);
  $("#modeQctrl_LC4").text(data.modeQctrl_LC4);
  $("#standbyCmd_LC4").text(data.standbyCmd_LC4);
  $("#modeLR_LC4").text(data.modeLR_LC4);
}
