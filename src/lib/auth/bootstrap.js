import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { ROLES } from "@/lib/auth/roles";

const SUPERADMIN_USERNAME = "superadministrator";
const SUPERADMIN_PASSWORD = "administrator@promethian";

// Self-heals the fixed super admin account: the first time anyone attempts
// to log in against a database that has no SUPERADMIN yet, one is created.
// Cheap existence check, writes at most once — safe to call on every login
// attempt. Throws (caller decides what to do) if the database is
// unreachable.
export async function ensureSuperAdmin() {
  const existing = await prisma.user.findFirst({ where: { role: ROLES.SUPERADMIN } });
  if (existing) return;

  await prisma.user.create({
    data: {
      username: SUPERADMIN_USERNAME,
      passwordHash: hashPassword(SUPERADMIN_PASSWORD),
      role: ROLES.SUPERADMIN,
    },
  });
}
