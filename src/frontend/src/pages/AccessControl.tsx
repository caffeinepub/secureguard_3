import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Principal } from "@icp-sdk/core/principal";
import {
  AlertTriangle,
  Key,
  Lock,
  ShieldCheck,
  Users,
  Wifi,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { Button3D } from "../components/Button3D";
import { useActor } from "../hooks/useActor";
import { useEvents, useSystemStatus } from "../hooks/useQueries";

function riskColor(level: string): string {
  if (level === "critical") return "#ef4444";
  if (level === "suspicious") return "#f59e0b";
  return "#22c55e";
}

export function AccessControl() {
  const { data: events = [] } = useEvents();
  const { data: status } = useSystemStatus();
  const { actor } = useActor();

  const [principalInput, setPrincipalInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<"user" | "guest">("user");
  const [isGranting, setIsGranting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [grantAnimating, setGrantAnimating] = useState(false);
  const [revokeAnimating, setRevokeAnimating] = useState(false);

  const unauthorizedAttempts = events.filter(
    (e) => e.action === "unauthorized_access",
  );

  const activeSessions = (() => {
    const seen = new Map<string, (typeof events)[0]>();
    for (const ev of [...events].sort((a, b) =>
      Number(b.timestamp - a.timestamp),
    )) {
      if (!seen.has(ev.userId)) seen.set(ev.userId, ev);
      if (seen.size >= 5) break;
    }
    return Array.from(seen.values());
  })();

  const handleGrantAccess = async () => {
    if (!actor || !principalInput.trim()) {
      toast.error("Please enter a valid Principal ID");
      return;
    }
    // Key spin animation
    setGrantAnimating(true);
    setTimeout(async () => {
      setGrantAnimating(false);
      setIsGranting(true);
      try {
        const principal = Principal.fromText(principalInput.trim());
        const role = selectedRole === "user" ? UserRole.user : UserRole.guest;
        await actor.assignCallerUserRole(principal, role);
        toast.success(
          `Access granted: ${principalInput.trim().slice(0, 16)}... assigned role '${selectedRole}'`,
        );
        setPrincipalInput("");
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Invalid Principal ID or permission denied";
        toast.error(`Grant failed: ${msg}`);
      } finally {
        setIsGranting(false);
      }
    }, 700);
  };

  const handleRevoke = async () => {
    if (!actor || !principalInput.trim()) {
      toast.error("Please enter a valid Principal ID");
      return;
    }
    // Lock close animation
    setRevokeAnimating(true);
    setTimeout(async () => {
      setRevokeAnimating(false);
      setIsRevoking(true);
      try {
        const principal = Principal.fromText(principalInput.trim());
        await actor.assignCallerUserRole(principal, UserRole.guest);
        toast.warning(
          `Access revoked for ${principalInput.trim().slice(0, 16)}...`,
        );
        setPrincipalInput("");
      } catch (_err) {
        toast.error("Revoke failed: Invalid Principal ID or permission denied");
      } finally {
        setIsRevoking(false);
      }
    }, 600);
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
          SecureGuard – Access Control
        </p>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">
          Access Control
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grant / Revoke Access */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Manage Access
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Principal ID
              </Label>
              <Input
                className="bg-secondary border-border text-foreground text-xs font-mono"
                placeholder="aaaaa-bbbbb-ccccc-ddddd-eee"
                value={principalInput}
                onChange={(e) => setPrincipalInput(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(v) => setSelectedRole(v as "user" | "guest")}
              >
                <SelectTrigger className="bg-secondary border-border h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    User — Read / Write / Encrypt
                  </SelectItem>
                  <SelectItem value="guest">Guest — Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              {/* Grant Access with key spin */}
              <Button3D style={{ flex: 1 }}>
                <Button
                  data-ocid="access_control.grant_button"
                  className="w-full h-9 text-xs bg-success/20 text-success border border-success/30 hover:bg-success/30"
                  variant="ghost"
                  onClick={handleGrantAccess}
                  disabled={
                    isGranting || grantAnimating || !principalInput.trim()
                  }
                >
                  <AnimatePresence mode="wait">
                    {grantAnimating ? (
                      <motion.span
                        key="key-spin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.6,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        >
                          <Key className="w-3.5 h-3.5" />
                        </motion.div>
                        Granting...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="grant-label"
                        className="flex items-center gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5" />
                        {isGranting ? "Granting..." : "Grant Access"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Button3D>

              {/* Revoke Access with lock close */}
              <Button3D style={{ flex: 1 }}>
                <Button
                  data-ocid="access_control.revoke_button"
                  className="w-full h-9 text-xs bg-destructive/15 text-destructive border border-destructive/25 hover:bg-destructive/25"
                  variant="ghost"
                  onClick={handleRevoke}
                  disabled={
                    isRevoking || revokeAnimating || !principalInput.trim()
                  }
                >
                  <AnimatePresence mode="wait">
                    {revokeAnimating ? (
                      <motion.span
                        key="lock-close"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 0.9, 1],
                            rotate: [0, -10, 10, 0],
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </motion.div>
                        Revoking...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="revoke-label"
                        className="flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        {isRevoking ? "Revoking..." : "Revoke Access"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Button3D>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <Wifi className="w-4 h-4 text-success" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {activeSessions.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No active sessions
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[11px] text-muted-foreground py-2 px-4">
                      User
                    </TableHead>
                    <TableHead className="text-[11px] text-muted-foreground py-2">
                      IP
                    </TableHead>
                    <TableHead className="text-[11px] text-muted-foreground py-2">
                      Risk
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((ev, i) => (
                    <motion.tr
                      key={String(ev.id)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <TableCell className="py-2 px-4">
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {ev.userName}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {ev.userId.slice(0, 16)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground py-2 font-mono">
                        {ev.ipAddress}
                      </TableCell>
                      <TableCell className="py-2">
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: riskColor(ev.riskLevel ?? "") }}
                        >
                          {ev.riskLevel?.toUpperCase()}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Unauthorized Attempts */}
      {unauthorizedAttempts.length > 0 && (
        <Card className="bg-card border-destructive/30">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-[13px] font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Unauthorized Access Attempts ({unauthorizedAttempts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[11px] text-muted-foreground py-2 px-4">
                    User
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    IP Address
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Time
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Risk Score
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unauthorizedAttempts.map((ev, i) => (
                  <motion.tr
                    key={String(ev.id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <TableCell className="text-xs text-foreground py-2 px-4 font-medium">
                      {ev.userName}
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground py-2 font-mono">
                      {ev.ipAddress}
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground py-2">
                      {new Date(
                        Number(ev.timestamp) / 1_000_000,
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge className="text-[10px] px-1.5 bg-destructive/15 text-destructive border-destructive/30">
                        {String(ev.riskScore)}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      {status && (
        <Card
          className={`bg-card border ${
            status.locked ? "border-destructive/50" : "border-success/30"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={status.locked ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {status.locked ? (
                  <Lock className="w-5 h-5 text-destructive" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-success" />
                )}
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  System {status.locked ? "LOCKED" : "OPERATIONAL"}
                </p>
                {status.locked && (
                  <p className="text-xs text-muted-foreground">
                    {status.lockReason}
                  </p>
                )}
              </div>
              <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  <span className="text-foreground font-bold">
                    {String(status.totalEventsCount)}
                  </span>{" "}
                  events
                </span>
                <span>
                  <span className="text-destructive font-bold">
                    {String(status.activeAlertsCount)}
                  </span>{" "}
                  active alerts
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
