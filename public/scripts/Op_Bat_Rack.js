//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {

  console.log("start reading js");
  classAdd('#nB_Operation', 'default_nB');
  classAdd('#infoBMS', 'subTitle_unclick');
  updateData();
});

setInterval(updateData, 1000);

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

///////////////////////////////////////////////////////////////////////
// //找到所有 openRackAlm 元素
// const openRackAlmElements = document.querySelectorAll(".openRackAlm");

// // 監聽每個 openRackAlm 元素的點擊事件
// openRackAlmElements.forEach((element) => {
//   element.addEventListener("click", () => {
//     const id = element.id.replace("openRackAlm_", ""); // 取得點擊的元素 ID，例如 'R01'

//     // 發送 ID 到後端
//     fetch(`/operateinfo/battery/rack/:rackId?rackId=${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // 處理後端返回的數據，假設你有一個處理數據的函數 updatePopupUI
//         updatePopupUI(data);
//       })
//       .catch((error) => {
//         console.error("請求失敗", error);
//       });
//   });
// });

// // 根據後端返回的數據更新彈出視窗的函數
// function updatePopupUI(data) {
//   // 在這裡根據後端返回的 data 更新你的彈出視窗的 UI
//   // 假設你有一個 ID 為 popupContent 的元素用於顯示數據
//   const popupContent = document.getElementById("popupContent");

//   // 假設 data 是一個包含需要顯示的數據的物件
//   // 你需要根據實際的數據結構進行處理
//   popupContent.textContent = JSON.stringify(data);
// }

const window_info_RackAlm = document.querySelector(".info_RackAlm");
const title_AlarmCMU = document.querySelector(".info_RackAlm .titleAlarmCMU");
const title_FaultCMU = document.querySelector(".info_RackAlm .titleFaultCMU");
const title_StatusHW = document.querySelector(".info_RackAlm .titleStatusHW");

const closeWB_info_RackAlm = document.querySelector(
  ".info_RackAlm #closeWB_No"
);
closeWB_info_RackAlm.addEventListener("click", closePopup_info_RackAlm);
function closePopup_info_RackAlm() {
  window_info_RackAlm.classList.remove("appear");
}

function show_info_RackAlm() {
  window_info_RackAlm.classList.add("appear");
}

const OpenRackAlm_R01 = document.querySelector("#openRackAlm_R01");
OpenRackAlm_R01.addEventListener("click", show_info_RackAlm_R01);
function show_info_RackAlm_R01() {
  title_AlarmCMU.textContent = "Rack01 CMU告警";
  title_FaultCMU.textContent = "Rack01 CMU故障";
  title_StatusHW.textContent = "Rack01 硬體狀態";
  getData(1);
  show_info_RackAlm();
}

const OpenRackAlm_R02 = document.querySelector("#openRackAlm_R02");
OpenRackAlm_R02.addEventListener("click", show_info_RackAlm_R02);
function show_info_RackAlm_R02() {
  title_AlarmCMU.textContent = "Rack02 CMU告警";
  title_FaultCMU.textContent = "Rack02 CMU故障";
  title_StatusHW.textContent = "Rack02 硬體狀態";
  getData(2);
  show_info_RackAlm();
}

const OpenRackAlm_R03 = document.querySelector("#openRackAlm_R03");
OpenRackAlm_R03.addEventListener("click", show_info_RackAlm_R03);
function show_info_RackAlm_R03() {
  title_AlarmCMU.textContent = "Rack03 CMU告警";
  title_FaultCMU.textContent = "Rack03 CMU故障";
  title_StatusHW.textContent = "Rack03 硬體狀態";
  getData(3);
  show_info_RackAlm();
}

const OpenRackAlm_R04 = document.querySelector("#openRackAlm_R04");
OpenRackAlm_R04.addEventListener("click", show_info_RackAlm_R04);
function show_info_RackAlm_R04() {
  title_AlarmCMU.textContent = "Rack04 CMU告警";
  title_FaultCMU.textContent = "Rack04 CMU故障";
  title_StatusHW.textContent = "Rack04 硬體狀態";
  getData(4);
  show_info_RackAlm();
}

const OpenRackAlm_R05 = document.querySelector("#openRackAlm_R05");
OpenRackAlm_R05.addEventListener("click", show_info_RackAlm_R05);
function show_info_RackAlm_R05() {
  title_AlarmCMU.textContent = "Rack05 CMU告警";
  title_FaultCMU.textContent = "Rack05 CMU故障";
  title_StatusHW.textContent = "Rack05 硬體狀態";
  getData(5);
  show_info_RackAlm();
}

