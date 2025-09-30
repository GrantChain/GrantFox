import { ticketStatusUpdateSchema } from "@/components/modules/support/schema/ticket.schema";
import { handleDatabaseError, prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// Temporary type override comment: ensure prisma generated before relying on types

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const parsed = ticketStatusUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await prisma.supportTicket.update({
      where: { ticket_id: id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
