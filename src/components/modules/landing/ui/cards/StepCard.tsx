"use client";

import { motion } from "framer-motion";
import { useStepCardAnimations } from "../../hooks/step-card-animations.hook";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  index: number;
}

export const StepCard = ({
  number,
  title,
  description,
  index,
}: StepCardProps) => {
  const { cardVariants, circleVariants } = useStepCardAnimations(index);

  return (
    <motion.div
      className="flex flex-col items-center space-y-2 rounded-lg border p-4 transition-all hover:bg-accent dark:border-border dark:hover:bg-accent/20 dark:bg-card"
      variants={cardVariants}
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 10 },
      }}
    >
      <motion.div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
        variants={circleVariants}
        whileHover={{
          scale: 1.1,
          transition: { type: "spring", stiffness: 300, damping: 10 },
        }}
      >
        {number}
      </motion.div>
      <h3 className="text-xl font-bold dark:text-white text-center">{title}</h3>
      <p className="text-center text-muted-foreground dark:text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
};
