import type {
  ApiError,
  ErrorResponse,
  WalletError,
} from "@/@types/error.entity";
import axios, { type AxiosError } from "axios";
import { ApiErrorTypes } from "./enums/error.enum";

export const handleError = (error: AxiosError | WalletError): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    const code = axiosError.response?.status || 500;
    const message = axiosError.response?.data?.message || error.message;
    return {
      message,
      code,
      type: mapStatusCodeToErrorType(code),
    };
  }

  if (error.code === -4) {
    return {
      message: "Wallet was closed before transaction was sent",
      code: -4,
      type: ApiErrorTypes.WALLET_ERROR,
    };
  }

  return {
    message: error.message,
    code: 500,
    type: ApiErrorTypes.UNKNOWN_ERROR,
  };
};

const mapStatusCodeToErrorType = (code: number): ApiErrorTypes => {
  switch (code) {
    case 404:
      return ApiErrorTypes.NOT_FOUND;
    case 401:
      return ApiErrorTypes.UNAUTHORIZED;
    default:
      return ApiErrorTypes.UNKNOWN_ERROR;
  }
};

export function extractErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response: { data: { error: string } } }).response?.data
      ?.error === "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data
      .error;
  }
  return "An unexpected error occurred";
}
