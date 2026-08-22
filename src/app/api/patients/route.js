import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { MOCK_PATIENTS } from "@/mock-data/patients";
import { DEMO_MODE_MESSAGE, isDbConnectionError } from "@/mock-data/isDbUnavailable";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ patients });
  } catch (error) {
    if (isDbConnectionError(error)) {
      // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
      return NextResponse.json({ patients: MOCK_PATIENTS });
    }
    console.error("Failed to fetch patients:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const body = await request.json();

  try {
    const patient = await prisma.patient.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        contactNumber: body.contactNumber,
        address: body.address,
        gender: body.gender,
        profession: body.profession,
        cnic: body.cnic,
        referredBy: body.referredBy || null,
        age: body.age ? Number(body.age) : null,
        heightFeet: body.heightFeet ? Number(body.heightFeet) : null,
        weightKg: body.weightKg ? Number(body.weightKg) : null,
        bmi: body.bmi ? Number(body.bmi) : null,
        createdAt: new Date(body.createdAt),
      },
    });
    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { errors: { cnic: "A patient with this CNIC already exists." } },
        { status: 409 }
      );
    }
    if (isDbConnectionError(error)) {
      // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to create patient:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
