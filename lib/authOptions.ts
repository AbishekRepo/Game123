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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account }: { user: any; account: any }) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.walletBalance = user.walletBalance; // Adding walletBalance to token
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user }: { session: any; user: any }) {
      if (user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            walletBalance: user.walletBalance,
          },
        };
        // session.user.id = user.id; // Assign user ID to session if needed
        // session.user.email = user.email; // Ensure email is available in session
        // session.user.name = user.name; // Ensure name is available in session
        // session.user.walletBalance = user.walletBalance;
      }
      return session;
    },
  },
  pages: {
    signIn: "sign-in",
    signOut: "sign-out",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
