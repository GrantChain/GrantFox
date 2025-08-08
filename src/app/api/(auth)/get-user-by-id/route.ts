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

    const selectFields: Record<string, boolean> = {
      user_id: true,
      email: true,
      username: true,
      wallet_address: true,
      bio: true,
      profile_url: true,
      cover_url: true,
      location: true,
    };

    if (role === "EMPTY") {
      Object.assign(selectFields, {
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      });
    }

    let user = null as
      | ({
          user_id: string;
          email: string;
          username: string | null;
          wallet_address: string | null;
          bio: string | null;
          profile_url: string | null;
          cover_url: string | null;
          location: string | null;
        } & Partial<{
          role: import("@/generated/prisma").UserRole;
          is_active: boolean;
          created_at: Date;
          updated_at: Date;
        }>)
      | null;

    try {
      user = await prisma.user.findUnique({
        where: { user_id },
        select: selectFields as {
          user_id: true;
          email: true;
          username: true;
          wallet_address: true;
          bio: true;
          profile_url: true;
          cover_url: true;
          location: true;
        } & Partial<{
          role: true;
          is_active: true;
          created_at: true;
          updated_at: true;
        }>,
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
          select: selectFields as {
            user_id: true;
            email: true;
            username: true;
            wallet_address: true;
            bio: true;
            profile_url: true;
            cover_url: true;
            location: true;
          } & Partial<{
            role: true;
            is_active: true;
            created_at: true;
            updated_at: true;
          }>,
        });
      } else {
        throw innerError;
      }
    }

    if (!user) {
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ exists: true, user });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ exists: false, message }, { status });
  }
}
