import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type LogParams = {
  action: string;
  description: string;
  userId?: string | null;
  entityType?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type LogResponse =
  | {
      success: true;
      logId: string;
    }
  | {
      success: false;
      error: string;
    };

// Internal: actually writes the log entry and returns a structured response
export async function writeSystemLog(params: LogParams): Promise<LogResponse> {
  try {
    const metadataValue =
      params.metadata === null
        ? Prisma.JsonNull
        : (params.metadata as unknown as Prisma.InputJsonValue | undefined);

    const result = await prisma.systemLog.create({
      data: {
        user_id: params.userId ?? null,
        action: params.action,
        entity_type: params.entityType ?? null,
        description: params.description,
        metadata: metadataValue,
      },
      select: { log_id: true },
    });

    return { success: true, logId: result.log_id };
  } catch (err) {
    // Never throw: logging must never break app flow
    const message =
      err instanceof Error ? err.message : "Unknown logging error";
    // Also mirror to console to aid local debugging
    // eslint-disable-next-line no-console
    console.error("[logger] Failed to write system log:", err);
    return { success: false, error: message };
  }
}

// Fire-and-forget logger. Use this in request handlers so logging is non-blocking
export function logSystemEvent(params: LogParams): void {
  // Do not await. Ensure unhandled rejections are swallowed
  void writeSystemLog(params);
}

// Convenience helpers for common severities
export const logger = {
  info: (
    description: string,
    ctx?: Omit<LogParams, "description" | "action"> & { action?: string },
  ) => {
    const action = ctx?.action ?? "INFO";
    // Console output for developer visibility (optional)
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${action}: ${description}`, ctx?.metadata ?? "");
    logSystemEvent({
      action,
      description,
      userId: ctx?.userId ?? null,
      entityType: ctx?.entityType ?? null,
      metadata: ctx?.metadata ?? null,
    });
  },
  error: (
    description: string,
    error?: unknown,
    ctx?: Omit<LogParams, "description" | "action"> & { action?: string },
  ) => {
    const action = ctx?.action ?? "ERROR";
    const metadata = {
      ...(ctx?.metadata ?? {}),
      error: normalizeError(error),
    } as Record<string, unknown>;
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${action}: ${description}`, metadata);
    logSystemEvent({
      action,
      description,
      userId: ctx?.userId ?? null,
      entityType: ctx?.entityType ?? "ERROR",
      metadata,
    });
  },
};

function normalizeError(err: unknown): Record<string, unknown> {
  if (!err) return {};
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  if (typeof err === "string") return { message: err };
  try {
    return JSON.parse(JSON.stringify(err));
  } catch {
    return { value: String(err) };
  }
}
