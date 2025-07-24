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
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from "lucide-react";
import { useState } from "react";

const typeIconMap = {
  info: (
    <Info
      className="h-5 w-5 text-blue-500 dark:text-blue-400 bg-background text-foreground"
      aria-label="Info"
    />
  ),
  success: (
    <CheckCircle
      className="h-5 w-5 text-green-500 dark:text-green-400"
      aria-label="Éxito"
    />
  ),
  warning: (
    <AlertTriangle
      className="h-5 w-5 text-yellow-500 dark:text-yellow-400"
      aria-label="Advertencia"
    />
  ),
  error: (
    <XCircle
      className="h-5 w-5 text-red-500 dark:text-red-400"
      aria-label="Error"
    />
  ),
};

const CLEAR_ANIMATION_DELAY = 800;
const RESTORE_NOTIFICATIONS_DELAY = 1200;

export const NotificationButton = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [cleared, setCleared] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSelectNotification = (notification: Notification) => {
    setSelected(notification);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
  };

  const handleBack = () => setSelected(null);

  const handleClearAll = () => {
    setCleared(true);
    setCooldown(true);
    setTimeout(() => {
      setNotifications([]);
      setTimeout(() => {
        setNotifications(mockNotifications);
        setCleared(false);
        setCooldown(false);
      }, RESTORE_NOTIFICATIONS_DELAY);
    }, CLEAR_ANIMATION_DELAY);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir notificaciones"
          className="relative"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-red-500 text-white dark:bg-red-400 dark:text-black rounded-full">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0">
        <AnimatePresence mode="wait">
          {cleared ? (
            <motion.div
              key="cleared"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <span className="text-lg font-semibold">
                ¡Notificaciones limpiadas!
              </span>
              <span className="text-sm text-muted-foreground mt-2">
                Se restaurarán en breve...
              </span>
            </motion.div>
          ) : selected ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {typeIconMap[selected.type]}
                <span className="font-semibold text-base">
                  {selected.title}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {selected.description}
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(selected.date).toLocaleString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={handleBack}
              >
                Volver
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 py-2">
                <span className="font-semibold text-lg">Notificaciones</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={cooldown}
                  className="text-xs text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  Limpiar todo
                </Button>
              </div>
              <Separator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No hay notificaciones.
                </div>
              ) : (
                <ul className="divide-y divide-muted">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${notification.read ? "bg-muted" : "bg-background hover:bg-accent"}`}
                      aria-label={notification.title}
                      onClick={() => handleSelectNotification(notification)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleSelectNotification(notification);
                      }}
                    >
                      {typeIconMap[notification.type]}
                      <div className="flex-1">
                        <span
                          className={`block font-medium ${notification.read ? "text-muted-foreground" : "text-foreground"}`}
                        >
                          {notification.title}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {notification.description}
                        </span>
                        <span className="block text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(notification.date).toLocaleString()}
                        </span>
                      </div>
                      {!notification.read && (
                        <span className="ml-2 mt-1 w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
