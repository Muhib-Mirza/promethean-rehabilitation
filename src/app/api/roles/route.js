import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guard";
import { DEMO_MODE_MESSAGE, isDbConnectionError } from "@/mock-data/isDbUnavailable";

function serializeRole(role) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    createdAt: role.createdAt,
    userCount: role._count.userRoles,
    permissionCount: role._count.permissions,
  };
}

export async function GET() {
  const guard = await requireSuperAdmin();
  if (guard.error) return guard.error;

  try {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { userRoles: true, permissions: true } } },
    });
    return NextResponse.json({ roles: roles.map(serializeRole) });
  } catch (error) {
    if (isDbConnectionError(error)) {
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to fetch roles:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const guard = await requireSuperAdmin();
  if (guard.error) return guard.error;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";

  if (!name) {
    return NextResponse.json({ errors: { name: "Role name is required." } }, { status: 400 });
  }

  try {
    const role = await prisma.role.create({
      data: { name, description: description || null },
      include: { _count: { select: { userRoles: true, permissions: true } } },
    });
    return NextResponse.json({ role: serializeRole(role) }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { errors: { name: "A role with this name already exists." } },
        { status: 409 }
      );
    }
    if (isDbConnectionError(error)) {
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to create role:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
