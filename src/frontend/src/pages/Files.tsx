import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  FolderLock,
  LayoutGrid,
  List,
  Lock,
  Scissors,
  Send,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button3D } from "../components/Button3D";
import { FileCard3D } from "../components/FileCard3D";
import { ShardCubes3D } from "../components/ShardCubes3D";
import { VaultDoor3D } from "../components/VaultDoor3D";
import { useAppState } from "../context/AppStateContext";
import type { SeedFile } from "../utils/seedData";

type RiskTag = "Safe" | "Suspicious" | "Critical";
type EncStatus = "ENCRYPTED" | "PENDING";

interface VaultFile {
  id: string;
  name: string;
  size: number;
  type: string;
  encryption: EncStatus;
  shards: number | null;
  uploadedAt: Date;
  uploadedBy: string;
  risk: RiskTag;
  progress: number;
  stage: "encrypting" | "sharding" | "done" | "pending";
  serverDest: string;
  keyHash: string;
  isSeedFile?: boolean;
}

function seedFileToVaultFile(f: SeedFile): VaultFile {
  const riskMap: Record<string, RiskTag> = {
    critical: "Critical",
    high: "Critical",
    medium: "Suspicious",
    low: "Safe",
  };
  return {
    id: f.id,
    name: f.name,
    size: f.sizeBytes,
    type: "",
    encryption: f.encrypted ? "ENCRYPTED" : "PENDING",
    shards: f.shards > 0 ? f.shards : null,
    uploadedAt: new Date(f.uploadedAt),
    uploadedBy: f.uploadedBy,
    risk: riskMap[f.riskLevel] ?? "Safe",
    progress: f.encrypted ? 100 : 0,
    stage: f.encrypted ? "done" : "pending",
    serverDest: f.serverDest,
    keyHash: f.keyHash,
    isSeedFile: true,
  };
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? ""))
    return <FileImage className="w-4 h-4 text-blue-400" />;
  if (["zip", "tar", "gz", "rar"].includes(ext ?? ""))
    return <FileArchive className="w-4 h-4 text-yellow-400" />;
  if (["txt", "md", "pdf", "doc", "docx"].includes(ext ?? ""))
    return <FileText className="w-4 h-4 text-green-400" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function randomRisk(): RiskTag {
  const r = Math.random();
  if (r < 0.6) return "Safe";
  if (r < 0.85) return "Suspicious";
  return "Critical";
}

