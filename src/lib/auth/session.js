// Session cookie helpers for use in Server Components, Route Handlers, and
// Server Actions (anything with access to `next/headers`). `proxy.js` reads
// the same cookie directly via `request.cookies` instead of importing this
// file (Proxy gets its own request/response, not the `cookies()` API).
import { cookies } from "next/headers";
import { SESSION_COOKIE, createToken, readToken } from "@/lib/auth/token";

export async function createSession(user) {
  const { token, expiresAt } = createToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

// Fast, cookie-only check — the payload (userId/username/role) is trusted
// because the cookie is HMAC-signed server-side. Good enough for page/nav
// gating; write endpoints in /api/users re-verify against the database.
export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = readToken(token);
  // The demo-mode super admin (src/mock-data/superadmin.js) uses id 0,
  // which is falsy — check for null/undefined explicitly, not truthiness.
  if (payload?.userId == null) return null;
  return { id: payload.userId, username: payload.username, role: payload.role };
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
