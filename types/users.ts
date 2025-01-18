import { z } from "zod";
import { userSchema } from "../lib/validators";

export type Users = z.infer<typeof userSchema> & {
  userId: "string";
  name: "string";
  phoneNumber: "string";
  walletBalance: 5; // Current wallet balance
  role: "string"; // e.g., "admin", "developer", "analyst", "user"
  createdAt: "date";
  lastLogin: "date";
};
