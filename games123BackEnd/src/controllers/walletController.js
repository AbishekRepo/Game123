const Razorpay = require("razorpay");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.addFunds = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};
