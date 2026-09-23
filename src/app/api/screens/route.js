import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guard";
import { ensureScreenCatalog } from "@/lib/auth/screenCatalog";
import { isDbConnectionError } from "@/mock-data/isDbUnavailable";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { MOCK_SCREENS } from "@/mock-data/screens";

// Catalog of screens/tabs the Roles admin screen builds its permission
// matrix from (see sql/rbac-seed.sql for the manual/DBA equivalent).
export async function GET() {
  const guard = await requireSuperAdmin();
  if (guard.error) return guard.error;

  try {
    await ensureScreenCatalog();
    const screens = await prisma.screen.findMany({
      orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ screens });
  } catch (error) {
    if (isDbConnectionError(error)) {
      // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
      return NextResponse.json({ screens: MOCK_SCREENS });
    }
    console.error("Failed to fetch screens:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
