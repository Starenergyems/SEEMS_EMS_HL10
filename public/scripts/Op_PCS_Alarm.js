//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {
  console.log("start reading js");
  classAdd("#nB_Operation", "default_nB");
  routineWork();
});

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

async function updateData() {
  //更新資料ajax
  var router = window.location.href + "data";
  var data = await getData(router);
  console.log(data);

  $("#noOverallFault").text(data.noOverallFault);
  $("#noOverallAlarm").text(data.noOverallAlarm);
  $("#noFault").text(data.noFault);
  $("#noAlarm").text(data.noAlarm);

  /*整機故障狀態********************************************** */
  light_color(data.OF[1], "#OF_bit_1", "0", "setToOpen", "1", "setToClose");
  light_color(data.OF[2], "#OF_bit_2", "0", "setToOpen", "1", "setToClose");
  light_color(data.OF[3], "#OF_bit_3", "0", "setToOpen", "1", "setToClose");
  light_color(data.OF[5], "#OF_bit_5", "0", "setToOpen", "1", "setToClose");
  light_color(data.OF[13], "#OF_bit_13", "0", "setToOpen", "1", "setToClose");
  light_color(data.OF[15], "#OF_bit_15", "0", "setToOpen", "1", "setToClose");

  /*整機告警狀態********************************************** */
  light_color(data.OA[1], "#OA_bit_1", "0", "setToOpen", "1", "setToClose");
  light_color(data.OA[2], "#OA_bit_2", "0", "setToOpen", "1", "setToClose");
  light_color(data.OA[10], "#OA_bit_10", "0", "setToOpen", "1", "setToClose");

  /*告警狀態********************************************** */
  light_color(data.Alarm1[8], "#A1_bit_8", "0", "setToOpen", "1", "setToClose");
  light_color(data.Alarm2[1], "#A2_bit_1", "0", "setToOpen", "1", "setToClose");
  light_color(data.Alarm2[3], "#A2_bit_3", "0", "setToOpen", "1", "setToClose");

  ///////////////////////////////////////////////////////////
  light_color(data.Alarm1[9], "#A1_bit_9", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Alarm1[10],
    "#A1_bit_10",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(data.Alarm1[4], "#A1_bit_4", "0", "setToOpen", "1", "setToClose");
  light_color(data.Alarm1[6], "#A1_bit_6", "0", "setToOpen", "1", "setToClose");
  light_color(data.Alarm1[7], "#A1_bit_7", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Alarm1[12],
    "#A1_bit_12",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  ////////////////////////////////////////////////////////
  light_color(data.Alarm1[1], "#A1_bit_1", "0", "setToOpen", "1", "setToClose");
  light_color(data.Alarm1[2], "#A1_bit_2", "0", "setToOpen", "1", "setToClose");

  /////////////////////////////////////////////////////////
  light_color(data.Alarm1[0], "#A1_bit_0", "0", "setToOpen", "1", "setToClose");

  ///////////////////////////////////////////////////////
  light_color(
    data.Alarm1[13],
    "#A1_bit_13",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(data.Alarm2[2], "#A2_bit_2", "0", "setToOpen", "1", "setToClose");

  ///////////////////////////////////////////////////////////
  light_color(data.Alarm2[0], "#A2_bit_0", "0", "setToOpen", "1", "setToClose");

  /*故障狀態******************************************************************** */
  //交流////////////////////////////////////////
  light_color(data.Fault1[2], "#F1_bit_2", "0", "setToOpen", "1", "setToClose");
  light_color(data.Fault1[3], "#F1_bit_3", "0", "setToOpen", "1", "setToClose");
  light_color(data.Fault1[4], "#F1_bit_4", "0", "setToOpen", "1", "setToClose");
  light_color(data.Fault1[5], "#F1_bit_5", "0", "setToOpen", "1", "setToClose");
  light_color(data.Fault1[6], "#F1_bit_6", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Fault1[21],
    "#F1_bit_21",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  light_color(data.Fault2[1], "#F2_bit_1", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Fault2[16],
    "#F2_bit_16",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(data.Fault2[6], "#F2_bit_6", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Fault2[23],
    "#F2_bit_23",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault2[24],
    "#F2_bit_24",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault2[19],
    "#F2_bit_19",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  //直流//////////////////////////////////////////////////
  light_color(data.Fault1[0], "#F1_bit_0", "0", "setToOpen", "1", "setToClose");
  light_color(data.Fault1[1], "#F1_bit_1", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Fault1[18],
    "#F1_bit_18",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault1[20],
    "#F1_bit_20",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(data.Fault1[6], "#F1_bit_6", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Fault1[21],
    "#F1_bit_21",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  light_color(data.Fault2[8], "#F2_bit_8", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Fault2[10],
    "#F2_bit_10",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault2[11],
    "#F2_bit_11",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault2[21],
    "#F2_bit_21",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  //孤島////////////////////////////////////////////////////////////
  light_color(data.Fault1[7], "#F1_bit_7", "0", "setToOpen", "1", "setToClose");
  light_color(data.Fault1[9], "#F1_bit_9", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Fault1[13],
    "#F1_bit_13",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault1[15],
    "#F1_bit_15",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  //硬件///////////////////////////////////////////////////////////////
  light_color(
    data.Fault1[24],
    "#F1_bit_24",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  light_color(data.Fault2[0], "#F2_bit_0", "0", "setToOpen", "1", "setToClose");
  light_color(data.Fault2[2], "#F2_bit_2", "0", "setToOpen", "1", "setToClose");
  light_color(data.Fault2[3], "#F2_bit_3", "0", "setToOpen", "1", "setToClose");
  light_color(data.Fault2[7], "#F2_bit_7", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Fault2[12],
    "#F2_bit_12",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault2[20],
    "#F2_bit_20",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault2[25],
    "#F2_bit_25",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault2[26],
    "#F2_bit_26",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault2[27],
    "#F2_bit_27",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  //模塊/////////////////////////////////////////////
  light_color(
    data.Fault1[10],
    "#F1_bit_10",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault1[11],
    "#F1_bit_11",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault1[12],
    "#F1_bit_12",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  light_color(
    data.Fault1[23],
    "#F1_bit_23",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  light_color(
    data.Fault2[14],
    "#F2_bit_14",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  //風機///////////////////////////////////////////////////
  light_color(
    data.Fault1[17],
    "#F1_bit_17",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );

  light_color(
    data.Fault2[22],
    "#F2_bit_22",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
  //LCD//////////////////////////////////////////////////
  light_color(data.Fault2[5], "#F2_bit_5", "0", "setToOpen", "1", "setToClose");
  light_color(
    data.Fault2[13],
    "#F2_bit_13",
    "0",
    "setToOpen",
    "1",
    "setToClose"
  );
}
