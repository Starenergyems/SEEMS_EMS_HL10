//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {
  console.log("start reading js");
  classAdd("#nB_Operation","default_nB");
  updateData();
});

setInterval(updateData, 5000);
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

async function updateData() {
  //更新資料
  var router = window.location.href + "data";
  console.log(router);
  var data = await getData(router);
  console.log(data);
  $("#chargeStatus").text(data.chargeStatus);
  $("#tot_E_chg").text(data.tot_E_chg);
  $("#tot_E_dcg").text(data.tot_E_dcg);

  /*輸出限制************************************* */
  $('#max_P_chg').text(data.max_P_chg);
  $("#max_P_dcg").text(data.max_P_dcg);
  $("#max_Q_l").text(data.max_Q_l);
  $("#max_Q_c").text(data.max_Q_c);

  /*心跳計數******************************************** */
  $("#HB_Counts").text(data.HB_Counts);

  /*漏電流*************************************************** */
  $("#leakage_I").text(data.leakage_I);

  /*交流側******************************************************** */
  $("#gridStatus").text(data.gridStatus);
  $("#activePower").text(data.activePower);
  $("#reactivePower").text(data.reactivePower);
  $("#powerFactor").text(data.powerFactor);

  $("#voltageRS").text(data.voltageRS);
  $("#voltageST").text(data.voltageST);
  $("#voltageTR").text(data.voltageTR);

  $("#currentR").text(data.currentR);
  $("#currentS").text(data.currentS);
  $("#currentT").text(data.currentT);
  $("#gridFreq").text(data.gridFreq);

  /*阻抗值************************************************* */
  $("#pElectrodeR").text(data.pElectrodeR);
  $("#nElectrodeR").text(data.nElectrodeR);

  /*直流側****************************************************** */
  $("#DCvoltage").text(data.DCvoltage);
  $("#DCcurrent").text(data.DCcurrent);
  $("#DCpower").text(data.DCpower);

  /*故障與告警****************************************************** */
  if (data.overallFault === "0") {
    classAdd("#overallFault", "setToClose");
  } else {
    classRemove("#overallFault", "setToClose");
  }

  if (data.overallAlarm === "0") {
    classAdd("#overallAlarm", "setToClose");
  } else {
    classRemove("#overallAlarm", "setToClose");
  }

  if (data.faultStatus === "0") {
    classAdd("#faultStatus", "setToClose");
  } else {
    classRemove("#faultStatus", "setToClose");
  }

  if (data.alarmStatus === "0") {
    classAdd("#alarmStatus", "setToClose");
  } else {
    classRemove("#alarmStatus", "setToClose");
  }

  /*節點狀態************************************************ */
  if (data.nodeStatus[1] === "1") {
    classAdd("#NS_bit_1", "setToClose");
  } else {
    classRemove("#NS_bit_1", "setToClose");
  }

  if (data.nodeStatus[2] === "1") {
    classAdd("#NS_bit_2", "setToClose");
  } else {
    classRemove("#NS_bit_2", "setToClose");
  }

  if (data.nodeStatus[3] === "1") {
    classAdd("#NS_bit_3", "setToClose");
  } else {
    classRemove("#NS_bit_3", "setToClose");
  }

  if (data.nodeStatus[4] === "1") {
    classAdd("#NS_bit_4", "setToClose");
  } else {
    classRemove("#NS_bit_4", "setToClose");
  }

  if (data.nodeStatus[5] === "1") {
    classAdd("#NS_bit_5", "setToClose");
  } else {
    classRemove("#NS_bit_5", "setToClose");
  }

  /*溫度值*************************************************** */
  $("#innerTemp").text(data.innerTemp);
  $("#moduleTemp1").text(data.moduleTemp1);
  $("#moduleTemp2").text(data.moduleTemp2);
  $("#moduleTemp3").text(data.moduleTemp3);
}
