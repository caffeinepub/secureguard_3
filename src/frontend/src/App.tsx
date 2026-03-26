import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { LoginForm } from "./components/LoginForm";
import { LoginScene } from "./components/LoginScene";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  NotificationProvider,
  useNotificationCtx,
} from "./contexts/NotificationContext";
import { RiskProvider } from "./contexts/RiskContext";

// Re-export Page type so legacy components (Sidebar) don't break
export type Page =
  | "dashboard"
  | "logs"
  | "alerts"
  | "backups"
  | "files"
  | "activity"
  | "access-control"
  | "notifications"
  | "admin"
  | "about";

function SentinelApp() {
  const { isAuthenticated } = useAuth();
  const [entered, setEntered] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated || !entered ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "fixed", inset: 0 }}
        >
          <LoginScene />
          <LoginForm onLoginSuccess={() => setEntered(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ minHeight: "100vh" }}
        >
          <Dashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RiskNotificationBridge() {
  const { addNotification } = useNotificationCtx();

  const handleNotification = (message: string, type: string) => {
    const notifType =
      type === "danger" ||
      type === "warning" ||
      type === "success" ||
      type === "info"
        ? (type as "danger" | "warning" | "success" | "info")
        : "info";
    addNotification(message, notifType);
    if (type === "danger") {
      toast.error(message, { duration: 4000 });
    } else if (type === "warning") {
      toast.warning(message, { duration: 3000 });
    } else if (type === "success") {
      toast.success(message, { duration: 3000 });
    } else {
      toast.info(message, { duration: 2500 });
    }
  };

  return (
    <RiskProvider onNotification={handleNotification}>
      <SentinelApp />
    </RiskProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RiskNotificationBridge />
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(5,5,30,0.95)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "#e0e0ff",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.72rem",
            },
          }}
        />
      </NotificationProvider>
    </AuthProvider>
  );
}
