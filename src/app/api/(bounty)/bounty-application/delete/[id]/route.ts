import { handleDatabaseError, prisma } from "@/lib/prisma";
// src/app/api/(bounty)/bounty-application/delete/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
//The generated IDs are not UUIDs, so we skip this validation for now
// import { bountyApplicationParamsSchema } from "@/components/modules/bounty/schema/bounty-application.schema";

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

    // The generated IDs are not UUIDs, so we skip this validation for now
    // try {
    //   bountyApplicationParamsSchema.parse({ id: applicationId });
    // } catch (validationError) {
    //   if (validationError instanceof ZodError) {
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         error: "Invalid application ID format",
    //         details: validationError.errors.map(err => ({
    //           path: err.path.join('.'),
    //           message: err.message
    //         }))
    //       },
    //       { status: 400 }
    //     );
    //   }
    // }

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

    if (existingApplication.application_status === "APPROVED") {
      const restrictedPayoutStatuses = ["IN_PROGRESS", "COMPLETED", "CLOSED"];
      if (
        restrictedPayoutStatuses.includes(existingApplication.payout.status)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot delete an approved application for a payout with status: ${existingApplication.payout.status}. Please reject the application first.`,
          },
          { status: 400 },
        );
      }
    }

    if ((existingApplication.payout.status as string) === "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete application for a completed payout",
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

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid application ID format",
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