const OpenRackAlm_R06 = document.querySelector("#openRackAlm_R06");
OpenRackAlm_R06.addEventListener("click", show_info_RackAlm_R06);
function show_info_RackAlm_R06() {
  title_AlarmCMU.textContent = "Rack06 CMU告警";
  title_FaultCMU.textContent = "Rack06 CMU故障";
  title_StatusHW.textContent = "Rack06 硬體狀態";
  getData(6);
  show_info_RackAlm();
}

const OpenRackAlm_R07 = document.querySelector("#openRackAlm_R07");
OpenRackAlm_R07.addEventListener("click", show_info_RackAlm_R07);
function show_info_RackAlm_R07() {
  title_AlarmCMU.textContent = "Rack07 CMU告警";
  title_FaultCMU.textContent = "Rack07 CMU故障";
  title_StatusHW.textContent = "Rack07 硬體狀態";
  getData(7);
  show_info_RackAlm();
}

const OpenRackAlm_R08 = document.querySelector("#openRackAlm_R08");
OpenRackAlm_R08.addEventListener("click", show_info_RackAlm_R08);
function show_info_RackAlm_R08() {
  title_AlarmCMU.textContent = "Rack08 CMU告警";
  title_FaultCMU.textContent = "Rack08 CMU故障";
  title_StatusHW.textContent = "Rack08 硬體狀態";
  getData(8);
  show_info_RackAlm();
}

const OpenRackAlm_R09 = document.querySelector("#openRackAlm_R09");
OpenRackAlm_R09.addEventListener("click", show_info_RackAlm_R09);
function show_info_RackAlm_R09() {
  title_AlarmCMU.textContent = "Rack09 CMU告警";
  title_FaultCMU.textContent = "Rack09 CMU故障";
  title_StatusHW.textContent = "Rack09 硬體狀態";
  getData(9);
  show_info_RackAlm();
}

const OpenRackAlm_R10 = document.querySelector("#openRackAlm_R10");
OpenRackAlm_R10.addEventListener("click", show_info_RackAlm_R10);
function show_info_RackAlm_R10() {
  title_AlarmCMU.textContent = "Rack10 CMU告警";
  title_FaultCMU.textContent = "Rack10 CMU故障";
  title_StatusHW.textContent = "Rack10 硬體狀態";
  getData(10);
  show_info_RackAlm();
}

const OpenRackAlm_R11 = document.querySelector("#openRackAlm_R11");
OpenRackAlm_R11.addEventListener("click", show_info_RackAlm_R11);
function show_info_RackAlm_R11() {
  title_AlarmCMU.textContent = "Rack11 CMU告警";
  title_FaultCMU.textContent = "Rack11 CMU故障";
  title_StatusHW.textContent = "Rack11 硬體狀態";
  getData(11);
  show_info_RackAlm();
}

const OpenRackAlm_R12 = document.querySelector("#openRackAlm_R12");
OpenRackAlm_R12.addEventListener("click", show_info_RackAlm_R12);
function show_info_RackAlm_R12() {
  title_AlarmCMU.textContent = "Rack12 CMU告警";
  title_FaultCMU.textContent = "Rack12 CMU故障";
  title_StatusHW.textContent = "Rack12 硬體狀態";
  getData(12);
  show_info_RackAlm();
}

//獲取該區塊id rack彈跳視窗