export function Files() {
  const { files: seedFiles, addLog, addNotification } = useAppState();

  const [uploadedFiles, setUploadedFiles] = useState<VaultFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [encryptingId, setEncryptingId] = useState<string | null>(null);
  const [localSeedFiles, setLocalSeedFiles] = useState<VaultFile[]>(() =>
    seedFiles.map(seedFileToVaultFile),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const allFiles = [...localSeedFiles, ...uploadedFiles];

  const processFiles = useCallback(
    (rawFiles: FileList) => {
      const newEntries: VaultFile[] = Array.from(rawFiles).map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: f.name,
        size: f.size,
        type: f.type,
        encryption: "PENDING" as EncStatus,
        shards: null,
        uploadedAt: new Date(),
        uploadedBy: "ku",
        risk: randomRisk(),
        progress: 0,
        stage: "pending" as const,
        serverDest: "—",
        keyHash: "",
      }));
      setUploadedFiles((prev) => [...prev, ...newEntries]);
      setVaultOpen(true);
      for (const entry of newEntries) simulatePipeline(entry.id);
      addLog({
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        username: "ku",
        ip: "10.0.0.1",
        action: "File Upload",
        resource: newEntries.map((f) => f.name).join(", "),
        type: "info",
      });
    },
    [addLog],
  );

  const simulatePipeline = (id: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, stage: "encrypting", progress: 5 } : f,
      ),
    );
    const steps = [
      { delay: 300, progress: 20, stage: "encrypting" as const },
      { delay: 700, progress: 50, stage: "encrypting" as const },
      { delay: 1100, progress: 55, stage: "sharding" as const },
      { delay: 1500, progress: 80, stage: "sharding" as const },
      {
        delay: 2000,
        progress: 100,
        stage: "done" as const,
        encryption: "ENCRYPTED" as const,
        shards: 3,
      },
    ];
    for (const step of steps) {
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  progress: step.progress,
                  stage: step.stage,
                  ...("encryption" in step
                    ? { encryption: step.encryption }
                    : {}),
                  ...("shards" in step ? { shards: step.shards } : {}),
                }
              : f,
          ),
        );
      }, step.delay);
    }
  };

  const handleEncryptSeedFile = (file: VaultFile) => {
    setEncryptingId(file.id);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setLocalSeedFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? {
                ...f,
                progress,
                stage:
                  progress < 60
                    ? ("encrypting" as const)
                    : ("sharding" as const),
              }
            : f,
        ),
      );
      if (progress >= 100) {
        clearInterval(interval);
        setLocalSeedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  progress: 100,
                  stage: "done" as const,
                  encryption: "ENCRYPTED",
                  shards: Math.floor(Math.random() * 6) + 2,
                  serverDest: "MIL-SERVER-01",
                  keyHash: Math.random().toString(16).slice(2, 18),
                }
              : f,
          ),
        );
        setEncryptingId(null);
        addLog({
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          username: "ku",
          ip: "10.0.0.1",
          action: "File Encrypted",
          resource: file.name,
          type: "info",
        });
        addNotification({
          type: "file",
          title: "File Encrypted",
          message: `${file.name} encrypted and transmitted to MIL-SERVER-01`,
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          read: false,
          priority: "success",
        });
        toast.success(`${file.name} encrypted and sent to server`);
      }
    }, 150);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleShard = (id: string) => {
    const update = (prev: VaultFile[]) =>
      prev.map((f) =>
        f.id === id && f.stage === "done"
          ? { ...f, shards: (f.shards ?? 0) + 3 }
          : f,
      );
    setLocalSeedFiles((prev) => update(prev));
    setUploadedFiles((prev) => update(prev));
    toast.success("File sharded into 3 additional fragments");
  };

  const handleDownload = (name: string) =>
    toast.success(`Downloading ${name}...`);

  const confirmDelete = (id: string, name: string) =>
    setDeleteTarget({ id, name });

  const executeDelete = () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setDeleteTarget(null);
    setDeletingId(id);
    setTimeout(() => {
      setLocalSeedFiles((prev) => prev.filter((f) => f.id !== id));
      setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
      setDeletingId(null);
      addLog({
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        username: "ku",
        ip: "10.0.0.1",
        action: "File Deleted",
        resource: name,
        type: "warning",
      });
      toast.success(`${name} deleted from vault`);
    }, 600);
  };

  const encryptedCount = allFiles.filter(
    (f) => f.encryption === "ENCRYPTED",
  ).length;
  const shardedCount = allFiles.filter(
    (f) => f.shards !== null && f.shards > 0,
  ).length;
  const hasShards = allFiles.some((f) => f.shards && f.shards > 0);

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete from Vault?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              <span className="font-semibold text-destructive">
                {deleteTarget?.name}
              </span>{" "}
              will be permanently destroyed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-muted-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={executeDelete}
            >
              Destroy File
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
            SecureGuard — AES-256 Protected
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5 flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-primary" /> Secure File Vault
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            All files encrypted at rest · Zero plaintext storage
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Badge className="border border-border bg-card text-foreground text-xs px-3 py-1">
            <Shield className="w-3 h-3 mr-1.5 text-primary" />
            {allFiles.length} Files
          </Badge>
          <Badge className="border border-success/30 bg-success/10 text-success text-xs px-3 py-1">
            <Lock className="w-3 h-3 mr-1.5" />
            {encryptedCount} Encrypted
          </Badge>
          <Badge className="border border-warning/30 bg-warning/10 text-warning text-xs px-3 py-1">
            <Scissors className="w-3 h-3 mr-1.5" />
            {shardedCount} Sharded
          </Badge>
          <div className="flex items-center gap-1 ml-2">
            <Button3D>
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                className="h-7 w-7 p-0"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </Button>
            </Button3D>
            <Button3D>
              <Button
                size="sm"
                variant={viewMode === "table" ? "default" : "ghost"}
                className="h-7 w-7 p-0"
                onClick={() => setViewMode("table")}
              >
                <List className="w-3.5 h-3.5" />
              </Button>
            </Button3D>
          </div>
        </div>
      </div>

      {/* Vault Door */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" /> Vault Access Control
            </CardTitle>
            <Button3D>
              <Button
                size="sm"
                onClick={() => setVaultOpen((o) => !o)}
                className={`h-8 text-xs font-semibold tracking-wider ${vaultOpen ? "bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30" : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"}`}
                variant="ghost"
              >
                {vaultOpen ? "🔓 CLOSE VAULT" : "🔐 OPEN VAULT"}
              </Button>
            </Button3D>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <VaultDoor3D
            isOpen={vaultOpen}
            onToggle={() => setVaultOpen((o) => !o)}
          />
          {vaultOpen && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-[11px] text-success tracking-widest mt-2 font-mono"
            >
              ✓ VAULT OPEN — AUTHENTICATED ACCESS GRANTED
            </motion.p>
          )}
        </CardContent>
      </Card>

      {/* Upload Zone */}
      <div
        data-ocid="files.dropzone"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${isDragging ? "border-primary bg-primary/10 scale-[1.01]" : "border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5"}`}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 w-full cursor-pointer py-10 bg-transparent"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              {isDragging
                ? "Release to encrypt & upload"
                : "Drop classified files here or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Files are encrypted with AES-256 before storage
            </p>
          </div>
          <Button3D>
            <span
              data-ocid="files.upload_button"
              className="inline-flex items-center text-xs h-8 px-4 border border-primary/50 text-primary rounded-md bg-primary/10 font-semibold tracking-wide"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" /> Select Files to Encrypt
            </span>
          </Button3D>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Shard Cubes */}
      <AnimatePresence>
        {hasShards && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-[13px] font-semibold text-foreground flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-warning" /> File Sharding
                  Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <ShardCubes3D />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vault Contents */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-[13px] font-semibold text-foreground">
            Vault Contents ({allFiles.length} files)
          </CardTitle>
        </CardHeader>
        <CardContent className={viewMode === "grid" ? "p-4" : "p-0"}>
          {allFiles.length === 0 ? (
            <div
              data-ocid="files.empty_state"
              className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground"
            >
              <FolderLock className="w-12 h-12 opacity-30" />
              <p className="text-sm">Vault is empty</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="flex flex-wrap gap-4">
              {allFiles.map((file, idx) => (
                <AnimatePresence key={file.id}>
                  {deletingId === file.id ? (
                    <motion.div
                      key={`del-${file.id}`}
                      animate={{
                        scale: [1, 1.1, 0],
                        rotate: [0, 15, -15, 0],
                        opacity: [1, 0.8, 0],
                      }}
                      transition={{ duration: 0.6 }}
                      style={{ width: 200, height: 180 }}
                      className="rounded-xl bg-destructive/20 border border-destructive/30"
                    />
                  ) : (
                    <FileCard3D
                      key={file.id}
                      name={file.name}
                      size={formatBytes(file.size)}
                      encryption={file.encryption}
                      shards={file.shards}
                      risk={file.risk}
                      stage={file.stage}
                      index={idx}
                      onShard={() => handleShard(file.id)}
                      onDelete={() => confirmDelete(file.id, file.name)}
                    />
                  )}
                </AnimatePresence>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[11px] text-muted-foreground py-2 px-4 w-8" />
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Filename
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Size
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Owner
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Encryption
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Shards
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Server
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Risk
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground py-2">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allFiles.map((file, idx) => (
                  <motion.tr
                    key={file.id}
                    data-ocid={`files.item.${idx + 1}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      deletingId === file.id
                        ? { opacity: 0, scale: 0.8, x: 40 }
                        : { opacity: 1, x: 0 }
                    }
                    transition={{
                      duration: deletingId === file.id ? 0.5 : 0.25,
                      delay: idx * 0.04,
                    }}
                    className="border-border hover:bg-accent/30"
                  >
                    <TableCell className="py-2 px-4">
                      {getFileIcon(file.name)}
                    </TableCell>
                    <TableCell className="py-2">
                      <div>
                        <p className="text-xs font-medium text-foreground truncate max-w-[200px]">
                          {file.name}
                        </p>
                        {file.stage !== "done" && (
                          <div className="mt-1">
                            <p className="text-[10px] text-primary mb-0.5">
                              {file.stage === "encrypting"
                                ? "Encrypting (AES-256)..."
                                : file.stage === "sharding"
                                  ? "Sharding..."
                                  : "Pending..."}
                            </p>
                            <Progress
                              value={file.progress}
                              className="h-1 w-32"
                            />
                          </div>
                        )}
                        {file.stage === "done" && file.keyHash && (
                          <p className="text-[9px] font-mono text-muted-foreground/50 mt-0.5 truncate max-w-[200px]">
                            🔑 {file.keyHash}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground py-2">
                      {formatBytes(file.size)}
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground py-2">
                      {file.uploadedBy}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        className={`text-[10px] px-1.5 border ${file.encryption === "ENCRYPTED" ? "bg-success/15 text-success border-success/30" : "bg-warning/15 text-warning border-warning/30"}`}
                      >
                        {file.encryption}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">
                          {file.shards ? `${file.shards} shards` : "—"}
                        </span>
                        {file.stage === "done" &&
                          file.encryption === "ENCRYPTED" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 px-1.5 text-[10px] text-primary hover:bg-primary/10"
                              onClick={() => handleShard(file.id)}
                            >
                              <Scissors className="w-2.5 h-2.5 mr-0.5" /> Shard
                            </Button>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground py-2 font-mono">
                      {file.serverDest}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        className={`text-[10px] px-1.5 border ${file.risk === "Critical" ? "bg-destructive/15 text-destructive border-destructive/30" : file.risk === "Suspicious" ? "bg-warning/15 text-warning border-warning/30" : "bg-success/15 text-success border-success/30"}`}
                      >
                        {file.risk.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        {file.encryption === "PENDING" && (
                          <Button
                            data-ocid={`files.encrypt.button.${idx + 1}`}
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[10px] text-success hover:bg-success/10"
                            onClick={() => handleEncryptSeedFile(file)}
                            disabled={encryptingId === file.id}
                          >
                            <Lock className="w-3 h-3 mr-1" />
                            {encryptingId === file.id ? "Enc..." : "Encrypt"}
                          </Button>
                        )}
                        {file.stage === "done" && (
                          <Button
                            data-ocid={`files.transmit.button.${idx + 1}`}
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-[10px] text-primary hover:bg-primary/10"
                            onClick={() =>
                              toast.success(
                                `Transmitting ${file.name} to ${file.serverDest}...`,
                              )
                            }
                          >
                            <Send className="w-3 h-3 mr-1" /> Send
                          </Button>
                        )}
                        <Button
                          data-ocid={`files.download.button.${idx + 1}`}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => handleDownload(file.name)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          data-ocid={`files.delete_button.${idx + 1}`}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => confirmDelete(file.id, file.name)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
