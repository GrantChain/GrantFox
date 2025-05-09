// src/modules/auth/hooks/auth.hook.ts
"use client";

import { useForm } from "react-hook-form";
import { authSchema } from "../ui/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { registerUser } from "../services/register-user.service";
import { useTemporaryEmailStore } from "../store/auth.store";

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
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }

      if (data?.session && !error) router.push("/dashboard");
    } catch (error) {
      if (error) console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
      
    } catch (err) {
      console.error('Google login error:', err);
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      });
    }
  };

  const handleSignUp = async (payload: z.infer<typeof authSchema>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
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
            toast({
              title: "Error",
              description: "User registration failed.",
              variant: "destructive",
            });
            return;
          }

          router.push("/sign-up/verify");
        } catch (error) {
          toast({
            title: "Error registering user",
            description: "Please try again later.",
            variant: "destructive",
          });
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
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
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
        toast({
          title: "Error",
          description: "No email available for resending verification",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "We've sent a new confirmation email to your inbox",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to resend verification email",
        variant: "destructive",
      });
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