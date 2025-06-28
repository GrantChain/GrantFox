import type { EmailData, EmailResponse } from "../@types/email";
import { resend } from "./resend";

const DEFAULT_FROM = "Grant Fox <noreply@resend.dev>";

export async function sendEmail(emailData: EmailData): Promise<EmailResponse> {
  try {
    if (!emailData.html && !emailData.text) {
      throw new Error("Either html or text content must be provided");
    }

    console.log("[EMAIL] Sending email to:", emailData.to);

    const emailPayload: any = {
      from: emailData.from || DEFAULT_FROM,
      to: emailData.to,
      subject: emailData.subject,
    };

    if (emailData.html) emailPayload.html = emailData.html;

    if (emailData.text) emailPayload.text = emailData.text;

    const result = await resend.emails.send(emailPayload);

    console.log("[EMAIL] Email sent successfully:", result.data?.id);

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("[EMAIL] Failed to send email:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
