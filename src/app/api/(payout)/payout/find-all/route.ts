import type { Prisma } from "@/generated/prisma";
import { UserRole } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { filters, pagination, role, userId } = await request.json();

    // Validate role
    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 },
      );
    }

    const where: Prisma.PayoutWhereInput = {};

    // Apply role-based filtering
    if (role && userId) {
      if (role === UserRole.GRANTEE) {
        where.grantee_id = userId;
      } else if (role === UserRole.PAYOUT_PROVIDER) {
        where.created_by = userId;
      }
    }

    if (filters) {
      if (filters.search) {
        where.title = {
          contains: filters.search,
          mode: "insensitive",
        };
      }
      if (filters.minFunding || filters.maxFunding) {
        where.total_funding = {
          ...(filters.minFunding ? { gte: filters.minFunding } : {}),
          ...(filters.maxFunding ? { lte: filters.maxFunding } : {}),
        };
      }
      if (filters.startDate || filters.endDate) {
        where.created_at = {
          ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
          ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
        };
      }
    }

    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    try {
      // First, try to get the count
      const total = await prisma.payout.count({ where });

      // Then, get the data
      const data = await prisma.payout.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          created_at: "desc",
        },
        include: {
          user: {
            select: {
              user_id: true,
              email: true,
              username: true,
              profile_url: true,
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

      return NextResponse.json({ data, total });
    } catch (error) {
      console.error("Prisma query error:", error);

      // Check if it's a connection error
      if (
        error instanceof Error &&
        error.message.includes("prepared statement")
      ) {
        return NextResponse.json(
          { error: "Database connection error. Please try again." },
          { status: 503 },
        );
      }

      return NextResponse.json(
        {
          error: `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in find all payouts route:", error);
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
