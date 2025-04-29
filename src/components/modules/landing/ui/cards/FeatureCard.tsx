"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useFeatureCardAnimations } from "../../hooks/feature-card-animations.hook";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  index,
}: FeatureCardProps) => {
  const { cardVariants, iconVariants } = useFeatureCardAnimations(index);

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
        className="rounded-full bg-primary/10 p-2 dark:bg-primary/20"
        variants={iconVariants}
        whileHover={{
          rotate: [0, 10, -10, 0],
          transition: { duration: 0.5 },
        }}
      >
        <Icon className="h-6 w-6 text-primary" />
      </motion.div>
      <h3 className="text-xl font-bold dark:text-white">{title}</h3>
      <p className="text-center text-muted-foreground dark:text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
};
