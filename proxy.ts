import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export default withAuth(
  function middleware(req) {
    const email = req.nextauth.token?.email?.toLowerCase();
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    if (isAdminRoute && !ADMIN_EMAILS.includes(email || "")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};