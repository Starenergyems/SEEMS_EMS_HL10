//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {

  console.log("start reading js");
  classAdd('#nB_System', 'default_nB');
  updateData();
});

setInterval(updateData, 1000);

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

// function Set_acuOnOff() {
//   window_dataStatus_Set.classList.add("appear");
//   clearCheckedRadioOption();
//   option1_dataStatus_Set.textContent = "啟動";
//   option2_dataStatus_Set.textContent = "停止";
//   alertInfo_dataStatus_Set.textContent = "";
//   option1_Description = "啟動";
//   option2_Description = "停止";
// }

let qSelectAll_option = document.querySelectorAll(".dataStatus_Set .option");
let qSelectAll_radioOpt = document.querySelectorAll(".dataStatus_Set .radioOpt");
let i;

async function Set_acuOnOff(numInDataGroup) {
  dataName = "setBut_acuOnOff";

  title_dataStatus_Set.textContent = `LC${numInDataGroup}_空調啟停設定`;
  window_dataStatus_Set.classList.add("appear");
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

const setBut_acuOnOff_1 = document.querySelector(".environSC #setBut_acuOnOff_1");
setBut_acuOnOff_1.addEventListener("click", function () { Set_acuOnOff(1); });
// setBut_acuOnOff_1.addEventListener("click", Set_acuOnOff_1);
// function Set_acuOnOff_1() {
//   Set_acuOnOff();
//   title_dataStatus_Set.textContent = "LC1_空調啟停設定";
//   valNow_dataStatus_Set = document.querySelector(".environSC #acuOnOff_1");
//   // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
//   getDataForacuOnOff(1);
// }

const setBut_acuOnOff_2 = document.querySelector(".environSC #setBut_acuOnOff_2");
setBut_acuOnOff_2.addEventListener("click", function () { Set_acuOnOff(2); });

const setBut_acuOnOff_3 = document.querySelector(".environSC #setBut_acuOnOff_3");
setBut_acuOnOff_3.addEventListener("click", function () { Set_acuOnOff(3); });

const setBut_acuOnOff_4 = document.querySelector(".environSC #setBut_acuOnOff_4");
setBut_acuOnOff_4.addEventListener("click", function () { Set_acuOnOff(4); });

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
  if (radioOption1.checked === true || radioOption2.checked === true) {
    optionChecked_dataStatus_Set = document.querySelector(".dataStatus_Set [name=dataStatus]:checked");

    set_dSS_Data(optionChecked_dataStatus_Set.value);

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

// function Set_acuTemp() {
//   minLimit = "-100.0";
//   maxLimit = "200.0";
//   scale = 10;
//   decPlace = 1;
//   dataUnit = "°C";
//   window_dataValue_Set.classList.add("appear");
//   val_origin_dataValue_Set.textContent = valNow_dataValue_Set.textContent;
//   unit_origin_dataValue_Set.textContent = dataUnit;
//   unit_new_dataValue_Set.textContent = dataUnit;
//   range_info_dataValue_Set.textContent = "數值範圍: " + minLimit + "~" + maxLimit + " " + dataUnit;
//   val_new_dataValue_Set.focus();
// }

async function Set_acuHeatT(numInDataGroup) {
  dVS_Data_dataName = "setBut_acuHeatT";

  title_dataValue_Set.textContent = `LC${numInDataGroup}_空調制熱溫度`;
  window_dataValue_Set.classList.add("appear");

  let getData = await get_dVS_Data_WhenClicking(dVS_Data_dataName, numInDataGroup);
  val_origin_dataValue_Set.textContent = getData.originData;
  unit_origin_dataValue_Set.textContent = getData.unit;
  unit_new_dataValue_Set.textContent = getData.unit;
  range_info_dataValue_Set.textContent = getData.dataRange;

  val_new_dataValue_Set.focus();
}

async function Set_acuCoolT(numInDataGroup) {
  dVS_Data_dataName = "setBut_acuCoolT";

  title_dataValue_Set.textContent = `LC${numInDataGroup}_空調制冷溫度`;
  window_dataValue_Set.classList.add("appear");

  let getData = await get_dVS_Data_WhenClicking(dVS_Data_dataName, numInDataGroup);
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

const setBut_acuHeatT_1 = document.querySelector(".environSC #setBut_acuHeatT_1");
setBut_acuHeatT_1.addEventListener("click", function () { Set_acuHeatT(1); });
// setBut_acuHeatT_1.addEventListener("click", Set_acuHeatT_1);
// function Set_acuHeatT_1() {
//   title_dataValue_Set.textContent = "LC1_空調制熱溫度";
//   valNow_dataValue_Set = document.querySelector(".environSC #acuHeatT_1"); // 記得改點位的id
//   Set_acuTemp();
// }

const setBut_acuHeatT_2 = document.querySelector(".environSC #setBut_acuHeatT_2");
setBut_acuHeatT_2.addEventListener("click", function () { Set_acuHeatT(2); });

const setBut_acuHeatT_3 = document.querySelector(".environSC #setBut_acuHeatT_3");
setBut_acuHeatT_3.addEventListener("click", function () { Set_acuHeatT(3); });

const setBut_acuHeatT_4 = document.querySelector(".environSC #setBut_acuHeatT_4");
setBut_acuHeatT_4.addEventListener("click", function () { Set_acuHeatT(4); });

const setBut_acuCoolT_1 = document.querySelector(".environSC #setBut_acuCoolT_1");
setBut_acuCoolT_1.addEventListener("click", function () { Set_acuCoolT(1) });

const setBut_acuCoolT_2 = document.querySelector(".environSC #setBut_acuCoolT_2");
setBut_acuCoolT_2.addEventListener("click", function () { Set_acuCoolT(2) });

const setBut_acuCoolT_3 = document.querySelector(".environSC #setBut_acuCoolT_3");
setBut_acuCoolT_3.addEventListener("click", function () { Set_acuCoolT(3) });

const setBut_acuCoolT_4 = document.querySelector(".environSC #setBut_acuCoolT_4");
setBut_acuCoolT_4.addEventListener("click", function () { Set_acuCoolT(4) });

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

const window_info_EnvironAlm = document.querySelector(".info_EnvironAlm");
const title_UPSstatus1 = document.querySelector(".info_EnvironAlm .titleUPSstatus1");
const title_UPSstatus2 = document.querySelector(".info_EnvironAlm .titleUPSstatus2");
const title_FFSstatus = document.querySelector(".info_EnvironAlm .titleFFSstatus");
const title_AlarmBSC = document.querySelector(".info_EnvironAlm .titleAlarmBSC");
const title_FaultBSC = document.querySelector(".info_EnvironAlm .titleFaultBSC");

const closeWB_info_EnvironAlm = document.querySelector(".info_EnvironAlm #closeWB_No");
closeWB_info_EnvironAlm.addEventListener("click", closePopup_info_EnvironAlm);
function closePopup_info_EnvironAlm() {
  window_info_EnvironAlm.classList.remove("appear");
}

function show_info_EnvironAlm(abc) {
  title_UPSstatus1.textContent = "ESS " + abc + " UPS狀態1";
  title_UPSstatus2.textContent = "ESS " + abc + " UPS狀態2";
  title_FFSstatus.textContent = "ESS " + abc + " 消防狀態";
  title_AlarmBSC.textContent = "ESS " + abc + " BSC告警";
  title_FaultBSC.textContent = "ESS " + abc + " BSC故障";
  window_info_EnvironAlm.classList.add("appear");
}

// const OpenEnvironAlm_1_1 = document.querySelector("#openEnvironAlm_1-1");
// OpenEnvironAlm_1_1.addEventListener("click", function () {
//   show_info_EnvironAlm("1-1");
//   getDataenv(1);
// });

// const OpenEnvironAlm_1_2 = document.querySelector("#openEnvironAlm_1-2");
// OpenEnvironAlm_1_2.addEventListener("click", function () {
//   show_info_EnvironAlm("1-2");
//   getDataenv(2);
// });

// const OpenEnvironAlm_2_1 = document.querySelector("#openEnvironAlm_2-1");
// OpenEnvironAlm_2_1.addEventListener("click", function () {
//   show_info_EnvironAlm("2-1");
//   getDataenv(3);
// });

// const OpenEnvironAlm_2_2 = document.querySelector("#openEnvironAlm_2-2");
// OpenEnvironAlm_2_2.addEventListener("click", function () {
//   show_info_EnvironAlm("2-2");
//   getDataenv(4);
// });

// const OpenEnvironAlm_3_1 = document.querySelector("#openEnvironAlm_3-1");
// OpenEnvironAlm_3_1.addEventListener("click", function () {
//   show_info_EnvironAlm("3-1");
//   getDataenv(5);
// });

// const OpenEnvironAlm_3_2 = document.querySelector("#openEnvironAlm_3-2");
// OpenEnvironAlm_3_2.addEventListener("click", function () {
//   show_info_EnvironAlm("3-2");
//   getDataenv(6);
// });

// const OpenEnvironAlm_4_1 = document.querySelector("#openEnvironAlm_4-1");
// OpenEnvironAlm_4_1.addEventListener("click", function () {
//   show_info_EnvironAlm("4-1");
//   getDataenv(7);
// });

/////////////////////////////////////////////////////////////////////////

//環境頁面下方彈出視窗 獲取該區塊id
async function getDataenv(blockId) {
  try {
    console.log("嘗試向後端發出請求");
    const response = await fetch("/getDataforenv", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blockId }),
    });

    const data = await response.json();
    console.log("Sys_Environment.js:" + data);

    //displayData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayData(data) {
  console.log("Received data:", data);
  const dataContainer = document.getElementById("data-container");
  dataContainer.innerHTML = `<p>${data}</p>`;
}

async function updateData() { //更新資料ajax
  var router = window.location.href + "/data";
  var data = await getData(router);
  console.log(data);
  /*空調起停*************************************** */
  $('#acuOnOff_1').text(data.acuOnOff_1);
  $('#acuOnOff_2').text(data.acuOnOff_2);
  $('#acuOnOff_3').text(data.acuOnOff_3);
  $('#acuOnOff_4').text(data.acuOnOff_4);

  /*空調制熱溫度*************************************** */
  $('#acuHeatT_1').text(data.acuHeatT_1);
  $('#acuHeatT_2').text(data.acuHeatT_2);
  $('#acuHeatT_3').text(data.acuHeatT_3);
  $('#acuHeatT_4').text(data.acuHeatT_4);

  /*空調制冷溫度*************************************** */
  $('#acuCoolT_1').text(data.acuCoolT_1);
  $('#acuCoolT_2').text(data.acuCoolT_2);
  $('#acuCoolT_3').text(data.acuCoolT_3);
  $('#acuCoolT_4').text(data.acuCoolT_4);

  /*空調#1************************************************* */
  $('#acu_1_Status_1-1').text(data.acu_1_Status_1_1);
  $('#acu_1_Temp_1-1').text(data.acu_1_Temp_1_1);

  $('#acu_1_Status_1-2').text(data.acu_1_Status_1_2);
  $('#acu_1_Temp_1-2').text(data.acu_1_Temp_1_2);

  $('#acu_1_Status_2-1').text(data.acu_1_Status_2_1);
  $('#acu_1_Temp_2-1').text(data.acu_1_Temp_2_1);

  $('#acu_1_Status_2-2').text(data.acu_1_Status_2_2);
  $('#acu_1_Temp_2-2').text(data.acu_1_Temp_2_2);

  $('#acu_1_Status_3-1').text(data.acu_1_Status_3_1);
  $('#acu_1_Temp_3-1').text(data.acu_1_Temp_3_1);

  $('#acu_1_Status_3-2').text(data.acu_1_Status_3_2);
  $('#acu_1_Temp_3-2').text(data.acu_1_Temp_3_2);

  $('#acu_1_Status_4-1').text(data.acu_1_Status_4_1);
  $('#acu_1_Temp_4-1').text(data.acu_1_Temp_4_1);

  /*空調#2************************************************* */
  $('#acu_2_Status_1-1').text(data.acu_2_Status_1_1);
  $('#acu_2_Temp_1-1').text(data.acu_2_Temp_1_1);

  $('#acu_2_Status_1-2').text(data.acu_2_Status_1_2);
  $('#acu_2_Temp_1-2').text(data.acu_2_Temp_1_2);

  $('#acu_2_Status_2-1').text(data.acu_2_Status_2_1);
  $('#acu_2_Temp_2-1').text(data.acu_2_Temp_2_1);

  $('#acu_2_Status_2-2').text(data.acu_2_Status_2_2);
  $('#acu_2_Temp_2-2').text(data.acu_2_Temp_2_2);

  $('#acu_2_Status_3-1').text(data.acu_2_Status_3_1);
  $('#acu_2_Temp_3-1').text(data.acu_2_Temp_3_1);

  $('#acu_2_Status_3-2').text(data.acu_2_Status_3_2);
  $('#acu_2_Temp_3-2').text(data.acu_2_Temp_3_2);

  $('#acu_2_Status_4-1').text(data.acu_2_Status_4_1);
  $('#acu_2_Temp_4-1').text(data.acu_2_Temp_4_1);

  /*控制式空調#1******************************************************** */
  $('#ctrl_hvac_1_open').text(data.ctrl_hvac_1_open);
  $('#ctrl_hvac_1_mode').text(data.ctrl_hvac_1_mode);
  $('#ctrl_hvac_1_fanSpd').text(data.ctrl_hvac_1_fanSpd);
  $('#ctrl_hvac_1_tempSet').text(data.ctrl_hvac_1_tempSet);
  $('#ctrl_hvac_1_temp').text(data.ctrl_hvac_1_temp);
  $('#ctrl_hvac_1_humid').text(data.ctrl_hvac_1_humid);
  $('#ctrl_hvac_1_error').text(data.ctrl_hvac_1_error);

    /*控制式空調#2******************************************************** */
    $('#ctrl_hvac_2_open').text(data.ctrl_hvac_2_open);
    $('#ctrl_hvac_2_mode').text(data.ctrl_hvac_2_mode);
    $('#ctrl_hvac_2_fanSpd').text(data.ctrl_hvac_2_fanSpd);
    $('#ctrl_hvac_2_tempSet').text(data.ctrl_hvac_2_tempSet);
    $('#ctrl_hvac_2_temp').text(data.ctrl_hvac_2_temp);
    $('#ctrl_hvac_2_humid').text(data.ctrl_hvac_2_humid);
    $('#ctrl_hvac_2_error').text(data.ctrl_hvac_2_error);

    /*UPS_MVCB****************************************************************** */
    $('#ups_MVCB_volt').text(data.ups_MVCB_volt);
    $('#ups_MVCB_temp').text(data.ups_MVCB_temp);
    $('#ups_MVCB_status').text(data.ups_MVCB_status);
    $('#ups_MVCB_power').text(data.ups_MVCB_power);

    /*UPS_ACP****************************************************************** */
    $('#ups_ACP_volt').text(data.ups_ACP_volt);
    $('#ups_ACP_temp').text(data.ups_ACP_temp);
    $('#ups_ACP_status').text(data.ups_ACP_status);
    $('#ups_ACP_power').text(data.ups_ACP_power);

    /*UPS_EMS************************************************************************ */
    $('#ups_EMS_SOC').text(data.ups_EMS_SOC);
    $('#ups_EMS_timeLeft').text(data.ups_EMS_timeLeft);
    $('#ups_EMS_mode').text(data.ups_EMS_mode);
    $('#ups_EMS_error').text(data.ups_EMS_error);

    if (data.ups_EMS_408161_bit9 > 0) {
      classAdd("#ups_EMS_408161_bit9", "setToClose");
      classRemove("#ups_EMS_408161_bit9", "setToGreen");
    } else {
      classAdd("#ups_EMS_408161_bit9", "setToGreen");
      classRemove("#ups_EMS_408161_bit9", "setToClose");
    }

    if (data.ups_EMS_408161_bit11 > 0) {
      classAdd("#ups_EMS_408161_bit11", "setToClose");
      classRemove("#ups_EMS_408161_bit11", "setToGreen");
    } else {
      classAdd("#ups_EMS_408161_bit11", "setToGreen");
      classRemove("#ups_EMS_408161_bit11", "setToClose");
    }

    if (data.ups_EMS_408161_bit12 > 0) {
      classAdd("#ups_EMS_408161_bit12", "setToClose");
      classRemove("#ups_EMS_408161_bit12", "setToGreen");
    } else {
      classAdd("#ups_EMS_408161_bit12", "setToGreen");
      classRemove("#ups_EMS_408161_bit12", "setToClose");
    }

    if (data.ups_EMS_408162_bit6 > 0) {
      classAdd("#ups_EMS_408162_bit6", "setToClose");
      classRemove("#ups_EMS_408162_bit6", "setToGreen");
    } else {
      classAdd("#ups_EMS_408162_bit6", "setToGreen");
      classRemove("#ups_EMS_408162_bit6", "setToClose");
    }
    
    if (data.ups_EMS_408162_bit8 > 0) {
      classAdd("#ups_EMS_408162_bit8", "setToClose");
      classRemove("#ups_EMS_408162_bit8", "setToGreen");
    } else {
      classAdd("#ups_EMS_408162_bit8", "setToGreen");
      classRemove("#ups_EMS_408162_bit8", "setToClose");
    }

    if (data.ups_EMS_408162_bit10 > 0) {
      classAdd("#ups_EMS_408162_bit10", "setToClose");
      classRemove("#ups_EMS_408162_bit10", "setToGreen");
    } else {
      classAdd("#ups_EMS_408162_bit10", "setToGreen");
      classRemove("#ups_EMS_408162_bit10", "setToClose");
    }

    if (data.ups_EMS_408162_bit11 > 0) {
      classAdd("#ups_EMS_408162_bit11", "setToClose");
      classRemove("#ups_EMS_408162_bit11", "setToGreen");
    } else {
      classAdd("#ups_EMS_408162_bit11", "setToGreen");
      classRemove("#ups_EMS_408162_bit11", "setToClose");
    }

    if (data.ups_EMS_408162_bit12 > 0) {
      classAdd("#ups_EMS_408162_bit12", "setToClose");
      classRemove("#ups_EMS_408162_bit12", "setToGreen");
    } else {
      classAdd("#ups_EMS_408162_bit12", "setToGreen");
      classRemove("#ups_EMS_408162_bit12", "setToClose");
    }

    if (data.ups_EMS_408162_bit13 > 0) {
      classAdd("#ups_EMS_408162_bit13", "setToClose");
      classRemove("#ups_EMS_408162_bit13", "setToGreen");
    } else {
      classAdd("#ups_EMS_408162_bit13", "setToGreen");
      classRemove("#ups_EMS_408162_bit13", "setToClose");
    }

    if (data.ups_EMS_408162_bit14 > 0) {
      classAdd("#ups_EMS_408162_bit14", "setToClose");
      classRemove("#ups_EMS_408162_bit14", "setToGreen");
    } else {
      classAdd("#ups_EMS_408162_bit14", "setToGreen");
      classRemove("#ups_EMS_408162_bit14", "setToClose");
    }

    if (data.ups_EMS_408162_bit15 > 0) {
      classAdd("#ups_EMS_408162_bit15", "setToClose");
      classRemove("#ups_EMS_408162_bit15", "setToGreen");
    } else {
      classAdd("#ups_EMS_408162_bit15", "setToGreen");
      classRemove("#ups_EMS_408162_bit15", "setToClose");
    }
  /*UPS_CMS********************************************************* */
  $('#ups_CMS_SOC').text(data.ups_CMS_SOC);
  $('#ups_CMS_timeLeft').text(data.ups_CMS_timeLeft);
  $('#ups_CMS_mode').text(data.ups_CMS_mode);
  $('#ups_CMS_error').text(data.ups_CMS_error);

  if (data.ups_CMS_408161_bit9 > 0) {
    classAdd("#ups_CMS_408161_bit9", "setToClose");
    classRemove("#ups_CMS_408161_bit9", "setToGreen");
  } else {
    classAdd("#ups_CMS_408161_bit9", "setToGreen");
    classRemove("#ups_CMS_408161_bit9", "setToClose");
  }

  if (data.ups_CMS_408161_bit11 > 0) {
    classAdd("#ups_CMS_408161_bit11", "setToClose");
    classRemove("#ups_CMS_408161_bit11", "setToGreen");
  } else {
    classAdd("#ups_CMS_408161_bit11", "setToGreen");
    classRemove("#ups_CMS_408161_bit11", "setToClose");
  }

  if (data.ups_CMS_408161_bit12 > 0) {
    classAdd("#ups_CMS_408161_bit12", "setToClose");
    classRemove("#ups_CMS_408161_bit12", "setToGreen");
  } else {
    classAdd("#ups_CMS_408161_bit12", "setToGreen");
    classRemove("#ups_CMS_408161_bit12", "setToClose");
  }

  if (data.ups_CMS_408162_bit6 > 0) {
    classAdd("#ups_CMS_408162_bit6", "setToClose");
    classRemove("#ups_CMS_408162_bit6", "setToGreen");
  } else {
    classAdd("#ups_CMS_408162_bit6", "setToGreen");
    classRemove("#ups_CMS_408162_bit6", "setToClose");
  }
  
  if (data.ups_CMS_408162_bit8 > 0) {
    classAdd("#ups_CMS_408162_bit8", "setToClose");
    classRemove("#ups_CMS_408162_bit8", "setToGreen");
  } else {
    classAdd("#ups_CMS_408162_bit8", "setToGreen");
    classRemove("#ups_CMS_408162_bit8", "setToClose");
  }

  if (data.ups_CMS_408162_bit10 > 0) {
    classAdd("#ups_CMS_408162_bit10", "setToClose");
    classRemove("#ups_CMS_408162_bit10", "setToGreen");
  } else {
    classAdd("#ups_CMS_408162_bit10", "setToGreen");
    classRemove("#ups_CMS_408162_bit10", "setToClose");
  }

  if (data.ups_CMS_408162_bit11 > 0) {
    classAdd("#ups_CMS_408162_bit11", "setToClose");
    classRemove("#ups_CMS_408162_bit11", "setToGreen");
  } else {
    classAdd("#ups_CMS_408162_bit11", "setToGreen");
    classRemove("#ups_CMS_408162_bit11", "setToClose");
  }

  if (data.ups_CMS_408162_bit12 > 0) {
    classAdd("#ups_CMS_408162_bit12", "setToClose");
    classRemove("#ups_CMS_408162_bit12", "setToGreen");
  } else {
    classAdd("#ups_CMS_408162_bit12", "setToGreen");
    classRemove("#ups_CMS_408162_bit12", "setToClose");
  }

  if (data.ups_CMS_408162_bit13 > 0) {
    classAdd("#ups_CMS_408162_bit13", "setToClose");
    classRemove("#ups_CMS_408162_bit13", "setToGreen");
  } else {
    classAdd("#ups_CMS_408162_bit13", "setToGreen");
    classRemove("#ups_CMS_408162_bit13", "setToClose");
  }

  if (data.ups_CMS_408162_bit14 > 0) {
    classAdd("#ups_CMS_408162_bit14", "setToClose");
    classRemove("#ups_CMS_408162_bit14", "setToGreen");
  } else {
    classAdd("#ups_CMS_408162_bit14", "setToGreen");
    classRemove("#ups_CMS_408162_bit14", "setToClose");
  }

  if (data.ups_CMS_408162_bit15 > 0) {
    classAdd("#ups_CMS_408162_bit15", "setToClose");
    classRemove("#ups_CMS_408162_bit15", "setToGreen");
  } else {
    classAdd("#ups_CMS_408162_bit15", "setToGreen");
    classRemove("#ups_CMS_408162_bit15", "setToClose");
  }
  /*空調#3************************************************* */
//   $('#acu_3_Status_1-1').text(data.acu_3_Status_1_1);
//   $('#acu_3_Temp_1-1').text(data.acu_3_Temp_1_1);

//   $('#acu_3_Status_1-2').text(data.acu_3_Status_1_2);
//   $('#acu_3_Temp_1-2').text(data.acu_3_Temp_1_2);

//   $('#acu_3_Status_2-1').text(data.acu_3_Status_2_1);
//   $('#acu_3_Temp_2-1').text(data.acu_3_Temp_2_1);

//   $('#acu_3_Status_2-2').text(data.acu_3_Status_2_2);
//   $('#acu_3_Temp_2-2').text(data.acu_3_Temp_2_2);

//   $('#acu_3_Status_3-1').text(data.acu_3_Status_3_1);
//   $('#acu_3_Temp_3-1').text(data.acu_3_Temp_3_1);

//   $('#acu_3_Status_3-2').text(data.acu_3_Status_3_2);
//   $('#acu_3_Temp_3-2').text(data.acu_3_Temp_3_2);

//   $('#acu_3_Status_4-1').text(data.acu_3_Status_4_1);
//   $('#acu_3_Temp_4-1').text(data.acu_3_Temp_4_1);

//   /*空調#4************************************************* */
//   $('#acu_4_Status_1-1').text(data.acu_4_Status_1_1);
//   $('#acu_4_Temp_1-1').text(data.acu_4_Temp_1_1);

//   $('#acu_4_Status_1-2').text(data.acu_4_Status_1_2);
//   $('#acu_4_Temp_1-2').text(data.acu_4_Temp_1_2);

//   $('#acu_4_Status_2-1').text(data.acu_4_Status_2_1);
//   $('#acu_4_Temp_2-1').text(data.acu_4_Temp_2_1);

//   $('#acu_4_Status_2-2').text(data.acu_4_Status_2_2);
//   $('#acu_4_Temp_2-2').text(data.acu_4_Temp_2_2);

//   $('#acu_4_Status_3-1').text(data.acu_4_Status_3_1);
//   $('#acu_4_Temp_3-1').text(data.acu_4_Temp_3_1);

//   $('#acu_4_Status_3-2').text(data.acu_4_Status_3_2);
//   $('#acu_4_Temp_3-2').text(data.acu_4_Temp_3_2);

//   $('#acu_4_Status_4-1').text(data.acu_4_Status_4_1);
//   $('#acu_4_Temp_4-1').text(data.acu_4_Temp_4_1);

//   /*溫溼度計#1************************************************************* */
//   $('#th_1_Temp_1-1').text(data.th_1_Temp_1_1);
//   $('#th_1_Humidity_1-1').text(data.th_1_Humidity_1_1);

//   $('#th_1_Temp_1-2').text(data.th_1_Temp_1_2);
//   $('#th_1_Humidity_1-2').text(data.th_1_Humidity_1_2);

//   $('#th_1_Temp_2-1').text(data.th_1_Temp_2_1);
//   $('#th_1_Humidity_2-1').text(data.th_1_Humidity_2_1);

//   $('#th_1_Temp_2-2').text(data.th_1_Temp_2_2);
//   $('#th_1_Humidity_2-2').text(data.th_1_Humidity_2_2);

//   $('#th_1_Temp_3-1').text(data.th_1_Temp_3_1);
//   $('#th_1_Humidity_3-1').text(data.th_1_Humidity_3_1);

//   $('#th_1_Temp_3-2').text(data.th_1_Temp_3_2);
//   $('#th_1_Humidity_3-2').text(data.th_1_Humidity_3_2);

//   $('#th_1_Temp_4-1').text(data.th_1_Temp_4_1);
//   $('#th_1_Humidity_4-1').text(data.th_1_Humidity_4_1);

//   /*溫溼度計#2************************************************************* */
//   $('#th_2_Temp_1-1').text(data.th_2_Temp_1_1);
//   $('#th_2_Humidity_1-1').text(data.th_2_Humidity_1_1);

//   $('#th_2_Temp_1-2').text(data.th_2_Temp_1_2);
//   $('#th_2_Humidity_1-2').text(data.th_2_Humidity_1_2);

//   $('#th_2_Temp_2-1').text(data.th_2_Temp_2_1);
//   $('#th_2_Humidity_2-1').text(data.th_2_Humidity_2_1);

//   $('#th_2_Temp_2-2').text(data.th_2_Temp_2_2);
//   $('#th_2_Humidity_2-2').text(data.th_2_Humidity_2_2);

//   $('#th_2_Temp_3-1').text(data.th_2_Temp_3_1);
//   $('#th_2_Humidity_3-1').text(data.th_2_Humidity_3_1);

//   $('#th_2_Temp_3-2').text(data.th_2_Temp_3_2);
//   $('#th_2_Humidity_3-2').text(data.th_2_Humidity_3_2);

//   $('#th_2_Temp_4-1').text(data.th_2_Temp_4_1);
//   $('#th_2_Humidity_4-1').text(data.th_2_Humidity_4_1);

//   /*UPS模式*********************************************************** */
//   $('#upsMode_1-1').text(data.upsMode_1_1);
//   $('#upsMode_1-2').text(data.upsMode_1_2);
//   $('#upsMode_2-1').text(data.upsMode_2_1);
//   $('#upsMode_2-2').text(data.upsMode_2_2);
//   $('#upsMode_3-1').text(data.upsMode_3_1);
//   $('#upsMode_3-2').text(data.upsMode_3_2);
//   $('#upsMode_4-1').text(data.upsMode_4_1);

//   /*UPS輸出負載*********************************************************** */
//   $('#upsLoad_1-1').text(data.upsLoad_1_1);
//   $('#upsLoad_1-2').text(data.upsLoad_1_2);
//   $('#upsLoad_2-1').text(data.upsLoad_2_1);
//   $('#upsLoad_2-2').text(data.upsLoad_2_2);
//   $('#upsLoad_3-1').text(data.upsLoad_3_1);
//   $('#upsLoad_3-2').text(data.upsLoad_3_2);
//   $('#upsLoad_4-1').text(data.upsLoad_4_1);

//   /*UPS輸出電壓*********************************************************** */
//   $('#upsVout_1-1').text(data.upsVout_1_1);
//   $('#upsVout_1-2').text(data.upsVout_1_2);
//   $('#upsVout_2-1').text(data.upsVout_2_1);
//   $('#upsVout_2-2').text(data.upsVout_2_2);
//   $('#upsVout_3-1').text(data.upsVout_3_1);
//   $('#upsVout_3-2').text(data.upsVout_3_2);
//   $('#upsVout_4-1').text(data.upsVout_4_1);

//   /*UPS輸出電流*********************************************************** */
//   $('#upsIout_1-1').text(data.upsIout_1_1);
//   $('#upsIout_1-2').text(data.upsIout_1_2);
//   $('#upsIout_2-1').text(data.upsIout_2_1);
//   $('#upsIout_2-2').text(data.upsIout_2_2);
//   $('#upsIout_3-1').text(data.upsIout_3_1);
//   $('#upsIout_3-2').text(data.upsIout_3_2);
//   $('#upsIout_4-1').text(data.upsIout_4_1);

//   /*UPS電池溫度*********************************************************** */
//   $('#upsTemp_1-1').text(data.upsTemp_1_1);
//   $('#upsTemp_1-2').text(data.upsTemp_1_2);
//   $('#upsTemp_2-1').text(data.upsTemp_2_1);
//   $('#upsTemp_2-2').text(data.upsTemp_2_2);
//   $('#upsTemp_3-1').text(data.upsTemp_3_1);
//   $('#upsTemp_3-2').text(data.upsTemp_3_2);
//   $('#upsTemp_4-1').text(data.upsTemp_4_1);

//   /*UPS SOC*********************************************************** */
//   $('#upsSOC_1-1').text(data.upsSOC_1_1);
//   $('#upsSOC_1-2').text(data.upsSOC_1_2);
//   $('#upsSOC_2-1').text(data.upsSOC_2_1);
//   $('#upsSOC_2-2').text(data.upsSOC_2_2);
//   $('#upsSOC_3-1').text(data.upsSOC_3_1);
//   $('#upsSOC_3-2').text(data.upsSOC_3_2);
//   $('#upsSOC_4-1').text(data.upsSOC_4_1);

//   /*UPS狀態1***************************************************************** */
//   if (data.upsStatus1_1_1_rawD > 0) {
//     classAdd("#upsStatus1_1-1", "setToClose");
//   } else {
//     classRemove("#upsStatus1_1-1", "setToClose");
//   }

//   if (data.upsStatus1_1_2_rawD > 0) {
//     classAdd("#upsStatus1_1-2", "setToClose");
//   } else {
//     classRemove("#upsStatus1_1-2", "setToClose");
//   }

//   if (data.upsStatus1_2_1_rawD > 0) {
//     classAdd("#upsStatus1_2-1", "setToClose");
//   } else {
//     classRemove("#upsStatus1_2-1", "setToClose");
//   }

//   if (data.upsStatus1_2_2_rawD > 0) {
//     classAdd("#upsStatus1_2-2", "setToClose");
//   } else {
//     classRemove("#upsStatus1_2-2", "setToClose");
//   }

//   if (data.upsStatus1_3_1_rawD > 0) {
//     classAdd("#upsStatus1_3-1", "setToClose");
//   } else {
//     classRemove("#upsStatus1_3-1", "setToClose");
//   }

//   if (data.upsStatus1_3_2_rawD > 0) {
//     classAdd("#upsStatus1_3-2", "setToClose");
//   } else {
//     classRemove("#upsStatus1_3-2", "setToClose");
//   }

//   if (data.upsStatus1_4_1_rawD > 0) {
//     classAdd("#upsStatus1_4-1", "setToClose");
//   } else {
//     classRemove("#upsStatus1_4-1", "setToClose");
//   }

//   /*UPS狀態2***************************************************************** */
//   //ejs沒有class????????
//   if (data.upsStatus2_1_1_rawD > 0) {
//     classAdd("#upsStatus2_1-1", "setToClose");
//   } else {
//     classRemove("#upsStatus2_1-1", "setToClose");
//   }

//   if (data.upsStatus2_1_2_rawD > 0) {
//     classAdd("#upsStatus2_1-2", "setToClose");
//   } else {
//     classRemove("#upsStatus2_1-2", "setToClose");
//   }

//   if (data.upsStatus2_2_1_rawD > 0) {
//     classAdd("#upsStatus2_2-1", "setToClose");
//   } else {
//     classRemove("#upsStatus2_2-1", "setToClose");
//   }

//   if (data.upsStatus2_2_2_rawD > 0) {
//     classAdd("#upsStatus2_2-2", "setToClose");
//   } else {
//     classRemove("#upsStatus2_2-2", "setToClose");
//   }

//   if (data.upsStatus2_3_1_rawD > 0) {
//     classAdd("#upsStatus2_3-1", "setToClose");
//   } else {
//     classRemove("#upsStatus2_3-1", "setToClose");
//   }

//   if (data.upsStatus2_3_2_rawD > 0) {
//     classAdd("#upsStatus2_3-2", "setToClose");
//   } else {
//     classRemove("#upsStatus2_3-2", "setToClose");
//   }

//   if (data.upsStatus2_4_1_rawD > 0) {
//     classAdd("#upsStatus2_4-1", "setToClose");
//   } else {
//     classRemove("#upsStatus2_4-1", "setToClose");
//   }

//   /*BSC告警******************************************************* */
//   if (data.bscAlarm_1_1_rawD > 0) {
//     classAdd("#bscAlarm_1-1", "setToClose");
//   } else {
//     classRemove("#bscAlarm_1-1", "setToClose");
//   }

//   if (data.bscAlarm_1_2_rawD > 0) {
//     classAdd("#bscAlarm_1-2", "setToClose");
//   } else {
//     classRemove("#bscAlarm_1-2", "setToClose");
//   }

//   if (data.bscAlarm_2_1_rawD > 0) {
//     classAdd("#bscAlarm_2-1", "setToClose");
//   } else {
//     classRemove("#bscAlarm_2-1", "setToClose");
//   }

//   if (data.bscAlarm_2_2_rawD > 0) {
//     classAdd("#bscAlarm_2-2", "setToClose");
//   } else {
//     classRemove("#bscAlarm_2-2", "setToClose");
//   }

//   if (data.bscAlarm_3_1_rawD > 0) {
//     classAdd("#bscAlarm_3-1", "setToClose");
//   } else {
//     classRemove("#bscAlarm_3-1", "setToClose");
//   }

//   if (data.bscAlarm_3_2_rawD > 0) {
//     classAdd("#bscAlarm_3-2", "setToClose");
//   } else {
//     classRemove("#bscAlarm_3-2", "setToClose");
//   }

//   if (data.bscAlarm_4_1_rawD > 0) {
//     classAdd("#bscAlarm_4-1", "setToClose");
//   } else {
//     classRemove("#bscAlarm_4-1", "setToClose");
//   }

//   /*BSC故障******************************************************* */
//   if (data.bscFault_1_1_rawD > 0) {
//     classAdd("#bscFault_1-1", "setToClose");
//   } else {
//     classRemove("#bscFault_1-1", "setToClose");
//   }

//   if (data.bscFault_1_2_rawD > 0) {
//     classAdd("#bscFault_1-2", "setToClose");
//   } else {
//     classRemove("#bscFault_1-2", "setToClose");
//   }

//   if (data.bscFault_2_1_rawD > 0) {
//     classAdd("#bscFault_2-1", "setToClose");
//   } else {
//     classRemove("#bscFault_2-1", "setToClose");
//   }

//   if (data.bscFault_2_2_rawD > 0) {
//     classAdd("#bscFault_2-2", "setToClose");
//   } else {
//     classRemove("#bscFault_2-2", "setToClose");
//   }

//   if (data.bscFault_3_1_rawD > 0) {
//     classAdd("#bscFault_3-1", "setToClose");
//   } else {
//     classRemove("#bscFault_3-1", "setToClose");
//   }

//   if (data.bscFault_3_2_rawD > 0) {
//     classAdd("#bscFault_3-2", "setToClose");
//   } else {
//     classRemove("#bscFault_3-2", "setToClose");
//   }

//   if (data.bscFault_4_1_rawD > 0) {
//     classAdd("#bscFault_4-1", "setToClose");
//   } else {
//     classRemove("#bscFault_4-1", "setToClose");
//   }

//   /*消防狀態******************************************************* */
//   if (data.ffsStatus_1_1_rawD > 0) {
//     classAdd("#ffsStatus_1-1", "setToClose");
//   } else {
//     classRemove("#ffsStatus_1-1", "setToClose");
//   }

//   if (data.ffsStatus_1_2_rawD > 0) {
//     classAdd("#ffsStatus_1-2", "setToClose");
//   } else {
//     classRemove("#ffsStatus_1-2", "setToClose");
//   }

//   if (data.ffsStatus_2_1_rawD > 0) {
//     classAdd("#ffsStatus_2-1", "setToClose");
//   } else {
//     classRemove("#ffsStatus_2-1", "setToClose");
//   }

//   if (data.ffsStatus_2_2_rawD > 0) {
//     classAdd("#ffsStatus_2-2", "setToClose");
//   } else {
//     classRemove("#ffsStatus_2-2", "setToClose");
//   }

//   if (data.ffsStatus_3_1_rawD > 0) {
//     classAdd("#ffsStatus_3-1", "setToClose");
//   } else {
//     classRemove("#ffsStatus_3-1", "setToClose");
//   }

//   if (data.ffsStatus_3_2_rawD > 0) {
//     classAdd("#ffsStatus_3-2", "setToClose");
//   } else {
//     classRemove("#ffsStatus_3-2", "setToClose");
//   }

//   if (data.ffsStatus_4_1_rawD > 0) {
//     classAdd("#ffsStatus_4-1", "setToClose");
//   } else {
//     classRemove("#ffsStatus_4-1", "setToClose");
//   }
 }
