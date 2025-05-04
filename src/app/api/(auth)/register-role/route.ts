import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RolePayloadSchema } from "@/components/modules/auth/schema/role-selection.schema";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = RolePayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { user_id, role } = parsed.data;

  try {
    // Update the user's role in the database
    const user = await prisma.user.update({
      where: { user_id },
      data: { role },
    });

    // Create the corresponding record in the specific table
    if (role === "grant_provider") {
      await prisma.grant_provider.create({
        data: {
          user_id: user_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } else if (role === "grantee") {
      await prisma.grantee.create({
        data: {
          user_id: user_id,
        },
      });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error registering role:", error);
    return NextResponse.json(
      { error: "Failed to register role" },
      { status: 500 },
    );
  }
}
