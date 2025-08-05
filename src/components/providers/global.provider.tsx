"use client";

import { ThemeProvider } from "@/components/providers/theme.provider";
import { FloatingChatbot } from "@/components/ui/FloatingChatbot";
// import { PostHogProvider } from "./posthog.provider";
import { TanstackProvider } from "./tanstack.provider";
import { TrustlessWorkProvider } from "./trustless-work.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TrustlessWorkProvider>
      <ThemeProvider defaultTheme="system">
        {/* <PostHogProvider> */}
        <TanstackProvider>
          {children}
          <FloatingChatbot />
        </TanstackProvider>
        {/* </PostHogProvider> */}
      </ThemeProvider>
    </TrustlessWorkProvider>
  );
};
