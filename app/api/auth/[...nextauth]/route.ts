import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === "google" && user) {
        const { email } = user;
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email,
              name: user.name,
              role: "USER",
              walletBalance: 5,
            },
          });
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id; // Assign user ID to session if needed
        session.user.email = user.email; // Ensure email is available in session
        session.user.name = user.name; // Ensure name is available in session
        session.user.walletBalance = user.walletBalance;
      }
      return session;
    },
  },
  pages: {
    signIn: "sign-in",
    signOut: "sign-out",
    error: "/auth/error",
  },
};

// For Next.js 13+ App Router, export handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
