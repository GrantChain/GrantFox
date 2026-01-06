"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="w-full py-24 md:py-32 bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-background">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the future of secure, transparent funding. Create your first grant program in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required • Open source • Self-hostable
          </p>
        </motion.div>
      </div>
    </section>
  );
};
