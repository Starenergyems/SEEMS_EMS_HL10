// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

document.addEventListener("DOMContentLoaded", afterLoadDCM);
function afterLoadDCM() {
  asdfg = "DOM加载了! 哈哈\n阿哈哈~";
  console.log(asdfg);

  const defaultBut_navBar = document.querySelector("#nB_Operation");
  defaultBut_navBar.classList.add("default_nB");

  routineWork();
}

setInterval(routineWork, 500);

//////////////////////////////////////////////////////////////////////////////

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

const window_info_Recloser = document.querySelector(".info_Recloser");
const window_info_RelayMVCB = document.querySelector(".info_RelayMVCB");
const window_info_RelayVCB = document.querySelector(".info_RelayVCB");
const title_info_RelayVCB = document.querySelector(".info_RelayVCB .titlePUW");

const dataLight_Recloser = document.querySelector("#Recloser_MVCB");
dataLight_Recloser.addEventListener("click", show_info_Recloser);
function show_info_Recloser() {
  window_info_Recloser.classList.add("appear");
}

const closeWB_info_Recloser = document.querySelector(".info_Recloser #closeWB_No");
closeWB_info_Recloser.addEventListener("click", closePopup_info_Recloser);
function closePopup_info_Recloser() {
  window_info_Recloser.classList.remove("appear");
}

/////////////////////////////////////////////////////////////////////////

const dataLight_Rly_MVCB = document.querySelector("#Rly_MVCB");
dataLight_Rly_MVCB.addEventListener("click", show_info_RelayMVCB);
function show_info_RelayMVCB() {
  window_info_RelayMVCB.classList.add("appear");
}

const closeWB_info_RelayMVCB = document.querySelector(".info_RelayMVCB #closeWB_No");
closeWB_info_RelayMVCB.addEventListener("click", closePopup_info_RelayMVCB);
function closePopup_info_RelayMVCB() {
  window_info_RelayMVCB.classList.remove("appear");
}

/////////////////////////////////////////////////////////////////////////

const closeWB_info_RelayVCB = document.querySelector(".info_RelayVCB #closeWB_No");
closeWB_info_RelayVCB.addEventListener("click", closePopup_info_RelayVCB);
function closePopup_info_RelayVCB() {
  window_info_RelayVCB.classList.remove("appear");
}

async function show_info_RelayVCB(num_of_RelayVCB) {
  window_info_RelayVCB.classList.add("appear");

  let getData = await change_num_of_RelayVCB(num_of_RelayVCB);
  // console.log(getData);

  title_info_RelayVCB.textContent = getData.title_of_pUW;
  updateData_relayVCB(getData.relayVCB_revBitString);
  // console.log("點擊時觸發更新");
}

