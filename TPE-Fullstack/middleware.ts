import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import {
  canAccessPath,
  getDefaultLandingPath,
} from "@/lib/auth/permissions";

const { auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
});

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");
  const isAdmin = pathname.startsWith("/admin");

  if (!isAdmin) {
    return NextResponse.next();
  }

  const session = req.auth;

  if (isLogin) {
    if (session?.user) {
      const landing = getDefaultLandingPath({
        role: session.user.role,
        permissions: session.user.permissions,
      });
      return NextResponse.redirect(new URL(landing, req.url));
    }
    return NextResponse.next();
  }

  if (!session?.user) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin/unauthorized")) {
    return NextResponse.next();
  }

  const access = {
    role: session.user.role,
    permissions: session.user.permissions,
  };

  if (!canAccessPath(access, pathname)) {
    if (pathname === "/admin" || pathname === "/admin/") {
      const landing = getDefaultLandingPath(access);
      if (landing !== "/admin") {
        return NextResponse.redirect(new URL(landing, req.url));
      }
    }
    return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
