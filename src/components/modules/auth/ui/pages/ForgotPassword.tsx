import { ForgotPasswordForm } from "../forms/ForgotPasswordForm";

export const ForgotPassword = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-xl">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
