import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type Credentials = {
  username?: string;
  password?: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = credentials as Credentials;
        if (!creds?.username || !creds?.password) {
          return null;
        }

        const username = creds.username.toLowerCase();
        const password = creds.password;

        try {
          const user = await prisma.user.findUnique({
            where: { username },
          });

          if (!user || !user.isActive) {
            return null;
          }

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) {
            return null;
          }

          // Return only plain strings
          return {
            id: user.id,
            name: user.username,
            role: user.role as string,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/bible-college/portal/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// Auth helpers
export async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/bible-college/portal/login");
  }
  return session;
}

export async function requireTeacher() {
  const session = await auth();
  if (!session || session.user.role !== "TEACHER") {
    redirect("/bible-college/portal/login");
  }
  return session;
}

export async function requireStudent() {
  const session = await auth();
  if (!session || session.user.role !== "STUDENT") {
    redirect("/bible-college/portal/login");
  }
  return session;
}

export async function requireAnyRole() {
  const session = await auth();
  if (!session) redirect("/bible-college/portal/login");
  return session;
}