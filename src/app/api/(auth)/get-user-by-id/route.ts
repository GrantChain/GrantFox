import type { UserRole } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const role = searchParams.get("role");

    if (!role) {
      return NextResponse.json(
        { exists: false, message: "Role parameter is required" },
        { status: 400 },
      );
    }
    if (!user_id) {
      return NextResponse.json(
        { exists: false, message: "User ID parameter is required" },
        { status: 400 },
      );
    }

    if (role === "EMPTY") {
      const user = await prisma.user.findUnique({
        where: {
          user_id,
          role: role as UserRole,
        },
        select: {
          user_id: true,
          email: true,
          username: true,
          wallet_address: true,
          bio: true,
          profile_url: true,
          cover_url: true,
          location: true,
          role: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { exists: false, message: "User not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ exists: true, user });
    }

    const user = await prisma.user.findUnique({
      where: {
        user_id,
        role: role as UserRole,
      },
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
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ exists: true, user });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { exists: false, message: "Failed to check user" },
      { status: 500 },
    );
  }
}