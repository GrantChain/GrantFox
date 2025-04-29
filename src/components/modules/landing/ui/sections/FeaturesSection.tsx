"use client";

import { Shield, Milestone, Code, Users, Globe, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { useFeaturesAnimations } from "../../hooks/features-animations.hook";
import { SectionHeader } from "./HeaderSection";
import { FeatureCard } from "../cards/FeatureCard";

export const FeaturesSection = () => {
  const { ref, isInView, containerVariants, features } =
    useFeaturesAnimations();

  const iconMap = {
    Shield,
    Milestone,
    Code,
    Users,
    Globe,
    Coins,
  };

  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="container px-4 md:px-6">
        <SectionHeader
          badge="Features"
          title="Everything You Need to Manage Grants"
          description="GrantChain offers a complete platform for secure and transparent milestone-based grant management."
        />
        <motion.div
          ref={ref}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <FeatureCard
                key={index}
                icon={IconComponent}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
