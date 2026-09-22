import { DashboardShell } from "@/components/layout/DashboardShell";
import { getSessionUser } from "@/lib/auth/session";

export default async function DashboardLayout({ children }) {
  const currentYear = new Date().getFullYear();
  // proxy.js already redirects unauthenticated requests to /login before
  // they reach here; this is just what renders the signed-in user's name
  // and gates the "User Management" nav item.
  const user = await getSessionUser();

  return (
    <DashboardShell currentYear={currentYear} user={user}>
      {children}
    </DashboardShell>
  );
}
