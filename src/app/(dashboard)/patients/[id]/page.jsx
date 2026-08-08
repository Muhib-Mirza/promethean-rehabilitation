import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PrescriptionScreen } from "@/components/modules/patients/PrescriptionScreen";

export const metadata = {
  title: "Prescription | Promethean Rehabilitation",
};

// Direct Prisma read in a Server Component isn't auto-detected as dynamic
// (unlike `fetch`), so this must be forced or the record would be frozen at
// build time — same reasoning as src/app/(dashboard)/patients/page.jsx.
export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { id } = await params;
  const patientId = Number(id);
  if (!Number.isInteger(patientId)) notFound();

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: { prescription: true },
  });
  if (!patient) notFound();

  return (
    <PrescriptionScreen
      patient={{ ...patient, createdAt: patient.createdAt.toISOString() }}
      prescription={
        patient.prescription
          ? { ...patient.prescription, updatedAt: patient.prescription.updatedAt.toISOString() }
          : null
      }
    />
  );
}
