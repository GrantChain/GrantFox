import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ payout_id: string }> }
) {
  try {
    const { payout_id } = await params;

    const payout = await prisma.payout.findUnique({
      where: { id: payout_id },
    });

    if (!payout) {
      return NextResponse.json(
        { error: "Payout not found" },
        { status: 404 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { payoutId: payout_id },
      include: {
        user: {
          select: {
            id: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
