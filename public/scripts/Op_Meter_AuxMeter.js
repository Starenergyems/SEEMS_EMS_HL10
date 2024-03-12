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

document.addEventListener("DOMContentLoaded", afterLoadDCM);
function afterLoadDCM() {
  asdfg = "DOM加载了! 哈哈\n阿哈哈~";
  console.log(asdfg);

  const defaultBut_navBar = document.querySelector("#nB_Operation");
  defaultBut_navBar.classList.add("default_nB");

  updateData();
}

setInterval(updateData, 1000);

async function updateData() {                                   // 更新資料 ajax
  var router = window.location.href + "/data";
  var data = await getData(router);
  console.log(data);

  assign_TextContent_To_SpID("#V_Aux_total", data.V_Aux_total);
  assign_TextContent_To_SpID("#I_Aux_total", data.I_Aux_total);
  assign_TextContent_To_SpID("#P_Aux_total", data.P_Aux_total);
  assign_TextContent_To_SpID("#E_Aux_total", data.E_Aux_total);

  assign_TextContent_To_SpID("#V_Aux_ESS1_1", data.V_Aux_ESS1_1);
  assign_TextContent_To_SpID("#I_Aux_ESS1_1", data.I_Aux_ESS1_1);
  assign_TextContent_To_SpID("#P_Aux_ESS1_1", data.P_Aux_ESS1_1);
  assign_TextContent_To_SpID("#E_Aux_ESS1_1", data.E_Aux_ESS1_1);

  assign_TextContent_To_SpID("#V_Aux_ESS1_2", data.V_Aux_ESS1_2);
  assign_TextContent_To_SpID("#I_Aux_ESS1_2", data.I_Aux_ESS1_2);
  assign_TextContent_To_SpID("#P_Aux_ESS1_2", data.P_Aux_ESS1_2);
  assign_TextContent_To_SpID("#E_Aux_ESS1_2", data.E_Aux_ESS1_2);

  assign_TextContent_To_SpID("#V_Aux_ESS2_1", data.V_Aux_ESS2_1);
  assign_TextContent_To_SpID("#I_Aux_ESS2_1", data.I_Aux_ESS2_1);
  assign_TextContent_To_SpID("#P_Aux_ESS2_1", data.P_Aux_ESS2_1);
  assign_TextContent_To_SpID("#E_Aux_ESS2_1", data.E_Aux_ESS2_1);

  assign_TextContent_To_SpID("#V_Aux_ESS2_2", data.V_Aux_ESS2_2);
  assign_TextContent_To_SpID("#I_Aux_ESS2_2", data.I_Aux_ESS2_2);
  assign_TextContent_To_SpID("#P_Aux_ESS2_2", data.P_Aux_ESS2_2);
  assign_TextContent_To_SpID("#E_Aux_ESS2_2", data.E_Aux_ESS2_2);

  assign_TextContent_To_SpID("#V_Aux_ESS3_1", data.V_Aux_ESS3_1);
  assign_TextContent_To_SpID("#I_Aux_ESS3_1", data.I_Aux_ESS3_1);
  assign_TextContent_To_SpID("#P_Aux_ESS3_1", data.P_Aux_ESS3_1);
  assign_TextContent_To_SpID("#E_Aux_ESS3_1", data.E_Aux_ESS3_1);

  assign_TextContent_To_SpID("#V_Aux_ESS3_2", data.V_Aux_ESS3_2);
  assign_TextContent_To_SpID("#I_Aux_ESS3_2", data.I_Aux_ESS3_2);
  assign_TextContent_To_SpID("#P_Aux_ESS3_2", data.P_Aux_ESS3_2);
  assign_TextContent_To_SpID("#E_Aux_ESS3_2", data.E_Aux_ESS3_2);

  assign_TextContent_To_SpID("#V_Aux_ESS4", data.V_Aux_ESS4);
  assign_TextContent_To_SpID("#I_Aux_ESS4", data.I_Aux_ESS4);
  assign_TextContent_To_SpID("#P_Aux_ESS4", data.P_Aux_ESS4);
  assign_TextContent_To_SpID("#E_Aux_ESS4", data.E_Aux_ESS4);

  assign_TextContent_To_SpID("#V_Aux_HV", data.V_Aux_HV);
  assign_TextContent_To_SpID("#I_Aux_HV", data.I_Aux_HV);
  assign_TextContent_To_SpID("#P_Aux_HV", data.P_Aux_HV);
  assign_TextContent_To_SpID("#E_Aux_HV", data.E_Aux_HV);

  assign_TextContent_To_SpID("#V_Aux_CtrlRoom", data.V_Aux_CtrlRoom);
  assign_TextContent_To_SpID("#I_Aux_CtrlRoom", data.I_Aux_CtrlRoom);
  assign_TextContent_To_SpID("#P_Aux_CtrlRoom", data.P_Aux_CtrlRoom);
  assign_TextContent_To_SpID("#E_Aux_CtrlRoom", data.E_Aux_CtrlRoom);
}
