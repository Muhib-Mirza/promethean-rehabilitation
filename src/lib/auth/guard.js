import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { hasPermission } from "@/lib/auth/permissions";
import { ACTIONS } from "@/lib/auth/screens";

// Route Handler guard for user-management endpoints. Returns { user } on
// success, or { error: <NextResponse> } to return as-is.
export async function requireSuperAdmin() {
  const user = await getSessionUser();
  if (!user) {
    return {
      error: NextResponse.json({ errors: { form: "Not authenticated." } }, { status: 401 }),
    };
  }
  if (!isSuperAdmin(user)) {
    return {
      error: NextResponse.json(
        { errors: { form: "Only the super admin can manage users." } },
        { status: 403 }
      ),
    };
  }
  return { user };
}

// Route Handler guard for any endpoint gated by the screen/action rights
// matrix (see src/lib/auth/permissions.js) rather than a fixed role check.
export async function requirePermission(screenCode, actionCode) {
  const user = await getSessionUser();
  if (!user) {
    return {
      error: NextResponse.json({ errors: { form: "Not authenticated." } }, { status: 401 }),
    };
  }
  if (!(await hasPermission(user, screenCode, actionCode))) {
    return {
      error: NextResponse.json(
        { errors: { form: "You do not have permission to perform this action." } },
        { status: 403 }
      ),
    };
  }
  return { user };
}

// Route Handler guard for an endpoint shared by several tabs (e.g. the one
// prescription PUT that every Patient Complaint/Examination/Follow Up tab
// saves through) — allowed if the user has actionCode on any of screenCodes.
export async function requireAnyPermission(screenCodes, actionCode) {
  const user = await getSessionUser();
  if (!user) {
    return {
      error: NextResponse.json({ errors: { form: "Not authenticated." } }, { status: 401 }),
    };
  }
  const checks = await Promise.all(
    screenCodes.map((screenCode) => hasPermission(user, screenCode, actionCode))
  );
  if (!checks.some(Boolean)) {
    return {
      error: NextResponse.json(
        { errors: { form: "You do not have permission to perform this action." } },
        { status: 403 }
      ),
    };
  }
  return { user };
}

// Server Component guard for a page whose whole route maps to one screen —
// redirects instead of returning an error response. Route Handlers must
// still use requirePermission(); a page-level check is UX only, not the
// security boundary.
export async function requireScreenView(screenCode) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!(await hasPermission(user, screenCode, ACTIONS.VIEW))) redirect("/");
  return user;
}
