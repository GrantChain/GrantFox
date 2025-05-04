import { Metadata } from "next";
import { ResetPasswordClient } from "@/components/modules/auth/ui/pages/ResetPasswordClient";

export const metadata: Metadata = {
  title: "Reset Password - GrantFox",
  description: "Set a new password for your GrantFox account",
};

export default function ResetPasswordPage() {
  console.log("Page loaded");
  return <ResetPasswordClient />;
}
