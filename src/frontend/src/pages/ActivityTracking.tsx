import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  AlertTriangle,
  Download,
  FileText,
  HardDrive,
  Key,
  Lock,
  LogIn,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface ActivityEvent {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: "login" | "file" | "encrypt" | "backup" | "access" | "alert" | "system";
  severity: "normal" | "warning" | "critical";
}

const SEED_ACTIVITIES: ActivityEvent[] = [
  {
    id: "a1",
    action: "User Login",
    user: "ku",
    timestamp: "2026-03-26 09:14:22",
    details: "Successful authentication from 192.168.1.100",
    type: "login",
    severity: "normal",
  },
  {
    id: "a2",
    action: "File Encrypted",
    user: "ku",
    timestamp: "2026-03-26 09:15:01",
    details: "OP_NIGHTFALL_BRIEF.pdf encrypted with AES-256",
    type: "encrypt",
    severity: "normal",
  },
  {
    id: "a3",
    action: "Unauthorized Access",
    user: "unknown",
    timestamp: "2026-03-26 09:16:45",
    details: "Failed login attempt from 10.0.0.255 — IP blocked",
    type: "alert",
    severity: "critical",
  },
  {
    id: "a4",
    action: "Backup Created",
    user: "ku",
    timestamp: "2026-03-26 09:18:33",
    details: "Full system backup to MIL-BACKUP-01",
    type: "backup",
    severity: "normal",
  },
  {
    id: "a5",
    action: "User Login",
    user: "alex.morgan",
    timestamp: "2026-03-26 08:45:12",
    details: "Successful authentication from 10.0.1.55",
    type: "login",
    severity: "normal",
  },
  {
    id: "a6",
    action: "File Uploaded",
    user: "alex.morgan",
    timestamp: "2026-03-26 08:46:30",
    details: "RECON_PHOTOS.zip uploaded to secure vault",
    type: "file",
    severity: "normal",
  },
  {
    id: "a7",
    action: "Access Granted",
    user: "ku",
    timestamp: "2026-03-26 08:50:00",
    details: "Read/Write access granted to s.chen",
    type: "access",
    severity: "normal",
  },
  {
    id: "a8",
    action: "Suspicious Login",
    user: "j.torres",
    timestamp: "2026-03-26 03:15:44",
    details: "Login from unusual location — 220.180.45.201",
    type: "alert",
    severity: "critical",
  },
  {
    id: "a9",
    action: "File Sharded",
    user: "s.chen",
    timestamp: "2026-03-25 22:10:55",
    details: "AGENT_PROFILES.enc split into 12 shards",
    type: "encrypt",
    severity: "normal",
  },
  {
    id: "a10",
    action: "Risk Score Alert",
    user: "system",
    timestamp: "2026-03-25 22:05:00",
    details: "Risk score elevated to 75 — High threat detected",
    type: "system",
    severity: "warning",
  },
  {
    id: "a11",
    action: "User Blocked",
    user: "ku",
    timestamp: "2026-03-25 21:00:10",
    details: "j.torres blocked due to suspicious activity",
    type: "access",
    severity: "warning",
  },
  {
    id: "a12",
    action: "Backup Restored",
    user: "ku",
    timestamp: "2026-03-25 20:30:22",
    details: "Restored backup BACKUP_2026-03-24 to production",
    type: "backup",
    severity: "normal",
  },
  {
    id: "a13",
    action: "File Deleted Local",
    user: "m.webb",
    timestamp: "2026-03-25 18:45:00",
    details: "Local copy of COMMS_LOG.txt deleted after backup",
    type: "file",
    severity: "normal",
  },
  {
    id: "a14",
    action: "System Scan",
    user: "system",
    timestamp: "2026-03-25 17:00:00",
    details: "Scheduled security scan completed — 0 threats found",
    type: "system",
    severity: "normal",
  },
  {
    id: "a15",
    action: "User Login",
    user: "s.chen",
    timestamp: "2026-03-25 16:20:15",
    details: "Successful authentication from 10.0.1.88",
    type: "login",
    severity: "normal",
  },
  {
    id: "a16",
    action: "File Encrypted",
    user: "s.chen",
    timestamp: "2026-03-25 16:22:00",
    details: "SATELLITE_COORDS.enc encrypted with AES-256",
    type: "encrypt",
    severity: "normal",
  },
  {
    id: "a17",
    action: "Access Revoked",
    user: "ku",
    timestamp: "2026-03-25 15:00:00",
    details: "Encryption permissions revoked from m.webb",
    type: "access",
    severity: "warning",
  },
  {
    id: "a18",
    action: "Unauthorized Access",
    user: "unknown",
    timestamp: "2026-03-25 14:30:11",
    details: "Brute-force attempt detected from 185.220.101.5 — blocked",
    type: "alert",
    severity: "critical",
  },
  {
    id: "a19",
    action: "Data Export",
    user: "alex.morgan",
    timestamp: "2026-03-25 13:10:00",
    details: "Logs exported as CSV by alex.morgan",
    type: "file",
    severity: "normal",
  },
  {
    id: "a20",
    action: "Risk Engine Started",
    user: "system",
    timestamp: "2026-03-25 09:00:00",
    details: "SENTINEL risk engine initialized — base score 30",
    type: "system",
    severity: "normal",
  },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  login: <LogIn size={14} style={{ color: "#00d4ff" }} />,
  file: <Upload size={14} style={{ color: "#00ff88" }} />,
  encrypt: <Lock size={14} style={{ color: "#7c3aed" }} />,
  backup: <HardDrive size={14} style={{ color: "#ffaa00" }} />,
  access: <Key size={14} style={{ color: "#00d4ff" }} />,
  alert: <AlertTriangle size={14} style={{ color: "#ff0040" }} />,
  system: <Shield size={14} style={{ color: "rgba(224,224,255,0.5)" }} />,
};

