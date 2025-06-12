import type { WalletError } from "@/@types/errors.entity";
import { handleError } from "@/errors/utils/handle-errors";
import { useTabsContext } from "@/providers/tabs.provider";
import { useWalletContext } from "@/providers/wallet.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetMultipleEscrowBalances } from "@trustless-work/escrow/hooks";
import type {
  EscrowRequestResponse,
  GetBalanceParams,
} from "@trustless-work/escrow/types";
import type { GetEscrowBalancesResponse } from "@trustless-work/escrow/types";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { formSchema } from "../schemas/get-multiple-escrow-balances-form.schema";

type FormData = z.infer<typeof formSchema>;

export const useGetMultipleEscrowBalancesForm = () => {
  const { walletAddress } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<
    EscrowRequestResponse | GetEscrowBalancesResponse[] | null
  >(null);
  const { getMultipleBalances, balances } = useGetMultipleEscrowBalances();
  const { activeEscrowType } = useTabsContext();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signer: walletAddress || "",
      addresses: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const onSubmit = async (payload: FormData) => {
    setLoading(true);
    setResponse(null);

    // Transform the payload to the correct format
    const transformedData: GetBalanceParams = {
      addresses: payload.addresses.map((a) => a.value),
      signer: payload.signer,
    };

    try {
      /**
       * API call by using the trustless work hooks
       * @Note:
       * - We need to pass the payload to the getMultipleBalances function
       * - The result will be multiple escrow balances
       */
      await getMultipleBalances({
        payload: transformedData,
        type: activeEscrowType,
      });

      if (!balances) {
        throw new Error("Escrow not found");
      }

      /**
       * @Responses:
       * balances !== null
       * - Escrow balances received successfully
       * - Set the response
       * - Show a success toast
       *
       * balances === null
       * - Show an error toast
       */
      if (balances) {
        setResponse(balances);
        toast.success("Escrow Balances Received");
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

  return { form, loading, response, fields, append, remove, onSubmit };
};
