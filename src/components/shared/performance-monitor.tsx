"use client";

import { useEffect } from "react";

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "performance" in window) {
      // Monitor LCP (Largest Contentful Paint)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime);
            // Send to analytics if needed
          }
        }
      });

      try {
        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch {
        // Fallback for browsers that don't support this
      }

      // Monitor CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            !(entry as PerformanceEntry & { hadRecentInput?: boolean })
              .hadRecentInput
          ) {
            clsValue += (entry as PerformanceEntry & { value: number }).value;
          }
        }
        // Use clsValue to avoid unused variable warning
        console.debug("Current CLS value:", clsValue);
      });

      try {
        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch {
        // Fallback for browsers that don't support this
      }

      // Monitor FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(
            "FID:",
            (entry as PerformanceEntry & { processingStart: number })
              .processingStart - entry.startTime,
          );
        }
      });

      try {
        fidObserver.observe({ entryTypes: ["first-input"] });
      } catch {
        // Fallback for browsers that don't support this
      }

      return () => {
        observer.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    }
  }, []);

  return null;
}
