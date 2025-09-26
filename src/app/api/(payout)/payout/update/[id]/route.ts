import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { logger } from "@/lib/services/logger";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payout = await request.json();
    const { id } = await params;

    const { data, error } = await supabase
      .from("payout")
      .update(payout)
      .eq("payout_id", id)
      .select()
      .single();

    if (error) {
      logger.error("Supabase error updating payout", error, {
        action: "PAYOUT_UPDATE",
        entityType: "PAYOUT",
        metadata: { payout_id: id },
      });
      return NextResponse.json(
        { error: `Error updating payout: ${error.message}` },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: `Payout with ID ${id} not found` },
        { status: 404 },
      );
    }

    logger.info("Payout updated", {
      action: "PAYOUT_UPDATE",
      entityType: "PAYOUT",
      metadata: { payout_id: id },
    });

    return NextResponse.json(data);
  } catch (error) {
    logger.error("Error in update payout route", error, {
      action: "PAYOUT_UPDATE",
      entityType: "PAYOUT",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
