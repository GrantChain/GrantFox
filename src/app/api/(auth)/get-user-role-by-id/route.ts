import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const role = searchParams.get("role");

    if (!user_id) {
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
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 },
        );
      }

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
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ exists: true, user: userData });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ exists: false, message }, { status });
  }
}
