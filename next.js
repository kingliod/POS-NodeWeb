const sql = require("msnodesqlv8");

const connectionString =
  "server=localhost;Database=jo;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const query = "SELECT * from [jo].[dbo].[pullout_listings]";

sql.query(connectionString, query, (err, rows) => {
  console.log(rows);
});
