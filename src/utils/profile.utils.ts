import { supabase } from "@/lib/supabase";

/**
 * Deletes all avatars from the given userId folder,
 * except the one currently being used (if provided)
 */
export async function deleteOldAvatars(userId: string, keepFileName?: string) {
  const { data, error: listError } = await supabase.storage
    .from("avatars")
    .list(userId);

  if (listError) {
    console.warn("Failed to list avatars:", listError.message);
    return;
  }

  const filesToDelete =
    data
      ?.filter(
        (file) =>
          file.name !== keepFileName && file.name !== ".emptyFolderPlaceholder",
      )
      .map((file) => `${userId}/${file.name}`) ?? [];

  if (filesToDelete.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove(filesToDelete);

    if (deleteError) {
      console.warn("Failed to delete old avatars:", deleteError.message);
    }
  }
}
