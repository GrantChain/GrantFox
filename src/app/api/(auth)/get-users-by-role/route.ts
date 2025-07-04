import type { UserRole } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const user_ids = searchParams.get("user_ids");

    if (!role) {
      return NextResponse.json(
        { error: "Role parameter is required" },
        { status: 400 },
      );
    }

    if (!user_ids) {
      return NextResponse.json(
        { error: "User IDs parameter is required" },
        { status: 400 },
      );
    }

    // Decode the parameters to handle special characters
    const decodedRole = decodeURIComponent(role);
    const decodedUserIds = decodeURIComponent(user_ids);
    const userIdsArray = decodedUserIds.split(",").filter(Boolean);

    if (userIdsArray.length === 0) {
      return NextResponse.json(
        { error: "At least one user ID is required" },
        { status: 400 },
      );
    }

    const users = await prisma.user.findMany({
      where: {
        user_id: { in: userIdsArray },
        role: decodedRole as UserRole,
        wallet_address: { not: null },
      },
      select: {
        user_id: true,
        email: true,
        username: true,
        wallet_address: true,
        role: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error getting users by role:", error);
    return NextResponse.json(
      { error: "Failed to get users by role" },
      { status: 500 },
    );
  }
} 