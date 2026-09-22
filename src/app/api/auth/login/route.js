import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSuperAdmin } from "@/lib/auth/bootstrap";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { isDbConnectionError } from "@/mock-data/isDbUnavailable";
import { MOCK_SUPERADMIN } from "@/mock-data/superadmin";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { errors: { form: "Username and password are required." } },
      { status: 400 }
    );
  }

  let user;
  try {
    await ensureSuperAdmin();
    user = await prisma.user.findUnique({ where: { username } });
  } catch (error) {
    if (isDbConnectionError(error)) {
      // DEMO-DATA FALLBACK — see src/mock-data/README.md to remove.
      user = username === MOCK_SUPERADMIN.username ? MOCK_SUPERADMIN : null;
    } else {
      console.error("Login failed:", error);
      return NextResponse.json(
        { errors: { form: "Something went wrong. Please try again." } },
        { status: 500 }
      );
    }
  }

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { errors: { form: "Invalid username or password." } },
      { status: 401 }
    );
  }

  await createSession(user);
  return NextResponse.json({
    user: { id: user.id, username: user.username, role: user.role },
  });
}
