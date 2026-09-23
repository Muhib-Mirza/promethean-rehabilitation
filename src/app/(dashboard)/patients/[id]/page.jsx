import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PrescriptionScreen } from "@/components/modules/patients/PrescriptionScreen";
import { requireScreenView } from "@/lib/auth/guard";
import { getUserPermissions } from "@/lib/auth/permissions";
import { SCREENS } from "@/lib/auth/screens";
// DEMO-DATA FALLBACK — remove this import along with src/mock-data/ once a
// real database is connected (see src/mock-data/README.md).
import { getMockPatientById, MOCK_PRESCRIPTIONS } from "@/mock-data/patients";

export const metadata = {
  title: "Prescription | Promethean Rehabilitation",
};

// Direct Prisma read in a Server Component isn't auto-detected as dynamic
// (unlike `fetch`), so this must be forced or the record would be frozen at
// build time — same reasoning as src/app/(dashboard)/patients/page.jsx.
export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const user = await requireScreenView(SCREENS.PATIENTS);
  const permissions = await getUserPermissions(user);

  const { id } = await params;
  const patientId = Number(id);
  if (!Number.isInteger(patientId)) notFound();

  let patient;
  let isMockData = false;

  try {
    patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { prescription: true },
    });
  } catch {
    // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
    isMockData = true;
    const mockPatient = getMockPatientById(patientId);
    patient = mockPatient ? { ...mockPatient, prescription: MOCK_PRESCRIPTIONS[patientId] ?? null } : null;
  }

  if (!patient) notFound();

  return (
    <PrescriptionScreen
      patient={{ ...patient, createdAt: patient.createdAt.toISOString() }}
      prescription={
        patient.prescription
          ? { ...patient.prescription, updatedAt: patient.prescription.updatedAt.toISOString() }
          : null
      }
      isMockData={isMockData}
      permissions={permissions}
    />
  );
}
