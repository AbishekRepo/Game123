import { z } from "zod";

export const userSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().min(8).max(15),
  password: z.string().min(8).max(15),
  walletBalance: z.number().min(0),
  role: z.enum(["admin", "developer", "analyst", "user"]),
  lastLogin: z.date(),
});
