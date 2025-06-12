import type { WalletError } from "@/@types/errors.entity";
import { handleError } from "@/errors/utils/handle-errors";
import { useEscrowContext } from "@/providers/escrow.provider";
import { useWalletContext } from "@/providers/wallet.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useReleaseFunds,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import type {
  EscrowRequestResponse,
  MultiReleaseEscrow,
  MultiReleaseMilestone,
  MultiReleaseReleaseFundsPayload,
} from "@trustless-work/escrow/types";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { signTransaction } from "../../../auth/helpers/stellar-wallet-kit.helper";
import { formSchemaMultiRelease } from "../../schemas/release-funds-form.schema";

export const useReleaseFundsMilestoneForm = () => {
  const { escrow } = useEscrowContext();
  const { setEscrow } = useEscrowContext();
  const { walletAddress } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EscrowRequestResponse | null>(null);
  const { releaseFunds } = useReleaseFunds();
  const { sendTransaction } = useSendTransaction();

  const form = useForm<z.infer<typeof formSchemaMultiRelease>>({
    resolver: zodResolver(formSchemaMultiRelease),
    defaultValues: {
      contractId: escrow?.contractId || "",
      releaseSigner: escrow?.roles.releaseSigner || "",
      signer: walletAddress || "Connect your wallet to get your address",
      milestoneIndex: "0",
    },
  });

  const onSubmit = async (payload: MultiReleaseReleaseFundsPayload) => {
    setLoading(true);
    setResponse(null);

    try {
      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the releaseFunds function
       * - The result will be an unsigned transaction
       */
      const { unsignedTransaction } = await releaseFunds({
        payload,
        type: "multi-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from releaseFunds response.",
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
        const escrowUpdated: MultiReleaseEscrow = {
          ...escrow,
          balance: (
            Number(escrow.balance) -
            Number(
              (escrow.milestones as MultiReleaseMilestone[])[
                Number.parseInt(payload.milestoneIndex)
              ].amount,
            )
          ).toString(),

          milestones: (escrow.milestones as MultiReleaseMilestone[]).map(
            (m, index) =>
              index === Number.parseInt(payload.milestoneIndex)
                ? {
                    ...m,
                    flags: { ...m.flags, released: true },
                  }
                : m,
          ),
        };

        setEscrow(escrowUpdated);

        toast.success(
          `Funds Released in Milestone ${
            (escrow.milestones as MultiReleaseMilestone[])[
              Number.parseInt(payload.milestoneIndex)
            ].description
          }`,
        );
        setResponse(data);
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

  return { form, loading, response, onSubmit };
};
