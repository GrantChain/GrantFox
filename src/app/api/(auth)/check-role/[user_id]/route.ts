import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logger } from "@/lib/services/logger";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ user_id: string }> },
) {
  try {
    const { user_id } = await params;

    if (!user_id || user_id === "undefined" || user_id === "null") {
      logger.error("Invalid user_id parameter", null, {
        action: "AUTH_CHECK_ROLE",
        entityType: "USER",
      });
      return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
    }

    let user = null as { role: string } | null;
    try {
      user = await prisma.user.findUnique({
        where: { user_id },
        select: { role: true },
      });
    } catch (innerError) {
      const message = innerError instanceof Error ? innerError.message : "";
      if (
        message.includes("prepared statement") ||
        message.includes("already exists")
      ) {
        try {
          await prisma.$disconnect();
        } catch {}
        user = await prisma.user.findUnique({
          where: { user_id },
          select: { role: true },
        });
      } else {
        throw innerError;
      }
    }

    if (!user) {
      logger.error("User not found in check-role", null, {
        action: "AUTH_CHECK_ROLE",
        userId: user_id,
        entityType: "USER",
      });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    logger.info("Fetched user role successfully", {
      action: "AUTH_CHECK_ROLE",
      userId: user_id,
      entityType: "USER",
      metadata: { role: user.role },
    });

    return NextResponse.json({ role: user.role });
  } catch (error) {
    logger.error("Error checking user role", error, {
      action: "AUTH_CHECK_ROLE",
      entityType: "USER",
    });
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
