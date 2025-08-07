"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface ErrorLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showNavigation?: boolean;
}

export function ErrorLayout({
  children,
  title,
  description,
  showNavigation = true,
}: ErrorLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with navigation */}
      {showNavigation && (
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="h-4 w-px bg-border" />
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          </div>

          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Need help?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
