/**
 * DELETE /api/comment/delete/[id]
 * Deletes an existing comment (only author can edit)
 * 
 * Params: { id: string }
 * Body: { user_id: string }
 * Returns: { success: boolean, message: string }
 */
import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id || id === "undefined" || id === "null") {
      return NextResponse.json(
        { error: "Invalid comment ID parameter" },
        { status: 400 }
      );
    }

    // Get user_id from request body
    let user_id: string = body.user_id;
    
    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the comment in the database
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
        { error: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { comment_id: id }
    });

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
