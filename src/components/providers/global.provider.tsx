import { ThemeProvider } from "@/components/providers/theme.provider";
import { TanstackProvider } from "./tanstack.provider";
import { PostHogProvider } from "./posthog.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="system">
      <PostHogProvider>
        <TanstackProvider>{children}</TanstackProvider>
      </PostHogProvider>
    </ThemeProvider>
  );
};
