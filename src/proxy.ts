import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // Optional: Add specific path restrictions based on role
    if (path.startsWith("/dashboard/staff") && role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Add other role-based restrictions here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*"] };
