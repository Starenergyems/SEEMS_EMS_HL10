// 引入套件
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const cors = require("cors");
const methodOverride = require("method-override");

const app = express();
const port = 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Your Line Notify logic (similar to the previous example)
// ...

// Define a route to render the EJS template
app.get("/", (req, res) => {
  res.render("testForLine");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
