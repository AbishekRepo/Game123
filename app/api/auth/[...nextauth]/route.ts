import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// For Next.js 13+ App Router, export handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
