import { handleDatabaseError, prisma } from "@/lib/prisma";
// src/app/api/(bounty)/bounty-application/find-one/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
// The generated IDs are not UUIDs, so we skip this validation for now
// import { bountyApplicationParamsSchema } from "@/components/modules/bounty/schema/bounty-application.schema";
import { ZodError } from "zod";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const application = await prisma.bountyApplication.findUnique({
      where: {
        application_id: applicationId,
      },
      include: {
        payout: {
          select: {
            payout_id: true,
            title: true,
            description: true,
            total_funding: true,
            status: true,
            type: true,
            application_deadline: true,
            created_at: true,
          },
        },
        grantee: {
          select: {
            user_id: true,
            name: true,
            position_title: true,
            social_media: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Bounty application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error in find-one bounty application route:", error);

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
