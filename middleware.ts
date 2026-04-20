import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = [
  "r0tardanil@yandex.ru", // твой email
  // "напарник@email.com", // добавляй сюда
];

export default withAuth(
  function middleware(req) {
    const email = req.nextauth.token?.email;
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