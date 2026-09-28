import { batchRetroactiveAttribute } from "@/lib/attribution-service";
import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const retroactiveRequestSchema = z.object({
  github_username: z.string().min(1, "GitHub username is required"),
  grantee_id: z.string().optional(),
  pr_urls: z
    .array(z.string().url("Each item must be a valid URL"))
    .min(1, "At least one PR URL is required"),
  notes: z.string().optional(),
});

/**
 * Handles incoming requests for retroactive pull request attribution.
 * Validates the requester and verifies merged pull requests against the GitHub API.
 *
 * @param request HTTP Request payload
 * @returns JSON response containing processed attribution results
 */
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = retroactiveRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { github_username, pr_urls, notes } = parsed.data;
    let granteeId = parsed.data.grantee_id;

    if (!granteeId) {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: { equals: github_username, mode: "insensitive" } },
            { email: { contains: github_username, mode: "insensitive" } },
          ],
        },
        select: { user_id: true },
      });

      if (user) {
        granteeId = user.user_id;
      }
    }

    if (!granteeId) {
      return NextResponse.json(
        { error: "Grantee account not found for provided GitHub username" },
        { status: 404 },
      );
    }

    const result = await batchRetroactiveAttribute({
      grantee_id: granteeId,
      github_username,
      pr_urls,
      notes: notes || "Retroactive attribution submission",
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
