"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5 dark:bg-primary/10">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            Join the future of transparent, secure funding. Create your first
            escrow today and experience the power of Trustless Work smart
            contracts.
          </p>
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
