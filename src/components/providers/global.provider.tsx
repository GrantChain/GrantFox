"use client";

import { ThemeProvider } from "@/components/providers/theme.provider";
import { PayoutContextProvider } from "../modules/payouts/context/PayoutContext";
import { PostHogProvider } from "./posthog.provider";
import { TanstackProvider } from "./tanstack.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="system">
      <PostHogProvider>
        <TanstackProvider>
          <PayoutContextProvider>{children}</PayoutContextProvider>
        </TanstackProvider>
      </PostHogProvider>
    </ThemeProvider>
  );
};
