// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

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
const radioOption1 = document.querySelector(".dataStatus_Set #radioOpt_1");
const radioOption2 = document.querySelector(".dataStatus_Set #radioOpt_2");
const alertInfo_dataStatus_Set = document.querySelector(
  ".dataStatus_Set .alertInfo"
);
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

const setBut_acuOnOff_1 = document.querySelector(
  ".environSC #setBut_acuOnOff_1"
);
setBut_acuOnOff_1.addEventListener("click", Set_acuOnOff_1);
function Set_acuOnOff_1() {
  Set_acuOnOff();
  title_dataStatus_Set.textContent = "LC1_空調啟停設定";
  valNow_dataStatus_Set = document.querySelector(".environSC #acuOnOff_1");
  // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
  getDataForacuOnOff(1);
}

const setBut_acuOnOff_2 = document.querySelector(
  ".environSC #setBut_acuOnOff_2"
);
setBut_acuOnOff_2.addEventListener("click", Set_acuOnOff_2);
function Set_acuOnOff_2() {
  Set_acuOnOff();
  title_dataStatus_Set.textContent = "LC2_空調啟停設定";
  valNow_dataStatus_Set = document.querySelector(".environSC #acuOnOff_2");
  getDataForacuOnOff(2);
}

const setBut_acuOnOff_3 = document.querySelector(
  ".environSC #setBut_acuOnOff_3"
);
setBut_acuOnOff_3.addEventListener("click", Set_acuOnOff_3);
function Set_acuOnOff_3() {
  Set_acuOnOff();
  title_dataStatus_Set.textContent = "LC3_空調啟停設定";
  valNow_dataStatus_Set = document.querySelector(".environSC #acuOnOff_3");
  getDataForacuOnOff(3);
}

const setBut_acuOnOff_4 = document.querySelector(
  ".environSC #setBut_acuOnOff_4"
);
setBut_acuOnOff_4.addEventListener("click", Set_acuOnOff_4);
function Set_acuOnOff_4() {
  Set_acuOnOff();
  title_dataStatus_Set.textContent = "LC4_空調啟停設定";
  valNow_dataStatus_Set = document.querySelector(".environSC #acuOnOff_4");
  getDataForacuOnOff(4);
}

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
  if (radioOption1.checked === true || radioOption2.checked === true) {
    optionChecked_dataStatus_Set = document.querySelector(
      ".dataStatus_Set [name=dataStatus]:checked"
    );

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
  range_info_dataValue_Set.textContent =
    "數值範圍: " + minLimit + "~" + maxLimit + " " + dataUnit;
  val_new_dataValue_Set.focus();
}

const setBut_acuHeatT_1 = document.querySelector(
  ".environSC #setBut_acuHeatT_1"
);
setBut_acuHeatT_1.addEventListener("click", Set_acuHeatT_1);
function Set_acuHeatT_1() {
  title_dataValue_Set.textContent = "LC1_空調制熱溫度";
  valNow_dataValue_Set = document.querySelector(".environSC #acuHeatT_1"); // 記得改點位的id
  Set_acuTemp();
}

const setBut_acuHeatT_2 = document.querySelector(
  ".environSC #setBut_acuHeatT_2"
);
setBut_acuHeatT_2.addEventListener("click", Set_acuHeatT_2);
function Set_acuHeatT_2() {
  title_dataValue_Set.textContent = "LC2_空調制熱溫度";
  valNow_dataValue_Set = document.querySelector(".environSC #acuHeatT_2"); // 記得改點位的id
  Set_acuTemp();
}

const setBut_acuHeatT_3 = document.querySelector(
  ".environSC #setBut_acuHeatT_3"
);
setBut_acuHeatT_3.addEventListener("click", Set_acuHeatT_3);
function Set_acuHeatT_3() {
  title_dataValue_Set.textContent = "LC3_空調制熱溫度";
  valNow_dataValue_Set = document.querySelector(".environSC #acuHeatT_3"); // 記得改點位的id
  Set_acuTemp();
}

