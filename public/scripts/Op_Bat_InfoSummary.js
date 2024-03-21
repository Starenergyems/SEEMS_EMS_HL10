//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {

  console.log("start reading js, update data every 5 sec");
  classAdd('#nB_Operation', 'default_nB')
  routineWork();//刷新畫面
});

// 1秒更新一次
setInterval(routineWork, 1000);
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
/////////////////////////////////////////////////////////////////////////
//rbattery.js operateinfo/battery SET按鈕把數值帶入打勾
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

//rbattery.js operateinfo/battery SET按鈕 控制下行
async function sendDataToBackend() {
  const selectedValue = $('input[name="dataStatus"]:checked').val();
  //const title = document.querySelector(".titlePUW");
  try {
    console.log("嘗試向後端發出請求");
    //ejs回傳id
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

////////////////////////////////////////////////////////////////////////////////////////
async function updateData(){
  var data = await getData(window.location.href+"/data");//port要改
  console.log(data);

  $('#workStatus').text(data.workStatus);
  $('#onGridStatus').text(data.onGridStatus);
  $('#onlineNume').text(data.onlineNum);
  $('#systemV').text(data.systemV);
  $('#systemI').text(data.systemI);
  $('#systemSOC').text(data.systemSOC);
  $('#systemSOH').text(data.systemSOH);
  $('#avgContainerTemp').text(data.avgContainerTemp);
  $('#heartBeat').text(data.heartBeat);
/*LC1************************************ */
  $('#onlineNum_LC1').text(data.onlineNum_LC1);
  $('#workStatus_LC1').text(data.workStatus_LC1);
  $('#onGridStatus_LC1').text(data.onGridStatus_LC1);
  $('#voltage_LC1').text(data.voltage_LC1);
  $('#current_LC1').text(data.current_LC1);
  $('#SOC_LC1').text(data.SOC_LC1);
  $('#SOH_LC1').text(data.SOH_LC1);
  $('#containerTemp_LC1').text(data.containerTemp_LC1);
  $('#V_cell_Max_LC1').text(data.V_cell_Max_LC1);
  $('#V_cell_Min_LC1').text(data.V_cell_Min_LC1);
  $('#V_cell_MaxDiff_LC1').text(data.V_cell_MaxDiff_LC1);
  $('#T_cell_Max_LC1').text(data.T_cell_Max_LC1);
  $('#T_cell_Min_LC1').text(data.T_cell_Min_LC1);
  $('#T_cell_MaxDiff_LC1').text(data.T_cell_MaxDiff_LC1);

  light_color(data.alarm_BMS1_1, '#alarm_BMS1-1', 0, 'setToOpen', 1, "setToClose");
  light_color(data.alarm_BMS1_2, '#alarm_BMS1-2', 0, 'setToOpen', 1, "setToClose");
  light_color(data.fault_BMS1_1, '#fault_BMS1-1', 0, 'setToOpen', 1, "setToClose");
  light_color(data.fault_BMS1_2, '#fault_BMS1-2', 0, 'setToOpen', 1, "setToClose");

  /*LC2*********************** */
  $('#onlineNum_LC2').text(data.onlineNum_LC2);
  $('#workStatus_LC2').text(data.workStatus_LC2);
  $('#onGridStatus_LC2').text(data.onGridStatus_LC2);
  $('#voltage_LC2').text(data.voltage_LC2);
  $('#current_LC2').text(data.current_LC2);
  $('#SOC_LC2').text(data.SOC_LC2);
  $('#SOH_LC2').text(data.SOH_LC2);
  $('#containerTemp_LC2').text(data.containerTemp_LC2);
  $('#V_cell_Max_LC2').text(data.V_cell_Max_LC2);
  $('#V_cell_Min_LC2').text(data.V_cell_Min_LC2);
  $('#V_cell_MaxDiff_LC2').text(data.V_cell_MaxDiff_LC2);
  $('#T_cell_Max_LC2').text(data.T_cell_Max_LC2);
  $('#T_cell_Min_LC2').text(data.T_cell_Min_LC2);
  $('#T_cell_MaxDiff_LC2').text(data.T_cell_MaxDiff_LC2);

  light_color(data.alarm_BMS2_1, '#alarm_BMS2-1', 0, 'setToOpen', 1, "setToClose");
  light_color(data.alarm_BMS2_2, '#alarm_BMS2-2', 0, 'setToOpen', 1, "setToClose");
  light_color(data.fault_BMS2_1, '#fault_BMS2-1', 0, 'setToOpen', 1, "setToClose");
  light_color(data.fault_BMS2_2, '#fault_BMS2-2', 0, 'setToOpen', 1, "setToClose");

  /*LC3*********************** */
  $('#onlineNum_LC3').text(data.onlineNum_LC3);
  $('#workStatus_LC3').text(data.workStatus_LC3);
  $('#onGridStatus_LC3').text(data.onGridStatus_LC3);
  $('#voltage_LC3').text(data.voltage_LC3);
  $('#current_LC3').text(data.current_LC3);
  $('#SOC_LC3').text(data.SOC_LC3);
  $('#SOH_LC3').text(data.SOH_LC3);
  $('#containerTemp_LC3').text(data.containerTemp_LC3);
  $('#V_cell_Max_LC3').text(data.V_cell_Max_LC3);
  $('#V_cell_Min_LC3').text(data.V_cell_Min_LC3);
  $('#V_cell_MaxDiff_LC3').text(data.V_cell_MaxDiff_LC3);
  $('#T_cell_Max_LC3').text(data.T_cell_Max_LC3);
  $('#T_cell_Min_LC3').text(data.T_cell_Min_LC3);
  $('#T_cell_MaxDiff_LC3').text(data.T_cell_MaxDiff_LC3);
  light_color(data.alarm_BMS3_1, '#alarm_BMS3-1', 0, 'setToOpen', 1, "setToClose");
  light_color(data.alarm_BMS3_2, '#alarm_BMS3-2', 0, 'setToOpen', 1, "setToClose");
  light_color(data.fault_BMS3_1, '#fault_BMS3-1', 0, 'setToOpen', 1, "setToClose");
  light_color(data.fault_BMS3_2, '#fault_BMS3-2', 0, 'setToOpen', 1, "setToClose");

  /*LC4*********************** */
  $('#onlineNum_LC4').text(data.onlineNum_LC4);
  $('#workStatus_LC4').text(data.workStatus_LC4);
  $('#onGridStatus_LC4').text(data.onGridStatus_LC4);
  $('#voltage_LC4').text(data.voltage_LC4);
  $('#current_LC4').text(data.current_LC4);
  $('#SOC_LC4').text(data.SOC_LC4);
  $('#SOH_LC4').text(data.SOH_LC4);
  $('#containerTemp_LC4').text(data.containerTemp_LC4);
  $('#V_cell_Max_LC4').text(data.V_cell_Max_LC4);
  $('#V_cell_Min_LC4').text(data.V_cell_Min_LC4);
  $('#V_cell_MaxDiff_LC4').text(data.V_cell_MaxDiff_LC4);
  $('#T_cell_Max_LC4').text(data.T_cell_Max_LC4);
  $('#T_cell_Min_LC4').text(data.T_cell_Min_LC4);
  $('#T_cell_MaxDiff_LC4').text(data.T_cell_MaxDiff_LC4);

  light_color(data.alarm_BMS4_1, '#alarm_BMS4-1', 0, 'setToOpen', 1, "setToClose");
  light_color(data.fault_BMS4_1, '#fault_BMS4-1', 0, 'setToOpen', 1, "setToClose");
  console.log("data updated");
}
