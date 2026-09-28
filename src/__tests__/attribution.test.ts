import assert from "node:assert/strict";
import { ContributionStatus } from "../generated/prisma";
import {
  calculateAttributionMetrics,
  parsePullRequestUrl,
} from "../lib/attribution-service";

/**
 * Test suite for pull request URL parsing.
 */
function testParsePullRequestUrl() {
  const validUrl = "https://github.com/Agentpay-Org/Agentpay-backend/pull/190";
  const parsed = parsePullRequestUrl(validUrl);
  assert.ok(parsed !== null, "Expected valid parsed result");
  assert.equal(parsed.owner, "Agentpay-Org");
  assert.equal(parsed.repo, "Agentpay-backend");
  assert.equal(parsed.number, 190);

  const frontendUrl =
    "https://github.com/Agentpay-Org/Agentpay-frontend/pull/228";
  const parsedFrontend = parsePullRequestUrl(frontendUrl);
  assert.ok(parsedFrontend !== null, "Expected valid parsed result");
  assert.equal(parsedFrontend.owner, "Agentpay-Org");
  assert.equal(parsedFrontend.repo, "Agentpay-frontend");
  assert.equal(parsedFrontend.number, 228);

  const invalidUrl =
    "https://github.com/Agentpay-Org/Agentpay-backend/issues/39";
  assert.equal(parsePullRequestUrl(invalidUrl), null);

  const emptyUrl = "";
  assert.equal(parsePullRequestUrl(emptyUrl), null);
}

/**
 * Test suite for attribution metric aggregations.
 */
function testCalculateAttributionMetrics() {
  const sampleContributions = [
    {
      status: ContributionStatus.VERIFIED,
      reward_eligible: true,
      reward_amount: 150,
      issue_url: "https://github.com/Agentpay-Org/Agentpay-backend/issues/39",
    },
    {
      status: ContributionStatus.VERIFIED,
      reward_eligible: true,
      reward_amount: 200,
      issue_url: "https://github.com/Agentpay-Org/Agentpay-frontend/issues/45",
    },
    {
      status: ContributionStatus.VERIFIED,
      reward_eligible: false,
      reward_amount: 0,
      issue_url: null,
    },
    {
      status: ContributionStatus.PENDING,
      reward_eligible: true,
      reward_amount: 100,
      issue_url: "https://github.com/Agentpay-Org/Agentpay-backend/issues/50",
    },
    {
      status: ContributionStatus.REJECTED,
      reward_eligible: false,
      reward_amount: 50,
      issue_url: "https://github.com/Agentpay-Org/Agentpay-backend/issues/51",
    },
  ];

  const metrics = calculateAttributionMetrics(sampleContributions);

  assert.equal(metrics.prs_merged, 3, "Expected 3 verified merged PRs");
  assert.equal(
    metrics.issues_delivered,
    2,
    "Expected 2 issues delivered from verified PRs",
  );
  assert.equal(
    metrics.financials,
    350,
    "Expected 350 total financials from eligible verified rewards",
  );
}

/**
 * Test suite verifying real pull request verification against live GitHub API.
 */
async function testVerifyPullRequestLive() {
  const { verifyPullRequest } = await import("../lib/attribution-service");
  try {
    const pr = await verifyPullRequest("Agentpay-Org", "Agentpay-backend", 190);
    assert.equal(pr.repository, "Agentpay-Org/Agentpay-backend");
    assert.equal(pr.pr_number, 190);
    assert.ok(pr.pr_title.length > 0, "PR should have a non-empty title");
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (
      errorMsg.includes("API rate limit exceeded") ||
      errorMsg.includes("HTTP 403")
    ) {
      console.warn(
        "GitHub API rate limit encountered; skipping live test assert.",
      );
    } else {
      throw err;
    }
  }
}

/**
 * Runs all unit tests.
 */
async function runTests() {
  testParsePullRequestUrl();
  testCalculateAttributionMetrics();
  await testVerifyPullRequestLive();
  console.log("All attribution unit tests passed successfully.");
}

runTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
