"use client";

import { useAnimationVariants } from "./animation-variants.hook";

export const useStepCardAnimations = (index: number) => {
  const { cardVariants, iconVariants } = useAnimationVariants();

  return {
    cardVariants: cardVariants(index),
    circleVariants: iconVariants(index),
  };
};
