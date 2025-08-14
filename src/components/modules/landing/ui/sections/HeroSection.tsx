"use client";

import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="w-full min-h-screen flex justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8 mt-10 md:mt-40">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-black dark:text-white">
              Secure{" "}
              <span className="text-primary-500 bg-gradient-to-r from-primary-500 to-primary-500/80 bg-clip-text text-transparent">
                Milestone-Based
              </span>{" "}
              Funding
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Open-source payouts platform using smart escrows, ideal for
              blockchains, DAOs, hackathons, bounties, and more ...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
