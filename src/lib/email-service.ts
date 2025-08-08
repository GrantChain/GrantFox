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
