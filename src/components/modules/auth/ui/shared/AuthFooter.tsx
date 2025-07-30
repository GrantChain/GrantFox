export function AuthFooter() {
  return (
    <>
      By clicking continue, you agree to our{" "}
      <a
        href="/terms"
        className="underline underline-offset-4 text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary rounded"
        tabIndex={0}
        aria-label="Terms of Service"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href="/privacy-policy"
        className="underline underline-offset-4 text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary rounded"
        tabIndex={0}
        aria-label="Privacy Policy"
      >
        Privacy Policy
      </a>
      .
    </>
  );
}
