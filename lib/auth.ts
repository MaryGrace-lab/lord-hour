import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkLoginRateLimit, recordLoginAttempt } from "@/lib/login-security";
import { extractIpFromRequest } from "@/lib/ip";
import { Role } from "@prisma/client";

type Credentials = {
  username?: string;
  password?: string;
};

const isProd = process.env.NODE_ENV === "production";

// ─── Session lifetime ───
// 8 hours absolute session. A user must re-authenticate after that.
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
// Refresh the session token (sliding window) at most once every hour.
const SESSION_UPDATE_AGE_SECONDS = 60 * 60;
// Re-check role + isActive in the DB at most once every 5 minutes.
const ROLE_RECHECK_INTERVAL_MS = 5 * 60 * 1000;

// ─── Cookie names ───
const SESSION_COOKIE = isProd
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";
const CSRF_COOKIE = isProd
  ? "__Host-next-auth.csrf-token"
  : "next-auth.csrf-token";
const CALLBACK_COOKIE = isProd
  ? "__Secure-next-auth.callback-url"
  : "next-auth.callback-url";

const VALID_ROLES: Role[] = [Role.ADMIN, Role.TEACHER, Role.STUDENT];

function isRole(value: unknown): value is Role {
  return typeof value === "string" && VALID_ROLES.includes(value as Role);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },

  cookies: {
    sessionToken: {
      name: SESSION_COOKIE,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
        maxAge: SESSION_MAX_AGE_SECONDS,
      },
    },
    csrfToken: {
      name: CSRF_COOKIE,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
    callbackUrl: {
      name: CALLBACK_COOKIE,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const creds = credentials as Credentials;
        if (!creds?.username || !creds?.password) {
          return null;
        }

        const username = creds.username.toLowerCase().trim();
        const password = creds.password;
        const ip = extractIpFromRequest(request as Request);

        // 1. Authoritative rate-limit check
        const rateLimit = await checkLoginRateLimit(username, ip);
        if (!rateLimit.allowed) {
          await recordLoginAttempt(username, ip, false);

          const msg =
            rateLimit.reason === "email"
              ? `Too many failed attempts. Try again in ${rateLimit.minutesRemaining} minute(s).`
              : `Too many attempts from your network. Try again in ${rateLimit.minutesRemaining} minute(s).`;

          throw new Error(msg);
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username },
          });

          if (!user || !user.isActive) {
            await recordLoginAttempt(username, ip, false);
            return null;
          }

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) {
            await recordLoginAttempt(username, ip, false);
            return null;
          }

          await recordLoginAttempt(username, ip, true);

          // user.role is already a Prisma `Role` enum — no cast needed.
          return {
            id: user.id,
            name: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          await recordLoginAttempt(username, ip, false);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, seed the token from the authenticated user.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roleCheckedAt = Date.now();
        return token;
      }

      // Periodically re-validate role + isActive against the database so
      // demotions / deactivations take effect without waiting for expiry.
      const lastCheck =
        typeof token.roleCheckedAt === "number" ? token.roleCheckedAt : 0;
      if (
        typeof token.id === "string" &&
        Date.now() - lastCheck > ROLE_RECHECK_INTERVAL_MS
      ) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: { role: true, isActive: true },
          });

          if (!dbUser || !dbUser.isActive) {
            // Returning null invalidates the session.
            return null;
          }

          token.role = dbUser.role;
          token.roleCheckedAt = Date.now();
        } catch (err) {
          // Don't log everyone out on a transient DB error — keep the
          // existing token and try again next time.
          console.error("JWT role refresh failed:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        // Narrow to the Prisma Role enum. Fallback to STUDENT only if the
        // token was somehow corrupted.
        session.user.role = isRole(token.role) ? token.role : Role.STUDENT;
      }
      return session;
    },
  },

  pages: {
    signIn: "/bible-college/portal/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  trustHost: true,
});

// ─── Auth helpers ───
// These call `redirect()` which throws a special error. They are only valid
// inside Server Components and Server Actions — NOT inside Route Handlers.
// Route Handlers must check `await auth()` and return 401/403 manually.

export async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/bible-college/portal/login");
  }
  return session;
}

export async function requireTeacher() {
  const session = await auth();
  if (!session || session.user.role !== Role.TEACHER) {
    redirect("/bible-college/portal/login");
  }
  return session;
}

export async function requireStudent() {
  const session = await auth();
  if (!session || session.user.role !== Role.STUDENT) {
    redirect("/bible-college/portal/login");
  }
  return session;
}

export async function requireAnyRole() {
  const session = await auth();
  if (!session) redirect("/bible-college/portal/login");
  return session;
}