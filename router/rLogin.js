////////////////////////////////////////////////////////////////////////////////////////
// How JavaScript URL works.
// window.location.href = 'https://domain/path';   // absolute
// window.location.href = '//domain/path';         // relative to current schema
// window.location.href = 'path';                  // relative to current path
// window.location.href = '/path';                 // relative to domain
// window.location.href = '../';                   // one level up
////////////////////////////////////////////////////////////////////////////////////////
// Node.js setting, do not change.
// const express = require("express");
// const path = require("path");
// const methodOverride = require("method-override");
// const router = express.Router();
// const app = express();
// const cors = require("cors");

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "../views"));
// app.use(methodOverride("_method"));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "../public")));
// app.use(cors());
// const fetch = require("node-fetch");
////////////////////////////////////////////////////////////////////////////////////////
// Need change.
//如果要換資料庫的host改掉".database"
const config = require("./config");
const couchdbConfig = config.database;
const db = couchdbConfig
const moment = require("moment");
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
// const AUTHORIZATION = "Basic " + btoa(`${db_USERNAME}:${db_PASSWORD}`);
const CREDENTIALS = Buffer.from(`${db_USERNAME}:${db_PASSWORD}`).toString('base64');
const AUTHORIZATION = "Basic " + CREDENTIALS;
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
      ? (locktimes = 4)
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
var repwd

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
  // console.log(mangoQuery)
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
    // console.log("545645314DDD",data)
    if (data.docs) {
      
      id = data.docs[0]._id; // Impossible  undefined.
      rev = data.docs[0]._rev; // Impossible  undefined.
      time = datetime(); // function findaccount execute time.
      user = data.docs[0].user; // data from doc become doc.user.

      // console.log(user.errcount, user.errcount === (undefined || "" || "NaN"))
      user.num === undefined ? (employeenum = "") : (employeenum = user.num);
      mail = user.mail; // Impossible  undefined.
      user.name === undefined ? (namee = "") : (namee = user.name);
      user.company === undefined ? (company = "") : (company = user.company);
      user.department === undefined
        ? (department = "")
        : (department = user.department);
      user.level === undefined ? (level = "viewer") : (level = user.level);
      user.permission === undefined ? (level = "viewer") : (level = user.permission);
      user.state === undefined ? (state = "deactivate") : (state = user.state);
      user.errcount === (undefined || "" || "NaN")
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
      user.repwd === undefined
        ? (repwd = "")
        : (repwd = user.repwd);
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
        company : company,
        department : department,
        state : state,
        note : note,
        last_time: last_time,
        password: password,
        repwd:repwd
        
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
// Use _id update account doc. put method need content, if not will be null.

async function updateaccount(id, configdata="", passwordd="", createdata="", repwdd="") {
  const URL = `${db_URL}/${db_account}/${id}`;
  
  findaccount(inmail = "", intoken = "")

  if (passwordd !== "" ){
    password = passwordd
    repwd = 1
  }

  if (repwd !== "" ){
    repwd = repwdd
    // repwd = 0
  }

  const updatedDoc = {
    _id: `${id}`,
    _rev: `${rev}`,
    time: `${datetime()}`, // The doc verify time.
    user: {
      num: `${employeenum}`,
      mail: `${mail}`,
      name: `${namee}`,
      company: `${company}`,
      department: `${department}`,
      permission: `${level}`,
      level: `${level}`,
      state: `${state}`,
      errcount: `${errcount}`,
      note: `${note}`,
      last_time: `${last_time}`,
      password: `${password}`,
      bantill: `${bantill}`,
      token: `${token}`,
      validtime: `${validtime}`,
      repwd: `${repwd}`
    },
  };
  // console.log(updatedDoc)
  let bodyy 
  if (id === doc_CONFIG) {
    bodyy = JSON.stringify(configdata[0])
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

  let response = { // Empty response.
    result: "",
    text: "",
    mail: "",
    token: "",
    validtime: "",
    permission: "",
    repwd:""
  };
  
  if (!EMAIL.includes("@hdrenewables.com")) {
    response["result"] = false;
    response["text"] = `帳號或密碼錯誤 - 目前累積 ${errcount} 次\n若登入失敗超過 ${locktimes} 次，此用戶將被鎖定`
    return response
  }

  // SuperUser Login.
  if (EMAIL===process.env.superuser_account && PASSWORD ===process.env.superuser_password){
    response["result"] = true;
    response["token"] = process.env.LineNotifyToken;
    response["text"] = `Superuser Login Success`;
    response["level"] = `admin`
    return response
    }
  
  await getconfig();
  await findaccount(EMAIL,"");

  if (new Date(moment(time).format("YYYY/MM/DD HH:mm:ss")).getTime() > new Date(bantill).getTime() && state === "lock" && suspendtime !== "永久" && errcount >= locktimes){
    console.log("解鎖")
    state = "activate" // lock and bantime passed.
    errcount = 0
  }

  if (state === "activate"){ 
    if (PASSWORD === password){
      errcount = 0;
      bantill = "";
      last_time = datetime();
      token = await uuid();
      validtime = datetime(duration);
      response["result"] = true;
      response["text"] = `${mail} Login Success.`;
      response["id"] = id;
      response["mail"] = mail;
      response["token"] = token;
      response["validtime"] = validtime;
      response["permission"] = level;
    } else if(PASSWORD !== password){
      errcount += 1
      response["result"] = false;
      response["text"] = `帳號或密碼錯誤 - 目前累積 ${errcount} 次\n若登入失敗超過 ${locktimes} 次，此用戶將被鎖定`
      // `Login failed ${errcount} time. If continuous login fail up to ${locktimes} the user will be lock.`
      response["id"] = id;
      response["mail"] = mail;
      response["token"] = token;
      response["validtime"] = validtime;
      response["permission"] = level;
    }
    // await updateaccount(id,"","","");
  }

  if (errcount === locktimes){
    state = "lock"
    response["text"] = `The user is locked. Please contact system manager.`
    if (suspendtime !== "永久"){
      formattedDateTime = datetime(parseFloat(suspendtime));
      bantill= moment(formattedDateTime).format("YYYY/MM/DD HH:mm:ss")
      response["text"] = `登入失敗次數達 ${locktimes} 次, 此帳號已被鎖定!`
      // `The user is locked until ${bantill}.`
    }
  }

  // await updateaccount(id,"","","");

  if (response["result"] === true) {
  // judge password format

  let digitCount = 0;
  let upperCaseCount = 0;
  let lowerCaseCount = 0;
  let specialCharCount = 0;

  for (let i = 0; i < password.length; i++) {
      const char = password[i];
      if (/[0-9]/.test(char)) {
          digitCount++;
      } else if (/[A-Z]/.test(char)) {
          upperCaseCount++;
      } else if (/[a-z]/.test(char)) {
          lowerCaseCount++;
      } else {
          specialCharCount++;
      }
  }
  // console.log(digitCount, upperCaseCount, lowerCaseCount, specialCharCount)
  if (digitCount < num || upperCaseCount < upper || lowerCaseCount < lower || specialCharCount < special || password.length < atleast || password.length > atmost){
    repwd = "1"
    // console.log("repwd",repwd)
  } else {
    repwd = "0"
  }

  if (repwd === 1 || password === id ) {
    response["repwd"] = repwd
    // console.log(repwd)
  }
  }
  await updateaccount(id,"","","",repwd);
  return response;
}

////////////////////////////////////////////////////////////////////////////////////////
// The function for get all document in database.
async function alldoc(database) {
  const URL = `${db_URL}/${database}/_all_docs?include_docs=true`
  const response = await fetch(URL, {
    method: "GET",
    headers: { Authorization: AUTHORIZATION },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return  response
}

////////////////////////////////////////////////////////////////////////////////////////
// The function for get all document in database.
async function getbyid(id) {
  const URL = `${db_URL}/${db.account}/${id}?include_docs=true`
  const response = await fetch(URL, {
    method: "GET",
    headers: { Authorization: AUTHORIZATION },
    credentials: "include",
  });
  data = await response.json()
  let rrr = {}
  for (const [key, value] of Object.entries(data)) 
{
  rrr[key] = value
} 
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  // 
  return await rrr
}

////////////////////////////////////////////////////////////////////////////////////////
// Delete account specify user.
async function deleteuser(docid) {
  const rr = await getbyid(docid)
  const URL = `${db_URL}/${db.account}/${docid}/?rev=${rr._rev}`
  fetch(URL, {
    method: 'DELETE',
    headers: { Authorization: AUTHORIZATION },
    credentials: "include",
  })
    .then(response => {
      console.log(response.status)
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      console.log('User deleted successfully');
    })
  // }
  // if (!response.ok) {
  //   throw new Error(`Request failed with status ${response.status}`);
  // }
}
////////////////////////////////////////////////////////////////////////////////////////
// User log.
async function userlog(userid) {
  const URL = `${db_URL}/${db.log}/_find`
  const mangoQuery = { selector: { "username": { $eq: userid } } };
  logdata = await fetch(URL, {
    method: 'POST',
    headers: { 
      'Content-Type': "application/json",
      Authorization: AUTHORIZATION,
    },
    credentials: "include",
    body: JSON.stringify(mangoQuery),
  })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Failed to delete user');
  //     }
  //     console.log('User deleted successfully');
  //   })
  // }
  logdata = await logdata.json();
  return logdata
  }

////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
// User log.
async function addlog(user, content) {
  const URL = `${db_URL}/${db.log}/`
  const data = {
    tag: "account",
    time: datetime(),
    category: "帳戶管理",
    device: "帳戶管理",
    username: user,
    content: content
  }
  await fetch(URL, {
    method: 'POST',
    headers: { 
      'Content-Type': "application/json",
      Authorization: AUTHORIZATION,
    },
    credentials: "include",
    body: JSON.stringify(data),
  }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to add userlog');
      }
      console.log('User log add successfully');
    })
  }

  addlog("test", "ttt")

////////////////////////////////////////////////////////////////////////////////////////


async function authentication(req) {
    let token = ""
    let browser_token = ""
    req.cookies.token === undefined ? browser_token = "" : browser_token = req.cookies.token
    if (browser_token === process.env.LineNotifyToken){
      // console.log("The token is not exist in browser's cookie.")
      return true
    }
    if (browser_token === "" || browser_token === undefined){
        // console.log("The token is not exist in browser's cookie.")
        return false
    }
    else if (browser_token !== ""){
        await findaccount("", browser_token).then(temp => {
            id = temp['id']
            token = temp['token']
            level = temp['level']
            repwd = temp['repwd']
            passwordddd = temp.password
        })
        // const res = `\ncookie's token is ${browser_token}\naccount token is ${token}`

        const config = await getconfig()
        // const token = req.cookies.token
        // const account = await findaccount("", token);
        // const id = account.id
        // let password = account.password
        let digitCount = 0;
        let upperCaseCount = 0;
        let lowerCaseCount = 0;
        let specialCharCount = 0;
        for (let i = 0; i < passwordddd.length; i++) {
            const char = passwordddd[i];
            if (/[0-9]/.test(char)) {
                digitCount++;
            } else if (/[A-Z]/.test(char)) {
                upperCaseCount++;
            } else if (/[a-z]/.test(char)) {
                lowerCaseCount++;
            } else {
                specialCharCount++;
            }
        }

        if (digitCount < config["number"] || upperCaseCount < config["upper"] || lowerCaseCount < config["lower"] || specialCharCount < config["special"]) {
        return 1 
        }
        
        if (token === browser_token && repwd !== "1") {
          // console.log("Authentication is OK.", res)
          // console.log({"id": id, "permission": level})
          return {"id": id, "permission": level}
        } else if (token === browser_token && repwd === "1"){
            return 1;
        } else {
            console.log("Authentication is not OK.", res)
            return false
        }
    }
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
  getbyid,
  deleteuser,
  userlog,
  authentication,
  addlog
};