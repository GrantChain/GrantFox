import {
  type ChatContext,
  type ChatResponse,
  elizaChatbot,
} from "@/lib/eliza-chatbot";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 },
      );
    }

    // Get user from Supabase auth
    const authHeader = request.headers.get("authorization");
    let user = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser(token);

      if (!error && authUser) {
        // Get full user data from database
        const dbUser = await prisma.user.findUnique({
          where: { user_id: authUser.id },
          include: {
            grantee: true,
            payout_provider: true,
          },
        });

        if (dbUser) {
          user = dbUser;
        }
      }
    }

    // Set context for the chatbot
    if (user) {
      const context: ChatContext = {
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username ?? undefined,
          ...(user.role === "GRANTEE" ||
          user.role === "PAYOUT_PROVIDER" ||
          user.role === "ADMIN"
            ? { role: user.role as "GRANTEE" | "PAYOUT_PROVIDER" | "ADMIN" }
            : {}),
          wallet_address: user.wallet_address ?? undefined,
          bio: user.bio ?? undefined,
          location: user.location ?? undefined,
          profile_url: user.profile_url ?? undefined,
          cover_url: user.cover_url ?? undefined,
          is_active: user.is_active,
          created_at: user.created_at,
          updated_at: user.updated_at,
        } as import("@/lib/eliza-chatbot").UserContext,
        grantee: user.grantee
          ? {
              user_id: user.grantee.user_id,
              name: user.grantee.name ?? undefined,
              position_title: user.grantee.position_title ?? undefined,
              social_media: user.grantee.social_media as Record<string, string>,
            }
          : undefined,
        payoutProvider: user.payout_provider
          ? {
              user_id: user.payout_provider.user_id,
              organization_name:
                user.payout_provider.organization_name ?? undefined,
              network_type: user.payout_provider.network_type ?? undefined,
              email: user.payout_provider.email ?? undefined,
            }
          : undefined,
        currentSession: sessionId || "default",
      };

      elizaChatbot.setContext(context);
    }

    // Get response from chatbot
    const response: ChatResponse = elizaChatbot.getResponse(message);

    return NextResponse.json({
      success: true,
      response,
      sessionId: sessionId || "default",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          "Sorry, I'm having trouble processing your request. Please try again.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "greeting") {
      const greeting = elizaChatbot.getGreeting();
      return NextResponse.json({
        success: true,
        greeting,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "history") {
      const history = elizaChatbot.getConversationHistory();
      return NextResponse.json({
        success: true,
        history,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "clear") {
      elizaChatbot.clearHistory();
      return NextResponse.json({
        success: true,
        message: "Conversation history cleared",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Invalid action parameter" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
