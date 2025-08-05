"use client";

import { useEffect } from "react";
import { ChatbotFloat } from "./ChatbotFloat";
import { ChatWindow } from "./ChatWindow";
import { useChatbot } from "@/hooks/useChatbot";
import type { ChatbotConfig } from "@/types/chatbot.types";

interface FloatingChatbotProps {
  config?: Partial<ChatbotConfig>;
  className?: string;
}

export const FloatingChatbot = ({
  config,
  className,
}: FloatingChatbotProps) => {
  const { state, actions } = useChatbot(config);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (state.isOpen) {
      actions.markAsRead();
    }
  }, [state.isOpen, actions]);

  return (
    <>
      {/* Floating Button */}
      <ChatbotFloat
        isOpen={state.isOpen}
        unreadCount={state.unreadCount}
        hasNewMessage={state.hasNewMessage}
        onClick={actions.toggleChat}
        className={className}
      />

      {/* Chat Window */}
      <ChatWindow
        isOpen={state.isOpen}
        isMinimized={state.isMinimized}
        onClose={actions.closeChat}
        onMinimize={actions.minimizeChat}
        onMaximize={actions.maximizeChat}
        messages={state.messages}
        isLoading={state.isLoading}
        onSendMessage={actions.sendMessage}
        onClearMessages={actions.clearMessages}
      />
    </>
  );
};
