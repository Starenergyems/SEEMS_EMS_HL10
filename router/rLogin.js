////////////////////////////////////////////////////////////////////////////////////////
// Node.js setting, do not change.

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");
const config = require("./config");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

////////////////////////////////////////////////////////////////////////////////////////
// Need change.
//如果要換資料庫的host 改掉".database"
const couchdbConfig = config.database;

////////////////////////////////////////////////////////////////////////////////////////
// Do not need change.
const db_USERNAME = couchdbConfig.username; // Couchdb username use for login db.
const db_PASSWORD = couchdbConfig.password; // Couchdb password use for login db.
const db_IP = couchdbConfig.host; // Couchdb IPv4 address.
const db_PORT = couchdbConfig.port; // Couchdb service use port.

const db_account = couchdbConfig.account; // The account database name.
const doc_CONFIG = couchdbConfig.config; // The account setting doc id.

const db_URL = "http://" + db_IP + ":" + db_PORT; // Use for fetch database function.
// const db_URL = couchDBUrl; // Use for fetch database function.
const AUTHORIZATION = "Basic " + btoa(`${db_USERNAME}:${db_PASSWORD}`);

////////////////////////////////////////////////////////////////////////////////////////
// Variable declare, config data.

var atleast; // The maximum password length.
var atmost; // The minimum password length.
var upper; // Uppercase alphbet at least in password. ABC
var lower; // Lowercase alphbet at least in password. abc
var special; // Special character at least in password. !@#
var num; // Nunber at least in password. 123
var locktimes; // System setting for how many times login failure to lock the account.
var suspendtime; // System setting for how long to lock the account. unit is hour
var logintext; // Show in login page html.
var duration; // Cookies maintain time. unit is hour.

// Use to get couchdb CONFIG doc. Purpose for getting CONFIG doc.
async function getconfig() {
  const URL = `${db_URL}/${db_account}/${doc_CONFIG}`;
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: { Authorization: AUTHORIZATION },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    // console.log(data)
    data.atleast === undefined
      ? (atleast = 5)
      : (atleast = parseInt(data.atleast));
    data.atmost === undefined
      ? (atmost = 10)
      : (atmost = parseInt(data.atmost));
    data.upper === undefined ? (upper = 1) : (upper = parseInt(data.upper));
    data.lower === undefined ? (lower = 1) : (lower = parseInt(data.lower));
    data.special === undefined
      ? (special = 1)
      : (special = parseInt(data.special));
    data.num === undefined ? (num = 1) : (num = parseInt(data.num));
    data.locktimes === undefined
      ? (locktimes = 3)
      : (locktimes = parseInt(data.locktimes));
    data.suspendtime === undefined
      ? (suspendtime = "永久")
      : (suspendtime = data.suspendtime);
    data.logintext === undefined
      ? (logintext = "登入頁面提示字元")
      : (logintext = data.logintext);
    data.duration === undefined ? (duration = "") : (duration = data.duration);
    const res = {
      "id": data._id,
      "rev": data._rev,
      "atleast": atleast,
      "atmost": atmost,
      "upper": upper,
      "lower": lower,
      "special": special,
      "number": num,
      "locktimes": locktimes,
      "suspendtime": suspendtime,
      "logintext": logintext,
      "duration": duration
    }
    // console.log("doc",res)
    return res
  } catch (error) {
    console.error("config Error:", error.message);
  }
}

////////////////////////////////////////////////////////////////////////////////////////
// Variable declare to store data in the account doc.

var id; // _id.
var rev; // _rev.
var time; // At first is establish time, else verify time.
var employeenum; // User's employeenumber.
var mail; // User's email need use @hdrenewables.com, and use for filter for account doc.
var namee; // User's name.
var company; // User's company.
var department; // User's department.
var level; // User's permission in system, accadmin for manage acount; sysadmin for operate system; general only view.
var state; // User's status, normal for normal use; deactivate for lock.
var errcount; // User's for calculate login failure times.
var note; // For accadmin to record things.
var last_time; // User's last login success time.
var password; // User's system password.
var bantill; // New var, use for record if user is locked when to unlock.
var token; // New var, when user login success, system will random generate for validation.
var validtime; // New var, the token will be validate to validtime.

