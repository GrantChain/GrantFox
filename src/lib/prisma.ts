import { PrismaClient } from "@/generated/prisma";

let global: PrismaClient | undefined;

export const prisma =
  global ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") global = prisma;
