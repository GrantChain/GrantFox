import { Status } from "../http.entity";
import { EscrowPayload } from "./escrow-payload.entity";

// Escrow's Response
export type EscrowRequestResponse = {
  status: Status;
  unsignedTransaction?: string;
};

export type InitializeEscrowResponse = {
  contract_id: string;
  escrow: EscrowPayload;
  message: string;
  status: Status;
};

export type FundEscrowResponse = {
  message: string;
  status: Status;
};

export type SendTransactionResponse = InitializeEscrowResponse &
  FundEscrowResponse;
