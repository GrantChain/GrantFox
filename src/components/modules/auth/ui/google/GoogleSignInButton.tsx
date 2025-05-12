'use client'

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/components/modules/auth/hooks/auth.hook";

export default function GoogleSignInButton() {
  const { handleGoogleLogin } = useAuth();

  return (
    <Button 
      variant="outline" 
      type="button"
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 w-full"
    >
      <FcGoogle className="h-5 w-5" />
      <span>Sign in with Google</span>
    </Button>
  );
}