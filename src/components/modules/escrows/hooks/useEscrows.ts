import type { WalletError } from "@/@types/error.entity";
import type { DeployResponse } from "@/@types/responses.entity";
import { useGlobalWalletStore } from "@/components/wallet/store/store";
import { handleError } from "@/errors/mapping.utils";
import { signTransaction } from "@/lib/wallet-kit";
import {
  useFundEscrow,
  useInitializeEscrow,
  useSendTransaction,
} from "@trustless-work/escrow/hooks";
import type {
  FundEscrowPayload,
  InitializeMultiReleaseEscrowPayload,
  InitializeMultiReleaseEscrowResponse,
} from "@trustless-work/escrow/types";
import type { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export const useEscrows = () => {
  const [loading, setLoading] = useState(false);

  const { address } = useGlobalWalletStore();
  const { sendTransaction } = useSendTransaction();

  const { deployEscrow } = useInitializeEscrow();
  const { fundEscrow } = useFundEscrow();

  const handleDeployEscrow = async (
    payload: InitializeMultiReleaseEscrowPayload,
  ): Promise<DeployResponse> => {
    setLoading(true);

    try {
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

      const response = await sendTransaction(signedXdr);

      if (!response) {
        throw new Error("Escrow is missing.");
      }

      return {
        response: response as InitializeMultiReleaseEscrowResponse,
        success: true,
      };
    } catch (error: unknown) {
      const mappedError = handleError(error as AxiosError | WalletError);
      console.error("Error:", mappedError.message);

      toast.error(
        mappedError ? mappedError.message : "An unknown error occurred",
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleFundEscrow = async (
    payload: Pick<FundEscrowPayload, "amount" | "contractId">,
  ) => {
    setLoading(true);

    try {
      const finalPayload: FundEscrowPayload = {
        ...payload,
        signer: address || "",
      };

      const { unsignedTransaction } = await fundEscrow(
        finalPayload,
        "multi-release",
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from fundEscrow response.",
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
      return true;
    } catch (error: unknown) {
      const mappedError = handleError(error as AxiosError | WalletError);
      console.error("Error:", mappedError.message);

      toast.error(
        mappedError ? mappedError.message : "An unknown error occurred",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleDeployEscrow,
    handleFundEscrow,
  };
};
