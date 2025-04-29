"use client";

export const useFooterAnimations = () => {
  const footerLinks = [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "https://docs.trustlesswork.com", label: "Documentation" },
  ];

  return {
    footerLinks,
  };
};
