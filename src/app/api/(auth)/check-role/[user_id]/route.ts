import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_id: string }> },
) {
  try {
    const { user_id } = await params;
    console.log("user", user_id);

    const user = await prisma.user.findUnique({
      where: { user_id },
      select: {
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    console.error("Error getting user role:", error);
    return NextResponse.json(
      { error: "Failed to get user role" },
      { status: 500 },
    );
  }
}
