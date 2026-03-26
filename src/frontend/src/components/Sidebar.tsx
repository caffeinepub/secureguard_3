import { cn } from "@/lib/utils";
import {
  Activity,
  Bell,
  FileText,
  FolderLock,
  HardDrive,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  ShieldAlert,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  unreadCount: number;
  activeAlertsCount: number;
  onLogout: () => void;
}

const NAV_ITEMS: {
  page: Page;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}[] = [
  {
    page: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  { page: "admin", label: "Admin Panel", icon: <Users size={16} /> },
  { page: "logs", label: "Logs", icon: <FileText size={16} /> },
  { page: "alerts", label: "Alerts", icon: <ShieldAlert size={16} /> },
  { page: "backups", label: "Backups", icon: <HardDrive size={16} /> },
  { page: "files", label: "File Vault", icon: <FolderLock size={16} /> },
  { page: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { page: "activity", label: "Activity", icon: <Activity size={16} /> },
  {
    page: "access-control",
    label: "Access Control",
    icon: <Shield size={16} />,
  },
];

export function Sidebar({
  activePage,
  onNavigate,
  unreadCount,
  activeAlertsCount,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      style={{
        width: 200,
        flexShrink: 0,
        background: "rgba(5,5,25,0.95)",
        borderRight: "1px solid rgba(0,212,255,0.1)",
        display: "flex",
        flexDirection: "column",
        padding: "16px 0",
        backdropFilter: "blur(20px)",
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px 16px",
          borderBottom: "1px solid rgba(0,212,255,0.08)",
          marginBottom: 8,
        }}
      >
        <Zap size={18} style={{ color: "#00d4ff" }} />
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.85rem",
            fontWeight: 900,
            letterSpacing: "0.2em",
            color: "#00d4ff",
            textShadow: "0 0 10px rgba(0,212,255,0.5)",
          }}
        >
          SENTINEL
        </span>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "4px 8px" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.page;
          const badge =
            item.page === "notifications" && unreadCount > 0
              ? unreadCount
              : item.page === "alerts" && activeAlertsCount > 0
                ? activeAlertsCount
                : null;
          return (
            <motion.button
              key={item.page}
              data-ocid={`nav.${item.page}.link`}
              type="button"
              onClick={() => onNavigate(item.page)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full text-left flex items-center gap-2 px-3 py-2 rounded-md mb-1 transition-all duration-150",
                isActive
                  ? "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent",
              )}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {badge && (
                <span
                  style={{
                    background: item.page === "alerts" ? "#ff0040" : "#7c3aed",
                    color: "white",
                    borderRadius: "50%",
                    minWidth: 16,
                    height: 16,
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3px",
                  }}
                >
                  {badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "8px" }}>
        <motion.button
          data-ocid="nav.settings.link"
          type="button"
          whileHover={{ x: 2 }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 6,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(224,224,255,0.25)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.05em",
            marginBottom: 4,
          }}
        >
          <Settings size={14} />
          Settings
        </motion.button>
        <motion.button
          data-ocid="nav.logout.button"
          type="button"
          onClick={onLogout}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 6,
            background: "transparent",
            border: "1px solid rgba(255,0,64,0.15)",
            cursor: "pointer",
            color: "rgba(255,0,64,0.5)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.05em",
          }}
        >
          <LogOut size={14} />
          Logout
        </motion.button>
      </div>
    </aside>
  );
}
