export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  STAFF: "STAFF",
};

export function isSuperAdmin(user) {
  return user?.role === ROLES.SUPERADMIN;
}
