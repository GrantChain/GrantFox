"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Maximize2, Minimize2, Send, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatWindowProps } from "@/types/chatbot.types";

export const ChatWindow = ({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onMaximize,
  messages,
  isLoading,
  onSendMessage,
  onClearMessages,
  className,
}: ChatWindowProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  // Show typing indicator when loading
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    } else {
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");
    await onSendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearMessages = () => {
    if (messages.length > 0) {
      onClearMessages();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          height: isMinimized ? "60px" : "500px",
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className={cn(
          "fixed bottom-4 right-20 z-50 w-[350px] max-w-[90vw] sm:right-20 md:right-4",
          className,
        )}
      >
        <Card className="h-full shadow-2xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-yellow-500 text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">GrantFox Assistant</h3>
                  <p className="text-xs text-muted-foreground">
                    {isMinimized ? "Click to expand" : "Online"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {!isMinimized && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearMessages}
                      className="h-8 w-8 p-0"
                      disabled={messages.length === 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onMinimize}
                      className="h-8 w-8 p-0"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {isMinimized && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMaximize}
                    className="h-8 w-8 p-0"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <Separator />
              <CardContent className="p-0 flex flex-col h-[400px]">
                <ScrollArea className="flex-1 px-4 py-2">
                  <div className="space-y-2">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isLastMessage={index === messages.length - 1}
                        />
                      ))}
                    </AnimatePresence>

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4"
                      >
                        <TypingIndicator isVisible={true} />
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <Separator />

                <div className="p-4">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      size="sm"
                      className="px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
