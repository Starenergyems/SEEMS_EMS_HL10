const crypto = require("crypto");
const jwtSecretKey = crypto.randomBytes(32).toString("hex");
console.log("Generated JWT Secret Key:", jwtSecretKey);
