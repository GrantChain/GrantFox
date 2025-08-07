"use client";

import { ErrorLayout } from "@/components/layout/error-layout";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ErrorLayout
          title="Something went wrong!"
          description="We encountered an unexpected error. Our team has been notified and is working on a fix."
          showNavigation={false}
        >
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={reset} className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>

            {error.digest && (
              <p className="text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </ErrorLayout>
      </body>
    </html>
  );
}
