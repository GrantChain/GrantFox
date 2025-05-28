export class MilestoneSubmission {
  constructor(
    public readonly submission_id: string,
    public milestone_id: string,
    public submitted_by: string,
    public content: string,
    public review_notes: string,
    public readonly created_at: Date,
    public updated_at: Date,
  ) {}
}
