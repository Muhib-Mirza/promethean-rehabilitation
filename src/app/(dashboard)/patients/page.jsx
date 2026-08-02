import { prisma } from "@/lib/prisma";
import { PatientsScreen } from "@/components/modules/patients/PatientsScreen";

export const metadata = {
  title: "Patients | Promethean Rehabilitation",
};

// Patients are read directly from the database (not `fetch`), so Next.js
// can't auto-detect this as dynamic — force it, otherwise the list would be
// frozen at build time and never reflect new/edited/deleted records.
export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });
  const patients = rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
  }));

  return <PatientsScreen patients={patients} />;
}
