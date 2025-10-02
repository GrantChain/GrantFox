import { handleDatabaseError, prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const applicationId = params.id;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validStatuses = ["PENDING", "APPROVED", "REJECTED"] as const;
    if (
      typeof body?.application_status !== "string" ||
      !validStatuses.includes(body.application_status)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "application_status must be one of: PENDING, APPROVED, REJECTED",
        },
        { status: 400 },
      );
    }
    const applicationStatus =
      body.application_status as (typeof validStatuses)[number];

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

    const restrictedPayoutStatuses = ["COMPLETED", "CANCELLED", "CLOSED"];
    if (restrictedPayoutStatuses.includes(existingApplication.payout.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot update application status for a payout with status: ${existingApplication.payout.status}`,
        },
        { status: 400 },
      );
    }

    const updateData = {
      application_status: applicationStatus,
      updated_at: new Date(),
    } satisfies {
      application_status: (typeof validStatuses)[number];
      updated_at: Date;
    };

    if (applicationStatus === "APPROVED") {
      const existingApproved = await prisma.bountyApplication.findFirst({
        where: {
          payout_id: existingApplication.payout_id,
          application_status: "APPROVED",
          NOT: { application_id: existingApplication.application_id },
        },
      });
      if (existingApproved) {
        return NextResponse.json(
          {
            success: false,
            error: "Another application for this payout is already approved",
          },
          { status: 409 },
        );
      }
    }

    const updatedApplication = await prisma.bountyApplication.update({
      where: { application_id: applicationId },
      data: updateData,
      include: {
        payout: {
          select: {
            payout_id: true,
            title: true,
            total_funding: true,
            status: true,
          },
        },
        grantee: {
          select: {
            user_id: true,
            name: true,
            position_title: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: `Application ${body.application_status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error in update-status bounty application route:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
