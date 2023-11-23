async function hello() {
  try {
    let result = await fetch(
      "https://v2.jokeapi.dev/joke/Programming,Dark,Christmas"
    );
    let data = await result.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}

let button = document.querySelector("#new-joke");
button.addEventListener("click", () => {
  hello();
});
