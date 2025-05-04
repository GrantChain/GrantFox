"use client";

import { usePasswordReset } from "@/hooks/password-reset.hook";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CardHeader, CardTitle, Card, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

// Password validation schema with simplified requirements
// This ensures passwords meet security standards with simple error messages
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /[A-Z]/,
        "Password must include uppercase, lowercase, number and special character",
      )
      .regex(
        /[a-z]/,
        "Password must include uppercase, lowercase, number and special character",
      )
      .regex(
        /[0-9]/,
        "Password must include uppercase, lowercase, number and special character",
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must include uppercase, lowercase, number and special character",
      ),
    confirmPassword: z.string(),
  })
  // Additional validation to ensure both passwords match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// TypeScript type derived from the zod schema
type PasswordFormData = z.infer<typeof passwordSchema>;

export function ResetPasswordForm() {
  // Custom hook that provides password reset functionality and state management
  const {
    isLoading,
    isSuccess,
    error,
    handlePasswordReset,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
  } = usePasswordReset();

  // State to track if password meets minimum length
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  // State to track if passwords match
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Initialize form with validation schema and default values
  const methods = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Watch for changes in password and confirmPassword
  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      // Check password length
      if (name === "password" || name === undefined) {
        const password = value.password || "";
        setIsPasswordValid(password.length === 0 || password.length >= 8);
      }

      // Check if passwords match, but only if confirm field has content
      if (
        (name === "confirmPassword" ||
          name === "password" ||
          name === undefined) &&
        value.confirmPassword &&
        value.confirmPassword.length > 0
      ) {
        setPasswordsMatch(value.password === value.confirmPassword);
      }
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  // Form submission handler that calls the password reset function
  const onSubmit = methods.handleSubmit((data) => {
    handlePasswordReset(data);
  });

  // Show success message and login button when password reset is successful
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Password Reset</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <p className="text-muted-foreground">
              Your password has been successfully reset!
            </p>
            <Button onClick={() => (window.location.href = "/login")}>
              Log in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form rendering with password fields and validation
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="p-6 md:p-8">
              {/* Form header with title and description */}
              <div className="flex flex-col items-center text-center mb-6">
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-muted-foreground text-sm">
                  Choose a new secure password
                </p>
              </div>

              {/* Display any error messages from the API */}
              {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

              <div className="grid gap-4">
                {/* New password input field with show/hide toggle */}
                <FormField
                  control={methods.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="pr-10"
                          />
                          {/* Toggle button to show/hide password */}
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm password input field with show/hide toggle */}
                <FormField
                  control={methods.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                            className="pr-10"
                          />
                          {/* Toggle button to show/hide confirmed password */}
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit button with loading state */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
