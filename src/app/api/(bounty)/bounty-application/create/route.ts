import { bountyApplicationCreateSchema } from "@/components/modules/bounty/schema/bounty-application.schema";
import { handleDatabaseError, prisma } from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
// src/app/api/(bounty)/bounty-application/create/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date();

    const validatedData = bountyApplicationCreateSchema.parse(body);

    const payout = await prisma.payout.findUnique({
      where: { payout_id: body.payout_id },
      select: {
        payout_id: true,
        status: true,
        application_deadline: true,
        title: true,
      },
    });

    if (!payout) {
      return NextResponse.json(
        { success: false, error: "Payout not found" },
        { status: 404 },
      );
    }

    if (
      payout.application_deadline &&
      new Date() > new Date(payout.application_deadline)
    ) {
      return NextResponse.json(
        { success: false, error: "Application deadline has passed" },
        { status: 400 },
      );
    }

    const grantee = await prisma.grantee.findUnique({
      where: { user_id: body.grantee_id },
      select: {
        user_id: true,
        name: true,
      },
    });

    if (!grantee) {
      return NextResponse.json(
        { success: false, error: "Grantee not found" },
        { status: 404 },
      );
    }

    const existingApplication = await prisma.bountyApplication.findFirst({
      where: {
        payout_id: body.payout_id,
        grantee_id: body.grantee_id,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          error: "Application already exists for this payout and grantee",
        },
        { status: 409 },
      );
    }

    const applicationWithId = {
      application_id: createId(),
      payout_id: body.payout_id,
      grantee_id: body.grantee_id,
      application_status: "PENDING" as const,
      created_at: now,
      updated_at: now,

      ...(validatedData.application_message && {
        application_message: validatedData.application_message,
      }),
      ...(validatedData.proposed_completion_date && {
        proposed_completion_date: new Date(
          validatedData.proposed_completion_date,
        ),
      }),
    };

    const newApplication = await prisma.bountyApplication.create({
      data: applicationWithId,
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

    if (!newApplication) {
      console.error("No data returned from Prisma");
      return NextResponse.json(
        { success: false, error: "Failed to create application" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: newApplication,
        message: "Application submitted successfully",
      },
      { status: 201 },
    );
  } catch (error) {
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
