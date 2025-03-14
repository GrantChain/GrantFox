import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Code,
  Coins,
  Globe,
  Milestone,
  Shield,
  Users,
} from "lucide-react";

import { FeatureCard } from "../components/FeatureCard";
import { StepCard } from "../components/StepCard";
import { HeaderLanding } from "@/components/layout/header/HeaderLanding";
import { FooterLanding } from "@/components/layout/footer/FooterLanding";

export const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderLanding />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Secure Milestone-Based Funding
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Open-source grants platform using Trustless Work smart
                    escrows, ideal for blockchains, DAOs, hackathons, and
                    events.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    View Documentation
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/favicon.ico"
                  alt="GrantChain Logo"
                  width={300}
                  height={300}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Manage Grants
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  GrantChain offers a complete platform for secure and
                  transparent milestone-based grant management.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8">
              <FeatureCard
                icon={Shield}
                title="Smart Escrows"
                description="Smart contracts that guarantee the security of funds until agreed milestones are completed."
              />
              <FeatureCard
                icon={Milestone}
                title="Milestone-Based Funding"
                description="Release funds gradually as verifiable objectives are achieved, reducing risks."
              />
              <FeatureCard
                icon={Code}
                title="Open Source"
                description="Open and transparent code, allowing the community to verify and contribute to the project."
              />
              <FeatureCard
                icon={Users}
                title="Decentralized Governance"
                description="Distributed decision-making for greater transparency and community participation."
              />
              <FeatureCard
                icon={Globe}
                title="Interoperability"
                description="Compatible with multiple blockchains and traditional systems for maximum flexibility."
              />
              <FeatureCard
                icon={Coins}
                title="Tokenization"
                description="Possibility to tokenize grants for greater liquidity and market participation."
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-secondary-foreground text-white">
                  Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How GrantChain Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple and secure process for funding and executing projects
                  based on verifiable milestones.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 pt-8">
              <StepCard
                number={1}
                title="Proposal"
                description="Applicants submit proposals detailing objectives, milestones, and required budget."
              />
              <StepCard
                number={2}
                title="Approval"
                description="Funders review and approve proposals that meet established criteria."
              />
              <StepCard
                number={3}
                title="Execution"
                description="Grantees work on the project and submit evidence upon completing each milestone."
              />
              <StepCard
                number={4}
                title="Verification & Payment"
                description="Milestones are verified and funds are automatically released through smart contracts."
              />
            </div>
          </div>
        </section>

        <section
          id="use-cases"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/40"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Applications
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Use Cases
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  GrantChain is ideal for various scenarios where secure and
                  transparent funding is required.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 pt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchains & Protocols</CardTitle>
                  <CardDescription>
                    Funding developers and teams building blockchain
                    infrastructure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Development of protocols and scaling layers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Implementation of security improvements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Audits and code reviews</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>DAOs</CardTitle>
                  <CardDescription>
                    Decentralized autonomous organizations that need to
                    distribute funds transparently.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Public goods funding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Community tools development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Governance and participation initiatives</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Hackathons</CardTitle>
                  <CardDescription>
                    Innovation events where the best technological solutions are
                    rewarded.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Transparent prize distribution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Post-event deliverables tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Continued funding for promising projects</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Events & Conferences</CardTitle>
                  <CardDescription>
                    Organization and funding of technology and
                    blockchain-related events.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Results-based sponsorships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Budget management for organizers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Rewards for speakers and contributors</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="get-started"
          className="w-full py-12 md:py-24 lg:py-32 border-t"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start using GrantChain today
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join the revolution in grant management and milestone-based
                  funding.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground"
                >
                  Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Request Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterLanding />
    </div>
  );
};
