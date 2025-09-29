/**
 * GET /api/comment/find-by-payout/[payout_id]
 * Retrieves comments from a specific payout
 * 
 * Params: { payout_id: string }
 * Returns: { success: boolean, comments: Comment[], count: number }
 */
import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  { params }: { params: Promise<{ payout_id: string }> }
) {
  try {
    const { payout_id } = await params;

    if (!payout_id || payout_id === "undefined" || payout_id === "null") {
      return NextResponse.json(
        { error: "Invalid payout_id parameter" },
        { status: 400 }
      );
    }

    // Find the payout in the database
    const payout = await prisma.payout.findUnique({
      where: { payout_id },
      select: { payout_id: true }
    });

    if (!payout) {
      return NextResponse.json(
        { error: "Payout not found" },
        { status: 404 }
      );
    }

    // Get comments for the payout, ordered chronologically
    const comments = await prisma.comment.findMany({
      where: { payout_id },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            profile_url: true,
            bio: true,
          }
        }
      },
      orderBy: { created_at: 'asc' }
    });

    return NextResponse.json({
      success: true,
      comments,
      count: comments.length
    });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
