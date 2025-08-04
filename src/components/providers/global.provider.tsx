"use client";

import { ChatProvider } from "@/components/modules/chat/ChatProvider";
import { ThemeProvider } from "@/components/providers/theme.provider";
// import { PostHogProvider } from "./posthog.provider";
import { TanstackProvider } from "./tanstack.provider";
import { TrustlessWorkProvider } from "./trustless-work.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TrustlessWorkProvider>
      <ThemeProvider defaultTheme="system">
        {/* <PostHogProvider> */}
        <TanstackProvider>
          <ChatProvider>{children}</ChatProvider>
        </TanstackProvider>
        {/* </PostHogProvider> */}
      </ThemeProvider>
    </TrustlessWorkProvider>
  );
};
