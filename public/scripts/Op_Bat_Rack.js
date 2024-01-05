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

///////////////////////////////////////////////////////////////////////
// //找到所有 openRackAlm 元素
// const openRackAlmElements = document.querySelectorAll(".openRackAlm");

// // 監聽每個 openRackAlm 元素的點擊事件
// openRackAlmElements.forEach((element) => {
//   element.addEventListener("click", () => {
//     const id = element.id.replace("openRackAlm_", ""); // 取得點擊的元素 ID，例如 'R01'

//     // 發送 ID 到後端
//     fetch(`/operateinfo/battery/rack/:rackId?rackId=${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // 處理後端返回的數據，假設你有一個處理數據的函數 updatePopupUI
//         updatePopupUI(data);
//       })
//       .catch((error) => {
//         console.error("請求失敗", error);
//       });
//   });
// });

// // 根據後端返回的數據更新彈出視窗的函數
// function updatePopupUI(data) {
//   // 在這裡根據後端返回的 data 更新你的彈出視窗的 UI
//   // 假設你有一個 ID 為 popupContent 的元素用於顯示數據
//   const popupContent = document.getElementById("popupContent");

//   // 假設 data 是一個包含需要顯示的數據的物件
//   // 你需要根據實際的數據結構進行處理
//   popupContent.textContent = JSON.stringify(data);
// }

const window_info_RackAlm = document.querySelector(".info_RackAlm");
const title_AlarmCMU = document.querySelector(".info_RackAlm .titleAlarmCMU");
const title_FaultCMU = document.querySelector(".info_RackAlm .titleFaultCMU");
const title_StatusHW = document.querySelector(".info_RackAlm .titleStatusHW");

const closeWB_info_RackAlm = document.querySelector(
  ".info_RackAlm #closeWB_No"
);
closeWB_info_RackAlm.addEventListener("click", closePopup_info_RackAlm);
function closePopup_info_RackAlm() {
  window_info_RackAlm.classList.remove("appear");
}

function show_info_RackAlm() {
  window_info_RackAlm.classList.add("appear");
}

const OpenRackAlm_R01 = document.querySelector("#openRackAlm_R01");
OpenRackAlm_R01.addEventListener("click", show_info_RackAlm_R01);
function show_info_RackAlm_R01() {
  title_AlarmCMU.textContent = "Rack01 CMU告警";
  title_FaultCMU.textContent = "Rack01 CMU故障";
  title_StatusHW.textContent = "Rack01 硬體狀態";
  getData(1);
  show_info_RackAlm();
}

const OpenRackAlm_R02 = document.querySelector("#openRackAlm_R02");
OpenRackAlm_R02.addEventListener("click", show_info_RackAlm_R02);
function show_info_RackAlm_R02() {
  title_AlarmCMU.textContent = "Rack02 CMU告警";
  title_FaultCMU.textContent = "Rack02 CMU故障";
  title_StatusHW.textContent = "Rack02 硬體狀態";
  getData(2);
  show_info_RackAlm();
}

const OpenRackAlm_R03 = document.querySelector("#openRackAlm_R03");
OpenRackAlm_R03.addEventListener("click", show_info_RackAlm_R03);
function show_info_RackAlm_R03() {
  title_AlarmCMU.textContent = "Rack03 CMU告警";
  title_FaultCMU.textContent = "Rack03 CMU故障";
  title_StatusHW.textContent = "Rack03 硬體狀態";
  getData(3);
  show_info_RackAlm();
}

const OpenRackAlm_R04 = document.querySelector("#openRackAlm_R04");
OpenRackAlm_R04.addEventListener("click", show_info_RackAlm_R04);
function show_info_RackAlm_R04() {
  title_AlarmCMU.textContent = "Rack04 CMU告警";
  title_FaultCMU.textContent = "Rack04 CMU故障";
  title_StatusHW.textContent = "Rack04 硬體狀態";
  getData(4);
  show_info_RackAlm();
}

