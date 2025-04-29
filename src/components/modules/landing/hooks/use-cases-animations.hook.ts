"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useAnimationVariants } from "./animation-variants.hook";

export const useUseCasesAnimations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { containerVariants } = useAnimationVariants();

  const useCases = [
    {
      title: "Blockchains & Protocols",
      description:
        "Funding developers and teams building blockchain infrastructure.",
      benefits: [
        "Development of protocols and scaling layers",
        "Implementation of security improvements",
        "Audits and code reviews",
      ],
    },
    {
      title: "DAOs",
      description:
        "Decentralized autonomous organizations that need to distribute funds transparently.",
      benefits: [
        "Public goods funding",
        "Community tools development",
        "Governance and participation initiatives",
      ],
    },
    {
      title: "Hackathons",
      description:
        "Innovation events where the best technological solutions are rewarded.",
      benefits: [
        "Transparent prize distribution",
        "Post-event deliverables tracking",
        "Continued funding for promising projects",
      ],
    },
    {
      title: "Events & Conferences",
      description:
        "Organization and funding of technology and blockchain-related events.",
      benefits: [
        "Results-based sponsorships",
        "Budget management for organizers",
        "Rewards for speakers and contributors",
      ],
    },
  ];

  return {
    ref,
    isInView,
    containerVariants,
    useCases,
  };
};
