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
import { Download, Eye, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button3D } from "../components/Button3D";
import { useAppState } from "../context/AppStateContext";

const TYPE_COLORS: Record<string, string> = {
  info: "bg-primary/20 text-primary border-primary/30",
  warning: "bg-warning/20 text-warning border-warning/30",
  error: "bg-destructive/20 text-destructive border-destructive/30",
  critical: "bg-destructive/30 text-destructive border-destructive/50",
};

export function Logs() {
  const { logs, setLogs } = useAppState();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [revealed, setRevealed] = useState(true);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const allUsernames = useMemo(() => {
    const names = [...new Set(logs.map((l) => l.username))];
    return names.sort();
  }, [logs]);

  const filtered = useMemo(() => {
    let list = [...logs];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.username.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.ip.toLowerCase().includes(q) ||
          l.resource.toLowerCase().includes(q),
      );
    }
    if (typeFilter !== "all") list = list.filter((l) => l.type === typeFilter);
    if (userFilter !== "all")
      list = list.filter((l) => l.username === userFilter);
    return list;
  }, [logs, search, typeFilter, userFilter]);

  const handleViewLogs = () => {
    setRevealed(false);
    setTimeout(() => setRevealed(true), 50);
    toast.info(`Showing ${filtered.length} log entries`);
  };

  const handleExport = () => {
    setExportLoading(true);
    setTimeout(() => {
      setExportLoading(false);
      toast.success(`Logs exported (${filtered.length} entries)`);
    }, 1200);
  };

  const handleClearLogs = () => {
    setLogs([]);
    setClearDialogOpen(false);
    toast.info("All logs cleared");
  };

  const typeCounts = useMemo(
    () => ({
      critical: logs.filter((l) => l.type === "critical").length,
      warning: logs.filter((l) => l.type === "warning").length,
      error: logs.filter((l) => l.type === "error").length,
      info: logs.filter((l) => l.type === "info").length,
    }),
    [logs],
  );

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground tracking-widest uppercase">
            SecureGuard – Logs
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            System Logs
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {logs.length} total entries · {typeCounts.critical} critical ·{" "}
            {typeCounts.warning} warnings
          </p>
        </div>
        <div className="flex gap-2">
          <Button3D>
            <Button
              data-ocid="logs.view_logs.button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
              onClick={handleViewLogs}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Refresh View
            </Button>
          </Button3D>
          <Button3D>
            <Button
              data-ocid="logs.export.button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-border text-muted-foreground hover:bg-accent/50"
              onClick={handleExport}
              disabled={exportLoading}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              {exportLoading ? "Exporting..." : "Export Logs"}
            </Button>
          </Button3D>
          <Button3D>
            <Button
              data-ocid="logs.clear.open_modal_button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => setClearDialogOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear Logs
            </Button>
          </Button3D>
        </div>
      </div>

      {/* Summary Badges */}
      <div className="flex gap-2 flex-wrap">
        {(
          [
            {
              label: "Info",
              count: typeCounts.info,
              cls: "bg-primary/10 text-primary border-primary/20",
            },
            {
              label: "Warning",
              count: typeCounts.warning,
              cls: "bg-warning/10 text-warning border-warning/20",
            },
            {
              label: "Error",
              count: typeCounts.error,
              cls: "bg-destructive/10 text-destructive border-destructive/20",
            },
            {
              label: "Critical",
              count: typeCounts.critical,
              cls: "bg-destructive/20 text-destructive border-destructive/40",
            },
          ] as const
        ).map((item) => (
          <motion.div
            key={item.label}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setTypeFilter(
                typeFilter === item.label.toLowerCase()
                  ? "all"
                  : item.label.toLowerCase(),
              )
            }
            className="cursor-pointer"
          >
            <Badge
              variant="outline"
              className={`text-[11px] px-3 py-1 cursor-pointer ${item.cls} ${typeFilter === item.label.toLowerCase() ? "ring-1 ring-current" : ""}`}
            >
              {item.label}: {item.count}
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            data-ocid="logs.search.input"
            className="pl-8 h-8 bg-secondary border-border text-foreground text-xs"
            placeholder="Search username, action, IP, resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger
            data-ocid="logs.type_filter.select"
            className="h-8 bg-secondary border-border text-foreground text-xs w-36"
          >
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-xs text-foreground">
              All Types
            </SelectItem>
            <SelectItem value="info" className="text-xs text-foreground">
              Info
            </SelectItem>
            <SelectItem value="warning" className="text-xs text-foreground">
              Warning
            </SelectItem>
            <SelectItem value="error" className="text-xs text-foreground">
              Error
            </SelectItem>
            <SelectItem value="critical" className="text-xs text-foreground">
              Critical
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger
            data-ocid="logs.user_filter.select"
            className="h-8 bg-secondary border-border text-foreground text-xs w-40"
          >
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-xs text-foreground">
              All Users
            </SelectItem>
            {allUsernames.map((u) => (
              <SelectItem key={u} value={u} className="text-xs text-foreground">
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-[13px] font-semibold text-foreground">
            {filtered.length} {typeFilter !== "all" ? typeFilter : ""}{" "}
            {userFilter !== "all" ? `· ${userFilter}` : ""} entries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[11px] text-muted-foreground w-36">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground w-28">
                    User
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground w-28">
                    IP Address
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Action
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground">
                    Resource
                  </TableHead>
                  <TableHead className="text-[11px] text-muted-foreground w-20">
                    Type
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {revealed &&
                    filtered.map((log, i) => (
                      <motion.tr
                        key={log.id}
                        data-ocid={`logs.item.${i + 1}`}
                        initial={{ opacity: 0, x: -8, rotateX: 15 }}
                        animate={{ opacity: 1, x: 0, rotateX: 0 }}
                        transition={{ delay: Math.min(i * 0.025, 0.5) }}
                        whileHover={{
                          scale: 1.005,
                          translateZ: 4,
                          backgroundColor: "oklch(0.22 0.03 240 / 0.6)",
                        }}
                        style={{ perspective: 800, cursor: "default" }}
                        className="border-border transition-colors"
                      >
                        <TableCell className="py-2 text-[11px] font-mono text-muted-foreground">
                          {log.timestamp}
                        </TableCell>
                        <TableCell className="py-2 text-[11px] font-medium text-foreground">
                          {log.username}
                        </TableCell>
                        <TableCell className="py-2 text-[11px] font-mono text-muted-foreground">
                          {log.ip}
                        </TableCell>
                        <TableCell className="py-2 text-[11px] text-foreground">
                          {log.action}
                        </TableCell>
                        <TableCell className="py-2 text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {log.resource}
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${TYPE_COLORS[log.type] ?? ""}`}
                          >
                            {log.type}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground text-xs"
                      data-ocid="logs.empty_state"
                    >
                      No log entries match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Clear Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent
          className="bg-card border-border"
          data-ocid="logs.clear.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Clear All Logs?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            This will permanently delete all {logs.length} log entries. This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button3D>
              <Button
                data-ocid="logs.clear.cancel_button"
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
                data-ocid="logs.clear.confirm_button"
                size="sm"
                onClick={handleClearLogs}
                className="bg-destructive text-destructive-foreground"
              >
                Clear All Logs
              </Button>
            </Button3D>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
