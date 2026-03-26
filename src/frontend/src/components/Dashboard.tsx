import {
  Cpu,
  Eye,
  MonitorDot,
  Radio,
  Shield,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AppStateProvider, useAppState } from "../context/AppStateContext";
import { useAuth } from "../contexts/AuthContext";
import { useRisk } from "../contexts/RiskContext";
import { useNotifications } from "../hooks/useNotifications";
import { useRiskScore } from "../hooks/useRiskScore";
import { AccessControl } from "../pages/AccessControl";
import { ActivityTracking } from "../pages/ActivityTracking";
import { Admin } from "../pages/Admin";
import { Alerts } from "../pages/Alerts";
import { Backups } from "../pages/Backups";
import { Files } from "../pages/Files";
import { Logs } from "../pages/Logs";
import { NotificationsPage } from "../pages/Notifications";
import { getRiskColor } from "../utils/riskCalculator";
import { ActivityLog } from "./ActivityLog";
import { NotificationBell } from "./NotificationBell";
import { RiskGauge } from "./RiskGauge";
import { SelfDestructButton } from "./SelfDestructButton";
import { Sidebar } from "./Sidebar";

type PurgeStage = "idle" | "countdown" | "purged";

function DashboardPage() {
  const { riskScore, riskLevel, threatsBlocked } = useRiskScore();
  const riskColor = getRiskColor(riskScore);

  return (
    <main
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        padding: "20px 24px",
        overflow: "auto",
        maxWidth: 1200,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Risk Gauge card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "rgba(5,5,30,0.7)",
            border: `1px solid ${riskColor}30`,
            borderRadius: 12,
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: `0 0 30px ${riskColor}08`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              alignSelf: "flex-start",
              width: "100%",
            }}
          >
            <Radio size={14} style={{ color: riskColor }} />
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "rgba(224,224,255,0.5)",
              }}
            >
              REAL-TIME RISK ASSESSMENT
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.55rem",
                color: "rgba(0,255,136,0.6)",
                background: "rgba(0,255,136,0.06)",
                border: "1px solid rgba(0,255,136,0.15)",
                borderRadius: 100,
                padding: "2px 8px",
              }}
            >
              LIVE
            </span>
          </div>
          <RiskGauge score={riskScore} />
        </motion.div>

        {/* Security metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
          }}
        >
          {[
            {
              icon: <Users size={16} style={{ color: "#00d4ff" }} />,
              label: "ACTIVE SESSIONS",
              value: "1",
              color: "#00d4ff",
            },
            {
              icon: <ShieldCheck size={16} style={{ color: "#00ff88" }} />,
              label: "THREATS BLOCKED",
              value: String(threatsBlocked),
              color: "#00ff88",
            },
            {
              icon: <Shield size={16} style={{ color: "#ffaa00" }} />,
              label: "LAST SCAN",
              value: "LIVE",
              color: "#ffaa00",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: "rgba(5,5,30,0.7)",
                border: `1px solid ${card.color}20`,
                borderRadius: 8,
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {card.icon}
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "1.4rem",
                  fontWeight: 900,
                  color: card.color,
                  margin: 0,
                  textShadow: `0 0 10px ${card.color}50`,
                }}
              >
                {card.value}
              </p>
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.55rem",
                  color: "rgba(224,224,255,0.35)",
                  margin: 0,
                  letterSpacing: "0.1em",
                }}
              >
                {card.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Activity log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ flex: 1, minHeight: 0, maxHeight: 360 }}
        >
          <ActivityLog />
        </motion.div>

        {/* Risk level info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            background: "rgba(5,5,30,0.7)",
            border: `1px solid ${riskColor}20`,
            borderRadius: 8,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: riskColor,
              boxShadow: `0 0 10px ${riskColor}`,
              animation: "pulse 2s infinite",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                color: riskColor,
                margin: 0,
                letterSpacing: "0.15em",
              }}
            >
              CURRENT THREAT LEVEL: {riskLevel.toUpperCase()}
            </p>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.58rem",
                color: "rgba(224,224,255,0.35)",
                margin: "3px 0 0",
              }}
            >
              Risk engine auto-increments every 15s — user interaction reduces
              score
            </p>
          </div>
        </motion.div>

        {/* Self-destruct */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          style={{
            background: "rgba(5,5,30,0.7)",
            border: "1px solid rgba(255,0,64,0.15)",
            borderRadius: 8,
            padding: "16px",
          }}
        >
          <SelfDestructButton />
        </motion.div>
      </div>
    </main>
  );
}

