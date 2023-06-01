const asyncHandler = require("express-async-handler");
const path = require("path");
const { userLoggedIn } = require("../public/loggedinState.js");

const loginPage = asyncHandler(async (req, res) => {
  if (
    userLoggedIn.username == "" &&
    userLoggedIn.password == "" &&
    !userLoggedIn.loginState
  ) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  } else {
    console.log("User already logged in!");
    res.status(204).send();
  }
  // res.sendFile(path.join(__dirname, "../public/index.html"));
});

const signupPage = asyncHandler(async (req, res) => {
  if (
    userLoggedIn.username == "" &&
    userLoggedIn.password == "" &&
    !userLoggedIn.loginState
  ) {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  } else {
    console.log("User already logged in!");
    res.status(204).send();
  }
  // res.sendFile(path.join(__dirname, "../public/signup.html"));
});

const jobOrderListing = asyncHandler(async (req, res) => {
  if (
    userLoggedIn.username != "" &&
    userLoggedIn.password != "" &&
    userLoggedIn.loginState
  ) {
    res.sendFile(path.join(__dirname, "../public/JobOrderListing.html"));
  } else {
    console.log("No user logged in!");
    res.sendFile(path.join(__dirname, "../public/error-404.html"));
    // res.sendStatus(404);
  }
  // res.sendFile(path.join(__dirname, "../public/index.html"));
});

const jobOrderForm = asyncHandler(async (req, res) => {
  if (
    userLoggedIn.username != "" &&
    userLoggedIn.password != "" &&
    userLoggedIn.loginState
  ) {
    res.sendFile(path.join(__dirname, "../public/JobOrderForm.html"));
  } else {
    console.log("No user logged in!");
    res.sendFile(path.join(__dirname, "../public/error-404.html"));
  }
  // res.sendFile(path.join(__dirname, "../public/JobOrderForm.html"));
});

const pullOutListing = asyncHandler(async (req, res) => {
  if (
    userLoggedIn.username != "" &&
    userLoggedIn.password != "" &&
    userLoggedIn.loginState
  ) {
    res.sendFile(path.join(__dirname, "../public/PulloutListing.html"));
  } else {
    console.log("No user logged in!");
    res.sendFile(path.join(__dirname, "../public/error-404.html"));
  }
  // res.sendFile(path.join(__dirname, "../public/tables.html"));
});

const pulloutForm = asyncHandler(async (req, res) => {
  if (
    userLoggedIn.username != "" &&
    userLoggedIn.password != "" &&
    userLoggedIn.loginState
  ) {
    res.sendFile(path.join(__dirname, "../public/PulloutForm.html"));
  } else {
    console.log("No user logged in!");
    res.sendFile(path.join(__dirname, "../public/error-404.html"));
  }
  // res.sendFile(path.join(__dirname, "../public/PulloutForm.html"));
});

// const getJobOrders = asyncHandler(async (req, res) => {
//   res.status(200).json({ message: "Get Job Order" });
// });

// const createJobOrder = asyncHandler(async (req, res) => {
//   console.log("Job Order Values\n", req.body);
//   const {
//     date,
//     contactPerson,
//     transpo,
//     status,
//     remarks,
//     deliveryRemarks,
//     isIssued,
//   } = req.body;

//   const jobOrder = await create({
//     date,
//     technical,
//     contactPerson,
//     transpo,
//     status,
//     remarks,
//     deliveryRemarks,
//     isIssued,
//   });
//   res.status(200).json(jobOrder);
// });

// const deleteJobOrder = asyncHandler(async (req, res) => {
//   res.status(200).json({ message: `Delete Job Order for ${req.params.id}` });
// });

module.exports = {
  loginPage,
  signupPage,
  jobOrderListing,
  jobOrderForm,
  pullOutListing,
  pulloutForm,
  // getJobOrders,
  // createJobOrder,
  // deleteJobOrder,
};