const OpenRackAlm_R05 = document.querySelector("#openRackAlm_R05");
OpenRackAlm_R05.addEventListener("click", show_info_RackAlm_R05);
function show_info_RackAlm_R05() {
  title_AlarmCMU.textContent = "Rack05 CMU告警";
  title_FaultCMU.textContent = "Rack05 CMU故障";
  title_StatusHW.textContent = "Rack05 硬體狀態";
  getData(5);
  show_info_RackAlm();
}

const OpenRackAlm_R06 = document.querySelector("#openRackAlm_R06");
OpenRackAlm_R06.addEventListener("click", show_info_RackAlm_R06);
function show_info_RackAlm_R06() {
  title_AlarmCMU.textContent = "Rack06 CMU告警";
  title_FaultCMU.textContent = "Rack06 CMU故障";
  title_StatusHW.textContent = "Rack06 硬體狀態";
  getData(6);
  show_info_RackAlm();
}

const OpenRackAlm_R07 = document.querySelector("#openRackAlm_R07");
OpenRackAlm_R07.addEventListener("click", show_info_RackAlm_R07);
function show_info_RackAlm_R07() {
  title_AlarmCMU.textContent = "Rack07 CMU告警";
  title_FaultCMU.textContent = "Rack07 CMU故障";
  title_StatusHW.textContent = "Rack07 硬體狀態";
  getData(7);
  show_info_RackAlm();
}

const OpenRackAlm_R08 = document.querySelector("#openRackAlm_R08");
OpenRackAlm_R08.addEventListener("click", show_info_RackAlm_R08);
function show_info_RackAlm_R08() {
  title_AlarmCMU.textContent = "Rack08 CMU告警";
  title_FaultCMU.textContent = "Rack08 CMU故障";
  title_StatusHW.textContent = "Rack08 硬體狀態";
  getData(8);
  show_info_RackAlm();
}

const OpenRackAlm_R09 = document.querySelector("#openRackAlm_R09");
OpenRackAlm_R09.addEventListener("click", show_info_RackAlm_R09);
function show_info_RackAlm_R09() {
  title_AlarmCMU.textContent = "Rack09 CMU告警";
  title_FaultCMU.textContent = "Rack09 CMU故障";
  title_StatusHW.textContent = "Rack09 硬體狀態";
  getData(9);
  show_info_RackAlm();
}

const OpenRackAlm_R10 = document.querySelector("#openRackAlm_R10");
OpenRackAlm_R10.addEventListener("click", show_info_RackAlm_R10);
function show_info_RackAlm_R10() {
  title_AlarmCMU.textContent = "Rack10 CMU告警";
  title_FaultCMU.textContent = "Rack10 CMU故障";
  title_StatusHW.textContent = "Rack10 硬體狀態";
  getData(10);
  show_info_RackAlm();
}

const OpenRackAlm_R11 = document.querySelector("#openRackAlm_R11");
OpenRackAlm_R11.addEventListener("click", show_info_RackAlm_R11);
function show_info_RackAlm_R11() {
  title_AlarmCMU.textContent = "Rack11 CMU告警";
  title_FaultCMU.textContent = "Rack11 CMU故障";
  title_StatusHW.textContent = "Rack11 硬體狀態";
  getData(11);
  show_info_RackAlm();
}

const OpenRackAlm_R12 = document.querySelector("#openRackAlm_R12");
OpenRackAlm_R12.addEventListener("click", show_info_RackAlm_R12);
function show_info_RackAlm_R12() {
  title_AlarmCMU.textContent = "Rack12 CMU告警";
  title_FaultCMU.textContent = "Rack12 CMU故障";
  title_StatusHW.textContent = "Rack12 硬體狀態";
  getData(12);
  show_info_RackAlm();
}

async function getData(blockId) {
  try {
    console.log('嘗試向後端發出請求')
    const response = await fetch("/getData", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blockId }),
    });

    const data = await response.json();
    console.log(data);
    displayData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayData(data) {
  console.log("Received data:", data);
  const dataContainer = document.getElementById("data-container");
  dataContainer.innerHTML = `<p>${data}</p>`;
}
