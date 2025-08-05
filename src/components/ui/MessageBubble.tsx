"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { useEffect } from "react";
import type { MessageBubbleProps } from "@/types/chatbot.types";

export const MessageBubble = ({
  message,
  isLastMessage,
  onAnimationComplete,
}: MessageBubbleProps) => {
  const isUser = message.sender === "user";

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (isLastMessage && onAnimationComplete) {
      const timer = setTimeout(onAnimationComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [isLastMessage, onAnimationComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar className={cn("w-8 h-8", isUser ? "order-2" : "order-1")}>
        <AvatarFallback
          className={cn(
            "text-xs",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
          )}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col max-w-[80%]",
          isUser ? "items-end order-1" : "items-start order-2",
        )}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.2,
            delay: 0.1,
          }}
          className={cn(
            "px-4 py-2 rounded-2xl text-sm break-words",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md",
          )}
        >
          {message.content}
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "text-xs text-muted-foreground mt-1",
            isUser ? "text-right" : "text-left",
          )}
        >
          {formatTime(message.timestamp)}
        </motion.span>
      </div>
    </motion.div>
  );
};
