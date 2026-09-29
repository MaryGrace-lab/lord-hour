import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ────────────────────────────────────────────────
// Edge-safe proxy (Next.js 16 middleware).
//
// Do NOT import @/lib/auth, @/lib/prisma, or @prisma/client here.
// Middleware runs in the Edge runtime, which cannot load Node-only
// modules. `next-auth/jwt` is Edge-safe (uses JOSE under the hood).
//
// When adding a new protected area, update BOTH:
//   1. PROTECTED_ROUTES below (with allowed roles)
//   2. config.matcher at the bottom (with the path prefix)
// ────────────────────────────────────────────────

type Role = "ADMIN" | "TEACHER" | "STUDENT";

type ProtectedRoute = {
  prefix: string;
  allowedRoles: Role[];
};

const PROTECTED_ROUTES: ProtectedRoute[] = [
  { prefix: "/admin", allowedRoles: ["ADMIN"] },
  { prefix: "/teacher", allowedRoles: ["TEACHER"] },
  { prefix: "/student", allowedRoles: ["STUDENT"] },
];

const LOGIN_PATH = "/bible-college/portal/login";

// Where each role belongs. Used to break the redirect loop when an
// authenticated user lands on another role's portal.
const HOME_FOR_ROLE: Record<Role, string> = {
  ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
};

const IS_PROD = process.env.NODE_ENV === "production";

// Must match the cookie name set in lib/auth.ts. In production, NextAuth
// uses the __Secure- prefix (see SESSION_COOKIE in lib/auth.ts).
const SESSION_COOKIE = IS_PROD
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";

function matchProtectedRoute(pathname: string): ProtectedRoute | null {
  for (const route of PROTECTED_ROUTES) {
    if (pathname === route.prefix || pathname.startsWith(route.prefix + "/")) {
      return route;
    }
  }
  return null;
}

function isRole(value: unknown): value is Role {
  return value === "ADMIN" || value === "TEACHER" || value === "STUDENT";
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const protectedRoute = matchProtectedRoute(pathname);
  if (!protectedRoute) return NextResponse.next();

  let token: { role?: unknown } | null = null;
  try {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: SESSION_COOKIE,
      salt: SESSION_COOKIE,
    });
  } catch (err) {
    // Malformed cookie, signature mismatch, JWT decode error.
    console.error("[proxy] getToken failed:", err);
    token = null;
  }

  const userRole = isRole(token?.role) ? token.role : undefined;

  // 1. Not authenticated → login
  if (!userRole) {
    const loginUrl = new URL(LOGIN_PATH, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated but wrong role → their own portal (breaks the loop)
  if (!protectedRoute.allowedRoles.includes(userRole)) {
    return NextResponse.redirect(new URL(HOME_FOR_ROLE[userRole], req.url));
  }

  // 3. Authorized
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};