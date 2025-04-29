"use client";

import { motion } from "framer-motion";
import { useSectionHeaderAnimations } from "../../hooks/section-header-animations.hook";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description: string;
  badgeClassName?: string;
}

export const SectionHeader = ({
  badge,
  title,
  description,
  badgeClassName = "",
}: SectionHeaderProps) => {
  const { ref, isInView, containerVariants, itemVariants } =
    useSectionHeaderAnimations();

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center space-y-4 text-center"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="space-y-2">
        {badge && (
          <motion.div
            className={`inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground dark:text-primary-foreground ${badgeClassName}`}
            variants={itemVariants}
          >
            {badge}
          </motion.div>
        )}
        <motion.h2
          className="text-3xl font-bold tracking-tighter sm:text-5xl dark:text-white"
          variants={itemVariants}
        >
          {title}
        </motion.h2>
        <motion.p
          className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
          variants={itemVariants}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};
