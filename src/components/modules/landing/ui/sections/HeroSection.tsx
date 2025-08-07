"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none dark:text-white">
                Secure Milestone-Based Funding
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl dark:text-muted-foreground">
                Open-source grants platform using{" "}
                <Link
                  href="https://www.trustlesswork.com"
                  className="text-primary font-bold hover:text-primary/80"
                  target="_blank"
                >
                  Trustless Work
                </Link>{" "}
                smart escrows, ideal for blockchains, DAOs, hackathons, and
                events.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="https://docs.trustlesswork.com/trustless-work"
                target="_blank"
              >
                <div>
                  <Button size="lg">
                    <span className="relative z-10">
                      Trustless Work Documentation
                    </span>
                    <span className="absolute inset-0 bg-white dark:bg-white opacity-20" />
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
