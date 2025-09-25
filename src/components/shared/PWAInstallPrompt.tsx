"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Share, Plus } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const { isInstalled, hasUpdate, updateServiceWorker } = usePWA();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    // Check if iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream
    );

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the deferredPrompt so it can only be used once
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    // Force re-render to hide the prompt
    setDeferredPrompt(null);
  };

  // Show update prompt if available
  if (hasUpdate) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
        <div className="rounded-lg border bg-background p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Update Available</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                A new version of GrantFox is available. Update now for the latest features.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
              aria-label="Dismiss update prompt"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={updateServiceWorker}
              size="sm"
              className="flex-1"
              aria-label="Update GrantFox app"
            >
              <Download className="mr-2 h-4 w-4" />
              Update
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              aria-label="Not now"
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // For iOS, show instructions instead of custom prompt
  if (isIOS && !deferredPrompt) {
    // Check if user dismissed recently (within 7 days)
    const dismissedTime = localStorage.getItem("pwa-install-dismissed");
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return null;
      }
    }

    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
        <div className="rounded-lg border bg-background p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Install GrantFox</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                To install this app on your iOS device, tap the share button{" "}
                <Share className="inline h-3 w-3" /> and then &quot;Add to Home Screen&quot;{" "}
                <Plus className="inline h-3 w-3" />.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
              aria-label="Dismiss install prompt"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For other browsers, show custom prompt only if beforeinstallprompt is available
  if (!deferredPrompt) {
    return null;
  }

  // Check if user dismissed recently (within 7 days)
  const dismissedTime = localStorage.getItem("pwa-install-dismissed");
  if (dismissedTime) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) {
      return null;
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="rounded-lg border bg-background p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Install GrantFox</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Install our app for a better experience with offline access and faster loading.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="flex-1"
            aria-label="Install GrantFox app"
          >
            <Download className="mr-2 h-4 w-4" />
            Install
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            aria-label="Not now"
          >
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
};