async function findaccount(inmail = "", intoken = "") {
  // use login page submit email or token to search account db.
  const URL = `${db_URL}/${db_account}/_find`;
  let mangoQuery = "",
    response = "",
    data = "";
  if (inmail !== "" && intoken === "") {
    mangoQuery = { selector: { "user.mail": { $eq: inmail } } };
  } else if (inmail === "" && intoken !== "") {
    mangoQuery = { selector: { "user.token": { $eq: intoken } } };
  }
  try {
    data = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTHORIZATION,
      },
      credentials: "include",
      body: JSON.stringify(mangoQuery),
    });
    data = await data.json();
    if (data.docs.length === 1) {
      id = data.docs[0]._id; // Impossible  undefined.
      rev = data.docs[0]._rev; // Impossible  undefined.
      time = datetime(); // function findaccount execute time.
      user = data.docs[0].user; // data from doc become doc.user.
      user.num === undefined ? (employeenum = "") : (employeenum = user.num);
      mail = user.mail; // Impossible  undefined.
      user.name === undefined ? (namee = "") : (namee = user.name);
      user.comapny === undefined ? (company = "") : (company = user.comapny);
      user.department === undefined
        ? (department = "")
        : (department = user.department);
      user.level === undefined ? (level = "general") : (level = user.level);
      user.state === undefined ? (state = "deactivate") : (state = user.state);
      user.errcount === undefined
        ? (errcount = 0)
        : (errcount = parseInt(user.errcount));
      user.note === undefined ? (note = "") : (note = user.note);
      user.last_time === undefined
        ? (last_time = "")
        : (last_time = user.last_time);
      user.password === undefined
        ? (password = id)
        : (password = user.password); // default password is employeenum.
      user.bantill === undefined ? (bantill = "") : (bantill = user.bantill);
      user.token === undefined ? (token = "") : (token = user.token);
      user.validtime === undefined
        ? (validtime = "")
        : (validtime = user.validtime);
    }
    if (inmail !== "" && intoken === "" && data.docs.length !== 1) {
      response = `Keyin user mail or password is incorrect.`;
    }
    if (inmail === "" && intoken !== "" && data.docs.length === 1) {
      response = { 
        id: id, 
        token: token, 
        level: level ,
        num : employeenum,
        name : namee,
        comapny : company,
        department : department,
        state : state,
        note : note,
        last_time: last_time,
        password: password
      };
    } else {
      response = `Error findaccount token.`;
    }
    return response;
  } catch (error) {
    console.error(`Execute mango query occur error : ${error}`);
    throw error;
  }
}

////////////////////////////////////////////////////////////////////////////////////////
// Use _id updata account doc. put method need content, if not will be null.

async function updateaccount(id, configdata="", passwordd="", createdata="") {
  const URL = `${db_URL}/${db_account}/${id}`;
  if (passwordd !== "") {
    password = passwordd
  }
  const updatedDoc = {
    _id: `${id}`,
    _rev: `${rev}`,
    time: `${datetime()}`, // The doc verify time.
    user: {
      num: `${employeenum}`,
      mail: `${mail}`,
      name: `${namee}`,
      comapny: `${company}`,
      department: `${department}`,
      level: `${level}`,
      state: `${state}`,
      errcount: `${errcount}`,
      note: `${note}`,
      last_time: `${last_time}`,
      password: `${password}`,
      bantill: `${bantill}`,
      token: `${token}`,
      validtime: `${validtime}`,
    },
  };
  let bodyy 
  if (id === doc_CONFIG) {
    bodyy = JSON.stringify(configdata[0])
    // console.log(bodyy)
  } else if (createdata.length === 1) {
    bodyy = JSON.stringify(createdata[0])
  }else {
  bodyy = JSON.stringify(updatedDoc)
  }
  await fetch(URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTHORIZATION,
    },
    credentials: "include",
    body: bodyy,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Document updated successfully:", result);
    })
    .catch((error) => {
      console.error("Error updating document:", error);
    });
}

////////////////////////////////////////////////////////////////////////////////////////
// Generate datetime string default now, offset for back or forward hours.

function datetime(offset = 0) {
  return new Date(new Date().getTime() + offset * 60 * 60 * 1000).toISOString();
}

