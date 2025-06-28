import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import WelcomeEmail from "@/lib/email/templates/WelcomeEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newUser = body.record;

    const incomingSecret = req.headers.get("x-webhook-secret");
    if (!incomingSecret || incomingSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (!newUser || !newUser.email) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    await sendEmail({
      to: newUser.email,
      subject: "Welcome to GrantFox!",
      template: WelcomeEmail,
      templateProps: {
        userName: newUser.username || newUser.email.split('@')[0],
        ctaUrl: "https://grantfox.com/dashboard",
        ctaText: "Get Started",
        extraText: "We're excited to have you on board!",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
} 