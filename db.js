const sql = require("mssql");
require("dotenv").config();

// Azure SQL connection config
const config = {
    user: "sales360_qa_usr",
    password: "C11o$4T0OwROx&TH=0+!",
    server: "sql-msfsax04-01-shared-qa.database.windows.net",
    database: sqldb-msfeax04-61-sales360-qa,
    options: {
        encrypt: "true" === "true",
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
