import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/modules/auth/ui/forms/ForgotPassword";

export const metadata: Metadata = {
  title: "Forgot Password - GrantFox",
  description: "Request a password reset for your GrantFox account",
};

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center"></div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
