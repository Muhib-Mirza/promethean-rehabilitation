import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { RolesScreen } from "@/components/modules/roles/RolesScreen";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { isDbConnectionError } from "@/mock-data/isDbUnavailable";

export const metadata = {
  title: "Roles | Promethean Rehabilitation",
};

// Roles are read directly from the database (not `fetch`), so force this
// dynamic — otherwise the list would be frozen at build time.
export const dynamic = "force-dynamic";

export default async function Page() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    redirect("/");
  }

  let roles;
  let isMockData = false;

  try {
    const rows = await prisma.role.findMany({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { userRoles: true, permissions: true } } },
    });
    roles = rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.createdAt.toISOString(),
      userCount: row._count.userRoles,
      permissionCount: row._count.permissions,
    }));
  } catch (error) {
    if (!isDbConnectionError(error)) throw error;
    // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
    isMockData = true;
    roles = [];
  }

  return <RolesScreen roles={roles} isMockData={isMockData} />;
}
