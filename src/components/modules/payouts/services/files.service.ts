import { http } from "@/lib/axios";

class FilesService {
  async upload(params: {
    payoutId: string;
    milestoneIdx: number;
    folder: "evidence" | "feedback";
    files: File[];
  }): Promise<{ success: boolean; paths: string[]; errors?: string[] }> {
    const { payoutId, milestoneIdx, folder, files } = params;

    const form = new FormData();
    form.set("payoutId", payoutId);
    form.set("milestoneIdx", String(milestoneIdx));
    form.set("folder", folder);
    for (const f of files) form.append("files", f);

    const res = await http.post("/files/manage-files", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!res.data?.success) {
      throw new Error(res.data?.message || "Upload failed");
    }
    return res.data as { success: boolean; paths: string[]; errors?: string[] };
  }
}

export const filesService = new FilesService();
