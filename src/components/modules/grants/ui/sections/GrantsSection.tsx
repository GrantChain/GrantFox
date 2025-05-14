"use client";

import { GrantsTable } from "../tables/GrantsTable";

export function GrantsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Available Grants
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse through our available grants and find the perfect
              opportunity for your project.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl pt-8">
          <GrantsTable />
        </div>
      </div>
    </section>
  );
}
