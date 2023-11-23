
// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

const A = document.querySelector(".formula_1 #multiplicand");
const B = document.querySelector(".formula_1 #multiplier");
const C = document.querySelector(".formula_1 #Ans");

A.addEventListener("change", Cal);
B.addEventListener("change", Cal);

function Cal() {
    let x = Number(A.value);
    let y = Number(B.value);
    C.textContent = " = " + Multiply(x, y);
}

function Multiply(num_1, num_2) {
    Answer = num_1 * num_2;
    return Answer;
}
