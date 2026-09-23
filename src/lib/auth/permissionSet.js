// Client-safe helper for checking a flat "screenCode:actionCode" permission
// list (as produced by getUserPermissions in src/lib/auth/permissions.js and
// passed down from a Server Component to a Client Component prop). No
// server-only imports here — this file is also used by "use client" code.
export function canAccess(permissions, screenCode, actionCode) {
  return Array.isArray(permissions) && permissions.includes(`${screenCode}:${actionCode}`);
}
