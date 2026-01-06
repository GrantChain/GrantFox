"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Users, Zap } from "lucide-react";
import { SectionHeader } from "./HeaderSection";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Escrows",
    description:
      "Smart contracts ensure funds are protected until milestones are completed.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description:
      "Automated milestone verification and instant payouts when conditions are met.",
  },
  {
    icon: Users,
    title: "DAO Friendly",
    description:
      "Perfect for decentralized organizations managing grants and bounties.",
  },
  {
    icon: Lock,
    title: "Trustless System",
    description:
      "No intermediaries needed. Code is law with transparent, verifiable transactions.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <SectionHeader
          badge="Features"
          title="Why Choose GrantFox"
          description="Built on Trustless Work smart escrows, GrantFox provides secure, transparent, and efficient funding solutions."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
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
        </div>
      </div>
    </section>
  );
};
