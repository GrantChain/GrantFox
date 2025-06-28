"use client";

import { useAnimationPreference } from "@/hooks/useAnimationPreference";

export const useAnimationVariants = () => {
  const { animationsEnabled } = useAnimationPreference();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: animationsEnabled
        ? {
            staggerChildren: 0.2,
            delayChildren: 0.3,
          }
        : { duration: 0 },
    },
  };

  const itemVariants = {
    hidden: { y: animationsEnabled ? 20 : 0, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: animationsEnabled
        ? {
            type: "spring",
            stiffness: 100,
            damping: 10,
          }
        : { duration: 0 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: animationsEnabled ? 1.05 : 1,
      transition: animationsEnabled
        ? {
            type: "spring",
            stiffness: 400,
            damping: 10,
          }
        : { duration: 0 },
    },
    tap: { scale: animationsEnabled ? 0.95 : 1 },
  };

  const cardVariants = (index: number) => ({
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.1 * index,
      },
    },
  });

  const iconVariants = (index: number) => ({
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.2 + 0.1 * index,
      },
    },
  });

  const listVariants = (index: number) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2 + 0.1 * index,
      },
    },
  });

  const listItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return {
    containerVariants,
    itemVariants,
    buttonVariants,
    cardVariants,
    iconVariants,
    listVariants,
    listItemVariants,
    animationsEnabled,
  };
};
