import type {
  EmailData,
  EmailPayload,
  EmailResponse,
} from "../@types/email.entity";
import { type TemplateVariables, renderBasicTemplate } from "./email-templates";
import { resend } from "./resend";

const DEFAULT_FROM = "Grant Fox <noreply@resend.dev>";

export async function sendEmail(emailData: EmailData): Promise<EmailResponse> {
  try {
    if (!emailData.html && !emailData.text) {
      throw new Error("Either html or text content must be provided");
    }

    const emailPayload: EmailPayload = {
      from: emailData.from || DEFAULT_FROM,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text || "",
    };

    if (emailData.html) emailPayload.html = emailData.html;

    if (emailData.text) emailPayload.text = emailData.text;

    const result = await resend.emails.send(emailPayload);

    return {
      success: true,
      data: result.data?.id ?? "", // todo: delete .id
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function sendTemplatedEmail(
  to: string | string[],
  subject: string,
  templateVariables: TemplateVariables = {},
): Promise<EmailResponse> {
  const html = renderBasicTemplate(templateVariables);

  return sendEmail({
    to,
    subject,
    html,
  });
}

// Support ticket notification helper (user + admin). Admin email could be env-based.
export async function sendSupportTicketNotifications(opts: {
  userEmail: string;
  ticket: { ticket_id: string; subject: string; category: string };
}) {
  const adminEmail = process.env.SUPPORT_ADMIN_EMAIL;
  const { userEmail, ticket } = opts;

  await Promise.allSettled([
    sendTemplatedEmail(userEmail, `Ticket Received: ${ticket.subject}`, {
      title: "We have received your support ticket",
      body: `Your ticket (${ticket.ticket_id}) in category ${ticket.category} has been received. Our team will respond shortly.`,
    }),
    adminEmail
      ? sendTemplatedEmail(
          adminEmail,
          `New Support Ticket: ${ticket.subject}`,
          {
            title: "New Support Ticket Submitted",
            body: `Ticket ID: ${ticket.ticket_id}\nCategory: ${ticket.category}\nSubject: ${ticket.subject}`,
          },
        )
      : Promise.resolve(),
  ]);
}
