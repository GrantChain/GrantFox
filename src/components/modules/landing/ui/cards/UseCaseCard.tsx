"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUseCaseCardAnimations } from "../../hooks/use-case-card-animations.hook";

interface UseCaseCardProps {
  title: string;
  description: string;
  benefits: string[];
  index: number;
}

export const UseCaseCard = ({
  title,
  description,
  benefits,
  index,
}: UseCaseCardProps) => {
  const { cardVariants, listVariants, itemVariants } =
    useUseCaseCardAnimations(index);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 10 },
      }}
    >
      <Card className="dark:border-border h-full dark:bg-card">
        <CardHeader>
          <CardTitle className="dark:text-white">{title}</CardTitle>
          <CardDescription className="dark:text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.ul className="space-y-2" variants={listVariants}>
            {benefits.map((benefit, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                </motion.div>
                <span className="dark:text-muted-foreground">{benefit}</span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};
