import type { Grantee, PayoutProvider, User } from "@/generated/prisma";
import {
  type InitializeMultiReleaseEscrowResponse,
  SendTransactionResponse,
} from "@trustless-work/escrow";

export type GetUserServiceResponse =
  | { exists: true; user: User }
  | { exists: false; message: string };

export type RegisterUserServiceResponse =
  | { success: true; user: User }
  | { success: false; message: string };

export type RegisterRoleServiceResponse =
  | { success: true; message: string }
  | { success: false; message: string };

export type CheckRoleServiceResponse =
  | { success: true; role: string }
  | { success: false; message: string };

export type GetUserRoleServiceResponse =
  | { success: true; user: User | Grantee | PayoutProvider }
  | { success: false; message: string };

// Escrows
export type DeployResponse = {
  response?: InitializeMultiReleaseEscrowResponse;
  success: boolean;
};
