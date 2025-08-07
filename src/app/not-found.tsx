"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorIllustration } from "@/components/ui/error-illustration";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Home, Mail, RefreshCw, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Error Illustration */}
        <div className="flex justify-center">
          <ErrorIllustration />
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Oops! Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Don't
            worry, let's get you back on track!
          </p>
        </div>

        {/* Quick Search */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for what you need..."
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const query = (e.target as HTMLInputElement).value;
                      if (query.trim()) {
                        window.location.href = `/search?q=${encodeURIComponent(query)}`;
                      }
                    }
                  }}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const input = document.querySelector(
                    'input[placeholder="Search for what you need..."]',
                  ) as HTMLInputElement;
                  const query = input?.value;
                  if (query?.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                  }
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="default" asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Popular Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-accent"
            >
              Dashboard
            </Link>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-accent"
            >
              Projects
            </Link>
            <Link
              href="/grants"
              className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-accent"
            >
              Grants
            </Link>
            <Link
              href="/profile"
              className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-accent"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Still can't find what you're looking for?
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
