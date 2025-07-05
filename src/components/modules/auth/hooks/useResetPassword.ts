"use client";

import { resetPasswordSchema } from "@/components/modules/auth/schema/reset-password.schema";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const useResetPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

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

    handleHashChange();
  }, [router]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordReset = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      router.push("/login");

      toast.success("Password updated successfully");
    } catch (err: unknown) {
      console.error("Error updating password:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to reset password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handlePasswordReset,
    isValidToken,
    setIsValidToken,
  };
};
