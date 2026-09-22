import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guard";
import { hashPassword } from "@/lib/auth/password";
import { ROLES } from "@/lib/auth/roles";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { DEMO_MODE_MESSAGE, isDbConnectionError } from "@/mock-data/isDbUnavailable";

const SELECT_FIELDS = { id: true, username: true, role: true, createdAt: true };

export async function GET() {
  const guard = await requireSuperAdmin();
  if (guard.error) return guard.error;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: SELECT_FIELDS,
    });
    return NextResponse.json({ users });
  } catch (error) {
    if (isDbConnectionError(error)) {
      // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to fetch users:", error);
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
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role = body?.role === ROLES.SUPERADMIN ? ROLES.SUPERADMIN : ROLES.STAFF;

  const errors = {};
  if (!username) errors.username = "Username is required.";
  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: { username, passwordHash: hashPassword(password), role },
      select: SELECT_FIELDS,
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { errors: { username: "A user with this username already exists." } },
        { status: 409 }
      );
    }
    if (isDbConnectionError(error)) {
      // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
      return NextResponse.json({ errors: { form: DEMO_MODE_MESSAGE } }, { status: 503 });
    }
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
