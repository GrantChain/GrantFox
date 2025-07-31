"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { ChatInterface } from "./ChatInterface";

interface ChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const value: ChatContextType = {
    isChatOpen,
    openChat,
    closeChat,
    toggleChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
      <ChatInterface isOpen={isChatOpen} onToggle={setIsChatOpen} />
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
