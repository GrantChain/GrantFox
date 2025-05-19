import {
  EscrowEndpoint,
  TCreateEscrowRequest,
} from "@/@types/escrow/escrow-endpoint.entity";
import {
  EscrowRequestResponse,
  SendTransactionResponse,
} from "@/@types/escrow/escrow-response.entity";
import { useGlobalWalletStore } from "@/components/wallet/store/store";
import { signTransaction } from "@stellar/freighter-api";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import { HttpMethod } from "@/@types/http.entity";
import { httpTW } from "./axios";

type AxiosRequestConfig = {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: any;
};

export const getEndpoint = (action: EscrowEndpoint): string => {
  const endpoints: Record<EscrowEndpoint, string> = {
    initiate: "/deployer/invoke-deployer-contract",
    fund: "/escrow/fund-escrow",
    dispute: "/escrow/change-dispute-flag",
    resolve: "/escrow/resolving-disputes",
    release: "/escrow/distribute-escrow-earnings",
    completeMilestone: "/escrow/change-milestone-status",
    approveMilestone: "/escrow/change-milestone-flag",
    edit: "/escrow/update-escrow-by-contract-id",
  };
  return endpoints[action];
};

export async function createEscrowRequest<T extends EscrowEndpoint>(
  props: TCreateEscrowRequest<T>,
): Promise<EscrowRequestResponse> {
  let response: EscrowRequestResponse | null = null;
  let error: string | null = null;

  const escrowEndpoint = getEndpoint(props.action);

  const config: AxiosRequestConfig = {
    method: props.method,
    url: escrowEndpoint,
    data: props.method !== "GET" ? props.data : undefined,
    params: props.method === "GET" ? props.params : undefined,
  };

  try {
    const axiosResponse = await httpTW.request<EscrowRequestResponse>(config);
    response = axiosResponse.data;
  } catch (err) {
    error = (err as Error).message;
  }

  return {
    unsignedTransaction: response?.unsignedTransaction,
    status: error ? "ERROR" : "SUCCESS",
  };
}

export async function sendTransaction(
  signedXdr: string,
): Promise<SendTransactionResponse> {
  try {
    const response = await httpTW.post<SendTransactionResponse>(
      "/helper/send-transaction",
      {
        signedXdr,
        returnValueIsRequired: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
}

export async function signTx(unsignedTransaction: string): Promise<string> {
  try {
    const address = useGlobalWalletStore((state) => state.address);

    const { signedTxXdr } = await signTransaction(unsignedTransaction, {
      address,
      networkPassphrase: WalletNetwork.TESTNET,
    });

    return signedTxXdr;
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw error;
  }
}
