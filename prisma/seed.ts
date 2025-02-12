import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.bet.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: UserRole.ADMIN,
      walletBalance: 1000.0,
    },
    {
      name: "Test User",
      email: "user@example.com",
      password: await bcrypt.hash("user123", 10),
      role: UserRole.USER,
      walletBalance: 500.0,
    },
    {
      name: "Developer",
      email: "dev@example.com",
      password: await bcrypt.hash("dev123", 10),
      role: UserRole.DEVELOPER,
      walletBalance: 750.0,
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
