const express = require("express");
const sql = require("msnodesqlv8");
const path = require("path");

const app = express();

const connectionString =
  "server=localhost;Database=jo;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const query = "SELECT * from [jo].[dbo].[joborders]";

app.use(express.static(path.join(__dirname, "public")));

app.get("/data", (req, res) => {
  sql.query(connectionString, query, (err, rows) => {
    console.log(rows);
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json({ rows: rows });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
