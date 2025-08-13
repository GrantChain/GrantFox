import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = String(formData.get("userId") || "");
    const file = formData.get("file") as File | null;

    if (!userId || !file) {
      return NextResponse.json(
        { message: "Missing userId or file" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    const bucket = "avatars";

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { message: "Missing Supabase credentials" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;

    return NextResponse.json({ publicUrl }, { status: 200 });
  } catch (error) {
    console.error("/api/(helper)/files/upload-avatar error:", error);
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
  }
}
