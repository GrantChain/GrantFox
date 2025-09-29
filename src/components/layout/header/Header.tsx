"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/wallet/hooks/useWallet";
import useLayoutDashboard from "@/hooks/useLayoutDashboard";
import { Wallet as WalletIcon } from "lucide-react";
import { MobileTrigger } from "../sidebar/mobile-trigger";
import { ThemeToggle } from "../sidebar/theme-toggler";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export const Header = () => {
  const { handleConnect, handleDisconnect, account } = useWallet();
  const { t } = useTranslation();
  const isConnected = Boolean(account);
  const { label } = useLayoutDashboard();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-10">
        <MobileTrigger />

        {label !== "Help" && label !== "Report Issue" && (
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            {t(`header.${label.replace(/\s+/g, "").toLowerCase()}`, label)}
          </h2>
        )}

        <div className="flex items-center gap-4">
          {/* <NotificationButton /> */}
          <ThemeToggle />
          <LanguageSwitcher />
          <Button
            variant="outline"
            size="default"
            onClick={isConnected ? handleDisconnect : handleConnect}
            className="flex items-center gap-2"
          >
            <WalletIcon className="h-4 w-4" />
            {isConnected ? t("header.disconnect") : t("header.connectWallet")}
          </Button>
        </div>
      </div>
    </header>
  );
};
