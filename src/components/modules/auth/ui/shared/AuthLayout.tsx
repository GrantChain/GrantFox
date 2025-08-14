import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  footer?: ReactNode;
}

export const AuthLayout = ({
  children,
  title,
  description,
  footer,
}: AuthLayoutProps) => {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 grid-cols-1">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-center text-center justify-center gap-4">
                <Link href="/">
                  <Image
                    src="/favicon.ico"
                    alt="GrantFox"
                    width={120}
                    height={120}
                  />
                </Link>

                <Separator
                  orientation="vertical"
                  className="h-32 mx-4 bg-gray-400 hidden md:block"
                />

                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">{title}</h1>
                  {description && (
                    <p className="text-balance text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              {children}
            </div>
          </div>
        </CardContent>
      </Card>
      {footer && (
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          {footer}
        </div>
      )}
    </div>
  );
};
