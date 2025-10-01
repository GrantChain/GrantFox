import { handleDatabaseError, prisma } from "@/lib/prisma";
// src/app/api/(bounty)/bounty-application/update-status/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
// The generated IDs are not UUIDs, so we skip this validation for now
// import {
//   bountyApplicationParamsSchema
// } from "@/components/modules/bounty/schema/bounty-application.schema";

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

    const updateData: {
      application_status: "PENDING" | "APPROVED" | "REJECTED";
      updated_at: Date;
    } = {
      application_status: body.application_status,
      updated_at: new Date(),
    };

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

    return handleDatabaseError(error);
  }
}
