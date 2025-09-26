import { handleDatabaseError, prisma } from "@/lib/prisma";
import { logger } from "@/lib/services/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const role = searchParams.get("role");

    if (!user_id) {
      logger.error("Missing user_id parameter", null, {
        action: "AUTH_GET_USER_ROLE_BY_ID",
        entityType: "USER",
      });
      return NextResponse.json(
        { exists: false, message: "User ID parameter is required" },
        { status: 400 },
      );
    }

    if (role === "EMPTY" || !role) {
      let user = null as unknown as { user_id: string } | null;
      try {
        user = await prisma.user.findUnique({
          where: { user_id },
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
          });
        } else {
          throw innerError;
        }
      }

      if (!user) {
        logger.error("User not found by id", null, {
          action: "AUTH_GET_USER_ROLE_BY_ID",
          userId: user_id,
          entityType: "USER",
        });
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 },
        );
      }

      logger.info("Fetched user details for EMPTY role", {
        action: "AUTH_GET_USER_ROLE_BY_ID",
        userId: user_id,
        entityType: "USER",
      });

      return NextResponse.json({ success: true, user });
    }

    let userData = null as unknown as object | null;

    try {
      if (role === "GRANTEE") {
        userData = await prisma.grantee.findUnique({
          where: {
            user_id,
          },
        });
      } else if (role === "PAYOUT_PROVIDER") {
        userData = await prisma.payoutProvider.findUnique({
          where: {
            user_id,
          },
        });
      }
    } catch (innerError) {
      const message = innerError instanceof Error ? innerError.message : "";
      if (
        message.includes("prepared statement") ||
        message.includes("already exists")
      ) {
        try {
          await prisma.$disconnect();
        } catch {}
        if (role === "GRANTEE") {
          userData = await prisma.grantee.findUnique({
            where: {
              user_id,
            },
          });
        } else if (role === "PAYOUT_PROVIDER") {
          userData = await prisma.payoutProvider.findUnique({
            where: {
              user_id,
            },
          });
        }
      } else {
        throw innerError;
      }
    }

    if (!userData) {
      logger.error("User role data not found", null, {
        action: "AUTH_GET_USER_ROLE_BY_ID",
        userId: user_id,
        entityType: "USER",
        metadata: { role },
      });
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 404 },
      );
    }

    logger.info("Fetched user role data successfully", {
      action: "AUTH_GET_USER_ROLE_BY_ID",
      userId: user_id,
      entityType: "USER",
      metadata: { role },
    });

    return NextResponse.json({ exists: true, user: userData });
  } catch (error) {
    logger.error("Error getting user role by id", error, {
      action: "AUTH_GET_USER_ROLE_BY_ID",
      entityType: "USER",
    });
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ exists: false, message }, { status });
  }
}
