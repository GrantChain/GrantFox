import { Grant } from "@/@types/grant.entity";
import { Card } from "@/components/ui/card";
import { CheckIcon, UserIcon, ArrowRightIcon } from "lucide-react";
import React from "react";

interface GrantCardProps {
  grant: Grant;
}

export const GrantCard = ({ grant }: GrantCardProps) => {
  return (
    <Card
      className="relative overflow-hidden rounded-2xl shadow-xl bg-zinc-900 dark:bg-zinc-950 p-6 flex flex-col min-h-[400px] w-full mx-auto"
      tabIndex={0}
      aria-label={`Grant card for ${grant.title}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/40 via-transparent to-transparent" />
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="#fff"
                strokeWidth="0.5"
                opacity="0.08"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-white/80" aria-hidden="true" />
            <span className="text-sm text-zinc-400">For freelancers</span>
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight">
            {grant.title}
          </h2>
          <span className="text-base text-zinc-300">{grant.description}</span>
        </div>

        <div className="mb-6 flex flex-col gap-1">
          <span className="text-4xl font-extrabold text-white">
            ${grant.total_funding}
          </span>
          <span className="text-sm text-zinc-400">
            / {grant.currency?.toLowerCase() || "month"}
          </span>
          <span className="text-sm text-zinc-400 mt-1">{grant.metrics}</span>
        </div>

        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-zinc-200 text-sm">
            <CheckIcon className="w-5 h-5 text-green-400" aria-hidden="true" />
            Advanced sharing controls and file locking
          </li>
        </ul>

        <div className="flex gap-3 mt-auto">
          <button
            onKeyDown={(e) => e.key === "Enter"}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 transition-colors text-base"
            tabIndex={0}
            aria-label="Buy Now"
            type="button"
          >
            Buy Now
            <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onKeyDown={(e) => e.key === "Enter"}
            className="flex items-center justify-center px-6 py-2 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 transition-colors text-base"
            tabIndex={0}
            aria-label="Learn More"
            type="button"
          >
            Learn More
          </button>
        </div>
      </div>
    </Card>
  );
};
