import { HttpMethod } from "../http.entity";
import {
  ChangeMilestoneFlagPayload,
  ChangeMilestoneStatusPayload,
  DistributeEscrowEarningsEscrowPayload,
  EditMilestonesPayload,
  EscrowPayload,
  FundEscrowPayload,
  GetBalanceParams,
  ResolveDisputePayload,
  StartDisputePayload,
} from "./escrow-payload.entity";

export type EscrowEndpoint =
  | "initiate"
  | "fund"
  | "dispute"
  | "resolve"
  | "release"
  | "completeMilestone"
  | "approveMilestone"
  | "edit";

export type TCreateEscrowRequest<T extends EscrowEndpoint> = {
  action: T;
  method: HttpMethod;
  data?:
    | EscrowPayload
    | StartDisputePayload
    | EditMilestonesPayload
    | ChangeMilestoneStatusPayload
    | ResolveDisputePayload
    | ChangeMilestoneFlagPayload
    | FundEscrowPayload
    | DistributeEscrowEarningsEscrowPayload;

  params?: GetBalanceParams;
};
