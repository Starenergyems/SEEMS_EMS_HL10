// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

$(document).ready(function () {

  console.log("start reading js");
  classAdd('#nB_Operation', 'default_nB');
  classAdd('#infoBMS', 'subTitle_unclick');
  routineWork();
});

setInterval(routineWork, 1000);

/////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////

const window_info_RackAlm = document.querySelector(".info_RackAlm");
const title_AlarmCMU = document.querySelector(".info_RackAlm .titleAlarmCMU");
const title_FaultCMU = document.querySelector(".info_RackAlm .titleFaultCMU");
const title_StatusHW = document.querySelector(".info_RackAlm .titleStatusHW");

const closeWB_info_RackAlm = document.querySelector(".info_RackAlm #closeWB_No");
closeWB_info_RackAlm.addEventListener("click", closePopup_info_RackAlm);
function closePopup_info_RackAlm() {
  window_info_RackAlm.classList.remove("appear");
}

async function show_info_RackAlm(num_of_Rack) {
  window_info_RackAlm.classList.add("appear");
  title_AlarmCMU.textContent = `Rack${num_of_Rack} CMU告警`;
  title_FaultCMU.textContent = `Rack${num_of_Rack} CMU故障`;
  title_StatusHW.textContent = `Rack${num_of_Rack} 硬體狀態`;

  let getData = await change_num_of_Rack(num_of_Rack);
  console.log(getData);

  updateData_RackAlarm(getData.alarmCMU, getData.faultCMU, getData.statusHW);
  // console.log("點擊時觸發更新");
}

