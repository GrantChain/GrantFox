"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { persistLanguage } from "@/components/providers/i18n.provider";

type LanguageOption = {
  code: string;
  label: string;
  flag: string;
};

const LANGS: LanguageOption[] = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "es", label: "ES", flag: "🇪🇸" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState(i18n.language || "en");

  useEffect(() => {
    setCurrent(i18n.language);
  }, [i18n.language]);

  const handleChange = async (lng: string) => {
    if (lng === current) return;
    await i18n.changeLanguage(lng);
    persistLanguage(lng);
    setCurrent(lng);
  };

  const active = LANGS.find((l) => current.startsWith(l.code)) || LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Change language"
          className="relative"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Language</span>
          <span className="absolute -bottom-1 -right-1 text-[10px] font-semibold">
            {active.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {LANGS.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={
              lang.code === active.code ? "font-semibold" : "font-normal"
            }
            data-testid={`lang-${lang.code}`}
          >
            <span className="mr-2" role="img" aria-label={lang.label}>
              {lang.flag}
            </span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
