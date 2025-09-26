import { logger } from "@/lib/services/logger";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from("payout")
      .delete()
      .eq("payout_id", id);

    if (error) {
      logger.error("Supabase error deleting payout", error, {
        action: "PAYOUT_DELETE",
        entityType: "PAYOUT",
        metadata: { payout_id: id },
      });
      return NextResponse.json(
        { error: `Error deleting payout: ${error.message}` },
        { status: 500 },
      );
    }

    logger.info("Payout deleted", {
      action: "PAYOUT_DELETE",
      entityType: "PAYOUT",
      metadata: { payout_id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error in delete payout route", error, {
      action: "PAYOUT_DELETE",
      entityType: "PAYOUT",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
