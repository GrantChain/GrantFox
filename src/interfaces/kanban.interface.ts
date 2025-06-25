export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Item {
  id: string;
  status: TaskStatus;
  title: string;
  description: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
}
