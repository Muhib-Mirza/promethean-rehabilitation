// Stateless session token: HMAC-signed JSON, no session-management
// dependency (jose/iron-session) needed. Pure functions only (no
// `next/headers`) so this same module works both in Route Handlers /
// Server Components (via session.js) and in `proxy.js`.
import crypto from "node:crypto";

export const SESSION_COOKIE = "pr_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Fail loudly in production; fall back to a fixed dev-only secret so
    // local development without a .env doesn't hard-crash.
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET environment variable is not set.");
    }
    return "dev-only-insecure-secret-do-not-use-in-production";
  }
  return secret;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

// payload: { userId, username, role }
export function createToken(payload) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const body = Buffer.from(JSON.stringify({ ...payload, expiresAt }), "utf8").toString(
    "base64url"
  );
  const signature = sign(body);
  return { token: `${body}.${signature}`, expiresAt };
}

export function readToken(token) {
  if (!token || typeof token !== "string") return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expectedSignature = sign(body);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.expiresAt || Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}