async function change_num_of_Rack(num_of_Rack) {
  try {
    console.log("嘗試向後端發出請求");
    const response = await fetch("/change_num_of_Rack", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ num_of_Rack }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const OpenRackAlm_R01 = document.querySelector("#openRackAlm_R01");
OpenRackAlm_R01.addEventListener("click", function () { show_info_RackAlm("01"); });

const OpenRackAlm_R02 = document.querySelector("#openRackAlm_R02");
OpenRackAlm_R02.addEventListener("click", function () { show_info_RackAlm("02"); });

const OpenRackAlm_R03 = document.querySelector("#openRackAlm_R03");
OpenRackAlm_R03.addEventListener("click", function () { show_info_RackAlm("03"); });

const OpenRackAlm_R04 = document.querySelector("#openRackAlm_R04");
OpenRackAlm_R04.addEventListener("click", function () { show_info_RackAlm("04"); });

const OpenRackAlm_R05 = document.querySelector("#openRackAlm_R05");
OpenRackAlm_R05.addEventListener("click", function () { show_info_RackAlm("05"); });

const OpenRackAlm_R06 = document.querySelector("#openRackAlm_R06");
OpenRackAlm_R06.addEventListener("click", function () { show_info_RackAlm("06"); });

const OpenRackAlm_R07 = document.querySelector("#openRackAlm_R07");
OpenRackAlm_R07.addEventListener("click", function () { show_info_RackAlm("07"); });

const OpenRackAlm_R08 = document.querySelector("#openRackAlm_R08");
OpenRackAlm_R08.addEventListener("click", function () { show_info_RackAlm("08"); });

const OpenRackAlm_R09 = document.querySelector("#openRackAlm_R09");
OpenRackAlm_R09.addEventListener("click", function () { show_info_RackAlm("09"); });

const OpenRackAlm_R10 = document.querySelector("#openRackAlm_R10");
OpenRackAlm_R10.addEventListener("click", function () { show_info_RackAlm("10"); });

const OpenRackAlm_R11 = document.querySelector("#openRackAlm_R11");
OpenRackAlm_R11.addEventListener("click", function () { show_info_RackAlm("11"); });

const OpenRackAlm_R12 = document.querySelector("#openRackAlm_R12");
OpenRackAlm_R12.addEventListener("click", function () { show_info_RackAlm("12"); });

/////////////////////////////////////////////////////////////////////////

async function updateData() {
  var router = window.location.href + "data";
  const response = await fetch(router);
  const data = await response.json();
  console.log(data);

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

  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R01', data.V_cell_MaxDiff_R01);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R02', data.V_cell_MaxDiff_R02);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R03', data.V_cell_MaxDiff_R03);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R04', data.V_cell_MaxDiff_R04);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R05', data.V_cell_MaxDiff_R05);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R06', data.V_cell_MaxDiff_R06);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R07', data.V_cell_MaxDiff_R07);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R08', data.V_cell_MaxDiff_R08);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R09', data.V_cell_MaxDiff_R09);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R10', data.V_cell_MaxDiff_R10);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R11', data.V_cell_MaxDiff_R11);
  Determine_BGC_of_VcMaxDiff('#V_cell_MaxDiff_R12', data.V_cell_MaxDiff_R12);

  $('#T_cell_Max_R01').text(data.T_cell_Max_R01);
  $('#T_cell_Max_R02').text(data.T_cell_Max_R02);
  $('#T_cell_Max_R03').text(data.T_cell_Max_R03);
  $('#T_cell_Max_R04').text(data.T_cell_Max_R04);
  $('#T_cell_Max_R05').text(data.T_cell_Max_R05);
  $('#T_cell_Max_R06').text(data.T_cell_Max_R06);
  $('#T_cell_Max_R07').text(data.T_cell_Max_R07);
  $('#T_cell_Max_R08').text(data.T_cell_Max_R08);
  $('#T_cell_Max_R09').text(data.T_cell_Max_R09);
  $('#T_cell_Max_R10').text(data.T_cell_Max_R10);
  $('#T_cell_Max_R11').text(data.T_cell_Max_R11);
  $('#T_cell_Max_R12').text(data.T_cell_Max_R12);
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

  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R01', data.T_cell_MaxDiff_R01);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R02', data.T_cell_MaxDiff_R02);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R03', data.T_cell_MaxDiff_R03);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R04', data.T_cell_MaxDiff_R04);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R05', data.T_cell_MaxDiff_R05);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R06', data.T_cell_MaxDiff_R06);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R07', data.T_cell_MaxDiff_R07);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R08', data.T_cell_MaxDiff_R08);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R09', data.T_cell_MaxDiff_R09);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R10', data.T_cell_MaxDiff_R10);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R11', data.T_cell_MaxDiff_R11);
  Determine_BGC_of_TcMaxDiff('#T_cell_MaxDiff_R12', data.T_cell_MaxDiff_R12);

  const classCollection_DL = ["setToClose", "ErrData"];

  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R01", data.DL_of_alarmCMU_R01, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R02", data.DL_of_alarmCMU_R02, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R03", data.DL_of_alarmCMU_R03, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R04", data.DL_of_alarmCMU_R04, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R05", data.DL_of_alarmCMU_R05, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R06", data.DL_of_alarmCMU_R06, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R07", data.DL_of_alarmCMU_R07, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R08", data.DL_of_alarmCMU_R08, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R09", data.DL_of_alarmCMU_R09, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R10", data.DL_of_alarmCMU_R10, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R11", data.DL_of_alarmCMU_R11, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#alarmCMU_R12", data.DL_of_alarmCMU_R12, classCollection_DL);

  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R01", data.DL_of_faultCMU_R01, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R02", data.DL_of_faultCMU_R02, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R03", data.DL_of_faultCMU_R03, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R04", data.DL_of_faultCMU_R04, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R05", data.DL_of_faultCMU_R05, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R06", data.DL_of_faultCMU_R06, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R07", data.DL_of_faultCMU_R07, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R08", data.DL_of_faultCMU_R08, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R09", data.DL_of_faultCMU_R09, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R10", data.DL_of_faultCMU_R10, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R11", data.DL_of_faultCMU_R11, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#faultCMU_R12", data.DL_of_faultCMU_R12, classCollection_DL);

  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R01", data.DL_of_statusHW_R01, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R02", data.DL_of_statusHW_R02, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R03", data.DL_of_statusHW_R03, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R04", data.DL_of_statusHW_R04, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R05", data.DL_of_statusHW_R05, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R06", data.DL_of_statusHW_R06, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R07", data.DL_of_statusHW_R07, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R08", data.DL_of_statusHW_R08, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R09", data.DL_of_statusHW_R09, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R10", data.DL_of_statusHW_R10, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R11", data.DL_of_statusHW_R11, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#statusHW_R12", data.DL_of_statusHW_R12, classCollection_DL);

  updateData_RackAlarm(data.alarmCMU_rBitS, data.faultCMU_rBitS, data.statusHW_rBitS);
  // console.log("定時更新");
};

