"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ResetPasswordForm } from "../forms/ResetPasswordForm";
import { supabase } from "@/lib/supabase";
import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
} from "@/components/ui/card";

export function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  
  // Supabase handles authentication through the full URL, not just a parameter
  useEffect(() => {
    const handleHashChange = async () => {
      // Check if Supabase can recover the session from the URL
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.error("Error validating reset token:", error);
        setIsValidToken(false);
        router.replace("/forgot-password?error=invalid_link");
        return;
      }
      
      setIsValidToken(true);
    };

    // Process the current URL
    handleHashChange();
  }, [router]);

  // Show a loader while validating the token
  if (isValidToken === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Validating link...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-muted-foreground">
            Please don't recharge the page
          </p>
        </CardContent>
      </Card>
    </div>
    );
  }

  // If the token is invalid, render nothing (we already redirected)
  if (isValidToken === false) return null;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
