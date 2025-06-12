"use client";

import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { authSchema } from "../schema/auth.schema";
import { authService } from "../services/auth.service";
import { useAuthenticationBoundedStore } from "../store/store";

export const useAuth = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setEmail = useAuthenticationBoundedStore((state) => state.setEmail);
  const email = useAuthenticationBoundedStore((state) => state.email);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleLogin = async (payload: z.infer<typeof authSchema>) => {
    setIsLoading(true);
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
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      console.error("GitHub login error:", err);
      toast.error("Failed to sign in with GitHub");
    }
  };

  const handleSignUp = async (payload: z.infer<typeof authSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        try {
          setEmail(payload.email);

          const { success } = await authService.registerUser(
            data.user.id,
            data.user.email || "",
          );

          if (!success) {
            toast.error("User registration failed.");
            return;
          }

          router.push("/sign-up/verify");
        } catch (error) {
          console.error(error);
          toast.error("Please try again later.");
        }
      }
    } catch (error) {
      if (error) console.error(error);
      toast.error("Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
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
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
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
    handleGithubLogin,
    handleResend,
    isLoading,
  };
};
