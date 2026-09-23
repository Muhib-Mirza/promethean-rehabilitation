import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/auth/roles";
import { SCREENS, ACTIONS } from "@/lib/auth/screens";
import { canAccess } from "@/lib/auth/permissionSet";

// A SUPERADMIN bypasses the rights matrix entirely — materialize every
// screen/action pair rather than special-casing "superadmin" throughout the
// rest of the app. Everyone else's permissions come from the roles (if any)
// assigned to them via UserRole.
function allPermissions() {
  return Object.values(SCREENS).flatMap((screen) =>
    Object.values(ACTIONS).map((action) => `${screen}:${action}`)
  );
}

// One DB round trip per request no matter how many hasPermission() calls a
// page tree makes — React's cache() dedupes by argument identity within a
// single render. Returns a plain string[] so it can be passed straight
// through as a Server Component prop into "use client" components.
export const getUserPermissions = cache(async function getUserPermissions(user) {
  if (!user) return [];
  if (isSuperAdmin(user)) return allPermissions();

  const rows = await prisma.rolePermission.findMany({
    where: { isAllowed: true, role: { userRoles: { some: { userId: user.id } } } },
    select: { screen: { select: { code: true } }, action: { select: { code: true } } },
  });
  return rows.map((row) => `${row.screen.code}:${row.action.code}`);
});

export async function hasPermission(user, screenCode, actionCode) {
  const permissions = await getUserPermissions(user);
  return canAccess(permissions, screenCode, actionCode);
}
