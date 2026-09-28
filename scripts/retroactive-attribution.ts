import {
  ContributionStatus,
  Currency,
  PrismaClient,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

interface GitHubPrSummary {
  number: number;
  title: string;
  html_url: string;
  merged_at: string | null;
  body: string | null;
}

/**
 * Fetches merged pull requests created by a specific author in a given repository.
 *
 * @param owner Repository owner organization or user
 * @param repo Repository name
 * @param author Author username
 * @returns Array of pull requests merged by the author
 */
async function fetchAuthorMergedPrs(
  owner: string,
  repo: string,
  author: string,
): Promise<GitHubPrSummary[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GrantFox-Attribution-CLI",
  };

  const token =
    process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const query = `repo:${owner}/${repo} is:pr is:merged author:${author}`;
  const searchUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100`;

  const res = await fetch(searchUrl, { headers });
  if (!res.ok) {
    throw new Error(
      `GitHub search API error ${res.status}: ${await res.text()}`,
    );
  }

  const searchData = await res.json();
  const items = searchData.items || [];

  return items.map((item: any) => ({
    number: item.number,
    title: item.title,
    html_url: item.html_url,
    merged_at: item.closed_at,
    body: item.body,
  }));
}

/**
 * Main execution function for retroactive attribution CLI.
 */
async function main() {
  const targetAuthor = process.env.ATTRIBUTION_USER || "pq198363-ops";
  const targetRepos = (
    process.env.ATTRIBUTION_REPOS ||
    "Agentpay-Org/Agentpay-backend,Agentpay-Org/Agentpay-frontend"
  ).split(",");

  console.log(
    `Starting retroactive attribution processing for author: ${targetAuthor}`,
  );

  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: targetAuthor, mode: "insensitive" } },
        { email: { contains: targetAuthor, mode: "insensitive" } },
      ],
    },
  });

  if (!user) {
    console.log(
      `User ${targetAuthor} not found in database. Initializing stub user and grantee record for attribution staging.`,
    );
    const now = new Date();
    user = await prisma.user.create({
      data: {
        username: targetAuthor,
        email: `${targetAuthor}@users.noreply.github.com`,
        role: "GRANTEE",
        is_active: true,
        created_at: new Date("2026-07-18T00:00:00Z"),
        updated_at: now,
      },
    });

    await prisma.grantee.create({
      data: {
        user_id: user.user_id,
        name: targetAuthor,
        social_media: { github: `https://github.com/${targetAuthor}` },
        created_at: new Date("2026-07-18T00:00:00Z"),
        updated_at: now,
      },
    });
  }

  let totalAttributed = 0;

  for (const repoSlug of targetRepos) {
    const [owner, repo] = repoSlug.trim().split("/");
    if (!owner || !repo) continue;

    console.log(`Querying merged pull requests for ${owner}/${repo}...`);
    try {
      const prs = await fetchAuthorMergedPrs(owner, repo, targetAuthor);
      console.log(
        `Found ${prs.length} merged pull requests for ${targetAuthor} in ${owner}/${repo}.`,
      );

      for (const pr of prs) {
        const repository = `${owner}/${repo}`;
        const issueMatch = (pr.body || "").match(
          /(?:closes|fixes|resolves)\s+(?:https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/issues\/(\d+)|#(\d+))/i,
        );
        let issueUrl: string | null = null;
        if (issueMatch) {
          const issueNum = issueMatch[1] || issueMatch[2];
          issueUrl = `https://github.com/${repository}/issues/${issueNum}`;
        }

        await prisma.granteeContribution.upsert({
          where: {
            repository_pr_number: {
              repository,
              pr_number: pr.number,
            },
          },
          create: {
            grantee_id: user.user_id,
            github_username: targetAuthor,
            repository,
            pr_number: pr.number,
            pr_url: pr.html_url,
            pr_title: pr.title,
            issue_url: issueUrl,
            merged_at: pr.merged_at ? new Date(pr.merged_at) : null,
            status: ContributionStatus.VERIFIED,
            reward_eligible: true,
            reward_amount: 0,
            currency: Currency.USDC,
            notes: "Retroactively attributed from official campaign",
          },
          update: {
            grantee_id: user.user_id,
            github_username: targetAuthor,
            pr_title: pr.title,
            issue_url: issueUrl,
            merged_at: pr.merged_at ? new Date(pr.merged_at) : null,
            status: ContributionStatus.VERIFIED,
            reward_eligible: true,
            notes: "Retroactive attribution refreshed",
          },
        });

        totalAttributed += 1;
      }
    } catch (err: unknown) {
      console.error(`Error processing repository ${repoSlug}:`, err);
    }
  }

  console.log(
    `Retroactive attribution complete. Total contributions attributed: ${totalAttributed}.`,
  );
}

main()
  .catch((e) => {
    console.error("Execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
