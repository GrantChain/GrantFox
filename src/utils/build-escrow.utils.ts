import { trustlineSelected } from "@/components/constants/trustline.constant";
import type { PayoutFormValues } from "@/components/modules/payouts/schemas/payout.schema";
import type { InitializeMultiReleaseEscrowPayload } from "@trustless-work/escrow/types";

export const buildEscrowPayload = (
  data: PayoutFormValues,
  address: string,
): InitializeMultiReleaseEscrowPayload => {
  const trustline = trustlineSelected(data.currency);

  return {
    title: data.title,
    description: data.description,
    milestones: data.milestones.map((milestone) => ({
      description: milestone.description,
      amount: milestone.amount.toString() || "0",
    })),
    signer: address,
    engagementId: "data.engagementId", // org name - grantee name, ex: stellar-customer
    roles: {
      approver: address, // todo: get from payout provider
      serviceProvider: address, // todo: get from grantee
      receiver: address, // todo: get from grantee
      platformAddress: process.env.NEXT_PUBLIC_PLATFORM_RELEASE_RESOLVER || "",
      releaseSigner: process.env.NEXT_PUBLIC_PLATFORM_RELEASE_RESOLVER || "",
      disputeResolver: process.env.NEXT_PUBLIC_PLATFORM_RELEASE_RESOLVER || "",
    },
    platformFee: process.env.NEXT_PUBLIC_PLATFORM_FEE || "",
    trustline: {
      address: trustline?.address || "",
      decimals: trustline?.decimals || 0,
    },
  };
};
