"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Lock, Users, Code2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Smart Escrows",
    description: "Secure milestone-based funding with automated escrow contracts that protect both funders and recipients.",
  },
  {
    icon: Lock,
    title: "Secure & Transparent",
    description: "All transactions are recorded on-chain with full transparency and immutability.",
  },
  {
    icon: Zap,
    title: "Fast Payments",
    description: "Instant payouts upon milestone completion with automated verification and release.",
  },
  {
    icon: Users,
    title: "Multi-Party Support",
    description: "Perfect for DAOs, hackathons, and organizations managing multiple grant recipients.",
  },
  {
    icon: Code2,
    title: "Open Source",
    description: "Built for the community, by the community. Fully open-source and customizable.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor milestone completion and track funding progress in real-time.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const FeaturesSection = () => {
  return (
    <section className="w-full py-24 md:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Powerful Features for{" "}
            <span className="text-primary-500 bg-gradient-to-r from-primary-500 to-primary-500/80 bg-clip-text text-transparent">
              Modern Funding
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Everything you need to manage grants, bounties, and milestone-based payments securely and efficiently.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
