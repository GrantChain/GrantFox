import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Función para manejar errores de conexión
export const handleDatabaseError = (
  error: unknown,
): { message: string; status: number } => {
  console.error("Database error:", error);

  if (error instanceof Error) {
    // Errores de conexión específicos
    if (
      error.message.includes("prepared statement") ||
      error.message.includes("connection") ||
      error.message.includes("timeout") ||
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("ENOTFOUND")
    ) {
      return {
        message: "Database connection error. Please try again.",
        status: 503,
      };
    }

    // Errores de autenticación
    if (
      error.message.includes("authentication") ||
      error.message.includes("password")
    ) {
      return {
        message: "Database authentication error. Please contact support.",
        status: 500,
      };
    }
  }

  return {
    message: "Database error occurred. Please try again.",
    status: 500,
  };
};

// Función para verificar la conexión
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
};
