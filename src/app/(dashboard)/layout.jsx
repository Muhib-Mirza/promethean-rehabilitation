import { DashboardShell } from "@/components/layout/DashboardShell";
import { getSessionUser } from "@/lib/auth/session";
import { getUserPermissions } from "@/lib/auth/permissions";

export default async function DashboardLayout({ children }) {
  const currentYear = new Date().getFullYear();
  // proxy.js already redirects unauthenticated requests to /login before
  // they reach here; this is just what renders the signed-in user's name
  // and gates nav items by role/superadmin status.
  const user = await getSessionUser();
  const permissions = await getUserPermissions(user);

  return (
    <DashboardShell currentYear={currentYear} user={user} permissions={permissions}>
      {children}
    </DashboardShell>
  );
}
