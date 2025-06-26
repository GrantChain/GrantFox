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

    let userData = null;

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

    if (!userData) {
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ exists: true, user: userData });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { exists: false, message: "Failed to check user" },
      { status: 500 },
    );
  }
}
