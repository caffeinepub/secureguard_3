import { useNotificationCtx } from "../contexts/NotificationContext";
import type { AppNotification } from "../contexts/NotificationContext";

export interface UseNotificationsReturn {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (message: string, type: AppNotification["type"]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const {
    notifications,
    unreadCount,
    addNotification,
    markRead,
    markAllRead,
    clearAll,
  } = useNotificationCtx();
  return {
    notifications,
    unreadCount,
    addNotification,
    markRead,
    markAllRead,
    clearAll,
  };
}
