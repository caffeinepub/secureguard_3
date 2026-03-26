import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  File,
  HardDrive,
  Key,
  Trash2,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useAppState } from "../context/AppStateContext";
import type { SeedNotification } from "../utils/seedData";

type IconComp = React.ComponentType<{ className?: string; size?: number }>;

const TYPE_ICONS: Record<string, IconComp> = {
  alert: AlertTriangle,
  access: Key,
  backup: HardDrive,
  file: File,
  warning: AlertTriangle,
  user: User,
};

const PRIORITY_STYLES: Record<string, string> = {
  critical: "border-red-500/30 bg-red-500/5",
  warning: "border-amber-500/25 bg-amber-500/5",
  success: "border-green-500/25 bg-green-500/5",
  info: "border-white/5 bg-white/2",
};

const BADGE_STYLES: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  success: "bg-green-500/20 text-green-400 border-green-500/30",
  info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export function NotificationsPage() {
  const { notifications, setNotifications } = useAppState();

  const markRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotif = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info("All notifications cleared");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Bell size={20} style={{ color: "#00d4ff" }} />
        <h1
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "1.1rem",
            fontWeight: 900,
            letterSpacing: "0.25em",
            color: "#00d4ff",
            margin: 0,
            textShadow: "0 0 15px rgba(0,212,255,0.5)",
          }}
        >
          NOTIFICATIONS
        </h1>
        {unreadCount > 0 && (
          <Badge
            style={{
              background: "rgba(124,58,237,0.3)",
              color: "#c084fc",
              border: "1px solid rgba(124,58,237,0.4)",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
            }}
          >
            {unreadCount} UNREAD
          </Badge>
        )}
        <div style={{ flex: 1 }} />
        <Button
          data-ocid="notifications.secondary_button"
          variant="outline"
          size="sm"
          onClick={markAllRead}
          className="text-xs font-mono border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
        >
          <CheckCheck size={12} className="mr-1" />
          MARK ALL READ
        </Button>
        <Button
          data-ocid="notifications.delete_button"
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="text-xs font-mono border-red-500/20 text-red-400 hover:bg-red-500/10"
        >
          <Trash2 size={12} className="mr-1" />
          CLEAR ALL
        </Button>
      </div>

      {/* Notification list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <motion.div
              data-ocid="notifications.empty_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "rgba(224,224,255,0.2)",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
              }}
            >
              NO NOTIFICATIONS
            </motion.div>
          ) : (
            notifications.map((n: SeedNotification, i: number) => {
              const IconComp = TYPE_ICONS[n.type] ?? AlertTriangle;
              return (
                <motion.div
                  key={n.id}
                  data-ocid={`notifications.item.${i + 1}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: n.read ? 0.5 : 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Card
                    className={`transition-all duration-200 ${PRIORITY_STYLES[n.priority] ?? PRIORITY_STYLES.info}`}
                  >
                    <CardContent className="p-3 flex items-start gap-3">
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "rgba(0,0,0,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <IconComp
                          size={14}
                          className={
                            n.priority === "critical"
                              ? "text-red-400"
                              : n.priority === "warning"
                                ? "text-amber-400"
                                : n.priority === "success"
                                  ? "text-green-400"
                                  : "text-cyan-400"
                          }
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "0.72rem",
                              fontWeight: n.read ? 400 : 700,
                              color: n.read
                                ? "rgba(224,224,255,0.5)"
                                : "rgba(224,224,255,0.9)",
                            }}
                          >
                            {n.message}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs font-mono ${BADGE_STYLES[n.priority] ?? BADGE_STYLES.info}`}
                          >
                            {n.priority.toUpperCase()}
                          </Badge>
                          {!n.read && (
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#7c3aed",
                                boxShadow: "0 0 6px rgba(124,58,237,0.8)",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <span
                            style={{
                              marginLeft: "auto",
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "0.55rem",
                              color: "rgba(224,224,255,0.25)",
                              flexShrink: 0,
                            }}
                          >
                            {n.timestamp}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {!n.read && (
                          <Button
                            data-ocid="notifications.toggle"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-cyan-400/50 hover:text-cyan-400"
                            onClick={() => markRead(n.id)}
                          >
                            <Check size={12} />
                          </Button>
                        )}
                        <Button
                          data-ocid="notifications.delete_button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400/50 hover:text-red-400"
                          onClick={() => deleteNotif(n.id)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
