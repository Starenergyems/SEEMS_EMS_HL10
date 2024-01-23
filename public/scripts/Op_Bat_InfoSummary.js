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

function Set_LC_BMS() {
  window_dataStatus_Set.classList.add("appear");
  clearCheckedRadioOption();
  option1_dataStatus_Set.textContent = "切離";
  option2_dataStatus_Set.textContent = "投入";
  option3_dataStatus_Set.textContent = "故障復位";
  alertInfo_dataStatus_Set.textContent = "";
  option1_Description = "全部切離";
  option2_Description = "全部投入";
  option3_Description = "全部切離";
}

const setBut_LC1_BMS = document.querySelector(
  ".infoLC_1 #setBut_onGridStatus_LC1"
);
setBut_LC1_BMS.addEventListener("click", Set_LC1_BMS);
function Set_LC1_BMS() {
  Set_LC_BMS();
  title_dataStatus_Set.textContent = "LC1_BMS併網狀態";
  valNow_dataStatus_Set = document.querySelector(".infoLC_1 #onGridStatus_LC1");
  getDataForSet(1);
  // valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
}

const setBut_LC2_BMS = document.querySelector(
  ".infoLC_2 #setBut_onGridStatus_LC2"
);
setBut_LC2_BMS.addEventListener("click", Set_LC2_BMS);
function Set_LC2_BMS() {
  Set_LC_BMS();
  title_dataStatus_Set.textContent = "LC2_BMS併網狀態";
  valNow_dataStatus_Set = document.querySelector(".infoLC_2 #onGridStatus_LC2");
  getDataForSet(2);
}

const setBut_LC3_BMS = document.querySelector(
  ".infoLC_3 #setBut_onGridStatus_LC3"
);
setBut_LC3_BMS.addEventListener("click", Set_LC3_BMS);
function Set_LC3_BMS() {
  Set_LC_BMS();
  title_dataStatus_Set.textContent = "LC3_BMS併網狀態";
  valNow_dataStatus_Set = document.querySelector(".infoLC_3 #onGridStatus_LC3");
  getDataForSet(3);
}

const setBut_LC4_BMS = document.querySelector(
  ".infoLC_4 #setBut_onGridStatus_LC4"
);
setBut_LC4_BMS.addEventListener("click", Set_LC4_BMS);
function Set_LC4_BMS() {
  Set_LC_BMS();
  title_dataStatus_Set.textContent = "LC4_BMS併網狀態";
  valNow_dataStatus_Set = document.querySelector(".infoLC_4 #onGridStatus_LC4");
  getDataForSet(4);
}

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
  window_dataStatus_Set.classList.remove("appear");
}

const closeWB_No_dSS = document.querySelector(".dataStatus_Set #closeWB_No");
closeWB_No_dSS.addEventListener("click", closePopup_dSS_No);
function closePopup_dSS_No() {
  radioOption1.checked = false;
  radioOption2.checked = false;
  radioOption3.checked = false;
  window_dataStatus_Set.classList.remove("appear");
}

async function sendDataToBackend() {
  const selectedValue = $('input[name="dataStatus"]:checked').val();
  const title = document.querySelector(".titlePUW");
  try {
    console.log("嘗試向後端發出請求");
    const lcnum = $(".dataStatus_Set .titlePUW").text();
    console.log("lcnum:" + lcnum);
    const response = await fetch("/backendEndpoint", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedValue, lcnum }),
    });

    const data = await response.json();
    console.log(data);
    //displayData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getDataForSet(blockId) {
  try {
    console.log("嘗試向後端發出請求");
    const response = await fetch("/getDataForSet", {
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
