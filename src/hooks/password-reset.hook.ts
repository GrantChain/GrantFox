"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Email validation schema
const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Password reset validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain an uppercase letter, a lowercase letter, a number, and a special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function usePasswordReset() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
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
      toast.success("An email with instructions to reset your password has been sent");
    } catch (err: any) {
      console.error("Password reset request error:", err.message);
      setError(err.message || "Failed to send reset email");
      toast.error("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new password submission - modified to not require explicit token
  const handlePasswordReset = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Supabase handles the token internally via the current session
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      setIsSuccess(true);
      // toast.success("Password updated successfully");

      // Optional: redirect after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    resetForm,
    isLoading,
    isSuccess,
    error,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleRequestReset,
    handlePasswordReset,
  };
}
