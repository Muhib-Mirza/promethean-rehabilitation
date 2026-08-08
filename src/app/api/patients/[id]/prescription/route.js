import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Upserts the prescription in one round trip: most edits are to an existing
// record, but the row is only created lazily on first save rather than at
// patient-creation time, so PUT must handle both cases.
export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const prescription = await prisma.prescription.upsert({
      where: { patientId: Number(id) },
      update: { data: JSON.stringify(body.data ?? {}) },
      create: {
        patientId: Number(id),
        data: JSON.stringify(body.data ?? {}),
      },
    });
    return NextResponse.json({ prescription });
  } catch (error) {
    if (error.code === "P2003") {
      return NextResponse.json(
        { errors: { form: "Patient not found." } },
        { status: 404 }
      );
    }
    console.error("Failed to save prescription:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
