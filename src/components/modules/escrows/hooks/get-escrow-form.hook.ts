import type { WalletError } from "@/@types/errors.entity";
import { handleError } from "@/errors/utils/handle-errors";
import { useEscrowContext } from "@/providers/escrow.provider";
import { useTabsContext } from "@/providers/tabs.provider";
import { useWalletContext } from "@/providers/wallet.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetEscrow } from "@trustless-work/escrow/hooks";
import type {
  GetEscrowParams,
  MultiReleaseEscrow,
  SingleReleaseEscrow,
} from "@trustless-work/escrow/types";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { formSchema } from "../schemas/get-escrow-form.schema";

export const useGetEscrowForm = () => {
  const { walletAddress } = useWalletContext();
  const { escrow, setEscrow } = useEscrowContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<
    SingleReleaseEscrow | MultiReleaseEscrow | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const { getEscrow, escrow: currentEscrow } = useGetEscrow();
  const { activeEscrowType } = useTabsContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractId: escrow?.contractId || "",
      signer: walletAddress || "Connect your wallet to get your address",
    },
  });

  const onSubmit = async (payload: GetEscrowParams) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the getEscrow function
       * - The result will be an Escrow
       */
      await getEscrow({ payload, type: activeEscrowType });

      if (!currentEscrow) {
        throw new Error("Escrow not found");
      }

      /**
       * @Responses:
       * escrow !== null
       * - Escrow received successfully
       * - Set the escrow in the context
       * - Show a success toast
       *
       * escrow === null
       * - Show an error toast
       */
      if (currentEscrow) {
        setEscrow({ ...currentEscrow, contractId: payload.contractId });
        setResponse(currentEscrow);
        toast.success("Escrow Received");
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

  return { form, loading, response, error, onSubmit };
};
