"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useChat } from "./ChatProvider";

interface ChatButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showBadge?: boolean;
  badgeCount?: number;
}

export function ChatButton({
  variant = "ghost",
  size = "icon",
  className,
  showBadge = false,
  badgeCount = 0,
}: ChatButtonProps) {
  const { toggleChat } = useChat();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleChat}
      className={`relative ${className}`}
      aria-label="Open chat assistant"
    >
      <MessageCircle className="h-4 w-4" />
      {showBadge && badgeCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </Badge>
      )}
    </Button>
  );
}
