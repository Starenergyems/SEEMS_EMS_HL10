//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {
  console.log("start reading js");
  classAdd("#nB_System", "default_nB");
  routineWork();
});

setInterval(routineWork, 1000);

async function updateData() {                                   // 更新資料 ajax
  var router = window.location.href + "/data";
  var data = await getData(router);
  console.log(data);

  const classCollection_DL = ["setToClose", "ErrData"];

  assign_ClassD_to_StatusOfDL_with_SpID("#EMS_1", data.Comm_EMS_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#EMS_2", data.Comm_EMS_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#DC", data.Comm_DC, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#HMI", data.Comm_HMI, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#GC_1", data.Comm_GC_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#GC_2", data.Comm_GC_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#HVAC_1", data.Comm_HVAC_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#HVAC_2", data.Comm_HVAC_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#UPS_EMS", data.Comm_UPS_EMS, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#UPS_CCTV", data.Comm_UPS_CCTV, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#RIO_CtrlRoom", data.Comm_RIO_CtrlRoom, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#FreqMeter", data.Comm_FreqMeter, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_MVCB", data.Comm_AuxM_MVCB, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Relay_MVCB", data.Comm_Relay_MVCB, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#UPS_MVCB", data.Comm_UPS_MVCB, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Recloser", data.Comm_Recloser, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#RIO_MVCB_1", data.Comm_RIO_MVCB_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#RIO_MVCB_2", data.Comm_RIO_MVCB_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#TH_MVCB", data.Comm_TH_MVCB, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Relay_VCB1", data.Comm_Relay_VCB1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Relay_VCB2", data.Comm_Relay_VCB2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Relay_VCB3", data.Comm_Relay_VCB3, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Relay_VCB4", data.Comm_Relay_VCB4, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#Relay_VCB_Aux", data.Comm_Relay_VCB_Aux, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#TR_Aux", data.Comm_TR_Aux, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_total", data.Comm_AuxM_total, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_ESS1_1", data.Comm_AuxM_ESS1_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_ESS1_2", data.Comm_AuxM_ESS1_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_ESS2_1", data.Comm_AuxM_ESS2_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_ESS2_2", data.Comm_AuxM_ESS2_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_ESS3_1", data.Comm_AuxM_ESS3_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_ESS3_2", data.Comm_AuxM_ESS3_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_ESS4", data.Comm_AuxM_ESS4, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#AuxM_CtrlRoom", data.Comm_AuxM_CtrlRoom, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#TR_1", data.Comm_TR_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#TR_2", data.Comm_TR_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#TR_3", data.Comm_TR_3, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#TR_4", data.Comm_TR_4, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#RIO_ACP_1", data.Comm_RIO_ACP_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#RIO_ACP_2", data.Comm_RIO_ACP_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#RIO_ACP_3", data.Comm_RIO_ACP_3, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#RIO_ACP_4", data.Comm_RIO_ACP_4, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#UPS_ACP", data.Comm_UPS_ACP, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#LC_1", data.Comm_LC_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#LC_2", data.Comm_LC_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#LC_3", data.Comm_LC_3, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#LC_4", data.Comm_LC_4, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#PCS1_1", data.Comm_PCS1_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#PCS1_2", data.Comm_PCS1_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#BMS1_1", data.Comm_BMS1_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#BMS1_2", data.Comm_BMS1_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#PCS2_1", data.Comm_PCS2_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#PCS2_2", data.Comm_PCS2_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#BMS2_1", data.Comm_BMS2_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#BMS2_2", data.Comm_BMS2_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#PCS3_1", data.Comm_PCS3_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#PCS3_2", data.Comm_PCS3_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#BMS3_1", data.Comm_BMS3_1, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#BMS3_2", data.Comm_BMS3_2, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#PCS4", data.Comm_PCS4, classCollection_DL);
  assign_ClassD_to_StatusOfDL_with_SpID("#BMS4", data.Comm_BMS4, classCollection_DL);
}

