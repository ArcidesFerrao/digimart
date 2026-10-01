import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth.config";
import { db as prisma } from "./prisma";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          whatsapp: user.whatsapp,
          avatar: user.avatar,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.avatar = user.avatar;
        token.isVerified = user.isVerified;
        token.isAdmin = user.isAdmin;
        token.whatsapp = (user as typeof user & { whatsapp: string | null }).whatsapp;
      }
      if (trigger === "update" && session?.isVerified !== undefined) {
      token.isVerified = session.isVerified;
    }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string | null;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.whatsapp = token.whatsapp as string | null;
      }
      return session;
    },
  },
});
