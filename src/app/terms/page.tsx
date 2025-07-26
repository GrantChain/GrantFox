import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Award,
  Coins,
  FileText,
  Gavel,
  Home,
  Scale,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <Scale className="w-5 h-5" />,
      content: [
        {
          text: "By accessing or using GrantFox's milestone-based funding platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.",
        },
        {
          text: "These terms constitute a legally binding agreement between you and GrantFox. We may update these terms from time to time, and your continued use of our platform constitutes acceptance of any changes.",
        },
      ],
    },
    {
      id: "services",
      title: "Description of Services",
      icon: <Award className="w-5 h-5" />,
      content: [
        {
          text: "GrantFox is an open-source grants platform that facilitates secure milestone-based funding using Trustless Work smart escrows. Our platform is ideal for blockchains, DAOs, hackathons, and community events seeking transparent funding mechanisms.",
        },
        {
          text: "Our services include grant application processing, milestone tracking, automated escrow management, and community governance features. All services are provided 'as is' and we reserve the right to modify, suspend, or discontinue any aspect of our platform at any time with reasonable notice.",
        },
      ],
    },
    {
      id: "eligibility",
      title: "User Eligibility",
      icon: <Users className="w-5 h-5" />,
      content: [
        {
          text: "You must be at least 18 years old and have the legal capacity to enter into contracts in your jurisdiction to participate in grant funding through our platform.",
        },
        {
          text: "Grant applicants must provide accurate information about their projects and demonstrate the technical capability to deliver proposed milestones.",
        },
        {
          text: "You are responsible for ensuring that your grant projects comply with all applicable local, state, national, and international laws and regulations.",
        },
      ],
    },
    {
      id: "grants",
      title: "Grant Application and Management",
      icon: <Coins className="w-5 h-5" />,
      content: [
        {
          text: "Grant applications must include detailed milestone descriptions, deliverables, timelines, and funding requirements. All information provided must be accurate and truthful.",
        },
        {
          text: "Funded projects are subject to milestone-based releases through our Trustless Work smart escrow system. Funds are released only upon successful completion and verification of milestones.",
        },
        {
          text: "Grant recipients must provide regular progress updates and submit deliverables as specified in their approved proposals. Failure to meet milestones may result in funding suspension or termination.",
        },
      ],
    },
    {
      id: "escrow",
      title: "Smart Escrow and Trustless Work",
      icon: <Shield className="w-5 h-5" />,
      content: [
        {
          text: "All grant funds are held in smart escrow contracts that automatically release payments upon milestone completion and verification by designated reviewers or community consensus.",
        },
        {
          text: "The Trustless Work system ensures transparent and secure fund management without requiring traditional intermediaries. All transactions are recorded on-chain for full transparency.",
        },
        {
          text: "Users acknowledge that smart contract interactions are irreversible once confirmed on the blockchain. We recommend thorough testing and understanding before engaging with escrow functions.",
        },
      ],
    },
    {
      id: "prohibited",
      title: "Prohibited Activities",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        {
          text: "You may not submit fraudulent grant applications, misrepresent project capabilities, or provide false information about milestone completion.",
        },
        {
          text: "Manipulation of the platform's governance mechanisms, vote buying, or any form of system abuse is strictly prohibited.",
        },
        {
          text: "You may not use our platform for projects involving illegal activities, hate speech, discrimination, or any content that violates community standards.",
        },
      ],
    },
    {
      id: "intellectual",
      title: "Intellectual Property and Open Source",
      icon: <FileText className="w-5 h-5" />,
      content: [
        {
          text: "Grant recipients retain ownership of their intellectual property but may be required to open-source certain deliverables as specified in their grant agreements.",
        },
        {
          text: "GrantFox is an open-source platform, and users are encouraged to contribute to its development while respecting existing licenses and contributor agreements.",
        },
        {
          text: "Any improvements or modifications to the GrantFox platform made by users may be subject to the same open-source license terms.",
        },
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <Gavel className="w-5 h-5" />,
      content: [
        {
          text: "GrantFox provides a platform for connecting grant funders and recipients but does not guarantee project success or milestone completion. Users participate at their own risk.",
        },
        {
          text: "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our platform, including smart contract failures or blockchain network issues.",
        },
        {
          text: "Our total liability to you for any claims arising from these terms or your use of our services shall not exceed the platform fees you paid to us in the 12 months preceding the claim.",
        },
      ],
    },
    {
      id: "termination",
      title: "Account Termination",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        {
          text: "We may suspend or terminate your access to GrantFox if you violate these terms, engage in fraudulent activities, or compromise the integrity of the platform.",
        },
        {
          text: "You may cease using the platform at any time, but ongoing grant obligations and escrow commitments will remain in effect until properly resolved.",
        },
        {
          text: "Upon termination, your right to use our platform will cease immediately, but these terms will remain in effect regarding prior activities and outstanding obligations.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-green-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">GrantFox</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              asChild
              className="text-gray-300 hover:text-white"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 bg-red-600">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Please read these terms carefully before using GrantFox&apos;s
            milestone-based funding platform. By using our platform, you agree
            to these terms and conditions.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <span>Last updated: December 15, 2024</span>
            <span>•</span>
            <span>Effective: December 15, 2024</span>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mb-12 border-orange-500/30 bg-gradient-to-r from-orange-900/20 to-red-900/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-400 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-300 mb-2">
                  Important Notice
                </h3>
                <p className="text-orange-700 text-sm">
                  These terms contain important information about your rights
                  and obligations when using GrantFox&apos;s Trustless Work
                  smart escrow system. Please read them carefully. By using
                  GrantFox, you agree to be bound by these terms. If you
                  don&apos;t agree, please don&apos;t use our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card className="mb-12 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FileText className="mr-2 w-5 h-5" />
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-gray-300 hover:text-white"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.title}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <Card
              key={section.id}
              id={section.id}
              className="scroll-mt-20 bg-slate-800/50 border-slate-700 backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white mr-3">
                    {section.icon}
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.content.map((item, itemIndex) => (
                  <p key={itemIndex} className="text-gray-300 leading-relaxed">
                    {item.text}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Scale className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-white">
              Questions About These Terms?
            </h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms of Service, please
              contact our team or check our documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
              >
                <Link href="https://github.com/GrantChain/GrantFox.git">
                  View Documentation
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
