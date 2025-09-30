import { ticketCreateSchema } from "@/components/modules/support/schema/ticket.schema";
import { sendSupportTicketNotifications } from "@/lib/email-service";
import { handleDatabaseError, prisma } from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = ticketCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { user_id, ...payload } = parsed.data;

    const effectiveUserId = user_id || json.user_id;
    if (!effectiveUserId) {
      return NextResponse.json(
        { error: "Missing user context" },
        { status: 401 },
      );
    }

    const now = new Date();
    const record = await prisma.supportTicket.create({
      data: {
        ticket_id: createId(),
        user_id: effectiveUserId,
        category: payload.category,
        subject: payload.subject,
        message: payload.message,
        attachments: payload.attachments,
        // status defaults to OPEN
        created_at: now,
        updated_at: now,
      },
    });

    try {
      const user = await prisma.user.findUnique({
        where: { user_id: record.user_id },
        select: { email: true },
      });
      if (user?.email) {
        await sendSupportTicketNotifications({
          userEmail: user.email,
          ticket: {
            ticket_id: record.ticket_id,
            subject: record.subject,
            category: record.category,
          },
        });
      }
    } catch (e) {
      console.warn("Support ticket email notifications failed", e);
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
