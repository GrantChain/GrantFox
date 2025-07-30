import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Plus,
  Search,
  Users,
} from "lucide-react";
import React from "react";

const PayoutPage = () => {
  // Mock data for payouts - in real app this would come from API
  const payouts = [
    {
      id: 1,
      title: "Web3 Infrastructure Development",
      grantee: "Alice Johnson",
      amount: "$25,000",
      status: "In Progress",
      progress: 60,
      milestones: 4,
      completedMilestones: 2,
      startDate: "2024-01-15",
      endDate: "2024-04-15",
    },
    {
      id: 2,
      title: "AI Research Project",
      grantee: "Bob Smith",
      amount: "$15,000",
      status: "Completed",
      progress: 100,
      milestones: 3,
      completedMilestones: 3,
      startDate: "2023-11-01",
      endDate: "2024-02-01",
    },
    {
      id: 3,
      title: "Sustainable Finance Platform",
      grantee: "Carol Davis",
      amount: "$35,000",
      status: "Pending",
      progress: 0,
      milestones: 5,
      completedMilestones: 0,
      startDate: "2024-03-01",
      endDate: "2024-08-01",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "In Progress":
        return <Clock className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Payout Management
            </h1>
            <p className="text-muted-foreground">
              Manage and track your grant payouts and milestones
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Payout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Payouts</p>
                  <p className="text-2xl font-bold">$75,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Active Grantees</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">In Progress</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search payouts..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Payouts List */}
        <div className="space-y-4">
          {payouts.map((payout) => (
            <Card key={payout.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{payout.title}</CardTitle>
                    <CardDescription className="text-sm">
                      Grantee: {payout.grantee}
                    </CardDescription>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-lg font-bold text-green-600">
                      {payout.amount}
                    </div>
                    <Badge className={getStatusColor(payout.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(payout.status)}
                        {payout.status}
                      </div>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Progress: {payout.progress}%</span>
                  <span>
                    Milestones: {payout.completedMilestones}/{payout.milestones}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${payout.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Start: {new Date(payout.startDate).toLocaleDateString()}
                  </span>
                  <span>
                    End: {new Date(payout.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Manage Milestones
                  </Button>
                  <Button className="flex-1">Release Payment</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Payouts State */}
        {payouts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No payouts found</h3>
                  <p className="text-muted-foreground">
                    Create your first payout to get started with grant
                    management.
                  </p>
                </div>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Payout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PayoutPage;
