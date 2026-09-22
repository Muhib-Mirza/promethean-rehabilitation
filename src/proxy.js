// Next.js 16 renamed Middleware to Proxy (same runtime behaviour, now on
// the Node.js runtime — see node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md).
// This does the "optimistic" auth check described in
// node_modules/next/dist/docs/01-app/02-guides/authentication.md: read the
// signed session cookie and redirect based on it. Route Handlers still
// re-check (requireSuperAdmin) for anything sensitive.
import { NextResponse } from "next/server";
import { SESSION_COOKIE, readToken } from "@/lib/auth/token";
import { ROLES } from "@/lib/auth/roles";

const PUBLIC_PATHS = new Set(["/login"]);

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.has(pathname);

  const session = readToken(request.cookies.get(SESSION_COOKIE)?.value);
  // userId 0 (the demo-mode super admin) is falsy — check for null/undefined
  // explicitly rather than with Boolean(...).
  const isAuthenticated = session?.userId != null;

  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated && pathname.startsWith("/users") && session.role !== ROLES.SUPERADMIN) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Skip API routes (they guard themselves), static assets, and the favicon.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
