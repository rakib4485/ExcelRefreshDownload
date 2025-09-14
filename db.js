/*const sql = require("mssql");
require("dotenv").config();

// Azure SQL connection config
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: false,
    },
};

async function executeQuery(query) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error("SQL error", err);
        throw err;
    }
}

module.exports = { executeQuery };
*/

// db.js
import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

// Azure SQL connection config
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: false,
    },
};

export async function executeQuery(query) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error("SQL error", err);
        throw err;
    }
}
