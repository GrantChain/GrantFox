"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useAnimationVariants } from "./animation-variants.hook";

export const useFeaturesAnimations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { containerVariants } = useAnimationVariants();

  const features = [
    {
      icon: "Shield",
      title: "Smart Escrows",
      description:
        "Smart contracts that guarantee the security of funds until agreed milestones are completed.",
    },
    {
      icon: "Milestone",
      title: "Milestone-Based Funding",
      description:
        "Release funds gradually as verifiable objectives are achieved, reducing risks.",
    },
    {
      icon: "Code",
      title: "Open Source",
      description:
        "Open and transparent code, allowing the community to verify and contribute to the project.",
    },
    {
      icon: "Users",
      title: "Decentralized Governance",
      description:
        "Distributed decision-making for greater transparency and community participation.",
    },
    {
      icon: "Globe",
      title: "Interoperability",
      description:
        "Compatible with multiple blockchains and traditional systems for maximum flexibility.",
    },
    {
      icon: "Coins",
      title: "Tokenization",
      description:
        "Possibility to tokenize grants for greater liquidity and market participation.",
    },
  ];

  return {
    ref,
    isInView,
    containerVariants,
    features,
  };
};
