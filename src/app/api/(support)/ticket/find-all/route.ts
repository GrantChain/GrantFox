import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      page = 1,
      pageSize = 10,
      status,
      category,
      role,
    } = await request.json();
    // TODO: Replace role check with real auth context extraction
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const take = Math.min(pageSize, 50);
    const skip = (page - 1) * take;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const ticketRepo = prisma.supportTicket;
    const [total, data] = await Promise.all([
      ticketRepo.count({ where }),
      ticketRepo.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
        include: {
          user: { select: { user_id: true, email: true, username: true } },
        },
      }),
    ]);

    return NextResponse.json({ data, total });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
