import type { WalletError } from "@/@types/errors.entity";
import { handleError } from "@/errors/utils/handle-errors";
import { useEscrowContext } from "@/providers/escrow.provider";
import { useTabsContext } from "@/providers/tabs.provider";
import { useWalletContext } from "@/providers/wallet.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useChangeMilestoneStatus,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import type {
  ChangeMilestoneStatusPayload,
  EscrowRequestResponse,
  MultiReleaseEscrow,
  MultiReleaseMilestone,
  SingleReleaseEscrow,
  SingleReleaseMilestone,
} from "@trustless-work/escrow/types";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { signTransaction } from "../../auth/helpers/stellar-wallet-kit.helper";
import { formSchema } from "../schemas/change-milestone-status-form.schema";

export const useChangeMilestoneStatusForm = () => {
  const { escrow } = useEscrowContext();
  const { setEscrow } = useEscrowContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EscrowRequestResponse | null>(null);
  const { walletAddress } = useWalletContext();
  const { changeMilestoneStatus } = useChangeMilestoneStatus();
  const { sendTransaction } = useSendTransaction();
  const { activeEscrowType } = useTabsContext();

  const milestones = escrow?.milestones || [
    { description: "Initial setup", status: "pending" },
    { description: "Development phase", status: "pending" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractId: escrow?.contractId || "",
      milestoneIndex: "",
      newStatus: "",
      newEvidence: "",
      serviceProvider: escrow?.roles.serviceProvider || "",
    },
  });

  const onSubmit = async (payload: ChangeMilestoneStatusPayload) => {
    setLoading(true);
    setResponse(null);

    try {
      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the changeMilestoneStatus function
       * - The result will be an unsigned transaction
       */
      const { unsignedTransaction } = await changeMilestoneStatus({
        payload,
        type: activeEscrowType,
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from changeMilestoneStatus response.",
        );
      }

      /**
       * @Note:
       * - We need to sign the transaction using your private key
       * - The result will be a signed transaction
       */
      const signedXdr = await signTransaction({
        unsignedTransaction,
        address: walletAddress || "",
      });

      if (!signedXdr) {
        throw new Error("Signed transaction is missing.");
      }

      /**
       * @Note:
       * - We need to send the signed transaction to the API
       * - The data will be an SendTransactionResponse
       */
      const data = await sendTransaction(signedXdr);

      /**
       * @Responses:
       * data.status === "SUCCESS"
       * - Escrow updated successfully
       * - Set the escrow in the context
       * - Show a success toast
       *
       * data.status == "ERROR"
       * - Show an error toast
       */
      if (data.status === "SUCCESS" && escrow) {
        const escrowUpdated = {
          ...escrow,
          milestones: escrow.milestones.map((milestone, index) =>
            index === Number(payload.milestoneIndex)
              ? activeEscrowType === "single-release"
                ? {
                    ...(milestone as SingleReleaseMilestone),
                    status: payload.newStatus,
                    evidence: payload.newEvidence || "",
                  }
                : {
                    ...(milestone as MultiReleaseMilestone),
                    status: payload.newStatus,
                    evidence: payload.newEvidence || "",
                  }
              : milestone,
          ),
        } as SingleReleaseEscrow | MultiReleaseEscrow;

        setEscrow(escrowUpdated);

        toast.success(
          `Milestone index - ${payload.milestoneIndex} updated to ${payload.newStatus}`,
        );
        setResponse(data);
        form.reset();
      }
    } catch (error: unknown) {
      const mappedError = handleError(error as AxiosError | WalletError);
      console.error("Error:", mappedError.message);

      toast.error(
        mappedError ? mappedError.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, milestones, loading, response, onSubmit };
};
