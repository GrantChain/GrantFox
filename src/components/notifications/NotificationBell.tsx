import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  type Notification,
  mockNotifications,
} from "@/interfaces/Notification";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const typeIconMap: Record<Notification["type"], JSX.Element> = {
  info: (
    <Info
      className="h-6 w-6 text-blue-500 dark:text-blue-400"
      aria-label="Info"
    />
  ),
  success: (
    <CheckCircle2
      className="h-6 w-6 text-green-500 dark:text-green-400"
      aria-label="Success"
    />
  ),
  warning: (
    <AlertTriangle
      className="h-6 w-6 text-yellow-500 dark:text-yellow-400"
      aria-label="Warning"
    />
  ),
  error: (
    <XCircle
      className="h-6 w-6 text-red-500 dark:text-red-400"
      aria-label="Error"
    />
  ),
};

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [cleared, setCleared] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [isAnimatingClear, setIsAnimatingClear] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // TODO: Implement clear notifications logic in backend
  const handleClearAll = () => {
    setIsAnimatingClear(true);
    setCleared(true);
    setTimeout(() => {
      setNotifications([]);
      setIsAnimatingClear(false);
      setTimeout(() => {
        setNotifications(mockNotifications);
        setCleared(false);
      }, 10000);
    }, 400);
  };

  // TODO: Implement mark as read logic in backend
  const handleSelectNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id && !n.read ? { ...n, read: true } : n)),
    );
    setSelectedNotificationId(id);
  };

  const selectedNotification = notifications.find(
    (n) => n.id === selectedNotificationId,
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-0.5 -right-0.5 px-1 py-0 text-xs bg-primary text-primary-foreground rounded-full border border-background"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-w-xs p-0 shadow-lg rounded-xl overflow-hidden border bg-card text-card-foreground"
      >
        <div className="bg-card">
          <div className="px-4 py-3 font-semibold text-base border-b border-border">
            Notifications
          </div>
          {selectedNotification ? (
            <div className="flex flex-col items-start gap-4 px-4 py-6 min-h-[120px]">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 h-auto p-0"
                onClick={() => setSelectedNotificationId(null)}
                aria-label="Back to notifications list"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <div className="flex items-center gap-3">
                {typeIconMap[selectedNotification.type]}
                <span className="text-lg font-bold">
                  {selectedNotification.message}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {selectedNotification.time}
              </div>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-border">
              <AnimatePresence initial={false}>
                {notifications.length === 0 ? (
                  <motion.li
                    className="px-4 py-6 text-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    No notifications
                  </motion.li>
                ) : (
                  notifications.map((notification) => (
                    <motion.li
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                        notification.read
                          ? "bg-muted/50 font-normal"
                          : "font-bold",
                      )}
                      tabIndex={0}
                      aria-label={notification.message}
                      onClick={() => handleSelectNotification(notification.id)}
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{
                        opacity: 0,
                        y: -20,
                        height: 0,
                        margin: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        border: 0,
                      }}
                      transition={{ duration: 0.35 }}
                    >
                      <span className="mt-0.5">
                        {typeIconMap[notification.type]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={cn("truncate mb-1")}>
                          {notification.message}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {notification.time}
                        </div>
                      </div>
                    </motion.li>
                  ))
                )}
              </AnimatePresence>
            </ul>
          )}
          <Separator className="my-0" />
          <div className="px-4 py-3">
            <Button
              variant="outline"
              className="w-full"
              aria-label="Clear all"
              onClick={handleClearAll}
              disabled={
                cleared || notifications.length === 0 || isAnimatingClear
              }
            >
              {cleared ? "Come back in 10s!" : "Clear all"}
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
