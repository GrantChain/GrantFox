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
      return NextResponse.json(
        { error: `Error updating status: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("/payout/update-status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
