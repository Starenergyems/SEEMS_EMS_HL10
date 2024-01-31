//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {

  console.log("start reading js");
  classAdd('#nB_Operation', 'default_nB')
  classAdd('#infoRack', 'subTitle_unclick')

  updateData();
});


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
    $('#BMSMode').text(data.BMSMode);  ///////////////還沒打完
    console.log("data updated");
}



