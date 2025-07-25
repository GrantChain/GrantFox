import { InstallPWAButton } from "@/components/shared/install-pwa-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { ThemeToggle } from "../sidebar/theme-toggler";

export const HeaderLanding = (): React.JSX.Element => {
  return (
    <header className="px-10 sticky top-0 z-40 w-full border-x border-b rounded-br-3xl rounded-bl-3xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/favicon.ico"
            alt="GrantFox Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="text-xl font-bold">GrantFox</span>
        </div>
        <div className="flex items-center gap-4">
          <InstallPWAButton />
          <ThemeToggle />
          <Link href="/login" className="flex items-center">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
