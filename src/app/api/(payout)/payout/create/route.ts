import { supabase } from "@/lib/supabase";
import { createId } from "@paralleldrive/cuid2";
import { NextResponse } from "next/server";

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
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Error creating payout: ${error.message}` },
        { status: 500 },
      );
    }

    if (!data) {
      console.error("No data returned from Supabase");
      return NextResponse.json(
        { error: "Failed to create payout" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in create payout route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
