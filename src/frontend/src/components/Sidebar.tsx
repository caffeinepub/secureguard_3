import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Activity,
  Bell,
  BellRing,
  FileText,
  FolderLock,
  HardDrive,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Settings,
  Shield,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import { UserRole } from "../backend";
import { useCallerRole } from "../hooks/useQueries";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  unreadCount: number;
  activeAlertsCount: number;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  fileCount?: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

type IconComponent = React.ComponentType<{ className?: string }>;

const NAV_ITEMS: { id: Page; label: string; icon: IconComponent }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "logs", label: "Logs", icon: FileText },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "backups", label: "Backups", icon: HardDrive },
  { id: "files", label: "File Vault", icon: FolderLock },
  { id: "activity", label: "Activity Tracking", icon: Activity },
  { id: "access-control", label: "Access Control", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "admin", label: "Admin", icon: Settings },
  { id: "about", label: "About", icon: Info },
];

export function Sidebar({
  activePage,
  onNavigate,
  unreadCount,
  activeAlertsCount,
  isAuthenticated,
  onLogin,
  onLogout,
  isLoggingIn,
  fileCount = 0,
  darkMode = true,
  onToggleDarkMode,
}: SidebarProps) {
  const { data: role } = useCallerRole();

  const roleBadge =
    role === UserRole.admin
      ? {
          label: "ADMIN",
          color: "bg-success/20 text-success border-success/30",
        }
      : role === UserRole.user
        ? {
            label: "USER",
            color: "bg-primary/20 text-primary border-primary/30",
          }
        : {
            label: "GUEST",
            color: "bg-muted/40 text-muted-foreground border-border",
          };

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-sidebar border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20 border border-primary/30">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-foreground tracking-wider">
            SECUREGUARD
          </div>
          <div className="text-[10px] text-muted-foreground tracking-widest">
            THREAT MONITORING
          </div>
        </div>
        {onToggleDarkMode && (
          <motion.button
            type="button"
            data-ocid="nav.darkmode.toggle"
            onClick={onToggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all flex-shrink-0"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </motion.button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const badge =
            item.id === "notifications" && unreadCount > 0
              ? unreadCount
              : item.id === "alerts" && activeAlertsCount > 0
                ? activeAlertsCount
                : item.id === "files" && fileCount > 0
                  ? fileCount
                  : null;
          return (
            <motion.button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => onNavigate(item.id)}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/15 text-foreground border border-primary/25"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "")} />
              <span className="flex-1 text-left text-xs">{item.label}</span>
              {badge !== null && (
                <Badge className="h-4 px-1.5 text-[10px] bg-destructive text-destructive-foreground">
                  {badge}
                </Badge>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User block */}
      <div className="px-3 pb-4 border-t border-sidebar-border pt-4 space-y-2">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent/50">
              <div className="w-7 h-7 rounded-full bg-primary/30 border border-primary/40 flex items-center justify-center">
                <span className="text-[10px] text-primary font-bold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-foreground font-medium block">
                  Welcome
                </span>
                <Badge
                  className={`text-[9px] px-1 h-3.5 border ${roleBadge.color}`}
                >
                  {roleBadge.label}
                </Badge>
              </div>
            </div>
            <motion.button
              type="button"
              data-ocid="nav.logout.button"
              onClick={onLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </motion.button>
          </>
        ) : (
          <motion.button
            type="button"
            data-ocid="nav.login.button"
            onClick={onLogin}
            disabled={isLoggingIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-xs bg-primary/20 text-primary hover:bg-primary/30 transition-all font-medium"
          >
            <LogIn className="w-3.5 h-3.5" />
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </motion.button>
        )}
      </div>
    </aside>
  );
}
