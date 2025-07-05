"use client";

import { useTheme } from "@/components/providers/theme.provider";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import * as React from "react";

export function ThemeToggleSwitch() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4" />
    </div>
  );
}
