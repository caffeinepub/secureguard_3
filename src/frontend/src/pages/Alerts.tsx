import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ShieldAlert,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button3D } from "../components/Button3D";
import { useAppState } from "../context/AppStateContext";
import type { SeedAlert } from "../utils/seedData";

const SEVERITY_CONFIG = {
  critical: {
    border: "border-destructive/50",
    bg: "bg-destructive/10",
    badge: "bg-destructive/20 text-destructive border-destructive/40",
    icon: ShieldAlert,
    iconColor: "text-destructive",
    pulse: true,
  },
  warning: {
    border: "border-warning/40",
    bg: "bg-warning/5",
    badge: "bg-warning/20 text-warning border-warning/40",
    icon: AlertTriangle,
    iconColor: "text-warning",
    pulse: false,
  },
  info: {
    border: "border-primary/30",
    bg: "bg-primary/5",
    badge: "bg-primary/20 text-primary border-primary/30",
    icon: Bell,
    iconColor: "text-primary",
    pulse: false,
  },
};

export function Alerts() {
  const { alerts, setAlerts, addLog, users, setUsers, navigateTo } =
    useAppState();
  const [pulsingId, setPulsingId] = useState<string | null>(null);

  const active = alerts.filter((a) => !a.acknowledged);
  const acknowledged = alerts.filter((a) => a.acknowledged);

  const handleAcknowledge = (alert: SeedAlert) => {
    setAlerts(
      alerts.map((a) => (a.id === alert.id ? { ...a, acknowledged: true } : a)),
    );
    addLog({
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      username: "ku",
      ip: "10.0.0.1",
      action: "Alert Acknowledged",
      resource: alert.title,
      type: "info",
    });
    toast.success(`Alert acknowledged: ${alert.title}`);
  };

  const handleEscalate = (alert: SeedAlert) => {
    setPulsingId(alert.id);
    setTimeout(() => setPulsingId(null), 1000);
    setAlerts(
      alerts.map((a) =>
        a.id === alert.id
          ? { ...a, severity: "critical" as const, acknowledged: false }
          : a,
      ),
    );
    addLog({
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      username: "ku",
      ip: "10.0.0.1",
      action: "Alert Escalated",
      resource: alert.title,
      type: "critical",
    });
    toast.error(`Alert escalated to CRITICAL: ${alert.title}`);
  };

  const handleBlockUser = (alert: SeedAlert) => {
    if (!alert.user || alert.user === "SYSTEM") {
      toast.error("Cannot block SYSTEM");
      return;
    }
    const updated = users.map((u) =>
      u.username === alert.user
        ? {
            ...u,
            status: "blocked" as const,
            blocked: true,
            accessLevel: "Revoked",
            permissions: [],
          }
        : u,
    );
    setUsers(updated);
    addLog({
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      username: "ku",
      ip: "10.0.0.1",
      action: "User Blocked via Alert",
      resource: alert.user,
      type: "warning",
    });
    toast.warning(`User ${alert.user} blocked`);
    navigateTo("admin");
  };

  const handleDismissAcknowledged = () => {
    setAlerts(alerts.filter((a) => !a.acknowledged));
    toast.info("Dismissed all acknowledged alerts");
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
            SecureGuard – Alerts
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            Security Alerts
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {active.length} active · {acknowledged.length} acknowledged
          </p>
        </div>
        {acknowledged.length > 0 && (
          <Button3D>
            <Button
              data-ocid="alerts.dismiss_acknowledged.button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-border text-muted-foreground hover:bg-accent/50"
              onClick={handleDismissAcknowledged}
            >
              <X className="w-3.5 h-3.5 mr-1.5" /> Dismiss Acknowledged (
              {acknowledged.length})
            </Button>
          </Button3D>
        )}
      </div>

      {active.length === 0 && (
        <div
          data-ocid="alerts.empty_state"
          className="flex flex-col items-center justify-center py-16 text-muted-foreground"
        >
          <CheckCircle className="w-12 h-12 mb-3 text-success opacity-60" />
          <p className="text-sm font-medium">All clear — no active alerts</p>
          <p className="text-xs opacity-60 mt-1">System is secure</p>
        </div>
      )}

      {/* Active Alerts */}
      <AnimatePresence>
        {active.map((alert, i) => {
          const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.info;
          const Icon = cfg.icon;
          const isPulsing = pulsingId === alert.id;
          return (
            <motion.div
              key={alert.id}
              data-ocid={`alerts.item.${i + 1}`}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93, x: 20 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card
                className={`border ${cfg.border} ${cfg.bg} relative overflow-hidden`}
              >
                {cfg.pulse && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-destructive/60 pointer-events-none"
                    animate={{ opacity: [0.6, 0, 0.6] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                )}
                {isPulsing && (
                  <motion.div
                    className="absolute inset-0 bg-destructive/20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${cfg.bg} border ${cfg.border} flex-shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${cfg.badge}`}
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <h3 className="text-sm font-semibold text-foreground">
                          {alert.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                        {alert.user && (
                          <span>
                            User:{" "}
                            <span className="text-foreground">
                              {alert.user}
                            </span>
                          </span>
                        )}
                        {alert.ip && (
                          <span>
                            IP:{" "}
                            <span className="font-mono text-foreground">
                              {alert.ip}
                            </span>
                          </span>
                        )}
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Button3D>
                        <Button
                          data-ocid={`alerts.acknowledge.button.${i + 1}`}
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2.5 text-[10px] text-success hover:bg-success/10"
                          onClick={() => handleAcknowledge(alert)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> Ack
                        </Button>
                      </Button3D>
                      <Button3D>
                        <Button
                          data-ocid={`alerts.escalate.button.${i + 1}`}
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2.5 text-[10px] text-warning hover:bg-warning/10"
                          onClick={() => handleEscalate(alert)}
                        >
                          <Zap className="w-3 h-3 mr-1" /> Escalate
                        </Button>
                      </Button3D>
                      {alert.user && alert.user !== "SYSTEM" && (
                        <Button3D>
                          <Button
                            data-ocid={`alerts.block_user.delete_button.${i + 1}`}
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2.5 text-[10px] text-destructive hover:bg-destructive/10"
                            onClick={() => handleBlockUser(alert)}
                          >
                            <X className="w-3 h-3 mr-1" /> Block
                          </Button>
                        </Button3D>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Acknowledged Alerts */}
      {acknowledged.length > 0 && (
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase mb-3">
            Acknowledged
          </p>
          <div className="space-y-2">
            {acknowledged.map((alert, _i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3"
              >
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {alert.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {alert.timestamp}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-success/10 text-success border-success/30"
                >
                  Acknowledged
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
