"use client";

import { motion } from "framer-motion";
import { useScrollToHash } from "../../hooks/scroll-to-hash.hook";
import { HeaderLanding } from "@/components/layout/header/HeaderLanding";
import { HeroSection } from "../sections/HeroSection";
import { FooterLanding } from "@/components/layout/footer/FooterLanding";

export const Landing = () => {
  useScrollToHash();

  return (
    <motion.div
      className="flex min-h-screen flex-col dark:bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }} // Further reduced for performance
    >
      <HeaderLanding />
      <main className="flex-1 min-h-screen">
        <HeroSection />
      </main>
      <FooterLanding />
    </motion.div>
  );
};
