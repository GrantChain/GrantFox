import { MilestoneStatus } from "./enums";

export class Milestone {
  constructor(
    public readonly milestone_id: string,
    public description: string,
    public status: MilestoneStatus,
    public escrow_id: string,
    public grant_id: string,
    public amount: number,
    public is_disputed: boolean,
    public is_released: boolean,
    public is_resolved: boolean,
    public is_approved: boolean,
    public readonly created_at: Date,
    public updated_at: Date,
    public evidence?: string,
    public approver_funds?: number,
    public receiver_funds?: number,
    public dispute_started_by?: string,
  ) {}
}
