import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const patient = await prisma.patient.update({
      where: { id: Number(id) },
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
    return NextResponse.json({ patient });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { errors: { cnic: "A patient with this CNIC already exists." } },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { errors: { form: "Patient not found." } },
        { status: 404 }
      );
    }
    console.error("Failed to update patient:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const patient = await prisma.patient.update({
      where: { id: Number(id) },
      data: {
        bodyChartMarkings: JSON.stringify(body.markings ?? []),
      },
    });
    return NextResponse.json({ patient });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { errors: { form: "Patient not found." } },
        { status: 404 }
      );
    }
    console.error("Failed to update body chart:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;

  try {
    await prisma.patient.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { errors: { form: "Patient not found." } },
        { status: 404 }
      );
    }
    console.error("Failed to delete patient:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
