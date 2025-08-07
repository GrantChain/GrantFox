import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ user_id: string }> },
) {
  try {
    const { user_id } = await params;

    if (!user_id || user_id === "undefined" || user_id === "null") {
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role: user.role });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
