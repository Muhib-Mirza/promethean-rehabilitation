import { prisma } from "@/lib/prisma";
import { PatientsScreen } from "@/components/modules/patients/PatientsScreen";
import { requireScreenView } from "@/lib/auth/guard";
import { getUserPermissions } from "@/lib/auth/permissions";
import { SCREENS } from "@/lib/auth/screens";
// DEMO-DATA FALLBACK — remove this import along with src/mock-data/ once a
// real database is connected (see src/mock-data/README.md).
import { MOCK_PATIENTS } from "@/mock-data/patients";

export const metadata = {
  title: "Patients | Promethean Rehabilitation",
};

// Patients are read directly from the database (not `fetch`), so Next.js
// can't auto-detect this as dynamic — force it, otherwise the list would be
// frozen at build time and never reflect new/edited/deleted records.
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await requireScreenView(SCREENS.PATIENTS);
  const permissions = await getUserPermissions(user);

  let patients;
  let isMockData = false;

  try {
    const rows = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
    patients = rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }));
  } catch {
    // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
    isMockData = true;
    patients = MOCK_PATIENTS.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  return <PatientsScreen patients={patients} isMockData={isMockData} permissions={permissions} />;
}
