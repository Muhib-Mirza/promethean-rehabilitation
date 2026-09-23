// Screen/action codes for the RBAC system (see sql/rbac-permissions.sql and
// prisma/schema.prisma — Role/Screen/Action/RolePermission/UserRole). Kept
// dependency-free (no prisma import) so client components can import it
// alongside src/lib/auth/permissionSet.js without pulling in server-only code.
export const SCREENS = {
  PATIENTS: "patients",
  PATIENTS_INFO: "patients.info",
  PATIENTS_BODYCHART: "patients.bodychart",
  PATIENTS_COMPLAINT: "patients.complaint",
  PATIENTS_EXAMINATION: "patients.examination",
  PATIENTS_FOLLOWUP: "patients.followup",
  PATIENTS_COMPARATIVE: "patients.comparative",
  APPOINTMENTS: "appointments",
  THERAPISTS: "therapists",
  PROGRAMS: "programs",
  BILLING: "billing",
  REPORTS: "reports",
  SETTINGS: "settings",
};

export const ACTIONS = {
  VIEW: "view",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};
