import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isVerified = req.auth?.user?.isVerified;
  const isAdmin = req.auth?.user?.isAdmin;
  const isAuthRoute = nextUrl.pathname.startsWith("/auth/");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isVerifyRoute = nextUrl.pathname === "/verify";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (isLoggedIn && !isVerified && !isVerifyRoute) {
    return NextResponse.redirect(new URL("/verify", nextUrl));
  }

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
