import { SearchX } from "lucide-react";
import { Card } from "../ui/card";

export const NoData = () => {
  return (
    <Card className="flex my-20 max-w-3xl mx-auto flex-col items-center justify-center py-12 px-4 text-center p-10">
      <div className="rounded-full bg-muted p-4 mb-4">
        <SearchX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No data found</h3>
      <p className="text-muted-foreground max-w-sm">
        We couldn't find any data matching your criteria. Try adjusting your
        filters or check back later for new data.
      </p>
    </Card>
  );
};
