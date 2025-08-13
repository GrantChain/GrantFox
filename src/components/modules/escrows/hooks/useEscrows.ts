import type { WalletError } from "@/@types/error.entity";
import type { DeployResponse } from "@/@types/responses.entity";
import { useGlobalWalletStore } from "@/components/wallet/store/store";
import { handleError } from "@/errors/mapping.utils";
import { signTransaction } from "@/lib/wallet-kit";
import {
  useApproveMilestone,
  useChangeMilestoneStatus,
  useFundEscrow,
  useGetEscrowFromIndexerByContractIds,
  useInitializeEscrow,
  useReleaseFunds,
  useResolveDispute,
  useSendTransaction,
  useStartDispute,
} from "@trustless-work/escrow/hooks";
import type {
  ApproveMilestonePayload,
  ChangeMilestoneStatusPayload,
  FundEscrowPayload,
  GetEscrowsFromIndexerResponse,
  InitializeMultiReleaseEscrowPayload,
  InitializeMultiReleaseEscrowResponse,
  MultiReleaseReleaseFundsPayload,
  MultiReleaseResolveDisputePayload,
  MultiReleaseStartDisputePayload,
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
  const { approveMilestone } = useApproveMilestone();
  const { changeMilestoneStatus } = useChangeMilestoneStatus();
  const { startDispute } = useStartDispute();
  const { resolveDispute } = useResolveDispute();
  const { releaseFunds } = useReleaseFunds();
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

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

  const handleApproveMilestone = async (
    payload: ApproveMilestonePayload,
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const finalPayload: ApproveMilestonePayload = {
        ...payload,
        approver: address || "",
        contractId: payload.contractId,
        newFlag: true,
        milestoneIndex: payload.milestoneIndex,
      };

      const { unsignedTransaction } = await approveMilestone(
        finalPayload,
        "multi-release",
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from approveMilestone response.",
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

  const handleCompleteMilestone = async (
    payload: ChangeMilestoneStatusPayload,
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const finalPayload: ChangeMilestoneStatusPayload = {
        ...payload,
        newStatus: "COMPLETED",
        serviceProvider: address || "",
        contractId: payload.contractId,
        milestoneIndex: payload.milestoneIndex,
        newEvidence: payload.newEvidence,
      };

      const { unsignedTransaction } = await changeMilestoneStatus(
        finalPayload,
        "multi-release",
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from changeMilestoneStatus response.",
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

  const handleRejectMilestone = async (
    payload: MultiReleaseStartDisputePayload,
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const finalPayload: MultiReleaseStartDisputePayload = {
        ...payload,
        contractId: payload.contractId,
        milestoneIndex: payload.milestoneIndex,
        signer: address || "",
      };

      const { unsignedTransaction } = await startDispute(
        finalPayload,
        "multi-release",
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from startDispute response.",
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

  const handleResolveMilestone = async (
    payload: MultiReleaseResolveDisputePayload,
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const finalPayload: MultiReleaseResolveDisputePayload = {
        ...payload,
        approverFunds: payload.approverFunds,
        receiverFunds: payload.receiverFunds,
        disputeResolver: address || "",
        contractId: payload.contractId,
        milestoneIndex: payload.milestoneIndex,
      };

      const { unsignedTransaction } = await resolveDispute(
        finalPayload,
        "multi-release",
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from resolveDispute response.",
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

  const handleReleaseMilestone = async (
    payload: MultiReleaseReleaseFundsPayload,
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const finalPayload: MultiReleaseReleaseFundsPayload = {
        ...payload,
        contractId: payload.contractId,
        milestoneIndex: payload.milestoneIndex,
        releaseSigner: address || "",
      };

      const { unsignedTransaction } = await releaseFunds(
        finalPayload,
        "multi-release",
      );

      if (!unsignedTransaction) {
        throw new Error(
          "Unsigned transaction is missing from releaseFunds response.",
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

  const handleGetEscrowByContractIds = async (
    contractIds: string[],
  ): Promise<GetEscrowsFromIndexerResponse> => {
    const escrowData = await getEscrowByContractIds({
      contractIds: contractIds,
      signer: address || "",
      validateOnChain: true,
    });

    return escrowData;
  };

  return {
    loading,
    handleDeployEscrow,
    handleFundEscrow,
    handleApproveMilestone,
    handleCompleteMilestone,
    handleRejectMilestone,
    handleResolveMilestone,
    handleReleaseMilestone,
    handleGetEscrowByContractIds,
  };
};