// Verify timezone problem, code from https://ithelp.ithome.com.tw/articles/10231926.
Date.prototype.toISOString = function () {
  let pad = (n) => (n < 10 ? "0" + n : n);
  let hours_offset = this.getTimezoneOffset() / 60;
  let offset_date = this.setHours(this.getHours() - hours_offset);
  let symbol = hours_offset >= 0 ? "-" : "+";
  let time_zone = symbol + pad(Math.abs(hours_offset)) + ":00";
  return (
    this.getUTCFullYear() +
    "-" +
    pad(this.getUTCMonth() + 1) +
    "-" +
    pad(this.getUTCDate()) +
    "T" +
    pad(this.getUTCHours()) +
    ":" +
    pad(this.getUTCMinutes()) +
    ":" +
    pad(this.getUTCSeconds()) +
    "." +
    (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    time_zone
  );
};

////////////////////////////////////////////////////////////////////////////////////////
// Generate random uuid

async function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

////////////////////////////////////////////////////////////////////////////////////////
// The function for login page submit.

async function submit(EMAIL, PASSWORD) {
  let response = {
    result: "",
    text: "",
    mail: "",
    token: "",
    validtime: "",
    permission: "",
  };
  await getconfig();
  await findaccount((maill = EMAIL)).then((temp) => {
    console.log(temp);
  });
  // According login page submit mail to select account data
  // console.log(response)

  if (errcount === "NaN" || errcount === "") {
    errcount = 0;
  }
  if (
    Date.parse(bantill) > Date.parse(time) ||
    (state === "lock" && suspendtime !== "永久")
  ) {
    console.log(`bantill：${bantill}, state:${state}`);
    errcount = 0;
    bantill = "";
    state = "activate";
  }
  if (
    errcount >= locktimes ||
    Date.parse(bantill) > Date.parse(time) ||
    state === "lock"
  ) {
    console.log(
      `errcount:${errcount}, locktimes:${locktimes}, bantill：${bantill}, state:${state}`
    );
    token = "";
    validtime = "";
    state = "lock";
  }
  if (
    state === "activate" &&
    (errcount === "" || errcount < locktimes) &&
    (bantill === "" || Date.parse(bantill) < Date.parse(time))
  ) {
    console.log(`User ${mail} is loginable.`);
    if (password === PASSWORD) {
      errcount = 0;
      bantill = "";
      last_time = datetime();
      token = await uuid();
      validtime = datetime(duration);
      response["result"] = true;
      response["text"] = `User ${mail} Login Success.`;
      response["id"] = id;
      response["mail"] = mail;
      response["token"] = token;
      response["validtime"] = validtime;
      response["permission"] = level;
    } else if (errcount < locktimes - 1) {
      // keyin password is incorrect.
      errcount += 1;
      response["result"] = false;
      response["text"] =
        `Login fail "${errcount}" times. If continuous fail "${locktimes}" times, the user will be lock`;
      if (suspendtime !== "永久") {
        response["text"] += `"${suspendtime}" hours.`;
      } else {
        response["text"] += ".";
      }
    } else if (errcount === locktimes - 1) {
      errcount += 1;
      token = "";
      validtime = "";
      state = "lock";
      response["text"] =
        `Continuous loginfail up to ${locktimes} times, the user locked`;
      if (suspendtime !== "永久") {
        bantill = datetime(parseFloat(suspendtime));
        response["text"] += `untill${bantill}.`;
      } else {
        suspendtime === "永久";
        bantill = "";
        response["text"] += ".";
      }
    }
  }
  updateaccount(id);
  console.log(response["text"]);
  return response;
}

////////////////////////////////////////////////////////////////////////////////////////
// The function for get all document in database.
async function alldoc(database) {
  const URL = `${db_URL}/${database}/_all_docs`
  const response = await fetch(URL, {
    method: "GET",
    headers: { Authorization: AUTHORIZATION },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response
}

////////////////////////////////////////////////////////////////////////////////////////
// Delete account specify user.
async function deleteuser(doc_num) {
  const URL = `${db_URL}/${db.account}/${doc_num}/`
  fetch(URL, {
    method: 'DELETE',
    headers: { Authorization: AUTHORIZATION },
    credentials: "include",
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      console.log('User deleted successfully');
    })
  }

////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  submit,
  getconfig,
  findaccount,
  updateaccount,
  datetime,
  uuid,
  alldoc,
  deleteuser,
};
