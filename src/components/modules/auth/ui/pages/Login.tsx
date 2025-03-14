"use client";

import { useGlobalAuthenticationStore } from "@/components/auth/store/store";
import { LoginForm } from "../forms/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Login = () => {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push("/dashboard");
    }
  }, [address, router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
};