async function change_num_of_RelayVCB(num_of_RelayVCB) {
  try {
    console.log("嘗試向後端發出請求");
    const response = await fetch("/change_num_of_RelayVCB", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ num_of_RelayVCB }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const dataLight_Rly_VCB_1 = document.querySelector("#Rly_VCB_1");
dataLight_Rly_VCB_1.addEventListener("click", function () { show_info_RelayVCB(1); });
// dataLight_Rly_VCB_1.addEventListener("click", show_info_RelayVCB1);
// function show_info_RelayVCB1() {
//   title_info_RelayVCB.textContent = "VCB盤1保護電驛";
//   show_info_RelayVCB();
// }

const dataLight_Rly_VCB_2 = document.querySelector("#Rly_VCB_2");
dataLight_Rly_VCB_2.addEventListener("click", function () { show_info_RelayVCB(2); });

const dataLight_Rly_VCB_3 = document.querySelector("#Rly_VCB_3");
dataLight_Rly_VCB_3.addEventListener("click", function () { show_info_RelayVCB(3); });

const dataLight_Rly_VCB_4 = document.querySelector("#Rly_VCB_4");
dataLight_Rly_VCB_4.addEventListener("click", function () { show_info_RelayVCB(4); });

const dataLight_Rly_VCB_aux = document.querySelector("#Rly_VCB_aux");
dataLight_Rly_VCB_aux.addEventListener("click", function () { show_info_RelayVCB(5); });

/////////////////////////////////////////////////////////////////////////

const window_dataStatus_Set = document.querySelector(".dataStatus_Set");
const title_dataStatus_Set = document.querySelector(".dataStatus_Set .titlePUW");
// const option1_dataStatus_Set = document.querySelector(".dataStatus_Set #option_1");
// const option2_dataStatus_Set = document.querySelector(".dataStatus_Set #option_2");
const radioOption1 = document.querySelector(".dataStatus_Set #radioOpt_1");
const radioOption2 = document.querySelector(".dataStatus_Set #radioOpt_2");
const alertInfo_dataStatus_Set = document.querySelector(".dataStatus_Set .alertInfo");
let optionChecked_dataStatus_Set;

const window_WrongDataSet = document.querySelector(".alert_WrongDataSet");

function clearCheckedRadioOption() {
  radioOption1.checked = false;
  radioOption2.checked = false;
}

// function Set_ACB() {
//   window_dataStatus_Set.classList.add("appear");
//   clearCheckedRadioOption();
//   option1_dataStatus_Set.textContent = "投入";
//   option2_dataStatus_Set.textContent = "切離";
//   alertInfo_dataStatus_Set.textContent = "";
// }

async function Set_CB(numOfCB, CBlabel) {
  console.log(CBlabel.id);
  if (CBlabel.classList.contains("ctrlable")) {
    window_dataStatus_Set.classList.add("appear");
    clearCheckedRadioOption();
    alertInfo_dataStatus_Set.textContent = "";

    title_dataStatus_Set.textContent = `A${numOfCB[0]}-ACB-${numOfCB[2]}`;

    let getData = await record_num_of_CB(numOfCB);
    console.log(getData);
  } else {
    window_WrongDataSet.classList.add("appear");
  }
}

async function record_num_of_CB(num_of_CB) {
  try {
    console.log("嘗試向後端發出請求");
    const response = await fetch("/record_num_of_CB", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ num_of_CB }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const setACB_1_1 = document.querySelector(".singleLineD #ACB_1_1");
setACB_1_1.addEventListener("click", function (e) {
  // console.log(e.target.id, "#");
  // console.log(this.id, "@");
  Set_CB("1_1", this);
});

const setACB_1_2 = document.querySelector(".singleLineD #ACB_1_2");
setACB_1_2.addEventListener("click", function (e) { Set_CB("1_2", this); });

const setACB_1_3 = document.querySelector(".singleLineD #ACB_1_3");
setACB_1_3.addEventListener("click", function (e) { Set_CB("1_3", this); });

const setACB_2_1 = document.querySelector(".singleLineD #ACB_2_1");
setACB_2_1.addEventListener("click", function (e) { Set_CB("2_1", this); });

const setACB_2_2 = document.querySelector(".singleLineD #ACB_2_2");
setACB_2_2.addEventListener("click", function (e) { Set_CB("2_2", this); });

const setACB_2_3 = document.querySelector(".singleLineD #ACB_2_3");
setACB_2_3.addEventListener("click", function (e) { Set_CB("2_3", this); });

const setACB_3_1 = document.querySelector(".singleLineD #ACB_3_1");
setACB_3_1.addEventListener("click", function (e) { Set_CB("3_1", this); });

const setACB_3_2 = document.querySelector(".singleLineD #ACB_3_2");
setACB_3_2.addEventListener("click", function (e) { Set_CB("3_2", this); });

const setACB_3_3 = document.querySelector(".singleLineD #ACB_3_3");
setACB_3_3.addEventListener("click", function (e) { Set_CB("3_3", this); });

const setACB_4_1 = document.querySelector(".singleLineD #ACB_4_1");
setACB_4_1.addEventListener("click", function (e) { Set_CB("4_1", this); });

const button_WrongDataSet = document.querySelector(".alert_WrongDataSet button");
button_WrongDataSet.addEventListener("click", close_WrongDataSet);
function close_WrongDataSet() {
  window_WrongDataSet.classList.remove("appear");
}

/////////////////////////////////////////////////////////////////////////

async function set_CB_Data(setValue) {
  try {
    console.log("嘗試向後端發出請求");
    const response = await fetch("/set_CB_Data", {
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

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
  if (radioOption1.checked === true || radioOption2.checked === true) {
    optionChecked_dataStatus_Set = document.querySelector(".dataStatus_Set [name=dataStatus]:checked");

    set_CB_Data(optionChecked_dataStatus_Set.value);

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

async function updateData() {                                   // 更新資料 ajax
  var router = window.location.href + "/data";
  var data = await getData(router);
  console.log(data);

  check_ctrlableStatus_of_ACB("#ACB_1_1", data.permission);
  check_ctrlableStatus_of_ACB("#ACB_1_2", data.permission);
  check_ctrlableStatus_of_ACB("#ACB_1_3", data.permission);
  check_ctrlableStatus_of_ACB("#ACB_2_1", data.permission);
  check_ctrlableStatus_of_ACB("#ACB_2_2", data.permission);
  check_ctrlableStatus_of_ACB("#ACB_2_3", data.permission);
  check_ctrlableStatus_of_ACB("#ACB_3_1", data.permission);
  check_ctrlableStatus_of_ACB("#ACB_3_2", data.permission);
  check_ctrlableStatus_of_ACB("#ACB_3_3", data.permission);
  check_ctrlableStatus_of_ACB("#ACB_4_1", data.permission);

  const classCollection_SL_of_CB = ["setToClose", "Err", "ErrData"];

  assign_ClassD_to_StatusOfDL_with_SpID("#MVCB", data.statusL_of_MVCB, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#VCB_1", data.statusL_of_VCB1, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#VCB_2", data.statusL_of_VCB2, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#VCB_3", data.statusL_of_VCB3, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#VCB_4", data.statusL_of_VCB4, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#VCB_aux", data.statusL_of_VCB_aux, classCollection_SL_of_CB);

  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_1_1", data.statusL_of_ACB1_1, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_1_2", data.statusL_of_ACB1_2, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_1_3", data.statusL_of_ACB1_3, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_2_1", data.statusL_of_ACB2_1, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_2_2", data.statusL_of_ACB2_2, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_2_3", data.statusL_of_ACB2_3, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_3_1", data.statusL_of_ACB3_1, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_3_2", data.statusL_of_ACB3_2, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_3_3", data.statusL_of_ACB3_3, classCollection_SL_of_CB);
  assign_ClassD_to_StatusOfDL_with_SpID("#ACB_4_1", data.statusL_of_ACB4_1, classCollection_SL_of_CB);

  const classCollection_DL = ["setToClose", "ErrData"];

  assign_ClassD_to_StatusOfDL_with_SpID("#Rly_MVCB", data.statusL_of_relayMVCB, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Rly_VCB_1", data.statusL_of_relayVCB1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Rly_VCB_2", data.statusL_of_relayVCB2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Rly_VCB_3", data.statusL_of_relayVCB3, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Rly_VCB_4", data.statusL_of_relayVCB4, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Rly_VCB_aux", data.statusL_of_relayVCB_aux, classCollection_DL);

  assign_ClassD_to_StatusOfDL_with_SpID("#Recloser_MVCB", data.statusL_of_recloser, classCollection_DL);

  assign_TextContent_To_SpID("#temp_TR1", data.temp_TR1);
  assign_TextContent_To_SpID("#temp_TR2", data.temp_TR2);
  assign_TextContent_To_SpID("#temp_TR3", data.temp_TR3);
  assign_TextContent_To_SpID("#temp_TR4", data.temp_TR4);
  assign_TextContent_To_SpID("#temp_TR_aux", data.temp_TR_aux);

  animation_of_Thermometer("TR1", data.temp_TR1);
  animation_of_Thermometer("TR2", data.temp_TR2);
  animation_of_Thermometer("TR3", data.temp_TR3);
  animation_of_Thermometer("TR4", data.temp_TR4);
  animation_of_Thermometer("TR_aux", data.temp_TR_aux);

  assign_TextContent_To_SpID("#V_Freq", data.V_Freq);
  assign_TextContent_To_SpID("#I_Freq", data.I_Freq);
  assign_TextContent_To_SpID("#P_Freq", data.P_Freq);
  assign_TextContent_To_SpID("#Q_Freq", data.Q_Freq);
  assign_TextContent_To_SpID("#V_ab_Freq", data.V_ab_Freq);
  assign_TextContent_To_SpID("#V_bc_Freq", data.V_bc_Freq);
  assign_TextContent_To_SpID("#V_ca_Freq", data.V_ca_Freq);
  assign_TextContent_To_SpID("#I_a_Freq", data.I_a_Freq);
  assign_TextContent_To_SpID("#I_b_Freq", data.I_b_Freq);
  assign_TextContent_To_SpID("#I_c_Freq", data.I_c_Freq);
  assign_TextContent_To_SpID("#S_Freq", data.S_Freq);
  assign_TextContent_To_SpID("#PF_Freq", data.PF_Freq);
  assign_TextContent_To_SpID("#Freq_Freq", data.Freq_Freq);
  assign_TextContent_To_SpID("#AE_imp_Freq", data.AE_imp_Freq);
  assign_TextContent_To_SpID("#AE_exp_Freq", data.AE_exp_Freq);
  assign_TextContent_To_SpID("#RE_imp_Freq", data.RE_imp_Freq);
  assign_TextContent_To_SpID("#RE_exp_Freq", data.RE_exp_Freq);

  assign_BitD_to_StatusOfDL_with_SpID("#recloserMode_bit_0", data.recloserMode[0]);
  assign_BitD_to_StatusOfDL_with_SpID("#recloserMode_bit_1", data.recloserMode[1]);
  assign_BitD_to_StatusOfDL_with_SpID("#recloserMode_bit_2", data.recloserMode[2]);

  assign_BitD_to_StatusOfDL_with_SpID("#recloserStatus_bit_0", data.recloserStatus[0]);
  assign_BitD_to_StatusOfDL_with_SpID("#recloserStatus_bit_1", data.recloserStatus[1]);
  assign_BitD_to_StatusOfDL_with_SpID("#recloserStatus_bit_2", data.recloserStatus[2]);
  assign_BitD_to_StatusOfDL_with_SpID("#recloserStatus_bit_3", data.recloserStatus[3]);
  assign_BitD_to_StatusOfDL_with_SpID("#recloserStatus_bit_4", data.recloserStatus[4]);
  assign_BitD_to_StatusOfDL_with_SpID("#recloserStatus_bit_5", data.recloserStatus[5]);

  assign_BitD_to_StatusOfDL_with_SpID("#recloserRelay_bit_4", data.recloserRelay[4]);
  assign_BitD_to_StatusOfDL_with_SpID("#recloserRelay_bit_5", data.recloserRelay[5]);
  assign_BitD_to_StatusOfDL_with_SpID("#recloserRelay_bit_6", data.recloserRelay[6]);

  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_0", data.relayMVCB_S0[0]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_1", data.relayMVCB_S0[1]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_2", data.relayMVCB_S0[2]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_3", data.relayMVCB_S0[3]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_4", data.relayMVCB_S0[4]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_5", data.relayMVCB_S0[5]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_6", data.relayMVCB_S0[6]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_7", data.relayMVCB_S0[7]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_8", data.relayMVCB_S0[8]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_9", data.relayMVCB_S0[9]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_10", data.relayMVCB_S0[10]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_11", data.relayMVCB_S0[11]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_12", data.relayMVCB_S0[12]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_13", data.relayMVCB_S0[13]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_14", data.relayMVCB_S0[14]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S0_bit_15", data.relayMVCB_S0[15]);

  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S1_bit_0", data.relayMVCB_S1[0]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S1_bit_1", data.relayMVCB_S1[1]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S1_bit_2", data.relayMVCB_S1[2]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S1_bit_3", data.relayMVCB_S1[3]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S1_bit_4", data.relayMVCB_S1[4]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S1_bit_5", data.relayMVCB_S1[5]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S1_bit_6", data.relayMVCB_S1[6]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S1_bit_7", data.relayMVCB_S1[7]);

  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_0", data.relayMVCB_S2[0]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_1", data.relayMVCB_S2[1]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_2", data.relayMVCB_S2[2]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_3", data.relayMVCB_S2[3]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_4", data.relayMVCB_S2[4]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_5", data.relayMVCB_S2[5]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_6", data.relayMVCB_S2[6]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_7", data.relayMVCB_S2[7]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_8", data.relayMVCB_S2[8]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayMVCB_S2_bit_9", data.relayMVCB_S2[9]);

  updateData_relayVCB(data.relayVCB);
  // console.log("定時更新");
}

function updateData_relayVCB(revBitString) {
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_0", revBitString[0]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_1", revBitString[1]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_2", revBitString[2]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_3", revBitString[3]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_4", revBitString[4]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_5", revBitString[5]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_6", revBitString[6]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_7", revBitString[7]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_8", revBitString[8]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_9", revBitString[9]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_10", revBitString[10]);
  assign_BitD_to_StatusOfDL_with_SpID("#relayVCB_bit_11", revBitString[11]);
}

function animation_of_Thermometer(transformerID, oilTemp) {
  const thermoBar = document.querySelector(`#thermoBar_${transformerID}`);
  const thermoBottom = document.querySelector(`#thermoBot_${transformerID}`);

  if (oilTemp === "#*#") {
    // thermoBar.style.background = "#9D653D";
    // thermoBottom.style.background = "#9D653D";
    thermoBar.style.background = "#000000";
    thermoBottom.style.background = "#000000";
    thermoBar.style.height = "32px";
  } else {
    const temp_min = 0;
    const temp_max = 100;
    const height_min = 7;
    const height_max = 32;

    if (oilTemp >= 70) {
      thermoBar.style.background = "#E53935";
      thermoBottom.style.background = "#E53935";
    } else if (oilTemp < 35) {
      thermoBar.style.background = "#236E37";
      thermoBottom.style.background = "#236E37";
    } else {
      thermoBar.style.background = "#FE922D";
      thermoBottom.style.background = "#FE922D";
    }

    if (oilTemp >= temp_max) {
      thermoBar.style.height = "32px";
    } else if (oilTemp <= temp_min) {
      thermoBar.style.height = "7px";
    } else {
      let barHeight = height_min + (oilTemp - temp_min) / (temp_max - temp_min) * (height_max - height_min);
      thermoBar.style.height = barHeight + "px";
    }
  }
}

function check_ctrlableStatus_of_ACB(ID, Permission) {
  const element = document.querySelector(ID);

  if (Permission === "manager") {
    element.classList.add("ctrlable");
  } else {
    element.classList.remove("ctrlable");
  }
}

