"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import type { ChatbotFloatProps } from "@/types/chatbot.types";

export const ChatbotFloat = ({
  isOpen,
  unreadCount,
  hasNewMessage,
  onClick,
  className,
}: ChatbotFloatProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className={cn(
        "fixed bottom-4 right-20 z-40 sm:right-20 md:right-4",
        className,
      )}
    >
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "relative w-14 h-14 rounded-full shadow-2xl border-2",
          "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
          "transition-all duration-300 ease-in-out",
          hasNewMessage && "animate-pulse",
          isOpen && "scale-90",
        )}
        aria-label="Open chat assistant"
      >
        <motion.div
          animate={{
            scale: hasNewMessage ? [1, 1.1, 1] : 1,
            rotate: hasNewMessage ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: hasNewMessage ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.div>

        {/* Notification badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              delay: 0.1,
            }}
            className="absolute -top-2 -right-2"
          >
            <Badge
              variant="destructive"
              className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold border-2 border-background"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          </motion.div>
        )}

        {/* Pulse ring for new messages */}
        {hasNewMessage && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </Button>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-foreground text-background text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
      >
        {unreadCount > 0
          ? `${unreadCount} new message${unreadCount > 1 ? "s" : ""}`
          : "Chat with GrantFox Assistant"}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
      </motion.div>
    </motion.div>
  );
};
