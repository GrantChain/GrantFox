"use client";

import { ResetPasswordForm } from "../forms/ResetPasswordForm";
import { CardHeader, CardTitle, Card, CardContent } from "@/components/ui/card";
import { useResetPassword } from "../../hooks/useResetPassword";

export const ResetPasswordClient = () => {
  const { isValidToken } = useResetPassword();

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
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-xl">
        <ResetPasswordForm />
      </div>
    </div>
  );
};
