import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Bell,
  Database,
  File,
  HardDrive,
  RefreshCw,
  Server,
  ShieldAlert,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { SecurityEvent } from "../backend";
import { ThreatGlobe } from "../components/ThreatGlobe";
import type { ThreatNode } from "../components/ThreatGlobe";
import { useAppState } from "../context/AppStateContext";
import {
  useAddEvent,
  useEvents,
  useSeedDemoData,
  useSystemStatus,
} from "../hooks/useQueries";
import {
  formatTs,
  getRiskBadgeClass,
  randomEventParams,
} from "../utils/riskUtils";

function CountUp({
  target,
  duration = 1200,
}: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <>{count}</>;
}

function SemiCircleGauge({ score }: { score: number }) {
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circumference = Math.PI * r;
  const dashOffset = circumference - (score / 100) * circumference;
  const color =
    score >= 70
      ? "oklch(0.62 0.25 20)"
      : score >= 30
        ? "oklch(0.82 0.17 80)"
        : "oklch(0.75 0.2 160)";
  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width="180"
        height="100"
        viewBox="0 0 180 110"
        aria-label="Risk score gauge"
      >
        <title>Risk Score Gauge</title>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="oklch(0.24 0.042 240)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${dashOffset}`}
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
        />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="oklch(0.92 0.012 240)"
          fontSize="28"
          fontWeight="bold"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="oklch(0.62 0.03 240)"
          fontSize="11"
        >
          RISK SCORE
        </text>
      </svg>
      <div
        className="text-xs font-bold mt-1 px-2 py-0.5 rounded"
        style={{ color, backgroundColor: `${color.replace(")", " / 0.15)")}` }}
      >
        {score >= 70 ? "CRITICAL" : score >= 30 ? "SUSPICIOUS" : "SAFE"}
      </div>
    </div>
  );
}

const THREAT_STAGES = [
  {
    label: "Monitoring",
    color: "text-primary",
    bg: "bg-primary/15 border-primary/30",
    icon: Activity,
  },
  {
    label: "AI Detection",
    color: "text-success",
    bg: "bg-success/15 border-success/30",
    icon: Zap,
  },
  {
    label: "Risk Scoring",
    color: "text-warning",
    bg: "bg-warning/15 border-warning/30",
    icon: TrendingUp,
  },
  {
    label: "Alerting",
    color: "text-destructive",
    bg: "bg-destructive/15 border-destructive/30",
    icon: ShieldAlert,
  },
];

