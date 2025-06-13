"use client"

import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "@/components/modules/auth/hooks/useAuth";

export default function GithubSignInButton() {
    const { handleGithubLogin } = useAuth();

    return (
        <Button
        variant="outline"
        type="button"
        onClick={handleGithubLogin}
        className="flex items-center justify-center gap-2 w-full"
        >
        <FaGithub className="h-5 w-5" />
        <span>Sign in with GitHub</span>
        </Button>
    );
}