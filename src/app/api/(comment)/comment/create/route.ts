/**
 * POST /api/comment/create
 * 
 * Body: { message: string, user_id: string, payout_id: string }
 * Returns: { success: boolean, comment: Comment, message: string }
 */
import { commentCreateSchema } from "@/components/modules/comment/schema/comment.schema";
import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = commentCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { message, user_id, payout_id } = parsed.data;

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { user_id },
      select: { user_id: true, is_active: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: "User account is not active" },
        { status: 403 }
      );
    }

    // Find the payout in the database
    const payout = await prisma.payout.findUnique({
      where: { payout_id },
      select: { 
        payout_id: true,
        status: true,
        created_by: true
      }
    });

    if (!payout) {
      return NextResponse.json(
        { error: "Payout not found" },
        { status: 404 }
      );
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        message,
        user_id,
        payout_id,
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            profile_url: true,
            bio: true,
          }
        }
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        comment,
        message: "Comment created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}