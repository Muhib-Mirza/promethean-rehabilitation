import { prisma } from "@/lib/prisma";

// Self-heals the Screen/Action catalog the Roles admin screen builds its
// permission matrix from — same idea as ensureSuperAdmin in
// src/lib/auth/bootstrap.js. Without this, a fresh database has no rows in
// Screens/Actions and the "Add Role" modal shows "No screens found" until
// someone remembers to run sql/rbac-seed.sql by hand. Cheap existence
// checks, only writes what's missing — safe to call on every request that
// needs the catalog (GET /api/screens, and before resolving screen/action
// codes in the roles PUT handler).
//
// Codes below must stay in sync with src/lib/auth/screens.js and
// sql/rbac-seed.sql (which remains the reference for DBA/manual setup).
const ACTIONS_SEED = [
  { code: "view", name: "View" },
  { code: "create", name: "Create" },
  { code: "update", name: "Update" },
  { code: "delete", name: "Delete" },
];

const TOP_LEVEL_SCREENS_SEED = [
  { code: "patients", name: "Patients" },
  { code: "appointments", name: "Appointments" },
  { code: "therapists", name: "Therapists" },
  { code: "programs", name: "Treatment Programs" },
  { code: "billing", name: "Billing" },
  { code: "reports", name: "Reports" },
  { code: "settings", name: "Settings" },
];

// Nested under "patients". "patients.info" and "patients.bodychart" each
// back two entry points that share one form/endpoint (the Patients list's
// "Edit"/"Body Chart" row actions, and the matching tab on the detail
// page) — one right governs both.
const PATIENT_TABS_SEED = [
  { code: "patients.info", name: "Patient Info" },
  { code: "patients.bodychart", name: "Body Chart" },
  { code: "patients.complaint", name: "Patient Complaint" },
  { code: "patients.examination", name: "Examination" },
  { code: "patients.followup", name: "Follow Up" },
  { code: "patients.comparative", name: "Comparative Analysis" },
];

export async function ensureScreenCatalog() {
  const [existingActions, existingScreens] = await Promise.all([
    prisma.action.findMany({ select: { code: true } }),
    prisma.screen.findMany({ select: { code: true } }),
  ]);
  const existingActionCodes = new Set(existingActions.map((a) => a.code));
  const existingScreenCodes = new Set(existingScreens.map((s) => s.code));

  const missingActions = ACTIONS_SEED.filter((a) => !existingActionCodes.has(a.code));
  if (missingActions.length > 0) {
    await prisma.action.createMany({ data: missingActions });
  }

  const missingTopLevel = TOP_LEVEL_SCREENS_SEED.filter((s) => !existingScreenCodes.has(s.code));
  if (missingTopLevel.length > 0) {
    await prisma.screen.createMany({ data: missingTopLevel });
  }

  const missingTabs = PATIENT_TABS_SEED.filter((s) => !existingScreenCodes.has(s.code));
  if (missingTabs.length > 0) {
    const patientsScreen = await prisma.screen.findUnique({ where: { code: "patients" } });
    if (patientsScreen) {
      await prisma.screen.createMany({
        data: missingTabs.map((s) => ({ ...s, parentId: patientsScreen.id })),
      });
    }
  }
}
