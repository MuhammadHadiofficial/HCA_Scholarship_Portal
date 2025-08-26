import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Define protected routes and their required roles
const protectedRoutes = {
  "/dashboard/student": ["STUDENT"],
  "/dashboard/staff": ["STAFF"],
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/alumni": ["ALUMNI"],
};

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/guidelines",
  "/dashboard/public",
  "/api/auth/signin",
  "/api/auth/signup",
  "/api/auth/session",
  "/api/auth/signout",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const requiresAuth = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  );

  if (!requiresAuth) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    // Redirect to sign in if no token
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
    
    // Check if user has required role for the route
    const requiredRoles = Object.entries(protectedRoutes).find(([route]) => 
      pathname.startsWith(route)
    )?.[1];

    if (requiredRoles && !requiredRoles.includes(decoded.role)) {
      // Redirect to unauthorized page or dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to sign in
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

