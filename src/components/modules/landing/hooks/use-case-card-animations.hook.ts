"use client";

import { useAnimationVariants } from "./animation-variants.hook";

export const useUseCaseCardAnimations = (index: number) => {
  const { cardVariants, listVariants, listItemVariants } =
    useAnimationVariants();

  return {
    cardVariants: cardVariants(index),
    listVariants: listVariants(index),
    itemVariants: listItemVariants,
  };
};
