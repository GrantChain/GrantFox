// /app/api/register-user/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserPayloadSchema } from "@/components/modules/auth/schema/register-user.schema";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = UserPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { user_id, email } = parsed.data;

  // Generate username from email (part before @)
  const username = email.split("@")[0];

  try {
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
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
