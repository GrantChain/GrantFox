"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  DollarSign,
  ExternalLink,
  GitPullRequest,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface ContributionItem {
  contribution_id: string;
  repository: string;
  pr_number: number;
  pr_url: string;
  pr_title: string | null;
  issue_url: string | null;
  issue_title: string | null;
  merged_at: string | Date | null;
  status: string;
  reward_eligible: boolean;
  reward_amount: number;
  currency: string | null;
}

interface AttributionSummaryData {
  prs_merged: number;
  issues_delivered: number;
  financials: number;
  currency: string;
  contributions: ContributionItem[];
}

interface ContributorMetricsCardProps {
  userId: string;
  username: string;
  githubUsername?: string | null;
  canEdit?: boolean;
}

/**
 * Renders contributor metrics including merged PR counts, delivered issues, financials,
 * and a list of verified contributions with interactive retroactive attribution request support.
 */
export function ContributorMetricsCard({
  userId,
  username,
  githubUsername,
  canEdit = false,
}: ContributorMetricsCardProps) {
  const [data, setData] = useState<AttributionSummaryData>({
    prs_merged: 0,
    issues_delivered: 0,
    financials: 0,
    currency: "USDC",
    contributions: [],
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputGithubUser, setInputGithubUser] = useState(
    githubUsername || username || "",
  );
  const [prUrlsInput, setPrUrlsInput] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchAttributionData = async () => {
    try {
      setLoading(true);
      const targetIdentifier = username || userId;
      const res = await fetch(
        `/api/attribution/user/${encodeURIComponent(targetIdentifier)}`,
      );
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch contributor attribution data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributionData();
  }, [userId, username]);

  const handleSubmitRetroactive = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const urls = prUrlsInput
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      setSubmitError(
        "Please enter at least one valid GitHub pull request URL.",
      );
      return;
    }

    if (!inputGithubUser.trim()) {
      setSubmitError("GitHub username is required.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/attribution/retroactive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            github_username: inputGithubUser.trim(),
            grantee_id: userId,
            pr_urls: urls,
            notes: "Submitted via Contributor Profile",
          }),
        });

        const result = await res.json();
        if (!res.ok) {
          setSubmitError(
            result.error || "Failed to process retroactive attribution.",
          );
          return;
        }

        const count = result.data?.verified || 0;
        setSubmitSuccess(
          `Successfully verified and linked ${count} pull request(s).`,
        );
        setPrUrlsInput("");
        await fetchAttributionData();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Network error";
        setSubmitError(message);
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <GitPullRequest className="h-5 w-5 text-primary" />
            Contributor Activity & Attributions
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Verified merged pull requests, closed issues, and rewarded
            contributions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAttributionData}
            disabled={loading}
            aria-label="Refresh attributions"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {canEdit && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Link Pull Requests
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    Retroactive Contribution Attribution
                  </DialogTitle>
                  <DialogDescription>
                    Submit merged pull request URLs from partner campaigns to
                    verify and attribute them to your GrantFox profile.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="github-user">GitHub Username</Label>
                    <Input
                      id="github-user"
                      value={inputGithubUser}
                      onChange={(e) => setInputGithubUser(e.target.value)}
                      placeholder="e.g. pq198363-ops"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pr-urls">
                      Pull Request URLs (one per line)
                    </Label>
                    <Textarea
                      id="pr-urls"
                      rows={5}
                      value={prUrlsInput}
                      onChange={(e) => setPrUrlsInput(e.target.value)}
                      placeholder={
                        "https://github.com/Agentpay-Org/Agentpay-backend/pull/190\nhttps://github.com/Agentpay-Org/Agentpay-frontend/pull/228"
                      }
                    />
                  </div>
                  {submitError && (
                    <p className="text-sm text-destructive">{submitError}</p>
                  )}
                  {submitSuccess && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {submitSuccess}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={isPending}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleSubmitRetroactive}
                    disabled={isPending}
                  >
                    {isPending ? "Verifying..." : "Verify & Link"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4 bg-card shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              PRs Merged
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">
                {data.prs_merged}
              </span>
              <span className="text-xs text-muted-foreground">merged</span>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-card shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Issues Delivered
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">
                {data.issues_delivered}
              </span>
              <span className="text-xs text-muted-foreground">resolved</span>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-card shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Financials
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono">
                {data.financials}
              </span>
              <span className="text-xs text-muted-foreground">USDC</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">
            Attributed Contributions
          </h4>
          {data.contributions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No verified contributions recorded yet. Use the Link Pull Requests
              button above to retroactively attribute merged work.
            </div>
          ) : (
            <div className="divide-y rounded-lg border">
              {data.contributions.map((item) => (
                <div
                  key={item.contribution_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {item.repository}#{item.pr_number}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                      {item.reward_eligible && (
                        <Badge variant="secondary" className="text-xs">
                          Reward Eligible
                        </Badge>
                      )}
                    </div>
                    {item.pr_title && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.pr_title}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {item.merged_at && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.merged_at).toLocaleDateString()}
                      </span>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={item.pr_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-1 text-xs"
                      >
                        PR
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
