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

      const { unsignedTransaction } = await deployEscrow(
        finalPayload,
        "multi-release",
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from deployEscrow response.",
        );
      }

      const signedXdr = await signTransaction({
        unsignedTransaction,
        address: address || "",
      });

      if (!signedXdr) {
        throw new Error("Signed transaction is missing.");
      }

      await sendTransaction(signedXdr);
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
