import type { ApiErrorTypes } from "@/errors/enums/error.enum";

/**
 * Types for Error response
 */
export type ErrorResponse = {
  message: string;
  code: number;
  type: ApiErrorTypes;
};

/**
 * Types for TW errorss
 */
export type ApiError = Pick<ErrorResponse, "message" | "code">;

/**
 * Types for Wallet errors
 */
export type WalletError = Pick<ErrorResponse, "message" | "code">;

/**
 * Types for Request errors
 */
export type RequestError = ApiError | Error | WalletError;
