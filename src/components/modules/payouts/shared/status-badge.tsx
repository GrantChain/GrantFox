import type { Milestone } from "@/@types/milestones.entity";
import TooltipInfo from "@/components/shared/TooltipInfo";
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (milestone: Milestone) => {
  const status = milestone.status as string | undefined;
  const flags =
    (
      milestone as Record<string, unknown> & {
        flags?: { approved?: boolean; disputed?: boolean; released?: boolean };
      }
    ).flags || {};

  if (flags.released) {
    return <Badge variant="success">Released</Badge>;
  }

  // Show Pending Release for COMPLETED regardless of approved flag
  if (status === "COMPLETED") {
    return (
      <TooltipInfo content="Notify to GrantFox to release the funds">
        <Badge variant="warning">Pending Release</Badge>
      </TooltipInfo>
    );
  }

  const approved = Boolean(flags.approved);
  if (approved) {
    return <Badge variant="success">Approved</Badge>;
  }

  if (flags.disputed) {
    return <Badge variant="destructive">Disputed</Badge>;
  }

  switch (status) {
    case "SUBMITTED":
      return <Badge>Submitted</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
};
