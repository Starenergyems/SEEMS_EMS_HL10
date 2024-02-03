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

const OpenEnvironAlm_1_1 = document.querySelector("#openEnvironAlm_1-1");
OpenEnvironAlm_1_1.addEventListener("click", function () {
  show_info_EnvironAlm("1-1");
  getDataenv(1);
});

const OpenEnvironAlm_1_2 = document.querySelector("#openEnvironAlm_1-2");
OpenEnvironAlm_1_2.addEventListener("click", function () {
  show_info_EnvironAlm("1-2");
  getDataenv(2);
});

const OpenEnvironAlm_2_1 = document.querySelector("#openEnvironAlm_2-1");
OpenEnvironAlm_2_1.addEventListener("click", function () {
  show_info_EnvironAlm("2-1");
  getDataenv(3);
});

const OpenEnvironAlm_2_2 = document.querySelector("#openEnvironAlm_2-2");
OpenEnvironAlm_2_2.addEventListener("click", function () {
  show_info_EnvironAlm("2-2");
  getDataenv(4);
});

const OpenEnvironAlm_3_1 = document.querySelector("#openEnvironAlm_3-1");
OpenEnvironAlm_3_1.addEventListener("click", function () {
  show_info_EnvironAlm("3-1");
  getDataenv(5);
});

const OpenEnvironAlm_3_2 = document.querySelector("#openEnvironAlm_3-2");
OpenEnvironAlm_3_2.addEventListener("click", function () {
  show_info_EnvironAlm("3-2");
  getDataenv(6);
});

const OpenEnvironAlm_4_1 = document.querySelector("#openEnvironAlm_4-1");
OpenEnvironAlm_4_1.addEventListener("click", function () {
  show_info_EnvironAlm("4-1");
  getDataenv(7);
});

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
