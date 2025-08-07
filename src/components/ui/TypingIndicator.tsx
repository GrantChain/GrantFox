"use client";

import { cn } from "@/lib/utils";
import type { TypingIndicatorProps } from "@/types/chatbot.types";
import { motion } from "framer-motion";

export const TypingIndicator = ({
  isVisible,
  className,
}: TypingIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-center space-x-1 p-3 bg-muted rounded-lg max-w-[200px]",
        className,
      )}
    >
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-muted-foreground rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-2">Typing...</span>
    </motion.div>
  );
};
