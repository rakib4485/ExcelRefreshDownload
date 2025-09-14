const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { executeQuery } = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// API endpoint: GET /api/salespoints
app.get("/api/salespoints", async (req, res) => {
    try {
        const query = `
            DECLARE @StartRange INT = 20;
            DECLARE @EndRange INT = (SELECT MAX(SalesPointId) FROM SalesPoints) - 10;

            -- Generate a random MinId in the range [@StartRange, @EndRange]
            DECLARE @MinId INT = FLOOR(RAND() * (@EndRange - @StartRange + 1)) + @StartRange;

            -- Define MaxId as MinId + some range (e.g., 10)
            DECLARE @MaxId INT = @MinId + 10;

            -- Get top 10 rows within that random range
            SELECT TOP 10 *
            FROM SalesPoints
            WHERE SalesPointId BETWEEN @MinId AND @MaxId
            ORDER BY SalesPointId DESC;
        `;

        const data = await executeQuery(query);
        console.log("API Called")
        res.json(data);
    } catch (err) {
        res.status(500).send("Server error: " + err.message);
    }
});

app.get('/', async (req, res) => {
    res.send("API is running...")
})

app.listen(PORT, () => {
    console.log(`🚀 API server running at http://localhost:${PORT}`);
});
