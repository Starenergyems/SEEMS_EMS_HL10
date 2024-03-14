//var permission="viewer"; //需讀權限
var permission = "manager";
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

async function updateData(){ //更新資料
    var router = window.location.href+"data";
    console.log(router);
    var data = await getData(router);
    console.log(data);
    $('#BMSMode').text(data.BMSMode);  //沒有這個資料
    $('#onlineNum').text(data.onlineNum); //沒有
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
    if(data.statusDI[0] === '1'){
        classAdd('#statusDI01', 'setToClose');
    } else {
        classRemove('#statusDI01', 'setToClose');
    };

    if(data.statusDI[1] === '1'){
        classAdd('#statusDI02', 'setToClose');
    } else {
        classRemove('#statusDI02', 'setToClose');
    };

    if(data.statusDI[2] === '1'){
        classAdd('#statusDI03', 'setToClose');
    } else {
        classRemove('#statusDI03', 'setToClose');
    };

    if(data.statusDI[3] === '1'){
        classAdd('#statusDI04', 'setToClose');
    } else {
        classRemove('#statusDI04', 'setToClose');
    };

    if(data.statusDI[4] === '1'){
        classAdd('#statusDI05', 'setToClose');
    } else {
        classRemove('#statusDI05', 'setToClose');
    };

    if(data.statusDI[5] === '1'){
        classAdd('#statusDI06', 'setToClose');
    } else {
        classRemove('#statusDI06', 'setToClose');
    };
    /*硬體故障****************************************************** */
    if(data.faultHW[0] === '1'){
        classAdd('#faultPRelay', 'setToClose');
    } else {
        classRemove('#faultPRelay', 'setToClose');
    };

    if(data.faultHW[1] === '1'){
        classAdd('#faultNRelay', 'setToClose');
    } else {
        classRemove('#faultNRelay', 'setToClose');
    };

    if(data.faultHW[2] === '1'){
        classAdd('#closeFailPRelay', 'setToClose');
    } else {
        classRemove('#closeFailPRelay', 'setToClose');
    };

    if(data.faultHW[3] === '1'){
        classAdd('#closeFailNRelay', 'setToClose');
    } else {
        classRemove('#closeFailNRelay', 'setToClose');
    };

    if(data.faultHW[4] === '1'){
        classAdd('#blownFuse', 'setToClose');
    } else {
        classRemove('#blownFuse', 'setToClose');
    };
/*SMU故障***************************************************************** */
        
    if(data.faultSMU[0] === '1'){
        classAdd('#commSMUCMU', 'setToClose');
    } else {
        classRemove('#commSMUCMU', 'setToClose');
    };

    if(data.faultSMU[11] === '1'){
        classAdd('#rackNoProtect', 'setToClose');
    } else {
        classRemove('#rackNoProtect', 'setToClose');
    };

    if(data.faultSMU[15] === '1'){
        classAdd('#systemStop', 'setToClose');
    } else {
        classRemove('#systemStop', 'setToClose');
    };
    /*SOC校準************************************************************** */
    if(data.SOCcali[0] === '1'){
        classAdd('#1stSOCcal', 'setToClose');
    } else {
        classRemove('#1stSOCcal', 'setToClose');
    };

    if(data.SOCcali[1] === '1'){
        classAdd('#2ndSOCcal', 'setToClose');
    } else {
        classRemove('#2ndSOCcal', 'setToClose');
    };
    /*CMU故障告警************************************************************ */
    if(data.alarm[0] === '1'){
        classAdd('#cellOV_Alarm', 'setToClose');
    } else {
        classRemove('#cellOV_Alarm', 'setToClose');
    };
    if(data.fault[0] === '1'){
        classAdd('#cellOV_Fault', 'setToClose');
    } else {
        classRemove('#cellOV_Fault', 'setToClose');
    };

    if(data.alarm[1] === '1'){
        classAdd('#cellUV_Alarm', 'setToClose');
    } else {
        classRemove('#cellUV_Alarm', 'setToClose');
    };
    if(data.fault[1] === '1'){
        classAdd('#cellUV_Fault', 'setToClose');
    } else {
        classRemove('#cellUV_Fault', 'setToClose');
    };

    if(data.alarm[2] === '1'){
        classAdd('#rackOV_Alarm', 'setToClose');
    } else {
        classRemove('#rackOV_Alarm', 'setToClose');
    };
    if(data.fault[2] === '1'){
        classAdd('#rackOV_Fault', 'setToClose');
    } else {
        classRemove('#rackOV_Fault', 'setToClose');
    };

    if(data.alarm[3] === '1'){
        classAdd('#rackUV_Alarm', 'setToClose');
    } else {
        classRemove('#rackUV_Alarm', 'setToClose');
    };
    if(data.fault[3] === '1'){
        classAdd('#rackUV_Fault', 'setToClose');
    } else {
        classRemove('#rackUV_Fault', 'setToClose');
    };

    if(data.alarm[4] === '1'){
        classAdd('#packOV_Alarm', 'setToClose');
    } else {
        classRemove('#packOV_Alarm', 'setToClose');
    };
    if(data.fault[4] === '1'){
        classAdd('#packOV_Fault', 'setToClose');
    } else {
        classRemove('#packOV_Fault', 'setToClose');
    };

    if(data.alarm[5] === '1'){
        classAdd('#packUV_Alarm', 'setToClose');
    } else {
        classRemove('#packUV_Alarm', 'setToClose');
    };
    if(data.fault[5] === '1'){
        classAdd('#packUV_Fault', 'setToClose');
    } else {
        classRemove('#packUV_Fault', 'setToClose');
    };

    if(data.alarm[6] === '1'){
        classAdd('#cellVDiff_Alarm', 'setToClose');
    } else {
        classRemove('#cellVDiff_Alarm', 'setToClose');
    };

    if(data.fault[7] === '1'){
        classAdd('#rackVDiff_Fault', 'setToClose');
    } else {
        classRemove('#rackVDiff_Fault', 'setToClose');
    };

    if(data.alarm[8] === '1'){
        classAdd('#packVDiff_Alarm', 'setToClose');
    } else {
        classRemove('#packVDiff_Alarm', 'setToClose');
    };

    
    if(data.alarm[9] === '1'){
        classAdd('#cellOT_Alarm', 'setToClose');
    } else {
        classRemove('#cellOT_Alarm', 'setToClose');
    };
    if(data.fault[9] === '1'){
        classAdd('#cellOT_Fault', 'setToClose');
    } else {
        classRemove('#cellOT_Fault', 'setToClose');
    };

    if(data.alarm[10] === '1'){
        classAdd('#cellUT_Alarm', 'setToClose');
    } else {
        classRemove('#cellUT_Alarm', 'setToClose');
    };
    if(data.fault[10] === '1'){
        classAdd('#cellUT_Fault', 'setToClose');
    } else {
        classRemove('#cellUT_Fault', 'setToClose');
    };

    if(data.alarm[11] === '1'){
        classAdd('#cellTDiff_Alarm', 'setToClose');
    } else {
        classRemove('#cellTDiff_Alarm', 'setToClose');
    };

    if(data.alarm[12] === '1'){
        classAdd('#leakageI_Alarm', 'setToClose');
    } else {
        classRemove('#leakageI_Alarm', 'setToClose');
    };
    if(data.fault[12] === '1'){
        classAdd('#leakageI_Fault', 'setToClose');
    } else {
        classRemove('#leakageI_Fault', 'setToClose');
    };

    if(data.fault[13] === '1'){
        classAdd('#commCMUBMU_Fault', 'setToClose');
    } else {
        classRemove('#commCMUBMU_Fault', 'setToClose');
    };

    if(data.fault[14] === '1'){
        classAdd('#voltSample_Fault', 'setToClose');
    } else {
        classRemove('#voltSample_Fault', 'setToClose');
    };

    if(data.fault[15] === '1'){
        classAdd('#tempSample_Fault', 'setToClose');
    } else {
        classRemove('#tempSample_Fault', 'setToClose');
    };
    
    if(data.fault[17] === '1'){
        classAdd('#currentSample_Fault', 'setToClose');
    } else {
        classRemove('#currentSample_Fault', 'setToClose');
    };

    if(data.fault[18] === '1'){
        classAdd('#commCMUSMU_Fault', 'setToClose');
    } else {
        classRemove('#commCMUSMU_Fault', 'setToClose');
    };

    if(data.alarm[20] === '1'){
        classAdd('#overCurrent_Alarm', 'setToClose');
    } else {
        classRemove('#overCurrent_Alarm', 'setToClose');
    };
    if(data.fault[20] === '1'){
        classAdd('#overCurrent_Fault', 'setToClose');
    } else {
        classRemove('#overCurrent_Fault', 'setToClose');
    };

    if(data.fault[21] === '1'){
        classAdd('#polarityReverse_Fault', 'setToClose');
    } else {
        classRemove('#polarityReverse_Fault', 'setToClose');
    };

    if(data.fault[22] === '1'){
        classAdd('#fuse_Fault', 'setToClose');
    } else {
        classRemove('#fuse_Fault', 'setToClose');
    };

    if(data.fault[23] === '1'){
        classAdd('#contactor_Fault', 'setToClose');
    } else {
        classRemove('#contactor_Fault', 'setToClose');
    };

    console.log("data updated");

  }



