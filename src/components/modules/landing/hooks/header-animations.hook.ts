"use client";

export const useHeaderAnimations = () => {
  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#use-cases", label: "Use Cases" },
  ];

  return {
    navItems,
  };
};
