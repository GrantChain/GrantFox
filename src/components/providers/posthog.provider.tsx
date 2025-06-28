"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect, useState } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    // Only initialize PostHog if the key is provided and we're on the client
    if (
      typeof window !== "undefined" &&
      posthogKey &&
      posthogKey.trim() !== ""
    ) {
      posthog.init(posthogKey, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
        ui_host: "https://us.posthog.com",
        capture_pageview: false, // We capture pageviews manually
        capture_pageleave: true,
        debug: false,
        // Performance optimizations
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") posthog.debug();
        },
        // Reduce network requests - removed batch_size as it's not a valid PostHog config option
        // Disable unnecessary features for performance
        disable_session_recording: process.env.NODE_ENV === "development",
        disable_surveys: true,
        // Optimize for performance
        request_batching: true,
        sanitize_properties: (properties) => {
          const { $ip, ...sanitized } = properties;
          // Use the $ip variable to avoid unused variable warning
          console.debug("Sanitized IP:", $ip ? "[REDACTED]" : "none");
          return sanitized;
        },
      });
      setIsInitialized(true);
    } else {
      // Don't show warning in development if keys are intentionally empty
      if (
        process.env.NODE_ENV === "production" ||
        (posthogKey && posthogKey.trim() !== "")
      ) {
        console.warn(
          "[PostHog] No API key provided. PostHog analytics will be disabled.",
        );
      }
      setIsInitialized(true);
    }
  }, []);

  // Wait for initialization to prevent hydration mismatch
  if (!isInitialized) {
    return <>{children}</>;
  }

  // If no PostHog key, just render children without PostHog provider
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!posthogKey || posthogKey.trim() === "") {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={<>{children}</>}>
        <PostHogPageView />
        {children}
      </Suspense>
    </PHProvider>
  );
}

// Optimized page view tracking
function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }

      // Debounce page view tracking
      const timeoutId = setTimeout(() => {
        posthog.capture("$pageview", {
          $current_url: url,
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
