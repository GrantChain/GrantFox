import { handleDatabaseError, prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const applicationId = params.id;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 },
      );
    }

    const existingApplication = await prisma.bountyApplication.findUnique({
      where: { application_id: applicationId },
      include: {
        payout: {
          select: {
            payout_id: true,
            title: true,
            status: true,
          },
        },
        grantee: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { success: false, error: "Bounty application not found" },
        { status: 404 },
      );
    }

    const IMMUTABLE_PAYOUT_STATUSES = ["COMPLETED", "CLOSED"];
    if (
      IMMUTABLE_PAYOUT_STATUSES.includes(
        existingApplication.payout.status as string,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete application for a payout with status: ${existingApplication.payout.status}`,
        },
        { status: 400 },
      );
    }

    if (
      existingApplication.application_status === "APPROVED" &&
      existingApplication.payout.status === "IN_PROGRESS"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot delete an approved application for an in-progress payout. Please reject the application first.",
        },
        { status: 400 },
      );
    }

    const deletedApplication = await prisma.bountyApplication.delete({
      where: { application_id: applicationId },
      include: {
        payout: {
          select: {
            payout_id: true,
            title: true,
          },
        },
        grantee: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bounty application deleted successfully",
      data: {
        application_id: deletedApplication.application_id,
        payout_title: deletedApplication.payout.title,
        grantee_name: deletedApplication.grantee.name,
        deleted_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in delete bounty application route:", error);
    return handleDatabaseError(error);
  }
}
