import { trustlineSelected } from "@/components/constants/trustline.constant";
import type { PayoutFormValues } from "@/components/modules/payouts/schemas/payout.schema";
import type { User } from "@/generated/prisma";
import type { InitializeMultiReleaseEscrowPayload } from "@trustless-work/escrow/types";

interface BuildEscrowPayloadParams {
  data: PayoutFormValues;
  address: string;
  payoutProvider?: User;
  grantee?: User;
}

export const buildEscrowPayload = async ({
  data,
  address,
  payoutProvider,
  grantee,
}: BuildEscrowPayloadParams): Promise<InitializeMultiReleaseEscrowPayload> => {
  const trustline = trustlineSelected(data.currency);

  // Get wallet addresses for roles
  const approverReleaseSignerAddress =
    payoutProvider?.wallet_address || address;
  const serviceProviderReceiverAddress = grantee?.wallet_address || address;

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
      approver: approverReleaseSignerAddress, // payout provider
      releaseSigner: approverReleaseSignerAddress, // payout provider
      serviceProvider: serviceProviderReceiverAddress, // grantee
      receiver: serviceProviderReceiverAddress, // grantee
      platformAddress: process.env.NEXT_PUBLIC_GRANTFOX_ADDRESS || "", // grantfox
      disputeResolver: process.env.NEXT_PUBLIC_GRANTFOX_ADDRESS || "", // grantfox
    },
    platformFee: Number(process.env.NEXT_PUBLIC_PLATFORM_FEE) || 0,
    trustline: {
      address: trustline?.address || "",
      decimals: trustline?.decimals || 0,
    },
  };
};
