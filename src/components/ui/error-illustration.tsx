"use client";

import { motion } from "framer-motion";

export function ErrorIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-64 h-64 mx-auto"
    >
      {/* Background Circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/10 dark:to-primary/5"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Main 404 Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-8xl font-bold text-muted-foreground/40 dark:text-primary/20 select-none"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          404
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-8 right-8 w-4 h-4 rounded-full"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.2,
        }}
        style={{
          background: "hsl(217, 96%, 60%)",
        }}
      />

      <motion.div
        className="absolute bottom-12 left-12 w-3 h-3 rounded-full"
        animate={{
          y: [0, -15, 0],
          x: [0, -8, 0],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.8,
        }}
        style={{
          background: "hsl(151, 77%, 52%)",
        }}
      />

      <motion.div
        className="absolute top-16 left-16 w-2 h-2 rounded-full"
        animate={{
          y: [0, -12, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1.2,
        }}
        style={{
          background: "hsl(29, 89%, 62%)",
        }}
      />

      <motion.div
        className="absolute bottom-8 right-16 w-5 h-5 rounded-full"
        animate={{
          y: [0, -18, 0],
          x: [0, 5, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{
          background: "hsl(327, 81%, 60%)",
        }}
      />

      {/* Search Icon */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground/50 dark:text-primary/30"
        >
          <title>Search icon</title>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
