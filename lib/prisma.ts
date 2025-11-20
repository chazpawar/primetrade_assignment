/**
 * Database utility - Prisma Client singleton
 * Prevents multiple instances in development with hot reloading
 */

import { PrismaClient } from "@prisma/client";

/**
 * Global declaration for Prisma Client in development
 */
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma Client instance
 * In development, reuse existing client to prevent connection pool exhaustion
 */
export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
