const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.placeBet = async (req, res) => {
  const { userId, gameId, amount } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    // Deduct balance and create bet entry
    await prisma.wallet.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });

    const bet = await prisma.bet.create({
      data: { userId, gameId, amount },
    });

    res.status(200).json({ message: "Bet placed successfully", bet });
  } catch (error) {
    res.status(500).json({ error: "Failed to place bet" });
  }
};
