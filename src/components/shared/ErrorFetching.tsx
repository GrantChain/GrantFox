import { AlertTriangle } from "lucide-react";

export const ErrorFetching = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Error fetching data</h3>
      <p className="text-muted-foreground max-w-sm">
        We couldn't fetch the data. Please try again later.
      </p>
    </div>
  );
};
