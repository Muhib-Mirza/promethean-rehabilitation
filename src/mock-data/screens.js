// DEMO-DATA FALLBACK — remove along with the rest of src/mock-data/ once a
// real database is connected (see README.md).
//
// Shown by GET /api/screens when the database is unreachable, so the Roles
// admin screen's "Add/Edit Role" permission matrix still renders something
// to look at instead of an empty "No screens found" table. It's read-only
// preview data — saving a role still fails closed with the "demo mode"
// message like everything else, since Role/RolePermission/UserRole writes
// go through prisma and hit the same isDbConnectionError branch.
//
// Must stay in sync with src/lib/auth/screenCatalog.js (the real seeder)
// and src/lib/auth/screens.js (the code-side SCREENS constants).
export const MOCK_SCREENS = [
  { id: 1, code: "patients", name: "Patients", parentId: null, sortOrder: 0 },
  { id: 2, code: "appointments", name: "Appointments", parentId: null, sortOrder: 0 },
  { id: 3, code: "therapists", name: "Therapists", parentId: null, sortOrder: 0 },
  { id: 4, code: "programs", name: "Treatment Programs", parentId: null, sortOrder: 0 },
  { id: 5, code: "billing", name: "Billing", parentId: null, sortOrder: 0 },
  { id: 6, code: "reports", name: "Reports", parentId: null, sortOrder: 0 },
  { id: 7, code: "settings", name: "Settings", parentId: null, sortOrder: 0 },
  { id: 8, code: "patients.info", name: "Patient Info", parentId: 1, sortOrder: 0 },
  { id: 9, code: "patients.bodychart", name: "Body Chart", parentId: 1, sortOrder: 0 },
  { id: 10, code: "patients.complaint", name: "Patient Complaint", parentId: 1, sortOrder: 0 },
  { id: 11, code: "patients.examination", name: "Examination", parentId: 1, sortOrder: 0 },
  { id: 12, code: "patients.followup", name: "Follow Up", parentId: 1, sortOrder: 0 },
  { id: 13, code: "patients.comparative", name: "Comparative Analysis", parentId: 1, sortOrder: 0 },
];
