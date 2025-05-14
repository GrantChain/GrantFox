"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../hooks/auth.hook";
import { useTemporaryEmailStore } from "../../store/store";

export const Verify = () => {
  const { handleResend, isLoading } = useAuth();
  const { email } = useTemporaryEmailStore();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription className="text-base mt-2">
            We've sent a confirmation email to{" "}
            {email ? (
              <span className="font-medium">{email}</span>
            ) : (
              "your inbox"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>
              Please click the link in the email to confirm your account
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            If you don't see the email, check your spam folder or request a new
            confirmation email.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Resend Confirmation Email"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
