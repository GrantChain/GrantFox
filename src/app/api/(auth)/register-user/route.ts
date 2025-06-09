// /app/api/register-user/route.ts

import { UserPayloadSchema } from "@/components/modules/auth/schema/register-user.schema";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = UserPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { user_id, email } = parsed.data;

    // Generate username from email
    const username = email.split("@")[0];

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        user_id,
        email,
        username,
        wallet_address: null,
        bio: "",
        role: "EMPTY",
        profile_url: "",
        cover_url: "",
        location: "",
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "42P05"
    ) {
      return NextResponse.json(
        { error: "Database connection error. Please try again." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
