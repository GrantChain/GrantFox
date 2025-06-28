import { Resend } from "resend";
import { render } from "@react-email/render";
import * as React from "react";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not set in environment variables.");
}

const resend = new Resend(resendApiKey);

export type SendEmailParams = {
  to: string;
  subject: string;
  template?: React.FC<any>;
  templateProps?: Record<string, unknown>;
};

export const sendEmail = async ({ to, subject, template, templateProps = {} }: SendEmailParams) => {
  try {
    if (!template) {
      throw new Error("Template is required");
    }
  
    const html = await render(React.createElement(template, templateProps));
    const response = await resend.emails.send({
      from: "noreply@grantfox.com", // Update this 
      to,
      subject,
      html,
    });
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[Resend] Email sent:", response);
    }
    return response;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[Resend] Email send error:", error);
    }
    // Don't throw to avoid breaking the flow
    return { error };
  }
}; 