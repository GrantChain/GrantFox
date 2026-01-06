"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Trophy, Users2, Code, Sparkles, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const useCases = [
  {
    icon: Building2,
    title: "DAOs & Organizations",
    description: "Manage grant programs, fund projects, and distribute resources transparently across your organization.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Trophy,
    title: "Hackathons",
    description: "Award prizes and bounties based on milestone completion, ensuring fair distribution of rewards.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Code,
    title: "Open Source Funding",
    description: "Support open source projects with milestone-based funding that ensures deliverables are met.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Rocket,
    title: "Startup Funding",
    description: "Provide structured funding rounds tied to specific milestones and deliverables.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Sparkles,
    title: "Bounty Programs",
    description: "Create and manage bounties with clear requirements and automated payout upon completion.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Users2,
    title: "Grant Programs",
    description: "Streamline grant applications, reviews, and milestone-based disbursements all in one platform.",
    color: "from-indigo-500 to-indigo-600",
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export const UseCasesSection = () => {
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
            Perfect For Every{" "}
            <span className="text-primary-500 bg-gradient-to-r from-primary-500 to-primary-500/80 bg-clip-text text-transparent">
              Use Case
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Whether you're running a DAO, hackathon, or grant program, GrantFox has you covered.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary-500/50">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {useCase.description}
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
