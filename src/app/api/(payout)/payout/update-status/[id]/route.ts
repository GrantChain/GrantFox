import { logger } from "@/lib/services/logger";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { status } = await request.json();
    const { id } = await params;

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("payout")
      .update({ status })
      .eq("payout_id", id)
      .select()
      .single();

    if (error) {
      logger.error("Supabase error updating payout status", error, {
        action: "PAYOUT_UPDATE_STATUS",
        entityType: "PAYOUT",
        metadata: { payout_id: id, status },
      });
      return NextResponse.json(
        { error: `Error updating status: ${error.message}` },
        { status: 500 },
      );
    }

    logger.info("Payout status updated", {
      action: "PAYOUT_UPDATE_STATUS",
      entityType: "PAYOUT",
      metadata: { payout_id: id, status: data?.status },
    });

    return NextResponse.json(data);
  } catch (error) {
    logger.error("/payout/update-status error", error, {
      action: "PAYOUT_UPDATE_STATUS",
      entityType: "PAYOUT",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
