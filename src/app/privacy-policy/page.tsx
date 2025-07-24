import React from "react";
import { Metadata } from "next";
import { SectionHeader } from "@/components/modules/landing/ui/sections/HeaderSection";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy for GrantFox. Learn how we handle your data and privacy.",
};

const PrivacyPolicyPage = () => {
  return (
    <main className="min-h-svh bg-background text-foreground flex py-12 px-4">
      <article
        className="w-full max-w-6xl mx-auto bg-card max-w text-card-foreground rounded-xl shadow-lg p-6 md:p-10 overflow-y-auto max-h-[80vh] focus:outline-none"
        tabIndex={0}
        aria-label="Privacy Policy Article"
      >
        <SectionHeader
          badge="Legal"
          title="Privacy Policy"
          description="Your privacy is important to us. Learn how GrantFox collects, uses, and protects your information."
        />
        <div className="mt-20 space-y-12">
          <section className="flex flex-col items-center gap-2 mt-10">
            <h2 className="text-2xl font-bold mb-2 text-center">
              1. Introduction
            </h2>
            <p className="text-base text-center leading-relaxed text-muted-foreground max-w-prose">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              euismod, nunc ut laoreet dictum, massa sapien facilisis urna,
              vitae dictum mi urna non urna.
            </p>
          </section>
          <div className="w-full flex justify-center">
            <div className="h-px w-2/3 bg-muted" />
          </div>
          <section className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold mb-2 text-center">
              2. Data Collection
            </h2>
            <p className="text-base text-center leading-relaxed text-muted-foreground max-w-prose">
              Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in
              faucibus orci luctus et ultrices posuere cubilia curae.
            </p>
          </section>
          <div className="w-full flex justify-center">
            <div className="h-px w-2/3 bg-muted" />
          </div>
          <section className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold mb-2 text-center">
              3. Use of Information
            </h2>
            <p className="text-base text-center leading-relaxed text-muted-foreground max-w-prose">
              Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros
              eget libero posuere vulputate. Etiam elit elit, elementum sed
              varius at, adipiscing vitae est.
            </p>
          </section>
          <div className="w-full flex justify-center">
            <div className="h-px w-2/3 bg-muted" />
          </div>
          <section className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold mb-2 text-center">
              4. Data Security
            </h2>
            <p className="text-base text-center leading-relaxed text-muted-foreground max-w-prose">
              Quisque euismod orci ut et lobortis. Pellentesque nec lacus elit.
              Pellentesque convallis nisi ac augue pharetra eu tristique neque
              consequat.
            </p>
          </section>
          <div className="w-full flex justify-center">
            <div className="h-px w-2/3 bg-muted" />
          </div>
          <section className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold mb-2 text-center">
              5. Contact Us
            </h2>
            <p className="text-base text-center leading-relaxed text-muted-foreground max-w-prose">
              For any questions about this Privacy Policy, please contact us at
              support@grantfox.io.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
};

export default PrivacyPolicyPage;
