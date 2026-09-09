import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "@prisma/client";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const session = await auth();
    if (!session || session.user.role !== Role.ADMIN) {
      const loginUrl = new URL("/bible-college/portal/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/teacher")) {
    const session = await auth();
    if (!session || session.user.role !== Role.TEACHER) {
      const loginUrl = new URL("/bible-college/portal/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/student")) {
    const session = await auth();
    if (!session || session.user.role !== Role.STUDENT) {
      const loginUrl = new URL("/bible-college/portal/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};