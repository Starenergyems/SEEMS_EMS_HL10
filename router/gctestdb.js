////////////////////////////////////////////////////////////////////////////////////////
// From env read database config.
require("dotenv").config(); // 主程式有所以單獨執行才需要有
const HOST= process.env.DB_HOST;
const PORT= process.env.DB_PORT;
const USERNAME= process.env.DB_USERNAME;
const PASSWORD= process.env.DB_PASSWORD;
const DB_URL = `http://${HOST}:${PORT}`
// console.log(DB_URL)
////////////////////////////////////////////////////////////////////////////////////////
// function to get post put delete.
// 選擇要哪種操作 增刪查改
// 增可以增db docput 
// 刪可以刪db doc
// 查可以查db doc 特定doc 全doc account/_all_docs
// 改 特定doc 或 一群

async function httpRequest(url, method, data=null) {
  console.log(url)
  method = method.toUpperCase();
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Basic " + btoa(`${USERNAME}:${PASSWORD}`)
  };
  let options = {
    method: method,
    headers: headers,
    credentials: "include"
  };

  if (data !== null) {
    options["body"] = JSON.stringify(data)
  };
  console.log()

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.log("oops!!")
      throw new Error(`${method} request failed, status ${response.status}`);
    };
    data = await response.json();
    // console.log(data)
    let temp = {}
    if (data.hasOwnProperty("total_rows")) {
      for (let i = 0; i < data["total_rows"]; i++ ) {
        for (let key in data["rows"][i]["doc"]) {
          if (data["rows"][i]["doc"].hasOwnProperty(key) && key !== "_id" && key !== "_rev") {
            temp[key] = data["rows"][i]["doc"][key]
          }
        }
      }
    } else {
      for (let key in data) {
        temp[key] = data[key]
      }
    }
  return temp
} catch (error) {
  console.error(`Error: ${error.message}`);
}
}




// router = post login



const selector ={
  "selector": {
     "mail": {
        "$eq": "gc.zhuang@hdrenewables.com"
     }
  }
}

async function create(database, doc=null){
  if (doc === null) {
  res = await httpRequest(url = `${DB_URL}/${database}/`, method="PUT")
  } else {
      res = await httpRequest(url = `${DB_URL}/${database}/${doc}`, method="PUT")
  }
}
// create(database="SSS")

async function read(database, doc="_all_docs", data=null){
  if (data !== null) {
    res = await httpRequest(url = `${DB_URL}/${database}/${doc}?include_docs=true`, method="POST", data=data)
  } else {
    res = await httpRequest(url = `${DB_URL}/${database}/${doc}?include_docs=true`, method="GET")
  }
  console.log(res)
  return res
}

async function update(database, doc, data){
  res = await httpRequest(url = `${DB_URL}/${database}/${doc}`, method="PUT", data=data)
  return res
}

async function del(database, doc=null){
  res = await httpRequest(url = `http://192.168.1.12:5984/${database}/${doc}`, method="DELETE", data=data)
  return res
}

rr = read("account", "CONFIG")
console.log(rr)
// find("klhj")
// 操作在function內部才不會有promise問題

// rr = find("account", "CONFIG")
// rr = find("account", "SE0012")
// rr = read("account", "_find", selector)

// rr = find("account", "_find")

// async function login(user, password) {
//   判斷user存不存在
  
// }

////////////////////////////////////////////////////////////////////////////////////////
// database ope0ration.
// async function couchdb(operation, database, document= null){
//   const DB_URL = `http://${host}:${port}/`;
//   const AUTHORIZATION = "Basic " + btoa(`${username}:${password}`)

//   查詢doc

//   根據email查詢
// }

////////////////////////////////////////////////////////////////////////////////////////
// NOTE 1.
// method === "POST" || method === "PUT" || method === "DELETE" 這個才對
// method === "POST" || "PUT" || "DELETE" → True都會進入執行。
/*
create doc or document

check dataset alldoc doc specify doc 
{
  "selector": {
     "_id": {
        "$gt": null
     }
  }
}
verify is pair

delete use put pass data about database or 



function Couchdb(host, port, username, password, database) {
  this.host = host;
  this.port = port;
  this.username = username;
  this.password = password;
  this.database = database;
}

create database or doc
// Add a method to the prototype of the constructor function
Couchdb.prototype.Create = function() {
  create document 
  console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
}

// Instantiate objects using the 'new' keyword
let person1 = new Person('John', 30);
let person2 = new Person('Alice', 25);

// Call the method on the objects
person1.sayHello(); // Output: Hello, my name is John and I am 30 years old.
person2.sayHello(); // Output: Hello, my name is Alice and I am 25 years old.
*/


// Config 讀 and 寫
// account
