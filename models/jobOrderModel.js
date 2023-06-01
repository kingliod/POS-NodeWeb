const sql = require("mssql");

const createJobOrderModel = async () => {
  try {
    const pool = await sql.connect({
      username: "sa",
      password: "zankpos45@20232",
      database: "jo",
      driver: "msnodesqlv8",
    }); // Replace 'config' with your database connection configuration

    const jobOrderModel = {
      create: async (jobOrderData) => {
        try {
          const request = pool.request();

          // Set the values for each column in the joborder table
          request.input("joborder_id", sql.VarChar, jobOrderData.joborder_id);
          request.input("date", sql.Date, jobOrderData.date);
          request.input(
            "contactPerson",
            sql.VarChar,
            jobOrderData.contactPerson
          );
          request.input(
            "transportForMoney",
            sql.Decimal(10, 2),
            jobOrderData.transportForMoney
          );
          request.input("remarks", sql.VarChar, jobOrderData.remarks);
          request.input(
            "deliveryRemarks",
            sql.VarChar,
            jobOrderData.deliveryRemarks
          );
          request.input("status", sql.VarChar, jobOrderData.status);
          request.input("permitIssue", sql.VarChar, jobOrderData.permitIssue);

          // Execute the SQL query to insert the joborder record into the database
          const result = await request.query(`
            INSERT INTO [jo].[dbo].[joborders] (id,joborder_id, date, contactPerson, transportForMoney, remarks, deliveryRemarks, status, permitIssue)
            VALUES (@joborder_id, @date, @contactPerson, @transportForMoney, @remarks, @deliveryRemarks, @status, @permitIssue)
          `);

          return result.rowsAffected[0] > 0;
        } catch (error) {
          console.error("Error creating job order:", error);
          throw error;
        }
      },
      // Add other CRUD operations as needed
    };

    return jobOrderModel;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

module.exports = createJobOrderModel;
