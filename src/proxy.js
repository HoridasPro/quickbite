import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // 1. ENFORCEMENT: The Ban Hammer
  // If the user is marked as Banned in their token, lock them out of all secure areas.
  if (token && token.accountStatus === "Banned") {
    if (pathname.startsWith("/dashboard")) {
      // Redirect to a dedicated "Account Terminated" page (we will build this later)
      return NextResponse.redirect(new URL("/banned", req.url));
    }
  }

  // Protect Admin Dashboard
  if (pathname.startsWith("/dashboard/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect Rider Dashboard (Admins also get access)
  if (pathname.startsWith("/dashboard/rider")) {
    if (!token || (token.role !== "rider" && token.role !== "admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Riders who are "Suspended" shouldn't be able to access the delivery pool
    if (token && token.accountStatus === "Suspended" && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect Restaurant Dashboard (Admins also get access)
  if (pathname.startsWith("/dashboard/restaurant")) {
    if (!token || (token.role !== "restaurant" && token.role !== "admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Suspended restaurants shouldn't access the Kitchen KDS
    if (token && token.accountStatus === "Suspended" && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Catch everything under dashboard
    "/dashboard/:path*"
  ],
};