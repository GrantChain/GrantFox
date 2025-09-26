import { UserPayloadSchema } from "@/components/modules/auth/schema/register-user.schema";
import { handleDatabaseError, prisma } from "@/lib/prisma";
import { logger } from "@/lib/services/logger";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = UserPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { user_id, email } = parsed.data;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { user_id },
    });

    if (existingUser) {
      logger.info("OAuth verify: user already exists", {
        action: "AUTH_VERIFY_OAUTH_USER",
        userId: user_id,
        entityType: "USER",
      });
      return NextResponse.json({
        success: true,
        user: existingUser,
        message: "User already exists",
      });
    }

    // Generar username desde email
    const username = email.split("@")[0];

    // Crear el usuario con manejo de errores mejorado
    try {
      const user = await prisma.user.create({
        data: {
          user_id,
          email,
          username,
          wallet_address: null,
          bio: "",
          role: "EMPTY",
          profile_url: "",
          cover_url: "",
          location: "",
        },
      });

      logger.info("OAuth user created successfully", {
        action: "AUTH_VERIFY_OAUTH_USER",
        userId: user_id,
        entityType: "USER",
        metadata: { email_masked: email.replace(/^(.).+(@.+)$/, "$1***$2") },
      });

      return NextResponse.json({
        success: true,
        user,
        message: "OAuth user created successfully",
      });
    } catch (createError: unknown) {
      // Si hay un error de duplicado, intentar obtener el usuario existente
      const errorMessage =
        createError instanceof Error
          ? createError.message
          : String(createError);
      const errorCode = (createError as { code?: string })?.code;

      if (errorCode === "P2002" || errorMessage.includes("Unique constraint")) {
        const user = await prisma.user.findUnique({
          where: { user_id },
        });

        if (user) {
          logger.info("OAuth verify: user already exists (recovered)", {
            action: "AUTH_VERIFY_OAUTH_USER",
            userId: user_id,
            entityType: "USER",
          });
          return NextResponse.json({
            success: true,
            user,
            message: "User already exists (recovered from conflict)",
          });
        }
      }

      // Si no es un error de duplicado, re-lanzar el error
      throw createError;
    }
  } catch (error) {
    logger.error("Error in verify-oauth-user", error, {
      action: "AUTH_VERIFY_OAUTH_USER",
      entityType: "USER",
    });
    const { message, status } = handleDatabaseError(error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status },
    );
  }
}
