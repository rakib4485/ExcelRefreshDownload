const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { executeQuery } = require("./db");
const ExcelJS = require("exceljs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// API endpoint: GET /api/salespoints/download
app.get("/api/salespoints/download", async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();

        // Define multiple queries for each sheet
        const sheetsConfig = [
            {
                name: "SalesPoints_Range1",
                query: `
                    DECLARE @StartRange INT = 10;
                    DECLARE @EndRange INT = (SELECT MAX(SalesPointId) FROM SalesPoints) - 20;

                    DECLARE @MinId INT = FLOOR(RAND() * (@EndRange - @StartRange + 1)) + @StartRange;
                    DECLARE @MaxId INT = @MinId + 10;

                    SELECT TOP 10 *
                    FROM SalesPoints
                    WHERE SalesPointId BETWEEN @MinId AND @MaxId
                    ORDER BY SalesPointId DESC;
                `
            },
            {
                name: "SalesPoints_Range2",
                query: `
                    DECLARE @StartRange INT = 30;
                    DECLARE @EndRange INT = (SELECT MAX(SalesPointId) FROM SalesPoints) - 10;

                    DECLARE @MinId INT = FLOOR(RAND() * (@EndRange - @StartRange + 1)) + @StartRange;
                    DECLARE @MaxId INT = @MinId + 15;

                    SELECT TOP 15 *
                    FROM SalesPoints
                    WHERE SalesPointId BETWEEN @MinId AND @MaxId
                    ORDER BY SalesPointId DESC;
                `
            },
            {
                name: "SalesPoints_All",
                query: `
                    SELECT TOP 50 *
                    FROM SalesPoints
                    ORDER BY SalesPointId DESC;
                `
            }
        ];

        // Loop through each config to create a sheet
        for (const sheet of sheetsConfig) {
            const data = await executeQuery(sheet.query);

            const worksheet = workbook.addWorksheet(sheet.name);

            if (data.length > 0) {
                worksheet.columns = Object.keys(data[0]).map(key => ({
                    header: key,
                    key: key,
                    width: 20
                }));

                data.forEach(row => {
                    worksheet.addRow(row);
                });
            } else {
                worksheet.addRow(["No data found for this sheet"]);
            }
        }

        // Set response headers for download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=SalesPoints_MultiSheet.xlsx"
        );

        // Write Excel to response
        await workbook.xlsx.write(res);
        res.status(200).end();
        console.log("Excel file with multiple sheets sent for download.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error: " + err.message);
    }
});

// Simple test endpoint
app.get('/', (req, res) => {
    res.send("API is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 API server running at http://localhost:${PORT}`);
});