const setBut_acuHeatT_4 = document.querySelector(
  ".environSC #setBut_acuHeatT_4"
);
setBut_acuHeatT_4.addEventListener("click", Set_acuHeatT_4);
function Set_acuHeatT_4() {
  title_dataValue_Set.textContent = "LC4_空調制熱溫度";
  valNow_dataValue_Set = document.querySelector(".environSC #acuHeatT_4"); // 記得改點位的id
  Set_acuTemp();
}

const setBut_acuCoolT_1 = document.querySelector(
  ".environSC #setBut_acuCoolT_1"
);
setBut_acuCoolT_1.addEventListener("click", Set_acuCoolT_1);
function Set_acuCoolT_1() {
  title_dataValue_Set.textContent = "LC1_空調制冷溫度";
  valNow_dataValue_Set = document.querySelector(".environSC #acuCoolT_1"); // 記得改點位的id
  Set_acuTemp();
}

const setBut_acuCoolT_2 = document.querySelector(
  ".environSC #setBut_acuCoolT_2"
);
setBut_acuCoolT_2.addEventListener("click", Set_acuCoolT_2);
function Set_acuCoolT_2() {
  title_dataValue_Set.textContent = "LC2_空調制冷溫度";
  valNow_dataValue_Set = document.querySelector(".environSC #acuCoolT_2"); // 記得改點位的id
  Set_acuTemp();
}

const setBut_acuCoolT_3 = document.querySelector(
  ".environSC #setBut_acuCoolT_3"
);
setBut_acuCoolT_3.addEventListener("click", Set_acuCoolT_3);
function Set_acuCoolT_3() {
  title_dataValue_Set.textContent = "LC3_空調制冷溫度";
  valNow_dataValue_Set = document.querySelector(".environSC #acuCoolT_3"); // 記得改點位的id
  Set_acuTemp();
}

const setBut_acuCoolT_4 = document.querySelector(
  ".environSC #setBut_acuCoolT_4"
);
setBut_acuCoolT_4.addEventListener("click", Set_acuCoolT_4);
function Set_acuCoolT_4() {
  title_dataValue_Set.textContent = "LC4_空調制冷溫度";
  valNow_dataValue_Set = document.querySelector(".environSC #acuCoolT_4"); // 記得改點位的id
  Set_acuTemp();
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

const window_info_EnvironAlm = document.querySelector(".info_EnvironAlm");
const title_UPSstatus1 = document.querySelector(
  ".info_EnvironAlm .titleUPSstatus1"
);
const title_UPSstatus2 = document.querySelector(
  ".info_EnvironAlm .titleUPSstatus2"
);
const title_FFSstatus = document.querySelector(
  ".info_EnvironAlm .titleFFSstatus"
);
const title_AlarmBSC = document.querySelector(
  ".info_EnvironAlm .titleAlarmBSC"
);
const title_FaultBSC = document.querySelector(
  ".info_EnvironAlm .titleFaultBSC"
);

const closeWB_info_EnvironAlm = document.querySelector(
  ".info_EnvironAlm #closeWB_No"
);
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
//rEnvironment.js operateinfo/battery "空調啟停"SET按鈕 把數值帶入打勾
//blockId 會直接給lc是幾
async function getDataForacuOnOff(blockId) {
  try {
    console.log("空調啟停 把數值帶入打勾 嘗試向後端發出請求");
    //const selectedValue = $('input[name="dataStatus"]:checked').val();
    const response = await fetch("/getDataForacuOnOff", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blockId }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document
  .getElementById("closeWB_Yes")
  .addEventListener("click", sendDataToBackend);

//前端按下確認時觸發
async function sendDataToBackend() {
  const selectedValue = $('input[name="dataStatus"]:checked').val();
  console.log("selectedValue:" + selectedValue);
  //const title = document.querySelector(".titlePUW");
  try {
    console.log("嘗試向後端發出請求");
    //ejs回傳id
    const lcnum = $(".dataStatus_Set .titlePUW").text();
    console.log("lcnum:" + lcnum);

    const response = await fetch("/envbackendEndpoint", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedValue, lcnum }),
    }).catch((error) => console.error("Error in fetch:", error));

    const data = await response.json();
    console.log(data);
    //displayData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

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
