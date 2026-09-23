import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guard";
import { ensureScreenCatalog } from "@/lib/auth/screenCatalog";
import { DEMO_MODE_MESSAGE, isDbConnectionError } from "@/mock-data/isDbUnavailable";

export async function GET(_request, { params }) {
  const guard = await requireSuperAdmin();
  if (guard.error) return guard.error;

  const { id } = await params;

  try {
    const role = await prisma.role.findUnique({
      where: { id: Number(id) },
      include: {
        permissions: {
          where: { isAllowed: true },
          select: { screen: { select: { code: true } }, action: { select: { code: true } } },
        },
        userRoles: { select: { userId: true } },
      },
    });
    if (!role) {
      return NextResponse.json({ errors: { form: "Role not found." } }, { status: 404 });
    }

    return NextResponse.json({
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions.map((p) => `${p.screen.code}:${p.action.code}`),
        userIds: role.userRoles.map((ur) => ur.userId),
      },
    });
  } catch (error) {
    if (isDbConnectionError(error)) {
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to fetch role:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}

// Full replace: the Roles admin screen edits name/description, the whole
// permission matrix, and the whole assigned-user list together in one
// modal, so PUT clears and re-inserts rather than diffing.
export async function PUT(request, { params }) {
  const guard = await requireSuperAdmin();
  if (guard.error) return guard.error;

  const { id } = await params;
  const roleId = Number(id);
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const permissionKeys = Array.isArray(body?.permissions) ? body.permissions : [];
  const userIds = Array.isArray(body?.userIds) ? body.userIds.map(Number).filter(Number.isInteger) : [];

  if (!name) {
    return NextResponse.json({ errors: { name: "Role name is required." } }, { status: 400 });
  }

  try {
    await ensureScreenCatalog();
    const [screens, actions] = await Promise.all([
      prisma.screen.findMany({ select: { id: true, code: true } }),
      prisma.action.findMany({ select: { id: true, code: true } }),
    ]);
    const screenIdByCode = new Map(screens.map((s) => [s.code, s.id]));
    const actionIdByCode = new Map(actions.map((a) => [a.code, a.id]));

    const permissionRows = permissionKeys
      .map((key) => {
        const [screenCode, actionCode] = key.split(":");
        const screenId = screenIdByCode.get(screenCode);
        const actionId = actionIdByCode.get(actionCode);
        return screenId && actionId ? { roleId, screenId, actionId, isAllowed: true } : null;
      })
      .filter(Boolean);

    await prisma.$transaction([
      prisma.role.update({ where: { id: roleId }, data: { name, description: description || null } }),
      prisma.rolePermission.deleteMany({ where: { roleId } }),
      ...(permissionRows.length > 0
        ? [prisma.rolePermission.createMany({ data: permissionRows })]
        : []),
      prisma.userRole.deleteMany({ where: { roleId } }),
      ...(userIds.length > 0
        ? [prisma.userRole.createMany({ data: userIds.map((userId) => ({ userId, roleId })) })]
        : []),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { errors: { name: "A role with this name already exists." } },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ errors: { form: "Role not found." } }, { status: 404 });
    }
    if (isDbConnectionError(error)) {
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to update role:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const guard = await requireSuperAdmin();
  if (guard.error) return guard.error;

  const { id } = await params;

  try {
    await prisma.role.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ errors: { form: "Role not found." } }, { status: 404 });
    }
    if (isDbConnectionError(error)) {
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to delete role:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
