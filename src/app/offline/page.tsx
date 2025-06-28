import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <WifiOff className="h-24 w-24 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            You&apos;re Offline
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            It looks like you&apos;ve lost your internet connection. Some
            features may not be available.
          </p>
        </div>

        <Button onClick={() => window.location.reload()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>

        <div className="text-sm text-muted-foreground">
          <p>You can still browse cached content while offline.</p>
        </div>
      </div>
    </div>
  );
}
