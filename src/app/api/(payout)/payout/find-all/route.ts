import type { Prisma } from "@/generated/prisma";
import { UserRole } from "@/generated/prisma";
import { handleDatabaseError, prisma } from "@/lib/prisma";
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
        const term = String(filters.search).trim();
        if (term.length >= 2) {
          where.title = {
            contains: term,
            mode: "insensitive",
          };
        }
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

      // New role-based filters
      if (filters.payoutProviderName && role === UserRole.GRANTEE) {
        where.user = {
          username: {
            contains: filters.payoutProviderName,
            mode: "insensitive",
          },
        };
      }

      if (filters.granteeName && role === UserRole.PAYOUT_PROVIDER) {
        where.grantee = {
          name: {
            contains: filters.granteeName,
            mode: "insensitive",
          },
        };
      }
    }

    const page = pagination?.page || 1;
    const pageSize = Math.min(pagination?.pageSize || 10, 50);
    const skip = (page - 1) * pageSize;

    // Use a single DB connection for both queries to reduce pool pressure
    // Run count and list concurrently; no transaction needed for read-only queries
    const [total, data] = await Promise.all([
      prisma.payout.count({ where }),
      prisma.payout.findMany({
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
      }),
    ]);

    return NextResponse.json({ data, total });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
