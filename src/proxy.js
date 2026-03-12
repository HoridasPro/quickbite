import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

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
  }

  // Protect Restaurant Dashboard (Admins also get access)
  if (pathname.startsWith("/dashboard/restaurant")) {
    if (!token || (token.role !== "restaurant" && token.role !== "admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/admin/:path*", 
    "/dashboard/rider/:path*", 
    "/dashboard/restaurant/:path*"
  ],
};