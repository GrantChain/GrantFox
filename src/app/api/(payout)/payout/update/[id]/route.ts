import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payout = await request.json();
    const { id } = await params;

    console.log(payout);

    const { data, error } = await supabase
      .from("payout")
      .update(payout)
      .eq("payout_id", id)
      .select()
      .single();

    if (error) {
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

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in update payout route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
