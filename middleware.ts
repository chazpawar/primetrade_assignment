/**
 * Next.js Middleware for route protection
 * Protects dashboard routes and validates JWT tokens
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

/**
 * Middleware function to protect routes
 * Runs before requests to specified paths
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies or Authorization header
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    // Token is valid, allow access
    return NextResponse.next();
  }

  // Redirect to dashboard if already authenticated and trying to access auth pages
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
