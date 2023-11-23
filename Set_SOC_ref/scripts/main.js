
// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

// const button_01 = document.querySelector("#button_01");
// button_01.addEventListener("click", CloseWindow);
// function CloseWindow() {
//     window.close();
// }

const SOC_Max = document.querySelector("#table_01 #data_val_01");
SOC_Max.addEventListener("click", Set_SOC_Max);

function Set_SOC_Max() {
    let value_set_raw = prompt("請輸入設定值(0.0~100.0)：");
    if ((value_set_raw) && (value_set_raw !== null)) {
        let value_set = Math.round(Number(value_set_raw) * 10);
        if (value_set >= 0 && value_set <= 1000) {
            let val = value_set / 10
            SOC_Max.textContent = val.toFixed(1);
        }
    }
}

const V_Max = document.querySelector("#table_01 #data_val_02");
V_Max.addEventListener("click", Set_V_Max);

function Set_V_Max() {
    let value_set_raw = prompt("請輸入設定值(850.0~1095.0)：");
    if ((value_set_raw) && (value_set_raw !== null)) {
        let value_set = Math.round(Number(value_set_raw) * 10);
        if (value_set >= 8500 && value_set <= 10950) {
            let val = value_set / 10
            V_Max.textContent = val.toFixed(1);
        }
    }
}
