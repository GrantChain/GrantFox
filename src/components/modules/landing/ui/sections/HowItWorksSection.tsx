"use client";

import { motion } from "framer-motion";
import { useHowItWorksAnimations } from "../../hooks/how-it-works-animations.hook";
import { SectionHeader } from "./HeaderSection";
import { StepCard } from "../cards/StepCard";

export const HowItWorksSection = () => {
  const { ref, isInView, containerVariants, steps } = useHowItWorksAnimations();

  return (
    <section
      id="how-it-works"
      className="w-full py-12 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="container px-4 md:px-6">
        <SectionHeader
          badge="Process"
          title="How GrantChain Works"
          description="A simple and secure process for funding and executing projects based on verifiable milestones."
          badgeClassName="text-white"
        />
        <motion.div
          ref={ref}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 pt-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
