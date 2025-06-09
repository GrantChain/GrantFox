import GoogleSignInButton from "@/components/modules/auth/ui/google/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleSignInButton from "@/components/modules/auth/ui/google/GoogleSignInButton";
import GithubSignInButton from "@/components/modules/auth/ui/github/GithubSignInButton";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthFooter } from "../shared/AuthFooter";
import { AuthLayout } from "../shared/AuthLayout";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

export const LoginForm = () => {
  const { form, showPassword, setShowPassword, handleLogin, isLoading } =
    useAuth();

  return (
    <AuthLayout
      title="Welcome back!"
      description="Login in GrantFox"
      footer={<AuthFooter />}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)}>
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

          <div className="grid gap-2 mt-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Password
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...field}
                        onChange={(e) => field.onChange(e)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
              <span className="bg-background px-2">or continue with</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <GoogleSignInButton />
            <GithubSignInButton />
          </div>

          <div className="text-center text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>

          <div className="text-center text-sm mt-2">
            <Link
              href="/forgot-password"
              className="underline underline-offset-4"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </FormProvider>
    </AuthLayout>
  );
};
