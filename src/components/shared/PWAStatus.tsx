"use client";

import { Badge } from "@/components/ui/badge";
import { usePWA } from "@/hooks/usePWA";
import { CheckCircle, Download, Wifi, WifiOff } from "lucide-react";

export const PWAStatus = () => {
  const { isSupported, isInstalled, isOnline, hasUpdate } = usePWA();

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2">
      {/* Online/Offline Status */}
      <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
        {isOnline ? (
          <>
            <Wifi className="mr-1 h-3 w-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="mr-1 h-3 w-3" />
            Offline
          </>
        )}
      </Badge>

      {/* Installation Status */}
      {isInstalled && (
        <Badge variant="secondary" className="text-xs">
          <CheckCircle className="mr-1 h-3 w-3" />
          Installed
        </Badge>
      )}

      {/* Update Available */}
      {hasUpdate && (
        <Badge variant="outline" className="text-xs">
          <Download className="mr-1 h-3 w-3" />
          Update Available
        </Badge>
      )}
    </div>
  );
};
