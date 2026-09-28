import type { Prisma } from "@/generated/prisma";
import { ContributionStatus, Currency } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export interface ParsedPrUrl {
  owner: string;
  repo: string;
  number: number;
}

export interface VerifiedPullRequest {
  repository: string;
  pr_number: number;
  pr_url: string;
  pr_title: string;
  author_login: string;
  merged: boolean;
  merged_at: string | null;
  issue_url: string | null;
  issue_title: string | null;
  reward_eligible: boolean;
}

export interface AttributionSummary {
  prs_merged: number;
  issues_delivered: number;
  financials: number;
  currency: string;
  contributions: Array<{
    contribution_id: string;
    repository: string;
    pr_number: number;
    pr_url: string;
    pr_title: string | null;
    issue_url: string | null;
    issue_title: string | null;
    merged_at: Date | null;
    status: ContributionStatus;
    reward_eligible: boolean;
    reward_amount: number;
    currency: Currency | null;
  }>;
}

/**
 * Parses a GitHub pull request URL into its constituent owner, repository, and pull number.
 *
 * @param url The GitHub pull request URL
 * @returns Parsed owner, repo, and number, or null if invalid
 */
export function parsePullRequestUrl(url: string): ParsedPrUrl | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  const pattern = /github\.com\/([^/\s]+)\/([^/\s]+)\/pull\/(\d+)/i;
  const match = trimmed.match(pattern);

  if (!match) {
    return null;
  }

  const number = Number.parseInt(match[3], 10);
  if (Number.isNaN(number) || number <= 0) {
    return null;
  }

  return {
    owner: match[1],
    repo: match[2],
    number,
  };
}

/**
 * Verifies a pull request using the public GitHub REST API.
 * Validates PR merge state, author identity, and extracts related issue links.
 *
 * @param owner The GitHub repository owner
 * @param repo The GitHub repository name
 * @param number The pull request number
 * @param expectedAuthor Optional expected GitHub login of the author
 * @returns Verified pull request details
 */
