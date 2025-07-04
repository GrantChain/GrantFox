import { trustlineSelected } from "@/components/constants/trustline.constant";
import type { PayoutFormValues } from "@/components/modules/payouts/schemas/payout.schema";
import type { InitializeMultiReleaseEscrowPayload } from "@trustless-work/escrow/types";
import type { User } from "@/generated/prisma";
import { authService } from "@/components/modules/auth/services/auth.service";

interface BuildEscrowPayloadParams {
  data: PayoutFormValues;
  address: string;
  payoutProvider?: User;
  grantee?: User;
}

interface BuildEscrowPayloadWithUserIdsParams {
  data: PayoutFormValues;
  address: string;
  payoutProviderId?: string;
  granteeId?: string;
}

export const buildEscrowPayload = async ({
  data,
  address,
  payoutProvider,
  grantee,
}: BuildEscrowPayloadParams): Promise<InitializeMultiReleaseEscrowPayload> => {
  const trustline = trustlineSelected(data.currency);

  // Get wallet addresses for roles
  const approverAddress = payoutProvider?.wallet_address || address;
  const serviceProviderAddress = grantee?.wallet_address || address;
  const receiverAddress = grantee?.wallet_address || address;

  return {
    title: data.title,
    description: data.description,
    milestones: data.milestones.map((milestone) => ({
      description: milestone.description,
      amount: milestone.amount || 0,
    })),
    signer: address,
    engagementId: "data.engagementId", // org name - grantee name, ex: stellar-customer
    roles: {
      approver: approverAddress,
      serviceProvider: serviceProviderAddress,
      receiver: receiverAddress,
      platformAddress: process.env.NEXT_PUBLIC_PLATFORM_RELEASE_RESOLVER || "",
      releaseSigner: process.env.NEXT_PUBLIC_PLATFORM_RELEASE_RESOLVER || "",
      disputeResolver: process.env.NEXT_PUBLIC_PLATFORM_RELEASE_RESOLVER || "",
    },
    platformFee: Number(process.env.NEXT_PUBLIC_PLATFORM_FEE) || 0,
    trustline: {
      address: trustline?.address || "",
      decimals: trustline?.decimals || 0,
    },
  };
};

/**
 * Build escrow payload by fetching users dynamically from their IDs
 */
export const buildEscrowPayloadWithUserIds = async ({
  data,
  address,
  payoutProviderId,
  granteeId,
}: BuildEscrowPayloadWithUserIdsParams): Promise<InitializeMultiReleaseEscrowPayload> => {
  const trustline = trustlineSelected(data.currency);

  // Fetch users by their IDs if provided
  let payoutProvider: User | undefined;
  let grantee: User | undefined;

  if (payoutProviderId) {
    const payoutProviderResult = await authService.getUserById(payoutProviderId, "PAYOUT_PROVIDER");
    if (payoutProviderResult.exists) {
      payoutProvider = payoutProviderResult.user;
    }
  }

  if (granteeId) {
    const granteeResult = await authService.getUserById(granteeId, "GRANTEE");
    if (granteeResult.exists) {
      grantee = granteeResult.user;
    }
  }

  // Get wallet addresses for roles
  const approverAddress = payoutProvider?.wallet_address || address;
  const serviceProviderAddress = grantee?.wallet_address || address;
  const receiverAddress = grantee?.wallet_address || address;

  return {
    title: data.title,
    description: data.description,
    milestones: data.milestones.map((milestone) => ({
      description: milestone.description,
      amount: milestone.amount || 0,
    })),
    signer: address,
    engagementId: "data.engagementId", // org name - grantee name, ex: stellar-customer
    roles: {
      approver: approverAddress,
      serviceProvider: serviceProviderAddress,
      receiver: receiverAddress,
      platformAddress: process.env.NEXT_PUBLIC_PLATFORM_RELEASE_RESOLVER || "",
      releaseSigner: process.env.NEXT_PUBLIC_PLATFORM_RELEASE_RESOLVER || "",
      disputeResolver: process.env.NEXT_PUBLIC_PLATFORM_RELEASE_RESOLVER || "",
    },
    platformFee: Number(process.env.NEXT_PUBLIC_PLATFORM_FEE) || 0,
    trustline: {
      address: trustline?.address || "",
      decimals: trustline?.decimals || 0,
    },
  };
};
