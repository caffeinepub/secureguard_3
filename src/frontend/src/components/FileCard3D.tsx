import { Badge } from "@/components/ui/badge";
import { File, Lock, Scissors } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type RiskTag = "Safe" | "Suspicious" | "Critical";
type EncStatus = "ENCRYPTED" | "PENDING";

interface FileCard3DProps {
  name: string;
  size: string;
  encryption: EncStatus;
  shards: number | null;
  risk: RiskTag;
  stage: string;
  onDelete?: () => void;
  onShard?: () => void;
  index?: number;
}

function riskColor(r: RiskTag) {
  if (r === "Critical")
    return {
      bg: "bg-destructive/15",
      text: "text-destructive",
      border: "border-destructive/30",
    };
  if (r === "Suspicious")
    return {
      bg: "bg-warning/15",
      text: "text-warning",
      border: "border-warning/30",
    };
  return {
    bg: "bg-success/15",
    text: "text-success",
    border: "border-success/30",
  };
}

export function FileCard3D({
  name,
  size,
  encryption,
  shards,
  risk,
  stage,
  onDelete,
  onShard,
  index = 0,
}: FileCard3DProps) {
  const [flipped, setFlipped] = useState(false);
  const rc = riskColor(risk);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.45,
        type: "spring",
        stiffness: 200,
      }}
      style={{ perspective: 1000, width: 200, height: 180, cursor: "pointer" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: 0.55,
          type: "spring",
          stiffness: 150,
          damping: 18,
        }}
        style={{
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Front */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className="absolute inset-0 rounded-xl border border-border bg-card p-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <File className="w-5 h-5 text-primary" />
            </div>
            <Badge
              className={`text-[10px] px-1.5 border ${rc.bg} ${rc.text} ${rc.border}`}
            >
              {risk}
            </Badge>
          </div>
          <div>
            <p
              className="text-xs font-semibold text-foreground truncate"
              title={name}
            >
              {name}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{size}</p>
          </div>
          <div className="flex items-center justify-between">
            <Badge
              className={`text-[10px] px-1.5 border ${
                encryption === "ENCRYPTED"
                  ? "bg-success/15 text-success border-success/30"
                  : "bg-warning/15 text-warning border-warning/30"
              }`}
            >
              {encryption}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              click to flip
            </span>
          </div>
        </div>
        {/* Back */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold text-primary tracking-widest">
                ENCRYPTION DETAILS
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Algorithm:{" "}
              <span className="text-foreground font-mono">AES-256-GCM</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Status:{" "}
              <span
                className={
                  encryption === "ENCRYPTED"
                    ? "text-success font-bold"
                    : "text-warning font-bold"
                }
              >
                {encryption}
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Shards:{" "}
              <span className="text-foreground font-mono">{shards ?? 0}</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Stage: <span className="text-foreground font-mono">{stage}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {encryption === "ENCRYPTED" && onShard && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShard();
                }}
                className="text-[10px] px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 flex items-center gap-1"
              >
                <Scissors className="w-2.5 h-2.5" /> Shard
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-[10px] px-2 py-1 rounded bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
