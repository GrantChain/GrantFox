"use client";

import { motion } from "framer-motion";
import { useUseCasesAnimations } from "../../hooks/use-cases-animations.hook";
import { SectionHeader } from "./HeaderSection";
import { UseCaseCard } from "../cards/UseCaseCard";

export const UseCasesSection = () => {
  const { ref, isInView, containerVariants, useCases } =
    useUseCasesAnimations();

  return (
    <section
      id="use-cases"
      className="w-full py-12 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="container px-4 md:px-6">
        <SectionHeader
          badge="Applications"
          title="Use Cases"
          description="GrantChain is ideal for various scenarios where secure and transparent funding is required."
        />
        <motion.div
          ref={ref}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 pt-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={index}
              title={useCase.title}
              description={useCase.description}
              benefits={useCase.benefits}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
