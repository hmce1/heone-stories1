import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username as string },
        });

        if (!admin) {
          return null;
        }

        // Check password (handle both hashed and plain text for migration)
        const isPasswordValid =
          await bcrypt.compare(credentials.password as string, admin.password) ||
          credentials.password === admin.password; // Fallback for existing plain text passwords

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: admin.id,
          name: admin.username,
          email: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
