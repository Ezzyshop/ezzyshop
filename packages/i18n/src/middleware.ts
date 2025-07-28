import createMiddleware from "next-intl/middleware";
import { routing } from "@repo/i18n/routing";
import { NextRequest, NextResponse } from "next/server.js";

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("/icons") ||
    pathname.includes("/images")
  ) {
    return NextResponse.next();
  }

  return createMiddleware(routing)(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set of paths where next-intl should detect the locale
    "/(en|ru|uz)/:path*",

    // Enable redirects that add missing locales
    // Exclude Next.js internals and static files
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
