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

export const useAuth = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
      }

      if (data.user && !error) {
        try {
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

  return {
    form,
    showPassword,
    setShowPassword,
    handleLogin,
    handleSignUp,
    handleLogout,
  };
};
