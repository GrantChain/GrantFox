export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "Your payout has been approved!",
    time: "2m ago",
    read: false,
    type: "success",
  },
  {
    id: "2",
    message: "New milestone submitted for review.",
    time: "10m ago",
    read: false,
    type: "info",
  },
  {
    id: "3",
    message: "Profile updated successfully.",
    time: "1h ago",
    read: true,
    type: "success",
  },
  {
    id: "4",
    message: "Warning: Your payout is pending action.",
    time: "3h ago",
    read: true,
    type: "warning",
  },
  {
    id: "5",
    message: "Error processing your last transaction.",
    time: "1d ago",
    read: false,
    type: "error",
  },
];
