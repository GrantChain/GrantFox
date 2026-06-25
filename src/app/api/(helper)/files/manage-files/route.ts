import { logger } from "@/lib/services/logger";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payoutId = String(formData.get("payoutId") || "");
    const milestoneIdx = Number(String(formData.get("milestoneIdx") || "0"));
    const folder = String(formData.get("folder") || "evidence");

    const bucket = "evidences";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      logger.error("Missing Supabase server credentials", null, {
        action: "FILE_UPLOAD",
        entityType: "FILE",
      });
      return NextResponse.json(
        { success: false, message: "Missing Supabase server credentials" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    if (!bucket) {
      logger.error("Missing Supabase storage bucket", null, {
        action: "FILE_UPLOAD",
        entityType: "FILE",
      });
      return NextResponse.json(
        { success: false, message: "Missing Supabase storage bucket" },
        { status: 500 },
      );
    }

    if (!payoutId || Number.isNaN(milestoneIdx)) {
      return NextResponse.json(
        { success: false, message: "Invalid payoutId or milestoneIdx" },
        { status: 400 },
      );
    }

    const files: File[] = formData.getAll("files").filter(Boolean) as File[];
    if (!files.length) {
      return NextResponse.json(
        { success: true, paths: [] as string[] },
        { status: 200 },
      );
    }

    const uploadedPaths: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${payoutId}/${milestoneIdx}/${folder}/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false, cacheControl: "3600" });

      if (error) {
        errors.push(`${file.name}: ${error.message}`);
        logger.error("File upload error", error, {
          action: "FILE_UPLOAD",
          entityType: "FILE",
          metadata: {
            path,
            payoutId,
            milestoneIdx,
            folder,
            fileName: file.name,
          },
        });
        continue;
      }
      uploadedPaths.push(path);
    }

    logger.info("Files upload completed", {
      action: "FILE_UPLOAD",
      entityType: "FILE",
      metadata: {
        uploadedCount: uploadedPaths.length,
        errorCount: errors.length,
        payoutId,
      },
    });

    return NextResponse.json(
      { success: true, paths: uploadedPaths, errors },
      { status: 200 },
    );
  } catch (error) {
    logger.error("/api/files/manage-files error", error, {
      action: "FILE_UPLOAD",
      entityType: "FILE",
    });
    return NextResponse.json(
      { success: false, message: "Unexpected error" },
      { status: 500 },
    );
  }
}
