"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { FormProvider } from "react-hook-form";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import { AuthFooter } from "../shared/AuthFooter";
import { AuthLayout } from "../shared/AuthLayout";

export const ForgotPasswordForm = () => {
  const { form, isLoading, isSuccess, handleRequestReset } =
    useForgotPassword();

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email to receive a password reset link"
      footer={<AuthFooter />}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleRequestReset)}>
          {isSuccess ? (
            <div className="flex flex-col gap-4 items-center text-center">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Success checkmark"
                  role="img"
                >
                  <title>Success checkmark</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                If an account exists with that email, we&apos;ve sent a password
                reset link. Please check your inbox and spam folder.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Email
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email"
                          type="email"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="flex justify-center mt-6">
                <Link
                  href="/login"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </AuthLayout>
  );
};
