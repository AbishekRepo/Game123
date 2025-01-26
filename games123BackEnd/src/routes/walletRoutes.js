const express = require("express");
const { addFunds } = require("../controllers/walletController");

const router = express.Router();

router.post("/add-funds", addFunds);

module.exports = router;
