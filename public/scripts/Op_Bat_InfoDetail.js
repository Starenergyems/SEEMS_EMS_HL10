//var permission="viewer"; //需讀權限
var permission = "admin";
$(document).ready(function () {

  console.log("start reading js");
  classAdd('#nB_Operation', 'default_nB');
  classAdd('#infoRack', 'subTitle_unclick');

  routineWork();
});

setInterval(routineWork, 1000);//1秒刷新一次
/////////////////////////////////////////////////////////////////////

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
    if ((clickItem.target.id !== "dDL_sNB_01") && (clickItem.target.id !== "dDL_sNB_02") && (clickItem.target.id !== "dDL_sNB_03")) {
        ssNavBar_sNB_01.classList.remove("appear");
        ssNavBar_sNB_02.classList.remove("appear");
        ssNavBar_sNB_03.classList.remove("appear");
    }
}

async function updateData(){ 
    var router = window.location.href+"data";
    console.log(router);
    var data = await getData(router);
    console.log(data);
    $('#BMSMode').text(data.BMSMode);
    Determine_bgColor_of_BMSMode("#BG_BMSModes",data.BMSMode);
    $('#onlineNum').text(data.onlineNum)
    Determine_bgColor_of_onlineNum("#BG_onlineNum",data.onlineNum);
    $('#onlineV').text(data.onlineV);
    $('#BMSsystemV').text(data.BMSsystemV);
    $('#BMSsystemI').text(data.BMSsystemI);
    $('#BMSsystemSOC').text(data.BMSsystemSOC);
    $('#BMSsystemSOH').text(data.BMSsystemSOH);
    $('#heartBeat').text(data.heartBeat);

    ///電池機櫃************************************ */
    $('#rackVoltDiff').text(data.rackVoltDiff);
    $('#rackNoVmax').text(data.rackNoVmaxmin.hiByte);
    $('#rackNoVmin').text(data.rackNoVmaxmin.loByte);
    $('#rackCurrDiff').text(data.rackCurrDiff);
    $('#rackNoImax').text(data.rackNoImaxmin.hiByte);
    $('#rackNoImin').text(data.rackNoImaxmin.loByte);
    $('#rackSOCDiff').text(data.rackSOCDiff);
    //電池電芯************************************* */
    $('#V_cell_Max').text(data.V_cell_Max);
    $('#rackNoVcMax').text(data.rackNoVcMax);
    $('#bmuNoVcMax').text(data.bmucellNoVcMax.hiByte);
    $('#cellNoVcMax').text(data.bmucellNoVcMax.loByte);

    $('#V_cell_Min').text(data.V_cell_Min);
    $('#rackNoVcMin').text(data.rackNoVcMin);
    $('#bmuNoVcMin').text(data.bmucellNoVcMin.hiByte);
    $('#cellNoVcMin').text(data.bmucellNoVcMin.loByte);

    $('#V_cell_MaxDiff').text(data.V_cell_MaxDiff);

    $('#T_cell_Max').text(data.T_cell_Max);
    $('#rackNoTcMax').text(data.rackNoTcMax);
    $('#bmuNoTcMax').text(data.bmucellNoTcMax.hiByte);
    $('#cellNoTcMax').text(data.bmucellNoTcMax.loByte);

    $('#T_cell_Min').text(data.T_cell_Min);
    $('#rackNoTcMin').text(data.rackNoTcMin);
    $('#bmuNoTcMin').text(data.bmucellNoTcMin.hiByte);
    $('#cellNoTcMin').text(data.bmucellNoTcMin.loByte);

    $('#T_cell_MaxDiff').text(data.T_cell_MaxDiff);
    //總充放電量****************************************************** */
    $('#totalChgE').text(data.totalChgE);
    $('#totalDcgE').text(data.totalDcgE);

    /*環境溫度**************************************************** */
    $('#tempAmb_1').text(data.tempAmb_1);
    $('#tempAmb_2').text(data.tempAmb_2);
    /*故障告警位置************************************************************/
    $('#rackNo_alarmCMU').text(data.rackNo_alarmCMU);
    $('#rackNo_faultCMU').text(data.rackNo_faultCMU);
    $('#rackNo_faultPRelay').text(data.rackNo_faultPRelay);
    $('#rackNo_faultNRelay').text(data.rackNo_faultNRelay);
    $('#rackNo_faultFuse').text(data.rackNo_faultFuse);
    $('rackNo_commSMUCMU').text(data.rackNo_commSMUCMU);

    /**DI狀態///////////////////////////////////////////////////////////////// */
    light_color(data.statusDI[0], '#statusDI01', '0', 'setToOpen', '1', "setToClose");
    light_color(data.statusDI[1], '#statusDI02', '0', 'setToOpen', '1', "setToClose");
    light_color(data.statusDI[2], '#statusDI03', '0', 'setToOpen', '1', "setToClose");
    light_color(data.statusDI[3], '#statusDI04', '0', 'setToOpen', '1', "setToClose");
    light_color(data.statusDI[4], '#statusDI05', '0', 'setToOpen', '1', "setToClose");
    light_color(data.statusDI[5], '#statusDI06', '0', 'setToOpen', '1', "setToClose");

    /*硬體故障****************************************************** */
    light_color(data.faultHW[0], '#faultPRelay', '0', 'setToOpen', '1', "setToClose");
    light_color(data.faultHW[1], '#faultNRelay', '0', 'setToOpen', '1', "setToClose");
    light_color(data.faultHW[2], '#closeFailPRelay', '0', 'setToOpen', '1', "setToClose");
    light_color(data.faultHW[3], '#closeFailNRelay', '0', 'setToOpen', '1', "setToClose");
    light_color(data.faultHW[4], '#blownFuse', '0', 'setToOpen', '1', "setToClose");

/*SMU故障***************************************************************** */
    light_color(data.faultSMU[0], '#commSMUCMU', '0', 'setToOpen', '1', "setToClose");
    light_color(data.faultSMU[11], '#rackNoProtect', '0', 'setToOpen', '1', "setToClose");
    light_color(data.faultSMU[15], '#systemStop', '0', 'setToOpen', '1', "setToClose");

    /*SOC校準************************************************************** */
    light_color(data.SOCcali[0], '#1stSOCcal', '0', 'setToOpen', '1', "setToClose");
    light_color(data.SOCcali[1], '#2ndSOCcal', '0', 'setToOpen', '1', "setToClose");

    /*CMU故障告警************************************************************ */
    light_color(data.alarm[0], '#cellOV_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[1], '#cellUV_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[2], '#rackOV_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[3], '#rackUV_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[4], '#packOV_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[5], '#packUV_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[6], '#cellVDiff_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[8], '#packVDiff_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[9], '#cellOT_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[10], '#cellUT_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[11], '#cellTDiff_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[12], '#leakageI_Alarm', '0', 'setToOpen', '1', "setToClose");
    light_color(data.alarm[20], '#overCurrent_Alarm', '0', 'setToOpen', '1', "setToClose");
    
    light_color(data.fault[0], '#cellOV_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[1], '#cellUV_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[2], '#rackOV_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[3], '#rackUV_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[4], '#packOV_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[5], '#packUV_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[7], '#rackVDiff_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[9], '#cellOT_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[10], '#cellUT_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[12], '#leakageI_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[13], '#commCMUBMU_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[14], '#voltSample_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[15], '#tempSample_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[17], '#currentSample_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[18], '#commCMUSMU_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[20], '#overCurrent_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[21], '#polarityReverse_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[22], '#fuse_Fault', '0', 'setToOpen', '1', "setToClose");
    light_color(data.fault[23], '#contactor_Fault', '0', 'setToOpen', '1', "setToClose");

  }



function Determine_bgColor_of_BMSMode(elementID, dataStatus) {
  const element = document.querySelector(elementID);

  if (dataStatus === "停機中") {
      element.style.background = "#FF0000";//紅
  } else if (dataStatus === "運轉中") {
      element.style.background = "#CBE198"; //綠
  }  else {
      element.style.background = "#000000";
  }
}

function Determine_bgColor_of_onlineNum(elementID, Num) {
  const element = document.querySelector(elementID);

  if (Num === 0) {
      element.style.background = "#FF0000";//紅
  } else if (Num === 12) {
      element.style.background = "#CBE198"; //綠
  } else if (Num >=1 && Num <=11 ) {
      element.style.background = "#EF860F"; //橘色
  } else {
      element.style.background = "#000000";
  }
}
