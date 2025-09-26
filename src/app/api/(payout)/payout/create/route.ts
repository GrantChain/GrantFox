import { supabase } from "@/lib/supabase";
import { createId } from "@paralleldrive/cuid2";
import { NextResponse } from "next/server";
import { logger } from "@/lib/services/logger";

export async function POST(request: Request) {
  try {
    const payout = await request.json();
    const now = new Date().toISOString();

    const payoutWithId = {
      ...payout,
      payout_id: createId(),
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("payout")
      .insert([payoutWithId])
      .select()
      .single();

    if (error) {
      logger.error("Supabase insert error while creating payout", error, {
        action: "PAYOUT_CREATE",
        userId: payoutWithId.created_by ?? null,
        entityType: "PAYOUT",
        metadata: { payloadKeys: Object.keys(payoutWithId) },
      });
      return NextResponse.json(
        { error: `Error creating payout: ${error.message}` },
        { status: 500 },
      );
    }

    if (!data) {
      logger.error("No data returned from Supabase after payout creation", null, {
        action: "PAYOUT_CREATE",
        userId: payoutWithId.created_by ?? null,
        entityType: "PAYOUT",
      });
      return NextResponse.json(
        { error: "Failed to create payout" },
        { status: 500 },
      );
    }

    logger.info("Payout created successfully", {
      action: "PAYOUT_CREATE",
      userId: payoutWithId.created_by ?? null,
      entityType: "PAYOUT",
      metadata: { payout_id: data.payout_id },
    });

    return NextResponse.json(data);
  } catch (error) {
    logger.error("Error in create payout route", error, {
      action: "PAYOUT_CREATE",
      entityType: "PAYOUT",
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
