"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../sidebar/theme-toggler";
import { useWallet } from "@/components/wallet/hooks/useWallet";
import { Wallet as WalletIcon } from "lucide-react";
import useLayoutDashboard from "@/hooks/useLayoutDashboard";

export const Header = () => {
  const { handleConnect, handleDisconnect, account } = useWallet();
  const isConnected = Boolean(account);
  const { label } = useLayoutDashboard();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-10">
        {label !== "Help" && label !== "Report Issue" && (
          <h2 className="text-2xl font-bold tracking-tight">{label}</h2>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="outline"
            size="default"
            onClick={isConnected ? handleDisconnect : handleConnect}
            className="flex items-center gap-2"
          >
            <WalletIcon className="h-4 w-4" />
            {isConnected ? "Disconnect" : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </header>
  );
};
