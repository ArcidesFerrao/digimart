// import { auth } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;
//   const isAuthRoute = nextUrl.pathname.startsWith("/auth/");
//   const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
//   const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

//   if (isApiAuthRoute) {
//     return NextResponse.next();
//   }

//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return NextResponse.redirect(new URL("/dashboard", nextUrl));
//     }
//     return NextResponse.next();
//   }

//   if (isDashboardRoute && !isLoggedIn) {
//     return NextResponse.redirect(new URL("/auth/login", nextUrl));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
// };
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAuthRoute = nextUrl.pathname.startsWith("/auth/");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn) return NextResponse.redirect(new URL("/dashboard", nextUrl));
    return NextResponse.next();
  }

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};