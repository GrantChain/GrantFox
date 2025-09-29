"use client";

import i18n from "@/i18n/config";
import { type ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

const LANG_STORAGE_KEY = "app_language";

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const persisted =
      typeof window !== "undefined"
        ? localStorage.getItem(LANG_STORAGE_KEY)
        : null;
    if (persisted && i18n.language !== persisted) {
      i18n.changeLanguage(persisted).finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null; // could add a small skeleton if needed

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export const persistLanguage = (lng: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANG_STORAGE_KEY, lng);
};
