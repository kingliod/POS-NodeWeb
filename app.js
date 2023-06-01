const express = require("express");
const sql = require("mssql/msnodesqlv8");
//msnodesqlv8
const path = require("path");

const bcrypt = require("bcrypt");

const { userLoggedIn } = require("./public/loggedinState.js");

const app = express();
app.use(express.json());

app.use("/", require("./routes/jobOrderRoutes"));
app.use(express.static(path.join(__dirname, "public")));

// const connectionString =
//   "server=localhost;Database=jo;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
// const query = "SELECT * from [jo].[dbo].[joborders]";

// app.get("/data", (req, res) => {
//   sql.query(connectionString, query, (err, rows) => {
//     console.log(rows);
//     if (err) {
//       console.error(err);
//       res.status(500).send("Error retrieving data from database");
//     } else {
//       res.json({ rows: rows });
//     }
//   });
// });

const configJO = {
  server: "localhost\\SQLEXPRESS2014",
  user: "sa",
  password: "zankpos45@2023",
  database: "jo",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

const configPO = {
  server: "localhost\\SQLEXPRESS2014",
  user: "sa",
  password: "zankpos45@2023",
  database: "po",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

// Function to hash the password
const hashPassword = async (password) => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // const saltRounds = 10;

    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Return the hashed password
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

// const getHashPassword = async (usern) => {
//   fetch("/getUserCredentials")
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach((row) => {
//         if (usern == row.username) {
//           return row.password;
//         }
//       });
//     })
//     .catch((error) => console.error(error));
// };

// Handle POST request to save form data
app.post("/saveUserCredentials", async (req, res) => {
  try {
    const pool = await sql.connect(configJO);

    // const saltRounds = 10;

    const { username, password, createdAt, updatedAt, email } = req.body;

    console.log("Received data: ", req.body);

    // Hash the password
    const hashedPassword = await hashPassword(password);

    const request = pool.request();
    request.input("username", sql.VarChar, username);
    request.input("password", sql.VarChar, hashedPassword);
    request.input("createdAt", sql.VarChar, createdAt);
    request.input("updatedAt", sql.VarChar, updatedAt);
    request.input("email", sql.VarChar, email);

    const result = await request.query(`
    INSERT INTO [jo].[dbo].[users] (username, password, createdAt, updatedAt, email)
    VALUES (@username, @password, @createdAt, @updatedAt, @email)
    `);

    const getResult = await request.query(
      `select id, username, password, createdAt, updatedAt, email from [jo].[dbo].[users] where username = @username`
    );

    const obj1 = getResult.recordset;

    const responseObj = { user: obj1 };

    const combinedArray = [];

    const object1Rows = responseObj.user;

    const maxLength = Math.max(object1Rows.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < object1Rows.length) {
        combinedArray.push(object1Rows[i]);
      }
    }

    console.log(combinedArray);
    console.log("Saved to the jo database users table!");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving Users data:", error);
    res.sendStatus(500);
  }
});

app.post("/saveUserLoggedInData", async (req, res) => {
  try {
    const pool = await sql.connect(configJO);

    const { userID, uname, passw, logState } = req.body;

    console.log("Received data: ", req.body);

    const getPassword = sql.query(
      `select password from [jo].[dbo].[users] where username = ${uname}`
    );

    bcrypt.compare(passw, getPassword, function (err, isMatch) {
      if (err) {
        console.error(err);
        return;
      }

      if (isMatch) {
        // Passwords match
        console.log("Password is correct");
        userLoggedIn.userId = userID;
        userLoggedIn.username = uname;
        userLoggedIn.password = row.password;
        userLoggedIn.loginState = logState;

        console.log("Logged In!\n");
        console.log("Log in Details:\n" + JSON.stringify(userLoggedIn));
        res.json(req.body);
        // Continue with appropriate actions
      } else {
        // Passwords do not match
        console.log("Password is incorrect");
        // Handle invalid password
      }
    });
  } catch (error) {
    console.error("Error saving Users data:", error);
    res.sendStatus(500);
  }
});

app.post("/saveJOData", async (req, res) => {
  try {
    const pool = await sql.connect(configJO);

    const {
      joborder_id,
      jodate,
      contactperson,
      transpo,
      remarks,
      deliveryrems,
      status,
      customControlAutosizing1,
      createdAt,
      updatedAt,
      technical,
      customer_name,
      address,
      telephone,
      customer_type,
      email,
      terms,
    } = req.body;

    console.log("Received data: ", req.body);

    const request2 = pool.request();
    request2.input("date", sql.VarChar, createdAt);
    request2.input("customer_name", sql.VarChar, customer_name);
    request2.input("address", sql.VarChar, address);
    request2.input("telephone", sql.BigInt, telephone);
    request2.input("customer_type", sql.VarChar, customer_type);
    request2.input("email", sql.VarChar, email);
    request2.input("terms", sql.VarChar, terms);

    const result2 = await request2.query(`
    INSERT INTO [jo].[dbo].[customer_erp] (date_time, customer_name,
      address,
      telephone_no,
      type,
      email,
      terms)
    VALUES (@date, @customer_name,
      @address,
      @telephone,
      @customer_type,
      @email,
      @terms)
    `);

    console.log("Saved to the jo database customer_erp table!");

    const request = pool.request();
    request.input("joborder_id", sql.VarChar, joborder_id);
    request.input("date", sql.VarChar, jodate);
    request.input("contactPerson", sql.VarChar, contactperson);
    request.input("transportForMoney", sql.Decimal(10, 2), transpo);
    request.input("remarks", sql.VarChar, remarks);
    request.input("deliveryRemarks", sql.VarChar, deliveryrems);
    request.input("status", sql.VarChar, status);
    request.input("permitIssue", sql.VarChar, customControlAutosizing1);
    request.input("createdAt", sql.VarChar, createdAt);
    request.input("updatedAt", sql.VarChar, updatedAt);
    request.input("customer_name", sql.VarChar, customer_name);
    request.input("userid", sql.Int, userLoggedIn.userId);
    request.input("technical", sql.VarChar, technical);

    const result = await request.query(`
    INSERT INTO [jo].[dbo].[joborders] (joborder_id, date, contactPerson, transportForMoney, remarks, deliveryRemarks, status, permitIssue, createdAt, updatedAt, customer_id, employee_id, user_id, technical)
    VALUES (@joborder_id, @date, @contactPerson, @transportForMoney, @remarks, @deliveryRemarks, @status, @permitIssue, @createdAt, @updatedAt, (SELECT id FROM [jo].[dbo].[customer_erp] where customer_name = @customer_name), (SELECT id FROM [jo].[dbo].[employee_listing] where full_name = @technical), @userid, @technical)
    `);

    console.log("Saved to the jo database joborders table!");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving Job Order data:", error);
    res.sendStatus(500);
  }
});

app.post("/savePOData", async (req, res) => {
  try {
    const pool = await sql.connect(configPO);

    const {
      podate,
      customer_name,
      pullout,
      problem,
      action,
      recommendation,
      status,
    } = req.body;

    console.log("Received data: ", req.body);

    const request = pool.request();
    // request.input("pullout_id", sql.VarChar, pullout_id);
    request.input("date", sql.VarChar, podate);
    request.input("customer_name", sql.VarChar, customer_name);
    request.input("pullout", sql.VarChar, pullout);
    request.input("problem", sql.VarChar, problem);
    request.input("action", sql.VarChar, action);
    request.input("recommendation", sql.VarChar, recommendation);
    request.input("status", sql.VarChar, status);

    const result = await request.query(`
    INSERT INTO [po].[dbo].[pullouts] (date, customer, pullout_by, problem, action, recommendation, status)
    VALUES (@date, @customer_name, @pullout, @problem, @action, @recommendation, @status)
    `);

    // console.log(result.recordset);
    console.log("Saved to the po database pullouts table!");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving Pullout data:", error);
    res.sendStatus(500);
  }
});

app.post("/saveSubPOData", async (req, res) => {
  try {
    const pool = await sql.connect(configPO);

    const {
      subPO_id,
      type_of_machine,
      brand_model,
      serial_no,
      min,
      remarks,
      with_permit,
    } = req.body;

    console.log("Received data: ", req.body);

    const request = pool.request();
    request.input("subPO_id", sql.Int, subPO_id);
    request.input("type_of_machine", sql.VarChar, type_of_machine);
    request.input("brand_model", sql.VarChar, brand_model);
    request.input("serial_no", sql.VarChar, serial_no);
    request.input("min", sql.VarChar, min);
    request.input("remarks", sql.VarChar, remarks);
    request.input("with_permit", sql.VarChar, with_permit);

    const result = await request.query(`
    INSERT INTO [po].[dbo].[sub_pullouts] (pullout_id, type_of_machine,
      brand_model,
      serial_no,
      min,
      remarks,
      with_permit)
    VALUES (@subPO_id, @type_of_machine,
      @brand_model,
      @serial_no,
      @min,
      @remarks,
      @with_permit)
    `);

    // console.log(result.recordset);
    console.log("Saved to the po database sub_pullouts table!");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error adding sub Pullout data!", error);
    res.sendStatus(500);
  }
});

app.post("/changePOStatus", async (req, res) => {
  try {
    const pool = await sql.connect(configPO);

    const { poStatus, po_id } = req.body;

    console.log("Received data: ", req.body);

    const request = pool.request();
    request.input("poStatus", sql.VarChar, poStatus);
    request.input("po_id", sql.Int, po_id);

    const result = await request.query(`
    UPDATE [po].[dbo].[pullouts] SET status = @poStatus WHERE pullout_id = @po_id
    `);

    // console.log(result.recordset);
    console.log("Changed Pullout Status!");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error changing Pullout Status!", error);
    res.sendStatus(500);
  }
});

// Handle GET request to retrieve form data
app.get("/logout", async (req, res) => {
  try {
    // const { uname, passw, logState } = req.body;

    // console.log("Received data: ", req.body);

    userLoggedIn.username = "";
    userLoggedIn.password = "";
    userLoggedIn.loginState = false;

    console.log("Log In Details:\n" + JSON.stringify(userLoggedIn));
    console.log("Logged Out!\n");
    res.redirect("/");
  } catch (error) {
    console.error("Error saving Users data:", error);
    res.sendStatus(500);
  }
});

app.get("/getUserCredentials", async (req, res) => {
  try {
    await sql.connect(configJO);

    const result = await sql.query(
      "SELECT id, username, password FROM [jo].[dbo].[users]"
    );

    const obj1 = result.recordset;

    const responseObj = { user: obj1 };

    const combinedArray = [];

    const object1Rows = responseObj.user;

    const maxLength = Math.max(object1Rows.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < object1Rows.length) {
        combinedArray.push(object1Rows[i]);
      }
    }

    console.log(combinedArray);

    res.json(combinedArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  }
});

app.get("/getUserLoggedInData", async (req, res) => {
  try {
    let obj1 = JSON.stringify(userLoggedIn);

    const obj2 = JSON.parse(obj1);

    // console.log(obj2);

    const combinedArray = [];
    combinedArray.push(obj2);

    console.log(combinedArray);

    res.json(combinedArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  }
});

app.get("/getJOData", async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(configJO);

    // Query the database
    const result = await sql.query(
      "SELECT joborder_id, date, status, customer_id, technical FROM [jo].[dbo].[joborders]"
    );

    const result2 = await sql.query(`
    SELECT id as custom_id, customer_name, address FROM [jo].[dbo].[customer_erp]  
    `);

    const obj1 = result.recordset;
    const obj2 = result2.recordset;

    const responseObj = {
      jo: obj1,
      customer: obj2,
    };

    const combinedArray = [];

    const object1Rows = responseObj.jo;
    const object2Rows = responseObj.customer;

    const maxLength = Math.max(object1Rows.length, object2Rows.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < object1Rows.length && i < object2Rows.length) {
        combinedArray.push({ ...object1Rows[i], ...object2Rows[i] });
      } else if (i < object1Rows.length) {
        combinedArray.push(object1Rows[i]);
      } else if (i < object2Rows.length) {
        combinedArray.push(object2Rows[i]);
      }
    }

    console.log(combinedArray);
    // console.log(userLoggedIn);
    res.json(combinedArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  }
  // finally {
  //   // Close the database connection
  //   sql.close();
  // }
});

app.get("/getPOData", async (req, res) => {
  try {
    await sql.connect(configPO);

    const result = await sql.query(
      "SELECT pullout_id, date, customer, pullout_by, problem, action, recommendation, status FROM [po].[dbo].[pullouts]"
    );

    const obj1 = result.recordset;

    const responseObj = { po: obj1 };

    const combinedArray = [];

    const object1Rows = responseObj.po;

    const maxLength = Math.max(object1Rows.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < object1Rows.length) {
        combinedArray.push(object1Rows[i]);
      }
    }

    // console.log(combinedArray);

    // console.log(JSON.stringify(result));

    res.json(combinedArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  }
});

app.get("/getEmployeeListing", async (req, res) => {
  try {
    await sql.connect(configJO);

    const result = await sql.query(
      "SELECT id, full_name FROM [jo].[dbo].[employee_listing]"
    );

    const obj1 = result.recordset;

    const responseObj = { user: obj1 };

    const combinedArray = [];

    const object1Rows = responseObj.user;

    const maxLength = Math.max(object1Rows.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < object1Rows.length) {
        combinedArray.push(object1Rows[i]);
      }
    }

    // console.log(combinedArray);

    res.json(combinedArray);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching data from the database.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  const user = "therock";
  console.log(getHashPassword(user));
});
