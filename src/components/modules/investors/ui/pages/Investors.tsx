"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Globe,
  Briefcase,
  Award,
} from "lucide-react";

const Investors = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Investors</h1>
          <p className="text-muted-foreground">
            Connect with investors and explore funding opportunities
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Investors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Active investors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Funding
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">
                Total investment amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Investments
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Ongoing investments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Portfolio Companies
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Funded projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Investors Directory */}
          <Card>
            <CardHeader>
              <CardTitle>Investor Directory</CardTitle>
              <CardDescription>
                Browse and connect with investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="space-y-2">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No investors available yet
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Opportunities</CardTitle>
              <CardDescription>
                Explore projects seeking funding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="space-y-2">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No opportunities available yet
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Why Connect with Investors?</CardTitle>
            <CardDescription>
              Discover the benefits of our investor network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Globe className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Global Network</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with investors from around the world and expand your reach
                </p>
              </div>
              <div className="space-y-2">
                <Briefcase className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Strategic Partnerships</h3>
                <p className="text-sm text-muted-foreground">
                  Build long-term relationships with investors who share your vision
                </p>
              </div>
              <div className="space-y-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Growth Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Access funding and resources to scale your projects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Investors;
