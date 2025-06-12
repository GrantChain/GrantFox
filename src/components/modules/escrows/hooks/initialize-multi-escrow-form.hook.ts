import type { WalletError } from "@/@types/error.entity";
import { useGlobalWalletStore } from "@/components/wallet/store/store";
import { handleError } from "@/errors/mapping.utils";
import { signTransaction } from "@/lib/wallet-kit";
import {
  useInitializeEscrow as useInitializeEscrowHook,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import type { InitializeMultiReleaseEscrowPayload } from "@trustless-work/escrow/types";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export const useInitializeMultiEscrowForm = () => {
  const [loading, setLoading] = useState(false);

  const { deployEscrow } = useInitializeEscrowHook();
  const { sendTransaction } = useSendTransaction();

  const { address } = useGlobalWalletStore();

  const onSubmit = async (payload: InitializeMultiReleaseEscrowPayload) => {
    setLoading(true);

    try {
      // This is the final payload that will be sent to the API
      const finalPayload: InitializeMultiReleaseEscrowPayload = {
        ...payload,
        receiverMemo: payload.receiverMemo ?? 0,
        signer: address || "",
      };

      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the deployEscrow function
       * - The result will be an unsigned transaction
       */
      const { unsignedTransaction } = await deployEscrow({
        payload: finalPayload,
        type: "multi-release",
      });

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from deployEscrow response.",
        );
      }

      /**
       * @Note:
       * - We need to sign the transaction using your private key
       * - The result will be a signed transaction
       */
      const signedXdr = await signTransaction({
        unsignedTransaction,
        address: address || "",
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
       * - Escrow created successfully
       * - Set the escrow in the context
       * - Set the active tab to "escrow"
       * - Show a success toast
       *
       * data.status == "ERROR"
       * - Show an error toast
       */
      if (data && data.status === "SUCCESS") {
        toast.success("Escrow Created");
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
  return {
    loading,
    onSubmit,
  };
};
