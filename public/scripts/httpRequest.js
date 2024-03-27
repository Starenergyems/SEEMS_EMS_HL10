// Use fetch to request from ChatGPT, modify callback.
function httpRequest(method, url, headers = null, payload = null) {
    fetch(url, {
        method: method,
        headers: headers !== null ? JSON.stringify(headers) :
            {
                'Content-Type': 'application/json'
            },
        credentials: "include",
        body: payload !== null ? JSON.stringify(payload) : null
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP request failed with status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(`Response: ${data.response}`);
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}

//////////////////////////////////////////////////////////////////////////////

// Use fetch to request from ChatGPT.
// function httpRequest(method, url, callback, payload = null) {
//     fetch(url, {
//         method: method,
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: payload !== null ? JSON.stringify(payload) : null
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('HTTP request failed with status ' + response.status);
//         }
//         return response.json();
//     })
//     .then(data => {
//         callback(null, data);
//     })
//     .catch(error => {
//         callback(error, null);
//     });
// }
// Example usage:
// var url = 'https://api.example.com/data';
// httpRequest('GET', url, function (error, response) {
//     if (error) {
//         console.error('Error:', error.message);
//     } else {
//         console.log('Response:', response);
//     }
// });

const URL = `http://192.168.1.10:5984`
const CREDENTIALS = Buffer.from("admin:ems45877096").toString('base64');
const AUTHORIZATION = "Basic " + CREDENTIALS;

const headers = { Authorization: AUTHORIZATION },
            

httpRequest