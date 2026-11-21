const mysql = require("mysql2/promise");

const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missing = required.filter((name) => !process.env[name]);
if(missing.length > 0){
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 50,
    timezone: "Z",
});

module.exports = {pool};