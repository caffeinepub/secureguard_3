import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Key,
  Lock,
  Shield,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppState } from "../context/AppStateContext";

const PERMISSION_LIST = [
  "Read",
  "Write",
  "Encrypt",
  "Backup",
  "Admin",
] as const;
type Permission = (typeof PERMISSION_LIST)[number];

const PERM_COLORS: Record<Permission, string> = {
  Read: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  Write: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Encrypt: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  Backup: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Admin: "bg-red-500/15 text-red-400 border-red-500/25",
};

export function AccessControl() {
  const { users, setUsers } = useAppState();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const adminUser = users.find((u) => u.role === "ADMIN");

  const togglePermission = (userId: string, perm: Permission) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    if (user.role === "ADMIN") {
      toast.error("Cannot modify admin permissions");
      return;
    }
    const hasPerm = user.permissions.includes(perm);
    const updated = hasPerm
      ? user.permissions.filter((p) => p !== perm)
      : [...user.permissions, perm];
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, permissions: updated } : u)),
    );
    toast.success(
      `${perm} permission ${hasPerm ? "revoked from" : "granted to"} ${user.name}`,
    );
  };

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
        <Shield size={20} style={{ color: "#00d4ff" }} />
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
          ACCESS CONTROL
        </h1>
        <Badge
          variant="outline"
          className="text-xs font-mono border-cyan-500/20 text-cyan-400"
        >
          {users.length} SUBJECTS
        </Badge>
      </div>

      {/* Admin info card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className="mb-6"
          style={{
            background: "rgba(0,212,255,0.04)",
            borderColor: "rgba(0,212,255,0.2)",
          }}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <ShieldCheck size={32} style={{ color: "#00d4ff" }} />
            <div>
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#00d4ff",
                  margin: 0,
                  letterSpacing: "0.1em",
                }}
              >
                ADMINISTRATOR: {adminUser?.name ?? "ku"}
              </p>
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.6rem",
                  color: "rgba(0,212,255,0.5)",
                  margin: "3px 0 0",
                }}
              >
                Only admin can grant or revoke access permissions for all users.
              </p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {PERMISSION_LIST.map((p) => (
                <Badge
                  key={p}
                  variant="outline"
                  className={`text-xs font-mono ${PERM_COLORS[p]}`}
                >
                  {p}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User permissions grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {users.map((user, i) => {
          const isAdmin = user.role === "ADMIN";
          const isBlocked = user.blocked;
          const isSelected = selectedUserId === user.id;
          return (
            <motion.div
              key={user.id}
              data-ocid={`access.item.${i + 1}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
            >
              <Card
                className="cursor-pointer transition-all duration-200"
                style={{
                  background: isAdmin
                    ? "rgba(0,212,255,0.06)"
                    : isBlocked
                      ? "rgba(255,0,64,0.04)"
                      : "rgba(5,5,30,0.7)",
                  borderColor: isAdmin
                    ? "rgba(0,212,255,0.25)"
                    : isBlocked
                      ? "rgba(255,0,64,0.25)"
                      : "rgba(255,255,255,0.05)",
                }}
                onClick={() => setSelectedUserId(isSelected ? null : user.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: isAdmin
                          ? "rgba(0,212,255,0.15)"
                          : "rgba(124,58,237,0.15)",
                        border: `1px solid ${isAdmin ? "rgba(0,212,255,0.3)" : "rgba(124,58,237,0.3)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: isAdmin ? "#00d4ff" : "#c084fc",
                      }}
                    >
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "rgba(224,224,255,0.9)",
                          margin: 0,
                        }}
                      >
                        {user.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.58rem",
                          color: "rgba(224,224,255,0.35)",
                          margin: 0,
                        }}
                      >
                        {user.email}
                      </p>
                    </div>
                    {isBlocked ? (
                      <XCircle size={16} style={{ color: "#ff0040" }} />
                    ) : isAdmin ? (
                      <ShieldCheck size={16} style={{ color: "#00d4ff" }} />
                    ) : (
                      <CheckCircle
                        size={16}
                        style={{ color: "rgba(0,255,136,0.6)" }}
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 12,
                    }}
                  >
                    {user.permissions.length > 0 ? (
                      user.permissions.map((p) => (
                        <Badge
                          key={p}
                          variant="outline"
                          className={`text-xs font-mono ${PERM_COLORS[p as Permission] ?? "bg-white/5 text-white/50"}`}
                        >
                          {p}
                        </Badge>
                      ))
                    ) : (
                      <span
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.6rem",
                          color: "rgba(224,224,255,0.2)",
                        }}
                      >
                        NO PERMISSIONS
                      </span>
                    )}
                  </div>

                  {/* Permission toggles (expanded) */}
                  {isSelected && !isAdmin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{
                        borderTop: "1px solid rgba(0,212,255,0.08)",
                        paddingTop: 10,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.58rem",
                          color: "rgba(0,212,255,0.5)",
                          letterSpacing: "0.15em",
                          marginBottom: 8,
                        }}
                      >
                        TOGGLE PERMISSIONS:
                      </p>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
                      >
                        {PERMISSION_LIST.filter((p) => p !== "Admin").map(
                          (perm) => {
                            const has = user.permissions.includes(perm);
                            return (
                              <Button
                                key={perm}
                                data-ocid="access.toggle"
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePermission(user.id, perm);
                                }}
                                className={`text-xs font-mono h-7 ${
                                  has
                                    ? PERM_COLORS[perm]
                                    : "border-white/10 text-white/30 hover:bg-white/5"
                                }`}
                              >
                                {has ? (
                                  <Key size={10} className="mr-1" />
                                ) : (
                                  <Lock size={10} className="mr-1" />
                                )}
                                {perm}
                              </Button>
                            );
                          },
                        )}
                      </div>
                      {isBlocked && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 8,
                            padding: "6px 10px",
                            background: "rgba(255,0,64,0.08)",
                            border: "1px solid rgba(255,0,64,0.2)",
                            borderRadius: 6,
                          }}
                        >
                          <AlertTriangle
                            size={12}
                            style={{ color: "#ff0040" }}
                          />
                          <span
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "0.6rem",
                              color: "rgba(255,0,64,0.7)",
                            }}
                          >
                            USER IS BLOCKED — Unblock from Admin Panel
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: 32,
          padding: "16px 20px",
          background: "rgba(5,5,30,0.7)",
          border: "1px solid rgba(0,212,255,0.08)",
          borderRadius: 10,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "rgba(0,212,255,0.5)",
            margin: 0,
          }}
        >
          PERMISSION LEGEND:
        </p>
        {PERMISSION_LIST.map((p) => (
          <div
            key={p}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Badge
              variant="outline"
              className={`text-xs font-mono ${PERM_COLORS[p]}`}
            >
              {p}
            </Badge>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.58rem",
                color: "rgba(224,224,255,0.3)",
              }}
            >
              {p === "Read" && "View files/logs"}
              {p === "Write" && "Upload/edit files"}
              {p === "Encrypt" && "Encrypt/shard files"}
              {p === "Backup" && "Create/restore backups"}
              {p === "Admin" && "Full system control"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
