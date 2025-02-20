require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// const authRoutes = require("./routes/authRoutes");
// const gameRoutes = require("./routes/gameRoutes");
// const walletRoutes = require("./routes/walletRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");
// 

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// app.use("/api/auth", authRoutes);
// app.use("/api/games", gameRoutes);
// app.use("/api/wallet", walletRoutes);
app.use("/api/razorpay", razorpayRoutes);

module.exports = app;
