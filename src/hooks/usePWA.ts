"use client";

import { useEffect, useState } from "react";

interface PWAState {
  isSupported: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isSupported: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    hasUpdate: false,
    registration: null,
  });

  useEffect(() => {
    // Check if service worker is supported
    const isSupported = "serviceWorker" in navigator;

    // Check if app is installed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

    setPwaState((prev) => ({
      ...prev,
      isSupported,
      isInstalled,
    }));

    // Register service worker
    if (isSupported) {
      navigator.serviceWorker
        .register("/sw-custom.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
          setPwaState((prev) => ({ ...prev, registration }));

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  setPwaState((prev) => ({ ...prev, hasUpdate: true }));
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Listen for online/offline events
    const handleOnline = () =>
      setPwaState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setPwaState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setPwaState((prev) => ({ ...prev, isInstalled: true }));
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const updateServiceWorker = () => {
    if (pwaState.registration?.waiting) {
      pwaState.registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return Notification.permission === "granted";
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (pwaState.registration && "showNotification" in pwaState.registration) {
      pwaState.registration.showNotification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        ...options,
      });
    }
  };

  return {
    ...pwaState,
    updateServiceWorker,
    requestNotificationPermission,
    sendNotification,
  };
};
