import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      _id: mongoose.Schema.Types.ObjectId;
      name: String;
      email: String;
      image: String;
      isAdmin: boolean;
    };
  }
}
