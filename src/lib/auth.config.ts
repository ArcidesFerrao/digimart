import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth }) {
      // usado só no middleware
      return !!auth;
    },
  },
  providers: [],
};