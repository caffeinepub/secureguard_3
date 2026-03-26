import { Activity } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRisk } from "../contexts/RiskContext";
import { getRiskColor } from "../utils/riskCalculator";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export function ActivityLog() {
  const { events } = useRisk();

  return (
    <div
      style={{
        background: "rgba(5, 5, 30, 0.6)",
        border: "1px solid rgba(0,212,255,0.1)",
        borderRadius: 8,
        padding: "1rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          paddingBottom: 10,
          borderBottom: "1px solid rgba(0,212,255,0.08)",
        }}
      >
        <Activity size={14} style={{ color: "rgba(0,212,255,0.7)" }} />
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "rgba(0,212,255,0.7)",
          }}
        >
          ACTIVITY LOG
        </span>
        <span
          style={{
            marginLeft: "auto",
            background: "rgba(0,212,255,0.1)",
            borderRadius: 100,
            padding: "2px 8px",
            fontSize: "0.6rem",
            fontFamily: "JetBrains Mono, monospace",
            color: "rgba(0,212,255,0.6)",
          }}
        >
          {events.length} EVENTS
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          paddingRight: 4,
        }}
      >
        {events.length === 0 ? (
          <div
            data-ocid="activity.empty_state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              color: "rgba(224,224,255,0.2)",
              gap: 8,
            }}
          >
            <Activity size={24} />
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
              }}
            >
              NO ACTIVITY YET
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {events.map((evt, i) => {
              const color = getRiskColor(evt.score);
              return (
                <motion.div
                  key={evt.id}
                  data-ocid={`activity.item.${i + 1}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "6px 8px",
                    borderRadius: 4,
                    background:
                      evt.type === "self_destruct" ||
                      evt.type === "threshold_critical"
                        ? "rgba(255,0,64,0.06)"
                        : "rgba(0,212,255,0.02)",
                    borderLeft: `2px solid ${color}60`,
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: color,
                      marginTop: 4,
                      flexShrink: 0,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.65rem",
                        color: "rgba(224,224,255,0.75)",
                        margin: 0,
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                      }}
                    >
                      {evt.message}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.55rem",
                      color: "rgba(224,224,255,0.25)",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {timeAgo(evt.timestamp)}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
