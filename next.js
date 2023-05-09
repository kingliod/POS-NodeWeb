const sql = require("msnodesqlv8");

const connectionString =
  "server=localhost;Database=jo;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
const query = "SELECT * from [jo].[dbo].[customer_erp]";

sql.query(connectionString, query, (err, rows) => {
  console.log(rows);
});
