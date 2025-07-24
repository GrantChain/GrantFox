"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface UseAvatarUploadOptions {
  userId: string;
  currentAvatarUrl?: string | null;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export function useAvatarUpload({
  userId,
  currentAvatarUrl,
  onSuccess,
  onError,
}: UseAvatarUploadOptions) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
  });

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, and WebP formats are allowed";
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  }, []);

  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Set canvas dimensions to 400x400
        canvas.width = 400;
        canvas.height = 400;

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Calculate scaling to maintain aspect ratio
        const scale = Math.min(400 / img.width, 400 / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Center the image
        const x = (400 - scaledWidth) / 2;
        const y = (400 - scaledHeight) / 2;

        // Fill background with white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 400, 400);

        // Draw the scaled image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Could not compress image"));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          file.type,
          0.9, // Quality setting
        );
      };

      img.onerror = () => reject(new Error("Could not load image"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const deleteCurrentAvatar = useCallback(
    async (avatarUrl: string): Promise<void> => {
      try {
        // Extract file path from URL
        const urlParts = avatarUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${userId}/${fileName}`;

        const { error } = await supabase.storage
          .from("avatars")
          .remove([filePath]);

        if (error) {
          console.warn("Could not delete previous avatar:", error.message);
          // Don't throw error as this shouldn't block the upload
        }
      } catch (error) {
        console.warn("Error deleting previous avatar:", error);
      }
    },
    [userId],
  );

  const uploadAvatar = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        setUploadState({
          isUploading: true,
          progress: 0,
          error: null,
          success: false,
        });

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        // Update progress
        setUploadState((prev) => ({ ...prev, progress: 20 }));

        // Compress image
        const compressedFile = await compressImage(file);
        setUploadState((prev) => ({ ...prev, progress: 40 }));

        // Delete current avatar if exists
        if (currentAvatarUrl) {
          await deleteCurrentAvatar(currentAvatarUrl);
        }
        setUploadState((prev) => ({ ...prev, progress: 60 }));

        // Generate unique filename
        const fileExt = compressedFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // Upload to Supabase
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(filePath, compressedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw new Error(`Upload failed: ${error.message}`);
        }

        setUploadState((prev) => ({ ...prev, progress: 80 }));

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(data.path);

        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
          success: true,
        });

        onSuccess?.(publicUrl);
        return publicUrl;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setUploadState({
          isUploading: false,
          progress: 0,
          error: errorMessage,
          success: false,
        });

        onError?.(errorMessage);
        return null;
      }
    },
    [
      userId,
      currentAvatarUrl,
      validateFile,
      compressImage,
      deleteCurrentAvatar,
      onSuccess,
      onError,
    ],
  );

  const resetState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
    });
  }, []);

  return {
    uploadAvatar,
    resetState,
    ...uploadState,
  };
}
