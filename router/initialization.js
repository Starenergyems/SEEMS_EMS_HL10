/* before app runing should be check
* Create default database
* doc
* 
*
*
*/

const { database } = require("./config.js");
const DB_URL = `http://${database.host}:${database.port}/`;
const DB_LOGIN = `${database.username}:${database.password}`;
const CREDENTIALS = Buffer.from(DB_LOGIN).toString('base64');
const AUTHORIZATION = "Basic " + CREDENTIALS;

// function dbcheck() {
    
// }

async function createdb(name) {
    const URL = `${DB_URL}/${name}`;
    try {
        const response = await fetch(URL, {
            method: "PUT",
            headers: { Authorization: AUTHORIZATION },
            credentials: "include",
            });
            if (response.ok) {
                console.log(`Database '${name}' created successfully.`);
            } else {
                console.error(`Failed to create database '${name}'.`);
                console.error(`Status: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('An error occurred while creating the database:', error);
        }
    }

createdb("testttt")

// for ()