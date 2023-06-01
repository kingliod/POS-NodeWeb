const express = require("express");
const router = express.Router();
const {
  loginPage,
  signupPage,
  jobOrderListing,
  jobOrderForm,
  pullOutListing,
  pulloutForm,
  // getJobOrders,
  // createJobOrder,
  // deleteJobOrder,
} = require("../controllers/jobOrderControllers");
// const path = require("path");

router.route("/").get(loginPage);

router.route("/signup").get(signupPage);

router.route("/job-order-listing").get(jobOrderListing);

router.route("/job-order-form").get(jobOrderForm);

router.route("/pull-out-listing").get(pullOutListing);

router.route("/pull-out-form").get(pulloutForm);

// router.route("/createJO").get(getJobOrders).post(createJobOrder);

// router.route("/:id").get(deleteJobOrder);

module.exports = router;
