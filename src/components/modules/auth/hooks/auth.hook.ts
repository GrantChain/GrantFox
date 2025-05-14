// src/modules/auth/hooks/auth.hook.ts
"use client";

import { useForm } from "react-hook-form";
import { authSchema } from "../ui/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "../services/register-user.service";
import { useTemporaryEmailStore } from "../store/auth.store";
import { toast } from "sonner";

export const useAuth = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setEmail, email } = useTemporaryEmailStore();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleLogin = async (payload: z.infer<typeof authSchema>) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (error && error.status === 400) {
        toast.error(error.message);
      }

      if (data?.session && !error) router.push("/dashboard");
    } catch (error) {
      if (error) console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Failed to sign in with Google");
    }
  };

  const handleSignUp = async (payload: z.infer<typeof authSchema>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        try {
          setEmail(payload.email);

          const { success } = await registerUser(
            data.user.id,
            data.user.email || "",
          );

          if (!success) {
            toast.error("User registration failed.");
            return;
          }

          router.push("/sign-up/verify");
        } catch (error) {
          toast.error("Please try again later.");
        }
      }
    } catch (error) {
      if (error) console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      let { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
      } else {
        router.push("/");
      }
    } catch (error) {
      if (error) console.error(error);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      if (!email) {
        toast(toast.error("No email available for resending verification"));
        return;
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("We've sent a new confirmation email to your inbox");
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend verification email");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    showPassword,
    setShowPassword,
    handleLogin,
    handleSignUp,
    handleLogout,
    handleGoogleLogin,
    handleResend,
    isLoading,
  };
};
