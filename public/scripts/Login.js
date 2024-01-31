// var myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";
// Variable declare, Change for real data.
const db_USERNAME = "admin"; // Couchdb username use for login db.
const db_PASSWORD = "ems45877096"; // Couchdb password use for login db.
const db_IP = "127.0.0.1"; // Couchdb IPv4 address.
const db_PORT = "5984"; // Couchdb service use port.

const db_account = "test"; // The account database name.
const doc_CONFIG = "CONFIG"; // The account setting doc id.

// login page html id variable declare 
const id_EMAIL = "userAccount"; // The email input element's id.
const id_PASSWORD = 'userPassword'; //  The password input element's id.
const id_TEXT = ""; // Show hint text element's id.

////////////////////////////////////////////////////////////////////////////////////////
// Do not need change.

const db_URL = "http://" + db_IP + ":" + db_PORT; // Use for fetch function
const AUTHORIZATION ='Basic ' + btoa(`${db_USERNAME}:${db_PASSWORD}`)
var EMAIL; // Use for testing function

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
var duration = 1 // new var Cookies maintain time. unit is hour.

// Use to get couchdb CONFIG doc. Purpose for getting CONFIG doc.
async function getconfig(){
  const URL = `${db_URL}/${db_account}/${doc_CONFIG}`;
  await fetch(URL, {
    method: 'GET',
    headers: {'Authorization': AUTHORIZATION},
    credentials: 'include' // HTTP authentication in the request.
  })
  .then (response => {
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json();
  })
  .then(data => {
    atleast = parseInt(data.atleast);
    atmost = parseInt(data.atmost);
    upper = parseInt(data.upper);
    lower = parseInt(data.lower);
    special = parseInt(data.special);
    num = parseInt(data.num);
    locktimes = parseInt(data.failure);
    suspendtime = data.suspend;
    logintext = data.logintext;
    // console.log(`atleast: ${atleast}`);
    // console.log(`atmost: ${atmost}`);
    // console.log(`upper: ${upper}`);
    // console.log(`lower: ${lower}`);
    // console.log(`special: ${special}`);
    // console.log(`num: ${num}`);
    // console.log(`locktimes: ${locktimes}, ${typeof(locktimes)}`);
    // console.log(`suspendtime: ${suspendtime}`);
    // console.log(`logintext: ${logintext}`);
    })
  .catch(error => {
    console.error('Error:', error.message);
  });
}

////////////////////////////////////////////////////////////////////////////////////////
// Variable declare, to store data in the account doc.

var id; // _id.
var rev; // _rev.
var time; // First is establish time, else verify time.
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
var validtime // New var, the token will be validate to validtime.

async function findaccount(mail) {
  const URL = `${db_URL}/${db_account}/_find`;
  const mangoQuery = {selector: {"user.mail": { "$eq": mail}}}; // use login page submit email to search account db.
  await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': AUTHORIZATION,},
    credentials: 'include',
    body: JSON.stringify(mangoQuery),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    if (data.docs.length === 1){ // If select doc only one to implement var.
      id = data.docs[0]._id;
      rev = data.docs[0]._rev
      time = datetime();
      data = data.docs[0].user; // data from doc become doc.user.
      employeenum  = data.num;
      mail = EMAIL;
      namee = data.name;
      company === undefined ? company = "" : company = data.comapny;
      department = data.department;
      level = data.level;
      state = data.state
      errcount === undefined ? errcount = 0 : errcount = parseInt(data.errcount);
      note === undefined ? note = "" : note = data.note;
      last_time === undefined ? last_time = "" : last_time = data.last_time;
      password = data.password;
      bantill === undefined ? bantill = "" : bantill = data.bantill;
      token === undefined ? token = "" : token = data.token;
      validtime === undefined ? validtime = "" : validtime = data.validtime;
      // console.log(`_id: ${id}`);
      // console.log(`_rev: ${rev}`);
      // console.log(`time: ${time}`);
      // console.log(`employeenum: ${employeenum}`);
      // console.log(`mail: ${mail}`);
      // console.log(`namee: ${namee}`);
      // console.log(`company: ${company}`);
      // console.log(`department: ${department}`);
      // console.log(`level: ${level}`);
      // console.log(`state: ${state}`);
      // console.log(`errcount: ${errcount}`);
      // console.log(`note: ${note}`);
      // console.log(`last_time: ${last_time}`);
      // console.log(`password: ${password}`);
      // console.log(`bantill: ${bantill}`);
      // console.log(`token: ${token}`);
      // console.log(`validtime: ${validtime}`);
    } else {
      const response = `帳號或密碼錯誤`
      console.log(response)
      return {'Error':response}
    }
  })
  .catch(error => {
    console.error('Error executing Mango query:', error);
  });
}

////////////////////////////////////////////////////////////////////////////////////////
// Use _id updata account doc. put method need content, if not will be null.

