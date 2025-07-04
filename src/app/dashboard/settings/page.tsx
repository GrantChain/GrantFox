import { redirect } from "next/navigation";

export default function SettingsRedirect() {
  redirect("/dashboard/settings/profile");
  return null;
} 