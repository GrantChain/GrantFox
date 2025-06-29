"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  LifeBuoy,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

// Support metrics configuration
const supportStats = [
  {
    label: "Avg Response Time",
    value: "< 2 hours",
    subtext: "Usually within 30 minutes",
    icon: Clock,
    trend: "+15% faster",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    progressColor: "bg-blue-500",
  },
  {
    label: "Resolution Rate",
    value: "98.5%",
    subtext: "First contact resolution",
    icon: CheckCircle,
    trend: "+2.3% this month",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
    progressColor: "bg-green-500",
  },
  {
    label: "Active Tickets",
    value: "3",
    subtext: "Your open requests",
    icon: MessageSquare,
    trend: "2 resolved today",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    progressColor: "bg-orange-500",
  },
];

export function SupportHeader() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 border">
        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <LifeBuoy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Support Center
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    We&apos;re here to help you succeed
                  </p>
                </div>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Get expert assistance with your account, report technical
                issues, or request new features. Our dedicated support team is
                available 24/7 to ensure you have the best experience.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Badge
                variant="outline"
                className="w-fit bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
              >
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                24/7 Support Available
              </Badge>
              <Badge variant="secondary" className="w-fit">
                <Users className="mr-1 h-3 w-3" />
                12 agents online
              </Badge>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {supportStats.map((stat, index) => (
          <Card
            key={stat.label}
            className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-muted/20"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bgColor}`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {stat.subtext}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span className="truncate">{stat.trend}</span>
                  </Badge>
                </div>

                <div className="h-1 w-full rounded-full bg-muted">
                  <div
                    className={`h-1 rounded-full ${stat.progressColor} transition-all duration-1000`}
                    style={{
                      width: index === 0 ? "85%" : index === 1 ? "98%" : "60%",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">Need immediate help?</h3>
              <p className="text-sm text-muted-foreground">
                Check our knowledge base or start a live chat for instant
                assistance
              </p>
            </div>
            <div className="flex gap-3">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                📚 Knowledge Base
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                💬 Live Chat
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-muted/50 transition-colors"
              >
                📞 Call Support
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
