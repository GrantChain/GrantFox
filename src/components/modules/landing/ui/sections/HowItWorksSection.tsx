"use client";

import { motion } from "framer-motion";
import { CheckCircle, DollarSign, FileText } from "lucide-react";
import { SectionHeader } from "./HeaderSection";

const steps = [
  {
    step: "01",
    icon: FileText,
    title: "Create Escrow",
    description:
      "Set up a smart escrow with defined milestones and funding amount.",
  },
  {
    step: "02",
    icon: CheckCircle,
    title: "Verify Milestones",
    description:
      "Workers complete milestones which are automatically verified on-chain.",
  },
  {
    step: "03",
    icon: DollarSign,
    title: "Get Paid",
    description:
      "Receive instant payouts when milestones are verified and approved.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <SectionHeader
          badge="How It Works"
          title="Simple, Secure, Transparent"
          description="Three easy steps to get started with milestone-based funding."
        />
        <div className="grid gap-8 md:grid-cols-3 mt-12 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative mb-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground max-w-sm">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-border"
                    style={{ width: "calc(100% + 2rem)" }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
