"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useAnimationVariants } from "./animation-variants.hook";

export const useHeroAnimations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { containerVariants, itemVariants, buttonVariants } =
    useAnimationVariants();

  return {
    ref,
    isInView,
    containerVariants,
    itemVariants,
    buttonVariants,
  };
};
