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

function show_info_RelayVCB() {
  window_info_RelayVCB.classList.add("appear");
}

const dataLight_Rly_VCB_1 = document.querySelector("#Rly_VCB_1");
dataLight_Rly_VCB_1.addEventListener("click", show_info_RelayVCB1);
function show_info_RelayVCB1() {
  title_info_RelayVCB.textContent = "VCB盤1保護電驛";
  show_info_RelayVCB();
}

const dataLight_Rly_VCB_2 = document.querySelector("#Rly_VCB_2");
dataLight_Rly_VCB_2.addEventListener("click", show_info_RelayVCB2);
function show_info_RelayVCB2() {
  title_info_RelayVCB.textContent = "VCB盤2保護電驛";
  show_info_RelayVCB();
}

const dataLight_Rly_VCB_3 = document.querySelector("#Rly_VCB_3");
dataLight_Rly_VCB_3.addEventListener("click", show_info_RelayVCB3);
function show_info_RelayVCB3() {
  title_info_RelayVCB.textContent = "VCB盤3保護電驛";
  show_info_RelayVCB();
}

const dataLight_Rly_VCB_4 = document.querySelector("#Rly_VCB_4");
dataLight_Rly_VCB_4.addEventListener("click", show_info_RelayVCB4);
function show_info_RelayVCB4() {
  title_info_RelayVCB.textContent = "VCB盤4保護電驛";
  show_info_RelayVCB();
}

const dataLight_Rly_VCB_aux = document.querySelector("#Rly_VCB_aux");
dataLight_Rly_VCB_aux.addEventListener("click", show_info_RelayVCBaux);
function show_info_RelayVCBaux() {
  title_info_RelayVCB.textContent = "輔電VCB盤保護電驛";
  show_info_RelayVCB();
}

/////////////////////////////////////////////////////////////////////////

const window_dataStatus_Set = document.querySelector(".dataStatus_Set");
const title_dataStatus_Set = document.querySelector(".dataStatus_Set .titlePUW");
const option1_dataStatus_Set = document.querySelector(".dataStatus_Set #option_1");
const option2_dataStatus_Set = document.querySelector(".dataStatus_Set #option_2");
const radioOption1 = document.querySelector(".dataStatus_Set #radioOpt_1");
const radioOption2 = document.querySelector(".dataStatus_Set #radioOpt_2");
const alertInfo_dataStatus_Set = document.querySelector(".dataStatus_Set .alertInfo");
// let valNow_dataStatus_Set;
let valLightNow_dataStatus_Set;
// let option1_Description;
// let option2_Description;
let optionChecked_dataStatus_Set;

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

function Set_CB(numOfCB, CBlabel) {
  window_dataStatus_Set.classList.add("appear");
  clearCheckedRadioOption();
  option1_dataStatus_Set.textContent = "投入";
  option2_dataStatus_Set.textContent = "切離";
  alertInfo_dataStatus_Set.textContent = "";

  // title_dataStatus_Set.textContent = "A1-ACB-1" + `a0:${numOfCB[0]},a2:${numOfCB[2]}`;
  title_dataStatus_Set.textContent = `A${numOfCB[0]}-ACB-${numOfCB[2]}`;
  console.log(CBlabel.id);
  if (CBlabel.classList.contains("status_CB123")) {
    console.log("有這個class");
  } else {
    console.log("沒有這個class@@");
  }
}

const setACB_1_1 = document.querySelector(".singleLineD #ACB_1_1");
setACB_1_1.addEventListener("click", function (e) {
  // console.log(e.target.id, "#");
  // console.log(this.id, "@");
  Set_CB("9_4", this);
});


// setACB_1_1.addEventListener("click", Set_ACB_1_1);
// function Set_ACB_1_1() {
//   Set_ACB();
//   title_dataStatus_Set.textContent = "A1-ACB-1";
//   // valNow_dataStatus_Set = document.querySelector(".sysInfo #sysMode");
//   valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_1");
// }

const setACB_1_2 = document.querySelector(".singleLineD #ACB_1_2");
setACB_1_2.addEventListener("click", Set_ACB_1_2);
function Set_ACB_1_2() {
  Set_ACB();
  title_dataStatus_Set.textContent = "A1-ACB-2";
  valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_2");
}

const setACB_1_3 = document.querySelector(".singleLineD #ACB_1_3");
setACB_1_3.addEventListener("click", Set_ACB_1_3);
function Set_ACB_1_3() {
  Set_ACB();
  title_dataStatus_Set.textContent = "A1-ACB-3";
  valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_1_3");
}

const setACB_2_1 = document.querySelector(".singleLineD #ACB_2_1");
setACB_2_1.addEventListener("click", Set_ACB_2_1);
function Set_ACB_2_1() {
  Set_ACB();
  title_dataStatus_Set.textContent = "A2-ACB-1";
  valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_2_1");
}

const setACB_2_2 = document.querySelector(".singleLineD #ACB_2_2");
setACB_2_2.addEventListener("click", Set_ACB_2_2);
function Set_ACB_2_2() {
  Set_ACB();
  title_dataStatus_Set.textContent = "A2-ACB-2";
  valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_2_2");
}

const setACB_2_3 = document.querySelector(".singleLineD #ACB_2_3");
setACB_2_3.addEventListener("click", Set_ACB_2_3);
function Set_ACB_2_3() {
  Set_ACB();
  title_dataStatus_Set.textContent = "A2-ACB-3";
  valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_2_3");
}

const setACB_3_1 = document.querySelector(".singleLineD #ACB_3_1");
setACB_3_1.addEventListener("click", Set_ACB_3_1);
function Set_ACB_3_1() {
  Set_ACB();
  title_dataStatus_Set.textContent = "A3-ACB-1";
  valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_3_1");
}

const setACB_3_2 = document.querySelector(".singleLineD #ACB_3_2");
setACB_3_2.addEventListener("click", Set_ACB_3_2);
function Set_ACB_3_2() {
  Set_ACB();
  title_dataStatus_Set.textContent = "A3-ACB-2";
  valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_3_2");
}

const setACB_3_3 = document.querySelector(".singleLineD #ACB_3_3");
setACB_3_3.addEventListener("click", Set_ACB_3_3);
function Set_ACB_3_3() {
  Set_ACB();
  title_dataStatus_Set.textContent = "A3-ACB-3";
  valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_3_3");
}

const setACB_4_1 = document.querySelector(".singleLineD #ACB_4_1");
setACB_4_1.addEventListener("click", Set_ACB_4_1);
function Set_ACB_4_1() {
  Set_ACB();
  title_dataStatus_Set.textContent = "A4-ACB-1";
  valLightNow_dataStatus_Set = document.querySelector(".singleLineD #ACB_4_1");
}

const closeWB_Yes_dSS = document.querySelector(".dataStatus_Set #closeWB_Yes");
closeWB_Yes_dSS.addEventListener("click", closePopup_dSS_Yes);
function closePopup_dSS_Yes() {
  if (radioOption1.checked === true || radioOption2.checked === true) {
    optionChecked_dataStatus_Set = document.querySelector(".dataStatus_Set [name=dataStatus]:checked");

    if (optionChecked_dataStatus_Set.value === "1") {
      // valNow_dataStatus_Set.textContent = option1_Description;
      valLightNow_dataStatus_Set.classList.add("setToClose");
    } else if (optionChecked_dataStatus_Set.value === "2") {
      // valNow_dataStatus_Set.textContent = option2_Description;
      valLightNow_dataStatus_Set.classList.remove("setToClose");
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
