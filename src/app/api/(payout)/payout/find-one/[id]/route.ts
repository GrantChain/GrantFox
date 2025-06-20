import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const data = await prisma.payout.findUnique({
      where: {
        payout_id: id,
      },
    });

    if (!data) {
      return NextResponse.json(
        { error: `Payout with ID ${id} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
