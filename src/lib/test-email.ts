import { sendTemplatedEmail } from "./email-service";

export async function sendTestEmail(recipientEmail: string) {
  console.log("🧪 Testing email functionality...");

  const result = await sendTemplatedEmail(
    recipientEmail,
    "Test Email from Grant Fox",
    {
      userName: "Developer",
      title: "Email Configuration Test",
      message:
        "Congratulations! Your Resend email integration is working correctly. This is a test email to verify the setup.",
      ctaText: "Visit Grant Fox",
      ctaUrl: "https://github.com/GrantChain/GrantFox",
    },
  );

  if (result.success) {
    console.log("✅ Test email sent successfully!");
    console.log("Email ID:", result.data?.id);
  } else {
    console.log("❌ Test email failed:", result.error);
  }

  return result;
}
