import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

export interface AppNotification {
  id: string;
  message: string;
  type: "info" | "warning" | "danger" | "success";
  timestamp: Date;
  read: boolean;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (message: string, type: AppNotification["type"]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  requestBrowserPermission: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({
  children,
}: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const permissionRef = useRef<NotificationPermission>("default");

  const requestBrowserPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    try {
      const perm = await Notification.requestPermission();
      permissionRef.current = perm;
    } catch {
      // ignore
    }
  }, []);

  const addNotification = useCallback(
    (message: string, type: AppNotification["type"]) => {
      const note: AppNotification = {
        id: `${Date.now()}-${Math.random()}`,
        message,
        type,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [note, ...prev].slice(0, 10));
      if (
        permissionRef.current === "granted" &&
        typeof Notification !== "undefined"
      ) {
        try {
          new Notification("SENTINEL Alert", {
            body: message,
            icon: "/favicon.ico",
          });
        } catch {
          // ignore
        }
      }
    },
    [],
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markRead,
        markAllRead,
        clearAll,
        requestBrowserPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationCtx(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotificationCtx must be used within NotificationProvider",
    );
  return ctx;
}
