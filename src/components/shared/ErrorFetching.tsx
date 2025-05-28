import { AlertTriangle } from "lucide-react";
import { Card } from "../ui/card";

export const ErrorFetching = () => {
  return (
    <Card className="flex my-20 max-w-3xl mx-auto flex-col items-center justify-center py-12 px-4 text-center p-10">
      <div className="rounded-full bg-muted p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Error fetching data</h3>
      <p className="text-muted-foreground max-w-sm">
        We couldn&apos;t fetch the data. Please try again later.
      </p>
    </Card>
  );
};
