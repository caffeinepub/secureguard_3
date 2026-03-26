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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  Download,
  HardDrive,
  Loader2,
  Plus,
  RotateCcw,
  Shield,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button3D } from "../components/Button3D";
import { useAppState } from "../context/AppStateContext";
import type { SeedBackup } from "../utils/seedData";

function BackupNowAnimation({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center gap-3 py-4"
    >
      <div className="relative w-14 h-14">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          style={{ borderTopColor: "oklch(0.55 0.25 250)" }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-transparent"
          style={{ borderRightColor: "oklch(0.65 0.2 200)" }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <HardDrive className="w-5 h-5 text-primary" />
        </div>
      </div>
      <p className="text-xs text-primary font-medium tracking-wider">
        BACKING UP...
      </p>
      <motion.div
        className="w-48 h-1.5 bg-muted rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
        />
      </motion.div>
    </motion.div>
  );
}

export function Backups() {
  const { backups, setBackups, addLog, addNotification } = useAppState();
  const [backingUp, setBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SeedBackup | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleBackupNow = () => {
    setBackingUp(true);
    setBackupSuccess(false);
  };

  const handleBackupComplete = () => {
    const now = new Date();
    const name = `INCREMENTAL_${now.toISOString().split("T")[0]}_LIVE`;
    const newBackup: SeedBackup = {
      id: `b${Date.now()}`,
      name,
      type: "Incremental",
      size: `${(Math.random() * 400 + 100).toFixed(0)} MB`,
      status: "completed",
      createdAt: now.toISOString().slice(0, 16).replace("T", " "),
      files: Math.floor(Math.random() * 20) + 5,
      encrypted: true,
    };
    setBackups([newBackup, ...backups]);
    setBackingUp(false);
    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 3000);
    addLog({
      timestamp: now.toISOString().slice(0, 16).replace("T", " "),
      username: "ku",
      ip: "10.0.0.1",
      action: "Backup Completed",
      resource: name,
      type: "info",
    });
    addNotification({
      type: "backup",
      title: "Backup Complete",
      message: `${name} completed successfully`,
      timestamp: now.toISOString().slice(0, 16).replace("T", " "),
      read: false,
      priority: "success",
    });
    toast.success(`Backup complete: ${name}`);
  };

  const handleRestore = (backup: SeedBackup) => {
    setRestoringId(backup.id);
    setRestoreProgress(0);
    const interval = setInterval(() => {
      setRestoreProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setRestoringId(null);
          setRestoreProgress(0);
          addLog({
            timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
            username: "ku",
            ip: "10.0.0.1",
            action: "Backup Restored",
            resource: backup.name,
            type: "info",
          });
          toast.success(`Restored ${backup.files} files from ${backup.name}`);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const handleDownload = (backup: SeedBackup) => {
    setDownloadingId(backup.id);
    setTimeout(() => {
      setDownloadingId(null);
      toast.success(`Download complete: ${backup.name} (${backup.size})`);
    }, 1000);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setTimeout(() => {
      setBackups(backups.filter((b) => b.id !== deleteTarget.id));
      setDeletingId(null);
      addLog({
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        username: "ku",
        ip: "10.0.0.1",
        action: "Backup Deleted",
        resource: deleteTarget.name,
        type: "warning",
      });
      toast.warning(`Deleted backup: ${deleteTarget.name}`);
      setDeleteTarget(null);
    }, 400);
  };

  const totalSize = backups.length;
  const encryptedCount = backups.filter((b) => b.encrypted).length;

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
            SecureGuard – Backups
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            Backup Manager
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalSize} backups · {encryptedCount} encrypted
          </p>
        </div>
        <Button3D>
          <Button
            data-ocid="backups.backup_now.button"
            size="sm"
            className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleBackupNow}
            disabled={backingUp}
          >
            {backingUp ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5 mr-1.5" />
            )}
            {backingUp ? "Backing up..." : "Backup Now"}
          </Button>
        </Button3D>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Backups",
            value: String(backups.length),
            icon: HardDrive,
            color: "text-primary",
          },
          {
            label: "Encrypted",
            value: `${encryptedCount}/${backups.length}`,
            icon: Shield,
            color: "text-success",
          },
          {
            label: "Latest",
            value: backups[0]?.createdAt?.split(" ")[0] ?? "—",
            icon: CheckCircle,
            color: "text-warning",
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      {card.label}
                    </p>
                    <p className={`text-base font-bold ${card.color}`}>
                      {card.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Backup Now Animation */}
      <AnimatePresence>
        {backingUp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-card border-primary/30">
              <CardContent className="p-4">
                <BackupNowAnimation onComplete={handleBackupComplete} />
              </CardContent>
            </Card>
          </motion.div>
        )}
        {backupSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="bg-success/10 border-success/30">
              <CardContent className="p-4 flex items-center gap-3">
                <motion.div
                  animate={{ scale: [0.5, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-6 h-6 text-success" />
                </motion.div>
                <p className="text-sm font-semibold text-success">
                  Backup completed successfully!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backups Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-[13px] font-semibold text-foreground">
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Type
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Size
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Files
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Encrypted
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Created
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-[11px] text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {backups.map((backup, i) => (
                  <motion.tr
                    key={backup.id}
                    data-ocid={`backups.item.${i + 1}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: deletingId === backup.id ? 0 : 1,
                      scale: deletingId === backup.id ? 0.95 : 1,
                      x: 0,
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-border hover:bg-accent/20 transition-colors"
                  >
                    <TableCell className="py-2.5 text-xs font-mono text-foreground">
                      {backup.name}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${backup.type === "Full" ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border"}`}
                      >
                        {backup.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5 text-xs text-muted-foreground">
                      {backup.size}
                    </TableCell>
                    <TableCell className="py-2.5 text-xs text-muted-foreground">
                      {backup.files}
                    </TableCell>
                    <TableCell className="py-2.5">
                      {backup.encrypted ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-success/20 text-success border-success/30"
                        >
                          AES-256
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Plain
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5 text-[11px] text-muted-foreground font-mono">
                      {backup.createdAt}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-success/20 text-success border-success/30"
                      >
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-1">
                        {restoringId === backup.id ? (
                          <div className="flex items-center gap-2 w-32">
                            <Progress
                              value={restoreProgress}
                              className="h-1.5 flex-1"
                            />
                            <span className="text-[10px] text-primary">
                              {restoreProgress}%
                            </span>
                          </div>
                        ) : (
                          <Button
                            data-ocid={`backups.restore.button.${i + 1}`}
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[10px] text-success hover:bg-success/10"
                            onClick={() => handleRestore(backup)}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" /> Restore
                          </Button>
                        )}
                        <Button
                          data-ocid={`backups.download.button.${i + 1}`}
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-primary hover:bg-primary/10"
                          onClick={() => handleDownload(backup)}
                          disabled={downloadingId === backup.id}
                        >
                          {downloadingId === backup.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3 mr-1" />
                          )}
                          {downloadingId === backup.id ? "..." : "Download"}
                        </Button>
                        <Button
                          data-ocid={`backups.delete.delete_button.${i + 1}`}
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[10px] text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(backup)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent
          className="bg-card border-border"
          data-ocid="backups.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Delete Backup?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete{" "}
            <span className="text-foreground font-medium">
              {deleteTarget?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button3D>
              <Button
                data-ocid="backups.delete.cancel_button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                className="border-border text-muted-foreground"
              >
                Cancel
              </Button>
            </Button3D>
            <Button3D>
              <Button
                data-ocid="backups.delete.confirm_button"
                size="sm"
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
              </Button>
            </Button3D>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
