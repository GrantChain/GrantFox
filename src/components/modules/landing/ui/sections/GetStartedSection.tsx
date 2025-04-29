"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGetStartedAnimations } from "../../hooks/get-started-animations.hook";

export const GetStartedSection = () => {
  const { ref, isInView, containerVariants, itemVariants, buttonVariants } =
    useGetStartedAnimations();

  return (
    <section
      id="get-started"
      className="w-full py-12 md:py-24 lg:py-32 border-t dark:border-border overflow-hidden"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          className="flex flex-col items-center justify-center space-y-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="space-y-2">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-white"
              variants={itemVariants}
            >
              Start using GrantChain today
            </motion.h2>
            <motion.p
              className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              variants={itemVariants}
            >
              Join the revolution in grant management and milestone-based
              funding.
            </motion.p>
          </div>
          <motion.div
            className="flex flex-col gap-2 min-[400px]:flex-row"
            variants={itemVariants}
          >
            <Link href="/login" className="flex items-center">
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
                  <span className="relative z-10 flex items-center">
                    Sign In
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.span>
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
        </motion.div>
      </div>
    </section>
  );
};
