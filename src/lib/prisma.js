import { PrismaClient } from "@/generated/prisma/client.ts";
import { PrismaMssql } from "@prisma/adapter-mssql";

const globalForPrisma = globalThis;

const adapter = new PrismaMssql(process.env.DATABASE_URL);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
