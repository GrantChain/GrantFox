import { ThemeProvider } from "@/hooks/theme-provider";
import { TanstackProvider } from "./tanstack.provider";
import { RoleSelectionProvider } from "./role-selection.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="system">
      <TanstackProvider>
        <RoleSelectionProvider>{children}</RoleSelectionProvider>
      </TanstackProvider>
    </ThemeProvider>
  );
};