export async function verifyPullRequest(
  owner: string,
  repo: string,
  number: number,
  expectedAuthor?: string,
): Promise<VerifiedPullRequest> {
  const repository = `${owner}/${repo}`;
  const prUrl = `https://github.com/${repository}/pull/${number}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GrantFox-Attribution-Engine",
  };

  const token =
    process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`;
  const response = await fetch(apiUrl, { headers });

  if (!response.ok) {
    throw new Error(
      `GitHub API returned HTTP ${response.status} for ${repository}#${number}`,
    );
  }

  const data = await response.json();
  const authorLogin = data.user?.login || "";
  const isMerged = Boolean(data.merged_at || data.merged);

  if (
    expectedAuthor &&
    authorLogin.toLowerCase() !== expectedAuthor.toLowerCase()
  ) {
    throw new Error(
      `Author mismatch for ${repository}#${number}: expected ${expectedAuthor}, found ${authorLogin}`,
    );
  }

  const body = String(data.body || "");
  const issueMatch = body.match(
    /(?:closes|fixes|resolves)\s+(?:https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/issues\/(\d+)|#(\d+))/i,
  );
  let issueUrl: string | null = null;
  if (issueMatch) {
    const issueNum = issueMatch[1] || issueMatch[2];
    issueUrl = `https://github.com/${repository}/issues/${issueNum}`;
  }

  return {
    repository,
    pr_number: number,
    pr_url: data.html_url || prUrl,
    pr_title: String(data.title || `PR #${number}`),
    author_login: authorLogin,
    merged: isMerged,
    merged_at: data.merged_at || null,
    issue_url: issueUrl,
    issue_title: null,
    reward_eligible: isMerged,
  };
}

/**
 * Calculates contributor attribution metrics including total merged PRs, delivered issues, and financials.
 *
 * @param contributions Array of contribution records
 * @returns Calculated aggregate statistics
 */
export function calculateAttributionMetrics(
  contributions: Array<{
    status: ContributionStatus | string;
    reward_eligible: boolean;
    reward_amount: number | Prisma.Decimal | null;
    issue_url?: string | null;
  }>,
): { prs_merged: number; issues_delivered: number; financials: number } {
  let prsMerged = 0;
  let issuesDelivered = 0;
  let financials = 0;

  for (const item of contributions) {
    if (
      item.status === ContributionStatus.VERIFIED ||
      item.status === "VERIFIED"
    ) {
      prsMerged += 1;
      if (item.issue_url) {
        issuesDelivered += 1;
      }
      if (item.reward_eligible && item.reward_amount) {
        financials += Number(item.reward_amount);
      }
    }
  }

  return {
    prs_merged: prsMerged,
    issues_delivered: issuesDelivered,
    financials,
  };
}

/**
 * Ingests and verifies a batch of pull request URLs retroactively for a given GrantFox user.
 *
 * @param params Object containing grantee_id, github_username, and array of pr_urls
 * @returns Result summary including processed and newly verified contributions
 */
export async function batchRetroactiveAttribute(params: {
  grantee_id: string;
  github_username: string;
  pr_urls: string[];
  notes?: string;
}): Promise<{
  processed: number;
  verified: number;
  contributions: Array<VerifiedPullRequest>;
  errors: string[];
}> {
  const { grantee_id, github_username, pr_urls, notes } = params;
  const verifiedList: Array<VerifiedPullRequest> = [];
  const errors: string[] = [];

  for (const prUrl of pr_urls) {
    const parsed = parsePullRequestUrl(prUrl);
    if (!parsed) {
      errors.push(`Invalid pull request URL format: ${prUrl}`);
      continue;
    }

    try {
      const verified = await verifyPullRequest(
        parsed.owner,
        parsed.repo,
        parsed.number,
        github_username,
      );

      if (!verified.merged) {
        errors.push(
          `Pull request ${verified.repository}#${verified.pr_number} is not merged`,
        );
        continue;
      }

      await prisma.granteeContribution.upsert({
        where: {
          repository_pr_number: {
            repository: verified.repository,
            pr_number: verified.pr_number,
          },
        },
        create: {
          grantee_id,
          github_username,
          repository: verified.repository,
          pr_number: verified.pr_number,
          pr_url: verified.pr_url,
          pr_title: verified.pr_title,
          issue_url: verified.issue_url,
          issue_title: verified.issue_title,
          merged_at: verified.merged_at ? new Date(verified.merged_at) : null,
          status: ContributionStatus.VERIFIED,
          reward_eligible: verified.reward_eligible,
          reward_amount: 0,
          currency: Currency.USDC,
          notes: notes || "Retroactive attribution",
        },
        update: {
          grantee_id,
          github_username,
          pr_title: verified.pr_title,
          issue_url: verified.issue_url,
          merged_at: verified.merged_at ? new Date(verified.merged_at) : null,
          status: ContributionStatus.VERIFIED,
          reward_eligible: verified.reward_eligible,
          notes: notes || "Retroactive attribution updated",
        },
      });

      verifiedList.push(verified);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      errors.push(errorMsg);
    }
  }

  return {
    processed: pr_urls.length,
    verified: verifiedList.length,
    contributions: verifiedList,
    errors,
  };
}

/**
 * Retrieves full attribution summary and history for a given grantee ID or GitHub username.
 *
 * @param identifier The grantee user ID or GitHub username
 * @returns Aggregated attribution summary with metrics and contribution details
 */
export async function getContributorAttributionSummary(
  identifier: string,
): Promise<AttributionSummary> {
  const records = await prisma.granteeContribution.findMany({
    where: {
      OR: [
        { grantee_id: identifier },
        { github_username: { equals: identifier, mode: "insensitive" } },
      ],
    },
    orderBy: {
      merged_at: "desc",
    },
  });

  const formatted = records.map((r) => ({
    contribution_id: r.contribution_id,
    repository: r.repository,
    pr_number: r.pr_number,
    pr_url: r.pr_url,
    pr_title: r.pr_title,
    issue_url: r.issue_url,
    issue_title: r.issue_title,
    merged_at: r.merged_at,
    status: r.status,
    reward_eligible: r.reward_eligible,
    reward_amount: r.reward_amount ? Number(r.reward_amount) : 0,
    currency: r.currency,
  }));

  const metrics = calculateAttributionMetrics(formatted);

  return {
    ...metrics,
    currency: "USDC",
    contributions: formatted,
  };
}
