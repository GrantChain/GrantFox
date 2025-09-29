/**
 * PATCH /api/comment/update/[id]
 * Update an existing comment (only author can edit)
 * 
 * Params: { id: string }
 * Body: { message: string, user_id: string }
 * Returns: { success: boolean, comment: Comment, message: string }
 */
import { commentUpdateSchema } from "@/components/modules/comment/schema/comment.schema";
import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = commentUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { message } = parsed.data;

    // Get user_id from request body
    let user_id: string = body.user_id;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the comment and verify ownership
    const existingComment = await prisma.comment.findUnique({
      where: { comment_id: id },
      select: { 
        comment_id: true, 
        user_id: true,
        payout_id: true
      }
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Verify that the user owns this comment
    if (existingComment.user_id !== user_id) {
      return NextResponse.json(
        { error: "You can only update your own comments" },
        { status: 403 }
      );
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { comment_id: id },
      data: { message },
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

    return NextResponse.json({
      success: true,
      comment: updatedComment,
      message: "Comment updated successfully"
    });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
