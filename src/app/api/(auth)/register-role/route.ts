import { RolePayloadSchema } from "@/components/modules/auth/schema/role-selection.schema";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/services/logger";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = RolePayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { user_id, role } = parsed.data;

  try {
    // Perform role update and dependent record creation in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { user_id },
        data: { role },
      });

      if (role === "PAYOUT_PROVIDER") {
        await tx.payoutProvider.upsert({
          where: { user_id },
          update: {},
          create: { user_id },
        });
      } else if (role === "GRANTEE") {
        await tx.grantee.upsert({
          where: { user_id },
          update: {},
          create: { user_id },
        });
      }

      return updatedUser;
    });

    logger.info("User role registered successfully", {
      action: "AUTH_REGISTER_ROLE",
      userId: user_id,
      entityType: "USER",
      metadata: { role },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    logger.error("Error registering role", error, {
      action: "AUTH_REGISTER_ROLE",
      userId: user_id,
      entityType: "USER",
      metadata: { role },
    });
    return NextResponse.json(
      { error: "Failed to register role" },
      { status: 500 },
    );
  }
}
