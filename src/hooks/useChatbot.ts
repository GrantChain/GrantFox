"use client";

import type {
  ChatActions,
  ChatMessage,
  ChatState,
  ChatbotConfig,
} from "@/types/chatbot.types";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CONFIG: ChatbotConfig = {
  position: "bottom-right",
  theme: "auto",
  showNotificationBadge: true,
  enableSound: true,
  autoOpen: false,
  maxHeight: "500px",
  minWidth: "350px",
};

// Generate stable session ID
const generateStableSessionId = () => {
  return `chat_${Math.random().toString(36).substring(2, 15)}`;
};

// Generate stable message ID
const generateStableMessageId = (prefix: string) => {
  return `${prefix}_${Math.random().toString(36).substring(2, 15)}`;
};

export const useChatbot = (config: Partial<ChatbotConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<ChatState>({
    isOpen: finalConfig.autoOpen || false,
    isMinimized: false,
    messages: [],
    isLoading: false,
    unreadCount: 0,
    hasNewMessage: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionId = useRef(generateStableSessionId());

  // Initialize audio for sound effects
  useEffect(() => {
    if (finalConfig.enableSound && typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.3;
    }
  }, [finalConfig.enableSound]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (finalConfig.enableSound && audioRef.current) {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (
        window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  }, [finalConfig.enableSound]);

  // Load initial greeting
  const loadGreeting = useCallback(async () => {
    try {
      const response = await fetch("/api/chat?action=greeting");
      const data = await response.json();

      if (data.success) {
        const greetingMessage: ChatMessage = {
          id: generateStableMessageId("greeting"),
          content: data.greeting,
          sender: "bot",
          timestamp: new Date(),
        };
        setState((prev) => ({
          ...prev,
          messages: [greetingMessage],
        }));
      }
    } catch (error) {
      console.error("Error loading greeting:", error);
      // Fallback greeting
      const fallbackMessage: ChatMessage = {
        id: generateStableMessageId("greeting"),
        content:
          "Hello! I'm here to help you with GrantFox. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
      };
      setState((prev) => ({
        ...prev,
        messages: [fallbackMessage],
      }));
    }
  }, []);

  // Send message to API
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || state.isLoading) return;

      const userMessage: ChatMessage = {
        id: generateStableMessageId("user"),
        content: content.trim(),
        sender: "user",
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
      }));

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content.trim(),
            sessionId: sessionId.current,
          }),
        });

        const data = await response.json();
        console.log("Chat API response:", data); // Debug log

        if (data.success) {
          const botMessage: ChatMessage = {
            id: generateStableMessageId("bot"),
            content: data.response.message || data.response,
            sender: "bot",
            timestamp: new Date(),
          };

          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
            isLoading: false,
            unreadCount: prev.isOpen ? 0 : prev.unreadCount + 1,
            hasNewMessage: !prev.isOpen,
          }));

          // Play notification sound for bot messages
          if (!state.isOpen) {
            playNotificationSound();
          }
        } else {
          throw new Error(data.error || "Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);

        const errorMessage: ChatMessage = {
          id: generateStableMessageId("error"),
          content:
            "Sorry, I'm having trouble processing your request. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          isLoading: false,
        }));
      }
    },
    [state.isLoading, state.isOpen, playNotificationSound],
  );

  // Chat actions
  const openChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      isMinimized: false,
      unreadCount: 0,
      hasNewMessage: false,
    }));
  }, []);

  const closeChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      isMinimized: false,
    }));
  }, []);

  const toggleChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      isMinimized: false,
      unreadCount: 0,
      hasNewMessage: false,
    }));
  }, []);

  const minimizeChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isMinimized: true,
    }));
  }, []);

  const maximizeChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isMinimized: false,
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
    }));
  }, []);

  const markAsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      unreadCount: 0,
      hasNewMessage: false,
    }));
  }, []);

  // Load greeting when chat opens for the first time
  useEffect(() => {
    if (state.isOpen && state.messages.length === 0) {
      loadGreeting();
    }
  }, [state.isOpen, state.messages.length, loadGreeting]);

  const actions: ChatActions = {
    openChat,
    closeChat,
    toggleChat,
    minimizeChat,
    maximizeChat,
    sendMessage,
    clearMessages,
    markAsRead,
  };

  return {
    state,
    actions,
    config: finalConfig,
  };
};
