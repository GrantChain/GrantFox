import { prisma } from "@/lib/prisma";
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

    // Si el role es EMPTY, buscar solo por user_id sin filtrar por role
    if (role === "EMPTY") {
      const user = await prisma.user.findUnique({
        where: { user_id },
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

    // Para otros roles, buscar con filtro de role
    const user = await prisma.user.findUnique({
      where: { user_id },
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

    // Verificar que el usuario existe y tiene el role correcto
    if (!user || (role && user.role !== role)) {
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ exists: true, user });
  } catch (error) {
    console.error("Error in get-user-by-id:", error);
    return NextResponse.json(
      { exists: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}