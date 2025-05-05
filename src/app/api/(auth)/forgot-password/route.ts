import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase-server";

// Define schema for validating email input
const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ForgotPasswordSchema.safeParse(body);

  // If the email is invalid, return 400
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  try {
    // Create a Supabase server client
    const supabase = createServerClient();

    // Send password reset email with redirect URL
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      // Return any Supabase-related error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return success response
    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 },
    );
  } catch (error) {
    // Catch unexpected errors
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
