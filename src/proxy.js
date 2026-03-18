import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api");

  if (token) {
    // 0. THE FORCE KICK: Instantly destroy session for deleted users
    if (token.accountStatus === "Deleted") {
      if (isApiRoute) {
        return NextResponse.json({ success: false, message: "Account no longer exists." }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL("/login", req.url));
      // Wipe the cookies (handles both localhost and Vercel secure cookies)
      response.cookies.delete("next-auth.session-token");
      response.cookies.delete("__Secure-next-auth.session-token");
      return response;
    }

    // 1. Total lockout for Banned users
    if (token.accountStatus === "Banned" && !pathname.startsWith("/banned")) {
      if (isApiRoute) {
        return NextResponse.json({ success: false, message: "Account Banned." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/banned", req.url));
    }

    // 2. Strategic lockout for Suspended users
    if (token.accountStatus === "Suspended" && !pathname.startsWith("/suspended")) {
      if (token.role === "admin" && pathname.startsWith("/dashboard/admin")) {
        if (isApiRoute) {
          return NextResponse.json({ success: false, message: "Admin privileges suspended." }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/suspended", req.url));
      }

      if (pathname.startsWith("/checkout")) {
        if (isApiRoute) {
          return NextResponse.json({ success: false, message: "Purchasing disabled." }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/suspended", req.url));
      }
    }
  }

  // Protect Dashboards
  if (pathname.startsWith("/dashboard/admin")) {
    if (!token || token.role !== "admin") return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/dashboard/rider")) {
    if (!token || (token.role !== "rider" && token.role !== "admin")) return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/dashboard/restaurant")) {
    if (!token || (token.role !== "restaurant" && token.role !== "admin")) return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ],
};