"use client";

import { SignUpForm } from "../forms/SignUpForm";

export const SignUp = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-xl">
        <SignUpForm />
      </div>
    </div>
  );
};
