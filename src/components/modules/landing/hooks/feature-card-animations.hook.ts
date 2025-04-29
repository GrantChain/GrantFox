"use client";

import { useAnimationVariants } from "./animation-variants.hook";

export const useFeatureCardAnimations = (index: number) => {
  const { cardVariants, iconVariants } = useAnimationVariants();

  return {
    cardVariants: cardVariants(index),
    iconVariants: iconVariants(index),
  };
};