async function getData(blockId) {
  try {
    console.log("嘗試向後端發出請求");
    const response = await fetch("/getData", {
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


async function updateData(){ 
  var router = window.location.href+"data";
  const response = await fetch(router);
  const data = await response.json();
  console.log(data);

  /*工作狀態***************************************** */
  $('#Mode_R01').text(data.Mode_R01);
  $('#Mode_R02').text(data.Mode_R02);
  $('#Mode_R03').text(data.Mode_R03);
  $('#Mode_R04').text(data.Mode_R04);
  $('#Mode_R05').text(data.Mode_R05);
  $('#Mode_R06').text(data.Mode_R06);
  $('#Mode_R07').text(data.Mode_R07);
  $('#Mode_R08').text(data.Mode_R08);
  $('#Mode_R09').text(data.Mode_R09);
  $('#Mode_R10').text(data.Mode_R10);
  $('#Mode_R11').text(data.Mode_R11);
  $('#Mode_R12').text(data.Mode_R12);
/*電壓******************************************* */
  $('#V_rack_R01').text(data.V_rack_R01);
  $('#V_rack_R02').text(data.V_rack_R02);
  $('#V_rack_R03').text(data.V_rack_R03);
  $('#V_rack_R04').text(data.V_rack_R04);
  $('#V_rack_R05').text(data.V_rack_R05);
  $('#V_rack_R06').text(data.V_rack_R06);
  $('#V_rack_R07').text(data.V_rack_R07);
  $('#V_rack_R08').text(data.V_rack_R08);
  $('#V_rack_R09').text(data.V_rack_R09);
  $('#V_rack_R10').text(data.V_rack_R10);
  $('#V_rack_R11').text(data.V_rack_R11);
  $('#V_rack_R12').text(data.V_rack_R12);

/*電流******************************************* */
  $('#I_rack_R01').text(data.I_rack_R01);
  $('#I_rack_R02').text(data.I_rack_R02);
  $('#I_rack_R03').text(data.I_rack_R03);
  $('#I_rack_R04').text(data.I_rack_R04);
  $('#I_rack_R05').text(data.I_rack_R05);
  $('#I_rack_R06').text(data.I_rack_R06);
  $('#I_rack_R07').text(data.I_rack_R07);
  $('#I_rack_R08').text(data.I_rack_R08);
  $('#I_rack_R09').text(data.I_rack_R09);
  $('#I_rack_R10').text(data.I_rack_R10);
  $('#I_rack_R11').text(data.I_rack_R11);
  $('#I_rack_R12').text(data.I_rack_R12);

/*SOC******************************************* */
  $('#SOC_R01').text(data.SOC_R01);
  $('#SOC_R02').text(data.SOC_R02);
  $('#SOC_R03').text(data.SOC_R03);
  $('#SOC_R04').text(data.SOC_R04);
  $('#SOC_R05').text(data.SOC_R05);
  $('#SOC_R06').text(data.SOC_R06);
  $('#SOC_R07').text(data.SOC_R07);
  $('#SOC_R08').text(data.SOC_R08);
  $('#SOC_R09').text(data.SOC_R09);
  $('#SOC_R10').text(data.SOC_R10);
  $('#SOC_R11').text(data.SOC_R11);
  $('#SOC_R12').text(data.SOC_R12);

/*SOH******************************************* */
  $('#SOH_R01').text(data.SOH_R01);
  $('#SOH_R02').text(data.SOH_R02);
  $('#SOH_R03').text(data.SOH_R03);
  $('#SOH_R04').text(data.SOH_R04);
  $('#SOH_R05').text(data.SOH_R05);
  $('#SOH_R06').text(data.SOH_R06);
  $('#SOH_R07').text(data.SOH_R07);
  $('#SOH_R08').text(data.SOH_R08);
  $('#SOH_R09').text(data.SOH_R09);
  $('#SOH_R10').text(data.SOH_R10);
  $('#SOH_R11').text(data.SOH_R11);
  $('#SOH_R12').text(data.SOH_R12);

/*絕緣阻抗******************************************* */

  $('#Impedance_R01').text(data.Impedance_R01);
  $('#Impedance_R02').text(data.Impedance_R02);
  $('#Impedance_R03').text(data.Impedance_R03);
  $('#Impedance_R04').text(data.Impedance_R04);
  $('#Impedance_R05').text(data.Impedance_R05);
  $('#Impedance_R06').text(data.Impedance_R06);
  $('#Impedance_R07').text(data.Impedance_R07);
  $('#Impedance_R08').text(data.Impedance_R08);
  $('#Impedance_R09').text(data.Impedance_R09);
  $('#Impedance_R10').text(data.Impedance_R10);
  $('#Impedance_R11').text(data.Impedance_R11);
  $('#Impedance_R12').text(data.Impedance_R12);

/*最高電芯電壓******************************************* */
  $('#V_cell_Max_R01').text(data.V_cell_Max_R01);
  $('#V_cell_Max_R02').text(data.V_cell_Max_R02);
  $('#V_cell_Max_R03').text(data.V_cell_Max_R03);
  $('#V_cell_Max_R04').text(data.V_cell_Max_R04);
  $('#V_cell_Max_R05').text(data.V_cell_Max_R05);
  $('#V_cell_Max_R06').text(data.V_cell_Max_R06);
  $('#V_cell_Max_R07').text(data.V_cell_Max_R07);
  $('#V_cell_Max_R08').text(data.V_cell_Max_R08);
  $('#V_cell_Max_R09').text(data.V_cell_Max_R09);
  $('#V_cell_Max_R10').text(data.V_cell_Max_R10);
  $('#V_cell_Max_R11').text(data.V_cell_Max_R11);
  $('#V_cell_Max_R12').text(data.V_cell_Max_R12);

/*位置******************************************* */
  $('#No_BMU_VcMax_R01').text(data.bmucellNoVcMax_R01.hiByte);
  $('#No_Cell_VcMax_R01').text(data.bmucellNoVcMax_R01.loByte);

  $('#No_BMU_VcMax_R02').text(data.bmucellNoVcMax_R02.hiByte);
  $('#No_Cell_VcMax_R02').text(data.bmucellNoVcMax_R02.loByte);

  $('#No_BMU_VcMax_R03').text(data.bmucellNoVcMax_R03.hiByte);
  $('#No_Cell_VcMax_R03').text(data.bmucellNoVcMax_R03.loByte);

  $('#No_BMU_VcMax_R04').text(data.bmucellNoVcMax_R04.hiByte);
  $('#No_Cell_VcMax_R04').text(data.bmucellNoVcMax_R04.loByte);

  $('#No_BMU_VcMax_R05').text(data.bmucellNoVcMax_R05.hiByte);
  $('#No_Cell_VcMax_R05').text(data.bmucellNoVcMax_R05.loByte);

  $('#No_BMU_VcMax_R06').text(data.bmucellNoVcMax_R06.hiByte);
  $('#No_Cell_VcMax_R06').text(data.bmucellNoVcMax_R06.loByte);

  $('#No_BMU_VcMax_R07').text(data.bmucellNoVcMax_R07.hiByte);
  $('#No_Cell_VcMax_R07').text(data.bmucellNoVcMax_R07.loByte);

  $('#No_BMU_VcMax_R08').text(data.bmucellNoVcMax_R08.hiByte);
  $('#No_Cell_VcMax_R08').text(data.bmucellNoVcMax_R08.loByte);

  $('#No_BMU_VcMax_R09').text(data.bmucellNoVcMax_R09.hiByte);
  $('#No_Cell_VcMax_R09').text(data.bmucellNoVcMax_R09.loByte);

  $('#No_BMU_VcMax_R10').text(data.bmucellNoVcMax_R10.hiByte);
  $('#No_Cell_VcMax_R10').text(data.bmucellNoVcMax_R10.loByte);

  $('#No_BMU_VcMax_R11').text(data.bmucellNoVcMax_R11.hiByte);
  $('#No_Cell_VcMax_R11').text(data.bmucellNoVcMax_R11.loByte);

  $('#No_BMU_VcMax_R12').text(data.bmucellNoVcMax_R12.hiByte);
  $('#No_Cell_VcMax_R12').text(data.bmucellNoVcMax_R12.loByte);

  /*最低電芯電壓*********************************************** */
  $('#V_cell_Min_R01').text(data.V_cell_Min_R01);
  $('#V_cell_Min_R02').text(data.V_cell_Min_R02);
  $('#V_cell_Min_R03').text(data.V_cell_Min_R03);
  $('#V_cell_Min_R04').text(data.V_cell_Min_R04);
  $('#V_cell_Min_R05').text(data.V_cell_Min_R05);
  $('#V_cell_Min_R06').text(data.V_cell_Min_R06);
  $('#V_cell_Min_R07').text(data.V_cell_Min_R07);
  $('#V_cell_Min_R08').text(data.V_cell_Min_R08);
  $('#V_cell_Min_R09').text(data.V_cell_Min_R09);
  $('#V_cell_Min_R10').text(data.V_cell_Min_R10);
  $('#V_cell_Min_R11').text(data.V_cell_Min_R11);
  $('#V_cell_Min_R12').text(data.V_cell_Min_R12);

  /*位置******************************************************** */

  $('#No_BMU_VcMin_R01').text(data.bmucellNoVcMin_R01.hiByte);
  $('#No_Cell_VcMin_R01').text(data.bmucellNoVcMin_R01.loByte);

  $('#No_BMU_VcMin_R02').text(data.bmucellNoVcMin_R02.hiByte);
  $('#No_Cell_VcMin_R02').text(data.bmucellNoVcMin_R02.loByte);

  $('#No_BMU_VcMin_R03').text(data.bmucellNoVcMin_R03.hiByte);
  $('#No_Cell_VcMin_R03').text(data.bmucellNoVcMin_R03.loByte);

  $('#No_BMU_VcMin_R04').text(data.bmucellNoVcMin_R04.hiByte);
  $('#No_Cell_VcMin_R04').text(data.bmucellNoVcMin_R04.loByte);

  $('#No_BMU_VcMin_R05').text(data.bmucellNoVcMin_R05.hiByte);
  $('#No_Cell_VcMin_R05').text(data.bmucellNoVcMin_R05.loByte);

  $('#No_BMU_VcMin_R06').text(data.bmucellNoVcMin_R06.hiByte);
  $('#No_Cell_VcMin_R06').text(data.bmucellNoVcMin_R06.loByte);

  $('#No_BMU_VcMin_R07').text(data.bmucellNoVcMin_R07.hiByte);
  $('#No_Cell_VcMin_R07').text(data.bmucellNoVcMin_R07.loByte);

  $('#No_BMU_VcMin_R08').text(data.bmucellNoVcMin_R08.hiByte);
  $('#No_Cell_VcMin_R08').text(data.bmucellNoVcMin_R08.loByte);

  $('#No_BMU_VcMin_R09').text(data.bmucellNoVcMin_R09.hiByte);
  $('#No_Cell_VcMin_R09').text(data.bmucellNoVcMin_R09.loByte);

  $('#No_BMU_VcMin_R10').text(data.bmucellNoVcMin_R10.hiByte);
  $('#No_Cell_VcMin_R10').text(data.bmucellNoVcMin_R10.loByte);

  $('#No_BMU_VcMin_R11').text(data.bmucellNoVcMin_R11.hiByte);
  $('#No_Cell_VcMin_R11').text(data.bmucellNoVcMin_R11.loByte);

  $('#No_BMU_VcMin_R12').text(data.bmucellNoVcMin_R12.hiByte);
  $('#No_Cell_VcMin_R12').text(data.bmucellNoVcMin_R12.loByte);

/*最大電芯壓差*************************************************************************** */

  $('#V_cell_MaxDiff_R01').text(data.V_cell_MaxDiff_R01);
  $('#V_cell_MaxDiff_R02').text(data.V_cell_MaxDiff_R02);
  $('#V_cell_MaxDiff_R03').text(data.V_cell_MaxDiff_R03);
  $('#V_cell_MaxDiff_R04').text(data.V_cell_MaxDiff_R04);
  $('#V_cell_MaxDiff_R05').text(data.V_cell_MaxDiff_R05);
  $('#V_cell_MaxDiff_R06').text(data.V_cell_MaxDiff_R06);
  $('#V_cell_MaxDiff_R07').text(data.V_cell_MaxDiff_R07);
  $('#V_cell_MaxDiff_R08').text(data.V_cell_MaxDiff_R08);
  $('#V_cell_MaxDiff_R09').text(data.V_cell_MaxDiff_R09);
  $('#V_cell_MaxDiff_R10').text(data.V_cell_MaxDiff_R10);
  $('#V_cell_MaxDiff_R11').text(data.V_cell_MaxDiff_R11);
  $('#V_cell_MaxDiff_R12').text(data.V_cell_MaxDiff_R12);

  /*最高電芯溫度************************************************************** */
  $('#T_cell_Max__R01').text(data.T_cell_Max__R01);
  $('#T_cell_Max__R02').text(data.T_cell_Max__R02);
  $('#T_cell_Max__R03').text(data.T_cell_Max__R03);
  $('#T_cell_Max__R04').text(data.T_cell_Max__R04);
  $('#T_cell_Max__R05').text(data.T_cell_Max__R05);
  $('#T_cell_Max__R06').text(data.T_cell_Max__R06);
  $('#T_cell_Max__R07').text(data.T_cell_Max__R07);
  $('#T_cell_Max__R08').text(data.T_cell_Max__R08);
  $('#T_cell_Max__R09').text(data.T_cell_Max__R09);
  $('#T_cell_Max__R10').text(data.T_cell_Max__R10);
  $('#T_cell_Max__R11').text(data.T_cell_Max__R11);
  $('#T_cell_Max__R12').text(data.T_cell_Max__R12);

  /*位置************************************************************************* */
  $('#No_BMU_TcMax_R01').text(data.bmucellNoTcMax_R01.hiByte);
  $('#No_Cell_TcMax_R01').text(data.bmucellNoTcMax_R01.loByte);

  $('#No_BMU_TcMax_R02').text(data.bmucellNoTcMax_R02.hiByte);
  $('#No_Cell_TcMax_R02').text(data.bmucellNoTcMax_R02.loByte);

  $('#No_BMU_TcMax_R03').text(data.bmucellNoTcMax_R03.hiByte);
  $('#No_Cell_TcMax_R03').text(data.bmucellNoTcMax_R03.loByte);

  $('#No_BMU_TcMax_R04').text(data.bmucellNoTcMax_R04.hiByte);
  $('#No_Cell_TcMax_R04').text(data.bmucellNoTcMax_R04.loByte);

  $('#No_BMU_TcMax_R05').text(data.bmucellNoTcMax_R05.hiByte);
  $('#No_Cell_TcMax_R05').text(data.bmucellNoTcMax_R05.loByte);

  $('#No_BMU_TcMax_R06').text(data.bmucellNoTcMax_R06.hiByte);
  $('#No_Cell_TcMax_R06').text(data.bmucellNoTcMax_R06.loByte);

  $('#No_BMU_TcMax_R07').text(data.bmucellNoTcMax_R07.hiByte);
  $('#No_Cell_TcMax_R07').text(data.bmucellNoTcMax_R07.loByte);

  $('#No_BMU_TcMax_R08').text(data.bmucellNoTcMax_R08.hiByte);
  $('#No_Cell_TcMax_R08').text(data.bmucellNoTcMax_R08.loByte);

  $('#No_BMU_TcMax_R09').text(data.bmucellNoTcMax_R09.hiByte);
  $('#No_Cell_TcMax_R09').text(data.bmucellNoTcMax_R09.loByte);

  $('#No_BMU_TcMax_R10').text(data.bmucellNoTcMax_R10.hiByte);
  $('#No_Cell_TcMax_R10').text(data.bmucellNoTcMax_R10.loByte);

  $('#No_BMU_TcMax_R11').text(data.bmucellNoTcMax_R11.hiByte);
  $('#No_Cell_TcMax_R11').text(data.bmucellNoTcMax_R11.loByte);

  $('#No_BMU_TcMax_R12').text(data.bmucellNoTcMax_R12.hiByte);
  $('#No_Cell_TcMax_R12').text(data.bmucellNoTcMax_R12.loByte);

  /*最低電芯溫度************************************************************** */
  $('#T_cell_Min_R01').text(data.T_cell_Min_R01);
  $('#T_cell_Min_R02').text(data.T_cell_Min_R02);
  $('#T_cell_Min_R03').text(data.T_cell_Min_R03);
  $('#T_cell_Min_R04').text(data.T_cell_Min_R04);
  $('#T_cell_Min_R05').text(data.T_cell_Min_R05);
  $('#T_cell_Min_R06').text(data.T_cell_Min_R06);
  $('#T_cell_Min_R07').text(data.T_cell_Min_R07);
  $('#T_cell_Min_R08').text(data.T_cell_Min_R08);
  $('#T_cell_Min_R09').text(data.T_cell_Min_R09);
  $('#T_cell_Min_R10').text(data.T_cell_Min_R10);
  $('#T_cell_Min_R11').text(data.T_cell_Min_R11);
  $('#T_cell_Min_R12').text(data.T_cell_Min_R12);

/*位置****************************************************************************** */
  $('#No_BMU_TcMin_R01').text(data.bmucellNoTcMin_R01.hiByte);
  $('#No_Cell_TcMin_R01').text(data.bmucellNoTcMin_R01.loByte);

  $('#No_BMU_TcMin_R02').text(data.bmucellNoTcMin_R02.hiByte);
  $('#No_Cell_TcMin_R02').text(data.bmucellNoTcMin_R02.loByte);

  $('#No_BMU_TcMin_R03').text(data.bmucellNoTcMin_R03.hiByte);
  $('#No_Cell_TcMin_R03').text(data.bmucellNoTcMin_R03.loByte);

  $('#No_BMU_TcMin_R04').text(data.bmucellNoTcMin_R04.hiByte);
  $('#No_Cell_TcMin_R04').text(data.bmucellNoTcMin_R04.loByte);

  $('#No_BMU_TcMin_R05').text(data.bmucellNoTcMin_R05.hiByte);
  $('#No_Cell_TcMin_R05').text(data.bmucellNoTcMin_R05.loByte);

  $('#No_BMU_TcMin_R06').text(data.bmucellNoTcMin_R06.hiByte);
  $('#No_Cell_TcMin_R06').text(data.bmucellNoTcMin_R06.loByte);

  $('#No_BMU_TcMin_R07').text(data.bmucellNoTcMin_R07.hiByte);
  $('#No_Cell_TcMin_R07').text(data.bmucellNoTcMin_R07.loByte);

  $('#No_BMU_TcMin_R08').text(data.bmucellNoTcMin_R08.hiByte);
  $('#No_Cell_TcMin_R08').text(data.bmucellNoTcMin_R08.loByte);

  $('#No_BMU_TcMin_R09').text(data.bmucellNoTcMin_R09.hiByte);
  $('#No_Cell_TcMin_R09').text(data.bmucellNoTcMin_R09.loByte);

  $('#No_BMU_TcMin_R10').text(data.bmucellNoTcMin_R10.hiByte);
  $('#No_Cell_TcMin_R10').text(data.bmucellNoTcMin_R10.loByte);

  $('#No_BMU_TcMin_R11').text(data.bmucellNoTcMin_R11.hiByte);
  $('#No_Cell_TcMin_R11').text(data.bmucellNoTcMin_R11.loByte);

  $('#No_BMU_TcMin_R12').text(data.bmucellNoTcMin_R12.hiByte);
  $('#No_Cell_TcMin_R12').text(data.bmucellNoTcMin_R12.loByte);

/*最大電芯電壓***************************************************************** */
  $('#T_cell_MaxDiff_R01').text(data.T_cell_MaxDiff_R01);
  $('#T_cell_MaxDiff_R02').text(data.T_cell_MaxDiff_R02);
  $('#T_cell_MaxDiff_R03').text(data.T_cell_MaxDiff_R03);
  $('#T_cell_MaxDiff_R04').text(data.T_cell_MaxDiff_R04);
  $('#T_cell_MaxDiff_R05').text(data.T_cell_MaxDiff_R05);
  $('#T_cell_MaxDiff_R06').text(data.T_cell_MaxDiff_R06);
  $('#T_cell_MaxDiff_R07').text(data.T_cell_MaxDiff_R07);
  $('#T_cell_MaxDiff_R08').text(data.T_cell_MaxDiff_R08);
  $('#T_cell_MaxDiff_R09').text(data.T_cell_MaxDiff_R09);
  $('#T_cell_MaxDiff_R10').text(data.T_cell_MaxDiff_R10);
  $('#T_cell_MaxDiff_R11').text(data.T_cell_MaxDiff_R11);
  $('#T_cell_MaxDiff_R12').text(data.T_cell_MaxDiff_R12);

/*CMU告警**************************************************************************** */  
  if (data.alarmCMU_R01_rawD === "0"){
    classAdd('#alarmCMU_R01', 'setToClose');
  } else {
    classRemove('#alarmCMU_R01', 'setToClose');
  }

  if (data.alarmCMU_R02_rawD === "0"){
    classAdd('#alarmCMU_R02', 'setToClose');
  } else {
    classRemove('#alarmCMU_R02', 'setToClose');
  }

  if (data.alarmCMU_R03_rawD === "0"){
    classAdd('#alarmCMU_R03', 'setToClose');
  } else {
    classRemove('#alarmCMU_R03', 'setToClose');
  }

  if (data.alarmCMU_R04_rawD === "0"){
    classAdd('#alarmCMU_R04', 'setToClose');
  } else {
    classRemove('#alarmCMU_R04', 'setToClose');
  }

  if (data.alarmCMU_R05_rawD === "0"){
    classAdd('#alarmCMU_R05', 'setToClose');
  } else {
    classRemove('#alarmCMU_R05', 'setToClose');
  }

  if (data.alarmCMU_R06_rawD === "0"){
    classAdd('#alarmCMU_R06', 'setToClose');
  } else {
    classRemove('#alarmCMU_R06', 'setToClose');
  }

  if (data.alarmCMU_R07_rawD === "0"){
    classAdd('#alarmCMU_R07', 'setToClose');
  } else {
    classRemove('#alarmCMU_R07', 'setToClose');
  }

  if (data.alarmCMU_R08_rawD === "0"){
    classAdd('#alarmCMU_R08', 'setToClose');
  } else {
    classRemove('#alarmCMU_R08', 'setToClose');
  }

  if (data.alarmCMU_R09_rawD === "0"){
    classAdd('#alarmCMU_R09', 'setToClose');
  } else {
    classRemove('#alarmCMU_R09', 'setToClose');
  }

  if (data.alarmCMU_R10_rawD === "0"){
    classAdd('#alarmCMU_R10', 'setToClose');
  } else {
    classRemove('#alarmCMU_R10', 'setToClose');
  }

  if (data.alarmCMU_R11_rawD === "0"){
    classAdd('#alarmCMU_R11', 'setToClose');
  } else {
    classRemove('#alarmCMU_R11', 'setToClose');
  }

  if (data.alarmCMU_R12_rawD === "0"){
    classAdd('#alarmCMU_R12', 'setToClose');
  } else {
    classRemove('#alarmCMU_R12', 'setToClose');
  }

  /*CMU故障***************************************************** */
  if (data.faultCMU_R01_rawD === "0"){
    classAdd('#faultCMU_R01', 'setToClose');
  } else {
    classRemove('#faultCMU_R01', 'setToClose');
  }

  if (data.faultCMU_R02_rawD === "0"){
    classAdd('#faultCMU_R02', 'setToClose');
  } else {
    classRemove('#faultCMU_R02', 'setToClose');
  }

  if (data.faultCMU_R03_rawD === "0"){
    classAdd('#faultCMU_R03', 'setToClose');
  } else {
    classRemove('#faultCMU_R03', 'setToClose');
  }

  if (data.faultCMU_R04_rawD === "0"){
    classAdd('#faultCMU_R04', 'setToClose');
  } else {
    classRemove('#faultCMU_R04', 'setToClose');
  }

  if (data.faultCMU_R05_rawD === "0"){
    classAdd('#faultCMU_R05', 'setToClose');
  } else {
    classRemove('#faultCMU_R05', 'setToClose');
  }

  if (data.faultCMU_R06_rawD === "0"){
    classAdd('#faultCMU_R06', 'setToClose');
  } else {
    classRemove('#faultCMU_R06', 'setToClose');
  }

  if (data.faultCMU_R07_rawD === "0"){
    classAdd('#faultCMU_R07', 'setToClose');
  } else {
    classRemove('#faultCMU_R07', 'setToClose');
  }

  if (data.faultCMU_R08_rawD === "0"){
    classAdd('#faultCMU_R08', 'setToClose');
  } else {
    classRemove('#faultCMU_R08', 'setToClose');
  }

  if (data.faultCMU_R09_rawD === "0"){
    classAdd('#faultCMU_R09', 'setToClose');
  } else {
    classRemove('#faultCMU_R09', 'setToClose');
  }

  if (data.faultCMU_R10_rawD === "0"){
    classAdd('#faultCMU_R10', 'setToClose');
  } else {
    classRemove('#faultCMU_R10', 'setToClose');
  }

  if (data.faultCMU_R11_rawD === "0"){
    classAdd('#faultCMU_R11', 'setToClose');
  } else {
    classRemove('#faultCMU_R11', 'setToClose');
  }

  if (data.faultCMU_R12_rawD === "0"){
    classAdd('#faultCMU_R12', 'setToClose');
  } else {
    classRemove('#faultCMU_R12', 'setToClose');
  }

  /*硬體狀態******************************************************************* */
  if (data.DL_of_statusHW_R01 === "setToClose"){
    classAdd('#statusHW_R01', 'setToClose');
  } else {
    classRemove('#statusHW_R01', 'setToClose');
  }

  if (data.DL_of_statusHW_R02 === "setToClose"){
    classAdd('#statusHW_R02', 'setToClose');
  } else {
    classRemove('#statusHW_R02', 'setToClose');
  }

  if (data.DL_of_statusHW_R03 === "setToClose"){
    classAdd('#statusHW_R03', 'setToClose');
  } else {
    classRemove('#statusHW_R03', 'setToClose');
  }

  if (data.DL_of_statusHW_R04 === "setToClose"){
    classAdd('#statusHW_R04', 'setToClose');
  } else {
    classRemove('#statusHW_R04', 'setToClose');
  }

  if (data.DL_of_statusHW_R05 === "setToClose"){
    classAdd('#statusHW_R05', 'setToClose');
  } else {
    classRemove('#statusHW_R05', 'setToClose');
  }

  if (data.DL_of_statusHW_R06 === "setToClose"){
    classAdd('#statusHW_R06', 'setToClose');
  } else {
    classRemove('#statusHW_R06', 'setToClose');
  }

  if (data.DL_of_statusHW_R07 === "setToClose"){
    classAdd('#statusHW_R07', 'setToClose');
  } else {
    classRemove('#statusHW_R07', 'setToClose');
  }

  if (data.DL_of_statusHW_R08 === "setToClose"){
    classAdd('#statusHW_R08', 'setToClose');
  } else {
    classRemove('#statusHW_R08', 'setToClose');
  }

  if (data.DL_of_statusHW_R09 === "setToClose"){
    classAdd('#statusHW_R09', 'setToClose');
  } else {
    classRemove('#statusHW_R09', 'setToClose');
  }

  if (data.DL_of_statusHW_R10 === "setToClose"){
    classAdd('#statusHW_R10', 'setToClose');
  } else {
    classRemove('#statusHW_R10', 'setToClose');
  }

  if (data.DL_of_statusHW_R11 === "setToClose"){
    classAdd('#statusHW_R11', 'setToClose');
  } else {
    classRemove('#statusHW_R11', 'setToClose');
  }

  if (data.DL_of_statusHW_R12 === "setToClose"){
    classAdd('#statusHW_R12', 'setToClose');
  } else {
    classRemove('#statusHW_R12', 'setToClose');
  }
  
console.log("data updated");
};