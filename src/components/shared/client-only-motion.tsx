"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { HTMLMotionProps } from "framer-motion";

interface ClientOnlyMotionProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  initial?: string | boolean;
  animate?: string | boolean;
}

export function ClientOnlyMotion({
  children,
  ...props
}: ClientOnlyMotionProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={props.className}>{children}</div>;
  }

  return <motion.div {...props}>{children}</motion.div>;
}
