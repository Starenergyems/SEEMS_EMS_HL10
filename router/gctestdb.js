const { doc } = require("prettier");

require("dotenv").config(); // 主程式有所以單獨執行才需要有

const ENV = process.env;
host= ENV.DB_HOST, port= ENV.DB_PORT, username= ENV.DB_USERNAME, password= ENV.DB_PASSWORD
// ;
// let headers = {
//   "Content-Type": "application/json",
//   Authorization: AUTHORIZATION,
// };
//account/_all_docs

// 選擇要哪種操作 增刪查改
// 增可以增db docput 
// 刪可以刪db doc
// 查可以查db doc 特定doc 全doc account/_all_docs
// 改 特定doc 或 一群


async function httpRequest(url, method, data = null) {
  method = method.toUpperCase()
  console.log(method)
  // if method === "post" |
  const options = {
    method: method.toUpperCase(),
    headers: headers,
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
    
  };
  console.log(method)
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`${url} ${method} request failed, status ${response.status}`);
    }
    console.log(await response.json())
    return await response.json();
} catch (error) {
  console.error(`Error: ${error.message}`);
}
}

res = httpRequest(url = "http://192.168.1.12:5984/account/_all_docs?include_docs=true", method="get", headers = {"Content-Type": "application/json",
 Authorization: "Basic " + btoa("admin:ems45877096")})
console.log(res)


async function ajax(url, method, Authorization, body=""){
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: Authorization,
      },
      credentials: "include",
      
    });
    if (!response.ok) {
      throw new Error(`${url} ${method} request failed, status ${response.status}`);
    }
    console.log(await response.json())
    return await response.json();
} catch (error) {
  console.error(`Error: ${error.message}`);
}
}
// res = ajax(url = "http://192.168.1.12:5984/account/_all_docs/", method="get", Authorization="Basic " + btoa("admin:ems45877096"))
// console.log(res)

async function couchdb(operation, database, document= "", api, host= ENV.DB_HOST, port= ENV.DB_PORT, username= ENV.DB_USERNAME, password= ENV.DB_PASSWORD,){
  const DB_URL = `http://${host}:${port}/`;
  const AUTHORIZATION = "Basic " + btoa(`${username}:${password}`)
}