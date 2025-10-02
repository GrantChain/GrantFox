import { handleDatabaseError, prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const filters = {
      payout_id: body.payout_id,
      grantee_id: body.grantee_id,
      application_status: body.application_status,
      page: Number(body.page) || 1,
      limit: Number(body.limit) || 10,
      sort_by: (body.sort_by as string) || "created_at",
      sort_order: (body.sort_order as string) || "desc",
    };

    if (filters.page < 1 || filters.limit < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "page and limit must be integers greater than or equal to 1",
        },
        { status: 400 },
      );
    }

    const sortableFields = ["created_at", "updated_at", "application_status"] as const;
    if (!sortableFields.includes(filters.sort_by)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid sort_by. Allowed values: ${sortableFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const sortOrder = filters.sort_order.toLowerCase();
    if (sortOrder !== "asc" && sortOrder !== "desc") {
      return NextResponse.json(
        {
          success: false,
          error: "sort_order must be 'asc' or 'desc'",
        },
        { status: 400 },
      );
    }

    const whereConditions: {
      payout_id?: string;
      grantee_id?: string;
      application_status?: "PENDING" | "APPROVED" | "REJECTED";
    } = {};

    if (filters.payout_id) {
      whereConditions.payout_id = filters.payout_id;
    }

    if (filters.grantee_id) {
      whereConditions.grantee_id = filters.grantee_id;
    }

    if (filters.application_status) {
      if (
        !["PENDING", "APPROVED", "REJECTED"].includes(
          filters.application_status,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid application_status. Must be one of: PENDING, APPROVED, REJECTED. Received: ${filters.application_status}`,
          },
          { status: 400 },
        );
      }
      whereConditions.application_status = filters.application_status as
        | "PENDING"
        | "APPROVED"
        | "REJECTED";
    }

    const offset = (filters.page - 1) * filters.limit;

    const applications = await prisma.bountyApplication.findMany({
      where: whereConditions,
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
      orderBy: {
        [filters.sort_by]: sortOrder as "asc" | "desc",
      },
      skip: offset,
      take: filters.limit,
    });

    let totalCount = 0;
    try {
      totalCount = await prisma.bountyApplication.count({
        where: whereConditions,
      });
    } catch (countError) {
      console.error(
        "Count query failed, using applications length:",
        countError,
      );
      totalCount = applications.length;
    }

    const totalPages = Math.ceil(totalCount / filters.limit);
    const hasNextPage = filters.page < totalPages;
    const hasPrevPage = filters.page > 1;

    const response = {
      success: true,
      data: applications,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
        showing: applications.length,
      },
      filters: {
        payout_id: filters.payout_id,
        grantee_id: filters.grantee_id,
        application_status: filters.application_status,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in find-all bounty application route:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid filter parameters",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    const { message, status } = handleDatabaseError(error);
    return NextResponse.json(
      { success: false, error: message },
      { status },
    );
  }
}
