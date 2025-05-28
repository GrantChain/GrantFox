import { LogType, LogStatus } from "./enums";

export class SystemLog {
  constructor(
    public readonly log_id: string,
    public log_type: LogType,
    public action: string,
    public description: string,
    public status: LogStatus,
    public readonly created_at: Date,
    public user_id?: string,
    public entity_type?: string,
    public entity_id?: string,
    public ip_address?: string,
    public browser?: string,
    public os?: string,
  ) {}
}
