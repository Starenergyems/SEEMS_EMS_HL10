//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {
  console.log("start reading js");
  classAdd("#nB_System","default_nB");
  updateData();
});

setInterval(updateData, 5000);

async function updateData(){
      //更新資料
  var router = window.location.href + "/data";
  var data = await getData(router);
  console.log(data);
/*AUX Meter************************************************* */
  if (data.Comm_AuxM_MVCB === 0) {
    classAdd("#AuxM_MVCB", "setToClose");
  } else {
    classRemove("#AuxM_MVCB", "setToClose");
  }

  if (data.Comm_AuxM_total === 0) {
    classAdd("#AuxM_total", "setToClose");
  } else {
    classRemove("#AuxM_total", "setToClose");
  }

  if (data.Comm_AuxM_ESS1_1 === 0) {
    classAdd("#AuxM_ESS1_1", "setToClose");
  } else {
    classRemove("#AuxM_ESS1_1", "setToClose");
  }

  if (data.Comm_AuxM_ESS1_2 === 0) {
    classAdd("#AuxM_ESS1_2", "setToClose");
  } else {
    classRemove("#AuxM_ESS1_2", "setToClose");
  }

  if (data.Comm_AuxM_ESS2_1 === 0) {
    classAdd("#AuxM_ESS2_1", "setToClose");
  } else {
    classRemove("#AuxM_ESS2_1", "setToClose");
  }

  if (data.Comm_AuxM_ESS2_2 === 0) {
    classAdd("#AuxM_ESS2_2", "setToClose");
  } else {
    classRemove("#AuxM_ESS2_2", "setToClose");
  }

  if (data.Comm_AuxM_ESS3_1 === 0) {
    classAdd("#AuxM_ESS3_1", "setToClose");
  } else {
    classRemove("#AuxM_ESS3_1", "setToClose");
  }

  if (data.Comm_AuxM_ESS3_2 === 0) {
    classAdd("#AuxM_ESS3_2", "setToClose");
  } else {
    classRemove("#AuxM_ESS3_2", "setToClose");
  }

  if (data.Comm_AuxM_ESS4 === 0) {
    classAdd("#AuxM_ESS4", "setToClose");
  } else {
    classRemove("#AuxM_ESS4", "setToClose");
  }

  if (data.Comm_AuxM_CtrlRoom === 0) {
    classAdd("#AuxM_CtrlRoom", "setToClose");
  } else {
    classRemove("#AuxM_CtrlRoom", "setToClose");
  }
  /*BMS********************************************************** */
  if (data.Comm_BMS1_1 === 0) {
    classAdd("#BMS1_1", "setToClose");
  } else {
    classRemove("#BMS1_1", "setToClose");
  }

  if (data.Comm_BMS1_2 === 0) {
    classAdd("#BMS1_2", "setToClose");
  } else {
    classRemove("#BMS1_2", "setToClose");
  }
  
  if (data.Comm_BMS2_1 === 0) {
    classAdd("#BMS2_1", "setToClose");
  } else {
    classRemove("#BMS2_1", "setToClose");
  }

  if (data.Comm_BMS2_2 === 0) {
    classAdd("#BMS2_2", "setToClose");
  } else {
    classRemove("#BMS2_2", "setToClose");
  }

  if (data.Comm_BMS3_1 === 0) {
    classAdd("#BMS3_1", "setToClose");
  } else {
    classRemove("#BMS3_1", "setToClose");
  }

  if (data.Comm_BMS3_2 === 0) {
    classAdd("#BMS3_2", "setToClose");
  } else {
    classRemove("#BMS3_2", "setToClose");
  }

  if (data.Comm_BMS4 === 0) {
    classAdd("#BMS3_1", "setToClose");
  } else {
    classRemove("#BMS3_1", "setToClose");
  }
  /****************************************************** */
  if (data.Comm_FreqMeter === 0) {
    classAdd("#FreqMeter", "setToClose");
  } else {
    classRemove("#FreqMeter", "setToClose");
  }

  if (data.Comm_GC_1 === 0) {
    classAdd("#GC_1", "setToClose");
  } else {
    classRemove("#GC_1", "setToClose");
  }

  if (data.Comm_GC_2 === 0) {
    classAdd("#GC_2", "setToClose");
  } else {
    classRemove("#GC_2", "setToClose");
  }

  if (data.Comm_HVAC_1 === 0) {
    classAdd("#HVAC_1", "setToClose");
  } else {
    classRemove("#HVAC_1", "setToClose");
  }

  if (data.Comm_HVAC_2 === 0) {
    classAdd("#HVAC_2", "setToClose");
  } else {
    classRemove("#HVAC_2", "setToClose");
  }
  /*LC****************************************************** */
  if (data.Comm_LC_1 === 0) {
    classAdd("#LC_1", "setToClose");
  } else {
    classRemove("#LC_1", "setToClose");
  }

  if (data.Comm_LC_2 === 0) {
    classAdd("#LC_2", "setToClose");
  } else {
    classRemove("#LC_2", "setToClose");
  }

  if (data.Comm_LC_3 === 0) {
    classAdd("#LC_3", "setToClose");
  } else {
    classRemove("#LC_3", "setToClose");
  }

  if (data.Comm_LC_4 === 0) {
    classAdd("#LC_4", "setToClose");
  } else {
    classRemove("#LC_4", "setToClose");
  }
  /*pcs********************************************************** */
  if (data.Comm_PCS1_1 === 0) {
    classAdd("#PCS1_1", "setToClose");
  } else {
    classRemove("#PCS1_1", "setToClose");
  }

  if (data.Comm_PCS1_2 === 0) {
    classAdd("#PCS1_2", "setToClose");
  } else {
    classRemove("#PCS1_2", "setToClose");
  }

  if (data.Comm_PCS2_1 === 0) {
    classAdd("#PCS2_1", "setToClose");
  } else {
    classRemove("#PCS2_1", "setToClose");
  }

  if (data.Comm_PCS2_2 === 0) {
    classAdd("#PCS2_2", "setToClose");
  } else {
    classRemove("#PCS2_2", "setToClose");
  }
  
  if (data.Comm_PCS3_1 === 0) {
    classAdd("#PCS3_1", "setToClose");
  } else {
    classRemove("#PCS3_1", "setToClose");
  }

  if (data.Comm_PCS3_2 === 0) {
    classAdd("#PCS3_2", "setToClose");
  } else {
    classRemove("#PCS3_2", "setToClose");
  }

  if (data.Comm_PCS4 === 0) {
    classAdd("#PCS3_2", "setToClose");
  } else {
    classRemove("#PCS3_2", "setToClose");
  }
/*Remote IO************************************************ */
  if (data.Comm_RIO_CtrlRoom === 0) {
    classAdd("#RIO_CtrlRoom", "setToClose");
  } else {
    classRemove("#RIO_CtrlRoom", "setToClose");
  }

  if (data.Comm_RIO_MVCB_1 === 0) {
    classAdd("#RIO_MVCB_1", "setToClose");
  } else {
    classRemove("#RIO_MVCB_1", "setToClose");
  }

  if (data.Comm_RIO_MVCB_2 === 0) {
    classAdd("#RIO_MVCB_2", "setToClose");
  } else {
    classRemove("#RIO_MVCB_2", "setToClose");
  }

  if (data.Comm_RIO_ACP_1 === 0) {
    classAdd("#RIO_ACP_1", "setToClose");
  } else {
    classRemove("#RIO_ACP_1", "setToClose");
  }

  if (data.Comm_RIO_ACP_2 === 0) {
    classAdd("#RIO_ACP_2", "setToClose");
  } else {
    classRemove("#RIO_ACP_2", "setToClose");
  }

  if (data.Comm_RIO_ACP_3 === 0) {
    classAdd("#RIO_ACP_3", "setToClose");
  } else {
    classRemove("#RIO_ACP_3", "setToClose");
  }

  if (data.Comm_RIO_ACP_4 === 0) {
    classAdd("#RIO_ACP_4", "setToClose");
  } else {
    classRemove("#RIO_ACP_4", "setToClose");
  }
/*Relay**************************************************** */
  if (data.Comm_Relay_MVCB === 0) {
    classAdd("#Relay_MVCB", "setToClose");
  } else {
    classRemove("#Relay_MVCB", "setToClose");
  }

  if (data.Comm_Relay_VCB1 === 0) {
    classAdd("#Relay_VCB1", "setToClose");
  } else {
    classRemove("#Relay_VCB1", "setToClose");
  }

  if (data.Comm_Relay_VCB2 === 0) {
    classAdd("#Relay_VCB2", "setToClose");
  } else {
    classRemove("#Relay_VCB2", "setToClose");
  }

  if (data.Comm_Relay_VCB3 === 0) {
    classAdd("#Relay_VCB3", "setToClose");
  } else {
    classRemove("#Relay_VCB3", "setToClose");
  }

  if (data.Comm_Relay_VCB4 === 0) {
    classAdd("#Relay_VCB4", "setToClose");
  } else {
    classRemove("#Relay_VCB4", "setToClose");
  }
  
  if (data.Comm_Relay_VCB_Aux === 0) {
    classAdd("#Relay_VCB_Aux", "setToClose");
  } else {
    classRemove("#Relay_VCB_Aux", "setToClose");
  }
  /*UPS********************************************** */
  if (data.Comm_UPS_EMS === 0) {
    classAdd("#UPS_EMS", "setToClose");
  } else {
    classRemove("#UPS_EMS", "setToClose");
  }

  if (data.Comm_UPS_CCTV === 0) {
    classAdd("#UPS_CCTV", "setToClose");
  } else {
    classRemove("#UPS_CCTV", "setToClose");
  }

  if (data.Comm_UPS_MVCB === 0) {
    classAdd("#UPS_MVCB", "setToClose");
  } else {
    classRemove("#UPS_MVCB", "setToClose");
  }

  if (data.Comm_UPS_ACP === 0) {
    classAdd("#UPS_ACP", "setToClose");
  } else {
    classRemove("#UPS_ACP", "setToClose");
  }

  if (data.Comm_Recloser === 0) {
    classAdd("#Recloser", "setToClose");
  } else {
    classRemove("#Recloser", "setToClose");
  }

  if (data.Comm_TH_MVCB === 0) {
    classAdd("#TH_MVCB", "setToClose");
  } else {
    classRemove("#TH_MVCB", "setToClose");
  }
  
/*TR***************************************************************/
  if (data.Comm_TR_Aux === 0) {
    classAdd("#TR_Aux", "setToClose");
  } else {
    classRemove("#TR_Aux", "setToClose");
  }

  if (data.Comm_TR_1 === 0) {
    classAdd("#TR_1", "setToClose");
  } else {
    classRemove("#TR_1", "setToClose");
  }

  if (data.Comm_TR_2 === 0) {
    classAdd("#TR_2", "setToClose");
  } else {
    classRemove("#TR_2", "setToClose");
  }

  if (data.Comm_TR_3 === 0) {
    classAdd("#TR_3", "setToClose");
  } else {
    classRemove("#TR_3", "setToClose");
  }

  if (data.Comm_TR_4 === 0) {
    classAdd("#TR_4", "setToClose");
  } else {
    classRemove("#TR_4", "setToClose");
  }


 



}





