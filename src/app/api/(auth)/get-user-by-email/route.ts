import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logger } from "@/lib/services/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    // role is optional here; email is unique already

    if (!email) {
      logger.error("Missing email parameter", null, {
        action: "AUTH_GET_USER_BY_EMAIL",
        entityType: "USER",
      });
      return NextResponse.json(
        { exists: false, message: "Email parameter is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        username: true,
        wallet_address: true,
        bio: true,
        profile_url: true,
        cover_url: true,
        location: true,
      },
    });

    if (!user) {
      logger.error("User not found by email", null, {
        action: "AUTH_GET_USER_BY_EMAIL",
        entityType: "USER",
        metadata: { email },
      });
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 404 },
      );
    }

    logger.info("Fetched user by email", {
      action: "AUTH_GET_USER_BY_EMAIL",
      entityType: "USER",
      metadata: { email },
    });

    return NextResponse.json({ exists: true, user });
  } catch (error) {
    logger.error("Error getting user by email", error, {
      action: "AUTH_GET_USER_BY_EMAIL",
      entityType: "USER",
    });
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ exists: false, message }, { status });
  }
}
