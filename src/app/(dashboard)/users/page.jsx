import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { UsersScreen } from "@/components/modules/users/UsersScreen";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { isDbConnectionError } from "@/mock-data/isDbUnavailable";
import { MOCK_SUPERADMIN } from "@/mock-data/superadmin";

export const metadata = {
  title: "User Management | Promethean Rehabilitation",
};

// Users are read directly from the database (not `fetch`), so force this
// dynamic — otherwise the list would be frozen at build time.
export const dynamic = "force-dynamic";

export default async function Page() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || !isSuperAdmin(sessionUser)) {
    redirect("/");
  }

  let users;
  let isMockData = false;

  try {
    const rows = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, username: true, role: true, createdAt: true },
    });
    users = rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }));
  } catch (error) {
    if (!isDbConnectionError(error)) throw error;
    // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
    isMockData = true;
    users = [
      {
        id: MOCK_SUPERADMIN.id,
        username: MOCK_SUPERADMIN.username,
        role: MOCK_SUPERADMIN.role,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  return (
    <UsersScreen users={users} currentUserId={sessionUser.id} isMockData={isMockData} />
  );
}
