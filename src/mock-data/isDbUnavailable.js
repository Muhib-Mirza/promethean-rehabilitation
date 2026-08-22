export const DEMO_MODE_MESSAGE =
  "Writes are disabled in demo mode — connect a database to save changes.";

// Heuristic for "the database itself is unreachable" (wrong/missing
// DATABASE_URL, network refused, auth failed, timed out) as opposed to a
// normal application error (validation failure, unique constraint, not
// found) from a database that IS working. Only the former should trigger
// the mock-data fallback / "demo mode" messaging.
export function isDbConnectionError(error) {
  if (!error) return false;

  const code = typeof error.code === "string" ? error.code : "";
  const name = typeof error.name === "string" ? error.name : "";
  const message = typeof error.message === "string" ? error.message : "";

  // Prisma connection-related error codes are P1xxx (P2xxx/P3xxx are
  // request/migration errors from a database that's actually reachable).
  if (/^P1\d{3}$/.test(code)) return true;
  if (name.includes("PrismaClientInitializationError")) return true;
  if (name.includes("PrismaClientRustPanicError")) return true;

  return /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|getaddrinfo|Login failed|server was not found|failed to connect|connection.*(closed|refused|timed? ?out)/i.test(
    message
  );
}
