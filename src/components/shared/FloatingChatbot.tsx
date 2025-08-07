"use client";

import { useChatbot } from "@/hooks/useChatbot";
import type { ChatbotConfig } from "@/types/chatbot.types";
import { useEffect, useState } from "react";
import { ChatWindow } from "../shared/ChatWindow";
import { ChatbotFloat } from "../shared/ChatbotFloat";

interface FloatingChatbotProps {
  config?: Partial<ChatbotConfig>;
  className?: string;
}

export const FloatingChatbot = ({
  config,
  className,
}: FloatingChatbotProps) => {
  const [isClient, setIsClient] = useState(false);
  const { state, actions } = useChatbot(config);

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (state.isOpen) {
      actions.markAsRead();
    }
  }, [state.isOpen, actions]);

  // Don't render anything on server
  if (!isClient) {
    return null;
  }

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
