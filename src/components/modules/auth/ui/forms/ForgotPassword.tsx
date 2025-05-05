"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePasswordReset } from "@/hooks/password-reset.hook";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, isLoading, isSuccess, handleRequestReset } = usePasswordReset();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 grid-cols-1">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleRequestReset)}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Reset your password</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your email to receive a password reset link
                  </p>
                </div>

                {isSuccess ? (
                  <div className="flex flex-col gap-4 items-center text-center">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600 dark:text-green-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If an account exists with that email, we've sent a
                      password reset link. Please check your inbox and spam
                      folder.
                    </p>
                  </div>
                ) : (
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
                )}

                {!isSuccess && (
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                )}

                <div className="flex justify-center">
                  <Link
                    href="/login"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
