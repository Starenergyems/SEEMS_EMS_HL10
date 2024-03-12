//var permission="viewer"; //需讀權限
var permission = "manager";
$(document).ready(function () {
  console.log("start reading js");
  classAdd("#nB_Operation","default_nB");
  updateData();
});

setInterval(updateData, 1000);

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
    if ((clickItem.target.id !== "dDL_sNB_01") && (clickItem.target.id !== "dDL_sNB_02") && (clickItem.target.id !== "dDL_sNB_03")) {
        ssNavBar_sNB_01.classList.remove("appear");
        ssNavBar_sNB_02.classList.remove("appear");
        ssNavBar_sNB_03.classList.remove("appear");
    }
}

async function updateData(){ //更新資料ajax
    var router = window.location.href+"data";
    var data = await getData(router);
    console.log(data);

    $('#noOverallFault').text(data.noOverallFault);
    $('#noOverallAlarm').text(data.noOverallAlarm);
    $('#noFault').text(data.noFault);
    $('#noAlarm').text(data.noAlarm);

    /*整機故障狀態********************************************** */
    if (data.OF[1] === '1') {
        classAdd("#OF_bit_1", "setToClose");
    } else {
        classRemove("#OF_bit_1", "setToClose");
    }
    
    if (data.OF[2] === '1') {
        classAdd("#OF_bit_2", "setToClose");
    } else {
        classRemove("#OF_bit_2", "setToClose");
    } 
     
    if (data.OF[3] === '1') {
        classAdd("#OF_bit_3", "setToClose");
    } else {
        classRemove("#OF_bit_3", "setToClose");
    }   
    if (data.OF[5] === '1') {
        classAdd("#OF_bit_5", "setToClose");
    } else {
        classRemove("#OF_bit_5", "setToClose");
    }
    
    if (data.OF[13] === '1') {
        classAdd("#OF_bit_13", "setToClose");
    } else {
        classRemove("#OF_bit_13", "setToClose");
    } 
     
    if (data.OF[15] === '1') {
        classAdd("#OF_bit_15", "setToClose");
    } else {
        classRemove("#OF_bit_15", "setToClose");
    }   

    /*整機告警狀態********************************************** */
    if (data.OA[1] === '1') {
        classAdd("#OA_bit_1", "setToClose");
    } else {
        classRemove("#OA_bit_1", "setToClose");
    }
    
    if (data.OA[2] === '1') {
        classAdd("#OA_bit_2", "setToClose");
    } else {
        classRemove("#OA_bit_2", "setToClose");
    } 
        
    if (data.OA[10] === '1') {
        classAdd("#OA_bit_10", "setToClose");
    } else {
        classRemove("#OA_bit_10", "setToClose");
    }   

    /*告警狀態********************************************** */
    if (data.Alarm1[8] === '1') {
        classAdd("#A1_bit_8", "setToClose");
    } else {
        classRemove("#A1_bit_8", "setToClose");
    }
    
    if (data.Alarm2[1] === '1') {
        classAdd("#A2_bit_1", "setToClose");
    } else {
        classRemove("#A2_bit_1", "setToClose");
    } 
        
    if (data.Alarm2[3] === '1') {
        classAdd("#A2_bit_3", "setToClose");
    } else {
        classRemove("#A2_bit_3", "setToClose");
    }    
    ///////////////////////////////////////////////////////////
    if (data.Alarm1[9] === '1') {
        classAdd("#A1_bit_9", "setToClose");
    } else {
        classRemove("#A1_bit_9", "setToClose");
    }
    if (data.Alarm1[10] === '1') {
        classAdd("#A1_bit_10", "setToClose");
    } else {
        classRemove("#A1_bit_10", "setToClose");
    }
    if (data.Alarm1[4] === '1') {
        classAdd("#A1_bit_4", "setToClose");
    } else {
        classRemove("#A1_bit_4", "setToClose");
    }
    if (data.Alarm1[6] === '1') {
        classAdd("#A1_bit_6", "setToClose");
    } else {
        classRemove("#A1_bit_6", "setToClose");
    }
    if (data.Alarm1[7] === '1') {
        classAdd("#A1_bit_7", "setToClose");
    } else {
        classRemove("#A1_bit_7", "setToClose");
    }
    if (data.Alarm1[12] === '1') {
        classAdd("#A1_bit_12", "setToClose");
    } else {
        classRemove("#A1_bit_12", "setToClose");
    }
    ////////////////////////////////////////////////////////
    if (data.Alarm1[1] === '1') {
        classAdd("#A1_bit_1", "setToClose");
    } else {
        classRemove("#A1_bit_1", "setToClose");
    }
    if (data.Alarm1[2] === '1') {
        classAdd("#A1_bit_2", "setToClose");
    } else {
        classRemove("#A1_bit_2", "setToClose");
    } 
    /////////////////////////////////////////////////////////   
    if (data.Alarm1[0] === '1') {
        classAdd("#A1_bit_0", "setToClose");
    } else {
        classRemove("#A1_bit_0", "setToClose");
    } 
    ///////////////////////////////////////////////////////    
    if (data.Alarm1[13] === '1') {
        classAdd("#A1_bit_13", "setToClose");
    } else {
        classRemove("#A1_bit_13", "setToClose");
    } 
    if (data.Alarm2[2] === '1') {
        classAdd("#A2_bit_2", "setToClose");
    } else {
        classRemove("#A2_bit_2", "setToClose");
    } 
    ///////////////////////////////////////////////////////////
    if (data.Alarm2[0] === '1') {
        classAdd("#A2_bit_0", "setToClose");
    } else {
        classRemove("#A2_bit_0", "setToClose");
    } 

    /*故障狀態******************************************************************** */
    //交流////////////////////////////////////////
    if (data.Fault1[2] === '1') {
        classAdd("#F1_bit_2", "setToClose");
    } else {
        classRemove("#F1_bit_2", "setToClose");
    } 
    if (data.Fault1[3] === '1') {
        classAdd("#F1_bit_3", "setToClose");
    } else {
        classRemove("#F1_bit_3", "setToClose");
    } 
    if (data.Fault1[4] === '1') {
        classAdd("#F1_bit_4", "setToClose");
    } else {
        classRemove("#F1_bit_4", "setToClose");
    } 
    if (data.Fault1[5] === '1') {
        classAdd("#F1_bit_5", "setToClose");
    } else {
        classRemove("#F1_bit_5", "setToClose");
    } 
    if (data.Fault1[6] === '1') {
        classAdd("#F1_bit_6", "setToClose");
    } else {
        classRemove("#F1_bit_6", "setToClose");
    } 
    if (data.Fault1[21] === '1') {
        classAdd("#F1_bit_21", "setToClose");
    } else {
        classRemove("#F1_bit_21", "setToClose");
    } 

    if (data.Fault2[1] === '1') {
        classAdd("#F2_bit_1", "setToClose");
    } else {
        classRemove("#F2_bit_1", "setToClose");
    }
    if (data.Fault2[16] === '1') {
        classAdd("#F2_bit_16", "setToClose");
    } else {
        classRemove("#F2_bit_16", "setToClose");
    }
    if (data.Fault2[6] === '1') {
        classAdd("#F2_bit_6", "setToClose");
    } else {
        classRemove("#F2_bit_6", "setToClose");
    }
    if (data.Fault2[23] === '1') {
        classAdd("#F2_bit_23", "setToClose");
    } else {
        classRemove("#F2_bit_23", "setToClose");
    }
    if (data.Fault2[24] === '1') {
        classAdd("#F2_bit_24", "setToClose");
    } else {
        classRemove("#F2_bit_24", "setToClose");
    }
    if (data.Fault2[19] === '1') {
        classAdd("#F2_bit_19", "setToClose");
    } else {
        classRemove("#F2_bit_19", "setToClose");
    }

    //直流//////////////////////////////////////////////////
    if (data.Fault1[0] === '1') {
        classAdd("#F1_bit_0", "setToClose");
    } else {
        classRemove("#F1_bit_0", "setToClose");
    }
    if (data.Fault1[1] === '1') {
        classAdd("#F1_bit_1", "setToClose");
    } else {
        classRemove("#F1_bit_1", "setToClose");
    }
    if (data.Fault1[18] === '1') {
        classAdd("#F1_bit_18", "setToClose");
    } else {
        classRemove("#F1_bit_18", "setToClose");
    }
    if (data.Fault1[20] === '1') {
        classAdd("#F1_bit_20", "setToClose");
    } else {
        classRemove("#F1_bit_20", "setToClose");
    }
    if (data.Fault2[8] === '1') {
        classAdd("#F2_bit_8", "setToClose");
    } else {
        classRemove("#F2_bit_8", "setToClose");
    }
    if (data.Fault2[10] === '1') {
        classAdd("#F2_bit_10", "setToClose");
    } else {
        classRemove("#F2_bit_10", "setToClose");
    }
    if (data.Fault2[11] === '1') {
        classAdd("#F2_bit_11", "setToClose");
    } else {
        classRemove("#F2_bit_11", "setToClose");
    }
    if (data.Fault2[21] === '1') {
        classAdd("#F2_bit_21", "setToClose");
    } else {
        classRemove("#F2_bit_21", "setToClose");
    }

    //孤島////////////////////////////////////////////////////////////
    if (data.Fault1[7] === '1') {
        classAdd("#F1_bit_7", "setToClose");
    } else {
        classRemove("#F1_bit_7", "setToClose");
    }
    if (data.Fault1[9] === '1') {
        classAdd("#F1_bit_9", "setToClose");
    } else {
        classRemove("#F1_bit_9", "setToClose");
    }
    if (data.Fault1[13] === '1') {
        classAdd("#F1_bit_13", "setToClose");
    } else {
        classRemove("#F1_bit_13", "setToClose");
    }
    if (data.Fault1[15] === '1') {
        classAdd("#F1_bit_15", "setToClose");
    } else {
        classRemove("#F1_bit_15", "setToClose");
    }

    //硬件///////////////////////////////////////////////////////////////
    if (data.Fault1[24] === '1') {
        classAdd("#F1_bit_24", "setToClose");
    } else {
        classRemove("#F1_bit_24", "setToClose");
    }
    if (data.Fault2[0] === '1') {
        classAdd("#F2_bit_0", "setToClose");
    } else {
        classRemove("#F2_bit_0", "setToClose");
    }
    if (data.Fault2[2] === '1') {
        classAdd("#F2_bit_2", "setToClose");
    } else {
        classRemove("#F2_bit_2", "setToClose");
    }
    if (data.Fault2[3] === '1') {
        classAdd("#F2_bit_3", "setToClose");
    } else {
        classRemove("#F2_bit_3", "setToClose");
    }
    if (data.Fault2[7] === '1') {
        classAdd("#F2_bit_7", "setToClose");
    } else {
        classRemove("#F2_bit_7", "setToClose");
    }
    if (data.Fault2[12] === '1') {
        classAdd("#F2_bit_12", "setToClose");
    } else {
        classRemove("#F2_bit_12", "setToClose");
    }
    if (data.Fault2[20] === '1') {
        classAdd("#F2_bit_20", "setToClose");
    } else {
        classRemove("#F2_bit_20", "setToClose");
    }
    if (data.Fault2[25] === '1') {
        classAdd("#F2_bit_25", "setToClose");
    } else {
        classRemove("#F2_bit_25", "setToClose");
    }
    if (data.Fault2[26] === '1') {
        classAdd("#F2_bit_26", "setToClose");
    } else {
        classRemove("#F2_bit_26", "setToClose");
    }
    if (data.Fault2[27] === '1') {
        classAdd("#F2_bit_27", "setToClose");
    } else {
        classRemove("#F2_bit_27", "setToClose");
    }

    //模塊/////////////////////////////////////////////
    if (data.Fault1[10] === '1') {
        classAdd("#F1_bit_10", "setToClose");
    } else {
        classRemove("#F1_bit_10", "setToClose");
    }
    if (data.Fault1[11] === '1') {
        classAdd("#F1_bit_11", "setToClose");
    } else {
        classRemove("#F1_bit_11", "setToClose");
    }
    if (data.Fault1[12] === '1') {
        classAdd("#F1_bit_12", "setToClose");
    } else {
        classRemove("#F1_bit_12", "setToClose");
    }
    if (data.Fault1[23] === '1') {
        classAdd("#F1_bit_23", "setToClose");
    } else {
        classRemove("#F1_bit_23", "setToClose");
    }
    if (data.Fault2[14] === '1') {
        classAdd("#F2_bit_14", "setToClose");
    } else {
        classRemove("#F2_bit_14", "setToClose");
    }

    //風機///////////////////////////////////////////////////
    if (data.Fault1[17] === '1') {
        classAdd("#F1_bit_17", "setToClose");
    } else {
        classRemove("#F1_bit_17", "setToClose");
    }
    if (data.Fault2[22] === '1') {
        classAdd("#F2_bit_22", "setToClose");
    } else {
        classRemove("#F2_bit_22", "setToClose");
    }

    //LCD//////////////////////////////////////////////////
    if (data.Fault2[5] === '1') {
        classAdd("#F2_bit_5", "setToClose");
    } else {
        classRemove("#F2_bit_5", "setToClose");
    }
    if (data.Fault2[13] === '1') {
        classAdd("#F2_bit_13", "setToClose");
    } else {
        classRemove("#F2_bit_13", "setToClose");
    }
}



