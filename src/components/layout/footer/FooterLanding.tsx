import Image from "next/image";
import Link from "next/link";

export const FooterLanding = () => {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <Image
            src="/favicon.ico"
            alt="GrantChain Logo"
            width={30}
            height={30}
            className="rounded-md"
          />
          <p className="text-sm text-muted-foreground">
            © 2025 GrantChain. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Documentation
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
};
