import { getContributorAttributionSummary } from "@/lib/attribution-service";
import { handleDatabaseError } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Retrieves verified attribution metrics and pull request contribution records for a user.
 *
 * @param _request The HTTP Request object
 * @param context Context containing dynamic route parameters
 * @returns JSON response containing summary metrics and contribution records
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await context.params;
    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 },
      );
    }

    const summary = await getContributorAttributionSummary(username);

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error: unknown) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
