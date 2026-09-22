import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";

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
