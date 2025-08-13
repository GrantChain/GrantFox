import type { ProfileUpdatePayload } from "../schemas/profile.schema";
import { http } from "@/lib/axios";

class ProfileService {
  async update(payload: ProfileUpdatePayload): Promise<{ success: boolean }> {
    const res = await http.patch<{ success: boolean }>("/profile", payload);
    return res.data;
  }

  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{ publicUrl: string }> {
    const formData = new FormData();
    formData.set("userId", userId);
    formData.set("file", file);

    const res = await http.post<{ publicUrl: string }>(
      "/files/upload-avatar",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data;
  }
}

export const profileService = new ProfileService();
