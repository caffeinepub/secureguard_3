import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Activity,
  Database,
  Download,
  Key,
  Loader2,
  Lock,
  Plus,
  Server,
  ShieldAlert,
  Siren,
  Trash2,
  Unlock,
  UserCheck,
  UserX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShield3D } from "../components/AdminShield3D";
import { Button3D } from "../components/Button3D";
import { useAppState } from "../context/AppStateContext";
import {
  useAddEvent,
  useClearLogs,
  useLockSystem,
  useSeedDemoData,
  useSystemStatus,
  useUnlockSystem,
} from "../hooks/useQueries";
import type { SeedUser } from "../utils/seedData";

function roleBadgeClass(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "ANALYST":
      return "bg-primary/20 text-primary border-primary/30";
    case "OPERATOR":
      return "bg-success/20 text-success border-success/30";
    default:
      return "bg-muted/40 text-muted-foreground border-border";
  }
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "active":
      return "bg-success/20 text-success border-success/30";
    case "inactive":
      return "bg-muted/40 text-muted-foreground border-border";
    case "pending":
      return "bg-warning/20 text-warning border-warning/30";
    case "blocked":
      return "bg-destructive/20 text-destructive border-destructive/30";
    default:
      return "bg-muted/40 text-muted-foreground border-border";
  }
}

