"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/components/modules/auth/ui/schema/forgot-password.schema";

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Handle password reset request via email
  const handleRequestReset = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo,
      });

      if (error) {
        if (error.message.includes("30 seconds")) {
          toast.info("Please wait 30 seconds before trying again.");
          return;
        }
        throw error;
      }

      setIsSuccess(true);
      toast.success(
        "An email with instructions to reset your password has been sent",
      );
    } catch (err: any) {
      console.error("Password reset request error:", err.message);
      setError(err.message || "Failed to send reset email");
      toast.error("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isSuccess,
    error,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleRequestReset,
  };
};
