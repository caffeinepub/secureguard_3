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
import { Button3D } from "../components/Button3D";
import { useAppState } from "../context/AppStateContext";
import type { SeedNotification } from "../utils/seedData";

type IconComp = React.ComponentType<{ className?: string }>;

const TYPE_ICONS: Record<string, IconComp> = {
  alert: AlertTriangle,
  access: Key,
  backup: HardDrive,
  file: File,
  warning: AlertTriangle,
  user: User,
};

const PRIORITY_CONFIG = {
  critical: "border-destructive/40 bg-destructive/5",
  warning: "border-warning/30 bg-warning/5",
  success: "border-success/30 bg-success/5",
  info: "border-border bg-card",
};

const PRIORITY_BADGE = {
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  warning: "bg-warning/20 text-warning border-warning/30",
  success: "bg-success/20 text-success border-success/30",
  info: "bg-primary/20 text-primary border-primary/30",
};

const ICON_COLOR: Record<string, string> = {
  critical: "text-destructive",
  warning: "text-warning",
  success: "text-success",
  info: "text-primary",
};

export function Notifications() {
  const { notifications, setNotifications } = useAppState();

  const unread = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (n: SeedNotification) => {
    setNotifications(
      notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
    );
  };

  const handleDelete = (n: SeedNotification) => {
    setNotifications(notifications.filter((x) => x.id !== n.id));
    toast.info("Notification removed");
  };

  const handleMarkAll = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
            SecureGuard – Notifications
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            Notifications
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {unread} unread · {notifications.length} total
          </p>
        </div>
        {unread > 0 && (
          <Button3D>
            <Button
              data-ocid="notifications.mark_all.button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-success/30 text-success hover:bg-success/10"
              onClick={handleMarkAll}
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" /> Mark All Read
            </Button>
          </Button3D>
        )}
      </div>

      {notifications.length === 0 && (
        <div
          data-ocid="notifications.empty_state"
          className="flex flex-col items-center justify-center py-16 text-muted-foreground"
        >
          <Bell className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm">No notifications</p>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {notifications.map((n, i) => {
            const Icon: IconComp = TYPE_ICONS[n.type] ?? Bell;
            const cardCls =
              PRIORITY_CONFIG[n.priority as keyof typeof PRIORITY_CONFIG] ??
              PRIORITY_CONFIG.info;
            const badgeCls =
              PRIORITY_BADGE[n.priority as keyof typeof PRIORITY_BADGE] ??
              PRIORITY_BADGE.info;
            const iconCls = ICON_COLOR[n.priority] ?? "text-primary";
            return (
              <motion.div
                key={n.id}
                data-ocid={`notifications.item.${i + 1}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: n.read ? 0.55 : 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className={`border ${cardCls} transition-all`}>
                  <CardContent className="p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-card border border-border flex-shrink-0 mt-0.5">
                        <Icon className={`w-3.5 h-3.5 ${iconCls}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            className={`text-xs font-semibold ${
                              n.read
                                ? "text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          )}
                          <Badge
                            variant="outline"
                            className={`text-[9px] ml-auto ${badgeCls}`}
                          >
                            {n.priority}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {n.timestamp}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!n.read && (
                          <Button
                            data-ocid={`notifications.mark_read.button.${i + 1}`}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-success hover:bg-success/10"
                            onClick={() => handleMarkRead(n)}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          data-ocid={`notifications.delete.delete_button.${i + 1}`}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(n)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
