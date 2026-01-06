"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="w-full min-h-screen flex justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto text-center space-y-8 mt-10 md:mt-32 lg:mt-40">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
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
              blockchains, DAOs, hackathons, bounties, and more.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link href="/sign-up">
              <Button
                size="lg"
                className="text-base px-8 py-6 h-auto group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 h-auto"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary-500" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary-500" />
              <span>Smart Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary-500" />
              <span>Secure & Transparent</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