const SEVERITY_COLORS: Record<string, string> = {
  normal: "rgba(0,212,255,0.15)",
  warning: "rgba(255,170,0,0.15)",
  critical: "rgba(255,0,64,0.15)",
};

const SEVERITY_BADGE: Record<string, string> = {
  normal: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function ActivityTracking() {
  const [filter, setFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");

  const users = useMemo(() => {
    const names = Array.from(new Set(SEED_ACTIVITIES.map((a) => a.user)));
    return ["all", ...names];
  }, []);

  const filtered = useMemo(() => {
    return SEED_ACTIVITIES.filter((a) => {
      const matchType = filter === "all" || a.type === filter;
      const matchUser = userFilter === "all" || a.user === userFilter;
      return matchType && matchUser;
    });
  }, [filter, userFilter]);

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <Activity size={20} style={{ color: "#00d4ff" }} />
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
          ACTIVITY TRACKING
        </h1>
        <Badge
          variant="outline"
          className="text-xs font-mono border-cyan-500/20 text-cyan-400"
        >
          {SEED_ACTIVITIES.length} EVENTS
        </Badge>
        <div style={{ flex: 1 }} />
        <Button
          data-ocid="activity.secondary_button"
          variant="outline"
          size="sm"
          onClick={() => {
            toast.success("Activity log exported");
          }}
          className="text-xs font-mono border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
        >
          <Download size={12} className="mr-1" />
          EXPORT
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger
            data-ocid="activity.select"
            className="w-40 text-xs font-mono border-cyan-500/20 bg-white/5 text-white/70"
          >
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="font-mono text-xs">
            <SelectItem value="all">ALL TYPES</SelectItem>
            <SelectItem value="login">LOGIN</SelectItem>
            <SelectItem value="file">FILE</SelectItem>
            <SelectItem value="encrypt">ENCRYPT</SelectItem>
            <SelectItem value="backup">BACKUP</SelectItem>
            <SelectItem value="access">ACCESS</SelectItem>
            <SelectItem value="alert">ALERT</SelectItem>
            <SelectItem value="system">SYSTEM</SelectItem>
          </SelectContent>
        </Select>

        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger
            data-ocid="activity.select"
            className="w-40 text-xs font-mono border-cyan-500/20 bg-white/5 text-white/70"
          >
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent className="font-mono text-xs">
            {users.map((u) => (
              <SelectItem key={u} value={u}>
                {u === "all" ? "ALL USERS" : u.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((event, i) => (
          <motion.div
            key={event.id}
            data-ocid={`activity.item.${i + 1}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.25 }}
            whileHover={{ x: 4, transition: { duration: 0.1 } }}
          >
            <Card
              className="border-white/5 transition-all duration-200"
              style={{
                background: SEVERITY_COLORS[event.severity],
                borderColor:
                  event.severity === "critical"
                    ? "rgba(255,0,64,0.25)"
                    : event.severity === "warning"
                      ? "rgba(255,170,0,0.2)"
                      : "rgba(0,212,255,0.1)",
              }}
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
                  {TYPE_ICONS[event.type]}
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
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "rgba(224,224,255,0.9)",
                      }}
                    >
                      {event.action}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs font-mono ${SEVERITY_BADGE[event.severity]}`}
                    >
                      {event.severity.toUpperCase()}
                    </Badge>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.6rem",
                        color: "rgba(0,212,255,0.6)",
                        background: "rgba(0,212,255,0.06)",
                        border: "1px solid rgba(0,212,255,0.15)",
                        borderRadius: 4,
                        padding: "1px 6px",
                      }}
                    >
                      <User
                        size={8}
                        style={{ display: "inline", marginRight: 3 }}
                      />
                      {event.user}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.58rem",
                        color: "rgba(224,224,255,0.3)",
                        flexShrink: 0,
                      }}
                    >
                      {event.timestamp}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.65rem",
                      color: "rgba(224,224,255,0.5)",
                      margin: "4px 0 0",
                    }}
                  >
                    {event.details}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div
            data-ocid="activity.empty_state"
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "rgba(224,224,255,0.2)",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
            }}
          >
            NO EVENTS MATCH FILTER
          </div>
        )}
      </div>
    </div>
  );
}
