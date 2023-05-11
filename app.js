const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const sql = require("msnodesqlv8");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const connectionString =
  "server=localhost;Database=jo;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const query = "SELECT * from [jo].[dbo].[pullout_listings]";

app.get("/", (req, res) => {
  sql.query(connectionString, query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.render("index", { rows });
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
