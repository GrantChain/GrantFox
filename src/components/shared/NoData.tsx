import { SearchX } from "lucide-react";

export const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <SearchX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No data found</h3>
      <p className="text-muted-foreground max-w-sm">
        We couldn't find any data matching your criteria. Try adjusting your
        filters or check back later for new data.
      </p>
    </div>
  );
};
