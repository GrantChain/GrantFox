import Eliza from "eliza";

// Types for context data
export interface UserContext {
  user_id: string;
  email: string;
  username?: string;
  role: "GRANTEE" | "PAYOUT_PROVIDER" | "ADMIN";
  wallet_address?: string;
  bio?: string;
  location?: string;
  profile_url?: string;
  cover_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface GranteeContext {
  user_id: string;
  name?: string;
  position_title?: string;
  social_media?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface PayoutProviderContext {
  user_id: string;
  organization_name?: string;
  network_type?: string;
  email?: string;
}

export interface TransactionContext {
  payout_id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  created_at: Date;
  updated_at: Date;
}

export interface ChatContext {
  user: UserContext;
  grantee?: GranteeContext;
  payoutProvider?: PayoutProviderContext;
  transactions?: TransactionContext[];
  currentSession: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  context?: Record<string, unknown>;
}

// Predefined conversation flows
const CONVERSATION_FLOWS = {
  PROFILE_HELP: {
    keywords: ["profile", "account", "settings", "update", "edit"],
    responses: [
      "I can help you with your profile! You can update your information in the Profile section. What would you like to change?",
      "To update your profile, go to the Profile page in your dashboard. What specific information would you like to modify?",
      "Your profile settings are accessible from the main menu. What would you like to know about your account?",
    ],
  },
  TRANSACTION_STATUS: {
    keywords: ["transaction", "payment", "payout", "status", "money", "fund"],
    responses: [
      "I can help you check your transaction status. Let me look up your recent activity.",
      "To check your transaction status, you can view your payout history in the dashboard. What specific transaction are you looking for?",
      "Your transaction information is available in the Payouts section. Would you like me to help you navigate there?",
    ],
  },
  GENERAL_HELP: {
    keywords: ["help", "support", "assist", "guide", "how"],
    responses: [
      "I'm here to help! What specific question do you have about GrantFox?",
      "I can assist you with profile management, transaction status, and general platform questions. What do you need help with?",
      "Welcome to GrantFox support! How can I assist you today?",
    ],
  },
  ROLE_SPECIFIC: {
    GRANTEE: {
      keywords: ["grant", "funding", "project", "milestone"],
      responses: [
        "As a grantee, you can manage your projects and milestones in the dashboard. What would you like to know?",
        "I can help you with grant-related questions. Are you looking for information about your current projects?",
        "Your grantee dashboard shows your active projects and milestones. What specific information do you need?",
      ],
    },
    PAYOUT_PROVIDER: {
      keywords: ["escrow", "release", "provider", "organization"],
      responses: [
        "As a payout provider, you can manage escrows and releases in your dashboard. What would you like to know?",
        "I can help you with escrow management and payout processes. What specific question do you have?",
        "Your provider dashboard shows active escrows and pending releases. How can I assist you?",
      ],
    },
  },
};

// Fallback responses for unrecognized inputs
const FALLBACK_RESPONSES = [
  "I'm not sure I understand. Could you rephrase that or ask about profile management, transaction status, or general help?",
  "I'm here to help with GrantFox-related questions. Try asking about your profile, transactions, or how to use the platform.",
  "I didn't catch that. You can ask me about your account, payments, or how to navigate the platform.",
  "Let me help you better. You can ask about profile settings, transaction status, or general platform questions.",
];

export class ElizaChatbot {
  private eliza: Eliza;
  private context: ChatContext | null = null;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.eliza = new Eliza();
  }

  // Set user context for personalized responses
  setContext(context: ChatContext): void {
    this.context = context;
  }

  // Get context-aware response
  getResponse(userInput: string): ChatResponse {
    const messageId = this.generateMessageId();
    const timestamp = new Date();

    // Add user message to history
    this.conversationHistory.push({
      id: messageId,
      content: userInput,
      sender: "user",
      timestamp,
    });

    // Process the input and generate response
    const response = this.processInput(userInput);

    // Add bot response to history
    this.conversationHistory.push({
      id: this.generateMessageId(),
      content: response.message,
      sender: "bot",
      timestamp: new Date(),
      context: response.context,
    });

    return response;
  }

  private processInput(input: string): ChatResponse {
    const lowerInput = input.toLowerCase();

    // Check for predefined conversation flows
    const flowResponse = this.checkConversationFlows(lowerInput);
    if (flowResponse) {
      return flowResponse;
    }

    // Check for role-specific responses
    if (this.context?.user.role) {
      const roleResponse = this.checkRoleSpecificFlows(
        lowerInput,
        this.context.user.role,
      );
      if (roleResponse) {
        return roleResponse;
      }
    }

    // Use Eliza for general conversation
    const elizaResponse = this.eliza.transform(input);

    // If Eliza doesn't provide a good response, use fallback
    if (!elizaResponse || elizaResponse === input) {
      return {
        message: this.getRandomFallbackResponse(),
        suggestions: this.getSuggestions(),
      };
    }

    return {
      message: elizaResponse,
      suggestions: this.getSuggestions(),
    };
  }

  private checkConversationFlows(input: string): ChatResponse | null {
    for (const [flowKey, flow] of Object.entries(CONVERSATION_FLOWS)) {
      if (flowKey === "ROLE_SPECIFIC") continue; // Handle separately

      const typedFlow = flow as { keywords: string[]; responses: string[] };
      const hasKeyword = typedFlow.keywords.some((keyword: string) =>
        input.includes(keyword),
      );
      if (hasKeyword) {
        return {
          message: this.getRandomResponse(typedFlow.responses),
          suggestions: this.getSuggestions(),
          context: { flow: flowKey },
        };
      }
    }
    return null;
  }

  private checkRoleSpecificFlows(
    input: string,
    role: string,
  ): ChatResponse | null {
    const roleFlows = CONVERSATION_FLOWS.ROLE_SPECIFIC;

    if (role === "GRANTEE" && roleFlows.GRANTEE) {
      const hasKeyword = roleFlows.GRANTEE.keywords.some((keyword) =>
        input.includes(keyword),
      );
      if (hasKeyword) {
        return {
          message: this.getRandomResponse(roleFlows.GRANTEE.responses),
          suggestions: this.getSuggestions(),
          context: { flow: "GRANTEE_SPECIFIC" },
        };
      }
    }

    if (role === "PAYOUT_PROVIDER" && roleFlows.PAYOUT_PROVIDER) {
      const hasKeyword = roleFlows.PAYOUT_PROVIDER.keywords.some((keyword) =>
        input.includes(keyword),
      );
      if (hasKeyword) {
        return {
          message: this.getRandomResponse(roleFlows.PAYOUT_PROVIDER.responses),
          suggestions: this.getSuggestions(),
          context: { flow: "PAYOUT_PROVIDER_SPECIFIC" },
        };
      }
    }

    return null;
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getRandomFallbackResponse(): string {
    return FALLBACK_RESPONSES[
      Math.floor(Math.random() * FALLBACK_RESPONSES.length)
    ];
  }

  private getSuggestions(): string[] {
    const baseSuggestions = [
      "Update my profile",
      "Check transaction status",
      "Get help with the platform",
    ];

    if (this.context?.user.role === "GRANTEE") {
      baseSuggestions.push("View my projects", "Check milestone status");
    } else if (this.context?.user.role === "PAYOUT_PROVIDER") {
      baseSuggestions.push("Manage escrows", "View pending releases");
    }

    return baseSuggestions;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get conversation history
  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Get context-aware greeting
  getGreeting(): string {
    if (!this.context) {
      return "Hello! I'm your GrantFox assistant. How can I help you today?";
    }

    const { user } = this.context;
    const timeOfDay = new Date().getHours();
    let greeting = "";

    if (timeOfDay < 12) {
      greeting = "Good morning";
    } else if (timeOfDay < 17) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    return `${greeting}${user.username ? `, ${user.username}` : ""}! I'm your GrantFox assistant. How can I help you today?`;
  }
}

// Create singleton instance
export const elizaChatbot = new ElizaChatbot();