async function updateaccount(id) {
  const URL = `${db_URL}/${db_account}/${id}`;

  const updatedDoc = {
    "_id" : `${id}`,
    "_rev" : `${rev}`,
    "time": `${datetime()}`, // The doc verify time.
    "user" : {
      "num" : `${employeenum}`,
      "mail" : `${EMAIL}`,
      "name" : `${namee}`,
      "comapny" : `${company}`,
      "department" : `${department}`,
      "level" : `${level}`,
      "state" : `${state}`,
      "errcount" : `${errcount}`,
      "note" : `${note}`,
      "last_time" : `${last_time}`,
      "password" : `${password}`,
      "bantill" : `${bantill}`,
      "token": `${token}`,
      "validtime" : `${validtime}`
    }
  }
  fetch(URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': AUTHORIZATION,},
      //'Referer': 'http://127.0.0.1/'},
    credentials: 'include',
    body: JSON.stringify(updatedDoc),
  })
  .then(response => response.json())
  .then(result => {
    console.log('Document updated successfully:', result);
  })
  .catch(error => {
    console.error('Error updating document:', error);
  });
}

////////////////////////////////////////////////////////////////////////////////////////
// Get login page html element value.

async function getElement(htmlid){
    const value = document.getElementById(htmlid).value
    return value;
  }

////////////////////////////////////////////////////////////////////////////////////////

// from https://ithelp.ithome.com.tw/articles/10231926 use to verify timezone problem.
Date.prototype.toISOString = function () {
  let pad =(n)=>(n < 10)?'0' + n:n;
  let hours_offset = this.getTimezoneOffset() / 60;
  let offset_date = this.setHours(this.getHours() - hours_offset);
  let symbol = (hours_offset >= 0) ? "-" : "+";
  let time_zone = symbol+pad(Math.abs(hours_offset))+ ":00";
  
  return this.getUTCFullYear() +
      '-' + pad(this.getUTCMonth() + 1) +
      '-' + pad(this.getUTCDate()) +
      'T' + pad(this.getUTCHours()) +
      ':' + pad(this.getUTCMinutes()) +
      ':' + pad(this.getUTCSeconds()) +
      '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
      time_zone;
};

// The funciotn generate datetime string default now, offset is back/forward hours.
function datetime(offset=0){
  const time = new Date((new Date()).getTime() + (offset * 60 * 60 * 1000)).toISOString();
  // const month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  // const datetime = `${time.getFullYear()}-${month[time.getMonth()]}-${time.getDate()}T${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}.${time.getMilliseconds()}Z`;
  return time;
}
////////////////////////////////////////////////////////////////////////////////////////
// The function use to generate random uuid

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}
// window.location.assign("https://www.google.com");

// window.location.replace("https://www.google.com")
////////////////////////////////////////////////////////////////////////////////////////
// The function for login page submit.
async function submit(){
  let response // For return.
  await getconfig();
  let PASSWORD = await getElement(id_PASSWORD); // The password key by loginer.
  EMAIL = await getElement(id_EMAIL)
  await findaccount(EMAIL); // According login page submit mail to select account data
  
  // console.log(`state: ${state}, ${typeof(state)} `);
  // console.log(`errcount: ${errcount}, ${typeof(errcount)} `);
  // console.log(`locktimes: ${locktimes}, ${typeof(locktimes)} `);
  // console.log(`bantill: ${bantill}, ${typeof(bantill)} `);
  // console.log(`time: ${time}, ${typeof(time)} `);
  
  // state errcount bantill 
  if (state === "normal" && errcount < locktimes && bantill === ""){ // Judge either the user can login or not. bantill may null
    if (password === PASSWORD) { // submit password is correct.
      console.log("Login Success.")
      errcount = 0;
      bantill = "";
      last_time = datetime();
      token = uuid();
      validtime = datetime(duration);
      document.cookie = `token=${token}; max-age=${duration*3600}`;
      console.log(document.cookie)
      window.location.href = "https://www.example.com"
    } // error password
    else if (errcount < locktimes) {
      errcount += 1;
      if (suspendtime != "永久") {
      response = `Login failtimes is ${errcount}. If continuous loginfail up to ${locktimes} times, the user will be lock ${suspendtime} hours.`}
      else {  
        response = `Login failtimes is ${errcount}. If continuous loginfail up to ${locktimes} times, the user will be lock.`}  
    }}
  else if (errcount >= locktimes && suspendtime != "永久"){
    bantill = datetime(parseInt(suspendtime))
    validtime == ""
    state = "suspend"}
  else if (errcount >= locktimes && suspendtime === "永久"){
      bantill = ""
      validtime == ""
      state = "suspend"}
  else if (bantill != "" && Date.parse(bantill) > Date.parse(time)) {
    state = "suspend"
    validtime == ""
    response `Continuous loginfail up to ${locktimes} times, the user be lock untill${bantill}.`
  }
  updateaccount(id)
  return {'Error':response}
}

////////////////////////////////////////////////////////////////////////////////////////
// console.log(`a:${datetime(0)}`)
// console.log(`b:${datetime(1)}`)
// console.log(Date.parse(datetime(1)))
// console.log(`a>b: ${Date.parse(datetime(1))>Date.parse(datetime(0))}`)
// console.log(`a>b: ${new Date(datetime(1)).getTime>new Date(datetime(0)).getTime}`)
// console.log(datetime(1).ms)