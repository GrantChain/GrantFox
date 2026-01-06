"use client";

import { FooterLanding } from "@/components/layout/footer/FooterLanding";
import { HeaderLanding } from "@/components/layout/header/HeaderLanding";
import { motion } from "framer-motion";
import { useScrollToHash } from "../../hooks/scroll-to-hash.hook";
import { CTASection } from "../sections/CTASection";
import { FeaturesSection } from "../sections/FeaturesSection";
import { HeroSection } from "../sections/HeroSection";
import { HowItWorksSection } from "../sections/HowItWorksSection";

export const Landing = () => {
  useScrollToHash();

  return (
    <motion.div
      className="flex min-h-screen flex-col dark:bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <HeaderLanding />
      <main className="flex-1 min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <FooterLanding />
    </motion.div>
  );
};
