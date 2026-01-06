"use client";

import { FooterLanding } from "@/components/layout/footer/FooterLanding";
import { HeaderLanding } from "@/components/layout/header/HeaderLanding";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollToHash } from "../../hooks/scroll-to-hash.hook";
import { HeroSection } from "../sections/HeroSection";
import { FeaturesSection } from "../sections/FeaturesSection";
import { HowItWorksSection } from "../sections/HowItWorksSection";
import { UseCasesSection } from "../sections/UseCasesSection";
import { CTASection } from "../sections/CTASection";

export const Landing = () => {
  useScrollToHash();

  return (
    <AnimatePresence>
      <motion.div
        className="flex min-h-screen flex-col dark:bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderLanding />

        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <UseCasesSection />
          <CTASection />
        </main>

        <FooterLanding />
      </motion.div>
    </AnimatePresence>
  );
};
