import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guard";
import { hashPassword } from "@/lib/auth/password";
import { ROLES } from "@/lib/auth/roles";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { DEMO_MODE_MESSAGE, isDbConnectionError } from "@/mock-data/isDbUnavailable";

const SELECT_FIELDS = { id: true, username: true, role: true, createdAt: true };

export async function PUT(request, { params }) {
  const guard = await requireSuperAdmin();
  if (guard.error) return guard.error;

  const { id } = await params;
  const userId = Number(id);

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role = body?.role === ROLES.SUPERADMIN ? ROLES.SUPERADMIN : ROLES.STAFF;

  const errors = {};
  if (!username) errors.username = "Username is required.";
  if (password && password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    // Guard against locking everyone out of user management: don't allow
    // demoting the last remaining super admin.
    if (role !== ROLES.SUPERADMIN) {
      const target = await prisma.user.findUnique({ where: { id: userId } });
      if (target?.role === ROLES.SUPERADMIN) {
        const superAdminCount = await prisma.user.count({ where: { role: ROLES.SUPERADMIN } });
        if (superAdminCount <= 1) {
          return NextResponse.json(
            { errors: { role: "At least one super admin must remain." } },
            { status: 409 }
          );
        }
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        role,
        ...(password ? { passwordHash: hashPassword(password) } : {}),
      },
      select: SELECT_FIELDS,
    });
    return NextResponse.json({ user });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { errors: { username: "A user with this username already exists." } },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json({ errors: { form: "User not found." } }, { status: 404 });
    }
    if (isDbConnectionError(error)) {
      // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to update user:", error);
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
  const userId = Number(id);

  if (userId === guard.user.id) {
    return NextResponse.json(
      { errors: { form: "You can't delete your own account while signed in." } },
      { status: 409 }
    );
  }

  try {
    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (target?.role === ROLES.SUPERADMIN) {
      const superAdminCount = await prisma.user.count({ where: { role: ROLES.SUPERADMIN } });
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { errors: { form: "At least one super admin must remain." } },
          { status: 409 }
        );
      }
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ errors: { form: "User not found." } }, { status: 404 });
    }
    if (isDbConnectionError(error)) {
      // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