export function Dashboard() {
  const { data: events = [], isLoading, refetch: refetchEvents } = useEvents();
  const { data: status } = useSystemStatus();
  const seedDemo = useSeedDemoData();
  const addEvent = useAddEvent();
  const {
    users,
    files,
    alerts,
    backups,
    notifications,
    reseedAll,
    navigateTo,
  } = useAppState();

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchEvents();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetchEvents]);

  const latestScore = useMemo(() => {
    const scored = events.filter((e) => e.riskScore !== undefined);
    if (!scored.length) return 12;
    return Number(scored[0].riskScore);
  }, [events]);

  const threatNodes: ThreatNode[] = useMemo(() => {
    const seen = new Map<string, ThreatNode>();
    for (const ev of events.slice(0, 15)) {
      if (!seen.has(ev.ipAddress)) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        seen.set(ev.ipAddress, {
          x: Math.sin(phi) * Math.cos(theta),
          y: Math.cos(phi),
          z: Math.sin(phi) * Math.sin(theta),
          risk:
            ev.riskLevel === "critical" || ev.riskLevel === "suspicious"
              ? "critical"
              : "safe",
        });
      }
    }
    return [...seen.values()];
  }, [events]);

  const handleReseed = async () => {
    reseedAll();
    await seedDemo.mutateAsync();
    toast.success("Demo data reseeded");
  };

  const handleSimulate = async () => {
    const params = randomEventParams();
    await addEvent.mutateAsync({
      ...params,
      resourceCount: BigInt(params.resourceCount),
      riskScore: BigInt(params.riskScore),
    });
    toast.warning(`Simulated event: ${params.action} from ${params.ipAddress}`);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const activeAlerts = alerts.filter((a) => !a.acknowledged).length;

  const kpiCards = [
    {
      label: "Total Files",
      value: files.length,
      icon: File,
      color: "text-primary",
      page: "files" as const,
      sub: `${files.filter((f) => f.encrypted).length} encrypted`,
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "active").length,
      icon: Users,
      color: "text-success",
      page: "admin" as const,
      sub: `${users.length} total`,
    },
    {
      label: "Active Alerts",
      value: activeAlerts,
      icon: ShieldAlert,
      color: activeAlerts > 0 ? "text-destructive" : "text-success",
      page: "alerts" as const,
      sub: `${alerts.length} total`,
    },
    {
      label: "Backups",
      value: backups.length,
      icon: HardDrive,
      color: "text-warning",
      page: "backups" as const,
      sub: backups[0]?.createdAt ?? "—",
    },
    {
      label: "Notifications",
      value: unreadNotifications,
      icon: Bell,
      color: "text-primary",
      page: "notifications" as const,
      sub: `${notifications.length} total`,
    },
    {
      label: "System Events",
      value: events.length,
      icon: Activity,
      color: "text-muted-foreground",
      page: "logs" as const,
      sub: "backend",
    },
  ];

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
            SecureGuard – Dashboard
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            Security Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {status?.locked ? (
              <span className="text-destructive font-semibold">
                ⚠ SYSTEM LOCKED
              </span>
            ) : (
              <span className="text-success">● System Online</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            data-ocid="dashboard.reseed.button"
            size="sm"
            variant="outline"
            className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
            onClick={handleReseed}
            disabled={seedDemo.isPending}
          >
            <Database className="w-3.5 h-3.5 mr-1.5" />
            {seedDemo.isPending ? "Seeding..." : "Reseed Demo"}
          </Button>
          <Button
            data-ocid="dashboard.simulate.button"
            size="sm"
            variant="outline"
            className="h-8 text-xs border-warning/30 text-warning hover:bg-warning/10"
            onClick={handleSimulate}
            disabled={addEvent.isPending}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Simulate Event
          </Button>
        </div>
      </div>

      {/* KPI Cards with CountUp */}
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        {isLoading
          ? ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"].map((key) => (
              <Skeleton key={key} className="h-24 rounded-lg" />
            ))
          : kpiCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  data-ocid={`dashboard.${card.label.toLowerCase().replace(/ /g, "_")}.card`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigateTo(card.page)}
                  className="cursor-pointer"
                >
                  <Card className="bg-card border-border hover:border-primary/30 transition-colors h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${card.color}`} />
                        <p className="text-[10px] text-muted-foreground truncate">
                          {card.label}
                        </p>
                      </div>
                      <p className={`text-2xl font-black ${card.color}`}>
                        <CountUp target={card.value} />
                      </p>
                      <p className="text-[9px] text-muted-foreground/70 mt-1 truncate">
                        {card.sub}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Globe */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-0 pt-4 px-4">
              <CardTitle className="text-[13px] font-semibold text-foreground flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" /> Live Threat Globe
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ThreatGlobe nodes={threatNodes} />
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[13px] font-semibold text-foreground">
                  Recent Events
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] text-primary hover:bg-primary/10"
                  onClick={() => navigateTo("logs")}
                  data-ocid="dashboard.view_logs.button"
                >
                  View All Logs →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[10px] text-muted-foreground">
                      Time
                    </TableHead>
                    <TableHead className="text-[10px] text-muted-foreground">
                      User
                    </TableHead>
                    <TableHead className="text-[10px] text-muted-foreground">
                      Action
                    </TableHead>
                    <TableHead className="text-[10px] text-muted-foreground">
                      Risk
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading &&
                    ["sk-r1", "sk-r2", "sk-r3", "sk-r4", "sk-r5"].map((key) => (
                      <TableRow key={key}>
                        <TableCell colSpan={4}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      </TableRow>
                    ))}
                  {!isLoading && events.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-xs text-muted-foreground"
                        data-ocid="dashboard.events.empty_state"
                      >
                        No events yet. Click Reseed Demo.
                      </TableCell>
                    </TableRow>
                  )}
                  {events.slice(0, 8).map((ev: SecurityEvent, i) => (
                    <motion.tr
                      key={String(ev.id)}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-border hover:bg-accent/20 transition-colors"
                    >
                      <TableCell className="py-2 text-[10px] font-mono text-muted-foreground">
                        {formatTs(ev.timestamp)}
                      </TableCell>
                      <TableCell className="py-2 text-[10px] text-foreground">
                        {ev.userName}
                      </TableCell>
                      <TableCell className="py-2 text-[10px] text-foreground">
                        {ev.action}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant="outline"
                          className={`text-[9px] ${getRiskBadgeClass(ev.riskLevel)}`}
                        >
                          {ev.riskLevel}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-0 pt-4 px-4">
              <CardTitle className="text-[13px] font-semibold text-foreground">
                AI Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <SemiCircleGauge score={latestScore} />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-[13px] font-semibold text-foreground">
                Threat Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {THREAT_STAGES.map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <motion.div
                    key={stage.label}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md border ${stage.bg}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${stage.color}`} />
                    <span className={`text-xs font-medium ${stage.color}`}>
                      {stage.label}
                    </span>
                    <motion.div
                      className={`ml-auto w-1.5 h-1.5 rounded-full bg-current ${stage.color}`}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.3,
                      }}
                    />
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[13px] font-semibold text-foreground">
                  Active Users
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] text-primary hover:bg-primary/10"
                  onClick={() => navigateTo("admin")}
                  data-ocid="dashboard.view_users.button"
                >
                  Manage →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {isLoading
                ? ["sk-u1", "sk-u2", "sk-u3", "sk-u4"].map((key) => (
                    <Skeleton key={key} className="h-8 w-full rounded" />
                  ))
                : users
                    .filter((u) => u.status === "active")
                    .slice(0, 4)
                    .map((user, i) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-2.5"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-primary">
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-[9px] text-muted-foreground">
                            {user.role} · {user.department}
                          </p>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                      </motion.div>
                    ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