export function Admin() {
  const { data: status } = useSystemStatus();
  const lockSystem = useLockSystem();
  const unlockSystem = useUnlockSystem();
  const clearLogs = useClearLogs();
  const seedDemo = useSeedDemoData();
  const addEvent = useAddEvent();
  const { users, setUsers, addLog, addNotification, reseedAll } = useAppState();

  const [lockReason, setLockReason] = useState("");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [grantModalUser, setGrantModalUser] = useState<SeedUser | null>(null);
  const [revokeModalUser, setRevokeModalUser] = useState<SeedUser | null>(null);
  const [grantLevel, setGrantLevel] = useState("Read Only");
  const [exportLoading, setExportLoading] = useState(false);
  const [keyAnimUser, setKeyAnimUser] = useState<string | null>(null);
  const [lockAnimUser, setLockAnimUser] = useState<string | null>(null);

  // Add user form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("ANALYST");
  const [newDept, setNewDept] = useState("");

  const isLocked = status?.locked ?? false;

  const handleLock = async () => {
    await lockSystem.mutateAsync(lockReason || "Manual lock by admin");
    toast.warning("System locked");
    setLockDialogOpen(false);
    setLockReason("");
  };

  const handleUnlock = async () => {
    await unlockSystem.mutateAsync();
    toast.success("System unlocked");
  };

  const handleClearLogs = async () => {
    await clearLogs.mutateAsync();
    toast.info("Logs cleared");
    setClearDialogOpen(false);
  };

  const handleSimulateEvent = async () => {
    const events = [
      {
        user: "Threat-Actor-X",
        action: "unauthorized_access",
        ip: "185.220.101.45",
        score: 95,
        level: "critical",
      },
      {
        user: "Scanner-Bot",
        action: "port_scan",
        ip: "45.33.32.156",
        score: 72,
        level: "critical",
      },
      {
        user: "Internal-User-3",
        action: "bulk_file_access",
        ip: "10.0.1.88",
        score: 55,
        level: "suspicious",
      },
    ];
    const ev = events[Math.floor(Math.random() * events.length)];
    await addEvent.mutateAsync({
      userId: `uid-${Math.random().toString(36).slice(2, 8)}`,
      userName: ev.user,
      action: ev.action,
      resourceCount: BigInt(Math.floor(Math.random() * 50) + 1),
      ipAddress: ev.ip,
      riskScore: BigInt(ev.score),
      riskLevel: ev.level,
    });
    toast.warning(`Simulated: ${ev.action} from ${ev.ip}`);
  };

  const handleGrantAccess = () => {
    if (!grantModalUser) return;
    setKeyAnimUser(grantModalUser.id);
    setTimeout(() => setKeyAnimUser(null), 800);
    const updated = users.map((u) =>
      u.id === grantModalUser.id
        ? {
            ...u,
            accessLevel: grantLevel,
            status: "active" as const,
            blocked: false,
          }
        : u,
    );
    setUsers(updated);
    addLog({
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      username: "ku",
      ip: "10.0.0.1",
      action: "Access Granted",
      resource: `${grantModalUser.username} – ${grantLevel}`,
      type: "info",
    });
    addNotification({
      type: "access",
      title: "Access Granted",
      message: `Admin ku granted ${grantLevel} access to ${grantModalUser.name}`,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      read: false,
      priority: "info",
    });
    toast.success(`Access granted to ${grantModalUser.name}`);
    setGrantModalUser(null);
  };

  const handleRevokeAccess = () => {
    if (!revokeModalUser) return;
    setLockAnimUser(revokeModalUser.id);
    setTimeout(() => setLockAnimUser(null), 800);
    const updated = users.map((u) =>
      u.id === revokeModalUser.id
        ? { ...u, accessLevel: "Revoked", permissions: [] }
        : u,
    );
    setUsers(updated);
    addLog({
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      username: "ku",
      ip: "10.0.0.1",
      action: "Access Revoked",
      resource: revokeModalUser.username,
      type: "warning",
    });
    toast.warning(`Access revoked for ${revokeModalUser.name}`);
    setRevokeModalUser(null);
  };

  const handleBlockUser = (user: SeedUser) => {
    const updated = users.map((u) =>
      u.id === user.id
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
      action: "User Blocked",
      resource: user.username,
      type: "critical",
    });
    toast.error(`${user.name} has been blocked`);
  };

  const handleUnblockUser = (user: SeedUser) => {
    const updated = users.map((u) =>
      u.id === user.id
        ? { ...u, status: "inactive" as const, blocked: false }
        : u,
    );
    setUsers(updated);
    addLog({
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      username: "ku",
      ip: "10.0.0.1",
      action: "User Unblocked",
      resource: user.username,
      type: "info",
    });
    toast.success(`${user.name} has been unblocked`);
  };

  const handleAddUser = () => {
    if (!newName || !newEmail) {
      toast.error("Name and email required");
      return;
    }
    const newUser: SeedUser = {
      id: String(Date.now()),
      name: newName,
      username: newEmail.split("@")[0],
      email: newEmail,
      role: newRole,
      status: "pending",
      lastLogin: "Never",
      accessLevel: "None",
      department: newDept || "Unassigned",
      blocked: false,
      permissions: [],
    };
    setUsers([...users, newUser]);
    addLog({
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      username: "ku",
      ip: "10.0.0.1",
      action: "User Added",
      resource: newUser.username,
      type: "info",
    });
    toast.success(`User ${newName} added`);
    setAddUserOpen(false);
    setNewName("");
    setNewEmail("");
    setNewRole("ANALYST");
    setNewDept("");
  };

  const handleExportReport = () => {
    setExportLoading(true);
    setTimeout(() => {
      setExportLoading(false);
      toast.success(`Report exported: ${users.length} users`);
    }, 1500);
  };

  const handleReseed = () => {
    reseedAll();
    seedDemo.mutate();
    toast.success("Demo data reseeded");
  };

  const statsCards = [
    {
      label: "Total Users",
      value: String(users.length),
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "Active Users",
      value: String(users.filter((u) => u.status === "active").length),
      icon: ShieldAlert,
      color: "text-success",
    },
    {
      label: "System Status",
      value: isLocked ? "LOCKED" : "ONLINE",
      icon: Server,
      color: isLocked ? "text-destructive" : "text-success",
    },
    {
      label: "Pending Users",
      value: String(users.filter((u) => u.status === "pending").length),
      icon: Lock,
      color: "text-warning",
    },
  ];

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
            SecureGuard – Admin
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            Admin Panel
          </h1>
        </div>
        <div className="flex gap-2">
          <Button3D>
            <Button
              data-ocid="admin.add_user.open_modal_button"
              size="sm"
              className="h-8 text-xs bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
              variant="ghost"
              onClick={() => setAddUserOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add User
            </Button>
          </Button3D>
          <Button3D>
            <Button
              data-ocid="admin.export_report.button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-border text-muted-foreground hover:bg-accent/50"
              onClick={handleExportReport}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 mr-1.5" />
              )}
              {exportLoading ? "Exporting..." : "Export Report"}
            </Button>
          </Button3D>
        </div>
      </div>

      {/* Admin Shield + Stats */}
      <div className="flex gap-6 items-start">
        <Card className="bg-card border-border flex-shrink-0">
          <CardHeader className="pb-0 pt-4 px-4">
            <CardTitle className="text-[13px] font-semibold text-foreground text-center">
              Admin Shield
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center px-4 pb-4 gap-2">
            <AdminShield3D
              onClick={() =>
                toast.success("Elevated access mode activated for 5 minutes", {
                  duration: 3000,
                })
              }
            />
            <p className="text-[10px] text-muted-foreground text-center">
              Click shield for elevated access
            </p>
          </CardContent>
        </Card>
        <div className="flex-1 grid grid-cols-2 gap-3">
          {statsCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${card.color}`} />
                      <p className="text-[11px] text-muted-foreground">
                        {card.label}
                      </p>
                    </div>
                    <p className={`text-lg font-bold truncate ${card.color}`}>
                      {card.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* System Actions */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-[13px] font-semibold text-foreground">
            System Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-wrap gap-3">
          <Button3D>
            <Button
              data-ocid="admin.reseed_button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
              onClick={handleReseed}
              disabled={seedDemo.isPending}
            >
              <Database className="w-3.5 h-3.5 mr-1.5" />
              {seedDemo.isPending ? "Seeding..." : "Reseed Demo Data"}
            </Button>
          </Button3D>
          <Button3D>
            <Button
              data-ocid="admin.simulate_event_button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-warning/30 text-warning hover:bg-warning/10"
              onClick={handleSimulateEvent}
              disabled={addEvent.isPending}
            >
              <Siren className="w-3.5 h-3.5 mr-1.5" />
              {addEvent.isPending ? "Simulating..." : "Simulate Breach"}
            </Button>
          </Button3D>
          <Button3D>
            <Button
              data-ocid="admin.clear_logs_button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-border text-muted-foreground hover:bg-accent/50"
              onClick={() => setClearDialogOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear Logs
            </Button>
          </Button3D>
          {isLocked ? (
            <Button3D>
              <Button
                data-ocid="admin.unlock_button"
                size="sm"
                className="h-8 text-xs bg-success/20 text-success border border-success/30 hover:bg-success/30"
                variant="ghost"
                onClick={handleUnlock}
                disabled={unlockSystem.isPending}
              >
                <Unlock className="w-3.5 h-3.5 mr-1.5" />
                {unlockSystem.isPending ? "Unlocking..." : "Unlock System"}
              </Button>
            </Button3D>
          ) : (
            <Button3D>
              <Button
                data-ocid="admin.lock_button"
                size="sm"
                className="h-8 text-xs bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30"
                variant="ghost"
                onClick={() => setLockDialogOpen(true)}
              >
                <Lock className="w-3.5 h-3.5 mr-1.5" /> Lock System
              </Button>
            </Button3D>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-[13px] font-semibold text-foreground">
            User Management ({users.length} users)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[11px] text-muted-foreground">
                    User
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Role
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Access Level
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Department
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Last Login
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {users.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      data-ocid={`admin.user.item.${i + 1}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-border hover:bg-accent/20 transition-colors"
                    >
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-7 h-7 border border-border">
                            <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium text-foreground">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${roleBadgeClass(user.role)}`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${statusBadgeClass(user.status)}`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-xs text-muted-foreground">
                          {user.accessLevel}
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-xs text-muted-foreground">
                          {user.department}
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span className="text-[11px] text-muted-foreground">
                          {user.lastLogin}
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            animate={
                              keyAnimUser === user.id
                                ? { rotate: [0, -20, 20, -20, 0] }
                                : {}
                            }
                            transition={{ duration: 0.5 }}
                          >
                            <Button
                              data-ocid={`admin.grant_access.open_modal_button.${i + 1}`}
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-[10px] text-success hover:bg-success/10"
                              onClick={() => {
                                setGrantModalUser(user);
                                setGrantLevel(
                                  user.accessLevel === "Revoked" ||
                                    user.accessLevel === "None"
                                    ? "Read Only"
                                    : user.accessLevel,
                                );
                              }}
                              disabled={user.blocked}
                            >
                              <Key className="w-3 h-3 mr-1" /> Grant
                            </Button>
                          </motion.div>
                          <motion.div
                            animate={
                              lockAnimUser === user.id
                                ? {
                                    rotate: [0, 15, -15, 10, 0],
                                    scale: [1, 1.2, 1],
                                  }
                                : {}
                            }
                            transition={{ duration: 0.5 }}
                          >
                            <Button
                              data-ocid={`admin.revoke_access.button.${i + 1}`}
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-[10px] text-warning hover:bg-warning/10"
                              onClick={() => setRevokeModalUser(user)}
                              disabled={
                                user.accessLevel === "Revoked" ||
                                user.accessLevel === "None"
                              }
                            >
                              <Lock className="w-3 h-3 mr-1" /> Revoke
                            </Button>
                          </motion.div>
                          {user.blocked ? (
                            <Button
                              data-ocid={`admin.unblock_user.button.${i + 1}`}
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-[10px] text-primary hover:bg-primary/10"
                              onClick={() => handleUnblockUser(user)}
                            >
                              <UserCheck className="w-3 h-3 mr-1" /> Unblock
                            </Button>
                          ) : (
                            <Button
                              data-ocid={`admin.block_user.delete_button.${i + 1}`}
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-[10px] text-destructive hover:bg-destructive/10"
                              onClick={() => handleBlockUser(user)}
                            >
                              <UserX className="w-3 h-3 mr-1" /> Block
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Grant Access Modal */}
      <Dialog
        open={!!grantModalUser}
        onOpenChange={(o) => !o && setGrantModalUser(null)}
      >
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-success" /> Grant Access
            </DialogTitle>
          </DialogHeader>
          {grantModalUser && (
            <div className="py-2 space-y-3">
              <p className="text-sm text-muted-foreground">
                Granting access to{" "}
                <span className="text-foreground font-medium">
                  {grantModalUser.name}
                </span>
              </p>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Access Level
                </Label>
                <Select value={grantLevel} onValueChange={setGrantLevel}>
                  <SelectTrigger
                    data-ocid="admin.grant_access.select"
                    className="mt-1.5 bg-secondary border-border text-foreground h-9 text-xs"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {[
                      "Read Only",
                      "Read/Write",
                      "Read/Encrypt",
                      "Full Access",
                    ].map((l) => (
                      <SelectItem
                        key={l}
                        value={l}
                        className="text-xs text-foreground"
                      >
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button3D>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGrantModalUser(null)}
                className="border-border text-muted-foreground"
              >
                Cancel
              </Button>
            </Button3D>
            <Button3D>
              <Button
                data-ocid="admin.grant_access.confirm_button"
                size="sm"
                onClick={handleGrantAccess}
                className="bg-success/20 text-success border border-success/30 hover:bg-success/30"
              >
                <Key className="w-3.5 h-3.5 mr-1.5" /> Grant Access
              </Button>
            </Button3D>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Access Modal */}
      <Dialog
        open={!!revokeModalUser}
        onOpenChange={(o) => !o && setRevokeModalUser(null)}
      >
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-warning" /> Revoke Access
            </DialogTitle>
          </DialogHeader>
          {revokeModalUser && (
            <p className="text-sm text-muted-foreground py-2">
              Are you sure you want to revoke all access from{" "}
              <span className="text-foreground font-medium">
                {revokeModalUser.name}
              </span>
              ?
            </p>
          )}
          <DialogFooter>
            <Button3D>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevokeModalUser(null)}
                className="border-border text-muted-foreground"
              >
                Cancel
              </Button>
            </Button3D>
            <Button3D>
              <Button
                data-ocid="admin.revoke_access.confirm_button"
                size="sm"
                onClick={handleRevokeAccess}
                className="bg-warning/20 text-warning border border-warning/30 hover:bg-warning/30"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5" /> Confirm Revoke
              </Button>
            </Button3D>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs text-muted-foreground">Full Name</Label>
              <Input
                data-ocid="admin.add_user.name.input"
                className="mt-1 bg-secondary border-border text-foreground"
                placeholder="John Doe"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                data-ocid="admin.add_user.email.input"
                className="mt-1 bg-secondary border-border text-foreground"
                placeholder="user@secureguard.mil"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger
                  data-ocid="admin.add_user.role.select"
                  className="mt-1 bg-secondary border-border text-foreground h-9 text-xs"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {["ADMIN", "ANALYST", "OPERATOR", "GUEST"].map((r) => (
                    <SelectItem
                      key={r}
                      value={r}
                      className="text-xs text-foreground"
                    >
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Department
              </Label>
              <Input
                data-ocid="admin.add_user.dept.input"
                className="mt-1 bg-secondary border-border text-foreground"
                placeholder="e.g. Intel, Operations"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button3D>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddUserOpen(false)}
                className="border-border text-muted-foreground"
              >
                Cancel
              </Button>
            </Button3D>
            <Button3D>
              <Button
                data-ocid="admin.add_user.submit_button"
                size="sm"
                onClick={handleAddUser}
                className="bg-primary text-primary-foreground"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add User
              </Button>
            </Button3D>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lock System Dialog */}
      <Dialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Lock System</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="text-xs text-muted-foreground">Lock Reason</Label>
            <Input
              className="mt-1.5 bg-secondary border-border text-foreground"
              placeholder="e.g. Security incident, maintenance..."
              value={lockReason}
              onChange={(e) => setLockReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button3D>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLockDialogOpen(false)}
                className="border-border text-muted-foreground"
              >
                Cancel
              </Button>
            </Button3D>
            <Button3D>
              <Button
                data-ocid="admin.lock.confirm_button"
                size="sm"
                onClick={handleLock}
                disabled={lockSystem.isPending}
                className="bg-destructive text-destructive-foreground"
              >
                {lockSystem.isPending ? "Locking..." : "Lock System"}
              </Button>
            </Button3D>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Logs Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Clear All Logs?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            This will permanently delete all event logs. This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button3D>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClearDialogOpen(false)}
                className="border-border text-muted-foreground"
              >
                Cancel
              </Button>
            </Button3D>
            <Button3D>
              <Button
                data-ocid="admin.clear_logs.confirm_button"
                size="sm"
                onClick={handleClearLogs}
                disabled={clearLogs.isPending}
                className="bg-destructive text-destructive-foreground"
              >
                {clearLogs.isPending ? "Clearing..." : "Clear Logs"}
              </Button>
            </Button3D>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