function AppShellInner() {
  const { logout } = useAuth();
  const { selfDestructTriggered, resetSelfDestruct, decreaseRisk } = useRisk();
  const { riskScore } = useRiskScore();
  const { unreadCount } = useNotifications();
  const { currentPage, setCurrentPage, alerts } = useAppState();
  const [purgeStage, setPurgeStage] = useState<PurgeStage>("idle");
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const riskColor = getRiskColor(riskScore);
  const isHighRisk = riskScore > 70;
  const activeAlertsCount = (alerts as Array<Record<string, unknown>>).filter(
    (a) => !a.acknowledged,
  ).length;

  // Handle self-destruct trigger
  useEffect(() => {
    if (selfDestructTriggered && purgeStage === "idle") {
      setPurgeStage("countdown");
      setCountdown(10);
      document.body.classList.add("sentinel-shake");
      setTimeout(() => document.body.classList.remove("sentinel-shake"), 800);
    }
  }, [selfDestructTriggered, purgeStage]);

  // Countdown timer
  useEffect(() => {
    if (purgeStage !== "countdown") return;
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current!);
          setTimeout(() => {
            localStorage.clear();
            setPurgeStage("purged");
          }, 200);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [purgeStage]);

  // After purged, redirect to login
  useEffect(() => {
    if (purgeStage === "purged") {
      const timer = setTimeout(() => {
        resetSelfDestruct();
        logout();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [purgeStage, resetSelfDestruct, logout]);

  // Decrease risk on mouse movement
  const throttleRef = useRef(false);
  const handleMouseMove = () => {
    if (throttleRef.current) return;
    throttleRef.current = true;
    decreaseRisk(2);
    setTimeout(() => {
      throttleRef.current = false;
    }, 5000);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "admin":
        return <Admin />;
      case "logs":
        return <Logs />;
      case "alerts":
        return <Alerts />;
      case "backups":
        return <Backups />;
      case "files":
        return <Files />;
      case "notifications":
        return <NotificationsPage />;
      case "activity":
        return <ActivityTracking />;
      case "access-control":
        return <AccessControl />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050510",
        color: "#e0e0ff",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* High risk vignette */}
      <AnimatePresence>
        {isHighRisk && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.04, 0.1, 0.04] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            style={{
              position: "fixed",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(255,0,64,0.15) 100%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Countdown overlay */}
      <AnimatePresence>
        {purgeStage === "countdown" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.92)",
              backdropFilter: "blur(8px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9998,
              gap: 24,
            }}
          >
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.4em",
                color: "rgba(255,0,64,0.8)",
              }}
            >
              SELF-DESTRUCT SEQUENCE INITIATED
            </p>
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10rem",
                fontWeight: 900,
                color: "#ff0040",
                textShadow:
                  "0 0 40px rgba(255,0,64,0.8), 0 0 80px rgba(255,0,64,0.4)",
                lineHeight: 1,
              }}
            >
              {countdown}
            </motion.div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "rgba(255,0,64,0.5)",
              }}
            >
              ALL DATA WILL BE PURGED
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purged screen */}
      <AnimatePresence>
        {purgeStage === "purged" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "#000",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              gap: 16,
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1, 0.5, 1] }}
              transition={{ duration: 0.4, repeat: 3 }}
            >
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "3rem",
                  fontWeight: 900,
                  letterSpacing: "0.3em",
                  color: "#ff0040",
                  textShadow:
                    "0 0 40px rgba(255,0,64,0.9), 0 0 80px rgba(255,0,64,0.5)",
                  textAlign: "center",
                }}
              >
                SYSTEM PURGED
              </p>
            </motion.div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "rgba(255,0,64,0.5)",
              }}
            >
              ALL DATA DESTROYED — REDIRECTING...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout: Sidebar + Content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Sidebar
          activePage={currentPage}
          onNavigate={setCurrentPage}
          unreadCount={unreadCount}
          activeAlertsCount={activeAlertsCount}
          onLogout={logout}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top header bar */}
          <header
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 1.5rem",
              height: 52,
              borderBottom: "1px solid rgba(0,212,255,0.08)",
              background: "rgba(5,5,30,0.9)",
              backdropFilter: "blur(16px)",
              flexShrink: 0,
              gap: 16,
            }}
          >
            {/* Page title */}
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.25em",
                color: "rgba(0,212,255,0.6)",
                flex: 1,
              }}
            >
              {currentPage.toUpperCase().replace("-", " ")}
            </span>

            {/* Status pills */}
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { icon: <Eye size={9} />, label: "THREAT DETECTION" },
                {
                  icon: <MonitorDot size={9} />,
                  label: "BEHAVIORAL MONITORING",
                },
                { icon: <Cpu size={9} />, label: "RISK ENGINE" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "rgba(0,255,136,0.06)",
                    border: "1px solid rgba(0,255,136,0.15)",
                    borderRadius: 100,
                    padding: "2px 8px",
                    fontSize: "0.55rem",
                    fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.08em",
                    color: "rgba(0,255,136,0.7)",
                  }}
                >
                  {s.icon}
                  {s.label}: ACTIVE
                </div>
              ))}
            </div>

            {/* Risk badge + notification bell */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: `${riskColor}15`,
                border: `1px solid ${riskColor}40`,
                borderRadius: 100,
                padding: "3px 10px",
                fontSize: "0.6rem",
                fontFamily: "JetBrains Mono, monospace",
                color: riskColor,
              }}
            >
              <Zap size={10} />
              RISK: {Math.round(riskScore)}
            </div>
            <NotificationBell />
          </header>

          {/* Main page content */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{ minHeight: "100%" }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer
            style={{
              borderTop: "1px solid rgba(0,212,255,0.05)",
              padding: "8px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.55rem",
                color: "rgba(224,224,255,0.15)",
                letterSpacing: "0.1em",
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} — Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(0,212,255,0.3)", textDecoration: "none" }}
              >
                caffeine.ai
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <AppStateProvider>
      <AppShellInner />
    </AppStateProvider>
  );
}
