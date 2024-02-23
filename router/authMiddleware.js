// This middleware is use for check authorization.
// input toekn
// output reslut permission id

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const { findaccount } = require("./rLogin")


async function authentication(req) {
    let token = ""
    let browser_token = ""
    req.cookies.token === undefined ? browser_token = "" : browser_token = req.cookies.token
    if (browser_token === ""){console.log('The browser is not exist cookies.')}
    else if (browser_token !== ""){
        await findaccount("", browser_token).then(temp => {token = temp})
        console.log(`The token in browser's cookies is ${browser_token}`)
        console.log(`From findaccount token is ${token}`)
        if (token === browser_token) {
            console.log("Authentication is OK.")
            return true
        } else if (token !== browser_token){console.log("Authentication is not OK.")}
    }
    return false
}

module.exports = {authentication}
