import bcryptjs from "bcryptjs";
import User from "@/models/User";
import db from "@/utils/db";
import NextAuth, { Awaitable } from "next-auth";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import mongoose from "mongoose";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) {
        token._id = user._id;
      }
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?._id) {
        session.user._id = token._id;
      }
      if (token?.isAdmin) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: "f",
            isAdmin: user.isAdmin,
          };
        }
        return null;
        throw new Error("Invalid email or password");
      },
    }),
  ],
};
export default NextAuth(authOptions);
