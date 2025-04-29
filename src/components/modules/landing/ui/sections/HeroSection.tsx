"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useHeroAnimations } from "../../hooks/hero-animations.hook";

export const HeroSection = () => {
  const { ref, isInView, containerVariants, itemVariants, buttonVariants } =
    useHeroAnimations();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none dark:text-white"
                variants={itemVariants}
              >
                Secure Milestone-Based Funding
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-muted-foreground md:text-xl dark:text-muted-foreground"
                variants={itemVariants}
              >
                Open-source grants platform using Trustless Work smart escrows,
                ideal for blockchains, DAOs, hackathons, and events.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              variants={itemVariants}
            >
              <Link href="https://docs.trustlesswork.com/trustless-work">
                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      Trustless Work Documentation
                    </span>
                    <motion.span
                      className="absolute inset-0 bg-white dark:bg-white opacity-20"
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "100%", opacity: 0.2 }}
                      transition={{ duration: 0.5 }}
                    />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Abstract animated shape */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: "spring",
              stiffness: 100,
            }}
          >
            <div className="relative w-80 h-80">
              <motion.div
                className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/20"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, 0],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-primary/20 dark:bg-primary/30"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -15, 0],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 1,
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/30 dark:bg-primary/40"
                animate={{
                  scale: [1, 0.9, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
