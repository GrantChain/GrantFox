import { Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const FooterLanding = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Update the year when the component mounts
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-white dark:bg-black border-t ">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-between">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src="/favicon.ico"
                alt="GrantFox Logo"
                width={80}
                height={80}
                className="rounded-md"
              />
              <span className="text-xl font-bold font-titillium">GrantFox</span>
            </div>

            <p className="text-foreground mb-6">
              Open-source grants platform using smart escrows for secure
              milestone-based funding.
            </p>

            <div className="flex space-x-4 mb-4">
              <Link
                href="https://github.com/GrantChain"
                target="_blank"
                className="text-foreground hover:text-orange-500 transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://x.com/itsgrantfox"
                target="_blank"
                className="text-foreground hover:text-orange-500 transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://www.linkedin.com/company/grantfox"
                target="_blank"
                className="text-foreground hover:text-orange-500 transition-colors"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://docs.grantfox.xyz"
                  target="_blank"
                  className="text-foreground hover:text-orange-500 transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground text-sm">
            &copy; {currentYear} GrantFox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
