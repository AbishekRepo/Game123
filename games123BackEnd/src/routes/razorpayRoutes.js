const express = require("express");
const { createOrder, OrderValidate } = require("../controllers/razorpayController");

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/order-validate", OrderValidate);

module.exports = router;
