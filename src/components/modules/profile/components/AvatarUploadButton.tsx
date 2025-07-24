"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface AvatarUploadButtonProps {
  userId: string;
  currentAvatarUrl?: string | null;
  userName?: string;
  onAvatarChange?: (url: string) => void;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AvatarUploadButton({
  userId,
  currentAvatarUrl,
  userName = "",
  onAvatarChange,
  className,
  disabled = false,
  size = "md",
}: AvatarUploadButtonProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadAvatar, isUploading, progress, error, success, resetState } =
    useAvatarUpload({
      userId,
      currentAvatarUrl,
      onSuccess: (url) => {
        setPreviewUrl(null);
        onAvatarChange?.(url);
      },
      onError: () => {
        setPreviewUrl(null);
      },
    });

  const handleFileSelect = useCallback(
    (file: File) => {
      if (disabled || isUploading) return;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Reset previous states
      resetState();

      // Upload file
      uploadAvatar(file);
    },
    [disabled, isUploading, resetState, uploadAvatar],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !isUploading) {
        setIsDragOver(true);
      }
    },
    [disabled, isUploading],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled || isUploading) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [disabled, isUploading, handleFileSelect],
  );

  const handleClick = useCallback(() => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  }, [disabled, isUploading]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
      e.target.value = "";
    },
    [handleFileSelect],
  );

  const clearPreview = useCallback(() => {
    setPreviewUrl(null);
    resetState();
  }, [resetState]);

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    resetState();
    onAvatarChange?.("");
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "w-20 h-20",
      upload: "w-6 h-6",
      text: "text-xs",
      progress: "w-24",
    },
    md: {
      container: "w-32 h-32",
      upload: "w-8 h-8",
      text: "text-sm",
      progress: "w-36",
    },
    lg: {
      container: "w-40 h-40",
      upload: "w-10 h-10",
      text: "text-base",
      progress: "w-44",
    },
  };

  const config = sizeConfig[size];
  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {/* Circular Upload/Preview Area */}
      <div className="relative">
        <div
          className={cn(
            "relative rounded-full border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden",
            config.container,
            "hover:border-primary/60 hover:bg-primary/5",
            isDragOver && "border-primary bg-primary/10 scale-105",
            disabled && "opacity-50 cursor-not-allowed",
            isUploading && "cursor-not-allowed",
            error && "border-red-300 bg-red-50 dark:bg-red-950/20",
            success && "border-green-300 bg-green-50 dark:bg-green-950/20",
            displayUrl && "border-solid border-gray-200 dark:border-gray-800",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          tabIndex={disabled ? -1 : 0}
          aria-label={
            displayUrl ? "Change avatar image" : "Upload avatar image"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {/* Content based on state */}
          {displayUrl ? (
            // Image Preview
            <div className="w-full h-full relative">
              <img
                src={displayUrl || "/placeholder.svg"}
                alt={userName || "Avatar preview"}
                className="w-full h-full object-cover rounded-full"
              />

              {/* Upload Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <Upload
                      className={cn(
                        "mx-auto text-white animate-pulse mb-1",
                        config.upload,
                      )}
                    />
                    <div className="text-white text-xs font-medium">
                      {Math.round(progress)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Upload Prompt
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              {isUploading ? (
                <>
                  <Upload
                    className={cn(
                      "text-primary animate-pulse mb-2",
                      config.upload,
                    )}
                  />
                  <div
                    className={cn(
                      "text-muted-foreground font-medium",
                      config.text,
                    )}
                  >
                    {Math.round(progress)}%
                  </div>
                </>
              ) : (
                <>
                  <Upload
                    className={cn("text-muted-foreground mb-2", config.upload)}
                  />
                  <div
                    className={cn(
                      "text-muted-foreground text-center leading-tight",
                      config.text,
                    )}
                  >
                    <div className="font-medium">Upload</div>
                    <div className="opacity-75">Avatar</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Remove Button - positioned outside the circular container */}
        {currentAvatarUrl && !isUploading && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={handleRemoveAvatar}
            className="absolute top-2 right-2 w-7 h-7 rounded-full z-10 shadow-lg"
            aria-label="Remove avatar"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Clear Preview Button - only show for preview */}
        {previewUrl && !isUploading && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              clearPreview();
            }}
            className="absolute top-1 right-1 w-7 h-7 rounded-full z-10 bg-muted hover:bg-muted/80"
            aria-label="Remove preview"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className={cn("space-y-1", config.progress)}>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            Uploading...
          </p>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center max-w-sm">
          {error}
        </p>
      )}

      {success && !isUploading && (
        <p className="text-sm text-green-600 dark:text-green-400 text-center max-w-sm">
          Avatar uploaded successfully!
        </p>
      )}

      {/* Upload Guidelines */}
      {!displayUrl && (
        <div className="text-xs text-center text-muted-foreground max-w-sm space-y-1">
          <p>JPEG, PNG, or WebP • Max 5MB</p>
          <p>Images resized to 400×400px</p>
        </div>
      )}
    </div>
  );
}
