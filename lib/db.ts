import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { getDatabaseUrl } from "@/lib/env";

/**
 * Single Prisma client for the whole server process.
 * Only `lib/services/*` (and the seed script) should import this module.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

// Reuse the client across hot reloads in development instead of opening new pools.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
