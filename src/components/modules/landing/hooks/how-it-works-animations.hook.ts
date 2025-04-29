"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useAnimationVariants } from "./animation-variants.hook";

export const useHowItWorksAnimations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { containerVariants } = useAnimationVariants();

  const steps = [
    {
      number: 1,
      title: "Proposal",
      description:
        "Applicants submit proposals detailing objectives, milestones, and required budget.",
    },
    {
      number: 2,
      title: "Approval",
      description:
        "Funders review and approve proposals that meet established criteria.",
    },
    {
      number: 3,
      title: "Execution",
      description:
        "Grantees work on the project and submit evidence upon completing each milestone.",
    },
    {
      number: 4,
      title: "Verification & Payment",
      description:
        "Milestones are verified and funds are automatically released through smart contracts.",
    },
  ];

  return {
    ref,
    isInView,
    containerVariants,
    steps,
  };
};
