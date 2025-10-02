import { handleDatabaseError, prisma } from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dateNow = new Date();

    if (!body.payout_id || !body.grantee_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: "payout_id and grantee_id are required" 
        },
        { status: 400 },
      );
    }

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
      dateNow > new Date(payout.application_deadline)
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
      created_at: dateNow,
      updated_at: dateNow,

      ...(body.application_message && {
        application_message: body.application_message,
      }),
      ...(body.proposed_completion_date && {
        proposed_completion_date: new Date(body.proposed_completion_date),
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

    return NextResponse.json(
      {
        success: true,
        data: newApplication,
        message: "Application submitted successfully",
      },
      { status: 201 },
    );
    
  } catch (error) {
    console.error("Error in create bounty application route:", error);
    return handleDatabaseError(error);
  }
}