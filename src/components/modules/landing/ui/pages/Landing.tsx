"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useScrollToHash } from "../../hooks/scroll-to-hash.hook";
import { HeaderLanding } from "@/components/layout/header/HeaderLanding";
import { HeroSection } from "../sections/HeroSection";
import { FooterLanding } from "@/components/layout/footer/FooterLanding";

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
        </main>

        <FooterLanding />
      </motion.div>
    </AnimatePresence>
  );
};
