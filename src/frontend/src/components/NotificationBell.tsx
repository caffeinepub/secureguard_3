import {
  AlertOctagon,
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { AppNotification } from "../contexts/NotificationContext";
import { useNotifications } from "../hooks/useNotifications";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

function notifIcon(type: AppNotification["type"]) {
  switch (type) {
    case "danger":
      return (
        <AlertOctagon size={12} style={{ color: "#ff0040", flexShrink: 0 }} />
      );
    case "warning":
      return (
        <AlertTriangle size={12} style={{ color: "#ffaa00", flexShrink: 0 }} />
      );
    case "success":
      return (
        <CheckCircle size={12} style={{ color: "#00ff88", flexShrink: 0 }} />
      );
    default:
      return <Info size={12} style={{ color: "#00d4ff", flexShrink: 0 }} />;
  }
}

function notifBg(type: AppNotification["type"]) {
  switch (type) {
    case "danger":
      return "rgba(255,0,64,0.06)";
    case "warning":
      return "rgba(255,170,0,0.06)";
    case "success":
      return "rgba(0,255,136,0.06)";
    default:
      return "rgba(0,212,255,0.04)";
  }
}

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const [bellBounce, setBellBounce] = useState(false);
  const prevCountRef = useRef(unreadCount);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setBellBounce(true);
      setTimeout(() => setBellBounce(false), 600);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "n" || e.key === "N") setOpen((o) => !o);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div style={{ position: "relative" }} ref={panelRef}>
      <motion.button
        data-ocid="notifications.open_modal_button"
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) {
            for (const n of notifications.filter((n) => !n.read)) {
              markRead(n.id);
            }
          }
        }}
        animate={
          bellBounce ? { rotate: [0, -15, 15, -10, 10, 0] } : { rotate: 0 }
        }
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          background: open ? "rgba(0,212,255,0.1)" : "transparent",
          border: "1px solid",
          borderColor: open ? "rgba(0,212,255,0.4)" : "rgba(0,212,255,0.15)",
          borderRadius: 8,
          padding: "6px 8px",
          cursor: "pointer",
          color: "rgba(0,212,255,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#ff0040",
              color: "white",
              borderRadius: "50%",
              width: 16,
              height: 16,
              fontSize: "0.6rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "JetBrains Mono, monospace",
              boxShadow: "0 0 8px rgba(255,0,64,0.6)",
            }}
          >
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="notifications.popover"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: 320,
              background: "rgba(5, 5, 30, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: 10,
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,212,255,0.05)",
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                borderBottom: "1px solid rgba(0,212,255,0.08)",
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "rgba(0,212,255,0.7)",
                  flex: 1,
                }}
              >
                NOTIFICATIONS
              </span>
              <button
                data-ocid="notifications.close_button"
                type="button"
                onClick={markAllRead}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(0,212,255,0.5)",
                  padding: 4,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: "0.6rem",
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.1em",
                }}
              >
                <CheckCheck size={12} />
                ALL READ
              </button>
              <button
                data-ocid="notifications.delete_button"
                type="button"
                onClick={clearAll}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,0,64,0.5)",
                  padding: 4,
                  marginLeft: 4,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={12} />
              </button>
            </div>

            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div
                  data-ocid="notifications.empty_state"
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "rgba(224,224,255,0.2)",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  NO ALERTS
                </div>
              ) : (
                notifications.map((n, i) => (
                  <div
                    key={n.id}
                    data-ocid={`notifications.item.${i + 1}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "8px 14px",
                      background: n.read ? "transparent" : notifBg(n.type),
                      borderBottom: "1px solid rgba(0,212,255,0.04)",
                      opacity: n.read ? 0.5 : 1,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <div style={{ marginTop: 2 }}>{notifIcon(n.type)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.62rem",
                          color: "rgba(224,224,255,0.8)",
                          lineHeight: 1.4,
                        }}
                      >
                        {n.message}
                      </p>
                      <span
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontSize: "0.55rem",
                          color: "rgba(224,224,255,0.25)",
                        }}
                      >
                        {timeAgo(n.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
