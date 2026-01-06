"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Create Grant",
    description: "Set up your grant program with defined milestones and funding amounts.",
  },
  {
    number: "02",
    title: "Apply & Review",
    description: "Recipients apply for grants and you review their proposals.",
  },
  {
    number: "03",
    title: "Fund Escrow",
    description: "Deposit funds into a secure smart contract escrow account.",
  },
  {
    number: "04",
    title: "Track Milestones",
    description: "Monitor progress as recipients complete their milestones.",
  },
  {
    number: "05",
    title: "Release Funds",
    description: "Automatically release funds when milestones are verified and approved.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const HowItWorksSection = () => {
  return (
    <section className="w-full py-24 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            How It{" "}
            <span className="text-primary-500 bg-gradient-to-r from-primary-500 to-primary-500/80 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            A simple, secure process for managing milestone-based funding from start to finish.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/50 to-transparent" />
                )}
                <Card className="border-border/50 hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary-500">
                            {step.number}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-2xl font-semibold mb-2 text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-lg">
                          {step.description}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="hidden md:flex items-center pt-2">
                          <ArrowRight className="w-6 h-6 text-primary-500/50" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
