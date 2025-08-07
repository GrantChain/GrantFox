import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import Link from "next/link";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4 px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Access Denied
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-8 sm:px-8 sm:pb-10">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              This could be because:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 px-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your account doesn't have the required role</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your session has expired</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You're trying to access a restricted area</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
