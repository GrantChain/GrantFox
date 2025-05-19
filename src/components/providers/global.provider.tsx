import { ThemeProvider } from "@/components/providers/theme.provider";
import { TanstackProvider } from "./tanstack.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="system">
      <TanstackProvider>{children}</TanstackProvider>
    </ThemeProvider>
  );
};
