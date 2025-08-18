import { profileUpdatePayloadSchema } from "@/components/modules/profile/schemas/profile.schema";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = profileUpdatePayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { userId, user, grantee, grantProvider } = parsed.data;

    // Update user base fields if provided
    if (user && Object.keys(user).length > 0) {
      await prisma.user.update({
        where: { user_id: userId },
        data: {
          username: user.username,
          email: user.email,
          wallet_address: user.wallet_address || null,
          location: user.location ?? undefined,
          bio: user.bio ?? undefined,
          profile_url:
            typeof user.profile_url === "string" && user.profile_url.length > 0
              ? user.profile_url
              : undefined,
          cover_url:
            typeof user.cover_url === "string" && user.cover_url.length > 0
              ? user.cover_url
              : undefined,
        },
      });
    }

    // Update role-specific data
    if (grantee) {
      await prisma.grantee.upsert({
        where: { user_id: userId },
        update: {
          name: grantee.name ?? undefined,
          position_title: grantee.position_title ?? undefined,
          social_media:
            grantee.social_media === null
              ? Prisma.JsonNull
              : (grantee.social_media as unknown as
                  | Prisma.InputJsonValue
                  | undefined),
        },
        create: {
          user_id: userId,
          name: grantee.name ?? "",
          position_title: grantee.position_title ?? "",
          social_media:
            grantee.social_media === null
              ? Prisma.JsonNull
              : (grantee.social_media as unknown as
                  | Prisma.InputJsonValue
                  | undefined),
        },
      });
    }

    if (grantProvider) {
      await prisma.payoutProvider.upsert({
        where: { user_id: userId },
        update: {
          organization_name: grantProvider.organization_name ?? undefined,
          network_type: grantProvider.network_type ?? undefined,
          email: grantProvider.email ?? undefined,
        },
        create: {
          user_id: userId,
          organization_name: grantProvider.organization_name ?? "",
          network_type: grantProvider.network_type ?? "",
          email: grantProvider.email ?? "",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("/api/profile PATCH error:", error);
    // Handle Prisma unique constraint (e.g., wallet already in use)
    if (
      error &&
      typeof error === "object" &&
      "code" in (error as Record<string, unknown>) &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Wallet address already in use for another user." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