function updateData_RackAlarm(alarmCMU_rBitS, faultCMU_rBitS, statusHW_rBitS) {
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_0", alarmCMU_rBitS[0]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_1", alarmCMU_rBitS[1]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_2", alarmCMU_rBitS[2]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_3", alarmCMU_rBitS[3]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_4", alarmCMU_rBitS[4]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_5", alarmCMU_rBitS[5]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_6", alarmCMU_rBitS[6]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_8", alarmCMU_rBitS[8]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_9", alarmCMU_rBitS[9]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_10", alarmCMU_rBitS[10]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_11", alarmCMU_rBitS[11]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_12", alarmCMU_rBitS[12]);
  assign_BitD_to_StatusOfDL_with_SpID("#alarmCMU_bit_20", alarmCMU_rBitS[20]);

  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_0", faultCMU_rBitS[0]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_1", faultCMU_rBitS[1]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_2", faultCMU_rBitS[2]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_3", faultCMU_rBitS[3]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_4", faultCMU_rBitS[4]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_5", faultCMU_rBitS[5]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_7", faultCMU_rBitS[7]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_9", faultCMU_rBitS[9]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_10", faultCMU_rBitS[10]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_12", faultCMU_rBitS[12]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_13", faultCMU_rBitS[13]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_14", faultCMU_rBitS[14]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_15", faultCMU_rBitS[15]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_17", faultCMU_rBitS[17]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_18", faultCMU_rBitS[18]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_20", faultCMU_rBitS[20]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_21", faultCMU_rBitS[21]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_22", faultCMU_rBitS[22]);
  assign_BitD_to_StatusOfDL_with_SpID("#faultCMU_bit_23", faultCMU_rBitS[23]);

  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_0", statusHW_rBitS[0]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_1", statusHW_rBitS[1]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_2", statusHW_rBitS[2]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_3", statusHW_rBitS[3]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_4", statusHW_rBitS[4]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_5", statusHW_rBitS[5]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_6", statusHW_rBitS[6]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_7", statusHW_rBitS[7]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_8", statusHW_rBitS[8]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_9", statusHW_rBitS[9]);
  assign_BitD_to_StatusOfDL_with_SpID("#statusHW_bit_12", statusHW_rBitS[12]);
}

function Determine_BGC_of_VcMaxDiff(ID, maxDiff) {
  const element = document.querySelector(ID);

  if (maxDiff === "#*#") {
    // element.style.background = "#9D653D";
    element.style.background = "#000000";
  } else {
    if (maxDiff >= 50) {
      element.style.background = "#FF0000";
    } else if (maxDiff >= 40) {
      element.style.background = "#EF860F";
    } else if (maxDiff >= 30) {
      element.style.background = "#FFFF00";
    } else {
      element.style.background = "none";
    }
  }
}

function Determine_BGC_of_TcMaxDiff(ID, maxDiff) {
  const element = document.querySelector(ID);

  if (maxDiff === "#*#") {
    // element.style.background = "#9D653D";
    element.style.background = "#000000";
  } else {
    if (maxDiff >= 6) {
      element.style.background = "#FF0000";
    } else if (maxDiff >= 4) {
      element.style.background = "#EF860F";
    } else if (maxDiff >= 2) {
      element.style.background = "#FFFF00";
    } else {
      element.style.background = "none";
    }
  }
}
