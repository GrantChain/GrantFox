import { Grant } from "@/@types/grant.entity";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GrantCardProps {
  grant: Grant;
}

export const GrantCard = ({ grant }: GrantCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2">{grant.title}</CardTitle>
          <Badge variant={grant.status === "open" ? "default" : "secondary"}>
            {grant.status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {grant.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Funding</span>
            <span className="font-medium">
              {grant.total_funding} {grant.currency}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm">
              {new Date(grant.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">Metrics:</div>
          <p className="text-sm line-clamp-2">{grant.metrics}</p>
        </div>
      </CardFooter>
    </Card>
  );
};
