import type { UserRole } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    if (!role) {
      return NextResponse.json(
        { exists: false, message: "Role parameter is required" },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { exists: false, message: "Email parameter is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email, role: role as UserRole },
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
